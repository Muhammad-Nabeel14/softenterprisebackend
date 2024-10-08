import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie'; 

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate(); 
  const userId = Cookies.get('userId');

    useEffect(() => {
    if (Cookies.get('userId')) {
      console.log("hiiii");
      
      Cookies.remove('userId');
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('userId');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          Soft Enterprise
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            ml: 'auto', 
            gap: 1,
            flexDirection: 'row' 
          }}
        >
        
          {userId && (
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              sx={{ 
                display: 'block' 
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
