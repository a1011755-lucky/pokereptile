# 爬可夢 爬寵水族道館 ‧ 官網專案說明（給 Claude 看的）

## 關於使用者
- 使用繁體中文溝通，非工程背景：說明要一步一步、附連結、少用術語。
- 會在兩台電腦（桌機、筆電）輪流修改。
- **絕對不要要求或記錄任何密碼。**

## 網站與服務
| 項目 | 內容 |
| --- | --- |
| 官網 | https://a1011755-lucky.github.io/pokereptile/ |
| 後台登入 | 官網網址加 `#login` |
| GitHub repo | https://github.com/a1011755-lucky/pokereptile （公開，`main` 分支由 GitHub Pages 直接發布根目錄） |
| Firebase 專案 | `mskao-5359b`（Spark 免費方案，不需信用卡） |
| 管理員 Email | `a1011755@gmail.com`（帳號建在 Firebase Authentication，Email/密碼登入） |

## 工作流程（每次都要照做）
1. **動手前先 `git pull`**，確保拿到另一台電腦改過的最新版本。
2. 修改後先在本機用 http 伺服器測試（`index.html` 用 ES module 動態載入 Firebase，用 `file://` 直接開會不正常）。
3. 把改了什麼、怎麼驗證的告訴使用者，**取得同意後**才 `git commit` + `git push origin main`。
4. 推上去後 GitHub Pages 約 1～2 分鐘更新，可用 curl 確認網站已是新版。

只改公告／相簿／文字／圖片／電話地址時，使用者在後台改就好，**不需要動檔案**。

## 檔案
| 檔案 | 用途 |
| --- | --- |
| `index.html` | 整個網站：官網首頁、登入頁、後台，全部在這一個檔案 |
| `login.html` | 舊網址相容，轉址到 `index.html#login` |
| `firebase-config.js` | Firebase 設定 + `ADMIN_EMAILS`（公開是正常的，安全靠規則） |
| `firestore.rules` | Firestore 安全規則的備份；**不會自動部署**，修改後要請使用者貼到 Firebase 主控台 → Firestore → 規則 → 發布 |
| `README.md` | 給人看的 Firebase / GitHub Pages 設定步驟 |

## index.html 架構
- Tailwind CSS（CDN）+ Phosphor Icons + Google Fonts；品牌色定義在 `tailwind.config`（`brand.red` 等）。
- 三個畫面用 hash 切換：`#view-home`（官網）、`#view-login`（`#login`）、`#view-admin`（`#admin`）；其他 hash（`#hero`、`#moments`…）都是官網錨點。邏輯在 `route()`。
- 主程式是頁尾的 `<script type="module">`，從 `https://www.gstatic.com/firebasejs/10.12.2/` 動態 import Firebase（Auth + Firestore）。
- 動態效果：`<style>` 裡的 `.reveal`（捲動浮現，IntersectionObserver）、`.lift`（hover 浮起）、`.floaty`、`.critter`（主視覺漂浮 emoji）、`.text-shine`、`.wiggle-i`、`.pulse-ring`；HUD 數字 count-up、溫濕度 `[data-live]` 每 2.2 秒模擬跳動。已處理 `prefers-reduced-motion`。
- 後台分頁：總覽、公告管理、相簿管理、前台內容編輯、網站設定。

## ⚠️ 前台即時編輯的編號機制（改版面前必讀）
- `scan()` 依「首頁原始 HTML 的元素順序」自動編號：文字 `t0, t1, …`、圖片 `i0, i1, …`、`[data-bind]` 欄位用 `b-欄位名`。
- 使用者改過的內容存在 Firestore `site/content` 的 `texts.{編號}`、`images.{編號}`。
- **在首頁現有元素「之前」新增或刪除可編輯文字／圖片，後面所有編號都會位移，使用者改過的文字會套到錯的位置。**
  - 安全做法：新區塊加 `data-noedit`（不可前台編輯），或放在頁面最後面；或寫遷移把舊編號對應到新編號。
  - 大改首頁結構前，先提醒使用者並查 Firestore 有哪些 `texts`/`images` 會受影響。
- `#ann-list`、`#gallery-list`、`[data-live]`、`[data-noedit]` 內的元素不參與編號。

## Firestore 資料結構
| 路徑 | 內容 | 權限 |
| --- | --- | --- |
| `site/content` | `bar, phone, hours, address, lineUrl, fbUrl, announcements[], texts{}, images{}, updatedAt` | 所有人可讀，管理員可寫 |
| `gallery/{id}` | `order, color, tag, title, desc, img` | 所有人可讀，管理員可寫 |
| `uploads/{id}` | `data`（前台編輯上傳的圖片），`images.{編號}` 存成 `upload:{id}` | 所有人可讀，管理員可寫 |
| `logins/{id}` | `email, at` | 只有管理員可讀、可新增 |

- 沒用 Firebase Storage（新專案需 Blaze 付費方案）：照片在瀏覽器壓縮成 JPEG data URL 直接存 Firestore（單筆上限 1MB，程式壓到約 600KB 內）。免費方案下載流量有限，照片多時建議改貼圖片網址。
- 第一次有管理員登入時，`ensureSeed()` 把 `DEFAULT_CONTENT`、`DEFAULT_GALLERY` 寫進資料庫；資料庫沒資料時前台顯示這些預設值。
- 即時同步用 `onSnapshot`，訪客開著網頁也會自動更新。
- 新增管理員：Firebase Authentication 新增使用者 → Email 同時加到 `firebase-config.js` 的 `ADMIN_EMAILS` 和 `firestore.rules`（請使用者重新發布規則）。

## 檢查線上狀態的方法（不需登入）
- 讀內容：`curl "https://firestore.googleapis.com/v1/projects/mskao-5359b/databases/(default)/documents/site/content?key=<firebase-config.js 的 apiKey>"`
- 未登入寫入應回 `PERMISSION_DENIED`；`logins` 未登入讀取也應被拒。

## 測試注意
- 這台電腦沒有 Java，無法跑 Firebase Emulator。之前是用自製的假 Firebase 模組（localStorage 版）測試邏輯；要在真站測寫入只能請使用者自己登入操作（不可代為輸入密碼）。

## 待辦／已知事項
- 相簿預設照片、首頁 logo 與特展圖片是 Unsplash 佔位圖（不是爬蟲），請使用者在後台換成館內照片。
- LINE 連結、Facebook、電話、地址仍是範例資料，使用者會在後台「網站設定」修改。
- 首頁有一則使用者建立的「測試」公告，可提醒刪除。
