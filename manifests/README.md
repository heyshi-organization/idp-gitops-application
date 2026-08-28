# manifests/

各アプリケーションのK8sマニフェストを`manifests/<app名>/`単位で配置する。
CIがビルド後にimage tagを書き換えてcommitする対象。

Platform team管理の`dev-team` AppProjectで、配置できるリソース種別が制限されている
(`Deployment` / `Service` / `ConfigMap` / `ServiceMonitor`のみ、cluster-scopedリソース不可)。
Namespace自体の作成はPlatform teamの担当。
