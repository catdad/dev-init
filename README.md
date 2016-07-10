# dev-init

[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[7]: https://img.shields.io/npm/dm/git-init.svg
[8]: https://www.npmjs.com/package/git-init
[9]: https://img.shields.io/npm/v/git-init.svg

[10]: https://david-dm.org/catdad/git-init.svg
[11]: https://david-dm.org/catdad/git-init

Initialize your new git repo with Kiril-approved settings.

## Install

```bash
npm install -g dev-init
```

## Use

```bash
mkdir my-cool-lib
cd my-cool-lib
dev-init
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
dev-init --linter ESLint
```

You can define as many linters as you would like to use:

```bash
dev-init --linter ESLint --linter JSHint --linter JSCS
```

### `.editorconfig`

Kiril also approves of other IDEs. An [`.editorconfig`](http://editorconfig.org/) file will be created to configure a whole plethora of other IDEs. If your favorite IDE does not support it natively, there is probably a plugin for it.

### `README.md`

An empty readme file will be created, to get you started and remind you that writing a readme is important.

## I don't like your settings.

That's okay. Not everyone has to make the correct choices. You can still use this project though, to configure and enforce the settings you do prefer. Feel free to clone it and make all the changes you would like to the files in the `fixtures` folder.

You can set it up in your dev environment as such:

```bash
git clone git@github.com:catdad/dev-init.git
cd dev-init
npm install
npm link
```

Now you can make changes and use the `dev-init` cli command with your local version.
## License

[ISC](http://spdx.org/licenses/ISC)
