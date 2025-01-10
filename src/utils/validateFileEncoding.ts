import fs from 'fs/promises';
import chardet from 'chardet';


async function validateFileEncoding(filePath: string): Promise<boolean> {
    const fileBuffer = await fs.readFile(filePath);
    return chardet.detect(fileBuffer) == 'UTF-8';
}

export { validateFileEncoding };