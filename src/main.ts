import TelegramBot from 'node-telegram-bot-api';
import {workFile} from './fileConverter';
import {saveFile} from './saveFile';
import {Logger} from '@metwisom/logger';
import {generateRandomString} from './generateRandomString';
import {getFileExtension} from './getFileExtension';
import {fileIsValid} from './fileIsValid';
import {replaceSvg} from './replaceSvg';

process.env.NTBA_FIX_350 = true;

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.on('message', async (msg) => {
  const Log = new Logger();
  const chatId = msg.chat.id;
  Log.setPrefix(msg.message_id.toString());

  Log.log(`новый запрос, message_id: ${msg.message_id}, chat_id: ${chatId}`);

  if (!msg.document) {

    Log.log('документ не прикреплен');
    await bot.sendMessage(chatId, 'Пожалуйста, отправьте документ');
    return;
  }

  const fileId = msg.document.file_id;
  const originalFileName = msg.document.file_name as string;
  const fileExtension = getFileExtension(originalFileName);

  const randomString = generateRandomString();
  const tmpName = `${randomString}.${fileExtension}`;
  const tmpPath = `/tmp/${tmpName}`;

  if (fileExtension !== 'md') {
    Log.log('документ не md формата');
    await bot.sendMessage(chatId, 'Пожалуйста, отправьте документ c расширением MD');
    return;
  }

  try {
    const fileUrl = await bot.getFileLink(fileId);

    Log.log('сохранение документа');
    await saveFile(fileUrl, tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });
    Log.log('документ сохранен: ' + tmpPath);

    Log.log('проверка на UTF-8');
    await fileIsValid(tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Отправьте документ в кодировке UTF-8');
    });
    Log.log('документ соответствует UTF-8');

    Log.log('очистка от svg');
    await replaceSvg(tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });
    Log.log('документ очищен от svg');

    Log.log('конвертация файла');
    const newPath = await workFile(tmpPath).catch(err => {
      Log.error(err.message);
      throw new Error('Ошибка при обработке вашего файла');
    });
    Log.log(`PDF создан: ${newPath}`);


    await bot.sendDocument(chatId, newPath, {}, {
      filename: `${originalFileName}.pdf`,
      contentType: 'application/pdf',
    });

    Log.log('обработка завершена');
  } catch (err: any) {
    await bot.sendMessage(chatId, err.message || 'Произошла ошибка, попробуйте позже');
  }
});
