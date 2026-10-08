namespace CitationSystem.Models
{
    // Represents a single in-text citation, <sup data-ref"{ID}">, in the RTE's HTML.
    public class InTextCitation
    {
        public required Guid? CitationID { get; init; }

        // Starting chacater position of the citation element
        public required int StartIndex { get; init; }

        // Characte count of the <sup> element
        public required int Length { get; init; }
    }
}
