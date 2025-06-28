import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Orders
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {orders.map((order) => (
          <ListItem
            key={order.order_id}
            secondaryAction={
              <Button
                component={Link}
                to={`/orders/${order.order_id}`}
                variant="outlined"
              >
                View
              </Button>
            }
          >
            <ListItemText
              primary={`Order #${order.order_id}`}
              secondary={`Total: $${order.total_price}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
