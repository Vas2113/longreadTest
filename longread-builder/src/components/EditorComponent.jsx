import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from '../utils/editorTools';
import { editorLocalization } from '../utils/editorLocalization';

function EditorComponent({ onInstanceReady, onBlockSelect, initialData }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorInstance.current) {
      initEditor();
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: editorTools,
      data: initialData || {},
      i18n: editorLocalization,
      onReady: () => {
        editorInstance.current = editor;
        onInstanceReady(editor);
      },
      onChange: () => {
        editor.save().then((data) => {
          const currentBlockIndex = editor.blocks.getCurrentBlockIndex();
          if (currentBlockIndex >= 0) {
            onBlockSelect(data.blocks[currentBlockIndex]);
          }
        });
      },
    });
  };

  return (
    <div
      id="editorjs"
      ref={editorRef}
    />
  );
}

export default EditorComponent;
