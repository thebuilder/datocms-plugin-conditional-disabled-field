const fieldsRE = /{([a-z][a-z_]+)}/g;

export async function init() {
  const plugin = await window.DatoCmsPlugin.init();

  const fieldPath = plugin.fieldPath;
  const condition = plugin.parameters.instance.condition;

  const runCondition = (condition) => {
    if (import.meta.env.DEV) console.log("runCondition ".concat(condition));
    const getFieldValue = plugin.getFieldValue;

    const evalString = condition.replace(fieldsRE, (value, fieldId) => {
      return JSON.stringify(getFieldValue(fieldId));
    });

    if (import.meta.env.DEV) console.log("evalString ".concat(evalString));
    return !!eval(evalString);
  };

  // Disable the field after load
  plugin.disableField(fieldPath, runCondition(condition));
  const matches = condition.matchAll(fieldsRE);

  for (const [, fieldId] of matches) {
    plugin.addFieldChangeListener(fieldId, () => {
      if (import.meta.env.DEV) console.log("Field changed", fieldId);
      plugin.disableField(fieldPath, runCondition(condition));
    });
  }
}

init();
