import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    bio: "",
    birth_date: "",
  });
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users/all_users/",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
    setFormData({
      username: "",
      email: "",
      password: "",
      password2: "",
      bio: "",
      birth_date: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/users/", formData);
      handleClose();
      fetchUsers();
    } catch (error) {
      handleClose();
      fetchUsers();
      setError(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            name="username"
            label="Username"
            fullWidth
            margin="dense"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            name="password2"
            label="Confirm Password"
            type="password"
            fullWidth
            margin="dense"
            value={formData.password2}
            onChange={handleChange}
          />
          <TextField
            name="bio"
            label="Bio"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
          />
          <TextField
            name="birth_date"
            label="Birth Date"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={formData.birth_date}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
