import * as pdfjsLib from 'pdfjs-dist/webpack';

export const pdfReader = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
          let text = '';
          const pagesPromises = [];
          for (let i = 0; i < pdf.numPages; i++) {
            pagesPromises.push(
              pdf.getPage(i + 1).then(page => {
                return page.getTextContent().then(textContent => {
                  textContent.items.forEach(item => {
                    text += item.str + ' ';
                  });
                });
              })
            );
          }
          Promise.all(pagesPromises).then(() => {
            resolve(text.trim());
          });
        }).catch(reject);
      };
      fileReader.readAsArrayBuffer(file);
    });
};