import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, Grid, IconButton, CircularProgress, Box, Typography } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      const userId = Cookies.get('userId');
      try {
        const response = await fetch(`https://sebackend-8rm0.onrender.com/products/user/${userId}`);
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleViewImages = (images) => {
    setSelectedImages(images);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleGoBack}
        sx={{ mb: 2 }}
      >
        Go Back
      </Button>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            We are loading your documents...
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="entries table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>View Images</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<PhotoCamera />}
                      onClick={() => handleViewImages(entry.pictures)}
                    >
                      View Images
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          View Images
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedImages.map((src, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  padding: '8px',
                  border: '2px solid black',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={`https://sebackend-8rm0.onrender.com${src}`}
                    alt={`Product Image ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Entries;
