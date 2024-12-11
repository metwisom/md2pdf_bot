import fs from "fs/promises";
import chardet from "chardet";

async function fileIsValid(path: string): Promise<boolean> {
  const buffer = await fs.readFile(path);
  const isUTF8 = chardet.detect(buffer) === 'UTF-8';
  if (!isUTF8) {
    throw new Error('документ не соответствует UTF-8');
  }
  return isUTF8;
}

export {fileIsValid};
