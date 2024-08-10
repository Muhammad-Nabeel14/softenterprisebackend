import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, InputLabel, Grid, IconButton, CircularProgress } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

const ProductForm = () => {
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Required'),
    price: Yup.number().positive('Price must be positive').required('Required'),
    quantity: Yup.number().integer('Quantity must be an integer').positive('Quantity must be positive').required('Required'),
    pictures: Yup.array().min(1, 'At least one image is required').max(6, 'Cannot upload more than 6 images')
  });

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue("pictures", [...uploadedFiles, ...files]);

    setUploadedFiles(prev => [...prev, ...files]);
    setPreviewImages(prev => [
      ...prev,
      ...files.map(file => ({ src: URL.createObjectURL(file), file }))
    ]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    const userId = Cookies.get('userId');

    formData.append("user", userId);
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('quantity', values.quantity);
    uploadedFiles.forEach(file => formData.append('pictures', file));

    setLoading(true); // Start loading

    try {
      const response = await fetch('https://sebackend-8rm0.onrender.com/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success('Product submitted successfully!');
      navigate("/entries");
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          my: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Submit Product Information
        </Typography>
        <Formik
          initialValues={{ name: '', price: '', quantity: '', pictures: [] }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
          }}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Product Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                name="price"
                label="Price"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.price && Boolean(errors.price)}
                helperText={touched.price && errors.price}
              />
              <Field
                as={TextField}
                name="quantity"
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
              />
              <InputLabel htmlFor="file-upload" sx={{ mt: 2 }}>Upload Pictures</InputLabel>
              <input
                id="file-upload"
                name="pictures"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(event) => handleFileChange(event, setFieldValue)}
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  variant="outlined"
                  color="primary"
                  startIcon={<PhotoCamera />}
                  sx={{ mt: 1 }}
                >
                  Upload
                </Button>
              </label>
              <Box sx={{ mt: 2 }}>
                {previewImages.length > 0 && (
                  <Grid container spacing={2}>
                    {previewImages.map((preview, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index} sx={{ position: 'relative' }}>
                        <img
                          src={preview.src}
                          alt={`preview ${index}`}
                          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading} // Disable button while loading
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'} // Show loader if loading
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate('/entries')}
                >
                  View Entries
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <ToastContainer />
    </>
  );
};

export default ProductForm;
