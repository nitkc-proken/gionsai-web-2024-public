バックエンドの開発には [`hono`](https://hono.dev/) を使用している。

# エンドポイントの作成
バックエンドを開発するとき、一つのファイルに大量のコードが書かれないようにするため、エンドポイントごとにファイルを分割する。

企画に関連するものは`projects.ts`、ユーザーに関連するものは`users.ts`など、エンドポイントごとにファイルを分割する。

[/apps/api/src/example.ts](/apps/api/src/example.ts)を見ると、バックエンドの書き方がわかる。

まず、ファイルごとに新しい`Hono`のインスタンスを作成する。

#### `example.ts`
```ts
const example = new Hono();
```
次にルートを定義する。
以下のように、複数のルートは全部.でつなげていくこと。
```ts
export const exampleRoute = example
	.get("/tasks", (c) => {
		return c.json(db);
	})
	// With Validation
	.post("/tasks/new", zValidator("json", schema.pick({ title: true })), (c) => {
		const data = c.req.valid("json");
		const newTask = {
			id: Math.random().toString(36).slice(-8),
			title: data.title,
			completed: false,
			created: new Date(),
		};
		db.push(newTask);

		return c.json(
			newTask,
			201, // Created
		);
	})
```
<details>
<summary>だめな例 こうすると後述するRPCがうまく作動しない。</summary>

```ts
export const exampleRoute = example
	.get("/tasks", (c) => {
		return c.json(db);
	})
//↓別のところに書いてしまっている。 .get(...).post(...)のように連続して書くこと
example.post("/tasks/new", zValidator("json", schema.pick({ title: true })), (c) => {
		const data = c.req.valid("json");
		const newTask = {
			id: Math.random().toString(36).slice(-8),
			title: data.title,
			completed: false,
			created: new Date(),
		};
		db.push(newTask);

		return c.json(
			newTask,
			201, // Created
		);
	})
```

</details>

次にindex.ts内でexampleを読み込む。

#### `index.ts`
```diff
 const app = new Hono().basePath("/api");
 const route = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
+	.route("/example", exampleRoute);
```

/exampleと書かれているので、exampleRouteの中身はすべて/example/以下になる。
# RPC
HonoはRPCをサポートしている。これによってAPIに必要なパラメーターなどをすべて型安全にできる。これによって、フロントエンドがとても楽になる。

[/docs/common/README.md](/docs/common/README.md)に書かれている`schema`を使うと、バックエンド側で型安全にエラーメッセージを返すことができる。

<details>

<summary>zValidatorを使う方法</summary>

Zodを使ってスキーマを定義してから、`zValidator`を使ってバリデーションを行う。
zValidatorの第一引数はバリデーションの対象で、`json`だと本文、`query`だとクエリパラメーター(?id=1みたいな)
```ts
const schema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
	created: z.date(),
});

example.post("/tasks/new", 
  zValidator("json", schema.pick({ title: true })),
   (c) => {
		const data = c.req.valid("json");
		const newTask = {
			id: Math.random().toString(36).slice(-8),
			title: data.title,
			completed: false,
			created: new Date(),
		};
		db.push(newTask);

		return c.json(
			newTask,
			201, // Created
		);
	})
```
</details>

# DBの操作
DBを操作するために[`prisma`](https://www.prisma.io/)を使用している。
```ts
import { prisma } from "./lib/prisma";
```
で使える。

# 環境変数の使用
`.env`内に書いた環境変数は`apps/api/src/lib/env.ts`内の`env`から取得できる。

## 使用例
```ts
import { env } from "~/lib/env";
const port = Number(env.PORT) || 3000;
```