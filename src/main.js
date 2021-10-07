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

  condition.match(fieldsRE, (t, fieldId) => {
    // Watch for changes on related fields, and update disabled status
    plugin.addFieldChangeListener(fieldId, () => {
      plugin.disableField(fieldPath, runCondition(condition));
    });
  });
}

init();
