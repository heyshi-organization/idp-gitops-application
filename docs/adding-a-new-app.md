# 新規アプリの追加手順

1. `apps/<app名>/`にソースコードを追加
2. `manifests/<app名>/`にK8sマニフェストを追加
   - 許可されているリソース種別: `Deployment` / `Service` / `ConfigMap` / `ServiceMonitor`
   - cluster-scopedリソース(Namespace等)は配置不可。Namespaceの新規払い出しは
     Platform teamに依頼する
3. `argocd/<app名>.yaml`にArgo CD Application定義を追加(`project: dev-team`)
4. `.github/workflows/`にCI呼び出し用のworkflowを追加、または既存workflowのpathフィルタに
   `apps/<app名>/**`を追加。ビルド・イメージpush・`manifests/<app名>/`のimage tag書き換えといった
   実処理は`idp-workflows`リポジトリのReusable workflowに定義されているので、このリポジトリ側は
   `uses:`でそれを呼び出し、アプリ名やパスを`with:`で渡すだけでよい

デプロイ先NamespaceやRBAC(ServiceAccount/Role)はPlatform teamが`idp-gitops-platform`側で
管理する。新しいNamespaceが必要な場合は先にPlatform teamへ依頼すること。
