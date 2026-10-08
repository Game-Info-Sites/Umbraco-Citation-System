import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { CitationRecordPropertyValue } from "../Models/CitationRecordPropertyValue";

export type CitationPickerModalData = { citations: CitationRecordPropertyValue[]; citationPropertyFound: boolean };
export type CitationPickerModalValue = { citation: CitationRecordPropertyValue; isNew: boolean };

export const CITATION_PICKER_MODAL = new UmbModalToken<CitationPickerModalData, CitationPickerModalValue>
  (
    'GameInfoSites.CitationSystem.CitationPickerModal',
    {
      modal:
      {
        type: 'sidebar',
        size: 'small'
      }
    }
  );
