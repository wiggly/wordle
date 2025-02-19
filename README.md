# Wordle

Wordle clone to experiment with Hexagonal pattern in TypeScript code.



## Building

Install dependencies.

```shell
pnpm install
```

Build all packages.

```shell
pnpm -r build
```

Run an ephemeral API server - no data is persisted between runs.

```shell
pnpm -F @wordle/api run start
```

Run an in-browser game bundle web server

```shell
pnpm -F @wordle/web run start
```

Open the previous in-browser game in web browser

```shell
pnpm -F @wordle/web run view
```


sss
