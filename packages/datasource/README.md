# datasource
マスタデータの管理や加工、同期を行う
## src/preprocessor
Excel形式のファイルをパースする

### 準備
* 企画DBを`ProjectDB.xlsx`という名前で`input/`に入れる。
* 企画画像を`input/ProjectImages/`に入れる。
### 実行
```
pnpm preprocess
```

`deploydata/`にProjectDB.jsonや各種画像ファイルなどが吐き出される。

これをPrismaのseedから読み取り、seedingしたり、MinIOにアップロードする。

内容が更新されない場合は`deploydata/cache.json`を消してください。

## src/deploy
企画DBや画像など外部データをDBやMinIOへ同期する

### 準備
`deploydata/`下に`ProjectImages/`,`ProjectMapImages/`,`ProjectOGP/`を用意する(すべてwebp)
docker composeでDB,MinIOを起動する
```
docker compose up
```

### 実行
```
pnpm sync
```

