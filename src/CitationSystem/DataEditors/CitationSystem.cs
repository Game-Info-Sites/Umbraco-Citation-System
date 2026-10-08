using Umbraco.Cms.Core.PropertyEditors;

namespace CitationSystem.DataEditors
{
    [DataEditor(Constants.CitationManager, ValueEditorIsReusable = true, ValueType = "JSON")]
    public class CitationManagerDataEditor(IDataValueEditorFactory dataValueEditorFactory) : DataEditor(dataValueEditorFactory);
}
