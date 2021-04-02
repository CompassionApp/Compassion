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

1. Install simulators
   Follow the instructions for Android and iOS simulators:

   - For Android, install [Android Studio](https://docs.expo.io/workflow/android-studio-emulator) and through its interface download the SDK and simulator
   - iOS: Install [xcode CLI tools](https://docs.expo.io/workflow/ios-simulator/)

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
   $ brew install reactotronp
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
```

## Testing

```bash
# Run unit tests
$ yarn test

# Open Storybook
$ yarn storybook
```

---

**Everything below this line is from Ignite's original README**

---

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
