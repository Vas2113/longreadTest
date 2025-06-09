import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { LocaleProvider } from './contexts/LocaleContext';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  ruRU
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <LocalizationProvider
    dateAdapter={AdapterDateFns}
    adapterLocale={ru}>
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LocaleProvider>
  </LocalizationProvider>
);
