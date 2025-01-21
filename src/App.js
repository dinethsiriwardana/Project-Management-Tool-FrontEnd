import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import Users from "./components/Users";
import Navigation from "./components/Navigation";

const theme = createTheme();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {isAuthenticated && <Navigation />}
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/tasks" />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/tasks"
              element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />}
            />
            <Route
              path="/users"
              element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
