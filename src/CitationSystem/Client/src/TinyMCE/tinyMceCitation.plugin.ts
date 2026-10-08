import { UmbTinyMcePluginBase } from '@tiny-mce-umbraco/backoffice/core';
import type { TinyMcePluginArguments } from '@tiny-mce-umbraco/backoffice/core';
import { GisCitationContextController } from '../Core/citationContext.controller';
import type { Editor } from '@tiny-mce-umbraco/backoffice/external/tinymce';

export default class GisTinyMceCitationPlugin extends UmbTinyMcePluginBase
{
  readonly #editor: Editor;

  constructor(args: TinyMcePluginArguments)
  {
    super(args);
    this.#editor = args.editor;
  }

  static override async extendEditorConfig(config: Record<string, unknown>): Promise<void>
  {
    const citationRule = 'sup[data-ref|class|style]';
    const existing = config.extended_valid_elements as string | undefined;
    config.extended_valid_elements = existing ? `${existing},${citationRule}` : citationRule;
    const citationStyle = "sup[data-ref]::after { content: '[cite]'; color: #2152a3; }";
    const existingStyle = config.content_style as string | undefined;
    config.content_style = existingStyle ? `${existingStyle}\n${citationStyle}` : citationStyle;
  }

  override async init(): Promise<void>
  {
    const citations = new GisCitationContextController(this);

    this.#editor.on('PreInit', () =>
    {
      this.#editor.parser.addAttributeFilter('data-ref', (nodes) =>
      {
        nodes.forEach((node) =>
        {
          if (node.name === 'sup') node.attr('contenteditable', 'false');
        });
      });

      this.#editor.serializer.addAttributeFilter('data-ref', (nodes) =>
      {
        nodes.forEach((node) => node.attr('contentedittable', null));
      });
    });

    this.#editor.ui.registry.addButton('gisCitation',
      {
        text: 'Cite',
        onAction: async () =>
        {
          const citationID = await citations.pickCitation();
          if (!citationID) return;
          this.#editor.insertContent(`<sup data-ref="${citationID}"></sup>`)
        }
      });
  }
}
