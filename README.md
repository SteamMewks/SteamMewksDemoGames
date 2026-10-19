# SteamMewks Game Demos

SteamMewks 制作のブラウザゲーム体験版・短編作品をまとめて公開するための GitHub Pages 用リポジトリです。

## 構成

```text
SteamMewks_GameDemos/
├─ index.html
├─ .nojekyll
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  └─ js/
│     └─ main.js
├─ mugen-prelude/
│  └─ index.html
└─ troubleshooter-demo/
   └─ index.html
```

## 公開作品

- `mugen-prelude/` — 夢幻ノ迷宮 ― 前日譚
- `troubleshooter-demo/` — とらぶるしゅーたー DEMO

## GitHub Pages での公開方法

1. この構成のまま GitHub リポジトリへアップロード
2. `Settings` → `Pages` を開く
3. 以下を設定
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. 保存すると、しばらくしてトップページが公開されます

## 想定URL例

リポジトリ名が `GameDemos` の場合:

- トップページ: `https://ユーザー名.github.io/GameDemos/`
- 夢幻ノ迷宮 前日譚: `https://ユーザー名.github.io/GameDemos/mugen-prelude/`
- とらぶるしゅーたー DEMO: `https://ユーザー名.github.io/GameDemos/troubleshooter-demo/`

## 追加運用

新しい作品を追加する時は、以下の2点だけで増やせます。

1. 作品用フォルダを追加する
2. ルートの `index.html` にカードを1枚追加する
