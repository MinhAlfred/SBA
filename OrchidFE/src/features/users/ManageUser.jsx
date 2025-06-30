import { useState } from 'react';
import { Container, Table, Button, Modal, Form, Card, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { VALIDATION_MESSAGES, USER_ROLES } from '../../constants';
import { motion } from 'framer-motion';
import { useUsers, useUpdateUser, useDeleteUser, useRoles } from '../../queries/useUser';
import { useAuth } from '../../context/AuthContext';

export default function ManageUser() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useAuth();
  
  // React Query hooks
  const { data: users = [], isLoading } = useUsers();
  const { data: rolesData , isLoading: isLoadingRoles } = useRoles();
  const roles = rolesData?.data || [];
  console.log(roles)
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue
  } = useForm();

  const handleOpenModal = (userData) => {
    if (!userData) return;
    
    setEditingUser(userData);
    setShowModal(true);

    // Set form values
    setValue('name', userData.name);
    setValue('role', userData.role.id); // Use role.id instead of role.name
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const currentUser = user;
      
      // Don't allow changing your own role
      if (editingUser.email === currentUser.email && parseInt(data.role) !== currentUser.role.id) {
        toast.error('You cannot change your own role');
        return;
      }
      
      // Update existing user
      const userData = {
        name: data.name,
        roleId: parseInt(data.role) // Ensure roleId is a number
      };
      
      console.log('Updating user with data:', userData);
      
      await updateUserMutation.mutateAsync({ 
        userData, 
        id: editingUser.id 
      });
      
      handleCloseModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    try {
      const currentUser = user;
      
      // Don't allow deleting yourself
      if (username === currentUser.username) {
        toast.error('You cannot delete your own account');
        return;
      }
      
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
          <h1 className="fw-bold">User Management</h1>
        </div>
        
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-grow text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-indigo-500 me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Body className="p-0">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 ps-4">Username</th>
                      <th className="py-3">Full Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3 text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="py-4">
                            <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                            <h5 className="mt-3 mb-1">No users found</h5>
                            <p className="text-muted">No users available in the system</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <motion.tr key={user.username} variants={itemVariant}>
                          <td className="align-middle ps-4">{user.username}</td>
                          <td className="align-middle">{user.name}</td>
                          <td className="align-middle">{user.email}</td>
                          <td className="align-middle">
                            <Badge 
                              bg={user.role.name === USER_ROLES.ADMIN ? 'danger' : 'primary'}
                              className="rounded-pill px-3 py-2"
                            >
                              {user.role.name}
                            </Badge>
                          </td>
                          <td className="align-middle text-end pe-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="rounded-pill px-3"
                                  onClick={() => handleOpenModal(user)}
                                >
                                  <i className="bi bi-pencil me-1"></i> Edit
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="rounded-pill px-3"
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                >
                                  <i className="bi bi-trash me-1"></i> Delete
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
            </Card.Body>
          </Card>
        )}
      </motion.div>
      
      {/* User Form Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop="static"
        className="user-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <><i className="bi bi-pencil-square me-2"></i>Edit User</>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">       
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="rounded-pill py-2 px-3"
                    placeholder="Enter full name"
                    {...register('name', { 
                      required: VALIDATION_MESSAGES.REQUIRED 
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              
            
              
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Role</Form.Label>
                  <Form.Select
                    className="rounded-pill py-2 px-3"
                    {...register('role', { 
                      required: VALIDATION_MESSAGES.REQUIRED 
                    })}
                    isInvalid={!!errors.role}
                    disabled={isLoadingRoles}
                  >
                    {isLoadingRoles ? (
                      <option>Loading roles...</option>
                    ) : (
                      roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))
                    )}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.role?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-3 mt-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleCloseModal}
                  className="rounded-pill px-4 py-2"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="primary" 
                  type="submit"
                  className="rounded-pill px-4 py-2 fw-semibold"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Update User
                </Button>
              </motion.div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}