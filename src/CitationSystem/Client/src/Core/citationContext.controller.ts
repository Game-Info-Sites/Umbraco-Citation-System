import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { CITATION_PICKER_MODAL } from "../Modals/citationPickerModal.token";

export const CITATION_PROPERTY_ALIAS = 'citationManager';

export class GisCitationContextController extends UmbControllerBase
{
  #context?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #citations: CitationRecordPropertyValue[] = [];

  constructor(host: UmbControllerHost)
  {
    super(host);

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (context) =>
    {
      this.#context = context;
      if (!context) return;
      const citations$ = await context.propertyValueByAlias<CitationRecordPropertyValue[]>(CITATION_PROPERTY_ALIAS);

      this.observe(citations$, (citations) =>
      {
        this.#citations = citations ?? [];
      }, 'gisObserveCitations');
    }).passContextAliasMatches();
  }

  async pickCitation(): Promise<string | undefined>
  {
    const citationProperty = await this.#context?.structure.getPropertyStructureByAlias(CITATION_PROPERTY_ALIAS);
    const picked = await umbOpenModal(this, CITATION_PICKER_MODAL, { data: { citations: this.#citations, citationPropertyFound: citationProperty !== undefined } }).catch(() => undefined);
    if (!picked) return undefined;
    if (picked.isNew) { await this.#context?.setPropertyValue(CITATION_PROPERTY_ALIAS, [...this.#citations, picked.citation]); }
    return picked.citation.ID;
  }
}
