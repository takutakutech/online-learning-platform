import ClientLayout from "./client-layout";

export default function Home() {
  return (
    <ClientLayout>
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>オンライン学習プラットフォーム</h1>
        <p>
          月額980円でプレミアム学習コンテンツが利用可能！<br />
          サブスクリプション決済はStripeで安全・簡単。
        </p>
        <a
          href="/register"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            padding: "1rem 2rem",
            background: "#6366f1",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          新規登録はこちら
        </a>
      </main>
    </ClientLayout>
  );
}
