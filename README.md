<div style="text-align:center">
  ![Compassion](assets/logo.png)
</div>

# Compassion App

[![codecov](https://codecov.io/gl/compassion-in-oakland/compassionapp/branch/\x6d6173746572/graph/badge.svg?token=FAM6KCQFV8)](https://codecov.io/gl/compassion-in-oakland/compassionapp)

Compassion App is a [React Native](https://reactnative.dev/)/[Expo Framework](https://docs.expo.io/) application built with the [Ignite](https://github.com/infinitered/ignite) boilerplate. Please take a look at the documentation for Ignite to get familiar with its library choices, architecture, and development style.

## Setup

1. Install [nvm](https://github.com/nvm-sh/nvm) to manage Node versions. We'll use Node `v16.0.0` for this project.

   ```bash
   # After install:
   $ nvm install 16.0.0 && nvm alias default 16.0.0
   ```

1. Install simulators by [following the instructions here.](docs/simulator-setup.md)

1. Install `yarn`

   ```bash
   $ npm install -g yarn
   ```

1. Install project dependencies

   ```bash
   $ yarn
   ```

1. Install [Expo CLI](https://docs.expo.io/workflow/expo-cli/) and [Reactotron](https://github.com/infinitered/reactotron)

   ```bash
   # Install expo-cli
   $ npm install -g expo-cli

   # Install reactotron
   $ brew install reactotron
   ```

Also, you might want to check out [Editor Setup](docs/editor-setup.md) if using VS Code for the first time for a Typescript project.

...aaand you're set!

## Development

The development process is usually: open Metro --> launch the simulator of your choice --> start development.

```bash
# Opens the Metro bundler
$ yarn start
# Either on the command line or on the web interface, select a simulator (iOS or Android) to connect to.
# Wait for Expo to be installed on your simulator image and then for Expo to build and publish the bundle to the virtual device

# (Optionally) Open Reactotron to inspect the app, similar to Redux Dev Tools

# In another terminal instance, run the following to get live feedback about Typescript errors
$ yarn compile --watch

# Similarly, you can keep a watch process for unit tests
$ yarn test --watch
```

### Debugging

Occasionally, you'll have to open [the Expo developer menu](https://docs.expo.io/workflow/development-mode/#showing-the-developer-menu) to reload the app or to debug issues. To activate the menu, use the following keyboard shortcuts:

- For iOS simulators, press <kbd>Ctrl</kbd>+<kbd>Cmd</kbd>+<kbd>z</kbd>
- For Android simulators, press <kbd>Cmd</kbd>+<kbd>m</kbd>

![Expo Menu](docs/expo-menu.png)

What's very useful from this menu is the **Element Inspector**, which acts similar to Chrome's DevTools for inspecting the bounds and attributes of UI elements.

## Testing

### Unit Tests

```bash
# Run unit tests
$ yarn test

# Update Jest Snapshots
$ yarn test -u
```

### Storybook

Storybook in React Native works a little bit differently than with a web-based React app.

First, you'll need to start Storybook, which will build the project and launch the Storybook viewer on https://localhost:9001:

```bash
$ yarn storybook
```

Then add this line in `./storybook/toggle-storybook.tsx`:

```ts
saveString("devStorybook", "on")
```

When you reload your app, your simulator will render the story and will respond to changes as you select different stories on the browser.

### End-to-end Testing with Detox

[Detox](https://github.com/wix/Detox) is a test automation library for writing and driving E2E tests against the app. This library comes with the Ignite boilerplate and doesn't appear to have many tests initially, but it'll be useful later when we need to program specific behaviors and user flows for verification in CI.

## Data Structure

Please see [Firestore Structure](docs/firebase-schema.md) doc to understand our data structure schema for the app.

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

## Resources

Below are recommended resources to reference and read about when working with the app.

- **[react-navigation's guide on nested navigators](https://reactnavigation.org/docs/nesting-navigators/)**
  This is a great guide to explain the difference between browser-based navigation (via manipulating route parameters in the URL) and the _stack navigator_ which is what most mobile apps employ.
