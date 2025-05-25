// Simple File List Scraper for Government Price Data
// Two functions: listFiles() and downloadFile()

interface FileInfo {
    fileName: string;
    downloadUrl: string;
    sizeKB: number;
    chain: string;
    storeId: string;
    fileType: string;
  }
  
  const BASE_URL = 'http://141.226.203.152/';
  
  /**
   * Lists all available files from the government site
   */
  async function listFiles(): Promise<FileInfo[]> {
    try {
      const response = await fetch(BASE_URL);
      const html = await response.text();
      
      const files: FileInfo[] = [];
      
      // Look for table rows with file data
      const rows = html.split('<tr>');
      
      for (const row of rows) {
        // Skip header row and empty rows
        if (!row.includes('.gz') || row.includes('שם הקובץ')) continue;
        
        // Extract table cells
        const cells = row.split('<td>').map(cell => {
          // Remove HTML tags and clean up
          return cell.replace(/<[^>]*>/g, '').trim();
        }).filter(cell => cell.length > 0);
        
        if (cells.length >= 6) {
          // Extract download URL from href
          const hrefMatch = row.match(/href="([^"]*\.gz)"/);
          const downloadPath = hrefMatch ? hrefMatch[1] : '';
          const downloadUrl = downloadPath ? new URL(downloadPath, BASE_URL).toString() : '';
          
          if (downloadUrl && cells[0]) {
            // Extract filename from the download path
            const fileName = downloadPath.split('/').pop() || cells[0];
            
            files.push({
              fileName: fileName,
              downloadUrl,
              sizeKB: parseInt(cells[5]) || 0,
              chain: cells[1] || '',
              storeId: cells[2] || '',
              fileType: cells[3] || ''
            });
          }
        }
      }
      
      return files;
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }
  
  /**
   * Downloads a file by filename
   */
  async function downloadFile(fileName: string): Promise<ArrayBuffer> {
    try {
      // First get the file list to find the download URL
      const files = await listFiles();
      const file = files.find(f => f.fileName === fileName);
      
      if (!file) {
        throw new Error(`File not found: ${fileName}`);
      }
      
      const response = await fetch(file.downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${fileName}: ${response.statusText}`);
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }
  
  export { listFiles, downloadFile, FileInfo };
  
  // Test snippet - uncomment to run
  async function test() {
    try {
      console.log('Fetching file list...');
      const files = await listFiles();
      console.log(`Found ${files.length} files`);
      
      // Show first 5 files
      console.log('\nFirst 5 files:');
      files.slice(0, 5).forEach((file, i) => {
        console.log(`${i + 1}. ${file.fileName} (${file.chain}) - ${file.sizeKB}KB`);
      });
      const buffer = await downloadFile('Price7290058160839-006-202505251024.gz');
      const fs = require('fs');
      fs.writeFileSync('Price7290058160839-006-202505251024.gz', Buffer.from(buffer));
      console.log('File saved as Price7290058160839-006-202505251024.gz');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Uncomment the line below to run the test
//   test();