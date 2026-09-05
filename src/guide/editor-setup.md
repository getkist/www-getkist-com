# Editor setup

kist publishes a JSON Schema for `kist.yml`. With it, your editor completes key
names, shows what each one does on hover, and underlines mistakes before you run
anything.

## Point your file at the schema

Add this as the first line of `kist.yml`:

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json
```

That is all. `kist init` writes it for you in new files.

The comment is read by
[yaml-language-server](https://github.com/redhat-developer/yaml-language-server),
which is what provides YAML support in VS Code, Neovim, and other editors that
speak the Language Server Protocol. JetBrains editors read a `# $schema:` line
instead, so if you use one of those, add both:

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json
# $schema: https://www.getkist.com/schema.json
```

## Per editor

### VS Code

Install the [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).
The modeline above is then enough.

To apply the schema to every `kist.yml` in a workspace without a modeline, add
to `.vscode/settings.json`:

```json
{
    "yaml.schemas": {
        "https://www.getkist.com/schema.json": ["kist.yml", "kist.yaml"]
    }
}
```

#### The kist extension

There is also a [kist extension](https://github.com/getkist/kist-vscode) for the
things a schema cannot do:

- **Action completion from your installed plugins.** Which actions exist depends
  on which packages are in `node_modules`; the schema has no way to know. Typing
  after `action:` completes from kist's own actions plus every installed plugin,
  labelled with the package that provides each one.
- **A warning when a step names an action nothing provides.** A file can be
  entirely valid against the schema and still reference an action you have not
  installed. That otherwise surfaces only when the pipeline reaches the step.
- **Undefined stage dependencies and cycles.** The schema validates shape, not
  cross-references, so a `dependsOn` pointing at a renamed stage passes it.
- **A pipeline graph.** *kist: Show pipeline graph* draws the stages and their
  dependencies beside the editor, from the buffer as it stands — so it works on
  a file that does not run yet.
- **The schema applied without a modeline**, from a copy bundled in the
  extension, so validation needs neither the network nor a `.vscode/settings.json`.

It complements the YAML extension rather than replacing it; keep both.

### Neovim

With `yamlls` configured through `nvim-lspconfig`, the modeline works as-is. To
match by filename instead:

```lua
require("lspconfig").yamlls.setup({
    settings = {
        yaml = {
            schemas = {
                ["https://www.getkist.com/schema.json"] = "kist.y*ml",
            },
        },
    },
})
```

### JetBrains IDEs

Recognised from the `# $schema:` line. Alternatively, register it under
**Settings → Languages & Frameworks → Schemas and DTDs → JSON Schema Mappings**.

## Working offline

The schema ships inside the package, so you do not need the network:

```bash
npx kist schema > kist.schema.json
```

Then point at the local copy:

```yaml
# yaml-language-server: $schema=./kist.schema.json
```

## The schema is the validator

The same document your editor reads is what kist checks `kist.yml` against when
it loads. There is no second, stricter set of rules waiting to reject a file the
editor accepted. A misspelled key is reported with its location:

```
Configuration validation failed:
  - stages.0.steps.0: unknown property "inptus"
```

## Generating configurations with an AI assistant

Point the assistant at <https://www.getkist.com/schema.json>, or paste the
output of `kist schema`. There is also a summary written for that purpose at
<https://www.getkist.com/llms.txt>. Ask it to verify its work with
`npx kist validate`, which checks both the file's structure and that every
action it names is actually installed.
