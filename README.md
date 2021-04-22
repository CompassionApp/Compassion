<div style="text-align:center">
  ![Compassion](assets/logo.png)
</div>

# Compassion App

Compassion App is a [React Native](https://reactnative.dev/) application built with the [Ignite](https://github.com/infinitered/ignite) boilerplate. Please take a look at the documentation for Ignite to get familiar with its library choices, architecture, and--most importantly--[generators](https://github.com/infinitered/ignite/blob/master/docs/Generators.md).

## Setup

1. Install [nvm](https://github.com/nvm-sh/nvm) to manage Node versions. We'll use Node `v14.16.0` for this project.

   ```bash
   # After install:
   $ nvm install 14 && nvm alias default 14
   ```

1. Install simulators. Follow the instructions below for Android and iOS simulators:

   - **Android** Install [Android Studio](https://docs.expo.io/workflow/android-studio-emulator) and through its interface download the SDK and simulator
     - ...
   - **iOS** Install [xcode CLI tools](https://docs.expo.io/workflow/ios-simulator/)
     - Enable location mocking in the simulator by going to `Features > Location > City Run`

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

Occasionally, you'll have to open [the Expo developer menu](https://docs.expo.io/workflow/development-mode/#showing-the-developer-menu) to reload the app or to debug issues. To activate the menu, use the following:

- For iOS simulators, press <kbd>Ctrl</kbd>+<kbd>Cmd</kbd>+<kbd>z</kbd>
- For Android simulators, press <kbd>Cmd</kbd>+<kbd>m</kbd>

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

---

## Ignite

**Everything below this line is from Ignite's original README**

## Boilerplate Features

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── i18n
│   ├── utils
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── app.tsx
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
│   ├── toggle-storybook.tsx
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the src directory looks similar to the following:

```
app
│── components
│── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your React components will live. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components. The app will come with some commonly used components like Button.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins and examples to help you get started with React Native.

### ./storybook directory

This is where your stories will be registered and where the Storybook configs will live.

### ./test directory

This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

## Running Storybook

From the command line in your generated app's root directory, enter `yarn run storybook`
This starts up the storybook server and opens a story navigator in your browser. With your app
running, choose Toggle Storybook from the developer menu to switch to Storybook; you can then
use the story navigator in your browser to change stories.

For Visual Studio Code users, there is a handy extension that makes it easy to load Storybook use cases into a running emulator via tapping on items in the editor sidebar. Install the `React Native Storybook` extension by `Orta`, hit `cmd + shift + P` and select "Reconnect Storybook to VSCode". Expand the STORYBOOK section in the sidebar to see all use cases for components that have `.story.tsx` files in their directories.

## Running e2e tests

Read [e2e setup instructions](./e2e/README.md).
