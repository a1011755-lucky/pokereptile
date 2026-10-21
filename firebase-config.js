// =====================================================================
//  爬可夢官網 ‧ Firebase 設定檔（設定步驟請看 README.md）
// =====================================================================

// ① 把 Firebase 主控台「專案設定 → 你的應用程式 → SDK 設定」裡的
//    firebaseConfig 內容貼在這裡（這些值會公開在網頁上是正常的，
//    真正保護資料的是 Firestore 安全規則）
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAIsW5AR7yfUwLoF1UHx5bRBa3JLq4AjeY",
  authDomain: "mskao-5359b.firebaseapp.com",
  projectId: "mskao-5359b",
  storageBucket: "mskao-5359b.firebasestorage.app",
  messagingSenderId: "608237135262",
  appId: "1:608237135262:web:1ab60c2b4a03c6eaef628f"
};

// ② 可以登入後台的管理員 Email（可放多個，用逗號分開）
//    必須和 firestore.rules 裡的 Email 一模一樣
window.ADMIN_EMAILS = [
  "a1011755@gmail.com"
];
