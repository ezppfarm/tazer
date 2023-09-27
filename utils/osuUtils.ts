import {writeFile} from 'fs/promises';
import {join} from 'path';

export const downloadOSUFile = async (beatmapId: number, dest: string) => {
  const request = await fetch(`https://osu.ppy.sh/osu/${beatmapId}`);
  const isValidRequest =
    request.ok && request.headers.has('Content-Disposition');
  if (!isValidRequest) return undefined;
  const fileData = await request.arrayBuffer();
  const filePath = join(dest, `${beatmapId}.osu`);
  await writeFile(filePath, Buffer.from(fileData));
  return filePath;
};
