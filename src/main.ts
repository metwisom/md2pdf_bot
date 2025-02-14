import TelegramBot from 'node-telegram-bot-api';
import {workFile} from './utils/workFile';
import {saveFile} from './helpers/saveFile';
import {Logger} from '@metwisom/logger';
import {generateRandomString} from './helpers/generateRandomString';
import {getFileExtension} from './helpers/getFileExtension';
import {validateFileEncoding} from './utils/validateFileEncoding';
import {replaceSvgLinks} from './utils/replaceSvgLinks';
import fs from "fs";
import {convertMermaidToPng} from "./utils/convertMermaidToPng";
import {getFilePath} from "./helpers/getFilePath";


process.env.NTBA_FIX_350 = true;

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});


bot.on('message', async (msg) => {

  const Log = new Logger();
  const chatId = msg.chat.id;
  Log.setPrefix(msg.message_id.toString());

  const convertMDtoPDF = async function (url: string, filename: string) {
    const fileExtension = getFileExtension(filename);

    const randomString = generateRandomString();
    const tmpName = `${randomString}.${fileExtension}`;
    const tmpPath = `/tmp/${tmpName}`;

    if (fileExtension !== 'md') {
      Log.log('документ не md формата');
      throw new Error('Пожалуйста, отправьте документ c расширением MD');
    }

    Log.log('сохранение документа');
    await saveFile(url, tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });

    Log.log('проверка на UTF-8');
    await validateFileEncoding(tmpPath).catch(err => {
      Log.log(err);
      throw new Error('Отправьте документ в кодировке UTF-8');
    })

    Log.log('очистка от svg');
    await replaceSvgLinks(tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });

    Log.log('обработка meramid');
    const merTmpPath = getFilePath(tmpPath) + generateRandomString(10) + "/";
    const file = fs.readFileSync(tmpPath).toString();
    let clearFile = file.replaceAll(/<pre>.*?<\/pre>/gs, '');
    const match = clearFile.match(/```mermaid(?<val>.*?)```/gs);

    if (!fs.existsSync(merTmpPath)) {
      fs.mkdirSync(merTmpPath);
    }

    const result = match?.map(async (i, v) => {
      const value = /```mermaid(?<val>.*?)```/gsm.exec(i);
      if (value != undefined)
        fs.writeFileSync(merTmpPath + v + '.mmd', value[1] as string);
      const inputFile = merTmpPath + v + '.mmd';
      const outputFile = merTmpPath + v + '.png';
      await convertMermaidToPng(inputFile, outputFile).catch(console.error);
      if (value && value[0]) {
        clearFile = clearFile.replace(value[0].toString(), "![mermaid_" + v + "](" + outputFile + ")");
      }
    });
    if (result && result.length > 0) {
      await Promise.all(result);
    }
    fs.writeFileSync(tmpPath, clearFile);

    Log.log('конвертация файла');
    return await workFile(tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });
  };



  Log.log(`новый запрос, message_id: ${msg.message_id}, chat_id: ${chatId}`);

  if (!msg.document) {
    Log.log('документ не прикреплен');
    await bot.sendMessage(chatId, 'Пожалуйста, отправьте документ');
    return;
  }

  const fileId = msg.document.file_id;
  const fileUrl = await bot.getFileLink(fileId);
  const originalFileName = msg.document.file_name as string;


  convertMDtoPDF(fileUrl, originalFileName)
          .then(async newPath => {
            await bot.sendDocument(chatId, newPath, {}, {
              filename: `${originalFileName}.pdf`,
              contentType: 'application/pdf',
            });
          })
          .catch(async err => {
             await bot.sendMessage(chatId, err.message);
          });


  Log.log('обработка завершена');
});
