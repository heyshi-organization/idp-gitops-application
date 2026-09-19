# 新規アプリの追加手順

1. `apps/<システム名>/`にソースコードを追加
2. `manifests/<システム名>/`にK8sマニフェストを追加
   - 許可されているリソース種別: `Deployment` / `Service` / `ConfigMap` / `ServiceMonitor`
     (`ServiceMonitor`はkube-prometheus-stack導入まで一時的に除外中)
   - cluster-scopedリソース(Namespace等)は配置不可
   - `namespace:`は書かなくてよい。Application の`destination.namespace`に従って配置される
3. `argocd/<システム名>.yaml`にArgo CD Application定義を追加
   - `metadata.namespace`に`ns-gitops-team-<チーム名>-sys-<システム名>`を**必ず明示する**
   - `spec.project`にチーム名のAppProjectを指定する
   - 詳細は[`../argocd/README.md`](../argocd/README.md)を参照
4. `.github/workflows/`にCI呼び出し用のworkflowを追加、または既存workflowのpathフィルタに
   `apps/<システム名>/**`を追加。ビルド・イメージpush・`manifests/<システム名>/`のimage tag書き換えといった
   実処理は`idp-workflows`リポジトリのReusable workflowに定義されているので、このリポジトリ側は
   `uses:`でそれを呼び出し、アプリ名やパスを`with:`で渡すだけでよい

## 新しいNamespaceが必要な場合

Namespaceの払い出しはプラットフォームチームの担当。先に依頼すること。

プラットフォームチーム側では`idp-gitops-platform`リポジトリで以下が行われる。

- `gitops/teams/<チーム名>/manifests/namespaces/<システム名>/`に
  Namespace / ResourceQuota / LimitRange / NetworkPolicy / RBAC を追加
- `<チーム名>` AppProjectの`destinations`に追加

Namespace名は`ns-gitops-team-<チーム名>-sys-<システム名>`の規則に従う。
これが揃っていないとAppProjectのパターンにマッチせず、Applicationが拒否される。

## デプロイ先の制約について

Namespace自体・RBAC(ServiceAccount/Role/RoleBinding)・ResourceQuota・LimitRange・
NetworkPolicyはいずれもプラットフォームチームが`idp-gitops-platform`側で管理する。
このリポジトリからは変更できない(AppProjectの`namespaceResourceWhitelist`で制限されている)。
