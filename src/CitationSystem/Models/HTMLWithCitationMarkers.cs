using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Strings;

namespace CitationSystem.Models
{
    // The RTE's HTML with in-text citations replaced by citation markers.
    // Used to write directly to a page's output so the full HTML is not copied into a new string.
    public class HTMLWithCitationMarkers(string html, IReadOnlyList<InTextCitation> inTextCitations, IReadOnlyList<string> citationMarkersHTML) : IHtmlContent
    {
        private readonly string _html = html;
        private readonly IReadOnlyList<InTextCitation> _inTextCitations = inTextCitations;
        private readonly IReadOnlyList<string> _citationMakersHTML = inTextCitations.Count == citationMarkersHTML.Count ? citationMarkersHTML: throw new ArgumentException("Each in-text citation needs exactly one marker.", nameof(citationMarkersHTML));

        public void WriteTo(TextWriter writer, HtmlEncoder encoder)
        {
            var position = 0;

            for (var i = 0; i < _inTextCitations.Count; i++)
            {
                var inTextCitation = _inTextCitations[i];
                writer.Write(_html.AsSpan(position, inTextCitation.StartIndex - position));
                writer.Write(_citationMakersHTML[i]);
                position = inTextCitation.StartIndex + inTextCitation.Length;
            }

            writer.Write(_html.AsSpan(position));
        }

        public override string ToString()
        {
            using var writer = new StringWriter();
            WriteTo(writer, HtmlEncoder.Default);
            return writer.ToString();
        }

        public IHtmlEncodedString ToHtmlEncodedString() => new HtmlEncodedString(ToString());
    }
}
