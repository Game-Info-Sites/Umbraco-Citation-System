using System.Text.RegularExpressions;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace CitationSystem.Services
{
    public class EditorPropertyOrderService(IContentTypeService contentTypeService, AppCaches appCaches)
    {
        public IReadOnlyList<string> GetOrderedAliases(IPublishedContentType publishedContentType) => appCaches.RequestCache.GetCacheItem($"GameInfoSites.CitationsSystem.PropertyOrder:{publishedContentType.Key}", () => BuildOrderedAliases(publishedContentType)) ?? [];

        private string[] BuildOrderedAliases(IPublishedContentType publishedContentType)
        {
            var publishedAliases = publishedContentType.PropertyTypes.Select(propertyType => propertyType.Alias).ToArray();
            var contentType = contentTypeService.Get(publishedContentType.Key);
            if (contentType is null) { return publishedAliases; }

            // The content type's groups come first and then the compositions' groups.
            // Groups with the same type and alias show as one group in the backoffice, so merge them.
            // The first group's sort order wins, so use the content type's own sort order if it has one.
            var mergedGroups = contentType.CompositionPropertyGroups
                                          .GroupBy(group => (group.Type, group.Alias))
                                          .Select(groups => new MergedGroup
                                              (
                                                  groups.Key.Type,
                                                  groups.Key.Alias,
                                                  groups.First().GetParentAlias(),
                                                  groups.First().SortOrder,
                                                  groups.SelectMany(group => group.PropertyTypes ?? Enumerable.Empty<IPropertyType>())
                                                        .OrderBy(propertyType => propertyType.SortOrder)
                                                        .Select(propertyType => propertyType.Alias)
                                                        .ToArray()
                                              ))
                                          .ToList();

            var orderedAliases = new List<string>();

            // Groups in "Generic" tab
            foreach (var group in mergedGroups.Where(group => group.Type == PropertyGroupType.Group && group.ParentAlias is null).OrderBy(group => group.SortOrder))
            {
                orderedAliases.AddRange(group.PropertyAliases);
            }

            // Each tab and it's groups
            foreach (var tab in mergedGroups.Where(group => group.Type == PropertyGroupType.Tab).OrderBy(group => group.SortOrder))
            {
                orderedAliases.AddRange(tab.PropertyAliases);

                foreach (var group in mergedGroups.Where(group => group.Type == PropertyGroupType.Group && group.ParentAlias == tab.Alias).OrderBy(group => group.SortOrder))
                {
                    orderedAliases.AddRange(group.PropertyAliases);
                }
            }

            // Everything else
            var placedAliases = orderedAliases.ToHashSet();
            orderedAliases.AddRange(publishedAliases.Where(alias => !placedAliases.Contains(alias)));

            return orderedAliases.Distinct().ToArray();
        }

        private sealed record MergedGroup(PropertyGroupType Type, string Alias, string? ParentAlias, int SortOrder, string[] PropertyAliases);
    }
}
