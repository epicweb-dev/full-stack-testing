npx npm-check-updates --dep prod,dev --upgrade --workspaces --root --reject eslint,@conform-to/react,@conform-to/zod
cd epicshop && npx npm-check-updates --dep prod,dev --upgrade --root
cd ..
rm -rf node_modules package-lock.json ./epicshop/package-lock.json ./epicshop/node_modules ./exercises/**/node_modules
npm install
npm run setup
npm run typecheck
npm run lint --fix
