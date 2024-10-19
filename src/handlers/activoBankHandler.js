export const activoBankHandler = (content) => {
    const lines = content.trim().split('\n');
    const header = lines[0].split(',');
    
    // Find the indexes of the desired columns
    const timestampIndex = header.indexOf('DATA LANC.');
    const descriptionIndex = header.indexOf('DESCRITIVO SALDO INICIAL');
    const amountIndex = header.indexOf('DEBITO');  
    
    // Extract the desired columns for each line, excluding the header and other lines that debits
    const transformedLines = lines.slice(1).map(line => {
      const fields = line
        .replace('LIGHT,', 'LIGHT')
        .split(',');
      // Check if it is a debit
      const amount = fields[amountIndex]
      if (amount) {
        return [
          'ActivoBank',
          fields[timestampIndex],
          fields[descriptionIndex],
          amount
        ].join(',');
      }
      return null; // Return null for lines that should be ignored
    }).filter(line => line !== null); // Remove null lines
  
    return transformedLines.join('\n');
};  
