# Linux 常用命令

## 日常操作命令

### 查看当前所在的工作目录的全路径 pwd
```shell
[root@VM_0_14_centos ~]# pwd
/root
```
### 查看当前系统的时间 date
```shell
[root@VM_0_14_centos ~]# date +%Y-%m-%d
2018-11-10
[root@VM_0_14_centos ~]# date +%Y-%m-%d --date="-1 day" #加减也可以 month | year
2018-11-09
[root@VM_0_14_centos ~]# date -s "2018-10-10 15:38:46" ## 修改时间
Sat Nov 10 15:38:46 CST 2018
```
### 查看有谁在线（哪些人登陆到了服务器）
```shell
[root@VM_0_14_centos ~]# who
root     pts/0        2018-11-10 15:19 (125.84.94.225)
[root@VM_0_14_centos ~]# last
root     pts/0        125.84.94.225    Sat Nov 10 15:19   still logged in   
root     pts/0        125.84.89.248    Mon Nov  5 08:32 - 08:32  (00:00)    
root     pts/0        125.84.92.12     Mon Oct 22 11:47 - 15:18  (03:30)    
root     pts/0        125.84.94.170    Fri Oct 19 15:00 - 21:07  (06:06)    
root     pts/0        125.84.95.234    Mon Oct 15 10:16 - 13:55  (03:39)    
root     pts/0        125.84.95.234    Sat Oct 13 17:11 - 18:32  (01:20)    
root     pts/1        125.84.94.251    Thu Oct 11 12:01 - 17:09  (05:08)    
root     pts/0        125.84.92.121    Thu Oct 11 09:02 - 12:09  (03:07)    
root     pts/0        125.84.94.34     Wed Oct 10 17:35 - 18:14  (00:39) 
```
### 关机/重启
关机（必须用root用户）
```shell
shutdown -h now  ## 立刻关机
shutdown -h +10  ##  10分钟以后关机
shutdown -h 12:00:00  ##12点整的时候关机
halt   #  等于立刻关机
```
重启
```shell
shutdown -r now
reboot   # 等于立刻重启
```
### 清屏
```shell
clear    ## 或者用快捷键  ctrl + l
```
### 退出当前进程
``` shell
ctrl+c   ##有些程序也可以用q键退出
```
### 挂起当前进程
```shell
ctrl+z   ## 进程会挂起到后台
bg jobid  ## 让进程在后台继续执行
fg jobid   ## 让进程回到前台
```

### echo
```shell
[root@VM_0_14_centos ~]# str='hello wrold'
[root@VM_0_14_centos ~]# echo str
str
[root@VM_0_14_centos ~]# echo $str
hello wrold
```
## 目录操作

### 查看目录信息

```shell
ls /   ## 查看根目录下的子节点（文件夹和文件）信息
ls -al ##  -a是显示隐藏文件   -l是以更详细的列表形式显示
ls -l  ##有一个别名： ll    可以直接使用ll  <是两个L>
```
### 切换工作目录

``` shell
cd  /home/hadoop    ## 切换到用户主目录
cd ~     ## 切换到用户主目录
cd -     ## 回退到上次所在的目录
cd       ## 什么路径都不带，则回到用户的主目录
```
### 创建文件夹
``` shell
mkdir aaa     ## 这是相对路径的写法 
mkdir  /data    ## 这是绝对路径的写法 
mkdir -p  aaa/bbb/ccc   ## 级联创建目录
```
### 删除文件夹
```shell
rmdir  aaa   ## 可以删除空目录
rm  -r  aaa   ## 可以把aaa整个文件夹及其中的所有子节点全部删除
rm  -rf  aaa   ## 强制删除aaa
```
### 修改文件夹名称
``` shell
mv  aaa  boy
mv  #本质上是移动
mv  install.log  aaa/  #将当前目录下的install.log 移动到aaa文件夹中去

rename #可以用来批量更改文件名
[root@VM_0_14_centos aaa]# ll
total 0
-rw-r--r--. 1 root root 0 Jul 28 17:33 1.txt
-rw-r--r--. 1 root root 0 Jul 28 17:33 2.txt
-rw-r--r--. 1 root root 0 Jul 28 17:33 3.txt
[root@VM_0_14_centos aaa]# rename .txt .txt.bak *
[root@VM_0_14_centos aaa]# ll
total 0
-rw-r--r--. 1 root root 0 Jul 28 17:33 1.txt.bak
-rw-r--r--. 1 root root 0 Jul 28 17:33 2.txt.bak
-rw-r--r--. 1 root root 0 Jul 28 17:33 3.txt.bak
```
## 文件操作

### 创建文件
```shell
touch  somefile.1     ## 创建一个空文件
echo "hi,boy" > somefile.2    ## 利用重定向“>”的功能，将一条指令的输出结果写入到一个文件中，会覆盖原文件内容，如果指定的文件不存在，则会创建出来
echo "hi baby" >> somefile.2   ## 将一条指令的输出结果追加到一个文件中，不会覆盖原文件内容
```
### vi文本编辑器
最基本用法
vi  somefile.4
1. 首先会进入“一般模式”，此模式只接受各种快捷键，不能编辑文件内容
2. 按i键，就会从一般模式进入编辑模式，此模式下，敲入的都是文件内容
3. 编辑完成之后，按Esc键退出编辑模式，回到一般模式；
4. 再按：，进入“底行命令模式”，输入wq命令，回车即可

常用快捷键
一些有用的快捷键（在一般模式下使用）：
* a   在光标后一位开始插入
* A   在该行的最后插入
* I   在该行的最前面插入
* gg   直接跳到文件的首行
* G    直接跳到文件的末行
* dd    删除一行
* 3dd   删除3行
* yy    复制一行
* 3yy   复制3行
* p     粘贴
* u     undo
* v        进入字符选择模式，选择完成后，按y复制，按p粘贴
* ctrl+v   进入块选择模式，选择完成后，按y复制，按p粘贴
* shift+v  进入行选择模式，选择完成后，按y复制，按p粘贴

查找并替换
1. 显示行号:set nu
2. 隐藏行号:set nonu
3. 查找关键字:/you       ## 效果：查找文件中出现的you，并定位到第一个找到的地方，按n可以定位到下一个匹配位置（按N定位到上一个）
4. 替换操作:s/sad/bbb   ## 查找光标所在行的第一个sad，替换为bbb.:%s/sad/bbb      ##查找文件中所有sad，替换为bbb

### 拷贝/删除/移动
``` shell
cp  somefile.1   /home/hadoop/
rm /home/hadoop/somefile.1
rm -f /home/hadoop/somefile.1
mv /home/hadoop/somefile.1 ../
```
### 查看文件内容
``` shell
cat    somefile      一次性将文件内容全部输出（控制台）
more   somefile      可以翻页查看, 下翻一页(空格)    上翻一页（b）   退出（q）
less   somefile      可以翻页查看,下翻一页(空格)    上翻一页（b），上翻一行(↑)  下翻一行（↓）  可以搜索关键字（/keyword）
跳到文件末尾： G
跳到文件首行： gg
退出less ：  q

tail -10  install.log  查看文件尾部的10行
tail +10  install.log  查看文件 10-->末行
tail -f install.log    小f跟踪文件的唯一inode号，就算文件改名后，还是跟踪原来这个inode表示的文件
tail -F install.log    大F按照文件名来跟踪

head -10  install.log   查看文件头部的10
```
### 打包压缩
1. gzip压缩:gzip a.txt
2. 解压:gunzip a.txt.gz 或者 gzip -d a.txt.gz
3. bzip2压缩:bzip2 a
4. 解压:bunzip2 a.bz2 或者 bzip2 -d a.bz2
5. 打包：将指定文件或文件夹-> tar -cvf bak.tar  ./aaa
        将/etc/password追加文件到bak.tar中(r)-> tar -rvf bak.tar /etc/password
6. 解压:tar -xvf bak.tar
7. 打包并压缩:tar -zcvf a.tar.gz  aaa/
8. 解包并解压缩(重要的事情说三遍!!!):tar  -zxvf  a.tar.gz
   解压到/usr/下->tar  -zxvf  a.tar.gz  -C  /usr
9. 查看压缩包内容:tar -ztvf a.tar.gz zip/unzip
10. 打包并压缩成bz2:tar -jcvf a.tar.bz2
11. 解压bz2:tar -jxvf a.tar.bz2

## 查找命令
### 常用查找命令的使用
1. 查找可执行的命令所在的路径：which ls
2. 查找可执行的命令和帮助的位置：whereis ls
3. 从某个文件夹开始查找文件：find / -name "hadooop*" 或者find / -name "hadooop*" -ls
4. 查找并删除：find / -name "hadooop*" -ok rm {} \;find / -name "hadooop*" -exec rm {} \;
5. 查找用户为hadoop的文件:find  /usr  -user  hadoop  -ls
6. 查找用户为hadoop的文件夹:find /home -user hadoop -type d -ls
7. 查找权限为777的文件:find / -perm -777 -type d -ls
8. 显示命令历史:history

### grep命令
1. 基本使用 查询包含hadoop的行 grep hadoop /etc/password 查询包含aaa的行   grep aaa  ./*.txt 
2. cut截取以:分割保留第七段: grep hadoop /etc/passwd | cut -d: -f7
3. 查询不包含hadoop的行:grep -v hadoop /etc/passwd
4. 正则表达包含hadoop:grep 'hadoop' /etc/passwd
5. 正则表达(点代表任意一个字符):grep 'h.*p' /etc/passwd
6. 正则表达以hadoop开头:grep '^hadoop' /etc/passwd
7. 正则表达以hadoop结尾:grep 'hadoop$' /etc/passwd
```
规则：
.  : 任意一个字符
a* : 任意多个a(零个或多个a)
a? : 零个或一个a
a+ : 一个或多个a
.* : 任意多个任意字符
\. : 转义.
o\{2\} : o重复两次
```
8. 查找不是以#开头的行: grep -v '^#' a.txt | grep -v '^$' 
9. 以h或r开头的:grep '^[hr]' /etc/passwd
10. 不是以h和r开头的:grep '^[^hr]' /etc/passwd
11. 不是以h到r开头的:grep '^[^h-r]' /etc/passwd

## 文件权限的操作
### linux文件权限的描述格式解读
```
drwxr-xr-x      （也可以用二进制表示  111 101 101  -->  755）

d：标识节点类型（d：文件夹   -：文件  l:链接）
r：可读   w：可写    x：可执行 
第一组rwx：  ## 表示这个文件的拥有者对它的权限：可读可写可执行
第二组r-x：  ## 表示这个文件的所属组用户对它的权限：可读，不可写，可执行
第三组r-x：  ## 表示这个文件的其他用户（相对于上面两类用户）对它的权限：可读，不可写，可
```
### 修改文件权限
``` shell
chmod g-rw haha.dat		 ## 表示将haha.dat对所属组的rw权限取消
chmod o-rw haha.dat		 ## 表示将haha.dat对其他人的rw权限取消
chmod u+x haha.dat		 ## 表示将haha.dat对所属用户的权限增加x
chmod a-x haha.dat       ## 表示将haha.dat对所用户取消x权限
chmod 664 haha.dat       ## 也可以用数字的方式来修改权限 就会修改成   rw-rw-r--
chmod -R 770 aaa/        ## 如果要将一个文件夹的所有内容权限统一修改，则可以-R参数
```
### 修改文件所有权
<只有root权限能执行>
``` shell
chown angela  aaa		## 改变所属用户
chown :angela  aaa		## 改变所属组
chown angela:angela aaa/	## 同时修改所属用户和所属组
```
## 基本的用户管理
```
添加一个用户：
useradd spark
passwd  spark     根据提示设置密码；
即可

删除一个用户：
userdel -r spark     加一个-r就表示把用户及用户的主目录都删除
```
### 添加用户
```
添加一个tom用户，设置它属于users组，并添加注释信息
分步完成：useradd tom
          usermod -g users tom
	  usermod -c "hr tom" tom
一步完成：useradd -g users -c "hr tom" tom

设置tom用户的密码
passwd tom
```
### 修改用户

```
修改tom用户的登陆名为tomcat
usermod -l tomcat tom

将tomcat添加到sys和root组中
usermod -G sys,root tomcat

查看tomcat的组信息
groups tomcat
```
### 用户组操作
```
添加一个叫america的组
groupadd america

将jerry添加到america组中
usermod -g america jerry

将tomcat用户从root组和sys组删除
gpasswd -d tomcat root
gpasswd -d tomcat sys

将america组名修改为am
groupmod -n am america
```
### 为用户配置sudo权限
```
用root编辑 vi /etc/sudoers
在文件的如下位置，为hadoop添加一行即可
root    ALL=(ALL)       ALL     
hadoop  ALL=(ALL)       ALL

然后，hadoop用户就可以用sudo来执行系统级别的指令
[root@localhost ~]$ sudo useradd xiaoming
```
## 系统管理操作

### 挂载外部存储设备

可以挂载光盘、硬盘、磁带、光盘镜像文件等
1. 挂载光驱
mkdir   /mnt/cdrom      创建一个目录，用来挂载
mount -t iso9660 -o ro /dev/cdrom /mnt/cdrom/     将设备/dev/cdrom挂载到 挂载点 ：  /mnt/cdrom中

2. 挂载光盘镜像文件（.iso文件）
mount -t iso9660 -o loop  /home/hadoop/Centos-7.0.DVD.iso /mnt/centos
注：挂载的资源在重启后即失效，需要重新挂载。要想自动挂载，可以将挂载信息设置到/etc/fstab配置文件中，如下：
/dev/cdrom/mnt/cdromiso9660 defaults        0 0
3. 卸载 umount
umount /mnt/cdrom
4. 存储空间查看 df -h
### 统计文件或文件夹的大小
```
du -sh  /mnt/cdrom/packages
df -h    查看磁盘的空间
```
### 系统服务管理

``` shell
service sshd status
service sshd stop 
service sshd start
service sshd restart
```

### 系统启动级别管理
``` shell
vi  /etc/inittab

       # Default runlevel. The runlevels used are:
       #   0 - halt (Do NOT set initdefault to this)
       #   1 - Single user mode
       #   2 - Multiuser, without NFS (The same as 3, if you do not have networking)
       #   3 - Full multiuser mode
       #   4 - unused
       #   5 - X11
       #   6 - reboot (Do NOT set initdefault to this)
       #
       id:3:initdefault:
       ## 通常将默认启动级别设置为：3
```
### 进程管理
```
top
free
ps -ef | grep ssh
kill -9
```
## SSH免密登陆配置
### SSH工作机制
1. 相关概念
SSH 为 Secure Shell（安全外壳协议） 的缩写。
很多ftp、pop和telnet在本质上都是不安全的，因为它们在网络上用明文传送口令和数据，别有用心的人非常容易就可以截获这些口令和数据。
而SSH就是专为远程登录会话和其他网络服务提供安全性的协议。

SSH是由客户端和服务端的软件组成的
服务端是一个守护进程(sshd)，他在后台运行并响应来自客户端的连接请求。
客户端包含ssh程序以及像scp（远程拷贝）、slogin（远程登陆）、sftp（安全文件传输）等其他的应用程序。

2. 认证机制
从客户端来看，SSH提供两种级别的安全验证。

第一种级别（基于口令的安全验证）
只要你知道自己帐号和口令，就可以登录到远程主机。

第二种级别（基于密钥的安全验证）
需要依靠密匙，也就是你必须为自己创建一对密匙，并把公用密匙放在需要访问的服务器上。如果你要连接到SSH服务器上，
客户端软件就会向服务器发出请求，请求用你的密匙进行安全验证。服务器收到请求之后，先在该服务器上你的主目录下寻找你的公用密匙，
然后把它和你发送过来的公用密匙进行比较。如果两个密匙一致，服务器就用公用密匙加密“质询”（challenge）并把它发送给客户端软件。
客户端软件收到“质询”之后就可以用你的私人密匙解密再把它发送给服务器。

### 密钥登陆方式配置

假如 A  要登陆  B
在A上操作：
1. 首先生成密钥对:ssh-keygen   (提示时，直接回车即可)
2. 再将A自己的公钥拷贝并追加到B的授权列表文件authorized_keys中: ssh-copy-id   B
## 网络管理
### 主机名配置
1. 查看主机名:hostname
2. 修改主机名(重启后无效):hostname hadoop
3. 修改主机名(重启后永久生效) :vi /ect/sysconfig/network
### IP地址配置
修改IP地址
1. 方式一：setup
用root输入setup命令，进入交互式修改界面
2. 方式二：修改配置文件 一般使用这种方法
(重启后永久生效)
vi /etc/sysconfig/network-scripts/ifcfg-eth0
3. 方式三：ifconfig命令(重启后无效)
ifconfig eth0 192.168.12.22修改IP地址
### 网络服务管理
1. 后台服务管理
``` shell
service network status    查看指定服务的状态
service network stop     停止指定服务
service network start     启动指定服务
service network restart   重启指定服务
service --status-all       查看系统中所有的后台服务
```
2. 设置后台服务的自启配置
``` shell
chkconfig   查看所有服务器自启配置
chkconfig iptables off   关掉指定服务的自动启动
chkconfig iptables on   开启指定服务的自动启动
```

### 防火墙

#### iptables防火墙

1. 基本操作

* 查看防火墙状态
``` 
service iptables status  
```
* 停止防火墙
```
service iptables stop  
```
* 启动防火墙
```
service iptables start  
```
* 重启防火墙
```
service iptables restart  
```
* 永久关闭防火墙
```
chkconfig iptables off  
```
* 永久关闭后重启
```
chkconfig iptables on　　
```

2. 开启80端口

```
 vim /etc/sysconfig/iptables
# 加入如下代码
-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
```

#### firewall防火墙

1. 查看firewall服务状态
```
systemctl status firewalld
```
2. 查看firewall的状态
```
firewall-cmd --state
```
3. 开启、重启、关闭、firewalld.service服务
```
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop
```
4. 查看防火墙规则
```
firewall-cmd --list-all 
```
5. 查询、开放、关闭端口
```
# 查询端口是否开放
firewall-cmd --query-port=8080/tcp
# 开放80端口
firewall-cmd --permanent --add-port=80/tcp
# 移除端口
firewall-cmd --permanent --remove-port=8080/tcp
#重启防火墙(修改配置后要重启防火墙)
firewall-cmd --reload
```
参数解释:

* firwall-cmd：是Linux提供的操作firewall的一个工具；
* --permanent：表示设置为持久；
* --add-port：标识添加的端口；
