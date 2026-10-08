import { html as d, css as v, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as $ } from "@umbraco-cms/backoffice/modal";
var _ = Object.getOwnPropertyDescriptor, p = (t) => {
  throw TypeError(t);
}, f = (t, e, a, r) => {
  for (var s = r > 1 ? void 0 : r ? _(e, a) : e, o = t.length - 1, c; o >= 0; o--)
    (c = t[o]) && (s = c(s) || s);
  return s;
}, x = (t, e, a) => e.has(t) || p("Cannot " + a), g = (t, e, a) => e.has(t) ? p("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), u = (t, e, a) => (x(t, e, "access private method"), a), i, h, m, l, b;
let n = class extends $ {
  constructor() {
    super(...arguments), g(this, i);
  }
  render() {
    return d`
      <umb-body-layout headline="${this.data?.headline ?? "Citation"}">
        <uui-box>
          ${u(this, i, l).call(this, "Title", "Title", "text", !0)}
          ${u(this, i, l).call(this, "Source name", "SourceName", "text", !0)}
          ${u(this, i, l).call(this, "URL", "Url", "url")}
          <umb-property-layout label="Authors" description="One author per line">
            <uui-textarea slot="editor" label="Authors" .value="${(this.value?.Authors ?? []).join(`
`)}" @change="${u(this, i, m)}"></uui-textarea>
          </umb-property-layout>
          ${u(this, i, l).call(this, "Published date", "PublishedDate", "date")}
          ${u(this, i, l).call(this, "Accessed date", "AccessedDate", "date")}
          ${u(this, i, l).call(this, "Publisher", "Publisher")}
          ${u(this, i, l).call(this, "Page", "Page")}
          <umb-property-layout label="Note">
            <uui-textarea slot="editor" label="Note" .value="${this.value?.Note ?? ""}" @input="${(t) => u(this, i, h).call(this, "Note", t)}"></uui-textarea>
          </umb-property-layout>
        </uui-box>

        <div slot="actions">
          <uui-button label="Cancel" @click="${() => this._rejectModal()}"></uui-button>
          <uui-button label="Submit" look="primary" color="positive" ?disabled="${!this.value?.Title?.trim() || !this.value?.SourceName?.trim()}" @click="${() => u(this, i, b).call(this)}"></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
i = /* @__PURE__ */ new WeakSet();
h = function(t, e) {
  const a = e.target.value ?? "";
  this.updateValue({ [t]: a || void 0 });
};
m = function(t) {
  const e = (t.target.value ?? "").split(`
`).map((a) => a.trim()).filter(Boolean);
  this.updateValue({ Authors: e.length > 0 ? e : void 0 });
};
l = function(t, e, a = "text", r = !1) {
  return d`
      <umb-property-layout label="${t}" ?mandatory="${r}">
        <uui-input slot="editor" type="${a}" label="${t}" .value="${this.value?.[e] ?? ""}" @input="${(s) => u(this, i, h).call(this, e, s)}"></uui-input>
      </umb-property-layout>
    `;
};
b = function() {
  const t = Object.fromEntries(
    Object.entries(this.value ?? {}).map(([e, a]) => [
      e,
      typeof a == "string" ? a.trim() || void 0 : a
    ])
  );
  this.value = t, this._submitModal();
};
n.styles = [
  v`
      uui-input, uui-textarea { width: 100%; }
  `
];
n = f([
  y("gis-citation-modal")
], n);
export {
  n as default
};
//# sourceMappingURL=citationModal.element-8FzeSa2H.js.map
