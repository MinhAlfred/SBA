import { useState } from 'react';
import { Container, Table, Button, Form, Image, Modal, Card, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';
import { useOrchids, useCreateOrchid, useDeleteOrchid, useUpdateOrchid } from '../../queries/useOrchid';
import { useCategories } from '../../queries/useCategory';

export default function OrchidList() {
  const { data: dataOrchids, isLoading: loadingOrchids } = useOrchids();
  const orchids = dataOrchids?.data || [];
  const { data: dataCategories, isLoading: loadingCategories } = useCategories();
  const categories = dataCategories?.data || [];
  const createOrchidMutation = useCreateOrchid();
  const updateOrchidMutation = useUpdateOrchid();
  const deleteOrchidMutation = useDeleteOrchid();
  
  // Modal states
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentOrchid, setCurrentOrchid] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const handleClose = () => {
    setShow(false);
    reset();
    setCurrentOrchid(null);
  };
  
  const handleShow = (mode = 'add', orchid = null) => {
    setModalMode(mode);
    setCurrentOrchid(orchid);
    setShow(true);
    
    if (mode === 'edit' && orchid) {
      // Set form values for editing
      setValue('id', orchid.id);
      setValue('name', orchid.name);
      setValue('url', orchid.url);
      setValue('description', orchid.description);
      setValue('isNatural', orchid.isNatural);
      setValue('isAvailable', orchid.isAvailable);
      setValue('price', orchid.price);
      setValue('categoryId', orchid.categoryId.id);
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await createOrchidMutation.mutateAsync(formData);
      } else if (modalMode === 'edit' && currentOrchid) {
        await updateOrchidMutation.mutateAsync({
          id: currentOrchid.id,
          data: formData
        });
      }
      setShow(false);
      reset();
      setCurrentOrchid(null);
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      // No need to show another toast here
    }
  };

  const handleDeleteClick = (orchid) => {
    setCurrentOrchid(orchid);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      await deleteOrchidMutation.mutateAsync(currentOrchid.id);
      setShowDeleteModal(false);
      setCurrentOrchid(null);
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      // No need to show another toast here
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentOrchid(null);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  if (loadingOrchids) {
    return (
      <Container className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '300px' }}>
        <div className="d-flex gap-2">
          <Spinner animation="grow" variant="primary" size="sm" />
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="primary" size="sm" />
        </div>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="mt-3 text-muted"
        >
          Loading orchids...
        </motion.p>
      </Container>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Container className="py-4">
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="mb-0 text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Orchid Management
          </motion.h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => handleShow('add')} 
              variant="primary" 
              className="d-flex align-items-center gap-2 shadow-sm"
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Add New Orchid</span>
            </Button>
          </motion.div>
        </motion.div>

        <Card className="shadow-sm border-0 overflow-hidden">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Table hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Image</th>
                  <th>Orchid Name</th>
                  <th>Origin</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orchids.map((orchid) => (
                  <motion.tr 
                    key={orchid.id}
                    variants={itemVariant}
                    whileHover="hover"
                    className="align-middle"
                  >
                    <td className="ps-4">
                      <Image 
                        src={orchid.url} 
                        width={50} 
                        height={50} 
                        className="rounded object-fit-cover shadow-sm" 
                        style={{ objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-medium">{orchid.name}</td>
                    <td>
                      {orchid.isNatural ? 
                        <Badge bg="success" pill className="px-3 py-2">
                          <i className="bi bi-flower1 me-1"></i> Natural
                        </Badge> : 
                        <Badge bg="warning" text="dark" pill className="px-3 py-2">
                          <i className="bi bi-building me-1"></i> Not Natural
                        </Badge>}
                    </td>
                    <td className="fw-medium">${orchid.price}</td>
                    <td className="fw-medium">{orchid.description}</td>
                    <td>
                      {orchid.isAvailable ? 
                        <Badge bg="success" pill className="px-3 py-2">
                          <i className="bi bi-flower1 me-1"></i> Available
                        </Badge> : 
                        <Badge bg="danger" text="dark" pill className="px-3 py-2">
                          <i className="bi bi-flower1 me-1"></i> Not Available
                        </Badge>}
                    </td>
                    <td className="fw-medium">{orchid.categoryId?.name}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="d-flex align-items-center gap-1"
                            onClick={() => handleShow('edit', orchid)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            <span>Edit</span>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDeleteClick(orchid)}
                            className="d-flex align-items-center gap-1"
                          >
                            <i className="bi bi-trash3"></i>
                            <span>Delete</span>
                          </Button>
                        </motion.div>
                      </div>
                    </td>
                   
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </motion.div>
        </Card>
        
        {orchids.length === 0 && (
          <motion.div 
            className="text-center py-5 my-4 bg-light rounded-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <i className="bi bi-flower3 text-muted" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3 text-muted">No orchids available</h4>
            <p className="text-muted">Click the "Add New Orchid" button to add your first orchid.</p>
          </motion.div>
        )}

      <Modal 
        show={show} 
        onHide={handleClose} 
        backdrop="static" 
        centered 
        size="lg"
        className="orchid-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">
            <i className="bi bi-flower2 me-2"></i>
            {modalMode === 'add' ? 'Add New Orchid' : 'Edit Orchid'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Orchid Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter orchid name" 
                    className="shadow-sm border-0 bg-light py-2"
                    {...register("name", { required: "Orchid name is required" })}
                  />
                  {errors.name && (
                    <p className="text-danger small mt-1">{errors.name.message}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Price </Form.Label>
                  <Form.Control 
                    type="number" 
                    step="any" // ✅ cho phép nhập số thập phân tự do
                    min="0"
                    placeholder="Enter price" 
                    className="shadow-sm border-0 bg-light py-2"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <p className="text-danger small mt-1">{errors.price.message}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Category</Form.Label>
                  <Form.Select 
                    className="shadow-sm border-0 bg-light py-2"
                    {...register("categoryId", { required: "Category is required" })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.categoryId && (
                    <p className="text-danger small mt-1">{errors.categoryId.message}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Image URL </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter image url" 
                    className="shadow-sm border-0 bg-light py-2"
                    {...register("url", { required: "Image url is required" })}
                  />
                  {errors.url && (
                    <p className="text-danger small mt-1">{errors.url.message}</p>
                  )}
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    placeholder="Enter description" 
                    className="shadow-sm border-0 bg-light py-2"
                    {...register("description", { required: "Description is required" })}
                  />
                  {errors.description && (
          <p className="text-danger small mt-1">{errors.description.message}</p>
        )}
                </Form.Group>
            <Row>

            </Row>

            <Form.Group className="mb-4 mt-2">
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="checkbox" 
                  id="isNaturalCheck"
                  className="me-2"
                  {...register("isNatural")} 
                />
                <Form.Label htmlFor="isNaturalCheck" className="mb-0 user-select-none cursor-pointer">
                  <Badge bg="success" pill className="px-3 py-2 me-2">
                    <i className="bi bi-flower1 me-1"></i> Natural Orchid
                  </Badge>
                  <span className="text-muted small">Check this if the orchid is naturally occurring</span>
                </Form.Label>
              </div>
            </Form.Group>
            

            <Form.Group className="mb-4 mt-2">
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="checkbox" 
                  id="isAvailableCheck"
                  className="me-2"
                  {...register("isAvailable")} 
                />
                <Form.Label htmlFor="isAvailableCheck" className="mb-0 user-select-none cursor-pointer">
                  <Badge bg="success" pill className="px-3 py-2 me-2">
                    <i className="bi bi-flower1 me-1"></i> Available
                  </Badge>
                  <span className="text-muted small">Check this if the orchid is available</span>
                </Form.Label>
              </div>
            </Form.Group>

            <hr className="my-4" />

            <div className="d-flex justify-content-end gap-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="light" 
                  onClick={handleClose} 
                  className="px-4"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-4 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-save"></i>
                  <span>Save Orchid</span>
                </Button>
              </motion.div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={cancelDelete}
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="mb-4">Are you sure you want to delete this orchid?</p>
          
          {currentOrchid && (
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center gap-3">
                <Image 
                  src={currentOrchid.url} 
                  width={60} 
                  height={60} 
                  className="rounded object-fit-cover shadow-sm" 
                  style={{ objectFit: 'cover' }}
                />
                <div>
                  <h5 className="mb-1">{currentOrchid.name}</h5>
                  <p className="text-muted mb-0 small">{currentOrchid.description}</p>
                </div>
              </Card.Body>
            </Card>
          )}
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="light" 
                onClick={cancelDelete} 
                className="px-4"
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="danger" 
                onClick={confirmDelete} 
                className="px-4 d-flex align-items-center gap-2"
              >
                <i className="bi bi-trash3"></i>
                <span>Delete Orchid</span>
              </Button>
            </motion.div>
          </div>
        </Modal.Body>
      </Modal>

    </Container>
    </motion.div>
  );
}