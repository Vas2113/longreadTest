import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from '../utils/editorTools';
import styles from './editorComponent.module.css';

function EditorComponent({ onInstanceReady, onBlockSelect, initialData }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const isInitialized = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      const validatedData =
        initialData?.blocks?.length > 0
          ? initialData
          : { blocks: [{ type: 'paragraph', data: { text: '' } }] };

      const initEditor = async () => {
        try {
          const editorInstance = new EditorJS({
            holder: 'editorjs',
            autofocus: true,
            tools: editorTools,
            data: validatedData,
            minHeight: 100,
            placeholder: 'Начните вводить текст...',
            onReady: () => {
              if (!isMounted.current) return;

              editorInstanceRef.current = editorInstance;
              setEditor(editorInstance);
              onInstanceReady?.(editorInstance);
              isInitialized.current = true;

              if (initialData?.blocks?.length > 0) {
                setTimeout(() => {
                  if (isMounted.current && editorInstance.blocks) {
                    editorInstance.blocks?.getBlockByIndex(0)?.focus();
                  }
                }, 100);
              }
            },
            onChange: async (api) => {
              if (!isMounted.current) return;

              try {
                const savedData = await api.saver.save();
                const currentBlockIndex =
                  editorInstance.blocks?.getCurrentBlockIndex();
                if (
                  currentBlockIndex >= 0 &&
                  savedData.blocks?.[currentBlockIndex]
                ) {
                  onBlockSelect?.(savedData.blocks[currentBlockIndex]);
                }
              } catch (error) {
                console.error('Ошибка сохранения данных:', error);
              }
            },
          });
        } catch (error) {
          console.error('Ошибка инициализации редактора:', error);
        }
      };

      initEditor();
    }

    return () => {
      isInitialized.current = false;
    };
  }, [initialData, onBlockSelect, onInstanceReady]);

  useEffect(() => {
    return () => {
      if (editorInstanceRef.current) {
        try {
          const editorInstance = editorInstanceRef.current;
          editorInstanceRef.current = null;
          setEditor(null);

          if (typeof editorInstance.destroy === 'function') {
            Promise.resolve()
              .then(() => editorInstance.destroy())
              .then(() => console.log('Editor destroyed'))
              .catch((e) => console.error('Error destroying editor:', e));
          }
        } catch (error) {
          console.error('Error during editor cleanup:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleClick = async () => {
      if (editor?.blocks) {
        try {
          const currentBlockIndex = editor.blocks?.getCurrentBlockIndex();
          if (currentBlockIndex >= 0) {
            const savedData = await editor.save();
            if (savedData.blocks?.[currentBlockIndex]) {
              onBlockSelect?.(savedData.blocks[currentBlockIndex]);
            }
          }
        } catch (error) {
          console.error('Ошибка клика по элементу:', error);
        }
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('click', handleClick);
      return () => editorElement.removeEventListener('click', handleClick);
    }
  }, [editor, onBlockSelect]);

  return (
    <div
      id="editorjs"
      ref={editorRef}
      className={styles.container}
    />
  );
}

export default EditorComponent;
