
const citationManagerSchema: UmbExtensionManifest =
{
  type: 'propertyEditorSchema',
  name: 'Citation Manager Schema',
  alias: 'GameInfoSites.CitationSystem.CitationManagerSchema',
  meta: { defaultPropertyEditorUiAlias: 'GameInfoSites.CitationSystem.CitationManagerUi' }
}

const citationManagerUi: UmbExtensionManifest =
{
  type: 'propertyEditorUi',
  name: 'Citation Manager Property Editor UI',
  alias: 'GameInfoSites.CitationSystem.CitationManagerUi',
  element: () => import('./citationManager.element.ts'),
  elementName: 'gis-citation-manager-property-editor-ui',
  meta:
  {
    label: 'Citation Manager',
    icon: 'icon-quote',
    group: 'Citation System',
    propertyEditorSchemaAlias: 'GameInfoSites.CitationSystem.CitationManagerSchema'
  }
}

export const manifests: Array<UmbExtensionManifest> =
[
  citationManagerSchema,
  citationManagerUi
];
