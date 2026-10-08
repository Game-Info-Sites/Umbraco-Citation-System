import { css, customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import type { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import type { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";
import type { CitationPickerModalData, CitationPickerModalValue } from "./citationPickerModal.token";
import { CITATION_MODAL } from "./citationModal.token";
import { CITATION_PROPERTY_ALIAS } from "../Core/citationContext.controller";

@customElement('gis-citation-picker-modal')
export default class GisCitationPickerModalElement extends UmbModalBaseElement<CitationPickerModalData, CitationPickerModalValue>
{
  @state()
  private _filter = ''

  #onFilterInput(e: Event)
  {
    this._filter = ((e.target as UUIInputElement).value as string) ?? '';
  }

  #getFilteredCitations(): CitationRecordPropertyValue[]
  {
    const filter = this._filter.trim().toLowerCase();
    const citations = this.data?.citations ?? [];
    if (!filter) return citations;
    return citations.filter((citation) => (citation.Title ?? '').toLowerCase().includes(filter) || (citation.SourceName ?? '').toLowerCase().includes(filter));
  }

  #submitCitation(citation: CitationRecordPropertyValue)
  {
    this.value = { citation, isNew: false };
    this._submitModal();
  }

  async #addCitation()
  {
    const citation = await umbOpenModal(this, CITATION_MODAL,
    {
      data: { headline: 'Add citation' },
      value: { ID: crypto.randomUUID(), Title: '', SourceName: '' }
    }).catch(() => undefined);

    if (!citation) return;
    this.value = { citation, isNew: true };
    this._submitModal();
  }

  #renderManagerNotFound()
  {
    return html`
      <p class="errorText">
        Error: A Citation Manager property was not found.
        <br />Please add a Citation Manager property to this document type and make sure its alias is set to <code>${CITATION_PROPERTY_ALIAS}</code>.
     </p>
    `;
  }

  #renderCitationPicker()
  {
    const citations = this.#getFilteredCitations();

    return html`
      <div id="toolbar">
        <uui-input label="Filter citations" placeholder="Filter by title or source" .value="${this._filter}" @input="${this.#onFilterInput}"></uui-input>
        <uui-button label="Add citation" look="outline" @click="${() => this.#addCitation()}"></uui-button>
      </div>

      ${citations.length === 0 ? html`<p>No citations found.</p>` : ''}
      <uui-ref-list>
        ${citations.map((citation) => html`
          <uui-ref-node name="${citation.Title}" detail="${citation.SourceName}" @open="${() => this.#submitCitation(citation)}"></uui-ref-node>
        `)}
      </uui-ref-list>
    `;
  }

  override render()
  {
    return html`
      <umb-body-layout headline="Insert citation">
        <uui-box>
          ${this.data?.citationPropertyFound ? this.#renderCitationPicker() : this.#renderManagerNotFound()}
        </uui-box>

        <div slot="actions">
          <uui-button label="Cencel" @click="${() => this._rejectModal()}"></uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static override styles =
    [
      css`
        .errorText { color: var(--uui-color-danger-standalone); }
        #toolbar { display: flex; gap: var(--uui-size-space-3); }
        #toolbar uui-input { flex: 1 }
      `
    ];
}

declare global
{
  interface HTMLElementTagNameMap
  {
    'gis-citation-picker-modal': GisCitationPickerModalElement;
  }
}
