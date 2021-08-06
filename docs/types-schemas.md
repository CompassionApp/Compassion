## Types and Schemas

The single source of truth for our system's data definitions begin with the Typescript types in `./app/types/*.ts`.

Example snippet of one of the types below:

```ts
/**
 * Historical chaperone sessions. Row created as soon as a session has been started
 */
export interface Session {
  /**
   * Primary key
   */
  id: SessionID

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * @format date-time
   */
  startedAt: string

  /**
   * @format date-time
   */
  endedAt: string
}
```

Unlike typical Typescript definitions, you'll notice that every field is heavily annotated with JSDoc blocks. These exist to help [`ts-json-schema-generator`](https://github.com/vega/ts-json-schema-generator) to produce a standard [JSON Schema](https://json-schema.org/) from the types.

The JSON Schemas created by this process will then be used for:

- Runtime type validations using [ajv](https://ajv.js.org/)
- Generating MobX State Tree models using [`jsonschema-to-mobx-state-tree`](https://github.com/ralusek/jsonschema-to-mobx-state-tree)

### Defining a New Type

Start by creating a new Typescript (`.ts`) file in `./app/types/` and include with a barrel export in `index.ts`. Then, export a type by the same name of the file.

```ts
// ./app/types/index.ts
export * from "./example"

// ./app/types/example.ts
export interface Example {
  // ...
}
```

Be sure to use the appropriate [JSDoc annotations](https://github.com/YousefED/typescript-json-schema#annotations) where possible to further refine the field definitions in ways that can't be expressed in Typescript, such as value ranges (`@minimum 1`, `@maximum 100`) and well-defined string formats (`@format date-time`, `@format uuid`).

Once your Typescript types are defined, run `yarn generate`, and the schema will be available at `./app/types/Example.schema.json`.

### Generating JSON Schemas

To compile a specific Typescript type into a JSON Schema, use the following to invoke `ts-json-schema-generator` manually:

```bash
./node_modules/.bin/ts-json-schema-generator \
   --path './app/types/geo.ts' \
   --type 'LatLng' \
   -o './app/types/LatLng.schema.json' \
   -f tsconfig.json \
   --no-ref-encode --no-top-ref -e none
   # Note: $refs don't play well with ajv, so we need to set compiler options to avoid this at all costs

# Or use the helper script w/ args
./scripts/compile-schema.sh app/types/geo.ts Geo
```

To automatically generate schemas from the base entities, run:

```bash
yarn generate
# Types defined in ./app/types/*.ts will now have *.schema.json counterparts
```

**Note:** The above will only work if the filename matches the exported type.
