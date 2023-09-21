import * as path from "https://deno.land/std@0.201.0/path/mod.ts";


export async function* recursiveReaddir(
    filepath: string
): AsyncGenerator<string, void> {
    for await (const dirEntry of Deno.readDir(filepath)) {
        if (dirEntry.isDirectory) {
            yield* recursiveReaddir(path.join(filepath, dirEntry.name));
        } else if (dirEntry.isFile) {
            yield path.relative(Deno.cwd(), path.join(filepath, dirEntry.name));
        }
    }
}