# Git 使用过程中遇到的问题以及解决办法
git 是项目当中最常用的代码管理库，熟练的使用git不是万能的，但不能熟练的使用git是万万不能的，归纳了一下真正开始在多人协作的代码库中提交自己的代码时遇到的问题。
## git fetch 失效的问题
在项目工程中，主要使用的是两个分支，一个是主分支master，一个是开发分支develop，我们一般在develop中进行开发，master分支中用来存重大版本的代码。当需要获取最新的代码时，使用git fetch 或者 $ git fetch origin develop:develop 命令从远程develop分支上拉取最新的代码。

但有时候这个命令会失效，拉取不到最新的代码，出现这样的错误提示
```git
fatal: Refusing to fetch into current branch refs/heads/develop of non-bare repository
fatal: The remote end hung up unexpectedly
```
这种时候，先切换到master分支，然后再从master分支fetch分支develop上的代码，就能够成功了。

```git
$ git fetch origin develop:develop
fatal: Refusing to fetch into current branch refs/heads/develop of non-bare repository
fatal: The remote end hung up unexpectedly
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
$ git fetch origin develop:develop
From 172.20.10.91:developers/android_do_as
   5ee9941..ff421cf  develop    -> develop
```
究其原因，就和fatal的提示一样，在非bare的git仓库中，如果你要同步的本地跟踪分支是当前分支，就会出现拒绝fetch的情况。也就是说不可以在非bare的git仓库中通过fetch快进你的当前分支与远程同步。

## git 错误提交或者错误的合并了解决方案

第一次在代码库中提交代码，心情比较激动，直接本地多次提交之后，就和远程分支给merge了。命令看起来是这么用的，但这样就会在代码线上弄出一条新线，而不是一条线，多么丑啊。还好没有push到远程去，所以就要看看如何解决，把它弄成一条线了。

当已经错误的提交，或者是错误的合并已经产生了，首先，要想办法回到过去，我多想回到过去，再回到你的身边。


```git
$ git reflog
ff421cf HEAD@{0}: checkout: moving from master to develop
efaaa61 HEAD@{1}: checkout: moving from develop to master
```
首先用git reflog 命令，看看最近自己做过什么，哪里是自己想回去的地方。
```git
$ git reset --hard 72b075e
$ git clean --f
```
然后再使用 reset命令，复制自己想要去的地方的哈希码，穿越时光回到过去。顺便 clean 一下，保持清洁。

这样你就能去到任何你想去的地方，so happy。

但如何把多个提交合并成一个提交呢？为了保持代码树的干净漂亮，在本地的多次提交保存，弄成一次提交再推到远程去可能会更加好一点，所以可以是用 rebase 命令进行衍合。

在自己多次提交的本地分支上进行衍合一般不会出现冲突，找准本地分支的第一次提交的哈希码值，或者数清楚自己提交了几次用rebase命令就可以将多次提交合并成一次提交
```git
$ git rebase -i head~11
```
使用这个命令之后，会进入到vim模式，将自己需要的提交信息设置为p，其他的设置为s，最后使用：wq退出保存即可。
```git
# Rebase 6a2eb6d..f7d0bd7 onto 6a2eb6d
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```
这是对命令的提示。

但最好还是不要面对需要这样使用rebase的情景，应该好好使用commit 命令的参数。比如：
```git
git commit --amend
```
使用这个命令，会将本次提交写到上次的提交中去，就不会产生多条的提交信息。
## git rebase 中的冲突处理
在合并代码的过程中，可以使用merge，也可以使用rebase，如果使用merge，合并之后推上远程就会有两条线，但使用rebase就只会产生一条线，变得简洁而优雅，所以在合并代码的过程中建议尽量使用rebase命令。

在合并代码中可能会遇到冲突，当提示有冲突时，我们可以使用外部的图形化冲突处理工具来处理冲突。这里使用的是KDiff3来处理冲突。

1. 安装Kdiff3 软件。（最好使用默认路径）
2. 添加kdiff3到git mergetool里。 git config --global merge.tool kdiff3
3. 添加kdiff3路径到 git global config里。git config --global mergetool.kdiff3.path "C:\Program Files\KDiff3\kdiff3.exe"
4. 以后merge发生冲突时：git mergetool 来做图形化merge。进入编辑冲突。

带问号的才是冲突。当两者都需要保存时，右击标记处，选完B后，再次右击，选择C。A是最原始的代码，B是自己的，C是别人的。

在这里需要注意的是，首先要设置好kDiff3的默认编码，和自己的工程编码一样，要不解决完冲突之后还要解决乱码问题。。。。