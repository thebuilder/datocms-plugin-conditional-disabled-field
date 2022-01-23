import React from "react";
import {
  connect,
  FieldAppearanceChange,
  OnBootCtx,
  RenderFieldExtensionCtx,
  RenderManualFieldExtensionConfigScreenCtx,
} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { ConfigScreen } from "./ConfigScreen";
import { render } from "./utils/render";
import { ValidManualExtensionParameters } from "./types";

const FIELD_EXTENSION_ID = "conditionalDisabledFields";

connect({
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      render(<ConfigScreen ctx={ctx} />, ctx);
    }
  },
  manualFieldExtensions(ctx) {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: "Conditional Disabled Fields",
        type: "addon",
        configurable: true,
        fieldTypes: "all",
        initialHeight: 0,
      },
    ];
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      const params = ctx.parameters as ValidManualExtensionParameters;
      const match = params.targetFieldsApiKey.some((apiKey) => {
        const value = ctx.fieldPath[apiKey];
        return params.invert ? !!value : !value;
      });

      ctx.disableField(ctx.fieldPath, match);
    }
  },
  async onBoot(ctx: OnBootCtx) {
    if (ctx.plugin.attributes.parameters.migratedFromLegacyPlugin) {
      return;
    }

    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }

    const fields = await ctx.loadFieldsUsingPlugin();

    const someUpgraded = (
      await Promise.all(
        fields.map(async (field) => {
          const { appearance } = field.attributes;

          const changes: FieldAppearanceChange[] = [];

          appearance.addons.forEach((addon, index) => {
            if (addon.field_extension === FIELD_EXTENSION_ID) {
              return;
            }

            changes.push({
              operation: "updateAddon",
              index,
              newFieldExtensionId: FIELD_EXTENSION_ID,
            });
          });

          if (changes.length === 0) {
            return false;
          }

          await ctx.updateFieldAppearance(field.id, changes);
        })
      )
    ).some((x) => x);

    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });

    if (someUpgraded) {
      ctx.notice("Plugin settings upgraded successfully!");
    }
  },
});
