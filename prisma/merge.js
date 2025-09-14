import fs from 'fs';
import path from 'path';

// Paths to your model files
const modelDir = path.join(__dirname, 'models');
const outputPath = path.join(__dirname, 'schema.prisma');

// Read all models from the "models" folder
const modelFiles = fs.readdirSync(modelDir).filter((file) => file.endsWith('.prisma'));

// Start of the schema.prisma file (generator and datasource)
let schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`;

// Add all models from the "models" folder
modelFiles.forEach((file) => {
  const modelContent = fs.readFileSync(path.join(modelDir, file), 'utf-8');
  schemaContent += `\n\n// ${file}\n${modelContent}`;
});

// Write the merged schema content to schema.prisma
fs.writeFileSync(outputPath, schemaContent);
console.log('Prisma schema merged successfully!');
