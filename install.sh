REMOTE=https://raw.githubusercontent.com/Xiaoooyooo/frontend-templates/refs/heads/master/
CWD=.
APP_NAME="Frontend APP"

file() {
  echo $REMOTE$1
}

read_input() {
  read -p "$1: " result </dev/tty
  echo $result
}

whether() {
  local r=$(read_input $1)
  if [ -z $r ] || [ $r == "y" ] || [ $r == "Y" ]; then
    return 0
  else
    return 1
  fi
}

download() {
  local retries=3
  local fullpath=$(file $1)
  local dir=$(dirname $1)
  if ! [ -d $dir ]; then
    mkdir -p $dir
  fi
  echo fetching $fullpath 
  while [ $retries -gt 0 ]
  do
    curl -# $fullpath > $1
    if [ $? -eq 0 ]; then
      break
    else
      echo download file "$1" failed, retry in 1 second...
      sleep 1
      retries=$(expr $retries - 1)
    fi
  done
}

# 检查是否能下载到目标路径下
# 目标路径不存在 或 目标路径为空文件夹
is_safe_dir() {
  if [ -z "$(ls -A $1 2>/dev/null)" ]; then
    return 0
  else
    return 1
  fi
}

change_working_dir() {
  local working_dir=$(read_input "请输入下载路径（默认当前文件夹）")
  if [ -z $working_dir ]; then
    working_dir=$(pwd)
  fi;
  CWD=$working_dir
  if ! $(is_safe_dir $CWD); then
    if $(whether 目标路径已存在，是否清空该文件夹？); then
      rm -rf $CWD
    else
      exit 1
    fi
  fi
  mkdir -p $CWD
  if [ $? -ne 0 ]; then
    exit 1
  fi
  cd $CWD
  APP_NAME=$(basename $PWD)
}

light_cyan() {
  echo -e "\033[1;36m$1\033[0m"
}

choose_template() {
  echo 可选择模板：
  echo ""
  echo -e "    1. React"
  echo -e "    2. Vue"
  echo -e "    9. 退出脚本"
  echo 
  local select=$(read_input 请输入编号)
  case $select in
    1)
      REMOTE=${REMOTE}react/
    ;;
    2)
      REMOTE=${REMOTE}vue/
    ;;
    9)
      exit 0
    ;;
    *)
      echo 选项无效
      exit 1;
    ;;
  esac
}

main() {
  choose_template
  change_working_dir
  local files=($(curl $(file template) | awk '{sub(/\r$/, ""); print}'))

  if [ $? -ne 0 ]; then
    rm -rf $CWD
    exit 1
  else
    exit 0
  fi

  for file in "${files[@]}"
  do
    download $file
    if [ $? -ne 0 ]; then
      echo download failed, plaease retry later.
      rm -rf $CWD
      exit 1
    fi

    if [[ $file == "package.json" ]]; then
      sed -i "s/project-name-placeholder/${APP_NAME}/" $file
    fi

    if [[ $file == "gitignore" ]]; then
      mv $file .$file
    fi
  done

  echo DONE!
  echo Now you can run the following command to start the project:
  echo -e "\n\t"$(light_cyan "cd $CWD") "&&" $(light_cyan 'npm install') "&&" $(light_cyan 'npm run dev')
  exit 0
}

main
