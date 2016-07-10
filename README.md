# git-init

Initialize your new git repo with Kiril-approved settings.

## Install

```bash
npm install -g git-init
```

## Use

```bash
mkdir my-cool-lib
cd my-cool-lib
git-init
```

## So what happens?

### `git init`

The regular `git init` command is run for the module, to create all the necessary git bits.

### `.gitignore`

A default `.gitignore` file is used, suitable for NodeJS module and application development on macOS, Windows, and Linux.

### `.gitattributes`

A default `.gitattributes` file is used, to standardize file checkouts across macOS, Windows, and Linux. This will ensure things like linting will never be broken on operating systems that you might not be using, but other members on your team are.

### `.brackets.json`

Kiril approves of Brackets. So a config file is created to correctly set up Brackets. There is an option here to select your prefered linter:

```bash
git-init --linter ESLint
```

You can define as many linters as you would like to use:

```bash
git-init --linter ESLint --linter JSHint --linter JSCS
```

### `.editorconfig`

Kiril also approves of other IDEs. An [`.editorconfig`](http://editorconfig.org/) file will be created to configure a whole plethora of other IDEs. If your favorite IDE does not support it natively, there is probably a plugin for it.

### `README.md`

An empty readme file will be created, to get you started and remind you that writing a readme is important.

## License

[ISC](http://spdx.org/licenses/ISC)
