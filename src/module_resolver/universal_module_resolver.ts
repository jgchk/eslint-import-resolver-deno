import { isHttpURL } from "../utils";
import { localModuleResolver } from "./local_module_resolver";
import { remoteModuleResolver } from "./remote_module_resolver";
import { DenoResolvedModule, IModuleResolver } from "./types";

export const universalModuleResolver: IModuleResolver = {
  resolve(
    moduleName: string,
    originModuleName: string = moduleName,
  ): DenoResolvedModule | undefined {
    // if import is from remote
    if (isHttpURL(moduleName)) {
      return remoteModuleResolver.resolve(moduleName, originModuleName);
    }

    return localModuleResolver.resolve(moduleName, originModuleName);
  },
};
