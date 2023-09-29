import {getAllFiles} from '@a73/get-all-files-ts';
import path from 'path';

(async () => {
  const testsDir = path.join(process.cwd(), 'tests');
  const files = await getAllFiles(testsDir).toArray();
  for (const file of files) {
    if (file && file.endsWith('.test.ts')) {
      await import(file as string);
    }
  }
})();
