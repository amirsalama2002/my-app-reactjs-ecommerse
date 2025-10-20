import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from "@mui/material";

export default function ProductCreate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Product created successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          stock: "",
          image: null,
        });
      } else {
        setMessage(data.message || "Failed to create product.");
      }
    } catch (error) {
      setMessage("Network error.");
    }
  };
  const token = localStorage.getItem("token");
console.log(token);
// falcon

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          name="name"
          label="Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={form.price}
          onChange={handleChange}
          required
        />
        <TextField
          name="stock"
          label="Stock"
          type="number"
          fullWidth
          margin="normal"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <TextField
          type="file"
          name="image"
          fullWidth
          margin="normal"
          onChange={handleChange}
          inputProps={{ accept: "image/*" }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Create Product
        </Button>
      </Box>
    </Container>
  );
}
