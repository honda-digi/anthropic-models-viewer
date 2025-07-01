import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModels = async () => {
    if (!apiKey.trim()) {
      setError('API Keyを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setModels([]);

    try {
      const response = await fetch('/api/models', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey.trim(),
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setModels(data.data || []);
        if (!data.data || data.data.length === 0) {
          setError('モデルが見つかりませんでした');
        }
      } else {
        setError(data.error || 'エラーが発生しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchModels();
    }
  };

  return (
    <>
      <Head>
        <title>Anthropic Models Viewer</title>
        <meta name="description" content="View available Anthropic AI models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            🤖 Anthropic Models Viewer
          </h1>

          <p className={styles.description}>
            利用可能なAnthropicモデルの一覧を表示します
          </p>

          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Anthropic API Keyを入力してください"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
                disabled={loading}
              />
              <button 
                onClick={fetchModels} 
                disabled={loading || !apiKey.trim()}
                className={styles.button}
              >
                {loading ? '取得中...' : 'モデル一覧を取得'}
              </button>
            </div>
            
            <div className={styles.warning}>
              <strong>注意:</strong> API Keyは安全に管理してください。サーバーに保存されません。
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <strong>⚠️ エラー:</strong> {error}
            </div>
          )}

          {models.length > 0 && (
            <div className={styles.results}>
              <h2>📋 利用可能なモデル ({models.length}個)</h2>
              <div className={styles.modelsGrid}>
                {models.map((model) => (
                  <div key={model.id} className={styles.modelCard}>
                    <h3 className={styles.modelName}>
                      {model.display_name || model.id}
                    </h3>
                    <div className={styles.modelInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.label}>ID:</span>
                        <code className={styles.value}>{model.id}</code>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Type:</span>
                        <span className={styles.value}>{model.type || 'N/A'}</span>
                      </div>
                      {model.created_at && (
                        <div className={styles.infoRow}>
                          <span className={styles.label}>Created:</span>
                          <span className={styles.value}>
                            {new Date(model.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <p>Powered by Next.js & Vercel 🚀</p>
        </footer>
      </div>
    </>
  );
}