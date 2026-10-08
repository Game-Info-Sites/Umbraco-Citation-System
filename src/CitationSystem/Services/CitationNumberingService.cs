using CitationSystem.Models;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace CitationSystem.Services
{
    public class CitationNumberingService(InTextCitationCollector inTextCitationCollector, AppCaches appCaches, IVariationContextAccessor variationContextAccessor)
    {
        // Pages, in the current requets, whose numbering is currenting being built.
        private static readonly AsyncLocal<HashSet<string>?> InProgress = new();

        // Returns the page's numbering, or null if it is still being built.
        public PageCitationUsage? GetPageCitationUsage(IPublishedContent page)
        {
            var culture = variationContextAccessor.VariationContext?.Culture ?? string.Empty;
            var cacheKey = $"GameInfoSites.CitationSystem.Numbering: {page.Key}:{culture}";
            if (appCaches.RequestCache.Get(cacheKey) is PageCitationUsage cachedNumbering) { return cachedNumbering; }
            var inProgress = InProgress.Value ??= new HashSet<string>();
            if (!inProgress.Add(cacheKey)) { return null; }

            try
            {
                var numbering = BuildNumbering(page);
                appCaches.RequestCache.Set(cacheKey, numbering);
                return numbering;
            }
            finally
            {
                inProgress.Remove(cacheKey);
            }
        }

        private PageCitationUsage BuildNumbering(IPublishedContent page)
        {
            // Only number citations in the page's list, deleted in-text ciations don't get number and redner as [?].
            var citations = page.GetProperty(Constants.CitationManagerPropertyAlias)?.GetValue() as IReadOnlyList<CitationRecord> ?? [];
            var citationIDs = citations.Select(citation => citation.ID).ToHashSet();
            var richTextProperties = inTextCitationCollector.GetRichTextPropertyCitations(page);
            var numbers = new Dictionary<Guid, int>();
            var useCounts = new Dictionary<Guid, int>();

            foreach (var richTextProperty in richTextProperties)
            {
                foreach (var inTextCitation in richTextProperty.InTextCitations)
                {
                    if (inTextCitation.CitationID is not Guid citationID || !citationIDs.Contains(citationID)) { continue; }
                    if (!numbers.ContainsKey(citationID)) { numbers[citationID] = numbers.Count + 1; }
                    var useCount = useCounts.GetValueOrDefault(citationID) + 1;
                    useCounts[citationID] = useCount;

                    // Record the occuracne's number so .WithCitations can assign an anchor ID to the marker.
                    if (!richTextProperty.CitationOccurrences.TryGetValue(citationID, out var occurrenceNumbers))
                    {
                        occurrenceNumbers = new List<int>();
                        richTextProperty.CitationOccurrences[citationID] = occurrenceNumbers;
                    }

                    occurrenceNumbers.Add(useCount);
                }
            }

            return new PageCitationUsage
            {
                CitationUsages = numbers.ToDictionary(pair => pair.Key, pair => new CitationUsage
                {
                    CitationNumber = pair.Value,
                    CitationUseCount = useCounts[pair.Key]
                }),
                RichTextProperties = richTextProperties
            };
        }
    }
}
