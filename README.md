# ОБЯЗАТЕЛЬНО СДЕЛАЙТЕ npm run prepare !!!!!

# tasktracker

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Уникальные компоненты для каждой операции

Для каждой операции в проекте имеется уникальный компонент, который находится в папке `/src/components/operations`. Название каждого компонента содержит id операции, например `01.OptionalOperationName.vue` соответствует операции с id=1.

Для загрузки необходимого компонента-операции используется `/src/components/OperationLoader.vue`. Он загружает нужный нам компонент по ключу из `operationComponents.json`.

Для генерации или обновления `operationComponent.json` используйте команду `npm run gen`.


### бэкенд

Фронт работает с веткой бэка https://git.ttrace.ru/ttrace/admin-backend-api/-/tree/feature/tasktracker_api