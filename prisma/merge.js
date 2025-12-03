import fs from 'fs';
import path from 'path';

const modelDir = path.join(__dirname, 'models');
const outputPath = path.join(__dirname, 'schema.prisma');

const modelFiles = fs.readdirSync(modelDir).filter((file) => file.endsWith('.prisma'));

let schemaContent = `generator client {
  previewFeatures = ["fullTextSearchPostgres"]
  provider = "prisma-client"
  output = "../src/prisma/generated"
}

datasource db {
  provider = "postgresql"
}`;

modelFiles.forEach((file) => {
  const modelContent = fs.readFileSync(path.join(modelDir, file), 'utf-8');
  schemaContent += `\n\n// ${file}\n${modelContent}`;
});

fs.writeFileSync(outputPath, schemaContent);
console.log('Prisma schema merged successfully!');
