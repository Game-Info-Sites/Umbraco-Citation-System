using CitationSystem.Models;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;

namespace CitationSystem.Services
{
    public class InTextCitationCollector(EditorPropertyOrderService propertyOrder, InTextCitationParser inTextCitationParser)
    {
        public IReadOnlyList<RichTextPropertyCitations> GetRichTextPropertyCitations(IPublishedContent page)
        {
            var richTextProperties = new List<RichTextPropertyCitations>();
            GetRichTextPropertyCitationsFromElement(page, richTextProperties);
            return richTextProperties;
        }

        private void GetRichTextPropertyCitationsFromElement(IPublishedElement? element, List<RichTextPropertyCitations> richTextProperties)
        {
            if (element is null) { return; }

            foreach (var alias in propertyOrder.GetOrderedAliases(element.ContentType))
            {
                var property = element.GetProperty(alias);

                // Skip reading any property that can't hold citations
                if (property is null || !CanContainCitations(property.PropertyType.ModelClrType)) { continue; }

                var value = property.GetValue();

                if (value is IHtmlEncodedString richText)
                {
                    var html = richText.ToHtmlString();

                    richTextProperties.Add(new RichTextPropertyCitations
                    {
                        ElementKey = element.Key,
                        PropertyAlias = alias,
                        PropertyHTML = html,
                        InTextCitations = inTextCitationParser.GetInTextCitations(html)
                    });

                    continue;
                }

                GetRichTextPropertyCitationsFromValue(value, richTextProperties);
            }
        }

        private static bool CanContainCitations(Type valueType)
            => typeof(IHtmlEncodedString).IsAssignableFrom(valueType)
            || typeof(IBlockReference<IPublishedElement, IPublishedElement>).IsAssignableFrom(valueType)
            || typeof(IEnumerable<IBlockReference<IPublishedElement, IPublishedElement>>).IsAssignableFrom(valueType);

        private void GetRichTextPropertyCitationsFromValue(object? value, List<RichTextPropertyCitations> richTextProperties)
        {
            switch (value)
            {
                case BlockGridItem gridItem:
                    GetRichTextPropertyCitationsFromElement(gridItem.Content, richTextProperties);
                    GetRichTextPropertyCitationsFromElement(gridItem.Settings, richTextProperties);
                    foreach (var area in gridItem.Areas) { GetRichTextPropertyCitationsFromValue(area, richTextProperties); }
                    break;

                // Block list Items or single block
                case IBlockReference<IPublishedElement, IPublishedElement> block:
                    GetRichTextPropertyCitationsFromElement(block.Content, richTextProperties);
                    GetRichTextPropertyCitationsFromElement(block.Settings, richTextProperties);
                    break;

                // Block list, block grid, or block grid area
                case IEnumerable<IBlockReference<IPublishedElement, IPublishedElement>> blocks:
                    foreach (var block in blocks) { GetRichTextPropertyCitationsFromValue(block, richTextProperties); }
                    break;

                default:
                    break;
            }
        }
    }
}
