import React, { useContext } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Button } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const ThemeButton = () => {
  const { dark, modeChange } = useContext(AuthContext);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999,
      }}
    >
      <Button
        onClick={modeChange}
        style={{
          minWidth: '40px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: dark ? '#333' : '#eee',
          color: dark ? '#fff' : '#000',
          border: '1px solid gray',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          transition: 'all 0.3s',
        }}
      >
        {dark ? <LightModeIcon /> : <DarkModeIcon />}
      </Button>
    </div>
  );
};

export default ThemeButton;