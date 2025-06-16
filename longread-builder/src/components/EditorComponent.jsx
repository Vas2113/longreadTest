import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from '../utils/editorTools';
import styles from './editorComponent.module.css';

function EditorComponent({ onInstanceReady, onBlockSelect, initialData }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
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
  }, [initialData, onInstanceReady]);

  useEffect(() => {
    return () => {
      if (editorInstanceRef.current) {
        try {
          const editorInstance = editorInstanceRef.current;
          editorInstanceRef.current = null;

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

  return (
    <div
      id="editorjs"
      ref={editorRef}
      className={styles.container}
    />
  );
}

export default EditorComponent;
