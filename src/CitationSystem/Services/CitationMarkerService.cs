using System.Globalization;
using CitationSystem.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Core.Web;

namespace CitationSystem.Services
{
    public class CitationMarkerService(CitationNumberingService numberingService, InTextCitationParser inTextCitationParser, IUmbracoContextAccessor umbracoContextAccessor)
    {
        // Returns the RTE HTML with the in-text citation replaced by it's citation marker.
        public HTMLWithCitationMarkers RenderPropertyWithCitationMarkers(IPublishedElement element, string propertyAlias, IPublishedContent? page = null)
        {
            page ??= element as IPublishedContent ?? GetRequestedPage();
            var numbering = page is null ? null : numberingService.GetPageCitationUsage(page);
            var richTextProperty = numbering?.GetRichTextPropertyCitations(element.Key, propertyAlias);
            var html = richTextProperty?.PropertyHTML ?? (element.GetProperty(propertyAlias)?.GetValue() as IHtmlEncodedString)?.ToHtmlString() ?? string.Empty;

            // If there is no numbering (no page passed or hitting re-entry guard) then leave in-text ciations for outer .WithCitations call to handle
            if (numbering is null) { return new HTMLWithCitationMarkers(html, [], []); }

            var inTextCitations = richTextProperty?.InTextCitations ?? inTextCitationParser.GetInTextCitations(html);
            var replacedInTextCitations = new List<InTextCitation>();
            var citationMarkersHTML = new List<string>();
            var occurrencesUsed = new Dictionary<Guid, int>();
            var position = 0;

            foreach (var inTextCitation in inTextCitations)
            {
                // Guard against nested citations
                if (inTextCitation.StartIndex < position) { continue; }

                replacedInTextCitations.Add(inTextCitation);
                citationMarkersHTML.Add(BuildCitationMarkerHTML(inTextCitation, numbering, richTextProperty, occurrencesUsed));
                position = inTextCitation.StartIndex + inTextCitation.Length;
            }

            return new HTMLWithCitationMarkers(html, replacedInTextCitations, citationMarkersHTML);
        }

        private static string BuildCitationMarkerHTML(InTextCitation inTextCitation, PageCitationUsage numbering, RichTextPropertyCitations? richTextProperty, Dictionary<Guid, int> occurrencesUsed)
        {
            // Deleted or invalid Citation.
            if (inTextCitation.CitationID is not Guid citationID || !numbering.CitationUsages.TryGetValue(citationID, out var usage)) { return "<sup class=\"citationReference\">[?]</sup>"; }

            var citationNumber = usage.CitationNumber;

            // The next occurrence of this citation in the property sets the anchor ID.
            var occurrenceIndex = occurrencesUsed.GetValueOrDefault(citationID);
            occurrencesUsed[citationID] = occurrenceIndex + 1;
            var markerAnchorIDAttribute = string.Empty;

            if (richTextProperty is not null && richTextProperty.CitationOccurrences.TryGetValue(citationID, out var occurrenceNumbers) && occurrenceIndex < occurrenceNumbers.Count)
            {
                var markerAnchorID = string.Format(CultureInfo.InvariantCulture, Constants.CitationMarkerAnchorIDFormat, citationNumber, occurrenceNumbers[occurrenceIndex]);
                markerAnchorIDAttribute = $" id=\"{markerAnchorID}\"";
            }

            // Bibliography entry this marker links to.
            var bibliographyEntryAnchorID = string.Format(CultureInfo.InvariantCulture, Constants.BibliographyEntryAnchorIDFormat, citationNumber);

            return $"<sup class=\"citationReference\"{markerAnchorIDAttribute}><a href=\"#{bibliographyEntryAnchorID}\">[{citationNumber}]</a></sup>";
        }

        private IPublishedContent? GetRequestedPage() => umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext) ? umbracoContext.PublishedRequest?.PublishedContent : null;
    }
}
