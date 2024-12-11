import {exec} from "child_process";

function execPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${stderr || error.message}`);
        return;
      }
      resolve(stdout || "Execution completed successfully.");
    });
  });
}

export {execPromise};