# DatoCMS Conditional Disabled Field

A plugin for DatoCMS that allows you disable fields conditionally.

## Configuration

Assign the plugin as a Field Addon, and select the fields that should be defined for it to be toggled.

## Development

The plugin is built using [Vite.js](https://vitejs.dev/). This enables a fast
development workflow, where you see the changes as soon as you save a file. For
it to work, it needs to be rendered inside the DatoCMS interface.

So when testing the plugin locally, you should
[create a new plugin](https://www.datocms.com/docs/building-plugins/creating-a-new-plugin)
in a DatoCMS project, and point it to `http://localhost:3000`.
