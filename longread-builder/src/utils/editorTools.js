import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Link from '@editorjs/link';
import Code from '@editorjs/code';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

class CustomImageTool {
  static get toolbox() {
    return {
      title: 'Изображение',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0L7 5.5l-3-4L0 11h17L10.5 0z" fill="#000"/><circle cx="13" cy="5" r="2" fill="#000"/></svg>',
    };
  }

  constructor({ data, api }) {
    this.api = api;
    this.data = data || {};
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.innerHTML = `
      <div class="cdx-image">
        ${
          this.data.url
            ? `
          <div class="cdx-image__picture">
            <img src="${this.data.url}" alt="${this.data.caption || ''}">
          </div>
          ${
            this.data.caption
              ? `
            <div class="cdx-image__caption" contenteditable="true">
              ${this.data.caption}
            </div>
          `
              : ''
          }
        `
            : `
          <div class="cdx-image__placeholder">
            <label class="cdx-button">
              <input type="file" accept="image/*" style="display: none;">
              Выберите изображение
            </label>
          </div>
        `
        }
      </div>
    `;

    const fileInput = this.wrapper.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    const caption = this.wrapper.querySelector('.cdx-image__caption');
    if (caption) {
      caption.addEventListener('input', () => {
        this.data.caption = caption.innerHTML;
      });
    }

    return this.wrapper;
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.data.url = e.target.result;
      this.wrapper.innerHTML = `
        <div class="cdx-image">
          <div class="cdx-image__picture">
            <img src="${this.data.url}" alt="">
          </div>
          <div class="cdx-image__caption" contenteditable="true">
            Введите подпись
          </div>
        </div>
      `;

      const caption = this.wrapper.querySelector('.cdx-image__caption');
      caption.addEventListener('input', () => {
        this.data.caption = caption.innerHTML;
      });
    };
    reader.readAsDataURL(file);
  }

  save() {
    return this.data;
  }

  static get pasteConfig() {
    return {
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff?|png|webp|bmp)/i,
      },
      handler: (item) => {
        return new Promise((resolve) => {
          fetch(item.data)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve({
                  url: e.target.result,
                  caption: '',
                });
              };
              reader.readAsDataURL(blob);
            });
        });
      },
    };
  }
}

export const editorTools = {
  header: {
    class: Header,
    config: {
      placeholder: 'Введите заголовок',
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: CustomImageTool,
    // class: Image,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Введите цитату',
      captionPlaceholder: 'Цитата автора',
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
      },
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
  marker: {
    class: Marker,
  },
  inlineCode: {
    class: InlineCode,
  },
};
