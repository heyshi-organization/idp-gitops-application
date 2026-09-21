# argocd/

Argo CD Applicationの定義を`app-<チーム名>-<システム名>.yaml`(リソース名と一致させる)で配置する。

このディレクトリ全体を、プラットフォームチーム管理の`idp-gitops-platform`側で生成される
Application(`app-platform-<チーム名>-repo-idp-gitops-application`)が監視しており、ファイルを
追加してpushするだけで自動的にArgo CDへ登録・同期される。プラットフォームチーム側の作業は
発生しない。

このリポジトリに関係するAppProjectは2つある(どちらもプラットフォームチームが管理)。

| AppProject | 何を縛るか |
|---|---|
| `appproj-platform-<チーム名>-apps` | この`argocd/`ディレクトリに何を置けるか = **Application CRのみ** |
| `appproj-<チーム名>-workloads` | そのApplicationが何をどこへデプロイできるか |

## 書くときの決まり

```yaml
metadata:
  name: app-<チーム名>-<システム名>
  namespace: ns-gitops-team-<チーム名>-sys-<システム名>   # ★必ず明示する
spec:
  project: appproj-<チーム名>-workloads
  destination:
    namespace: ns-gitops-team-<チーム名>-sys-<システム名>
```

- **`metadata.namespace`を必ず明示する。** 省略や`argocd`の指定は、`appproj-platform-<チーム名>-apps` AppProjectの
  `destinations`制約に違反して拒否される。Argo CDの後方互換仕様により`argocd` Namespaceの
  Applicationは任意のAppProjectを参照できてしまうため、チームのApplicationは
  チーム自身のNamespaceに置くことになっている
- **`project`には`appproj-<チーム名>-workloads`を指定する。** デプロイ先Namespace・許可リソース種別が
  そのAppProjectで制限されているので、その範囲内で定義すること
- **このディレクトリにはApplication定義しか置けない。** `appproj-platform-<チーム名>-apps` AppProjectの
  `namespaceResourceWhitelist`が`argoproj.io/Application`のみになっているため、
  DeploymentやSecretを直接置いても弾かれる。ワークロードのマニフェストは
  `manifests/<システム名>/`に置くこと

## 新しいNamespaceが必要なとき

Namespaceの作成はクラスタスコープ操作なので、プロダクトチームでは作れない。
プラットフォームチームに払い出しを依頼し、`appproj-<チーム名>-workloads` AppProjectの`destinations`に
追加してもらってから、このディレクトリにApplicationを追加する。
