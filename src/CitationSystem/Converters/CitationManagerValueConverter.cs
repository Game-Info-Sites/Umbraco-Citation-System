using System.Text.Json;
using CitationSystem.Models;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace CitationSystem.Converters
{
    public class CitationManagerValueConverter(ILogger<CitationManagerValueConverter> logger) : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == Constants.CitationManager;
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(IReadOnlyList<CitationRecord>);
        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) => PropertyCacheLevel.Element;
        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview) => inter as IReadOnlyList<CitationRecord> ?? Array.Empty<CitationRecord>();

        public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
        {
            var json = source?.ToString();
            if (string.IsNullOrWhiteSpace(json)) { return Array.Empty<CitationRecord>(); }

            try
            {
                return JsonSerializer.Deserialize<CitationRecord[]>(json) ?? Array.Empty<CitationRecord>();
            }
            catch (JsonException ex)
            {
                logger.LogWarning(ex, "Could not read citation list in property {PropertyAlias} on {ContentKey}.", propertyType.Alias, owner.Key);
                return Array.Empty<CitationRecord>();
            }
        }

    }
}
