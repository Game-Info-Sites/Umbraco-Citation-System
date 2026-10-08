using CitationSystem.Models;
using CitationSystem.Services;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Web;

namespace CitationSystem.Extensions
{
    public static class CitationHTMLHelperExtensions
    {
        // Renders a RTE with its in-text citations replaced by numbered citation markers.
        // page: the page that owns the citation list. Leave null to use the element itself, when it's a page, or use the page being requested.
        public static HTMLWithCitationMarkers WithCitations(this IHtmlHelper html, IPublishedElement element, string propertyAlias, IPublishedContent? page = null)
            => html.ViewContext.HttpContext.RequestServices .GetRequiredService<CitationMarkerService>().RenderPropertyWithCitationMarkers(element, propertyAlias, page);

        // Returns a page's bibliography entries in ascending numerical order
        // page: the page that owns the bibliography to get. Leave null to use the page being requested.
        public static IReadOnlyList<BibliographyEntry> GetBibliographyEntries(this IHtmlHelper html, IPublishedContent? page = null)
        {
            var htmlServices = html.ViewContext.HttpContext.RequestServices;
            if (page is null && htmlServices.GetRequiredService<IUmbracoContextAccessor>().TryGetUmbracoContext(out var umbracoContext)) { page = umbracoContext.PublishedRequest?.PublishedContent; }
            return page is null ? [] : htmlServices.GetRequiredService<CitationBibliographyService>().GetBibliographyEntries(page);
        }

        // Rendera a page's bibliography partial view at 'BibliographyPartialViewPath'. A developer can overide with there own partial at the same path
        // page: the page that owns the bibliography. Leave null to use the page being requested.
        public static Task<IHtmlContent> GetBibliographyHtmlAsync(this IHtmlHelper html, IPublishedContent? page = null)
         => html.PartialAsync(Constants.BibliographyPartialViewPath, html.GetBibliographyEntries(page));
    }
}
