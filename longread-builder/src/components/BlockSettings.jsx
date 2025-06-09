import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LocaleContext } from '../contexts/LocaleContext';

export default function BlockSettings({ block, editor }) {
  const { locale } = useContext(LocaleContext);
  const [settings, setSettings] = useState({});
  const [blockType, setBlockType] = useState('');

  useEffect(() => {
    if (block) {
      setBlockType(block.type);
      setSettings(block.data || {});
    } else {
      setBlockType('');
      setSettings({});
    }
  }, [block]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateBlock = () => {
    if (editor && block) {
      editor.blocks.update(block.id, {
        ...block,
        data: settings,
      });
    }
  };

  const handleDeleteBlock = () => {
    if (editor && block) {
      editor.blocks.delete(block.id);
    }
  };

  if (!block) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="body1"
          color="text.secondary">
          {locale.blockSettings.selectBlock}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom>
        {locale.blockSettings.title}:{' '}
        {locale.toolbar.blocks[blockType] || blockType}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {blockType === 'header' && (
        <>
          <TextField
            fullWidth
            label={locale.blockSettings.fields.text}
            name="text"
            value={settings.text || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl
            fullWidth
            sx={{ mb: 2 }}>
            <InputLabel>{locale.blockSettings.fields.level}</InputLabel>
            <Select
              name="level"
              value={settings.level || 2}
              label={locale.blockSettings.fields.level}
              onChange={handleChange}>
              {[1, 2, 3, 4].map((level) => (
                <MenuItem
                  key={level}
                  value={level}>
                  {locale.toolbar.blocks.header} {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {blockType === 'image' && (
        <>
          <TextField
            fullWidth
            label={locale.blockSettings.fields.url}
            name="url"
            value={settings.url || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={locale.blockSettings.fields.caption}
            name="caption"
            value={settings.caption || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                name="withBorder"
                checked={settings.withBorder || false}
                onChange={handleChange}
              />
            }
            label={locale.blockSettings.fields.withBorder}
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Switch
                name="withBackground"
                checked={settings.withBackground || false}
                onChange={handleChange}
              />
            }
            label={locale.blockSettings.fields.withBackground}
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Switch
                name="stretched"
                checked={settings.stretched || false}
                onChange={handleChange}
              />
            }
            label={locale.blockSettings.fields.stretched}
          />
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteBlock}>
          {locale.blockSettings.delete}
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateBlock}>
          {locale.blockSettings.update}
        </Button>
      </Box>
    </Box>
  );
}
