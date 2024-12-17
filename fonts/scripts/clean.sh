#!/bin/bash
# すべてのwoff2コンテナを削除
docker rm -f $(docker ps -a -q -f "ancestor=gionsai-woff2")
# すべての.woff2で繰り返す
for font in *.woff2; do
  # フォント名を取得
  name=$(basename "$font" .woff2)
  # name.woff2が存在する場合
  if [ -f "$name.woff2" ]; then
    # woff2コンテナを実行
    rm -f "$name.ttf"
    echo "Removed $name.ttf"
  else
    echo "$name.woff2 not found"
  fi
done
wait