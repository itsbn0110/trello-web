import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App.jsx';
import { CssBaseline } from '@mui/material';
import theme from '~/theme.js';
// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          confirmationText: 'Confirm',
          cancellationText: 'Cancel',
          allowClose: 'false',
          cancellationButtonProps: { color: 'inherit' },
          confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
        }}
      >
        <CssBaseline />
        <App />
        <ToastContainer theme="colored" />
      </ConfirmProvider>
    </CssVarsProvider>
  </StrictMode>
);
