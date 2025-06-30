import { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useUserOrders, useUpdateOrder, useCompleteOrder,useDeleteOrder } from '../../queries/useOrder';
import { useAvailableOrchids } from '../../queries/useOrchid';
import { formatPrice } from '../../utils/formatters';
import { motion } from 'framer-motion';

export default function UserOrders() {
  const { data: ordersData, isLoading, error } = useUserOrders();
  const updateOrderMutation = useUpdateOrder();
  const completeOrderMutation = useCompleteOrder();
  const deleteOrderMutation = useDeleteOrder();
  const { data: availableOrchidsData } = useAvailableOrchids();

  const orders = ordersData?.data || [];
  const availableOrchids = availableOrchidsData?.data || [];
  console.log("data: ", orders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [showAddOrchidModal, setShowAddOrchidModal] = useState(false);
  const [selectedNewOrchid, setSelectedNewOrchid] = useState(null);
  const [newOrchidQuantity, setNewOrchidQuantity] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [orderToAction, setOrderToAction] = useState(null);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleShowDetailsModal = (order) => {
    setSelectedOrder(order);
    setSelectedOrderDetails([...order.orderDetails]);
    setShowDetailsModal(true);
  };

  const handleQuantityChange = (detailIndex, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedDetails = [...selectedOrderDetails];
    updatedDetails[detailIndex].quantity = newQuantity;
    setSelectedOrderDetails(updatedDetails);
  };

  const handleDeleteDetail = (detailIndex) => {
    if (selectedOrderDetails.length === 1) {
      return;
    }
    const updatedDetails = selectedOrderDetails.filter((_, index) => index !== detailIndex);
    setSelectedOrderDetails(updatedDetails);
  };

  const handleSaveDetailsChanges = async () => {
    if (!selectedOrder || selectedOrderDetails.length === 0) return;
    
    try {
      await updateOrderMutation.mutateAsync({
        id: selectedOrder.id,
        data: {
          orderDetails: selectedOrderDetails.map(item => ({
            productId: item.orchidId,
            quantity: item.quantity
          }))
        }
      });
      setShowDetailsModal(false);
      setSelectedOrder(null);
      setSelectedOrderDetails([]);
    } catch (error) {
      console.error('Update details failed:', error);
    }
  };

  const handleAddNewOrchid = () => {
    setShowAddOrchidModal(true);
  };

  const handleConfirmAddOrchid = () => {
    if (!selectedNewOrchid) return;
    
    // Check if the orchid already exists in the order
    const existingDetailIndex = selectedOrderDetails.findIndex(
      detail => detail.orchidId === selectedNewOrchid.id
    );
    
    if (existingDetailIndex !== -1) {
      // If orchid exists, increase its quantity
      const updatedDetails = [...selectedOrderDetails];
      updatedDetails[existingDetailIndex].quantity += newOrchidQuantity;
      setSelectedOrderDetails(updatedDetails);
    } else {
      // If orchid doesn't exist, add as new item
      const newOrderDetail = {
        orchidId: selectedNewOrchid.id,
        name: selectedNewOrchid.name,
        price: selectedNewOrchid.price,
        categoryName: selectedNewOrchid.categoryName,
        quantity: newOrchidQuantity
      };
      setSelectedOrderDetails([...selectedOrderDetails, newOrderDetail]);
    }
    
    setShowAddOrchidModal(false);
    setSelectedNewOrchid(null);
    setNewOrchidQuantity(1);
  };

  

 

  const handleCompleteOrder = (orderId) => {
    setOrderToAction(orderId);
    setConfirmAction('complete');
    setShowConfirmModal(true);
  };

  const handleCancelOrder = (orderId) => {
    setOrderToAction(orderId);
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };

  const confirmActionHandler = async () => {
    if (!orderToAction || !confirmAction) return;
    try {
      if (confirmAction === 'complete') {
        await completeOrderMutation.mutateAsync(orderToAction);
      } else if (confirmAction === 'cancel') {
        await deleteOrderMutation.mutateAsync(orderToAction);
      }
      setShowConfirmModal(false);
      setOrderToAction(null);
      setConfirmAction(null);
    } catch (error) {
      console.error(`${confirmAction} failed:`, error);
    }
  };



  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your orders...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Orders</Alert.Heading>
          <p>We couldn't load your orders. Please try again later.</p>
        </Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-sm">
                <Card.Body className="py-5">
                  <i className="bi bi-bag-x display-1 text-muted mb-3"></i>
                  <h3 className="text-muted">No Orders Found</h3>
                  <p className="text-muted">You haven't placed any orders yet.</p>
                 
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-primary">
              <i className="bi bi-bag-check me-2"></i>
              My Orders
            </h2>
            <p className="text-muted">Track and manage your order history</p>
          </Col>
        </Row>

        <Row>
          <Col>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-light border-0">
                    <Row className="align-items-center">
                      <Col md={3}>
                        <div>
                          <strong>Order #{order.id}</strong>
                          <br />
                          <small className="text-muted">
                            {formatDate(order.orderDate)}
                          </small>
                        </div>
                      </Col>
                      <Col md={2}>
                        <Badge 
                          bg={getStatusVariant(order.orderStatus)}
                          className="px-3 py-2"
                        >
                          {order.orderStatus}
                        </Badge>
                      </Col>
                      <Col md={3}>
                        <div className="text-end">
                          <strong className="text-primary">
                            {formatPrice(order.totalAmount)}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {order.orderDetails.length} item(s)
                          </small>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <div className="d-flex gap-2 justify-content-end align-items-center">
                         
                          
                          {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleCompleteOrder(order.id)}
                              disabled={updateOrderMutation.isPending}
                              title="Mark as Completed"
                            >
                              <i className="bi bi-check-circle"></i>
                            </Button>
                          )}
                          
                          {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={updateOrderMutation.isPending}
                              title="Cancel Order"
                            >
                              <i className="bi bi-x-circle"></i>
                            </Button>
                          )}
                          {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowDetailsModal(order)}
                            title="Edit Order Details"
                          >
                            <i className="bi bi-list-ul me-1"></i>
                            Details
                          </Button>
                        )}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            {expandedOrder === order.id ? (
                              <>
                                <i className="bi bi-chevron-up me-1"></i>
                                Hide
                              </>
                            ) : (
                              <>
                                <i className="bi bi-chevron-down me-1"></i>
                                View
                              </>
                            )}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Header>

                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card.Body>
                        <h6 className="mb-3">
                          <i className="bi bi-list-ul me-2"></i>
                          Order Details
                        </h6>
                        <Table responsive className="mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Product ID</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th>Category</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderDetails.map((detail, detailIndex) => (
                              <tr key={detailIndex}>
                                <td>
                                  <Badge bg="secondary" className="px-2 py-1">
                                    #{detail.orchidId }
                                  </Badge>
                                </td>
                                <td>
                                  <span className="fw-medium">{detail.name}</span>
                                </td>
                                <td>
                                  <span className="fw-medium">{formatPrice(detail.price)}</span>
                                </td>
                                <td>
                                  <span className="fw-medium">{detail.categoryName}</span>
                                </td>
                                <td>
                                  <span className="fw-medium">{detail.quantity}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        
                        <div className="mt-3 pt-3 border-top">
                          <Row>
                            <Col md={6}>
                              <small className="text-muted">
                                <i className="bi bi-person me-1"></i>
                                Account ID: {order.accountId}
                              </small>
                            </Col>
                            <Col md={6} className="text-end">
                              <strong className="text-primary">
                                Total: {formatPrice(order.totalAmount)}
                              </strong>
                            </Col>
                          </Row>
                        </div>
                      </Card.Body>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </Col>
        </Row>
      </motion.div>
      
      {/* Order Details Edit Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-list-ul me-2"></i>
            Edit Order Details - #{selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Row>
              <Col md={6}>
                <small className="text-muted">
                  <strong>Order Date:</strong> {selectedOrder && formatDate(selectedOrder.orderDate)}
                </small>
              </Col>
              <Col md={6} className="text-end">
                <Badge bg={getStatusVariant(selectedOrder?.orderStatus)}>
                  {selectedOrder?.orderStatus}
                </Badge>
              </Col>
            </Row>
          </div>
          
          <Table responsive>
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <strong>{detail.name}</strong>
                      <br />
                      <small className="text-muted">{detail.categoryName}</small>
                      <br />
                      <Badge bg="secondary" className="px-2 py-1">
                        ID: #{detail.orchidId}
                      </Badge>
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium">{formatPrice(detail.price)}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center" style={{width: '120px'}}>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(index, detail.quantity - 1)}
                        disabled={detail.quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      <Form.Control
                        type="number"
                        value={detail.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                        min="1"
                        className="mx-2 text-center"
                        style={{width: '60px'}}
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(index, detail.quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary">
                      {formatPrice(detail.price * detail.quantity)}
                    </strong>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteDetail(index)}
                      disabled={selectedOrderDetails.length === 1}
                      title={selectedOrderDetails.length === 1 ? "Cannot delete the last item" : "Delete item"}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="mt-3 pt-3 border-top">
            <Row className="mb-3">
              <Col>
                <Button
                  variant="outline-success"
                  onClick={handleAddNewOrchid}
                  className="w-100"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Orchid
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Changes will update the order total
                </small>
              </Col>
              <Col md={6} className="text-end">
                <strong className="text-primary fs-5">
                  New Total: {formatPrice(
                    selectedOrderDetails.reduce((total, detail) => 
                      total + (detail.price * detail.quantity), 0
                    )
                  )}
                </strong>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDetailsModal(false)}
            disabled={updateOrderMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveDetailsChanges}
            disabled={updateOrderMutation.isPending || selectedOrderDetails.length === 0}
          >
            {updateOrderMutation.isPending ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check me-2"></i>
                Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Orchid Modal */}
      <Modal show={showAddOrchidModal} onHide={() => setShowAddOrchidModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Orchid to Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Orchid</Form.Label>
              <Form.Select
                value={selectedNewOrchid?.id || ''}
                onChange={(e) => {
                  const orchid = availableOrchids.find(o => o.id === parseInt(e.target.value));
                  setSelectedNewOrchid(orchid);
                }}
              >
                <option value="">Choose an orchid...</option>
                {availableOrchids.map(orchid => (
                  <option key={orchid.id} value={orchid.id}>
                    {orchid.name} - {formatPrice(orchid.price)} ({orchid.categoryName})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            {selectedNewOrchid && (
              <>
                <div className="mb-3 p-3 bg-light rounded">
                  <Row>
                    <Col md={8}>
                      <h6 className="mb-1">{selectedNewOrchid.name}</h6>
                      <small className="text-muted">{selectedNewOrchid.categoryName}</small>
                    </Col>
                    <Col md={4} className="text-end">
                      <strong className="text-primary">{formatPrice(selectedNewOrchid.price)}</strong>
                    </Col>
                  </Row>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <div className="d-flex align-items-center" style={{width: '150px'}}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setNewOrchidQuantity(Math.max(1, newOrchidQuantity - 1))}
                      disabled={newOrchidQuantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={newOrchidQuantity}
                      onChange={(e) => setNewOrchidQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="mx-2 text-center"
                      style={{width: '80px'}}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setNewOrchidQuantity(newOrchidQuantity + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </Form.Group>
                
                <div className="mt-3 pt-3 border-top">
                  <Row>
                    <Col md={6}>
                      <strong>Subtotal:</strong>
                    </Col>
                    <Col md={6} className="text-end">
                      <strong className="text-primary">
                        {formatPrice(selectedNewOrchid.price * newOrchidQuantity)}
                      </strong>
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowAddOrchidModal(false);
              setSelectedNewOrchid(null);
              setNewOrchidQuantity(1);
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmAddOrchid}
            disabled={!selectedNewOrchid}
          >
            <i className="bi bi-plus me-2"></i>
            Add to Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${confirmAction === 'complete' ? 'bi-check-circle text-success' : 'bi-x-circle text-warning'} me-2`}></i>
            {confirmAction === 'complete' ? 'Complete Order' : 'Cancel Order'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <i className={`bi ${confirmAction === 'complete' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning'}`} style={{fontSize: '3rem'}}></i>
            <h5 className="mt-3 mb-2">
              {confirmAction === 'complete' ? `Mark Order as Completed?` : 'Cancel This Order?'}
            </h5>
            <p className="text-muted mb-0">
              {confirmAction === 'complete' 
                ? `Are you sure you want to mark Order #${orderToAction} as completed?`
                : `Are you sure you want to cancel Order #${orderToAction}?`
              }
              <br />
              <small className={confirmAction === 'complete' ? '' : 'text-danger'}>This action cannot be undone.</small>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowConfirmModal(false);
              setOrderToAction(null);
              setConfirmAction(null);
            }}
            disabled={(confirmAction === 'complete' ? completeOrderMutation : deleteOrderMutation).isPending}
          >
            {confirmAction === 'complete' ? 'Cancel' : 'Keep Order'}
          </Button>
          <Button 
            variant={confirmAction === 'complete' ? 'success' : 'warning'}
            onClick={confirmActionHandler}
            disabled={(confirmAction === 'complete' ? completeOrderMutation : deleteOrderMutation).isPending}
          >
            {(confirmAction === 'complete' ? completeOrderMutation : deleteOrderMutation).isPending ? (
              <>
                <Spinner size="sm" className="me-2" />
                {confirmAction === 'complete' ? 'Completing...' : 'Cancelling...'}
              </>
            ) : (
              <>
                <i className={`bi ${confirmAction === 'complete' ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
                {confirmAction === 'complete' ? 'Complete Order' : 'Cancel Order'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    
    </Container>
  );
}