# docker和docker-compose 配置 mysql mssql mongodb redis nginx jenkins 环境

## 磁盘挂载

``` shell
fdisk -l #查看磁盘列表
mkfs.ext4 /dev/vdb #格式化磁盘
mount /dev/vdb /data #挂载磁盘在/data
echo '/dev/vdb /data ext4 defaults,nofail 0 1'>> /etc/fstab # 启动服务器自动挂载
mount -a #校验自动挂载脚本
df -h #查看磁盘挂载后信息
```

## docker

### 安装 docker

``` shell
yum update #更新系统包
yum install -y yum-utils device-mapper-persistent-data lvm2 #安装yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo #为yum源添加docker仓库位置
yum install docker-ce #安装docker
systemctl enable docker #设置开机自动启动
systemctl start docker #启动docker
systemctl stop docker #暂停docker
mv /var/lib/docker /data/docker # 修改Docker镜像的存放位置
ln -s /data/docker /var/lib/docker #建立软连接
echo '{
  "registry-mirrors": [
    "https://dockerhub.azk8s.cn",
    "https://hub-mirror.c.163.com",
    "https://registry.docker-cn.com"
    ]
}
'>> /etc/docker/daemon.json # 镜像下载代理
```

### 拉取 Java 镜像

``` shell
docker pull java
```

### 拉取SqlServer镜像

``` shell
docker pull microsoft/mssql-server-linux # 拉取SqlServer镜像
docker run -p 1433:1433 --name mssql \ # run 运行容器 -p 将容器的1433端口映射到主机的1433端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /data/sqlserver:/var/opt/mssql \ # 挂载mssql文件夹到主机
-e ACCEPT_EULA=Y \ # 同意协议
-e MSSQL_SA_PASSWORD=mssql-MSSQL \ # 初始化sa密码
-u root \ # 指定容器为root运行
-d microsoft/mssql-server-linux # -d 后台运行
```

### 拉取 MySql 镜像

``` shell
docker pull mysql #拉取 MySql
docker run -p 3306:3306 --name mysql \ # run 运行容器 -p 将容器的3306端口映射到主机的3306端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/mysql/log:/var/log/mysql \ # 将日志文件夹挂载到主机
-v /data/mysql/data:/var/lib/mysql \ # 将数据文件夹挂载到主机
-v /data/mysql/mysql-files:/var/lib/mysql-files \ # 将数据文件夹挂载到主机
-v /data/mysql/conf:/etc/mysql \ # 将配置文件夹挂在到主机
-e MYSQL_ROOT_PASSWORD=xiujingmysql. \ # 初始化root用户的密码
-d mysql # -d 后台运行
docker exec -it mysql /bin/bash # 进入Docker容器内部的bash
```

### 拉取 Mongodb 镜像

``` shell
docker pull mongo #拉取 mongodb
docker run -p 27017:27017  --name mongo \ # run 运行容器 -p 将容器的27017端口映射到主机的27017端口 --name 容器运行的名字 
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/mongodb/db:/data/db \ # 将数据文件夹挂载到主机
-v /data/mongodb/configdb:/data/configdb \ # 将数据库配置文件挂载到主机
-v /data/mongodb/initdb:/docker-entrypoint-initdb.d # 通过/docker-entrypoint-initdb.d/将更复杂的用户设置显式留给用户 当容器首次启动时它会执行/docker-entrypoint-initdb.d 目录下的sh 和js脚本 。 以脚本字母顺序执行
-e MONGO_INITDB_ROOT_USERNAME=admin \ # 设置admin数据库账户名称 如果使用了此项，则不需要 --auth 参数
-e MONGO_INITDB_ROOT_PASSWORD=admin  \ # 设置admin数据库账户密码 如果使用了此项，则不需要 --auth 参数
-d mongo \ # -d 后台运行
--auth # --auth 需要密码才能访问容器服务

docker exec -it mongo mongo admin # 进入mongo
db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]}); #创建一个名为 admin，密码为 123456 的用户。
db.auth('admin', '123456') # 尝试使用上面创建的用户信息进行连接。
```

### 拉取 Redis 镜像

``` shell
docker pull redis #拉取 redis
docker run -p 6379:6379 --name redis \ # run 运行容器 -p 将容器的6379端口映射到主机的6379端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/redis:/data \ # 将数据文件夹挂载到主机
-d redis \ # -d 后台运行
redis-server --appendonly yes \ # 在容器执行redis-server启动命令，并打开redis持久化配置
--requirepass "123456" # 设置密码123456
```

### 拉取 Nginx 镜像

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
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/nginx/html:/usr/share/nginx/html \ # nginx 静态资源
-v /data/nginx/logs:/var/log/nginx  \ # 将日志文件夹挂载到主机
-v /data/nginx/conf:/etc/nginx \ # 将配置文件夹挂在到主机
-v /data/nginx/conf/ssl:/ssl \ # 将证书文件夹挂在到主机
-d nginx #
```

### 拉取Jenkins镜像：
```shell
docker pull jenkins/jenkins:lts # 拉取 jenkins
docker run -p 8080:8080 -p 50000:50000 --name jenkins \ # run 运行容器 -p 将容器的8080,50000端口映射到主机的8080,50000端口 --name 容器运行的名字
--restart=always \ # 挂断自动重新启动
-u root \ # 运行的用户为root
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/jenkins_home:/var/jenkins_home \ # 将jenkins_home文件夹挂在到主机
-e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \ #设置jenkins运行环境时区
-d jenkins/jenkins:lts # -d 后台运行
```

### 拉取MinIO镜像
```shell
docker pull minio/minio # 拉取MinIO镜像
docker run -p 9000:9000 --name minio \ # run 运行容器 -p 将容器的9000,9000端口映射到主机的9000,9000端口 --name 容器运行的名
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /data/minio/data:/data \ # 将data文件夹挂在到主机
-v /data/minio/config:/root/.minio \ # 将配置文件夹挂在到主机
-e "MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE" \ # 设置MINIO_ACCESS_KEY的值
-e "MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \ # 设置MINIO_SECRET_KEY值
-d minio/minio server /data # -d 后台运行 server /data 导出/data目录

```

### 拉取Portainer镜像

``` shell
docker pull portainer/portainer # 拉取MinIO镜像
docker run -p 8001:8000 -p 9001:9000 --name portainer \ # run 运行容器 -p 将容器的8000,9000端口映射到主机的8000,9000端口 --name 容器运行的名
--restart=always \ # 挂断自动重新启动
-v /etc/localtime:/etc/localtime \ # 将主机本地时间夹挂在到容器
-v /var/run/docker.sock:/var/run/docker.sock \ # 将docker.sock文件夹挂在到主机
-v /data/portainer/data:/data \ # 将配置文件夹挂在到主机
-d portainer/portainer portainer # -d 后台运行
```

### Docker 开启远程API

* 用vi编辑器修改docker.service文件
``` shell
vi /usr/lib/systemd/system/docker.service
#需要修改的部分：
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
#修改后的部分：
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
```

### Docker 常用命令

``` shell
systemctl start docker #启动docker
systemctl enable docker #将docker服务设为开机启动
systemctl stop docker #停止容器
systemctl restart docker #重启docker服务
docker images # 列出镜像
docker rmi --name # 删除镜像  -f 强制删除
docker ps # 列出容器 -a 所有
docker start --name # 启动容器
docker stop --name # 停止容器
docker restart --name # 重启docker容器
docker rm --name # 删除容器  -f 强制删除
docker stats -a # 查看所有容器情况
docker system df # 查看Docker磁盘使用情况
docker exec -it --name  /bin/bash #进入Docker容器内部的bash
docker cp 主机文件  容器名称:容器路径 #复制文件到docker容器中
docker logs --name #查看docker镜像日志
docker rm $(docker ps -a -q) # 删除所有容器 -f 强制删除
docker rmi $(docker images -a -q) # 删除所有镜像 -f 强制删除
docker rm -f `docker ps -a | grep -vE 'mysql|nginx|redis|jenkins' | awk '{print $1}'` # 删除mysql|nginx|redis|jenkins非容器 -f 强制删除
docker rmi -f `docker images | grep none | awk '{print $3}'` # 删除镜像none镜像 -f 强制删除
```

## docker-compose 

### 安装 docker-compose
```shell
# 下载Docker Compose
curl -L https://get.daocloud.io/docker/compose/releases/download/1.24.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 修改该文件的权限为可执行
chmod +x /usr/local/bin/docker-compose
# 查看是否已经安装成功
docker-compose --version
```
### 使用Docker Compose的步骤
* 使用Dockerfile定义应用程序环境，一般需要修改初始镜像行为时才需要使用；
* 使用docker-compose.yml定义需要部署的应用程序服务，以便执行脚本一次性部署；
* 使用docker-compose up命令将所有应用服务一次性部署起来。

### docker-compose.yml常用命令
``` shell
# 指定运行的镜像名称
image: name:version
# 配置容器名称
container_name: name
# 指定宿主机和容器的端口映射
ports:
  - 3306:3306
# 将宿主机的文件或目录挂载到容器中
volumes:
  - /etc/localtime:/etc/localtime
  - /data/mysql/log:/var/log/mysql
  - /data/mysql/data:/var/lib/mysql
  - /data/mysql/conf:/etc/mysql
  - /data/mysql/mysql-files:/var/lib/mysql-files
# 配置环境变量
environment:
  - MYSQL_ROOT_PASSWORD=xiujingmysql.
# 连接其他容器的服务
links:
  - db:database #可以以database为域名访问服务名称为db的容器
# 挂断自动重新启动
restart: always
# 指定容器执行命令
command: redis-server --requirepass xiujingredis.
```

### Docker Compose常用命令

```shell
# 构建、创建、启动相关容器
docker-compose up -d # -d表示在后台运行
# 停止所有相关容器
docker-compose stop
# 删除容器文件
docker-compose rm -f # -f 强制删除
# 重启容器
docker-compose restart
# 列出所有容器信息
docker-compose ps
# 查看容器日志
docker-compose logs
```

### 使用Docker Compose 部署应用

编写docker-compose.yml文件
``` yml
version: '3'
services:
  # 指定服务名称
  nginx:
    # 指定服务使用的镜像
    image: nginx
    # 指定容器名称
    container_name: nginx
    # 指定服务运行的端口
    ports:
      - 80:80
      - 443:443
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
    # 挂断自动重新启动
    restart: always
    # 指定容器的环境变量
    environment:
      - TZ=Asia/Shanghai # 设置容器时区与宿主机保持一致
  # 指定服务名称
  sqlserver:
    # 指定服务使用的镜像
    image: mcr.microsoft.com/mssql/server
    # 指定容器名称
    container_name: sqlserver
    # 指定服务运行的端口
    ports:
      - "1433"
    # 指定容器中需要挂载的文件  
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/sqlserver:/var/opt/mssql
    # 挂断自动重新启动  
    restart: always
    environment:
      - TZ=Asia/Shanghai
      - SA_PASSWORD=mssql-MSSQL
      - ACCEPT_EULA=Y 
    # 指定容器运行的用户为root
    user:
      root       
  # 指定服务名称
  mysql:
    # 指定服务使用的镜像
    image: mysql
    # 指定容器名称
    container_name: mysql
    # 指定服务运行的端口
    ports:
      - 3306:3306
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/mysql/log:/var/log/mysql
      - /data/mysql/data:/var/lib/mysql
      - /data/mysql/mysql-files:/var/lib/mysql-files
      - /data/mysql/conf:/etc/mysql
    # 挂断自动重新启动
    restart: always
    # 指定容器的环境变量
    environment:
      - TZ=Asia/Shanghai # 设置容器时区与宿主机保持一致
      - MYSQL_ROOT_PASSWORD=xiujingmysql. # 设置root密码
    # 指定容器运行的用户为root
    user:
      root     
  # 指定服务名称
  redis:
    # 指定服务使用的镜像
    image: redis
    # 指定容器名称
    container_name: redis
    # 指定服务运行的端口
    ports:
      - 6379:6379
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/redis:/data
      - /data/redis/redis.conf:/etc/redis.conf
    # 挂断自动重新启动
    restart: always
    # 指定容器执行命令
    command: redis-server /etc/redis.conf --requirepass xiujingredis. --appendonly yes
    # 指定容器的环境变量
    environment:
      - TZ=Asia/Shanghai # 设置容器时区与宿主机保持一致
  # 指定服务名称
  mongo:
    # 指定服务使用的镜像
    image: mongo
    # 指定容器名称
    container_name: mongo
    # 指定服务运行的端口
    ports:
      - 27017:27017
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/mongodb/db:/data/db
      - /data/mongodb/configdb:/data/configdb
      - /data/mongodb/initdb:/docker-entrypoint-initdb.d      
    # 挂断自动重新启动
    restart: always
    # 指定容器的环境变量
    environment:
      - TZ=Asia/Shanghai # 设置容器时区与宿主机保持一致
      - AUTH=yes
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=admin
  # 指定服务名称
  jenkins:
    # 指定服务使用的镜像
    image: jenkins
    # 指定容器名称
    container_name: jenkins
    # 指定服务运行的端口
    ports:
      - 8080:8080
      - 50000:50000
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/jenkins_home:/var/jenkins_home 
    # 挂断自动重新启动
    restart: always
    # 指定容器的环境变量
    environment:
      - TZ=Asia/Shanghai # 设置容器时区与宿主机保持一致
      - JAVA_OPTS=-Duser.timezone=Asia/Shanghai   
    # 指定容器运行的用户为root
    user:
      root    
  # 指定服务名称
  minio:
    # 指定服务使用的镜像
    image: minio
    # 指定容器名称
    container_name: minio
    # 指定服务运行的端口
    ports:
      - 9000:9000
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /data/minio/data:/data 
      - /data/minio/config:/root/.minio
    # 挂断自动重新启动
    restart: always   
    # 指定容器执行命令
    command: server /data    
  # 指定服务名称   
  portainer :
    # 指定服务使用的镜像
    image: portainer 
    # 指定容器名称
    container_name: portainer 
    # 指定服务运行的端口
    ports:
      - 8001:8000
      - 9001:9000
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /var/run/docker.sock:/var/run/docker.sock 
      - /data/portainer/data:/data
    # 挂断自动重新启动
    restart: always  
```
运行Docker Compose命令启动所有服务
``` shell
docker-compose up -d
```
