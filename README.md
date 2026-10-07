# idp-gitops-application

プロダクトチームが所有するワークロード用リポジトリ。ここに変更をpushすると、
プラットフォームチーム管理の`idp-gitops-platform`側で生成されるApplication
(`app-platform-<チーム名>-repo-idp-gitops-application`)が`argocd/`配下を検知し、Argo CD経由で自動的に
クラスタへ反映される。

## ディレクトリ構成

```
idp-gitops-application/
├── apps/<システム名>/       … アプリケーションのソースコード
├── manifests/<システム名>/  … アプリケーションのK8sマニフェスト
├── argocd/app-<チーム名>-<システム名>.yaml … Argo CD Application定義(チームのAppProject配下)
└── docs/                  … プロダクトチーム向けドキュメント
```

1つのシステムが複数マイクロサービスで構成される場合、それぞれを別のシステムとして扱い、
`apps/<システム名>/`・`manifests/<システム名>/`という単位を保つ
(例: `apps/order-api/`, `apps/order-worker/`)。Namespaceもシステム単位で払い出されるため、
必要な数だけプラットフォームチームに依頼する。

## Namespace命名規則

```
ns-gitops-team-<チーム名>-sys-<システム名>
```

Application CRは`argocd` Namespaceではなく、このNamespaceに置く
(理由は[`argocd/README.md`](./argocd/README.md)を参照)。

CI/CDは未整備。ARCの導入が終わった後、`idp-workflows`リポジトリのReusable workflowを`uses:`で
呼び出すだけの薄い定義として`.github/workflows/`に追加する(CI/CDのベースロジックはプラットフォームチームが
`idp-workflows`側で一元管理する)。それまでは、イメージのビルド・pushと`manifests/<システム名>/`のimage tagの
更新を手作業で行う。

新規アプリの追加方法は[`docs/adding-a-new-app.md`](./docs/adding-a-new-app.md)を参照。
