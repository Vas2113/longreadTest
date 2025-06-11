import { useState, useContext } from 'react';
import { Box, Button, IconButton, Tooltip, Divider } from '@mui/material';
import {
  Save,
  AddPhotoAlternate,
  FormatQuote,
  List,
  Code,
  TableChart,
  Link,
  Warning,
  Title,
  TextFields,
} from '@mui/icons-material';
import { LocaleContext } from '../contexts/LocaleContext';

export default function Toolbar({ editor, onSave }) {
  const { locale } = useContext(LocaleContext);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddBlock = (type) => {
    if (editor) {
      editor.blocks.insert(type);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const blockIcons = {
    header: <Title />,
    image: <AddPhotoAlternate />,
    paragraph: <TextFields />,
    quote: <FormatQuote />,
    list: <List />,
    code: <Code />,
    table: <TableChart />,
    link: <Link />,
    warning: <Warning />,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        flexWrap: 'wrap',
      }}>
      {Object.entries(blockIcons).map(([type, icon]) => (
        <Tooltip
          key={type}
          title={`${locale.toolbar.addBlock} - ${locale.toolbar.blocks[type]}`}>
          <IconButton onClick={() => handleAddBlock(type)}>{icon}</IconButton>
        </Tooltip>
      ))}

      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 1 }}
      />

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSave}
        disabled={isSaving}
        sx={{ ml: 'auto' }}>
        {isSaving ? `${locale.common.loading}` : locale.toolbar.save}
      </Button>
    </Box>
  );
}
