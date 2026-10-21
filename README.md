# 爬可夢 爬寵水族道館 ‧ 官網

官網首頁 + 管理後台，部署在 GitHub Pages，資料存放在 Firebase（免費方案即可，不需要信用卡）。

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 官網首頁、登入頁、管理後台（全部在這一個檔案） |
| `login.html` | 舊網址相容，自動跳轉到登入頁 |
| `firebase-config.js` | **你要填寫的設定檔** |
| `firestore.rules` | 資料庫安全規則（貼到 Firebase 主控台用） |

---

## 一次性設定（約 15 分鐘）

### 步驟 1：建立 Firebase 專案
1. 打開 <https://console.firebase.google.com>，用你的 Google 帳號登入。
2. 按「建立專案」，名稱隨意（例如 `pokereptile`），Google Analytics 可以關閉。

### 步驟 2：建立網頁應用程式，拿到設定值
1. 專案首頁點 **`</>`（網頁）** 圖示，應用程式暱稱隨意，**不用**勾選 Firebase Hosting。
2. 畫面會出現一段 `const firebaseConfig = { ... }`。
3. 打開 `firebase-config.js`，把 `apiKey`、`authDomain`、`projectId`、`storageBucket`、`messagingSenderId`、`appId` 六個值逐一貼進去。

> 之後要再找這段設定：左上角齒輪 ⚙️ →「專案設定」→ 往下捲到「你的應用程式」。

### 步驟 3：開啟 Email 登入並建立管理員帳號
1. 左側選單「建構 → **Authentication**」→「開始使用」。
2. 「登入方式」分頁 → 選「**電子郵件/密碼**」→ 開啟第一個開關 → 儲存。
3. 「**使用者**」分頁 →「新增使用者」→ 輸入管理員的 Email 和密碼（這就是登入後台用的帳密）。
4. 「**設定**」分頁 →「授權網域」→「新增網域」→ 輸入你的 GitHub Pages 網域，例如 `你的帳號.github.io`。
5. （建議）「設定」分頁 →「使用者動作」→ 關閉「啟用建立（註冊）」，避免陌生人自行註冊帳號。

### 步驟 4：建立 Firestore 資料庫
1. 左側選單「建構 → **Firestore Database**」→「建立資料庫」。
2. 位置選 **`asia-east1 (台灣)`**（建立後不能改）。
3. 選「**以正式版模式啟動**」→ 建立。

### 步驟 5：貼上安全規則
1. 打開 `firestore.rules`，把 `your-email@example.com` 換成步驟 3 的管理員 Email。
2. Firestore Database →「**規則**」分頁 → 刪掉原本內容，貼上整份 `firestore.rules` →「發布」。

### 步驟 6：填寫管理員 Email
打開 `firebase-config.js`，把 `ADMIN_EMAILS` 裡的 `your-email@example.com` 換成同一個 Email。

### 步驟 7：上傳到 GitHub Pages
把 `index.html`、`login.html`、`firebase-config.js` 上傳到 GitHub repo 根目錄，在 repo 的 Settings → Pages 選擇從 `main` 分支部署。

### 步驟 8：第一次登入
打開 `https://你的帳號.github.io/你的repo/#login`，用步驟 3 的帳密登入。
第一次登入時，網站會自動把預設內容寫進資料庫，之後所有修改都會即時同步給所有訪客。

---

## 新增其他管理員
1. Authentication →「使用者」→ 新增使用者。
2. 把新 Email 同時加到 `firestore.rules`（記得重新發布）和 `firebase-config.js` 的 `ADMIN_EMAILS`。

## 忘記密碼
在登入頁輸入 Email 後按「忘記密碼？寄重設信」，或在 Authentication →「使用者」裡重設。

## 免費額度與照片
- 上傳的照片會自動壓縮（每張約 100–400KB），存在 Firestore 裡。
- Firebase 免費方案的 Firestore 每月約有 10GB 的下載流量。每位訪客打開首頁都會下載一次相簿照片，所以相簿照片越多、越大，每月能服務的瀏覽次數就越少。
  例如 12 張照片約 2–3MB，大約可支撐每月 3,000–5,000 次瀏覽。
- 如果流量變大，相簿可以改用「貼上圖片網址」的方式（照片放在別的圖床），就不會佔用 Firebase 流量。
- 用量可以在 Firebase 主控台 →「用量與帳單」查看。超過免費額度時服務會暫停到下個月，不會自動扣款。

## 常見問題

| 狀況 | 解決方式 |
| --- | --- |
| 登入頁顯示「網站尚未連接 Firebase」 | `firebase-config.js` 的 `apiKey` 或 `projectId` 還是空的。改完上傳後，GitHub Pages 約需幾分鐘生效，可按 `Ctrl + F5` 強制重新整理。 |
| 登入時顯示「這個帳號沒有後台管理權限」 | 登入的 Email 不在 `firebase-config.js` 的 `ADMIN_EMAILS` 裡。 |
| 可以登入，但儲存時顯示「沒有寫入權限」 | `firestore.rules` 裡的 Email 沒換成你的，或改完忘了按「發布」。 |
| 登入時顯示「Email 或密碼錯誤」 | 到 Authentication →「使用者」確認帳號存在，或用「忘記密碼」重設。 |
| 在自己的網域登入時跳出錯誤 `auth/unauthorized-domain` | 步驟 3-4：把網域加到「授權網域」。 |

## 安全性說明
- `firebase-config.js` 裡的設定值本來就會公開在網頁上，這是正常的；資料安全由 `firestore.rules` 保護，只有名單內的 Email 能修改內容。
- 請勿把管理員密碼寫在任何檔案裡。
