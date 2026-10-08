import type { ManifestTinyMcePlugin } from '@tiny-mce-umbraco/backoffice/core';

const tinyMceCitationPlugin: ManifestTinyMcePlugin =
{
  type: 'tinyMcePlugin',
  name: 'TinyMCE Citation Plugin',
  alias: 'GameInfoSites.CitationSystem.TinyMceCitationPlugin',
  api: () => import('./tinyMceCitation.plugin.ts'),
  meta:
  {
    toolbar: [{ alias: 'gisCitation', label: 'Citation', icon: 'quote' }]
  }
}

export const manifests: Array<UmbExtensionManifest> =
  [
    tinyMceCitationPlugin
  ];
