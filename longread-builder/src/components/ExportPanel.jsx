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
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onSave();
      if (data) {
        setJsonOutput(JSON.stringify(data, null, 2));
        setHtmlOutput(await generateHtml(data));
      }
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        severity: 'error',
        message: 'Ошибка при генерации экспорта',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Image conversion error:', error);
      return url;
    }
  };

  const generateHtml = async (data) => {
    if (!data?.blocks) return '';

    let html = '<div class="longread-container">\n';

    for (const block of data.blocks) {
      switch (block.type) {
        case 'header':
          html += `  <h${block.data.level}>${block.data.text}</h${block.data.level}>\n`;
          break;

        case 'text':
          html += `  <p>${block.data.text}</p>\n`;
          break;

        case 'image': {
          const imgSrc = block.data.url.startsWith('data:image')
            ? block.data.url
            : await convertImageToBase64(block.data.url);
          html += `  <figure>\n    <img src="${imgSrc}" alt="${
            block.data.caption || ''
          }">\n`;
          if (block.data.caption) {
            html += `    <figcaption>${block.data.caption}</figcaption>\n`;
          }
          html += '  </figure>\n';
          break;
        }

        case 'quote':
          html += `  <blockquote>\n    <p>${block.data.text}</p>\n`;
          if (block.data.caption) {
            html += `    <footer>${block.data.caption}</footer>\n`;
          }
          html += '  </blockquote>\n';
          break;

        case 'list': {
          const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          html += `  <${listTag}>\n`;
          block.data.items.forEach((item) => {
            html += `    <li>${item}</li>\n`;
          });
          html += `  </${listTag}>\n`;
          break;
        }

        case 'table': {
          html += '  <table>\n';
          if (block.data.withHeadings && block.data.content[0]) {
            html += '    <thead>\n      <tr>\n';
            block.data.content[0].forEach((cell) => {
              html += `        <th>${cell || '&nbsp;'}</th>\n`;
            });
            html += '      </tr>\n    </thead>\n';
          }
          html += '    <tbody>\n';
          const startRow = block.data.withHeadings ? 1 : 0;
          for (let i = startRow; i < block.data.content.length; i++) {
            html += '      <tr>\n';
            block.data.content[i].forEach((cell) => {
              html += `        <td>${cell || '&nbsp;'}</td>\n`;
            });
            html += '      </tr>\n';
          }
          html += '    </tbody>\n  </table>\n';
          break;
        }

        case 'code':
          html += `  <pre><code>${block.data.code}</code></pre>\n`;
          break;

        case 'warning':
          html += `  <div class="warning">\n    <strong>${
            block.data.title || 'Предупреждение'
          }</strong>\n`;
          html += `    <p>${block.data.message}</p>\n  </div>\n`;
          break;

        case 'delimiter':
          html += '  <hr />\n';
          break;

        default:
          html += `  <!-- Неподдерживаемый блок: ${block.type} -->\n`;
      }
    }

    html += '</div>';
    return html;
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
        disabled={isLoading}
        fullWidth
        sx={{ mb: 2 }}>
        {isLoading ? locale.common.loading : locale.exportPanel.generate}
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
                slotProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() => handleCopy(jsonOutput)}
                disabled={!jsonOutput || isLoading}
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
                slotProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() => handleCopy(htmlOutput)}
                disabled={!htmlOutput || isLoading}
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
