import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";

export type CitationModalData = { headline: string };
export type CitationModalValue = CitationRecordPropertyValue;

export const CITATION_MODAL = new UmbModalToken<CitationModalData, CitationModalValue>(
  'GameInfoSites.CitationSystem.CitationModal',
  {
    modal:
    {
      type: 'sidebar',
      size: 'small'
    }
  }
);
