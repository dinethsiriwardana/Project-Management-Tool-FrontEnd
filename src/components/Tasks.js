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
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    status: "Creating",
  });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.patch(`http://127.0.0.1:8000/api/todo/${editingTask._id}/`, newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEditingTask(null);
      } else {
        await axios.post("http://127.0.0.1:8000/api/todo/", newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchTasks();
      setNewTask({ name: "", description: "", status: "Creating" });
    } catch (error) {
      console.error("Failed to create or update task:", error);
    }
  };

  const handleEdit = (task) => {
    setNewTask({ name: task.name, description: task.description, status: task.status });
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
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {["Creating", "In Progress", "Complete"].map((status) => (
        <div key={status}>
          <Typography variant="h5">{status}</Typography>
          <Grid container spacing={2}>
            {tasks.filter(task => task.status === status).map((task) => (
              <Grid item xs={12} md={6} key={task._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{task.name}</Typography>
                    <Typography color="textSecondary">{task.description}</Typography>
                    <Typography>Status: {task.status}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEdit(task)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(task._id )}>
                      Delete
                    </Button>
                    {status === "Creating" && (
                      <Button size="small" onClick={() => updateTaskStatus(task._id, "In Progress")}>
                        Start
                      </Button>
                    )}
                    {status === "In Progress" && (
                      <Button size="small" onClick={() => updateTaskStatus(task._id, "Complete")}>
                        Complete
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
}