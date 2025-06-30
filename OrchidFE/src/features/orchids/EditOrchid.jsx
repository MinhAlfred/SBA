// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Form, Button, Card, Spinner, Row, Col } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import { ROUTES, VALIDATION_MESSAGES } from '../../constants';
// import { motion } from 'framer-motion';

// export default function EditOrchid() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [initialLoading, setInitialLoading] = useState(true);
  
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors }, 
//     reset 
//   } = useForm();

//   useEffect(() => {
//     const fetchOrchid = async () => {
//       try {
//         const data = await getOrchidById(id);
//         if (data) {
//           reset(data);
//         }
//       } catch (error) {
//         console.error('Error fetching orchid details:', error);
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     fetchOrchid();
//   }, [id, getOrchidById, reset]);

//   const onSubmit = async (data) => {
//     try {
//       // Ensure price is a number
//       const formattedData = {
//         ...data,
//         price: parseFloat(data.price),
//         id: parseInt(id)
//       };
      
//       await updateOrchid(formattedData);
//       navigate(ROUTES.ORCHID_LIST);
//     } catch (error) {
//       console.error('Error updating orchid:', error);
//     }
//   };

//   if (initialLoading) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
//         <div className="spinner-grow text-primary me-2" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <div className="spinner-grow text-indigo-500 me-2" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <div className="spinner-grow text-success" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </Container>
//     );
//   }

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
//   };

//   return (
//     <Container className="py-5">
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h1 className="fw-bold">Edit Orchid</h1>
//           <Button 
//             variant="outline-secondary" 
//             onClick={() => navigate(ROUTES.ORCHID_LIST)}
//             className="rounded-pill px-3 py-2"
//           >
//             <i className="bi bi-arrow-left me-2"></i>
//             Back
//           </Button>
//         </div>
        
//         <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
//           <Card.Body className="p-4 p-md-5">
//             <Form onSubmit={handleSubmit(onSubmit)}>
//               <Row className="g-4">
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold">Orchid Name</Form.Label>
//                     <Form.Control 
//                       type="text" 
//                       className="rounded-pill py-2 px-3"
//                       placeholder="Enter orchid name"
//                       {...register('orchidName', { required: VALIDATION_MESSAGES.REQUIRED })} 
//                       isInvalid={!!errors.orchidName}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.orchidName?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold">Category</Form.Label>
//                     <Form.Control 
//                       type="text" 
//                       className="rounded-pill py-2 px-3"
//                       placeholder="Enter category"
//                       {...register('category', { required: VALIDATION_MESSAGES.REQUIRED })} 
//                       isInvalid={!!errors.category}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.category?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold">Origin</Form.Label>
//                     <Form.Control 
//                       type="text" 
//                       className="rounded-pill py-2 px-3"
//                       placeholder="Enter origin"
//                       {...register('origin', { required: VALIDATION_MESSAGES.REQUIRED })} 
//                       isInvalid={!!errors.origin}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.origin?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold">Price ($)</Form.Label>
//                     <Form.Control 
//                       type="number" 
//                       step="0.01"
//                       className="rounded-pill py-2 px-3"
//                       placeholder="Enter price"
//                       {...register('price', { 
//                         required: VALIDATION_MESSAGES.REQUIRED,
//                         min: {
//                           value: 0.01,
//                           message: VALIDATION_MESSAGES.PRICE_MIN
//                         }
//                       })} 
//                       isInvalid={!!errors.price}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.price?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={12}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold">Image URL</Form.Label>
//                     <Form.Control 
//                       type="text" 
//                       className="rounded-pill py-2 px-3"
//                       placeholder="Enter image URL"
//                       {...register('image', { 
//                         required: VALIDATION_MESSAGES.REQUIRED,
//                         pattern: {
//                           value: /^https?:\/\/.+/i,
//                           message: VALIDATION_MESSAGES.VALID_URL
//                         }
//                       })} 
//                       isInvalid={!!errors.image}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.image?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={12}>
//                   <Form.Group className="mb-4">
//                     <Form.Label className="fw-semibold">Description</Form.Label>
//                     <Form.Control 
//                       as="textarea" 
//                       rows={4}
//                       className="rounded-3 py-2 px-3"
//                       placeholder="Enter detailed description"
//                       {...register('description', { required: VALIDATION_MESSAGES.REQUIRED })} 
//                       isInvalid={!!errors.description}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.description?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                 </Col>
                
//                 <Col md={12}>
//                   <Form.Group className="mb-3">
//                     <Form.Check 
//                       type="checkbox"
//                       id="isNatural"
//                       label="This is a natural orchid"
//                       className="user-select-none"
//                       {...register('isNatural')}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
              
//               <div className="d-flex gap-3 mt-4">
//                 <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
//                   <Button 
//                     variant="primary" 
//                     type="submit"
//                     disabled={loading}
//                     className="rounded-pill px-4 py-2 fw-semibold"
//                     size="lg"
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner
//                           as="span"
//                           animation="border"
//                           size="sm"
//                           role="status"
//                           aria-hidden="true"
//                           className="me-2"
//                         />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-check-circle me-2"></i>
//                         Save Changes
//                       </>
//                     )}
//                   </Button>
//                 </motion.div>
                
//                 <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={() => navigate(ROUTES.ORCHID_LIST)}
//                     className="rounded-pill px-4 py-2"
//                     size="lg"
//                   >
//                     Cancel
//                   </Button>
//                 </motion.div>
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </motion.div>
//     </Container>
//   );
// }