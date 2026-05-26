#!/usr/bin/env bash
# migrate-to-firebase.sh
# Migrates a Vite/React app from Supabase to Firebase (infrastructure only).
# Run from your project root: bash scripts/migrate-to-firebase.sh
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
step() { echo -e "\n${YELLOW}[$1/5] $2${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
info() { echo -e "  $1"; }

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Supabase → Firebase  |  Infrastructure Only  ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

[ ! -f "package.json" ] && echo -e "${RED}Error: run from project root (no package.json found)${NC}" && exit 1

# ─── 1. Swap packages ────────────────────────────────────────────────────────
step 1 "Swapping packages"
npm uninstall @supabase/supabase-js --save 2>/dev/null || true
npm install firebase
ok "firebase installed, @supabase/supabase-js removed"

# ─── 2. Create src/lib/firebase.ts ───────────────────────────────────────────
step 2 "Creating src/lib/firebase.ts"
mkdir -p src/lib
cat > src/lib/firebase.ts << 'TSEOF'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth = isFirebaseConfigured ? getAuth(app!) : null
export const db = isFirebaseConfigured ? getFirestore(app!) : null
TSEOF
ok "src/lib/firebase.ts created"

# ─── 3. Firebase config → .env ───────────────────────────────────────────────
step 3 "Firebase configuration"
echo "  Paste values from: Firebase Console → Project Settings → Your apps → </>"
echo ""
read -rp "  apiKey:              " FIREBASE_API_KEY
read -rp "  authDomain:          " FIREBASE_AUTH_DOMAIN
read -rp "  projectId:           " FIREBASE_PROJECT_ID
read -rp "  storageBucket:       " FIREBASE_STORAGE_BUCKET
read -rp "  messagingSenderId:   " FIREBASE_MESSAGING_SENDER_ID
read -rp "  appId:               " FIREBASE_APP_ID

cat > .env << ENV
VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID
ENV

cat > .env.example << 'ENVEX'
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
ENVEX
ok ".env and .env.example created"

# ─── 4. Update deploy.yml ────────────────────────────────────────────────────
step 4 "Updating CI/CD (deploy.yml)"
DEPLOY_YML=".github/workflows/deploy.yml"
FIREBASE_SECRETS="          VITE_FIREBASE_API_KEY: \${{ secrets.VITE_FIREBASE_API_KEY }}\n          VITE_FIREBASE_AUTH_DOMAIN: \${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}\n          VITE_FIREBASE_PROJECT_ID: \${{ secrets.VITE_FIREBASE_PROJECT_ID }}\n          VITE_FIREBASE_STORAGE_BUCKET: \${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}\n          VITE_FIREBASE_MESSAGING_SENDER_ID: \${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}\n          VITE_FIREBASE_APP_ID: \${{ secrets.VITE_FIREBASE_APP_ID }}"

if [ -f "$DEPLOY_YML" ]; then
  # Remove Supabase env lines, replace with Firebase block
  perl -i -0pe "s|(\s+VITE_SUPABASE_URL:[^\n]*\n\s+VITE_SUPABASE_ANON_KEY:[^\n]*)|$FIREBASE_SECRETS|g" "$DEPLOY_YML" 2>/dev/null \
    || sed -i "s/VITE_SUPABASE_URL:.*$/VITE_FIREBASE_API_KEY: \${{ secrets.VITE_FIREBASE_API_KEY }}/" "$DEPLOY_YML"
  ok "deploy.yml updated"
else
  info "No deploy.yml found — skipping"
fi

# ─── 5. GitHub Secrets ───────────────────────────────────────────────────────
step 5 "GitHub Secrets"
if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
  read -rp "  Set GitHub Actions secrets now? (y/n): " SET_SECRETS
  if [[ "$SET_SECRETS" == "y" ]]; then
    gh secret set VITE_FIREBASE_API_KEY          --body "$FIREBASE_API_KEY"
    gh secret set VITE_FIREBASE_AUTH_DOMAIN      --body "$FIREBASE_AUTH_DOMAIN"
    gh secret set VITE_FIREBASE_PROJECT_ID       --body "$FIREBASE_PROJECT_ID"
    gh secret set VITE_FIREBASE_STORAGE_BUCKET   --body "$FIREBASE_STORAGE_BUCKET"
    gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "$FIREBASE_MESSAGING_SENDER_ID"
    gh secret set VITE_FIREBASE_APP_ID           --body "$FIREBASE_APP_ID"
    gh secret delete VITE_SUPABASE_URL      2>/dev/null || true
    gh secret delete VITE_SUPABASE_ANON_KEY 2>/dev/null || true
    ok "GitHub secrets updated (Supabase secrets removed)"
  fi
else
  info "gh CLI not available — set secrets manually in GitHub → Settings → Secrets → Actions"
fi

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Infrastructure migration done!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Now ask Claude to migrate the code:${NC}"
echo ""
echo "  1. Delete src/lib/supabase.ts"
echo "  2. Rewrite AuthContext.tsx:"
echo "     - onAuthStateChanged instead of getSession() (no more blocking)"
echo "     - createUserWithEmailAndPassword + setDoc for sign up"
echo "     - signInWithEmailAndPassword for sign in"
echo "     - Profile stored as Firestore doc: users/{uid}"
echo ""
echo "  3. Replace Supabase queries with Firestore equivalents:"
echo "     - supabase.from('x').select()     → getDocs(query(collection(db,'x'),where(...)))"
echo "     - supabase.from('x').insert(data) → setDoc(doc(db,'x',id), data)"
echo "     - supabase.from('x').delete()     → deleteDoc(doc(db,'x',id))"
echo "     - supabase.channel().subscribe()  → onSnapshot(query(...))"
echo ""
echo "  4. Use deterministic document IDs (no auto UUID needed):"
echo "     - timetable entries: \${uid}_\${year}_\${setId}"
echo "     - buddies:           \${uid}_\${friendId}_\${year}"
echo "     - user_editions:     \${uid}_\${year}"
echo "     - friendships:       [uid1,uid2].sort().join('_')"
echo ""
echo "  5. Set Firestore Security Rules in Firebase Console → Firestore → Rules"
echo ""
echo "  6. npm run build — verify compilation"
echo ""
echo -e "${GREEN}Firestore: no SQL migrations needed. Collections auto-create on first write.${NC}"
