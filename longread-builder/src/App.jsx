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
    <Container
      maxWidth="lg"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
      }}>
      <Box sx={{ mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <Typography
            variant="h5"
            component="h1">
            {locale.app.title}
          </Typography>
          <LanguageSwitcher />
        </Box>

        <Toolbar
          editor={editorInstance}
          onSave={handleSave}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flex: 1,
          overflow: 'hidden',
        }}>
        <Box sx={{ flex: 2, height: '100%' }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <EditorComponent
              onInstanceReady={setEditorInstance}
              onBlockSelect={setSelectedBlock}
              initialData={editorData}
            />
          </Paper>
        </Box>

        <Box
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <Paper
            elevation={3}
            sx={{ p: 2, flex: 1 }}>
            <BlockSettings
              block={selectedBlock}
              editor={editorInstance}
            />
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 2, flex: 1 }}>
            <ExportPanel
              data={editorData}
              onSave={handleSave}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
