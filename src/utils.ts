import crypto from "crypto";
import fs from "fs";
import path from "path";

export function pathExistsSync(filepath: string): boolean {
  try {
    fs.statSync(filepath);
    return true;
  } catch {
    return false;
  }
}

export function normalizeFilepath(filepath: string): string {
  return path.normalize(
    filepath
      // in Windows, filepath maybe `c:\foo\bar` tut the legal path should be `C:\foo\bar`
      .replace(/^([a-z]):\\/, (_, $1) => $1.toUpperCase() + ":\\")
      // There are some paths which are unix style, this style does not work on win32 systems
      .replace(/\//gm, path.sep),
  );
}

export function getDenoDir(): string {
  // ref https://deno.land/manual.html
  // On Linux/Redox: $XDG_CACHE_HOME/deno or $HOME/.cache/deno
  // On Windows: %LOCALAPPDATA%/deno (%LOCALAPPDATA% = FOLDERID_LocalAppData)
  // On macOS: $HOME/Library/Caches/deno
  // If something fails, it falls back to $HOME/.deno
  let denoDir = process.env.DENO_DIR;
  if (denoDir === undefined) {
    switch (process.platform) {
      case "win32":
        denoDir = `${process.env.LOCALAPPDATA}\\deno`;
        break;
      case "darwin":
        denoDir = `${process.env.HOME}/Library/Caches/deno`;
        break;
      case "linux":
        denoDir = process.env.XDG_CACHE_HOME
          ? `${process.env.XDG_CACHE_HOME}/deno`
          : `${process.env.HOME}/.cache/deno`;
        break;
      default:
        denoDir = `${process.env.HOME}/.deno`;
    }
  }

  return denoDir;
}

export function getDenoDepsDir(): string {
  return path.join(getDenoDir(), "deps");
}

export function isInDenoDir(filepath: string): boolean {
  filepath = normalizeFilepath(filepath);
  const denoDir = getDenoDir();
  return filepath.startsWith(denoDir);
}

export function isHttpURL(str: string): boolean {
  if (!str.startsWith("http://") && !str.startsWith("https://")) {
    return false;
  }

  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function hashURL(url: URL): string {
  return crypto
    .createHash("sha256")
    .update(url.pathname + url.search)
    .digest("hex");
}
