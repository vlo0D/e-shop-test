import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/items">
          E-Shop
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/items">
              Catalog
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart{' '}
              {itemCount > 0 && (
                <Badge bg="success">{itemCount}</Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/orders">
              My Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/users">
                  Manage Users
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/items">
                  Manage Items
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">
              {user?.first_name} {user?.last_name}{' '}
              <Badge bg={user?.role === 'admin' ? 'danger' : 'primary'}>
                {user?.role}
              </Badge>
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
