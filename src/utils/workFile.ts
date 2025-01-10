import fs from "fs";
import {execPromise} from "../helpers/execPromise";

async function workFile(path: string) {
  const newPath = `${path}.pdf`;
  if (!fs.existsSync(path)) {
    throw new Error(`файл не найден: ${path}`);
  }
  const execCommand = `pandoc --pdf-engine=xelatex --toc-depth=1 -V pagestyle=empty -V geometry:margin=1cm -V mainfont='Lato' "${path}" -o "${newPath}"`;
  await execPromise(execCommand).catch(err => {
    throw new Error(err);
  });
  return newPath;
}

export {workFile};