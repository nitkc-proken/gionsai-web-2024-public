#!/bin/bash
function copy_all_woff2() {
  echo "Copying all .woff2 files"
  for font in *.woff2; do
    cp $font ../apps/remix/app/assets/fonts
    echo "Copied $font to ../apps/remix/app/assets/fonts"
  done
}
# .ttfがない場合かつ.woff2がある場合
if [ ! -f *.ttf ] && [ -f *.woff2 ]; then
  copy_all_woff2
  exit
fi
container=$(docker create -v ./:/work gionsai-woff2)
docker start $container

# すべての.ttfで繰り返す
for font in *.ttf; do
  # フォント名を取得
  name=$(basename "$font" .ttf)
  # name.woff2が存在しない場合
  if [ ! -f "$name.woff2" ]; then
    # woff2コンテナを実行
    docker exec $container woff2_compress "$font" &
  else
    echo "$name.woff2 already exists"
  fi
done
wait
docker stop $container
docker rm -f $container
copy_all_woff2
