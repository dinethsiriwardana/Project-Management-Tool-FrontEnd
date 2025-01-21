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
    description: "a",
    project: "a",
    status: "pending",
    assigned_users: [],
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/", {
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
      await axios.post("http://127.0.0.1:8000/api/todo/", newTask, {
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
      setNewTask({
        name: "",
        description: "",
        project: "",
        status: "pending",
        assigned_users: [],
      });
    } catch (error) {
      console.error("Failed to create task:", error);
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
              <Button variant="contained" type="submit" fullWidth>
                Add Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.name}</Typography>
                <Typography color="textSecondary">
                  {task.description}
                </Typography>
                <Typography>Status: {task.status}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
