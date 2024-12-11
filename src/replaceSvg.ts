import fs from "fs/promises";


async function replaceSvg(path: string) {
  let content = await fs.readFile(path, 'utf8');
  const svgRegex = /\(.*\/(.*?\.svg).*?\)/g;
  content = content.replace(svgRegex, "($1)");
  await fs.writeFile(path, content, "utf-8");
}

export {replaceSvg};