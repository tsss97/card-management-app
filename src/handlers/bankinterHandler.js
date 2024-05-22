export const bankinterHandler = (content) => {
    const lines = content.trim().replace('\r', '').split('\n');
    const header = lines[0].split(',');
    
    // Find the indexes of the desired columns
    const timestampIndex = header.indexOf('Data Valor');
    const descriptionIndex = header.indexOf('Descritivo do Movimento');
    const amountIndex = header.indexOf('Valor');
    
    // Extract the desired columns for each line, excluding the header and other lines that debits
    const transformedLines = lines.slice(1).map(line => {
      // Regular expression to match quoted sections
      const regex = /"([^"]*)"/g;

      // Replace commas with points inside quoted sections and remove the quotes at the end
      const fields = line.replace(regex, (match, p1) => `"${p1.replace(/,/g, '.')}"`)
        .replace(/"/g, '')
        .split(',');  

      // Check if the amount is less than 0
      const amount = parseFloat(fields[amountIndex])
      if (amount > 0) {
        return [
          'Bankinter',
          fields[timestampIndex],
          fields[descriptionIndex],
          Math.abs(amount)
        ].join(',');
      }
      return null; // Return null for lines that should be ignored
    }).filter(line => line !== null); // Remove null lines
  
    return transformedLines.join('\n');
};    