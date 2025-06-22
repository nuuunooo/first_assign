import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, List, ListItem, TextField, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUser) {
      setUser(storedUser);
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      }
      fetchItems();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        alert("You are not authorized. Please log in again.");
        navigate("/login");
        return;
      }

      console.log("Token retrieved from localStorage:", token); // Log the token for debugging

      const response = await fetch("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching items:", errorData);
        throw new Error(errorData.message || "Failed to fetch items");
      }

      const data = await response.json();
      console.log("Fetched items:", data); // Log the fetched items
      setItems(Array.isArray(data) ? data : []); // Ensure items is always an array
    } catch (error) {
      console.error("Error fetching items:", error);
      alert(error.message);
      setItems([]); // Reset items to an empty array on error
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) {
      alert("Item name cannot be empty");
      return;
    }
    
    if (!userId) {
      alert("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newItem, user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item");
      }

      setNewItem("");
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error adding item:", error);
      alert(error.message);
    }
  };

  const updateItem = async () => {
    if (!newItem.trim() || !editItemId) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/items/${editItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newItem }),
      });
      setNewItem("");
      setEditItemId(null);
      fetchItems(); // Refresh list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user}
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ textTransform: "none", fontWeight: "bold", bgcolor: "#9c27b0" }}
          onClick={() => { localStorage.clear(); navigate("/login"); }}
        >
          Logout
        </Button>
      </Box>

      <Box display="flex" gap={2} justifyContent="center" alignItems="center" mb={3}>
        <TextField
          fullWidth
          label="Enter item name"
          variant="outlined"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ textTransform: "none", fontWeight: "bold" }}
          onClick={editItemId ? updateItem : addItem}
        >
          {editItemId ? "Update" : "Add"}
        </Button>
      </Box>

      <List sx={{ textAlign: "left" }}>
        {items.map((item) => (
          <ListItem 
            key={item.id} 
            sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#f5f5f5", mb: 1, borderRadius: 2, p: 1 }}
          >
            {item.name}
            <Box>
              <IconButton onClick={() => { setNewItem(item.name); setEditItemId(item.id); }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Dashboard;
