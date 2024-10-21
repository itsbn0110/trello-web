import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { blue, grey, orange, teal } from '@mui/material/colors';

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: orange
      }
    },
    dark: {
      palette: {
        primary: grey,
        secondary: blue
      }
    }
  }
});
export default theme;
