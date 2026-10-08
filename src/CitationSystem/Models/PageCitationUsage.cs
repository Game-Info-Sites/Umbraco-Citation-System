namespace CitationSystem.Models
{
    public class PageCitationUsage
    {
        public required IReadOnlyDictionary<Guid, CitationUsage> CitationUsages { get; init; }
        public required IReadOnlyList<RichTextPropertyCitations> RichTextProperties { get; set; }

        public RichTextPropertyCitations? GetRichTextPropertyCitations(Guid elementKey, string propertyAlias)
            => RichTextProperties.FirstOrDefault(richTextProperty => richTextProperty.ElementKey == elementKey
            && string.Equals(richTextProperty.PropertyAlias, propertyAlias, StringComparison.OrdinalIgnoreCase));
    }
}
