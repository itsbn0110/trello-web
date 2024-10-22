import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { blue, orange, teal } from '@mui/material/colors';

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: orange
      }
    },
    dark: {
      palette: {
        primary: blue,
        secondary: blue
      }
    }
  }
});
export default theme;
