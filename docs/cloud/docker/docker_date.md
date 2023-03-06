# Docker容器数据持久化存储机制

# 一、Docker容器数据持久化存储介绍

- 物理机或虚拟机数据持久化存储
  - 由于物理机或虚拟机本身就拥有大容量的磁盘，所以可以直接把数据存储在物理机或虚拟机本地文件系统中，亦或者也可以通过使用额外的存储系统（NFS、GlusterFS、Ceph等）来完成数据持久化存储。



- Docker容器数据持久化存储
  - 由于Docker容器是由容器镜像生成的，所以一般容器镜像中包含什么文件或目录，在容器启动后，我们依旧可以看到相同的文件或目录。
  - 由于Docker容器属于“用后即焚”型计算资源，因此Docker容器不适合做数据持久化存储



# 二、Docker容器数据持久化存储方式

Docker提供三种方式将数据从宿主机挂载到容器中：

- docker run -v
  - 运行容器时，直接挂载本地目录至容器中
- volumes
  - Docker管理宿主机文件系统的一部分(/var/lib/docker/volumes)
  - 是Docker默认存储数据方式
- bind mounts
  - 将宿主机上的任意位置文件或目录挂载到容器中



# 三、Docker容器数据持久化存储方式应用案例演示

## 3.1 docker run -v

### 3.1.1 未挂载本地目录



~~~powershell
运行一个容器，未挂载本地目录
# docker run -d --name web1 nginx:latest
~~~



~~~powershell
# docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES
c4ad9f2c15fa   nginx:latest   "/docker-entrypoint.…"   46 seconds ago   Up 44 seconds   80/tcp    web1
~~~



~~~powershell
使用curl命令访问容器
# curl http://172.17.0.2
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
~~~



~~~powershell
查看容器中/usr/share/nginx/html目录中目录或子目录
# docker exec web ls /usr/share/nginx/html
50x.html
index.html
~~~



### 3.1.2 挂载本地目录



~~~powershell
创建本地目录
# mkdir /opt/wwwroot
~~~



~~~powershell
向本地目录中添加index.html文件
# echo 'kubemsb' > /opt/wwwroot/index.html
~~~



~~~powershell
运行web2容器，把/opt/wwwroot目录挂载到/usr/share/nginx/html目录中
# docker run -d --name web2 -v /opt/wwwroot/:/usr/share/nginx/html/ nginx:latest
~~~



~~~powershell
查看容器IP地址
# docker inspect web2

......
 "IPAddress": "172.17.0.3",
 ......
~~~



~~~powershell
使用curl命令访问容器
# curl http://172.17.0.3
kubemsb
~~~



### 3.1.3 未创建本地目录



~~~powershell
运行web3容器，挂载未创建的本地目录，启动容器时将自动创建本地目录
# docker run -d --name web3 -v /opt/web3root/:/usr/share/nginx/html/ nginx:latest
~~~



~~~powershell
往自动创建的目录中添加一个index.html文件
# echo "kubemsb web3" > /opt/web3root/index.html
~~~





~~~powershell
在容器中执行查看文件命令
# docker exec web3 cat /usr/share/nginx/html/index.html
kubemsb web3
~~~





## 3.2 volumes

### 3.2.1 创建数据卷



~~~powershell
创建一个名称为nginx-vol的数据卷
# docker volume create nginx-vol
nginx-vol
~~~



~~~powershell
确认数据卷创建后的位置
# ls /var/lib/docker/volumes/
backingFsBlockDev  metadata.db  nginx-vol
~~~



~~~powershell
查看已经创建数据卷
# docker volume ls
DRIVER    VOLUME NAME
local     nginx-vol
~~~



~~~powershell
查看数据卷详细信息
# docker volume inspect nginx-vol
[
    {
        "CreatedAt": "2022-02-08T14:36:16+08:00",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/nginx-vol/_data",
        "Name": "nginx-vol",
        "Options": {},
        "Scope": "local"
    }
]
~~~





### 3.2.2 使用数据卷



~~~powershell
运行web4容器，使用--mount选项，实现数据卷挂载
# docker run -d --name web4 --mount src=nginx-vol,dst=/usr/share/nginx/html nginx:latest
~~~



或



~~~powershell
运行web4容器，使用-v选项，实现数据卷挂载
# docker run -d --name web4 -v nginx-vol:/usr/share/nginx/html/ nginx:latest
~~~





~~~powershell
查看容器运行后数据卷中文件或子目录
# ls /var/lib/docker/volumes/nginx-vol/_data/
50x.html  index.html
~~~



~~~powershell
使用curl命令访问容器
# curl http://172.17.0.2
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
~~~



~~~powershell
修改index.html文件内容
# echo "web4" > /var/lib/docker/volumes/nginx-vol/_data/index.html
~~~



~~~powershell
再次使用curl命令访问容器
# curl http://172.17.0.2
web4
~~~





## 3.3 bind mounts



~~~powershell
创建用于容器挂载的目录web5root
# mkdir /opt/web5root
~~~



~~~powershell
运行web5容器并使用bind mount方法实现本地任意目录挂载
# docker run -d --name web5 --mount type=bind,src=/opt/web5root,dst=/usr/share/nginx/html nginx:latest
~~~



~~~powershell
查看已挂载目录，里面没有任何数据
# ls /opt/web5root/
~~~



~~~powershell
添加内容至/opt/web5root/index.html中
# echo "web5" > /opt/web5root/index.html
~~~



~~~powershell
使用curl命令访问容器
# curl http://172.17.0.3
web5
~~~



