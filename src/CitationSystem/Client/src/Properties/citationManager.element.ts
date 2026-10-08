import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";
import { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import { umbConfirmModal, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { CITATION_MODAL } from "../Modals/citationModal.token";

@customElement('gis-citation-manager-property-editor-ui')
export default class GisCitationManagerPropertyEditorUiElement extends UmbFormControlMixin<CitationRecordPropertyValue[] | undefined, typeof UmbLitElement>(UmbLitElement, undefined) implements UmbPropertyEditorUiElement
{
  @state()
  private _filter = '';

  #onFilterInput(e: Event)
  {
    this._filter = ((e.target as UUIInputElement).value as string) ?? '';
  }

  #getFilteredCitations(): CitationRecordPropertyValue[]
  {
    const all = this.value ?? [];
    const term = this._filter.trim().toLowerCase();
    if (!term) return all;
    return all.filter((citation) => (citation.Title).toLowerCase().includes(term) || (citation.SourceName ?? '').toLowerCase().includes(term));
  }

  async #addCitation()
  {
    const citation = await umbOpenModal(this, CITATION_MODAL,
      {
        data: { headline: 'Add citation' },
        value: { ID: crypto.randomUUID(), Title: '', SourceName: '' }
      }).catch(() => undefined);

    if (!citation) return;
    this.value = [...(this.value ?? []), citation];
    this.dispatchEvent(new UmbChangeEvent());
  }

  async #editCitation(citation: CitationRecordPropertyValue)
  {
    const updatedCitation = await umbOpenModal(this, CITATION_MODAL,
      {
        data: { headline: 'Edit citation' },
        value: { ...citation }
      }).catch(() => undefined);

    if (!updatedCitation) return;
    this.value = (this.value ?? []).map((existing) => (existing.ID === updatedCitation.ID ? updatedCitation : existing));
    this.dispatchEvent(new UmbChangeEvent());
  }

  async #removeCitation(citation: CitationRecordPropertyValue)
  {
    await umbConfirmModal(this,
      {
        color: 'danger',
        headline: 'Remove ' + citation.Title + '?',
        content: 'Are you sure you with to remove this citation?',
        confirmLabel: 'Remove Citation',
      });

    this.value = (this.value ?? []).filter((c) => c.ID !== citation.ID);
    this.dispatchEvent(new UmbChangeEvent());
  }

  override render()
  {
    const citations = this.#getFilteredCitations();

    return html`
      <div id="toolbar">
        <uui-input id="filter" type="search" label="Filter Citations" placeholder="Filter citation by title or source" .value="${this._filter}" @input="${this.#onFilterInput}">
          <div slot="prepend">
            <uui-icon name="icon-search"></uui-icon>
          </div>
        </uui-input>

        <uui-button look="secondary" label="Add Citation" @click="${this.#addCitation}">
          <uui-icon name="icon-add"></uui-icon> Add citation
        </uui-button>
      </div>

      <uui-scroll-container id="citationList" enforce-scroll>
        <uui-ref-list>
          ${repeat(citations, (citation) => citation.ID, (citation) => this.#renderCitation(citation))}
        </uui-ref-list>
      </uui-scroll-container>

      ${this._filter && citations.length === 0 ? html`<p>No citations match "${this._filter}".</p>` : nothing}

     <p>${this.value?.length ?? 0} citation(s)</p>
    `;
  }

  #renderCitation(c: CitationRecordPropertyValue)
  {
    return html`
      <uui-ref-node readonly name="${c.Title}" detail="${c.SourceName ?? ''}">
        <uui-action-bar slot="actions">
          <uui-button label="Edit Citation" look="secondary" @click="${() => this.#editCitation(c)}">
            <uui-icon name="icon-edit"></uui-icon>
          </uui-button>

          <uui-button label="Remove Citation" look="secondary" color="danger" @click="${() => this.#removeCitation(c)}">
            <uui-icon name="icon-delete"></uui-icon>
          </uui-button>
        </uui-action-bar>
      </uui-ref-node>
    `;
  }

  static override styles =
    [
      css`
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
}

declare global
{
  interface HTMLElementTagNameMap
  {
    'gis-citation-manager-property-editor-ui': GisCitationManagerPropertyEditorUiElement;
  }
}
