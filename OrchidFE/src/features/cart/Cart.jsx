import { useState } from 'react';
import { Container, Row, Col, Table, Button, Card, Form, Alert, Badge } from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCreateOrder } from '../../queries/useOrder';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, parseInt(newQuantity));
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    
    try {
      // Format cart items according to the required JSON structure
      const orderData = {
        orderDetails: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };
      
      console.log('Creating order with data:', orderData);
      
      await createOrderMutation.mutateAsync(orderData);
      
      // Clear cart after successful order
      clearCart();
      setCheckoutSuccess('Order placed successfully!');
      
      setTimeout(() => {
        navigate(ROUTES.ORDER_MANAGEMENT);
      }, 3000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('There was an error processing your order. Please try again.');
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <Container className="py-5">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Your Shopping Cart</h1>
          <Badge bg="primary" pill className="px-3 py-2 fs-6">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</Badge>
        </div>
        
        {checkoutError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="danger" className="mb-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {checkoutError}
            </Alert>
          </motion.div>
        )}
        
        {checkoutSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="success" className="mb-4 shadow-sm">
              <i className="bi bi-check-circle-fill me-2"></i>
              {checkoutSuccess}
            </Alert>
          </motion.div>
        )}
      
        {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-5"
          style={{ minHeight: '70vh' }}
        >
          <div className="mb-4 p-4 bg-light rounded-circle">
            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          </div>
          <h3 className="display-6 fw-bold mb-3">Your cart is empty</h3>
          <p className="lead text-muted mb-4">Add some items to your cart to see them here.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="primary" 
              onClick={() => navigate(ROUTES.HOME)}
              className="rounded-pill px-4 py-2 fw-semibold mt-3"
            >
              <i className="bi bi-shop me-2"></i>
              Continue Shopping
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm overflow-hidden rounded-3">
              <Card.Body className="p-0">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                  <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4">Product</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Quantity</th>
                        <th className="py-3">Total</th>
                        <th className="py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <motion.tr key={item.id} variants={itemVariant}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center py-2">
                              <div className="rounded overflow-hidden" style={{ width: '70px', height: '70px' }}>
                                <img 
                                  src={item.url} 
                                  alt={item.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  className="transition-transform hover:scale-110 duration-300"
                                />
                              </div>
                              <div className="ms-3">
                                <h6 className="fw-semibold mb-1">{item.name}</h6>
                                <small className="text-muted">{item.categoryId?.name}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted">{formatPrice(item.price)}</td>
                          <td>
                            <div className="d-flex align-items-center border rounded-pill overflow-hidden" style={{ width: '120px' }}>
                              <Button 
                                variant="light" 
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                className="border-0 rounded-0"
                              >
                                <i className="bi bi-dash"></i>
                              </Button>
                              <Form.Control
                                type="text"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="border-0 text-center py-2"
                                style={{ width: '50px' ,
                                }}
                              />
                              <Button 
                                variant="light" 
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="border-0 rounded-0"
                              >
                                <i className="bi bi-plus"></i>
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold text-primary">{formatPrice(item.price * item.quantity)}</td>
                          <td className="text-center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="rounded-circle"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </motion.div>
              </Card.Body>
              <Card.Footer className="bg-white py-3 px-4 border-0">
                <div className="d-flex flex-wrap justify-content-between gap-3">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate(ROUTES.HOME)}
                      className="rounded-pill px-3 py-2"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Continue Shopping
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="outline-danger" 
                      onClick={handleClearCart}
                      className="rounded-pill px-3 py-2"
                    >
                      <i className="bi bi-cart-x me-2"></i>
                      Clear Cart
                    </Button>
                  </motion.div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={4}>
            <motion.div variants={itemVariant}>
              <Card className="border-0 shadow-sm rounded-3 sticky-top" style={{ top: '20px' }}>
                <Card.Header className="bg-primary text-white py-3 px-4 border-0">
                  <h5 className="mb-0 fw-bold">Order Summary</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal:</span>
                    <span className="fw-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Shipping:</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-5">Total:</span>
                    <span className="fw-bold fs-5 text-primary">{formatPrice(subtotal + shipping)}</span>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="primary" 
                      className="w-100 py-3 rounded-pill fw-semibold"
                      onClick={handleCheckout}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2"></i>
                          Create an order
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <div className="d-flex justify-content-center mt-4">
                    <div className="d-flex align-items-center text-muted small">
                      <i className="bi bi-shield-lock me-2 fs-5"></i>
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      )}
      </motion.div>
    </Container>
  );
}