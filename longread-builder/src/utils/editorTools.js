import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Link from '@editorjs/link';
import Code from '@editorjs/code';
// import Paragraph from '@editorjs/paragraph';
import Delimiter from '@editorjs/delimiter';

export const editorTools = {
  header: {
    class: Header,
    config: {
      placeholder: 'Введите заголовок',
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  // paragraph: {
  //   class: Paragraph,
  //   inlineToolbar: true,
  // },
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile(file) {
          return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (e) => {
              resolve({
                success: 1,
                file: {
                  url: e.target.result, // base64 строка
                  // Дополнительные метаданные:
                  name: file.name,
                  size: file.size,
                },
              });
            };

            reader.readAsDataURL(file);
          });
        },

        uploadByUrl(url) {
          // Для URL просто возвращаем тот же URL
          return Promise.resolve({
            success: 1,
            file: { url },
          });
        },
      },

      // Дополнительные настройки
      captionPlaceholder: 'Добавьте подпись...',
      buttonContent: 'Загрузить изображение',
      types: 'image/jpeg,image/png,image/gif',
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Введите цитату',
      captionPlaceholder: 'Цитата автора',
    },
  },

  table: {
    class: Table,
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Заголовок',
      messagePlaceholder: 'Сообщение',
    },
  },
  link: {
    class: Link,
    inlineToolbar: true,
  },
  code: {
    class: Code,
  },
  delimiter: {
    class: Delimiter,
    inlineToolbar: true,
  },
};
