import React from 'react';
import "./GlobalLoading.scss"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
const GlobalLoading = () => {
  return <div className='global-loading'>
    <div className="global-loading__wrapper">
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  </div>;
};

export default GlobalLoading;
