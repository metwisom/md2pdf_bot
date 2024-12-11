import axios from "axios";
import fs from "fs/promises";

async function saveFile(url: string, path: string) {
  const {data} = await axios.get(url, {responseType: 'arraybuffer'});
  await fs.writeFile(path, data);
}

export {saveFile};
