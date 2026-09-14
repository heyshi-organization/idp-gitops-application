# argocd/

Argo CD Applicationの定義を`<app名>.yaml`(app名そのまま、拡張子`.yaml`)で配置する。
このディレクトリ全体を、プラットフォームチーム管理の`idp-gitops-platform`側App of Apps
(`team-a-root-app`)が監視しており、ファイルを追加してpushするだけで自動的に
Argo CDへ登録・同期される。

`project: team-a`を指定し、`team-a` AppProjectの制約(デプロイ先Namespace・
許可リソース種別)の範囲内で定義すること。
