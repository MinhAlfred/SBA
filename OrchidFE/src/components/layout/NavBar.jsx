import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../constants';

function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>Home</Navbar.Brand>
        <Navbar.Brand as={Link} to={ROUTES.ORDER_MANAGEMENT} className='ml-6'><i className="bi bi-bag-check me-1"></i> My Orders</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAdmin() && (
              <>
                <Nav.Link as={Link} to={ROUTES.CATEGORY_MANAGEMENT}>Category Management</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.USER_MANAGEMENT}>User Management</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.ORCHID_LIST}>Orchids</Nav.Link>
              </>
            )}
          </Nav>          
          <Nav>
            {user && (
              <>
               
                <Nav.Link as={Link} to={ROUTES.CART} className="d-flex align-items-center me-3">
                  <div className="position-relative">
                    <i className="bi bi-cart3 fs-5"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {items > 0 ? items : 0}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  </div>
                </Nav.Link>
              </>
            )}
            
            {user ? (
              <NavDropdown title={`Hello, ${user.name}`} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item disabled>Username: {user.email}</NavDropdown.Item>
                <NavDropdown.Item disabled>Name: {user.name}</NavDropdown.Item>
                <NavDropdown.Item disabled>Role: {user.roleName}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (              
              <>
                <Nav.Link as={Link} to={ROUTES.LOGIN}>Login</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.REGISTER}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;