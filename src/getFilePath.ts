function getFilePath(filePath: string): string | null {
  const lastSlashIndex = filePath.lastIndexOf('/');
  if (lastSlashIndex === -1) {
    return '';
  }
  return filePath.slice(0, lastSlashIndex + 1);
}


export {getFilePath};