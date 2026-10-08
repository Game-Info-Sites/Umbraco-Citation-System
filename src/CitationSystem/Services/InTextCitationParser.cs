using CitationSystem.Models;
using HtmlAgilityPack;

namespace CitationSystem.Services
{
    public class InTextCitationParser
    {
        public IReadOnlyList<InTextCitation> GetInTextCitations(string html)
        {
            if (!html.Contains("data-ref", StringComparison.Ordinal)) { return []; }
            var document = new HtmlDocument();
            document.LoadHtml(html);
            var elements = document.DocumentNode.SelectNodes("//sup[@data-ref]");
            if (elements is null) { return []; }
            var inTextCitations = new List<InTextCitation>();

            foreach (var element in elements)
            {
                Guid? citationID = Guid.TryParse(element.GetAttributeValue("data-ref", string.Empty), out var parsedID) ? parsedID : null;
                inTextCitations.Add(new InTextCitation
                {
                    CitationID = citationID,
                    StartIndex = element.OuterStartIndex,
                    Length = element.OriginalOuterLength
                });
            }

            return inTextCitations;
        }
    }
}
