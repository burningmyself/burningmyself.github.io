# Centos配置 docker java mysql mongodb redis nginx 环境

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
docker pull redis #拉取 redis
docker run -p 6379:6379 --name redis \ # run 运行容器 -p 将容器的6379端口映射到主机的6379端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime\ # 将主机本地时间夹挂在到容器
-v /data/redis:/data/redis \ # 将数据文件夹挂载到主机
-d redis \ # -d 后台运行
--requirepass "123456" # 设置密码123456
```

## 拉取 Nginx 镜像

``` shell
docker pull nginx #拉取 nginx
docker run -p 80:80 -p 443:443 --name nginx -d nginx # 运行容器
docker container cp nginx:/etc/nginx /data/nginx/ #拷贝容器配置
docker rm -f nginx # 删除容器
```

nginx 配置文件

``` conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error_log.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log   /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    gzip on; #开启gzip
    gzip_disable "msie6"; #IE6不使用gzip
    gzip_vary on; #设置为on会在Header里增加 "Vary: Accept-Encoding"
    gzip_proxied any; #代理结果数据的压缩
    gzip_comp_level 6; #gzip压缩比（1~9），越小压缩效果越差，但是越大处理越慢，所以一般取中间值
    gzip_buffers 16 8k; #获取多少内存用于缓存压缩结果
    gzip_http_version 1.1; #识别http协议的版本
    gzip_min_length 1k; #设置允许压缩的页面最小字节数，超过1k的文件会被压缩
    gzip_types application/javascript text/css; #对特定的MIME类型生效,js和css文件会被压缩

    include /etc/nginx/conf.d/*.conf;

    server {
      #nginx同时开启http和https
    	listen 80 default backlog=2048;
    	listen 443 ssl;
    	server_name ysf.djtlpay.com;
    	
    	ssl_certificate  /ssl/1_ysf.djtlpay.com_bundle.crt;
    	ssl_certificate_key  /ssl/2_ysf.djtlpay.com.key;
	
        location / {
            root /usr/share/nginx/html;
            index  index.html index.htm;
        }
   }		
}

```
运行 nginx
``` shell
docker run -p 80:80 -p 443:443 --name nginx \ # run 运行容器 -p 将容器的80,443端口映射到主机的80,443端口 --name 容器运行的名字
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/nginx/html:/usr/share/nginx/html \ # nginx 静态资源
-v /data/nginx/logs:/var/log/nginx  \ # 将日志文件夹挂载到主机
-v /data/nginx/conf:/etc/nginx \ # 将配置文件夹挂在到主机
-v /data/nginx/conf/ssl:/ssl \ # 将证书文件夹挂在到主机
-d nginx
```

## docker 常用命令

``` shell
systemctl start docker #启动docker
systemtctl enable docker #将docker服务设为开机启动
systemctl stop docker #停止容器
systemctl restart docker #重启docker服务
docker images # 列出镜像
docker rmi --name # 删除镜像  -f 强制删除
docker ps # 列出容器 -a 所有
docker start --name # 启动容器
docker stop --name # 停止容器
docker restart # 重启docker容器
docker rm --name # 删除容器  -f 强制删除
docker stats -a # 查看所有容器情况
docker system df # 查看Docker磁盘使用情况
docker exec -it --name  /bin/bash #进入Docker容器内部的bash
docker cp 主机文件  容器名称:容器路径 #复制文件到docker容器中
docker logs 镜像名称 #查看docker镜像日志
```
