import fs from "fs";
import {
  ImportMaps,
  parseFromString,
  resolve as resolveWithImportMap,
} from "import-maps";
import path from "path";
import { fileURLToPath, URL } from "url";
import { HashMeta } from "./module_resolver/hash_meta";
import { universalModuleResolver } from "./module_resolver/universal_module_resolver";
import { isInDenoDir, normalizeFilepath, pathExistsSync } from "./utils";

export const interfaceVersion = 2;

function parseImportMapFromFile(cwd?: string, file?: string): ImportMaps {
  const importMaps = {
    imports: {},
    scopes: {},
  };

  if (file == null) {
    return importMaps;
  }

  cwd = cwd || process.cwd()

  if (!path.isAbsolute(file)) {
    file = path.resolve(cwd, file);
  }

  const fullFilePath = normalizeFilepath(file);

  if (!pathExistsSync(fullFilePath)) {
    return importMaps;
  }

  const content = fs.readFileSync(fullFilePath, { encoding: "utf8" });

  try {
    return parseFromString(content, `file://${cwd}/`);
  } catch {
    return importMaps;
  }
}

function parseModuleName(
  moduleName: string,
  containingFile: string,
  parsedImportMap?: ImportMaps | null,
) {
  if (parsedImportMap != null) {
    try {
      let scriptURL: URL;
      if (isInDenoDir(containingFile)) {
        const meta = HashMeta.create(`${containingFile}.metadata.json`);
        if (meta && meta.url) {
          scriptURL = meta.url;
        } else {
          scriptURL = new URL("file:///" + path.dirname(containingFile) + "/");
        }
      } else {
        scriptURL = new URL("file:///" + path.dirname(containingFile) + "/");
      }

      const moduleUrl = resolveWithImportMap(
        moduleName,
        parsedImportMap,
        scriptURL,
      );

      if (moduleUrl.protocol === "file:") {
        return fileURLToPath(moduleUrl.href);
      }

      if (moduleUrl.protocol === "http:" || moduleUrl.protocol === "https:") {
        return moduleUrl.href;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }
}

function resolveDenoModule(moduleName: string) {
  return universalModuleResolver.resolve(moduleName);
}

export function resolve(
  moduleName: string,
  containingFile: string,
  config?: { importMap?: string },
) {
  const parsedImportMap = parseImportMapFromFile(config?.importMap);

  const parsedModuleName = parseModuleName(
    moduleName,
    containingFile,
    parsedImportMap,
  );

  if (parsedModuleName == null) {
    return { found: false };
  }

  const resolvedModule = resolveDenoModule(parsedModuleName);

  if (!resolvedModule) {
    return { found: false };
  }

  return { found: true, path: resolvedModule.filepath };
}
