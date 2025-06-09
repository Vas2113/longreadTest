import { useContext, useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import EditorComponent from './components/EditorComponent';
import Toolbar from './components/Toolbar';
import BlockSettings from './components/BlockSettings';
import ExportPanel from './components/ExportPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LocaleContext } from './contexts/LocaleContext';

function App() {
  const { locale } = useContext(LocaleContext);
  const [editorData, setEditorData] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  const handleSave = async () => {
    if (editorInstance) {
      const data = await editorInstance.save();
      setEditorData(data);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <Typography
            variant="h3"
            component="h1">
            {locale.app.title}
          </Typography>
          <LanguageSwitcher />
        </Box>

        <Toolbar
          editor={editorInstance}
          onSave={handleSave}
        />

        <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Paper
              elevation={3}
              sx={{ p: 2 }}>
              <EditorComponent
                onInstanceReady={setEditorInstance}
                onBlockSelect={setSelectedBlock}
                initialData={editorData}
              />
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={3}
              sx={{ p: 2, mb: 2 }}>
              <BlockSettings
                block={selectedBlock}
                editor={editorInstance}
              />
            </Paper>

            <Paper
              elevation={3}
              sx={{ p: 2 }}>
              <ExportPanel
                data={editorData}
                onSave={handleSave}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
