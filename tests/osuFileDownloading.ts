import test from "node:test";
import { downloadOSUFile } from "../utils/osuUtils";
import { join } from "path";

test("test osu file downloading", async (t) => {
  const result = await downloadOSUFile(75, join(process.cwd()));
  console.log(result);
});