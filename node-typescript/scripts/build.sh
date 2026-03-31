set -e
rm -rf dist
npx prisma generate
npx tsc --project tsconfig.prod.json
cp -r prisma dist
cp package.json dist
cp resolve-env.js dist
cp ecosystem.config.cjs dist