import { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { LocaleContext } from '../contexts/LocaleContext';

export default function ExportPanel({ data, onSave }) {
  const { locale } = useContext(LocaleContext);
  const [tabValue, setTabValue] = useState(0);
  const [jsonOutput, setJsonOutput] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [snackbar, setSnackbar] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExport = async () => {
    await onSave();
    if (data) {
      setJsonOutput(JSON.stringify(data, null, 2));
      setHtmlOutput(generateHtml(data));
    }
  };

  const generateHtml = (data) => {
    if (!data?.blocks) return '';

    return data.blocks
      .map((block) => {
        switch (block.type) {
          case 'header':
            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
          case 'paragraph':
            return `<p>${block.data.text}</p>`;
          case 'image':
            return `<figure>
            <img src="${block.data.url}" alt="${block.data.caption || ''}">
            ${
              block.data.caption
                ? `<figcaption>${block.data.caption}</figcaption>`
                : ''
            }
          </figure>`;
          case 'quote':
            return `<blockquote>
            <p>${block.data.text}</p>
            ${
              block.data.caption ? `<footer>${block.data.caption}</footer>` : ''
            }
          </blockquote>`;
          default:
            return `<!-- ${
              locale.toolbar.blocks[block.type] || block.type
            } -->`;
        }
      })
      .join('\n');
  };

  const handleCopy = (text) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() =>
        setSnackbar({
          severity: 'success',
          message: locale.exportPanel.copySuccess,
        })
      )
      .catch(() =>
        setSnackbar({
          severity: 'error',
          message: locale.exportPanel.copyError,
        })
      );
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom>
        {locale.exportPanel.title}
      </Typography>

      <Button
        variant="contained"
        onClick={handleExport}
        fullWidth
        sx={{ mb: 2 }}>
        {locale.exportPanel.generate}
      </Button>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}>
          <Tab label={locale.exportPanel.json} />
          <Tab label={locale.exportPanel.html} />
        </Tabs>

        <Divider />

        <Box sx={{ p: 2 }}>
          {tabValue === 0 ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={jsonOutput || locale.exportPanel.generate}
                variant="outlined"
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() => handleCopy(jsonOutput)}
                disabled={!jsonOutput}
                fullWidth>
                {locale.exportPanel.copy}
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={htmlOutput || locale.exportPanel.generate}
                variant="outlined"
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() => handleCopy(htmlOutput)}
                disabled={!htmlOutput}
                fullWidth>
                {locale.exportPanel.copy}
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.severity}
          sx={{ width: '100%' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
