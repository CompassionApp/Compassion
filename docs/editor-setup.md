# Editor Setup

For the best experience, I recommend using [VS Code](https://code.visualstudio.com/) as that will give you IDE-like features like autocomplete, reference lookups, and nice refactoring tools (variable/file renames with downstream updates).

### Extensions

For this project and most modern TS/JS projects, we use `prettier` as our formatter. I find that enabling Format on Save helps fix formatting problems effortlessly than manually running a process on the terminal.

To enable this, follow the steps below:

- [Install this extension `esbenp.prettier-vscode`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Add the following to your configuration JSON (via command pallete: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> -> `Preferences: Open Settings (JSON)`):
  ```
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnPaste": false,
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnPaste": false,
    "editor.formatOnSave": true
  },
  ```
