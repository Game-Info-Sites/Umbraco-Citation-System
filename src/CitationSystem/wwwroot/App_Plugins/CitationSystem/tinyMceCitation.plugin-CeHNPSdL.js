import { UmbTinyMcePluginBase as a } from "@tiny-mce-umbraco/backoffice/core";
import { G as o } from "./citationContext.controller-CkWFqr_D.js";
class d extends a {
  #t;
  constructor(t) {
    super(t), this.#t = t.editor;
  }
  static async extendEditorConfig(t) {
    const e = "sup[data-ref|class|style]", i = t.extended_valid_elements;
    t.extended_valid_elements = i ? `${i},${e}` : e;
    const n = "sup[data-ref]::after { content: '[cite]'; color: #2152a3; }", s = t.content_style;
    t.content_style = s ? `${s}
${n}` : n;
  }
  async init() {
    const t = new o(this);
    this.#t.on("PreInit", () => {
      this.#t.parser.addAttributeFilter("data-ref", (e) => {
        e.forEach((i) => {
          i.name === "sup" && i.attr("contenteditable", "false");
        });
      }), this.#t.serializer.addAttributeFilter("data-ref", (e) => {
        e.forEach((i) => i.attr("contentedittable", null));
      });
    }), this.#t.ui.registry.addButton(
      "gisCitation",
      {
        text: "Cite",
        onAction: async () => {
          const e = await t.pickCitation();
          e && this.#t.insertContent(`<sup data-ref="${e}"></sup>`);
        }
      }
    );
  }
}
export {
  d as default
};
//# sourceMappingURL=tinyMceCitation.plugin-CeHNPSdL.js.map
