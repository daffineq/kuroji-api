import fs from 'fs';
import path from 'path';

const dtoDir = './src/generated/nestjs-dto';

function processDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDir(filePath); // Recursively process subdirectories
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/(from '.+?)((?:\.entity|\.model|\.dto))(')/g, '$1$2.js$3');
      fs.writeFileSync(filePath, content);
    }
  }
}

processDir(dtoDir);