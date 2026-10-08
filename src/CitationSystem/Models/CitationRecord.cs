namespace CitationSystem.Models
{
    public class CitationRecord
    {
        public Guid ID { get; init; }
        public required string Title { get; init; }
        public string? Url { get; init; }
        public required string SourceName { get; init; }
        public string[]? Authors { get; init; }
        public DateOnly? PublishedDate { get; init; }
        public DateOnly? AccessedDate { get; init; }
        public string? Publisher { get; init; }
        public string? Page { get; init; }
        public string? Note { get; init; }
    }
}
