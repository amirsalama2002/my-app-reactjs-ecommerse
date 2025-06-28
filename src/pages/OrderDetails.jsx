import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from "@mui/material";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || "Failed to fetch order.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!order) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Order #{order.order_id}
      </Typography>
      <Typography variant="h6">Total: ${order.total_price}</Typography>

      <Box mt={3}>
        <Typography variant="subtitle1">Items</Typography>
        <Divider sx={{ my: 1 }} />
        <List>
          {order.items.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${item.name} × ${item.quantity}`}
                secondary={`Price: $${item.price} | Subtotal: $${item.subtotal}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
