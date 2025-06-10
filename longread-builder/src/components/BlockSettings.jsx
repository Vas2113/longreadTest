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
  Chip,
  Stack,
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

  const handleArrayChange = (name, items) => {
    setSettings((prev) => ({
      ...prev,
      [name]: items,
    }));
  };

  const handleUpdateBlock = async () => {
    if (editor && block) {
      try {
        // Получаем текущий индекс блока
        const currentIndex = editor.blocks?.getCurrentBlockIndex();

        // Обновляем блок
        await editor.blocks?.update(block.id, {
          ...block,
          data: settings,
        });

        // Возвращаем фокус на обновленный блок
        const updatedBlock = editor.blocks?.getBlockByIndex(currentIndex);
        if (updatedBlock) {
          updatedBlock.focus();
        }
      } catch (error) {
        console.error('Error updating block:', error);
      }
    }
  };

  const handleDeleteBlock = async () => {
    if (editor && block) {
      try {
        // Получаем текущий индекс блока
        const currentIndex = editor.blocks?.getCurrentBlockIndex();

        // Удаляем блок
        await editor.blocks?.delete(block.id);

        // Пытаемся выбрать предыдущий блок
        const newIndex = Math.max(0, currentIndex - 1);
        const prevBlock = editor.blocks?.getBlockByIndex(newIndex);
        if (prevBlock) {
          prevBlock.focus();
        }
      } catch (error) {
        console.error('Error deleting block:', error);
      }
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

      {/* Настройки для заголовка */}
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
                  {locale.toolbar.blocks?.header} {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {/* Настройки для изображения */}
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

      {/* Настройки для параграфа */}
      {blockType === 'paragraph' && (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={locale.blockSettings.fields.text}
          name="text"
          value={settings.text || ''}
          onChange={handleChange}
        />
      )}

      {/* Настройки для списка */}
      {blockType === 'list' && (
        <>
          <FormControl
            fullWidth
            sx={{ mb: 2 }}>
            <InputLabel>Тип списка</InputLabel>
            <Select
              name="style"
              value={settings.style || 'unordered'}
              label="Тип списка"
              onChange={handleChange}>
              <MenuItem value="unordered">Маркированный</MenuItem>
              <MenuItem value="ordered">Нумерованный</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Элементы списка"
            name="items"
            value={(settings.items || []).join('\n')}
            onChange={(e) =>
              handleArrayChange('items', e.target.value.split('\n'))
            }
            helperText="Каждый элемент с новой строки"
          />
        </>
      )}

      {/* Настройки для цитаты */}
      {blockType === 'quote' && (
        <>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Текст цитаты"
            name="text"
            value={settings.text || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Автор"
            name="caption"
            value={settings.caption || ''}
            onChange={handleChange}
          />
        </>
      )}

      {/* Настройки для таблицы */}
      {blockType === 'table' && (
        <Stack spacing={2}>
          <TextField
            label="Количество строк"
            type="number"
            name="rows"
            value={settings.rows || 2}
            onChange={handleChange}
            inputProps={{ min: 1, max: 10 }}
          />
          <TextField
            label="Количество столбцов"
            type="number"
            name="cols"
            value={settings.cols || 2}
            onChange={handleChange}
            inputProps={{ min: 1, max: 6 }}
          />
          <Chip
            label="С заголовками"
            color={settings.withHeadings ? 'primary' : 'default'}
            onClick={() =>
              handleChange({
                target: {
                  name: 'withHeadings',
                  type: 'checkbox',
                  checked: !settings.withHeadings,
                },
              })
            }
          />
        </Stack>
      )}

      {/* Настройки для кода */}
      {blockType === 'code' && (
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Код"
          name="code"
          value={settings.code || ''}
          onChange={handleChange}
        />
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
