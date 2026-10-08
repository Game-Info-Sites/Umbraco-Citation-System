const t = [
  {
    name: "Citation System Entrypoint",
    alias: "CitationSystem.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CUGMQ_2M.js")
  }
], a = [
  {
    name: "Citation System Dashboard",
    alias: "CitationSystem.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-BVNn2V3g.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], i = [
  ...t,
  ...a
];
export {
  i as manifests
};
//# sourceMappingURL=citation-system.js.map
