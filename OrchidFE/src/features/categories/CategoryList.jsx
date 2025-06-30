import { useState } from 'react';
import { Container, Table, Button, Form, Modal, Spinner, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../queries/useCategory';

export default function CategoryList() {
  const { data: dataCategories, isLoading: loadingCategories } = useCategories();
  const categories = dataCategories?.data || [];
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  // Modal states
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const handleClose = () => {
    setShow(false);
    reset();
    setCurrentCategory(null);
  };
  
  const handleShow = (mode = 'add', category = null) => {
    setModalMode(mode);
    setCurrentCategory(category);
    setShow(true);
    
    if (mode === 'edit' && category) {
      // Set form values for editing
      setValue('id', category.id);
      setValue('name', category.name);
      setValue('description', category.description);
    }
  };

  const onSubmit = async (formData) => {
      if (modalMode === 'add') {
        await createCategoryMutation.mutateAsync(formData);
      } else if (modalMode === 'edit' && currentCategory) {
        await updateCategoryMutation.mutateAsync({
          id: currentCategory.id,
          data: formData
        });
      }
      setShow(false);
      reset();
      setCurrentCategory(null);
  };

  const handleDeleteClick = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
      await deleteCategoryMutation.mutateAsync(currentCategory.id);
      setShowDeleteModal(false);
      setCurrentCategory(null);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentCategory(null);
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

  if (loadingCategories) {
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
          Loading categories...
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
            Category Management
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
              <span>Add New Category</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Table hover responsive className="mb-0 shadow-sm">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <i className="bi bi-folder text-muted" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-3 mb-0 text-muted">No categories available</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <motion.tr 
                    key={category.id}
                    variants={itemVariant}
                    whileHover="hover"
                    className="align-middle"
                  >
                    <td className="ps-4">{category.id}</td>
                    <td className="fw-medium">{category.name}</td>
                    <td>{category.description}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="d-flex align-items-center gap-1"
                            onClick={() => handleShow('edit', category)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            <span>Edit</span>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDeleteClick(category)}
                            className="d-flex align-items-center gap-1"
                          >
                            <i className="bi bi-trash3"></i>
                            <span>Delete</span>
                          </Button>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </Table>
        </motion.div>

        {/* Add/Edit Category Modal */}
        <Modal 
          show={show} 
          onHide={handleClose} 
          backdrop="static" 
          centered 
          size="lg"
          className="category-modal"
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="text-primary">
              <i className="bi bi-folder-plus me-2"></i>
              {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Category Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter category name" 
                      className="shadow-sm border-0 bg-light py-2"
                      {...register("name", { required: "Category name is required" })}
                    />
                    {errors.name && (
                      <p className="text-danger small mt-1">{errors.name.message}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      placeholder="Enter category description" 
                      className="shadow-sm border-0 bg-light py-2"
                      {...register("description")}
                    />
                  </Form.Group>
                </Col>
              </Row>

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
                    <span>Save Category</span>
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
            <p className="mb-4">Are you sure you want to delete this category?</p>
            
            {currentCategory && (
              <div className="p-3 bg-light rounded mb-4">
                <h5 className="mb-1">{currentCategory.name}</h5>
                <p className="text-muted mb-0 small">{currentCategory.description || 'No description'}</p>
              </div>
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
                  <span>Delete Category</span>
                </Button>
              </motion.div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </motion.div>
  );
}