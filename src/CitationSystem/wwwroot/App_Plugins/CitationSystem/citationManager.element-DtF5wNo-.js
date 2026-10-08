import { nothing as w, repeat as E, html as c, css as $, state as D, customElement as I } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as L } from "@umbraco-cms/backoffice/lit-element";
import { UmbFormControlMixin as A } from "@umbraco-cms/backoffice/validation";
import { UmbChangeEvent as d } from "@umbraco-cms/backoffice/event";
import { umbOpenModal as h, umbConfirmModal as M } from "@umbraco-cms/backoffice/modal";
import { C as p } from "./citationModal.token-ChFxn-9N.js";
var O = Object.defineProperty, T = Object.getOwnPropertyDescriptor, m = (t) => {
  throw TypeError(t);
}, f = (t, i, e, r) => {
  for (var a = r > 1 ? void 0 : r ? T(i, e) : i, u = t.length - 1, l; u >= 0; u--)
    (l = t[u]) && (a = (r ? l(i, e, a) : l(a)) || a);
  return r && a && O(i, e, a), a;
}, U = (t, i, e) => i.has(t) || m("Cannot " + e), x = (t, i, e) => i.has(t) ? m("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(t) : i.set(t, e), n = (t, i, e) => (U(t, i, "access private method"), e), o, v, _, C, b, y, g;
let s = class extends A(L, void 0) {
  constructor() {
    super(...arguments), x(this, o), this._filter = "";
  }
  render() {
    const t = n(this, o, _).call(this);
    return c`
      <div id="toolbar">
        <uui-input id="filter" type="search" label="Filter Citations" placeholder="Filter citation by title or source" .value="${this._filter}" @input="${n(this, o, v)}">
          <div slot="prepend">
            <uui-icon name="icon-search"></uui-icon>
          </div>
        </uui-input>

        <uui-button look="secondary" label="Add Citation" @click="${n(this, o, C)}">
          <uui-icon name="icon-add"></uui-icon> Add citation
        </uui-button>
      </div>

      <uui-scroll-container id="citationList" enforce-scroll>
        <uui-ref-list>
          ${E(t, (i) => i.ID, (i) => n(this, o, g).call(this, i))}
        </uui-ref-list>
      </uui-scroll-container>

      ${this._filter && t.length === 0 ? c`<p>No citations match "${this._filter}".</p>` : w}

     <p>${this.value?.length ?? 0} citation(s)</p>
    `;
  }
};
o = /* @__PURE__ */ new WeakSet();
v = function(t) {
  this._filter = t.target.value ?? "";
};
_ = function() {
  const t = this.value ?? [], i = this._filter.trim().toLowerCase();
  return i ? t.filter((e) => e.Title.toLowerCase().includes(i) || (e.SourceName ?? "").toLowerCase().includes(i)) : t;
};
C = async function() {
  const t = await h(
    this,
    p,
    {
      data: { headline: "Add citation" },
      value: { ID: crypto.randomUUID(), Title: "", SourceName: "" }
    }
  ).catch(() => {
  });
  t && (this.value = [...this.value ?? [], t], this.dispatchEvent(new d()));
};
b = async function(t) {
  const i = await h(
    this,
    p,
    {
      data: { headline: "Edit citation" },
      value: { ...t }
    }
  ).catch(() => {
  });
  i && (this.value = (this.value ?? []).map((e) => e.ID === i.ID ? i : e), this.dispatchEvent(new d()));
};
y = async function(t) {
  await M(
    this,
    {
      color: "danger",
      headline: "Remove " + t.Title + "?",
      content: "Are you sure you with to remove this citation?",
      confirmLabel: "Remove Citation"
    }
  ), this.value = (this.value ?? []).filter((i) => i.ID !== t.ID), this.dispatchEvent(new d());
};
g = function(t) {
  return c`
      <uui-ref-node readonly name="${t.Title}" detail="${t.SourceName ?? ""}">
        <uui-action-bar slot="actions">
          <uui-button label="Edit Citation" look="secondary" @click="${() => n(this, o, b).call(this, t)}">
            <uui-icon name="icon-edit"></uui-icon>
          </uui-button>

          <uui-button label="Remove Citation" look="secondary" color="danger" @click="${() => n(this, o, y).call(this, t)}">
            <uui-icon name="icon-delete"></uui-icon>
          </uui-button>
        </uui-action-bar>
      </uui-ref-node>
    `;
};
s.styles = [
  $`
        #toolbar
        {
          display: flex;
          align-items: center;
          gap: var(--uui-size-space-3);
          margin-bottom: var(--uui-size-space-3);
        }

        #filter { flex: 1; }

        #citationList { max-height: 365px; }
      `
];
f([
  D()
], s.prototype, "_filter", 2);
s = f([
  I("gis-citation-manager-property-editor-ui")
], s);
export {
  s as default
};
//# sourceMappingURL=citationManager.element-DtF5wNo-.js.map
