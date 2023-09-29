import test from 'node:test';
import {downloadOSUFile} from '../app/utils/osuUtils';
import * as path from 'path';
import {promises} from 'fs';
import assert from 'assert';

test('test osu file downloading', async t => {
  const result = await downloadOSUFile(75, path.join(process.cwd()));
  assert(result, 'download result is undefined');
  const content = await promises.readFile(result, {encoding: 'utf-8'});
  assert(content.startsWith('osu file format v'), 'not a valid .osu file');
});
