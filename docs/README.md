# 開発者向けドキュメント

## [remix(フロントエンド)](./remix/README.md)
## [api(バックエンド)](./api/README.md)

# 開発準備

## 依存パッケージのインストールとhookのセットアップ
```sh
pnpm i
pnpm lefthook install
```
## .env.exampleのコピー
```sh
cd apps/api
cp .env.example .env
```
```sh
cd apps/remix
cp .env.example .env
```

## (バックエンドのみ) Prismaのセットアップ
```sh
cd apps/api
pnpm prisma generate
```


# スタート
## フロントエンド(remix)のみ起動
```sh
cd apps/remix
pnpm dev
```
## バックエンド(api)のみ起動
```sh
cd apps/api
pnpm dev
```
## 両方起動
```sh
pnpm dev
```

## Maildev/DBの起動
```sh
docker compose up -d
```