export const cryptoHandler = (content) => {
  const lines = content.trim().split('\n');
  const header = lines[0].split(',');
  
  // Find the indexes of the desired columns
  const timestampIndex = header.indexOf('Timestamp (UTC)');
  const descriptionIndex = header.indexOf('Transaction Description');
  const amountIndex = header.indexOf('Amount');
  
  // Extract the desired columns for each line, excluding the header and lines with non-negative amounts
  const transformedLines = lines.slice(1).map(line => {
    const fields = line.split(',');
    // Check if the amount is less than 0
    const amount = parseFloat(fields[amountIndex])
    if (amount < 0) {
      return [
        'Crypto',
        fields[timestampIndex],
        fields[descriptionIndex],
        Math.abs(amount)
      ].join(',');
    }
    return null; // Return null for lines that should be ignored
  }).filter(line => line !== null); // Remove null lines

  return transformedLines.join('\n');
};