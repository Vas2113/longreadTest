import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from '../utils/editorTools';
import styles from './editorComponent.module.css';

function EditorComponent({ onInstanceReady, onBlockSelect, initialData }) {
  const editorInstance = useRef(null);
  const holderRef = useRef('editorjs');

  // Инициализация редактора
  useEffect(() => {
    if (!editorInstance.current) {
      const initEditor = async () => {
        try {
          const editor = new EditorJS({
            holder: holderRef.current,
            tools: editorTools,
            data: initialData || { blocks: [] },
            minHeight: 50,
            placeholder: 'Начните вводить текст...',
            onReady: () => {
              editorInstance.current = editor;
              onInstanceReady?.(editor);

              // Установим обработчик кликов после готовности редактора
              setupClickHandler(editor);
            },
            onChange: async (api) => {
              const savedData = await api.saver.save();
              const currentBlockIndex = editor.blocks.getCurrentBlockIndex();
              if (
                currentBlockIndex >= 0 &&
                savedData.blocks?.[currentBlockIndex]
              ) {
                onBlockSelect?.(savedData.blocks[currentBlockIndex]);
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
      if (editorInstance.current) {
        editorInstance.current.destroy().then(() => {
          editorInstance.current = null;
        });
      }
    };
  }, []);

  // Обработчик кликов по блокам
  const setupClickHandler = (editor) => {
    const editorElement = document.getElementById(holderRef.current);
    if (!editorElement) return;

    const handleClick = async (e) => {
      if (e.target.closest('.ce-block')) {
        try {
          const currentBlockIndex = editor.blocks.getCurrentBlockIndex();
          if (currentBlockIndex >= 0) {
            const block = editor.blocks.getBlockByIndex(currentBlockIndex);
            const savedData = await editor.save();

            if (savedData.blocks?.[currentBlockIndex]) {
              onBlockSelect?.(savedData.blocks[currentBlockIndex]);

              block.focus();
            }
          }
        } catch (error) {
          console.error('Block selection error:', error);
        }
      }
    };

    editorElement.addEventListener('click', handleClick);
    return () => editorElement.removeEventListener('click', handleClick);
  };

  return (
    <div
      id="editorjs"
      className={styles.container}
    />
  );
}

export default EditorComponent;
