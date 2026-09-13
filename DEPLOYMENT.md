# GitHub Pages 部署

此專案已設定在推送到 `main` 後，自動安裝依賴、執行 Vite 建置並發布 `dist`。

1. 在 GitHub 建立名稱為 `greenline-housing-radar` 的空白公開 repository，不要預先加入 README、`.gitignore` 或 license。
2. 將 repository 網址設為本機專案的 `origin`，推送 `main`。
3. 在 GitHub repository 開啟 **Settings → Pages → Build and deployment**，將 Source 設為 **GitHub Actions**。
4. 等待 Actions 中的 `Deploy GitHub Pages` 完成。

預設網站網址為 `https://<GitHub 帳號>.github.io/greenline-housing-radar/`。

