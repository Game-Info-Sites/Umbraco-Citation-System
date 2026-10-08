import { UMB_DOCUMENT_WORKSPACE_CONTEXT as e } from "@umbraco-cms/backoffice/document";
import { UmbControllerBase as r } from "@umbraco-cms/backoffice/class-api";
import { UmbModalToken as n, umbOpenModal as c } from "@umbraco-cms/backoffice/modal";
const C = new n(
  "GameInfoSites.CitationSystem.CitationPickerModal",
  {
    modal: {
      type: "sidebar",
      size: "small"
    }
  }
), o = "citationManager";
class d extends r {
  #t;
  #i = [];
  constructor(i) {
    super(i), this.consumeContext(e, async (t) => {
      if (this.#t = t, !t) return;
      const s = await t.propertyValueByAlias(o);
      this.observe(s, (a) => {
        this.#i = a ?? [];
      }, "gisObserveCitations");
    }).passContextAliasMatches();
  }
  async pickCitation() {
    const i = await this.#t?.structure.getPropertyStructureByAlias(o), t = await c(this, C, { data: { citations: this.#i, citationPropertyFound: i !== void 0 } }).catch(() => {
    });
    if (t)
      return t.isNew && await this.#t?.setPropertyValue(o, [...this.#i, t.citation]), t.citation.ID;
  }
}
export {
  o as C,
  d as G
};
//# sourceMappingURL=citationContext.controller-CkWFqr_D.js.map
