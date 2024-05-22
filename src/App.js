import React, { useState } from 'react';
import './App.css';
import { activoBankHandler } from './handlers/activoBankHandler';
import { cryptoHandler } from './handlers/cryptoHandler';
import { revolutHandler } from './handlers/revolutHandler';
import { bankinterHandler } from './handlers/bankinterHandler';
import { csvReader } from './readers/csvReader';
import { pdfReader } from './readers/pdfReader';

const CsvUploader = () => {
  const labels = ['ActivoBank', 'Crypto', 'Revolut', 'Bankinter'];
  const [csvFiles, setCsvFiles] = useState(Array.from({ length: labels.length }, () => null));

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const newCsvFiles = [...csvFiles];
    newCsvFiles[index] = event.dataTransfer.files[0];
    setCsvFiles(newCsvFiles);
  };

  const handleFileChange = (event, index) => {
    const newCsvFiles = [...csvFiles];
    newCsvFiles[index] = event.target.files[0];
    setCsvFiles(newCsvFiles);
  };

  const handleSubmit = () => {
    const readFiles = csvFiles.map((file, index) => {
      if (file) {
        return new Promise((resolve, reject) => {
          if(file.type === 'text/csv') {
            csvReader(file)
              .then(content => resolve(handleFileContent(content, index)))
              .catch(reject);
          } else if (file.type === 'application/pdf') {
            pdfReader(file)
              .then(content => resolve(handleFileContent(content, index)))
              .catch(reject);  
          } else {
            reject(new Error('Unsupported file type'));
          }
        });
      } else {
        return Promise.resolve('');
      }
    });

    Promise.all(readFiles)
      .then((contents) => {
        // Crazy JS filter, filter if content is not undefined, null or empty
        const concatenatedContent = contents.filter(content => content).join('\n');
        navigator.clipboard.writeText(concatenatedContent)
          .then(() => {
            console.log('Content copied to clipboard successfully!');
          })
          .catch((error) => {
            console.error('Failed to copy content to clipboard:', error);
          });
      })
      .catch((error) => {
        console.error('Error reading files:', error);
      });
  };

  const handleFileContent = (content, index) => {
    switch(labels[index]) {
      case 'ActivoBank':
        return activoBankHandler(content);
      case 'Crypto':
        return cryptoHandler(content);
      case 'Revolut':
        return revolutHandler(content);
      case 'Bankinter':
        return bankinterHandler(content);    
      default:
        throw new Error(`Missing implementation for ${labels[index]}`); 
    }
  };

  return (
    <div className="container">
      {csvFiles.map((file, index) => (
        <div key={index}>
          <h2>{labels[index]}</h2>
          <div className="drag-area" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, index)}>
            {
              csvFiles[index] ? (
                <>
                  <header>{csvFiles[index].name}</header>
                  <button onClick={() => document.getElementById(`file${index + 1}`).click()}>
                    Change File
                  </button>
                </>
              ) : (
                <>
                  <header>Drag & Drop to Upload</header>
                  <span>OR</span>
                  <button onClick={() => document.getElementById(`file${index + 1}`).click()}> Browse File</button>
                  <input type="file" id={`file${index + 1}`} accept=".csv,.pdf" onChange={(e) => handleFileChange(e, index)} style={{ display: 'none' }}/>
                </>  
              )
            }
          </div>
        </div>
      ))}
      <div className="submit-container">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );           
};

export default CsvUploader;