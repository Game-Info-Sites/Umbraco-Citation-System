const citationModal: UmbExtensionManifest =
{
  type: 'modal',
  alias: 'GameInfoSites.CitationSystem.CitationModal',
  name: 'Citation Modal',
  element: () => import('./citationModal.element.ts')
}

const citationPickerModal: UmbExtensionManifest =
{
  type: 'modal',
  alias: 'GameInfoSites.CitationSystem.CitationPickerModal',
  name: 'Citation Picker Modal',
  element: () => import('./citationPickerModal.element.ts')
}

export const manifests: Array<UmbExtensionManifest> =
[
    citationModal,
    citationPickerModal
];
