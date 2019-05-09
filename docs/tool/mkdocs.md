# mkdocs简单使用

[官网](http://www.mkdocs.org/)

## 一、安装

``` python
# 查看 python 版本
python --version
# Python 2.7.2

# 查看 pip 版本
pip --version
# pip 1.5.2

# 更新 pip
pip install --upgrade pip

# 安装 mkdocs
pip install mkdocs
pip install --upgrade mkdocs

# 查看 mkdocs 版本
mkdocs --version
# mkdocs, version 0.17.3

# 查看帮助
mkdocs --help
# 查看具体命令的帮助
mkdocs build --help

# get started
mkdocs new my-project
cd my-project

# 实时测试
mkdocs serve -a 0.0.0.0:8000

# 打包成静态文件
mkdocs build --clean
# 打包到特定文件夹
mkdocs build --clean -d ./myFiles
```

## 二、配置文件

默认使用的配置文件是 ./mkdocs.yml
使用的目录是 ./docs/
./mkdocs.yml 配置文件的一般内容是:

``` yml
site_name: webSite_Title
pages:
- index.md
- about.md

theme: readthedocs
```

如果不配置 pages , 那么 mkdocs 会自动遍历检索 ./docs 目录中的所有 md 文档，并生成 pages 内容,但是是按照字母顺序排序的，如果需要，还是手动设置 pages 内容
pages 使用 HOME 作为 index.md 的标题 , About 作为 about.md 的标题
并且使用 index.md 作为显示首页, pages 中没有配置 index.md 首页会无法显示
所以一般的配置都是

``` yml
pages:
- Home: index.md
- User Guide:
    - 'Writing your docs': 'user-guide/writing-your-docs.md'
    - 'Styling your docs': 'user-guide/styling-your-docs.md'
- About:
    - 'License': 'about/license.md'
    - 'Release Notes': 'about/release-notes.md'
```

mkdocs 包含了两个内置的 theme: mkdocs 和 readthedocs
mkdocs 是默认的theme
当然你也可以创建自己的theme,或使用第三方theme，例如

``` python
pip install windmill
pip install --upgrade windmill

# 然后指定 theme: windmill
```

docs_dir 可以让你指定 docs/ 目录的位置
site_dir 可以让你指定 build后的输出目录位置
dev_addr 可以让你指定 serve 时监听的 IP:port

还有 plugins

## 三、简单配置

``` python
#!/bin/bash

# ================ 基础功能区 ================ 
scriptDir=$(dirname $(readlink -f $0))  
scriptName=$(basename $0)


# ================ 函数定义区 ================
# 获取git项目名称映射的中文名称,retCode=155表示映射到了
function getMapNameForGitProjectName {

  # 第一个参数是 git项目名称
  local gitProjectName="$1"
  # 获取git项目名称为 xxx.git 
  local tmpBaseName=$(basename ${gitProjectName})
  # 去掉 .git
  local tmpOriProjName=${tmpBaseName%.*}
  
  # 声明使用的映射文件
  local tmpMappingFile="${scriptDir}/mapForProject.txt"
  if (! [ -e ${tmpMappingFile} ]);then
    echo ${tmpOriProjName}
    return 0
  fi
  
  # 查找 git项目名称:yyy 中冒号后面的部分
  local tmpMappedName=$(grep -oP "(?<=${tmpOriProjName}:).*$" ${tmpMappingFile})
  if ([ -n "${tmpMappedName}" ]);then
    echo ${tmpMappedName}
    return 155
  else
    echo ${tmpOriProjName} 
  fi

}

# 遍历 映射文件, 匹配nginx根目录中的文件夹,生成连接
function doAddLinkForProjectInMap {
  # 第一个参数是 nginx根目录
  local nginxRootDir="$1"

  # 第二个参数是 index.html ，表示要追加内容的文件
  local indexFile="$2"

  if ([ -z "${nginxRootDir}" ]);then
    echo "为doAddLinkForProjectInMap函数提供的参数错误"
    return 1
  fi 

  if ([ -z "${indexFile}" ]);then
    echo "为doAddLinkForProjectInMap函数提供的参数错误"
    return 1
  fi 

  # 声明使用的映射文件
  local tmpMappingFile="${scriptDir}/mapForProject.txt"
  if (! [ -e ${tmpMappingFile} ]);then
    echo "映射文件不存在"
    return 1
  fi

  # 追加 ul 到 indexFile
  cat >> ${indexFile} <<EOF
<ul>
EOF

  for line in `cat ${tmpMappingFile}`;do 
    # 获取每一行冒号前面的部分
    tmpDirName=${line%%:*} # 匹配 $string的后缀 的最长匹配,然后删除,支持正则表达式
    tmpMapName=${line#*:} # 匹配 $string的前缀 的最短匹配,然后删除,支持正则表达式
    
    if ([ -z "${tmpDirName}" ]);then
      continue
    fi

    if ([ -e "${nginxRootDir}/${tmpDirName}" ]);then
      # 如果存在该文件夹
      echo "<li><a href=\"./${tmpDirName}\" target=\"_self\">${tmpMapName}</a></li>" >> ${indexFile}
    fi
  done

  # 追加 /ul
  cat >> ${nginxDir}/index.html <<EOF
</ul>
EOF
 
  echo "按顺序追加映射文件内的文件夹完成"
  return 0

}


# 追加文件夹内容到 mkdocs.yml
function appendPagesContent {
  local dstDir=$1;
  local tmpDir=$2;
  local indent="$3";
  
  local tmpFile;
  local tmpRelativeFilePath;
  local tmpBaseName;
  local tmpBaseNameWithoutExtension;

  local exitCode=0; # 返回 155 表示成功执行,且插入了内容,返回0表示成功执行
  
  # 先增加 index 
  tmpFile="${tmpDir}/index.md"
  if ([ -f ${tmpFile} ]);then
    tmpRelativeFilePath=${tmpFile#${dstDir}/docs/}
    tmpBaseName=$(basename ${tmpFile})
    echo "${indent}- Home: ${tmpRelativeFilePath}" >> ${dstDir}/mkdocs.yml
    # 成功插入了内容,设置exitCode
    exitCode=155;
  fi
  
  # 将文件夹下面的md文档和文件夹加入到 mkdocs.yml
  for tmpFile in ${tmpDir}/*;do
    tmpRelativeFilePath=${tmpFile#${dstDir}/docs/}
    tmpBaseName=$(basename ${tmpFile})
    tmpBaseNameWithoutExtension=${tmpBaseName%.*}
    if ([ -f "${tmpFile}" ] && [[ $(echo ${tmpFile} | tr 'A-Z' 'a-z') == *.md ]]);then
        if ([ ${tmpBaseNameWithoutExtension} = index ]);then
          continue;
        else 
          echo "${indent}- ${tmpBaseNameWithoutExtension}: ${tmpRelativeFilePath}" >> ${dstDir}/mkdocs.yml
      # 成功插入了内容,设置exitCode
          exitCode=155;
        fi
    fi
  
    if ([ -d "${tmpFile}" ]);then
      echo "${indent}- ${tmpBaseNameWithoutExtension}:" >> ${dstDir}/mkdocs.yml
      appendPagesContent ${dstDir} ${tmpFile} "${indent}  "
      local tmpReturnCode=$?
      if ([ ${tmpReturnCode} -ne 155 ]);then
    # 没有追加任何内容
    # 删除已追加的最后一行
    sed -i '$d' ${dstDir}/mkdocs.yml
      else
        # 成功插入了内容,设置exitCode
    exitCode=155;
      fi

    fi
  done
  
  # 将文件夹下面的非md文档放到一个html文件中展示
  # 生成一个临时文件
  tmpOtherFileMd=`mktemp`
  
  for tmpFile in ${tmpDir}/*;do
    tmpRelativeFilePath=${tmpFile#${dstDir}/docs/}
    tmpBaseName=$(basename ${tmpFile})
    if ([ -f "${tmpFile}" ] \
       && ! [[ $(echo ${tmpFile} | tr 'A-Z' 'a-z') == *.md ]] \
       && ! [[ $(echo ${tmpFile} | tr 'A-Z' 'a-z') == *.png ]] \
       && ! [[ $(echo ${tmpFile} | tr 'A-Z' 'a-z') == *.jpg ]] \
      );then
      echo "###### [${tmpBaseName}](./${tmpBaseName})" >> ${tmpOtherFileMd}
    fi
  done
  
  if ([ -n "$(cat ${tmpOtherFileMd})" ]);then
    # 将临时生成的md文件拷贝到目标文件夹
    tmpFile="${tmpDir}/其他文档(自动生成).md"
    tmpRelativeFilePath=${tmpFile#${dstDir}/docs/}
    tmpBaseName=$(basename ${tmpFile})
    tmpBaseNameWithoutExtension=${tmpBaseName%.*}
    
    mv ${tmpOtherFileMd} "${tmpFile}"
    # 将md文件添加到mkdocs
    echo "${indent}- ${tmpBaseNameWithoutExtension}: ${tmpRelativeFilePath}" >> ${dstDir}/mkdocs.yml
    # 成功插入了内容,设置exitCode
    exitCode=155;
  fi 
  
  # 返回指定状态码
  return ${exitCode};
}

# ================ 默认参数定义区 ================
gitusername='globalreader'
gitpasswd='12345qwert'
branch='master'

# 定义使用帮助说明
helpMsg="
所有参数不区分大小写
--gituri docs项目git地址
"

# ================ 处理选项 ================
while [ -n "$1" ];do
    tmpOpt=$(echo "$1"|tr A-Z a-z)
    # 判断参数是否是 --help , 是则显示帮助并退出
    if ([ $tmpOpt = "--help" ]);then
        echo "${helpMsg}"
        exit 0
    fi
 
    # 判断参数是否是 --bool开头,如果是则将变量置为1 并 shift 1
    if ([[ $tmpOpt = --bool* ]]);then
        tmpOpt=${tmpOpt#--}
        echo "检测到参数 ${tmpOpt}"
        export "${tmpOpt}"="1"
        shift 1
        continue
    fi
 
    # 判断参数是否是 --开头,如果是则将变量置为下一个参数 并 shift 2
    if ([[ $tmpOpt = --* ]]);then
        tmpOpt=${tmpOpt#--}
        echo "检测到参数 ${tmpOpt} = $2"
        export "${tmpOpt}"="$2"
        shift 2
        if ([ $? -ne 0 ]);then
          shift 1
        fi
        continue
    fi
 
    shift 1
done

# ================ 检查参数 ================
echo "检查参数"

echo "检查gituri"
if ([ -z "${gituri}" ]);then
   echo
   echo "请指定 gituri"
   echo "具体帮助如下:"
   echo "${helpMsg}"
   echo
   exit 1
fi

# ================ 开始执行 ================

# ================ git 检出代码 ================
echo "使用git检出代码"

# 生成一个临时文件夹 用于存放 检出的代码
tmpMkdocsDir=`mktemp -d`
tmpGitDir="${tmpMkdocsDir}/docs"

# 检出代码
echo "git clone --branch ${branch} --single-branch ${gituri} ${tmpGitDir} 1>/dev/null"
# 把gituri加上用户名和密码
tmpHostAndPort=$(echo "${gituri}" | grep -oP '(?<=://)[^/]+?\.[^/]+(?=/?)|^[^/]+?\.[^/]+(?=/?)')
gitrealuri=${gituri/${tmpHostAndPort}/${gitusername}:${gitpasswd}@${tmpHostAndPort}}

git clone --branch ${branch} --single-branch ${gitrealuri} ${tmpGitDir} 1>/dev/null
if ([ $? -ne 0 ]);then
  echo
  echo "git clone failed!"
  rm -rf ${tmpMkdocsDir}
  echo
  exit 1
fi

# 加入 site_name 到 mkdocs.yml
tmpBaseName=$(basename ${gituri})
mySiteName=${tmpBaseName%.*}

cat > ${tmpMkdocsDir}/mkdocs.yml << EOF
site_name: $(getMapNameForGitProjectName ${mySiteName})  
pages:
EOF

# 使用README作为index.md 
if (! [ -f ${tmpGitDir}/README.md ]);then
  echo "<a href=\"../\">Back</a><br />" > ${tmpGitDir}/index.md
else
  sed -i '1i\ <a href=\"../\">Back</a><br />' ${tmpGitDir}/README.md
  mv -f ${tmpGitDir}/README.md ${tmpGitDir}/index.md
fi
# 生成 mkdocs.yml
appendPagesContent ${tmpMkdocsDir} ${tmpGitDir} ""

# 加入 theme 到 mkdocs.yml
cat >> ${tmpMkdocsDir}/mkdocs.yml << EOF
theme: windmill
EOF

# 运行 mkdocs build, 该命令会生成一个 mySiteName 目录
cd ${tmpMkdocsDir}
echo 
echo "cat ${tmpMkdocsDir}/mkdocs.yml"
cat ${tmpMkdocsDir}/mkdocs.yml
echo
echo
mkdocs build  -d ${tmpMkdocsDir}/${mySiteName}
if ([ $? -ne 0 ]);then
  echo
  echo "mkdocs build failed!"
  rm -rf ${tmpMkdocsDir}
  echo
  exit 1
fi

# 将 build 后的文件拷贝到指定位置
nginxDir=/usr/share/nginx/html/docs

rm -rf ${nginxDir}/${mySiteName}
cp -r ${tmpMkdocsDir}/${mySiteName} ${nginxDir}/${mySiteName}
# 生成 index.html
cat > ${nginxDir}/index.html <<EOF
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>MyDocs</title>
  <style type="text/css">
    ul,li{ padding:10;margin:10;}
  </style>
</head>
<body>
<ul>
EOF

# 遍历nginx根目录下的文件夹，获取其映射后的名称 加入到index.html中

# 先按顺序加入文档连接
doAddLinkForProjectInMap "${nginxDir}" "${nginxDir}/index.html"

# 继续遍历nginx根目录下加入未映射到的文件夹

# 追加 ul
cat >> ${nginxDir}/index.html <<EOF
<ul>
EOF

for file in ${nginxDir}/*;do
  if ([ $(basename ${file}) != "index.html" ]);then
    tmpMappedName=$(getMapNameForGitProjectName ${file});
    tmpRetCode=$?
    # 存在映射的文档之前已经加过了,所以这时只添加未映射的文档
    # tmpRetCode = 155 表示获取到了映射名称
    if ([ ${tmpRetCode} -ne 155 ]);then
      echo "<li><a href=\"./${file#${nginxDir}/}\" target=\"_blank\">${tmpMappedName}</a></li>" >> ${nginxDir}/index.html
    fi
  fi
done

# 追加 /ul
cat >> ${nginxDir}/index.html <<EOF
</ul>
EOF

# 追加 /body
cat >> ${nginxDir}/index.html <<EOF
</body>
EOF

# 结束后删除文件
rm -rf ${tmpMkdocsDir}

echo "成功使用mkdocs部署文档项目${gituri}"
echo
```

## 中文搜索问题

``` python
# 安装分词工具
pip install jieba

# 修改 /usr/lib/python2.7/site-packages/mkdocs/contrib/legacy_search/search_index.py
    def generate_search_index(self):
        """python to json conversion"""
        page_dicts = {
            'docs': self._entries,
        }
        # 以下为新增部分
        for doc in page_dicts['docs']:
        # 调用jieba的cut接口生成分词库，过滤重复词，过滤空格
            tokens = list(set([token.lower() for token in jieba.cut_for_search(doc['title'].replace('\n', ''), True)]))
            if '' in tokens:
                tokens.remove('')
            doc['title_tokens'] = tokens

            tokens = list(set([token.lower() for token in jieba.cut_for_search(doc['text'].replace('\n', ''), True)]))
            if '' in tokens:
                tokens.remove('')
            doc['text_tokens'] = tokens

        # 新增部分结束
        return json.dumps(page_dicts, sort_keys=True, indent=4)

# 修改 /usr/lib/python2.7/site-packages/mkdocs/contrib/legacy_search/templates/search/lunr.min.js
# 这个是压缩过的, 是不是可以下载一个未压缩版的, 应该更好修改
# 有两个地方要修改：
# lunr.Index.prototype.add: 获取分词数据的方式，不在从内部的分词接口计算分词，直接从文档的词库加载
# lunr.trimmer: 过滤空白字符的接口，修改匹配方式，把原来只匹配字母、数字改成匹配所有非空字符

lunr.Index.prototype.add = function (doc, emitEvent) {
  var docTokens = {},
      allDocumentTokens = new lunr.SortedSet,
      docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  this._fields.forEach(function (field) {
    // 删掉内部接口计算分词
    // var fieldTokens = this.pipeline.run(this.tokenizerFn(doc[field.name]))
    // 直接从文档词库加载
    var fieldTokens = doc[field.name + '_tokens']

    docTokens[field.name] = fieldTokens

    for (var i = 0; i < fieldTokens.length; i++) {
      var token = fieldTokens[i]
      allDocumentTokens.add(token)
      this.corpusTokens.add(token)
    }
  }, this)


lunr.trimmer = function (token) {
  var result = token.replace(/^\s+/, '').replace(/\s+$/, '')  //  \W -> \s
  return result === '' ? undefined : result
}

```

参考 基于mkdocs-material搭建个人静态博客(含支持的markdown语法)

[点击阅读][md]

[md]: https://cyent.github.io/markdown-with-mkdocs-material/