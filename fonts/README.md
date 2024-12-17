# fonts
このフォルダにはttf形式のフォントファイルをwoff2形式に変換するためのスクリプトが含まれています。
実行にはDockerが必要です。

## 使い方

### 1. (初回のみ) イメージをビルド
```bash
./scripts/build.sh
```
### 2. フォントファイルを変換
`fonts`内の`.ttf`がすべて`.woff2`に変換されます。
```bash
./scripts/run.sh
```
### 3. `.ttf`を削除
`.woff2`が見つかった場合、`.ttf`版を削除します。
```bash
./scripts/clean.sh
```