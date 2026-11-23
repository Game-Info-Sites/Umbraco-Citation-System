# Umbraco Citation System

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.CitationSystem?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.CitationSystem/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.CitationSystem?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.CitationSystem)
[![GitHub license](https://img.shields.io/github/license/Game-Info-Sites/Umbraco-Citation-System?color=8AB803)](../LICENSE)

The Umbraco Citation System provides a Wikipedia-style citation function to lets editors insert superscript links to be inserted into a Rich Text Editor (TinyMCE only for now) that link to selected citations in the bibliography.
This plugin also generates the bibliography for easy integration and display into page templates.

<!--

And don't forget to add the screenshot files to umbraco-marketplace.json too!
-->

## Installation

Add the package to an existing Umbraco website (v17+) from NuGet:

`dotnet add package Umbraco.Community.CitationSystem`

**NOTE:** Currently version 1.X of this package requires the TinyMCE plugin as well which can be installed from NuGet:

`dotnet add package TinyMCE.Umbraco`

## Usage

Enable the citation system in the Rich Text Editor by enabling the "Citation" toolbar option and add the "Citation Manger" property with the alias set to "citationManager" to any document types that will use citations.

### Template Setup

Add `@using CitationSystem.Extensions` to your `_ViewImports.cshtml` file.

To render the Rich Text Editor in a page template use `@Html.WithCitations(Model, "alias")` where "alias" is the Rich Text Editor property alias. In Block List and Block Grid partial views use `@Html.WithCitations(Model.Content, "alias")`. If you have blocks enabled for an RTE and that block has an RTE inside it then the partial view for the block should use `@Model.Content.Value("alias")` to render the block's RTE.

To display the bibliography using the built-in template's order list view add `@await Html.GetBibliographyHtmlAsync()` to your template. You can also use `@Html.GetBibliographyEntries()` to get just the entries and customize the rendering. You can also override the default template by creating your own partial view at `Views/Partials/GisCitationSystem/Bibliography.cshtml`

### Styles

There are three CSS classes you can style to affect the look of citations.
* `citationReference`: This styles the `<sup>` tag that is generated in the Rich Text Editor Property
* `citationBibliography`: This styles the ordered list (`<ol>`) in the default bibliography template.
* `citationBacklinks`: This styles the `<span>` tag that surrounds the &uarr; backlink indicator for a citation in the bibliography.

### Translation Items (optional)
You can setup two translation dictionary items to add translations for the "Accessed Date" and "Back Link" labels by adding items for `CitationSystem.AccessedDateLabel` and CitationSystem.BacklinkLabel. The default for the "Accessed Date" label is "Retrieved" and the default for the "Back Link" label is "Back to text".

## The Citation Manger

The citation manger property is the bibliography for the document type and must be added to any document type that wants to use the citation system and, currently, the property alias is required to be set to "citationManager". From the manager you can search/filter for existing citations based on the title and source, add new citations, edit existing citations, and delete them. The citation manager acts as the master control of for all the citations in a page, even if multiple RTEs are used. If you delete a citation from the manager but leave it's citation in an RTE then a "\[?]" superscript notation will appear in place of a linked number when the page template is rendered. If the manager contains citations are there not used in any RTE then it will not be listed in the template's rendered bibliography.
**NOTE:** Please make sure the Citation Manger Property is not set to "vary by culture", if "vary by culture" is enabled then each language gets it's own citation list and bibliography

## TinyMCE Toolbar Button.

To enable the usage of citations within the TinyMCE Rich Text Editor edit the TinyMCE RTE data type you wish to use and place a checkmark for "Citation" in the "Toolbar" configuration options. Once enabled the RTE Property will have a new button with the word `Cite` as it's icon. Place the curser where you wish to insert the citation mark and click the "Cite" button. This will open a sidebar where you can view the existing citations, filter/search for citations based on there Title and the source, and add new citations. If you click on an existing citation it will insert a superscript value of `\[cite]` into the RTE. This will automatically be replaced with a numbered link that will jump to the selected citation in the bibliography when the page's template is rendered on the front end. If you need to add a new citation then clicking the "Add citation" button will bring up the new citation sidebar where you can add all the information for the citation and submit it. The new citation will automatically be added to the manger and inserted into the RTE.

## Known Limitations And Bugs

This is a list of all known limitations and bugs. Some items are planned for certain versions, others have no specific version planned to be addressed in. These bugs and limitations where the result of trying to get a basic package out for usage and feedback as soon as possible.

### Bugs

* Nested in-text citations (somehow you placed a citation inside a citation marker) will still get a number but only the outer citation will be rendered. This is planned to be fixed in version 1.1
* Citations in a RTE property that is not rendered in the template still get assigned numbers and will show in the bibliography. This is planned to be addressed in version 1.1

### Limitations

* Only TinyMCE is currently supported. TipTap support is planned for version 2 of the package.
* Citation Manger property MUST be have the alias of "citationManager".
* The Citation Manager does not currently support reordering of the citations.
* For a Title to link to it's source, the source URL must be a fully qualified address starting with http:// or https://
* Citation number does not follow the order citations get rendered in the template. Currently they are rendered in order as you would see them in the backoffice document editing view. Tabs -> Groups -> Property based on sort order. A fix for this is planned in version 2.x
* Rendered citation marker HTML code is currently fixed and not customizable. This is planed for version 2.X
* The date format for both "Published date" and "Accessed date" are currently fixed to " Month Day, Year" for all languages. A full override of the default partial view used would need to be done.

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

## Support

If you found this package helpful, consider supporting our team on <a href="https://ko-fi.com/gameinfosites">ko-fi</a>
<br /><br />[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/gameinfosites)