import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Link, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = (resetForm) => {
    setIsSignup(!isSignup);
    resetForm();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const url = isSignup
      ? 'https://sebackend-8rm0.onrender.com/user/signup'
      : 'https://sebackend-8rm0.onrender.com/user/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Show success toast
      toast.success(isSignup ? 'Signup successful!' : 'Login successful!');

      // Set cookie for user ID
      Cookies.set('userId', data.user._id, { expires: 7 });

      // Delay navigation to allow toast to display
      setTimeout(() => {
        navigate("/product");
      }, 1000); // 1 second delay

    } catch (error) {
      toast.error('An error occurred: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          my: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched, resetForm }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: loading ? '#c0c0c0' : '#1976d2',
                  color: loading ? 'rgba(0, 0, 0, 0.26)' : '#fff',
                  '&:hover': {
                    backgroundColor: loading ? '#c0c0c0' : '#115293',
                  },
                  '&:disabled': {
                    backgroundColor: '#c0c0c0',
                  },
                  position: 'relative',
                  height: 48,
                  textTransform: 'none',
                  fontSize: '16px',
                  borderRadius: 3,
                  transition: 'background-color 0.3s ease',
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white',
                    }}
                  />
                ) : (
                  isSignup ? 'Sign Up' : 'Login'
                )}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="#" onClick={() => toggleForm(resetForm)} variant="body2">
                  {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <ToastContainer />
    </>
  );
};

export default AuthForm;
