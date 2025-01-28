import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.username} />
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}