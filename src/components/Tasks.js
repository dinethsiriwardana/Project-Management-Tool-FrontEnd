import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  IconButton,
  Checkbox,
  ListItemText,
  ListItem,
  List,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Delete } from "@mui/icons-material";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    status: "pending",
    project: [], // Store selected users here
  });
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users/all_users/"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const updateTaskStatus = async (taskId, updatedData) => {
    try {
      const url = `http://127.0.0.1:8000/api/todo/${taskId}/todo_update/`;
      const params = new URLSearchParams(updatedData).toString();
      console.log(`${url}?${params}`);
      await axios.put(`${url}?${params}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectString = JSON.stringify(newTask.project); // Convert selected users array to a string
      const taskData = {
        ...newTask,
        project: projectString, // Assign formatted project data
      };

      if (editingTask) {
        const updatedData = {
          status: newTask.status, // Set the status as well if needed
          name: newTask.name,
          project: taskData.project,
          description: newTask.description,
        };
        await updateTaskStatus(editingTask._id, updatedData); // Call to updateTaskStatus
        setEditingTask(null);
      } else {
        await axios.post("http://127.0.0.1:8000/api/todo/", taskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      fetchTasks();
      setNewTask({ name: "", description: "", status: "pending", project: [] });
    } catch (error) {
      console.error("Failed to create or update task:", error);
    }
  };

  const handleEdit = (task) => {
    setNewTask({
      name: task.name,
      description: task.description,
      status: task.status,
      project: task.project ? JSON.parse(task.project) : [],
    });
    setEditingTask(task);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todo/${taskId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUserSelection = (event) => {
    const value = event.target.value;
    setNewTask((prevTask) => ({
      ...prevTask,
      project: typeof value === "string" ? value.split(",") : value,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                multiple
                value={newTask.project}
                onChange={handleUserSelection}
                fullWidth
                label="Assign Users"
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {users.map((user) => (
                  <MenuItem key={user.email} value={user.username}>
                    <Checkbox
                      checked={newTask.project.indexOf(user.username) > -1}
                    />
                    <ListItemText primary={user.username} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Grid container spacing={4}>
        {["pending", "in_progress", "complete"].map((status) => {
          const filteredTasks = tasks.filter((task) => task.status === status);

          if (filteredTasks.length === 0) return null;

          return (
            <Grid item xs={12} sm={4} key={status}>
              {" "}
              {/* Create a column for each status */}
              <div>
                <Typography variant="h5">
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </Typography>
                <Grid container spacing={2}>
                  {filteredTasks.map((task) => (
                    <Grid item xs={12} key={task._id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{task.name}</Typography>
                          <Typography color="textSecondary">
                            {task.description}
                          </Typography>
                          <Typography color="textSecondary">
                            {Array.isArray(JSON.parse(task.project)) &&
                              JSON.parse(task.project).join(", ")}
                          </Typography>

                          <Select
                            value={task.status}
                            onChange={(e) => {
                              const updatedData = {
                                status: e.target.value,
                                name: task.name,
                                project: task.project,
                                description: task.description,
                              };
                              updateTaskStatus(task._id, updatedData);
                            }}
                            fullWidth
                            variant="outlined"
                            size="small"
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Complete</MenuItem>
                          </Select>
                        </CardContent>
                        <CardActions>
                          <IconButton
                            onClick={() => handleEdit(task)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(task._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
