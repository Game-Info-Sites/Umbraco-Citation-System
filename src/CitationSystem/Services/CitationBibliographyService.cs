using System.Globalization;
using CitationSystem.Models;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace CitationSystem.Services
{
    public class CitationBibliographyService(CitationNumberingService numberingService)
    {
        // Returns a page's citations in number order, ignoring unused citations.
        public IReadOnlyList<BibliographyEntry> GetBibliographyEntries(IPublishedContent page)
        {
            var pageCitationUsage = numberingService.GetPageCitationUsage(page);
            if (pageCitationUsage is null) { return []; }
            var citations = page.GetProperty(Constants.CitationManagerPropertyAlias)?.GetValue() as IReadOnlyList<CitationRecord> ?? [];
            var bibliographyEntries = new List<BibliographyEntry>();

            foreach (var citation in citations)
            {
                if (!pageCitationUsage.CitationUsages.TryGetValue(citation.ID, out var usage)) { continue; }

                bibliographyEntries.Add(new BibliographyEntry
                {
                    CitationNumber = usage.CitationNumber,
                    CitationUseCount = usage.CitationUseCount,
                    Citation = citation,
                    AnchorID = string.Format(CultureInfo.InvariantCulture, Constants.BibliographyEntryAnchorIDFormat, usage.CitationNumber),
                    MarkerAnchorIDs = Enumerable.Range(1, usage.CitationUseCount)
                                                .Select(occurenceNumber => string.Format(CultureInfo.InvariantCulture, Constants.CitationMarkerAnchorIDFormat, usage.CitationNumber, occurenceNumber))
                                                .ToArray(),
                });
            }

            return bibliographyEntries.OrderBy(entry => entry.CitationNumber).ToArray();
        }
    }
}
