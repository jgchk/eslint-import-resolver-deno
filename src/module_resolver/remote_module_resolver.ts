import path from "path";
import { getDenoDepsDir, hashURL, isHttpURL } from "../utils";
import { HashMeta } from "./hash_meta";
import { DenoResolvedModule, IModuleResolver } from "./types";
import { universalModuleResolver } from "./universal_module_resolver";

export const remoteModuleResolver: IModuleResolver = {
  resolve(
    moduleName: string,
    originModuleName: string = moduleName,
  ): DenoResolvedModule | undefined {
    const url = new URL(moduleName);

    const originDir = path.join(
      getDenoDepsDir(),
      url.protocol.replace(/:$/, ""),
      url.hostname,
    );

    const hash = hashURL(url);

    const metaFilepath = path.join(originDir, `${hash}.metadata.json`);

    const meta = HashMeta.create(metaFilepath);

    if (!meta) return;

    let redirect = meta.headers.location;

    if (redirect) {
      redirect = isHttpURL(redirect)
        ? redirect
        : path.posix.isAbsolute(redirect)
        ? `${url.protocol}//${url.host}${redirect}`
        : `${url.protocol}//${url.host}${
          path.posix.resolve(url.pathname, redirect)
        }`;

      if (!isHttpURL(redirect) || redirect === moduleName) return;

      return universalModuleResolver.resolve(redirect, originModuleName);
    }

    const moduleFilepath = path.join(originDir, hash);

    const typescriptTypes = meta.headers["x-typescript-types"];
    if (typescriptTypes) {
      const typeModule = universalModuleResolver.resolve(
        typescriptTypes,
        originModuleName,
      );

      if (typeModule) return typeModule;
    }

    return {
      originModuleName,
      filepath: moduleFilepath,
      extension: meta.extension,
    };
  },
};
