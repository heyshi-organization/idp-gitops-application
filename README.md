# idp-gitops-application

プロダクトチームが所有するワークロード用リポジトリ。ここに変更をpushすると、
プラットフォームチーム管理の`idp-gitops-platform`側で生成される boundary Application
(`<チーム名>--idp-gitops-application`)が`argocd/`配下を検知し、Argo CD経由で自動的に
クラスタへ反映される。

## ディレクトリ構成

```
idp-gitops-application/
├── apps/<システム名>/       … アプリケーションのソースコード
├── manifests/<システム名>/  … アプリケーションのK8sマニフェスト(CIがimage tagを書き換える)
├── argocd/<システム名>.yaml … Argo CD Application定義(チームのAppProject配下)
├── docs/                  … プロダクトチーム向けドキュメント
└── .github/workflows/     … CI/CD呼び出し用workflow(実処理はidp-workflowsのReusable workflow)
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

`.github/workflows/`配下のファイルは、ビルド・イメージpush・manifest更新・smoke testといった
実処理を持たず、`idp-workflows`リポジトリのReusable workflowを`uses:`で呼び出すだけの薄い
定義にする。CI/CDのベースロジックはプラットフォームチームが`idp-workflows`側で一元管理する。

新規アプリの追加方法は[`docs/adding-a-new-app.md`](./docs/adding-a-new-app.md)を参照。
