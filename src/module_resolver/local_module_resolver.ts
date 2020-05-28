import path from "path";
import { pathExistsSync } from "../utils";
import { DenoExtension, DenoResolvedModule, IModuleResolver } from "./types";

export function getExtensionFromFile(filename: string): DenoExtension {
  const extName = path.extname(filename);

  if (extName === ".ts") {
    if (/\.d\.ts$/.test(filename)) {
      return ".d.ts";
    }
  }

  return extName as DenoExtension;
}

export const localModuleResolver: IModuleResolver = {
  resolve(
    moduleName: string,
    originModuleName: string = moduleName,
  ): DenoResolvedModule | undefined {
    if (!pathExistsSync(moduleName)) {
      return;
    }

    return {
      originModuleName,
      filepath: moduleName,
      extension: getExtensionFromFile(moduleName),
    };
  },
};
