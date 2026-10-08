import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { CitationModalData, CitationModalValue } from "./citationModal.token";
import { UUIInputElement, UUITextareaElement } from "@umbraco-cms/backoffice/external/uui";

type TextField = Exclude<keyof CitationRecordPropertyValue, 'ID' | 'Authors'>;

@customElement('gis-citation-modal')
export default class GisCitationModalElement extends UmbModalBaseElement<CitationModalData, CitationModalValue>
{
  #setField(field: TextField, e: Event)
  {
    const value = ((e.target as UUIInputElement).value as string) ?? '';
    this.updateValue({ [field]: value || undefined } as Partial<CitationModalValue>);
  }

  #setAuthors(e: Event)
  {
    const authors = (((e.target as UUITextareaElement).value as string) ?? '').split('\n').map((author) => author.trim()).filter(Boolean);
    this.updateValue({ Authors: authors.length > 0 ? authors : undefined });
  }

  #renderField(label: string, field: TextField, type = 'text', mandatory = false)
  {
    return html`
      <umb-property-layout label="${label}" ?mandatory="${mandatory}">
        <uui-input slot="editor" type="${type}" label="${label}" .value="${(this.value?.[field] as string) ?? ''}" @input="${(e: Event) => this.#setField(field, e)}"></uui-input>
      </umb-property-layout>
    `;
  }

  #submit()
  {
    const trimmedCitation = Object.fromEntries(
      Object.entries(this.value ?? {}).map(([key, val]) =>
        [
          key,
          typeof val === 'string' ? val.trim() || undefined : val
        ])
    ) as CitationModalValue;

    this.value = trimmedCitation;
    this._submitModal();
  }

  override render()
  {
    return html`
      <umb-body-layout headline="${this.data?.headline ?? 'Citation'}">
        <uui-box>
          ${this.#renderField('Title', 'Title', 'text', true)}
          ${this.#renderField('Source name', 'SourceName', 'text', true)}
          ${this.#renderField('URL', 'Url', 'url')}
          <umb-property-layout label="Authors" description="One author per line">
            <uui-textarea slot="editor" label="Authors" .value="${(this.value?.Authors ?? []).join('\n')}" @change="${this.#setAuthors}"></uui-textarea>
          </umb-property-layout>
          ${this.#renderField('Published date', 'PublishedDate', 'date')}
          ${this.#renderField('Accessed date', 'AccessedDate', 'date')}
          ${this.#renderField('Publisher', 'Publisher')}
          ${this.#renderField('Page', 'Page')}
          <umb-property-layout label="Note">
            <uui-textarea slot="editor" label="Note" .value="${this.value?.Note ?? ''}" @input="${(e: Event) => this.#setField('Note', e)}"></uui-textarea>
          </umb-property-layout>
        </uui-box>

        <div slot="actions">
          <uui-button label="Cancel" @click="${() => this._rejectModal()}"></uui-button>
          <uui-button label="Submit" look="primary" color="positive" ?disabled="${!this.value?.Title?.trim() || !this.value?.SourceName?.trim()}" @click="${() => this.#submit()}"></uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static override styles =
  [
    css`
      uui-input, uui-textarea { width: 100%; }
  `];
}

declare global
{
  interface HTMLElementTagNameMap
  {
    'gis-citation-modal': GisCitationModalElement;
  }
}
