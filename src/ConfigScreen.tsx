import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Form, SwitchField, SelectField } from "datocms-react-ui";
import React from "react";
import { useCallback, useState } from "react";
import { ValidManualExtensionParameters } from "./types";

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export function ConfigScreen({ ctx }: PropTypes) {
  const [formValues, setFormValues] = useState<
    Partial<ValidManualExtensionParameters>
  >(ctx.parameters || {});

  const update = useCallback(
    (field: string, value: unknown) => {
      const newParameters = { ...formValues, [field]: value };
      setFormValues(newParameters);
      ctx.setParameters(newParameters);
    },
    [formValues, setFormValues, ctx]
  );

  const options = Object.values(ctx.fields)
    .filter(
      (field) =>
        field?.relationships.item_type.data.id === ctx.itemType.id &&
        field.id !== ctx.pendingField.id
    )
    .map((field) => ({
      label: field?.attributes.label,
      value: field?.attributes.api_key,
    }));

  return (
    <Form>
      <SelectField
        id="targetFieldsApiKey"
        name="targetFieldsApiKey"
        label="Disable field if one of the following fields has a value."
        required
        selectInputProps={{ isMulti: true, options }}
        value={
          formValues.targetFieldsApiKey?.map((apiKey) =>
            options.find((o) => o.value === apiKey)
          ) || []
        }
        onChange={(selectedOptions) => {
          update(
            "targetFieldsApiKey",
            selectedOptions.map((o) => o?.value)
          );
        }}
      />
      <SwitchField
        id="invert"
        name="invert"
        label="Invert visibility?"
        hint="When this field is checked, invert the logic so the field is disabled, if one of the fields haven't got a value"
        value={formValues?.invert || false}
        onChange={update.bind(null, "invert")}
      />
    </Form>
  );
}
