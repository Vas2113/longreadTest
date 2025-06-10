import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from '../utils/editorTools';
import styles from './editorComponent.module.css';

function EditorComponent({ onInstanceReady, onBlockSelect, initialData }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      const initEditor = async () => {
        try {
          const editorInstance = new EditorJS({
            holder: 'editorjs',
            tools: editorTools,
            data: initialData || {},
            minHeight: 100,
            placeholder: 'Начните вводить текст...',
            onReady: () => {
              editorInstanceRef.current = editorInstance;
              setEditor(editorInstance);
              onInstanceReady(editorInstance);
              isInitialized.current = true;

              if (initialData?.blocks?.length > 0) {
                setTimeout(() => {
                  editorInstance.blocks.getBlockByIndex(0)?.focus();
                }, 100);
              }
            },
            onChange: async (api) => {
              try {
                const savedData = await api.saver.save();
                const currentBlockIndex =
                  editorInstance.blocks.getCurrentBlockIndex();
                if (
                  currentBlockIndex >= 0 &&
                  savedData.blocks[currentBlockIndex]
                ) {
                  onBlockSelect(savedData.blocks[currentBlockIndex]);
                }
              } catch (error) {
                console.error('Error saving data:', error);
              }
            },
          });
        } catch (error) {
          console.error('Editor initialization error:', error);
        }
      };

      initEditor();
    }

    return () => {
      if (editorInstanceRef.current?.destroy) {
        editorInstanceRef.current
          .destroy()
          .then(() => console.log('Editor destroyed'))
          .catch((e) => console.error('Error destroying editor:', e));
      }
    };
  }, []);

  useEffect(() => {
    const handleClick = async () => {
      if (editor) {
        try {
          const currentBlockIndex = editor.blocks.getCurrentBlockIndex();
          if (currentBlockIndex >= 0) {
            const savedData = await editor.save();
            onBlockSelect(savedData.blocks[currentBlockIndex]);
          }
        } catch (error) {
          console.error('Error handling click:', error);
        }
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('click', handleClick);
      return () => editorElement.removeEventListener('click', handleClick);
    }
  }, [editor]);

  return (
    <div
      id="editorjs"
      ref={editorRef}
      className={styles.container}
    />
  );
}

export default EditorComponent;
