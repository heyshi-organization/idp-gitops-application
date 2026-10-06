# manifests/

各アプリケーションのK8sマニフェストを`manifests/<システム名>/`単位で配置する。
CIがビルド後にimage tagを書き換えてcommitする対象。

プラットフォームチーム管理のチームAppProjectで、配置できるリソース種別が制限されている
(`Deployment` / `Service` / `ConfigMap`のみ、cluster-scopedリソース不可。`ServiceMonitor`はkube-prometheus-stack導入まで除外中)。
Namespace自体の作成はプラットフォームチームの担当。

`namespace:`は書かなくてよい。`argocd/app-<チーム名>-<システム名>.yaml`のApplicationの
`destination.namespace`に従って配置される。
