namespace CitationSystem.Models
{
    public class BibliographyEntry
    {
        public required int CitationNumber { get; init; }
        public required int CitationUseCount { get; init; }
        public required CitationRecord Citation { get; init; }
        public required string AnchorID { get; init; }
        public required IReadOnlyList<string> MarkerAnchorIDs { get; init; }
    }
}
