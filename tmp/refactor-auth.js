const fs = require('fs');
const path = require('path');

const files = [
  'src/features/auth/actions.ts',
  'src/app/leaderboard/page.tsx',
  'src/app/play/layout.tsx',
  'src/app/api/scores/route.ts',
  'src/app/(auth)/layout.tsx',
  'src/app/(root)/layout.tsx',
  'src/app/(root)/profile/page.tsx',
  'src/app/memory-game/layout.tsx'
];

const basePath = 'c:\\Users\\tamil\\Downloads\\Aptiplay\\BlyncWeb-main';

files.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${file} - not found`);
      return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace auth.api.getSession(...) with auth()
  // Handles multi-line with any whitespace
  content = content.replace(/auth\.api\.getSession\s*\(\s*\{\s*headers:\s*await\s*headers\(\)\s*\}\s*\)/g, 'auth()');
  
  // FixsignOut in features/auth/actions.ts
  if (file === 'src/features/auth/actions.ts') {
      content = content.replace(/const res = await auth\.api\.signOut\(\{[\s\S]*?\}\);/g, 'await authSignOut();');
      content = content.replace(/import \{ auth \} from "@\/lib\/auth";/g, 'import { auth, signOut as authSignOut } from "@/lib/auth";');
      content = content.replace(/data: res,/g, '');
  }

  // Final check for auth.api.getSession with just headers
  content = content.replace(/await auth\.api\.getSession\(\{[\s\S]*?headers: await headers\(\),?[\s\S]*?\}\)/g, 'await auth()');

  // Fix Profile page null check
  if (file === 'src/app/(root)/profile/page.tsx') {
      content = content.replace(/if \(!session\) redirect\("\/register"\);/g, 'if (!session?.user) redirect("/register");');
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${file}`);
});
