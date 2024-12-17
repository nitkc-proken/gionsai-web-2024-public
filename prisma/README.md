# apps/api/prisma

## Files
### `README.md`
俺．

### `schema.prisma`
Prismaのデータベーススキーマ定義．

### `seed/main.ts`
seeding用スクリプトのエントリポイント．

### `seed/tables/*`
DBのテーブル別seeding用スクリプト．（`main.ts`から呼ばれる）

## Commands
### `pnpm prisma generate`
`schema.prisma`からTSの型定義とかを生成する．

### `pnpm prisma db push`
`schema.prisma`をDBに反映させる．

### `pnpm prisma db seed`
`seed/main.ts`を実行し，seedingを行う．

### `pnpm prisma migrate reset`
DBをリセットしてseedingを行う．

## Memo
- Q. なんかよくわかんねえけど一発でseedingできないの？
  A. これ使え
  ```console
  $ pnpm prisma migrate dev
  ```
- seeding処理の定義は`../package.json`にある．
