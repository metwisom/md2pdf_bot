import path from "path";
import {exec} from "child_process";

function convertMermaidToPng(inputPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    const mmdcPath = path.resolve(__dirname, '../node_modules/.bin/mmdc');
    const command = `node ${mmdcPath} -i ${inputPath} -o ${outputPath} -p /puppeteer-config.json`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        reject(`Stderr: ${stderr}`);
      } else {
        resolve(stdout || 'Conversion successful');
      }
    });
  });
}

export {convertMermaidToPng};