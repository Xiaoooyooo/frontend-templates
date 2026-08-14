set -e
rm -rf dist
npx prisma generate
npx tsc --project tsconfig.app.json
cp -r prisma dist
cp package.json dist
cp ecosystem.config.cjs dist
cp prisma.config.ts dist