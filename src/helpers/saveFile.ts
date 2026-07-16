import axios from "axios";
import fs from "fs/promises";
import {existsSync} from "fs";

async function saveFile(url: string, path: string) {
  // Bot API server в режиме --local возвращает в file_path абсолютный путь на диске
  const localPath = url.match(/\/file\/bot[^/]+(\/.+)$/)?.[1];
  if (localPath && existsSync(localPath)) {
    await fs.copyFile(localPath, path);
    return;
  }
  const {data} = await axios.get(url, {responseType: 'arraybuffer'}).catch(err => {
    throw new Error(`${err.message}: ${url}`);
  });
  await fs.writeFile(path, data);
}

export {saveFile};
