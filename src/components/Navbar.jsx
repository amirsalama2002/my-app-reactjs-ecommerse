import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    navigate("/login");
  };

  const menuLinks = token ? (
    <>
      <MenuItem component={Link} to="/products" onClick={handleMenuClose}>
        Products
      </MenuItem>
      <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
        Cart
      </MenuItem>
      <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
        My Orders
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
        Logout
      </MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
        Login
      </MenuItem>
      <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
        Register
      </MenuItem>
    </>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white" }}>
            MyShop
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuLinks}
            </Menu>
          </>
        ) : (
          <Box>
            {token ? (
              <>
              <Button color="inherit" component={Link} to="/products/create">
  Add Product
</Button>
                <Button color="inherit" component={Link} to="/products">
                  Products
                </Button>
                <Button color="inherit" component={Link} to="/cart">
                  Cart
                </Button>
                <Button color="inherit" component={Link} to="/orders">
                  My Orders
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
