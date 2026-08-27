# Firebase Setup — Add & Approve Project References

One-time setup (~15 min). After this, submissions are automatic.

## Step 1 — Create a Firebase project (free)

1. Go to https://console.firebase.google.com
2. Sign in with your Google account (any Gmail works, or your work Google Workspace)
3. Click **Add project**
4. Name it: `tonn-references` → Continue
5. Skip Google Analytics (toggle off) → Create project
6. Wait ~30 seconds → **Continue**

## Step 2 — Add a Web app

1. On the project home, click the **`</>`** (Web) icon under "Get started by adding your first app"
2. Nickname: `Tonn Projects Site` → **Register app** (do NOT check "Firebase Hosting")
3. A code block appears with `firebaseConfig = { ... }` — **copy the 6 values** shown
4. **Continue to console**

## Step 3 — Paste the config into the site

Open `projects/firebase-config.js` and replace the placeholder values with the ones you just copied:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "tonn-references.firebaseapp.com",
  projectId: "tonn-references",
  storageBucket: "tonn-references.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
window.ADMIN_EMAILS = ["syazwalina@tonncable.com"];  // add more if needed
```

Commit and push. (The API key is safe to have in the browser — Firestore rules protect the data, not the key.)

## Step 4 — Enable Firestore Database

1. In the Firebase console → left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Location: `asia-southeast1` (Singapore, closest to Malaysia) → **Next**
4. Start in **production mode** → **Create**
5. Wait ~1 min for the database to be ready

## Step 5 — Set security rules

1. Still in Firestore → click the **Rules** tab at the top
2. Replace the whole rules block with this and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read projects (public site displays them)
    // Anyone can add a new project (password-gated in the app)
    // Only admin can edit/delete existing entries
    match /live_projects/{id} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.location is string
                    && request.resource.data.details is string;
      allow update, delete: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email in ["syazwalina@tonncable.com"];
    }
  }
}
```

**Note:** direct-publish mode. Submissions go live instantly. The admin page is still available at `admin.html` (for signing in later to delete any bad or wrong entries).

(If you add more admins in `firebase-config.js`, also add them to the `isAdmin()` list here.)

## Step 6 — Enable Email/Password sign-in

1. Left sidebar → **Build → Authentication**
2. Click **Get started**
3. In the **Sign-in method** tab → click **Email/Password** → Enable the first toggle → **Save**

## Step 7 — Create the admin user

1. Still in Authentication → **Users** tab
2. Click **Add user**
3. Email: `syazwalina@tonncable.com`
4. Password: pick a strong password (write it down!)
5. **Add user**

## Step 8 — Test it end-to-end

1. Wait ~1 min for GitHub Pages to redeploy after your commit.
2. Open the site → click **+ Add** → password `tonn2025` → fill a test project → Submit.
3. You should see the green **"Sent for approval"** confirmation.
4. Open `.../projects/admin.html` → log in with the admin email + password.
5. You should see the pending test submission → click **✓ Approve & publish**.
6. Go back to `.../projects/index.html` → the test project should now be in the sector list.
7. If it works, delete the test entry: the admin page's decline button doesn't remove already-approved entries, so to remove a live one you'd delete the doc from Firestore directly (Console → Firestore → live_projects → delete).

## Adding another admin later

1. Add their email to `window.ADMIN_EMAILS` in `firebase-config.js`.
2. Add the same email to the `isAdmin()` rule list in Step 5 → Publish.
3. Create a user for them in Authentication → Users → Add user.

## Cost

Firebase free tier = 50,000 reads/day, 20,000 writes/day. This project will never come close. Cost stays $0 forever unless you cross into enterprise-scale traffic.

## The admin page URL

`https://tonncable.github.io/tonn-presentation/projects/admin.html`

Bookmark it. It's not linked from anywhere public. Even if someone finds it, they need admin login.
