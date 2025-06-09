import { useContext } from 'react';
import { Button, Box } from '@mui/material';
import { LocaleContext } from '../contexts/LocaleContext';

export default function LanguageSwitcher() {
  const { switchLocale } = useContext(LocaleContext);

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        size="small"
        onClick={() => switchLocale('ru')}
        variant="outlined"
        sx={{
          minWidth: 'auto',
          px: 1,
          fontSize: '0.75rem',
        }}>
        {'RU'}
      </Button>
      <Button
        size="small"
        onClick={() => switchLocale('en')}
        variant="outlined"
        sx={{
          minWidth: 'auto',
          px: 1,
          fontSize: '0.75rem',
        }}>
        {'EN'}
      </Button>
    </Box>
  );
}
