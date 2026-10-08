using CitationSystem.Services;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace CitationSystem.Composers
{
    public class CitationSystemComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<CitationBibliographyService>();
            builder.Services.AddSingleton<CitationMarkerService>();
            builder.Services.AddSingleton<CitationNumberingService>();
            builder.Services.AddSingleton<EditorPropertyOrderService>();
            builder.Services.AddSingleton<InTextCitationCollector>();
            builder.Services.AddSingleton<InTextCitationParser>();
        }
    }
}
