import { Container, Col, Row, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAvailableOrchids } from '../../queries/useOrchid';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';

export default function HomeScreen() {
  const { data: availableOrchids, isLoading: loading } = useAvailableOrchids();
  const orchids = availableOrchids?.data || [];

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="display-4 fw-bold text-primary mb-2"
        >
          Explore Our Orchids
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lead text-muted"
        >
          Discover our beautiful collection of rare and exotic orchids
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Row className='g-4'>
          {orchids.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <motion.div variants={item}>
                <Card className="h-100 border-0 shadow-sm overflow-hidden">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={item.url} 
                      alt={item.name} 
                      style={{ 
                        width: '100%',
                        height: '280px', 
                        objectFit: 'cover' 
                      }}
                      className="transition-transform hover:scale-105 duration-500"
                    />
                    {item.isNatural && (
                      <Badge 
                        bg="success" 
                        className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
                      >
                        Natural
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="h5 fw-bold mb-3">{item.name}</Card.Title>
                    {item.price && (
                      <p className="text-primary fw-bold mb-3">
                        ${item.price.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-auto pt-3">
                      <Link to={`${ROUTES.ORCHID_DETAIL}/${item.id}`} className="text-decoration-none">
                        <Button 
                          variant="outline-primary" 
                          className="w-100 rounded-pill py-2 d-flex align-items-center justify-content-center"
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
}