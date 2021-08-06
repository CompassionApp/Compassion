# Editor Setup

For the best experience, I recommend using [VS Code](https://code.visualstudio.com/) as that will give you IDE-like features like autocomplete, reference lookups, and nice refactoring tools (variable/file renames with downstream updates).

### Extensions

#### Formatting

For this project and most modern TS/JS projects, we use `prettier` as our formatter. I find that enabling Format on Save helps fix formatting problems effortlessly than manually running a process on the terminal.

To enable this, follow the steps below:

- [Install this extension `esbenp.prettier-vscode`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Open the Command Pallette with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and type `Preferences: Open Settings (JSON)` (select it as it auto-completes)
- In `settings.json`, add the following to your existing configuration:

  ```json
  {
    // Other settings...

    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnPaste": false,
      "editor.formatOnSave": true
    },
    "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnPaste": false,
      "editor.formatOnSave": true
    }
  }
  ```

#### Expo Tools

- [Expo Tools `bycedric.vscode-expo`](https://marketplace.visualstudio.com/items?itemName=bycedric.vscode-expo)
