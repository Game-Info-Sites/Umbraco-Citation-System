const t = {
  type: "propertyEditorSchema",
  name: "Citation Manager Schema",
  alias: "GameInfoSites.CitationSystem.CitationManagerSchema",
  meta: { defaultPropertyEditorUiAlias: "GameInfoSites.CitationSystem.CitationManagerUi" }
}, i = {
  type: "propertyEditorUi",
  name: "Citation Manager Property Editor UI",
  alias: "GameInfoSites.CitationSystem.CitationManagerUi",
  element: () => import("./citationManager.element-DtF5wNo-.js"),
  elementName: "gis-citation-manager-property-editor-ui",
  meta: {
    label: "Citation Manager",
    icon: "icon-quote",
    group: "Citation System",
    propertyEditorSchemaAlias: "GameInfoSites.CitationSystem.CitationManagerSchema"
  }
}, a = [
  t,
  i
], e = {
  type: "modal",
  alias: "GameInfoSites.CitationSystem.CitationModal",
  name: "Citation Modal",
  element: () => import("./citationModal.element-8FzeSa2H.js")
}, n = {
  type: "modal",
  alias: "GameInfoSites.CitationSystem.CitationPickerModal",
  name: "Citation Picker Modal",
  element: () => import("./citationPickerModal.element-CUBWx6BS.js")
}, o = [
  e,
  n
], m = {
  type: "tinyMcePlugin",
  name: "TinyMCE Citation Plugin",
  alias: "GameInfoSites.CitationSystem.TinyMceCitationPlugin",
  api: () => import("./tinyMceCitation.plugin-CeHNPSdL.js"),
  meta: {
    toolbar: [{ alias: "gisCitation", label: "Citation", icon: "quote" }]
  }
}, s = [
  m
], r = [
  ...a,
  ...o,
  ...s
];
export {
  r as manifests
};
//# sourceMappingURL=citation-system.js.map
