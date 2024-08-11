import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, Grid, IconButton, CircularProgress, Box, Typography, TablePagination, Container } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      const userId = Cookies.get('userId');
      try {
        const response = await fetch(`https://sebackend-8rm0.onrender.com/products/user/${userId}`);
        const data = await response.json();
        console.log(data);
        
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
    console.log(images);
    
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isEntriesArray = Array.isArray(entries);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
      ) : !isEntriesArray ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            {entries.message || 'You have no entries.'}
          </Typography>
        </Box>
      ) : (
        <>
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
                {entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
                  <TableRow key={entry._id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={entries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-select': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#2B6777', // Deep Teal color for the select icon
                },
                '& .MuiTablePagination-toolbar': {
                  minHeight: '48px',
                },
                '& .MuiTablePagination-caption': {
                  color: '#1C1C1C', // Dark Gray color for text
                }
              }}
            />
          </Box>
        </>
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
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    padding: '8px',
                    border: '2px solid black',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={`https://sebackend-8rm0.onrender.com${src}`}
                    alt={`Product Image ${index}`}
                    
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Entries;
