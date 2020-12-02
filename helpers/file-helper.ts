import { Path } from "../deps.ts";

/**
 * File Helper class
 */
export class FileHelper {
  /**
   * Get directory content
   * @param path string Path
   */
  public static async getFiles(path: string): Promise<Array<Deno.DirEntry>> {
    const items: Array<Deno.DirEntry> = [];

    path = Path.resolve(path);

    for await (const dirEntry of Deno.readDir(path)) {
      items.push(dirEntry);
    }

    return items;
  }

  /**
   * Import a file
   * @param file string Module path
   */
  public static async importFile(path: string): Promise<any> {
    path = Path.resolve(path);
    const module = await import(path);

    return module;
  }
}
