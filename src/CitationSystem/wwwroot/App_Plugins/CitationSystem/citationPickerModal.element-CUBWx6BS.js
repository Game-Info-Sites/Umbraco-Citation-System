import { html as n, css as C, state as y, customElement as M } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as w, umbOpenModal as P } from "@umbraco-cms/backoffice/modal";
import { C as T } from "./citationModal.token-ChFxn-9N.js";
import { C as $ } from "./citationContext.controller-CkWFqr_D.js";
var g = Object.defineProperty, A = Object.getOwnPropertyDescriptor, d = (t) => {
  throw TypeError(t);
}, p = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? A(e, i) : e, u = t.length - 1, c; u >= 0; u--)
    (c = t[u]) && (o = (s ? c(e, i, o) : c(o)) || o);
  return s && o && g(e, i, o), o;
}, I = (t, e, i) => e.has(t) || d("Cannot " + i), N = (t, e, i) => e.has(t) ? d("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), r = (t, e, i) => (I(t, e, "access private method"), i), a, f, h, _, m, v, b;
let l = class extends w {
  constructor() {
    super(...arguments), N(this, a), this._filter = "";
  }
  render() {
    return n`
      <umb-body-layout headline="Insert citation">
        <uui-box>
          ${this.data?.citationPropertyFound ? r(this, a, b).call(this) : r(this, a, v).call(this)}
        </uui-box>

        <div slot="actions">
          <uui-button label="Cencel" @click="${() => this._rejectModal()}"></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
a = /* @__PURE__ */ new WeakSet();
f = function(t) {
  this._filter = t.target.value ?? "";
};
h = function() {
  const t = this._filter.trim().toLowerCase(), e = this.data?.citations ?? [];
  return t ? e.filter((i) => (i.Title ?? "").toLowerCase().includes(t) || (i.SourceName ?? "").toLowerCase().includes(t)) : e;
};
_ = function(t) {
  this.value = { citation: t, isNew: !1 }, this._submitModal();
};
m = async function() {
  const t = await P(
    this,
    T,
    {
      data: { headline: "Add citation" },
      value: { ID: crypto.randomUUID(), Title: "", SourceName: "" }
    }
  ).catch(() => {
  });
  t && (this.value = { citation: t, isNew: !0 }, this._submitModal());
};
v = function() {
  return n`
      <p class="errorText">
        Error: A Citation Manager property was not found.
        <br />Please add a Citation Manager property to this document type and make sure its alias is set to <code>${$}</code>.
     </p>
    `;
};
b = function() {
  const t = r(this, a, h).call(this);
  return n`
      <div id="toolbar">
        <uui-input label="Filter citations" placeholder="Filter by title or source" .value="${this._filter}" @input="${r(this, a, f)}"></uui-input>
        <uui-button label="Add citation" look="outline" @click="${() => r(this, a, m).call(this)}"></uui-button>
      </div>

      ${t.length === 0 ? n`<p>No citations found.</p>` : ""}
      <uui-ref-list>
        ${t.map((e) => n`
          <uui-ref-node name="${e.Title}" detail="${e.SourceName}" @open="${() => r(this, a, _).call(this, e)}"></uui-ref-node>
        `)}
      </uui-ref-list>
    `;
};
l.styles = [
  C`
        .errorText { color: var(--uui-color-danger-standalone); }
        #toolbar { display: flex; gap: var(--uui-size-space-3); }
        #toolbar uui-input { flex: 1 }
      `
];
p([
  y()
], l.prototype, "_filter", 2);
l = p([
  M("gis-citation-picker-modal")
], l);
export {
  l as default
};
//# sourceMappingURL=citationPickerModal.element-CUBWx6BS.js.map
