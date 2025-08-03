import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const targetDir = './src/generated/nestjs-dto';

const files = await glob(`${targetDir}/**/*.entity.ts`);

for (const file of files) {
  let content = await fs.promises.readFile(file, 'utf8');

  // Replace `type: () => SomeClass` with `type: () => Object` to avoid circular import crashes
  content = content.replace(
    /type:\s*\(\)\s*=>\s*[A-Z]\w+/g,
    'type: () => Object'
  );

  await fs.promises.writeFile(file, content, 'utf8');
  //console.log(`Patched: ${file}`);
}
