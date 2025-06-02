基本的に以下の物を実装します。除けなものは入れないでください。ただし、どうしても必要
なものがあれば、提案してください。

要件定義まとめ（最終版）
プロジェクト概要
名前: オンライン学習プラットフォーム（MVP）
目的: Stripeサブスクリプション機能の学習・練習
技術構成: Next.js + Supabase Auth + Supabase DB + Stripe
機能要件
必須機能（MVP）

ユーザー登録・ログイン

メールアドレス + パスワード認証
Supabase Auth使用


サブスクリプション決済

月額980円
無料トライアルなし
Stripe使用


ページ構成

トップページ（サービス説明 + 登録ボタン）
登録・決済ページ（メール登録 + Stripe決済）
プレミアムコンテンツページ（会員限定）
ログインページ（既存ユーザー用）



アクセス制御

サブスク会員（active状態）のみプレミアムページにアクセス可能
支払い失敗時は即座にアクセス停止

技術要件
フロントエンド

Next.js（最新版）
Supabase Auth（認証）
Stripe Elements（決済UI）

バックエンド

Next.js API Routes
Supabase（PostgreSQL + Auth）
Stripe Webhook

データベース設計

Users（Supabase Authが自動生成 + カスタムフィールド）
追加フィールド: subscription_status, stripe_customer_id, subscription_id

環境変数

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET

除外する機能

プロフィール編集
パスワードリセット（Supabaseで標準提供されるが今回は使わない）
複数プラン
無料コンテンツ
管理画面

開発フロー

Supabaseプロジェクト作成
基本認証実装
Stripe統合
Webhook設定
アクセス制御実装

