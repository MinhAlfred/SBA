import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Form, Spinner, Card, Badge } from 'react-bootstrap';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';
import { useOrchid } from '../../queries/useOrchid';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function DetailOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orchidById, isLoading: loading } = useOrchid(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const orchid = orchidById?.data || null;

  const handleAddToCart = () => {
    if (orchid && quantity > 0) {
      addToCart(orchid, quantity);
      toast.success(`${orchid.name} added to cart!`);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

 

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="spinner-grow text-primary me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-indigo-500 me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!orchid) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Orchid not found</h2>
          <Button 
            variant="primary" 
            onClick={() => navigate(ROUTES.HOME)}
            className="mt-3"
          >
            Back to Home
          </Button>
        </div>
      </Container>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <Container className="py-5">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Row className="mb-4">
          <Col>
            <Link to={ROUTES.HOME} className="text-decoration-none">
              <Button variant="link" className="px-0 text-muted">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Orchids
              </Button>
            </Link>
          </Col>
        </Row>

        <Row className="g-5">
          <Col lg={6}>
            <Card className="border-0 shadow-sm overflow-hidden rounded-3 bg-light">
              <div className="position-relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image 
                    src={orchid.url} 
                    alt={orchid.name} 
                    fluid 
                    className="w-100" 
                    style={{ height: '450px', objectFit: 'cover' }} 
                  />
                </motion.div>
                {orchid.isNatural && (
                  <Badge 
                    bg="success" 
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fs-6"
                  >
                    Natural
                  </Badge>
                )}
              </div>
            </Card>
          </Col>

          <Col lg={6}>
            <div className="h-100 d-flex flex-column">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="display-5 fw-bold mb-3">{orchid.name}</h1>
                <div className="d-flex align-items-center mb-4">
                  <h3 className="text-primary fw-bold mb-0">${orchid.price}</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4"
              >
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <Row className="g-3">
                      <Col sm={6}>
                        <p className="mb-1 text-muted small">CATEGORY</p>
                        <p className="fw-semibold">{orchid.categoryId?.name}</p>
                      </Col>
                      <Col sm={6}>
                        <p className="mb-1 text-muted small">ORIGIN</p>
                        {/* <p className="fw-semibold">{orchid.origin}</p> */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <h5 className="fw-bold mb-3">Description</h5>
                <p className="mb-4 lh-lg">{orchid.description}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-auto"
              >
                <h5 className="fw-bold mb-3">Add to Your Collection</h5>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="d-flex align-items-center">
                    <Form.Label className="me-2 mb-0 fw-semibold">Quantity:</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="rounded-pill text-center"
                      style={{ width: '80px' }}
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleAddToCart}
                    className="rounded-pill px-4 py-2 fw-semibold d-flex align-items-center"
                    size="lg"
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </Button>
                </div>
                
                
              </motion.div>
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}