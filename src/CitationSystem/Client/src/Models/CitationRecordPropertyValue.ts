export interface CitationRecordPropertyValue
{
  ID: string,
  Title: string,
  Url?: string | null,
  SourceName: string,
  Authors?: string[] | null,
  PublishedDate?: string | null,
  AccessedDate?: string | null,
  Publisher?: string | null,
  Page?: string | null,
  Note?: string | null
}
