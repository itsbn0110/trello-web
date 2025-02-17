import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import App from '~/App.jsx';
import { CssBaseline } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from '~/theme.js';

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm';

// Cấu hình redux
import { Provider } from 'react-redux';
import { store } from '~/redux/store';

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// Cấu hình redux-persist
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { injectStore } from './utils/authorizeAxios';
const persistor = persistStore(store);

// Inject Store: sử dụng biến redux store ở các file ngoài phạm vi component
injectStore(store);
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
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
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
