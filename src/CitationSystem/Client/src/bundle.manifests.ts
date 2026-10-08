import { manifests as properties } from "./Properties/manifest.js";
import { manifests as modals } from "./Modals/manifest.js";
import { manifests as tinyMce } from "./TinyMCE/manifest.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...properties,
  ...modals,
  ...tinyMce
];
