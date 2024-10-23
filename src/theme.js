import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
// import { blue, orange, teal, yellow } from '@mui/material/colors';

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    light: {},
    dark: {}
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '4px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '0.5px !important',
            transition: 'transform 0.2s ease-in-out, border-width 0.2s ease-in-out'
          },
          '&:hover fieldset': {
            transform: 'scale(1.05)', // Tạo cảm giác phóng to nhẹ
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset': {
            transform: 'scale(1.05)',
            borderWidth: '1px !important'
          }
        }
      }
    }
  }
});
export default theme;
