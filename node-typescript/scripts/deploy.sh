set -e

source ../.env.deploy.sh

bash build.sh

version=v-$(date +%Y%m%d%H%M%S)

archive_name=$version.tar.gz

tar -C dist -czvf $archive_name .

scp -P $PORT -i $KEY $archive_name $USER@$HOST:$TARGET_DIR

# todo: add ssh command to deploy
