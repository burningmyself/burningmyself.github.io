# Centos配置 docker java mysql mongodb redis 环境

## 磁盘挂载

``` shell
fdisk -l #查看磁盘列表
mkfs.ext4 /dev/vdb #格式化磁盘
mount /dev/vdb /data #挂载磁盘在/data
echo '/dev/vdb /data ext4 defaults,nofail 0 1'>> /etc/fstab # 启动服务器自动挂载
mount -a #校验自动挂载脚本
df -h #查看磁盘挂载后信息
```

## 安装 docker

``` shell
yum update #更新系统包
yum install -y yum-utils device-mapper-persistent-data lvm2 #安装yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo #为yum源添加docker仓库位置
yum install docker-ce #安装docker
systemctl start docker #启动docker
```

## 拉取 java 镜像

``` shell
docker pull java:8
```

## 拉取 MySql 镜像

``` shell
docker pull mysql #拉取 MySql
docker run -p 3306:3306 --name mysql \ # run 运行容器 -p 将容器的3306端口映射到主机的3306端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/mysql/log:/var/log/mysql \ # 将日志文件夹挂载到主机
-v /data/mysql/data:/var/lib/mysql \ # 将数据文件夹挂载到主机
-v /data/mysql/mysql-files:/var/lib/mysql-files \ # 将数据文件夹挂载到主机
-v /data/mysql/conf:/etc/mysql \ # 将配置文件夹挂在到主机
-e MYSQL_ROOT_PASSWORD=xiuingmysql. \ # 初始化root用户的密码
-d mysql # -d 后台运行
```

## 拉取 Mongodb 镜像

``` shell
docker pull mongo #拉取 mongodb
docker run -p 27017:27017  --name mongo \ # run 运行容器 -p 将容器的27017端口映射到主机的27017端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/mongodb:/var/lib/mongodb \ # 将数据文件夹挂载到主机
-d mongo #后台运行
```

## 拉取 Redis 镜像

``` shell
docker run -p 6379:6379 --name redis \ # run 运行容器 -p 将容器的6379端口映射到主机的6379端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/redis:/data/redis \ # 将数据文件夹挂载到主机
-d redis \ # -d 后台运行
--requirepass "123456" # 设置密码123456
```

## docker 常用命令

``` shell
systemctl start docker #启动docker
systemctl stop docker #停止容器
docker images # 列出镜像
docker rmi --name # 删除镜像  
docker ps # 列出容器 -a 所有
docker stop --name # 停止容器
docker start --name # 启动容器
docker rm --name # 删除容器
docker stats -a # 查看所有容器情况
docker system df # 查看Docker磁盘使用情况
docker exec -it --name  /bin/bash #进入Docker容器内部的bash
```
