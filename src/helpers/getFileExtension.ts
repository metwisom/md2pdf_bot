function getFileExtension(filename: string) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1] : '';
}

export {getFileExtension};