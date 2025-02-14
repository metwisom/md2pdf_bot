import fs from 'fs/promises';
import chardet from 'chardet';


async function validateFileEncoding(filePath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const fileBuffer = await fs.readFile(filePath);
    if (chardet.detect(fileBuffer) != 'UTF-8') {
      reject(chardet.detect(fileBuffer)?.toString());
    } else {
      resolve();
    }
  });
}

export {validateFileEncoding};