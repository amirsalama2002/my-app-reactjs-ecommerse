import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

const categories = ["T-shirt", "Jeans", "Shirts", "Casual"];

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ min: 0, max: 250, categories: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [message, setMessage] = useState("");

  const handleFilterChange = (type, value) => {
    if (type === "price") {
      setFilters({ ...filters, min: value[0], max: value[1] });
    } else if (type === "category") {
      const newCategories = filters.categories.includes(value)
        ? filters.categories.filter((c) => c !== value)
        : [...filters.categories, value];
      setFilters({ ...filters, categories: newCategories });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products?name=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data || []);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const filteredProducts = products.filter((p) => {
    return (
      p.price >= filters.min &&
      p.price <= filters.max &&
      (filters.categories.length === 0 || filters.categories.includes(p.category))
    );
  });

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const exists = updatedCart.find((item) => item.id === product.id);
    if (exists) {
      exists.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("✅ Product added to cart.");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        setMessage(data.error || "Order failed.");
      }
    } catch (err) {
      setMessage("Network error during checkout.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Filters</Typography>

          <Typography variant="subtitle2" mt={2}>Price</Typography>
          <Slider
            value={[filters.min, filters.max]}
            onChange={(_, val) => handleFilterChange("price", val)}
            min={0}
            max={300}
            valueLabelDisplay="auto"
          />

          <Typography variant="subtitle2" mt={2}>Category</Typography>
          {categories.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={filters.categories.includes(cat)}
                  onChange={() => handleFilterChange("category", cat)}
                />
              }
              label={cat}
            />
          ))}

          <Divider sx={{ my: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setFilters({ min: 0, max: 250, categories: [] })}
          >
            Clear Filters
          </Button>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Products</Typography>
            <TextField
              label="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {loading && <CircularProgress sx={{ mt: 4 }} />}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2} mt={2}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} key={product.id}>
                <Card>
                  {product.image && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      alt={product.name}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">Name : {product.name}</Typography>
                    <Typography variant="h6">Description: {product.description}</Typography>
                    <Typography>Price: ${product.price}</Typography>
                    <Typography>Stock: {product.stock}</Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Cart Summary */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Order Summary</Typography>
          <Divider sx={{ my: 1 }} />
          {cart.length === 0 ? (
            <Typography>No items in cart.</Typography>
          ) : (
            <List>
              {cart.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.name} × ${item.quantity}`}
                    secondary={`$${item.price * item.quantity}`}
                  />
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText primary="Total" secondary={`$${total.toFixed(2)}`} />
              </ListItem>
              <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </List>
          )}
          {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
        </Grid>
      </Grid>
    </Container>
  );
}