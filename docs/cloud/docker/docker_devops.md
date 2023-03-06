# 基于Docker容器DevOps应用方案 企业业务代码发布系统

# 一、企业业务代码发布方式

## 1.1 传统方式

- 以物理机或虚拟机为颗粒度部署
- 部署环境比较复杂，需要有先进的自动化运维手段
- 出现问题后重新部署成本大，一般采用集群方式部署
- 部署后以静态方式展现





## 1.2 容器化方式

- 以容器为颗粒度部署
- 部署方式简单，启动速度快
- 一次构建可到处运行
- 出现故障后，可随时恢复
- 可同时部署多套环境（测试、预发布、生产环境等）





# 二、企业业务代码发布逻辑图


![image-20220223152003734](../../img/docker_devops/image-20220223152003734.png)



# 三、企业业务代码发布工具及流程图

## 3.1 工具

| 序号 | 工具    | 工具用途                                                     |
| ---- | ------- | ------------------------------------------------------------ |
| 1    | git     | 用于提交业务代码或克隆业务代码仓库                           |
| 2    | gitlab  | 用于存储业务代码                                             |
| 3    | jenkins | 用于利用插件完成业务代码编译、构建、推送至Harbor容器镜像仓库及项目部署 |
| 4    | tomcat  | 用于运行JAVA业务代码                                         |
| 5    | maven   | 用于编译业务代码                                             |
| 6    | harbor  | 用于存储业务代码构建的容器镜像存储                           |
| 7    | docker  | 用于构建容器镜像，部署项目                                   |



## 3.2 流程图

> 本次部署Java代码包。


![image-20220223163453076](../../img/docker_devops/image-20220223163453076.png)



# 四、企业业务代码发布系统环境部署

## 4.1 主机规划

| 序号 | 主机名         | 主机IP        | 主机功能                     | 软件                 |
| ---- | -------------- | ------------- | ---------------------------- | -------------------- |
| 1    | dev            | 192.168.10.20 | 开发者 项目代码 solo         | git                  |
| 2    | gitlab-server  | 192.168.10.21 | 代码仓库                     | gitlab-ce            |
| 3    | jenkins-server | 192.168.10.22 | 编译代码、打包镜像、项目发布 | jenkins、docker、git |
| 4    | harbor-server  | 192.168.10.23 | 存储容器镜像                 | harbor、docker       |
| 5    | web-server     | 192.168.10.24 | 运行容器，项目上线           | docker               |



## 4.2 主机准备

### 4.2.1 主机名配置

~~~powershell
# hostnamectl set-hostname xxx
~~~

> 根据主机规划实施配置



### 4.2.2 主机IP地址配置



~~~powershell
# vim /etc/sysconfig/network-scripts/ifcfg-ens33
# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="none" 配置为静态IP
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="ec87533a-8151-4aa0-9d0f-1e970affcdc6"
DEVICE="ens33"
ONBOOT="yes"
IPADDR="192.168.10.2x"  把2x替换为对应的IP地址
PREFIX="24"
GATEWAY="192.168.10.2"
DNS1="119.29.29.29"
~~~







### 4.2.3 主机名与IP地址解析配置



~~~powershell
# vim /etc/hosts
# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.10.20 dev
192.168.10.21 gitlab-server
192.168.10.22 jenkins-server
192.168.10.23 harobr-server
192.168.10.24 web-server
~~~





### 4.2.4 主机安全设置

~~~powershell
# systemctl stop firewalld;systemctl disable firewalld
~~~



~~~powershell
# firewall-cmd --state
~~~



~~~powershell
# sestatus
~~~





### 4.2.5 主机时间同步

~~~powershell
# crontab -e

# crotab -l
0 */1 * * * ntpdate time1.aliyun.com
~~~





## 4.3 主机中工具安装

### 4.3.1 dev主机

>下载项目及上传代码至代码仓库

~~~powershell
# yum -y install git
~~~



### 4.3.2 gitlab-server主机

#### 4.3.2.1 获取YUM源

![image-20220224134917428](../../img/docker_devops/image-20220224134917428.png)

![image-20220224134941802](../../img/docker_devops/image-20220224134941802.png)



![image-20220224135000130](../../img/docker_devops/image-20220224135000130.png)



![image-20220224135021076](../../img/docker_devops/image-20220224135021076.png)





~~~powershell
# cat /etc/yum.repos.d/gitlab.repo
[gitlab]
name=gitlab-ce
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7
enabled=1
gpgcheck=0
~~~



#### 4.3.2.2 gitlab-ce安装



~~~powershell
# yum -y install gitlab-ce
~~~



#### 4.3.2.3 gitlab-ce配置



~~~powershell
# vim /etc/gitlab/gitlab.rb
32 external_url 'http://192.168.10.21'
~~~



#### 4.3.2.4 启动gitlab-ce



~~~powershell
# gitlab-ctl reconfigure
~~~



~~~powershell
# gitlab-ctl status
~~~





#### 4.3.2.5 访问gitlab-ce



~~~powershell
# cat /etc/gitlab/initial_root_password
......

Password: znS4Bqlp0cfYUKg2dHzFiNCAN0GnhtnD4ENjEtEXMVE=

~~~



![image-20220224140418176](../../img/docker_devops/image-20220224140418176.png)



![image-20220224140436172](../../img/docker_devops/image-20220224140436172.png)





### 4.3.3 jenkins-server主机

#### 4.3.3.1 jdk安装



~~~powershell
# ls
 jdk-8u191-linux-x64.tar.gz
~~~



~~~powershell
# mv jdk1.8.0_191 /usr/local/jdk
~~~



~~~powershell
# vim /etc/profile
# cat /etc/profile
......
export JAVA_HOME=/usr/local/jdk
export PATH=${JAVA_HOME}/bin:$PATH
~~~



~~~powershell
# source /etc/profile
~~~



~~~powershell
# java -version
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
~~~





#### 4.3.3.2 jenkins安装

##### 4.3.3.2.1 安装



![image-20220224141530225](../../img/docker_devops/image-20220224141530225.png)





![image-20220224141610569](../../img/docker_devops/image-20220224141610569.png)





![image-20220224141720927](../../img/docker_devops/image-20220224141720927.png)





~~~powershell
#  wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
~~~



~~~powershell
# rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
~~~



![image-20220224142031988](../../img/docker_devops/image-20220224142031988.png)





~~~powershell
# wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo

~~~



~~~powershell
# yum -y install jenkins
~~~



##### 4.3.3.2.2 jenkins配置

~~~powershell
# vim /etc/init.d/jenkins
在81行下面添加如下内容：
 82 /usr/local/jdk/bin/java
~~~



~~~powershell
# vim /etc/sysconfig/jenkins
在19行双引号中添加jdk中java命令路径
 19 JENKINS_JAVA_CMD="/usr/local/jdk/bin/java"
~~~





##### 4.3.3.2.3 jenkins启动



~~~powershell
# chkconfig --list

注：该输出结果只显示 SysV 服务，并不包含
原生 systemd 服务。SysV 配置数据
可能被原生 systemd 配置覆盖。

      要列出 systemd 服务，请执行 'systemctl list-unit-files'。
      查看在具体 target 启用的服务请执行
      'systemctl list-dependencies [target]'。

jenkins         0:关    1:关    2:开    3:开    4:开    5:开    6:关
netconsole      0:关    1:关    2:关    3:关    4:关    5:关    6:关
network         0:关    1:关    2:开    3:开    4:开    5:开    6:关
# chkconfig jenkins on
~~~



~~~powershell
# systemctl start jenkins
~~~





##### 4.3.3.2.4 jenkins访问



~~~powershell
# cat /var/lib/jenkins/secrets/initialAdminPassword
3363d658a1a5481bbe51a1ece1eb08ab
~~~









![image-20220224142955854](../../img/docker_devops/image-20220224142955854.png)



##### 4.3.3.2.5 jenkins初始化配置



![image-20220224173833454](../../img/docker_devops/image-20220224173833454.png)





![image-20220224174018298](../../img/docker_devops/image-20220224174018298.png)



![image-20220224174041874](../../img/docker_devops/image-20220224174041874.png)



![image-20220224174442874](../../img/docker_devops/image-20220224174442874.png)



![image-20220224174507233](../../img/docker_devops/image-20220224174507233.png)





![image-20220224174541367](../../img/docker_devops/image-20220224174541367.png)



![image-20220224174601389](../../img/docker_devops/image-20220224174601389.png)







#### 4.3.3.3 git安装



~~~powershell
# yum -y install git
~~~





#### 4.3.3.4 maven安装



##### 4.3.3.4.1 获取maven安装包



![image-20220224174735575](../../img/docker_devops/image-20220224174735575.png)





![image-20220224174855779](../../img/docker_devops/image-20220224174855779.png)







~~~powershell
# wget https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.tar.gz
~~~



##### 4.3.3.4.2 maven安装



~~~powershell
# ls
apache-maven-3.8.4-bin.tar.gz
~~~



~~~powershell
# tar xf apache-maven-3.8.4-bin.tar.gz
# ls
apache-maven-3.8.4
~~~



~~~powershell
# mv apache-maven-3.8.4 /usr/local/mvn
~~~



~~~powershell
# vim /etc/profile
......
export JAVA_HOME=/usr/local/jdk
export MAVEN_HOME=/usr/local/mvn
export PATH=${JAVA_HOME}/bin:${MAVEN_HOME}/bin:$PATH
~~~



~~~powershell
# source /etc/profile
~~~



~~~powershell
# mvn -v
Apache Maven 3.8.4 (9b656c72d54e5bacbed989b64718c159fe39b537)
Maven home: /usr/local/mvn
Java version: 1.8.0_191, vendor: Oracle Corporation, runtime: /usr/local/jdk/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-1160.49.1.el7.x86_64", arch: "amd64", family: "unix"
~~~







#### 4.3.3.5 docker安装



~~~powershell
# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~



~~~powershell
# yum -y install docker-ce
~~~



~~~powershell
# systemctl enable docker
# systemctl start docker
~~~





### 4.3.4 harbor-server主机

#### 4.3.4.1 docker安装

~~~powershell
# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~



~~~powershell
# yum -y install docker-ce
~~~



~~~powershell
# systemctl enable docker
# systemctl start docker
~~~



#### 4.3.4.2 docker-compose安装

##### 4.3.4.2.1 获取docker-compose文件



![image-20220224180711917](../../img/docker_devops/image-20220224180711917.png)



![image-20220224180732745](../../img/docker_devops/image-20220224180732745.png)





![image-20220224180754614](../../img/docker_devops/image-20220224180754614.png)





![image-20220224180842212](../../img/docker_devops/image-20220224180842212.png)





~~~powershell
# wget https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64
~~~



##### 4.3.4.2.2 docker-compose安装及测试



~~~powershell
# ls
docker-compose-linux-x86_64
~~~



~~~powershell
# chmod +x docker-compose-linux-x86_64
~~~



~~~powershell
# mv docker-compose-linux-x86_64 /usr/bin/docker-compose
~~~



~~~powershell
# docker-compose version
Docker Compose version v2.2.3
~~~





#### 4.3.4.3 harbor部署

##### 4.3.4.3.1 harbor部署文件获取

![image-20220224181602622](../../img/docker_devops/image-20220224181602622.png)



![image-20220224181626286](../../img/docker_devops/image-20220224181626286.png)





![image-20220224181656604](../../img/docker_devops/image-20220224181656604.png)



![image-20220224181746808](../../img/docker_devops/image-20220224181746808.png)





![image-20220224181829179](../../img/docker_devops/image-20220224181829179.png)



~~~powershell
# wget https://github.com/goharbor/harbor/releases/download/v2.4.1/harbor-offline-installer-v2.4.1.tgz
~~~





##### 4.3.4.3.2 harbor部署



~~~powershell
# ls
harbor-offline-installer-v2.4.1.tgz
~~~



~~~powershell
# tar xf harbor-offline-installer-v2.4.1.tgz -C /home
~~~





~~~powershell
# cd /home
# ls
harbor
[root@harbor-server home]# cd harbor/
[root@harbor-server harbor]# ls
common.sh  harbor.v2.4.1.tar.gz  harbor.yml.tmpl  install.sh  LICENSE  prepare
~~~





~~~powershell
# mv harbor.yml.tmpl harbor.yml
~~~



~~~powershell
[root@harbor-server harbor]# vim harbor.yml
[root@harbor-server harbor]# cat harbor.yml
# Configuration file of Harbor

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 192.168.10.23 修改

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
#https: 注释
  # https port for harbor, default is 443
#  port: 443 注释
  # The path of cert and key files for nginx
#  certificate: /your/certificate/path 注释
#  private_key: /your/private/key/path 注释

~~~



~~~powershell
[root@harbor-server harbor]# ./prepare
~~~



~~~powershell
[root@harbor-server harbor]# ./install.sh
~~~



~~~powershell
[root@harbor-server harbor]# docker ps
CONTAINER ID   IMAGE                                COMMAND                  CREATED              STATUS                        PORTS                                   NAMES
12605eae32bb   goharbor/harbor-jobservice:v2.4.1    "/harbor/entrypoint.…"   About a minute ago   Up About a minute (healthy)                                           harbor-jobservice
85849b46d56d   goharbor/nginx-photon:v2.4.1         "nginx -g 'daemon of…"   About a minute ago   Up About a minute (healthy)   0.0.0.0:80->8080/tcp, :::80->8080/tcp   nginx
6a18e370354f   goharbor/harbor-core:v2.4.1          "/harbor/entrypoint.…"   About a minute ago   Up About a minute (healthy)                                           harbor-core
d115229ef49d   goharbor/harbor-portal:v2.4.1        "nginx -g 'daemon of…"   About a minute ago   Up About a minute (healthy)                                           harbor-portal
f5436556dd32   goharbor/harbor-db:v2.4.1            "/docker-entrypoint.…"   About a minute ago   Up About a minute (healthy)                                           harbor-db
7fb8c4945abe   goharbor/harbor-registryctl:v2.4.1   "/home/harbor/start.…"   About a minute ago   Up About a minute (healthy)                                           registryctl
d073e5da1399   goharbor/redis-photon:v2.4.1         "redis-server /etc/r…"   About a minute ago   Up About a minute (healthy)                                           redis
7c09362c986b   goharbor/registry-photon:v2.4.1      "/home/harbor/entryp…"   About a minute ago   Up About a minute (healthy)                                           registry
55d7f39909e3   goharbor/harbor-log:v2.4.1           "/bin/sh -c /usr/loc…"   About a minute ago   Up About a minute (healthy)   127.0.0.1:1514->10514/tcp               harbor-log
~~~







### 4.3.5 web-server

> docker安装



~~~powershell
# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~



~~~powershell
# yum -y install docker-ce
~~~



~~~powershell
# systemctl enable docker
# systemctl start docker
~~~





## 4.4 工具集成配置



### 4.4.1 配置docker主机使用harbor

#### 4.4.1.1 jenkins-server

~~~powershell
[root@jenkins-server ~]# vim /etc/docker/daemon.json
[root@jenkins-server ~]# cat /etc/docker/daemon.json
{
        "insecure-registries": ["http://192.168.10.23"]
}
~~~



~~~powershell
[root@jenkins-server ~]# systemctl restart docker
~~~



~~~powershell
[root@jenkins-server ~]# docker login 192.168.10.23
Username: admin
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
~~~





#### 4.4.1.2 harbor-server



~~~powershell
[root@harbor-server harbor]# vim /etc/docker/daemon.json
[root@harbor-server harbor]# cat /etc/docker/daemon.json
{
        "insecure-registries": ["http://192.168.10.23"]
}
~~~



~~~powershell
[root@harbor-server harbor]# docker-compose down
~~~



~~~powershell
[root@harbor-server harbor]# systemctl restart docker
~~~



~~~powershell
[root@harbor-server harbor]# docker-compose up -d
~~~





#### 4.4.1.3 web-server



~~~powershell
[root@web-server ~]# vim /etc/docker/daemon.json
[root@web-server ~]# cat /etc/docker/daemon.json
{
        "insecure-registries": ["http://192.168.10.23"]
}
~~~



~~~powershell
[root@web-server ~]# systemctl restart docker
~~~



~~~powershell
[root@web-server ~]# docker login 192.168.10.23
Username: admin
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
~~~



### 4.4.2 配置jenkins使用docker

> 在jenkins-server主机上配置



~~~powershell
验证系统中是否有jenkins用户
[root@jenkins-server ~]# grep jenkins /etc/passwd
jenkins:x:997:995:Jenkins Automation Server:/var/lib/jenkins:/bin/false
~~~





~~~powershell
验证系统中是否有docker用户及用户组
[root@jenkins-server ~]# grep docker /etc/group
docker:x:993:
~~~





~~~powershell
添加jenkins用户到docker用户组
[root@jenkins-server ~]# usermod -G docker jenkins
[root@jenkins-server ~]# grep docker /etc/group
docker:x:993:jenkins
~~~





~~~powershell
重启jenkins服务
[root@jenkins-server ~]# systemctl restart jenkins
~~~



### 4.4.3 密钥配置

#### 4.4.3.1 dev主机至gitlab-ce

##### 4.4.3.1.1 dev主机生成密钥对

~~~powershell
[root@dev ~]# ssh-keygen
~~~



##### 4.4.3.1.2 添加公钥至gitlab-ce



~~~powershell
[root@dev ~]# cat /root/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCy2PdvT9qX55CLZzzaaEf06x8gl3yHGfdJSmAp9L1Fdtcbd3yz3U0lgdOwWpB8fQ/A3HoUUTWCb1iC5WJBOvqkoD8rJ2xC3HJ62zjOjmqcn2fEs09CzJj3bCfahuqPzaPkIOoH42/Y2QdImQ7xZOqqjS7aIc5T2FjDLG3bMhaYFyvx18b1qiPACuh67iniPQnL667MFZ/0QGGVnQKwxop+SezhP9QqV1bvPk94eTdkERIBiY1CNcNmVryk6PzSKY8gfW++3TGN9F+knhMXcswFOu6FzqxcA3G+hYg+Io2HJaDrsfHGZ6CP5T9QiOlIWlNxz05BOK3OFQ5BPeomA+jv root@dev
~~~



![image-20220224210606310](../../img/docker_devops/image-20220224210606310.png)



![image-20220224210748207](../../img/docker_devops/image-20220224210748207.png)



![image-20220224210823231](../../img/docker_devops/image-20220224210823231.png)





#### 4.4.3.2 jenkins-server主机至gitlab-ce



##### 4.4.3.2.1 在jenkins-server生成密钥对

~~~powershell
[root@jenkins-server ~]# ssh-keygen
~~~



##### 4.4.3.2.2 添加公钥至gitlab-ce



~~~powershell
[root@jenkins-server ~]# cat /root/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyg3WaEm5yH9yva8Jm5wfTPwN3ROGMNPpAex8zYj+M1GesoMtE6gkiKHWydAJBiLuu/1fBx6HlgzzxghVj9oK4DmTRZQh2IZY4+zZIGBRaDBuBO1f7+SdVE/jZoLd1a+yZ3FQmy37AlXUcIKxbrDBtefvJ31faziWyZKvT4BGFJCznRU6AOxOg1pe4bWbWI+dGnMIIq7IhtK+6tY/w3OlF7xcWmrJP1oucpq33BYOrnRCL9EO5Zp2jcejDeG5UvXONG7CggT7FDhjwcCRZvX+AutDGAtgBckNXZjV9SDKWgDifCSDtDfV4Be4zb8b3hxtSMsbEY8YHxsThsmHrUkbz root@jenkins-server
~~~



![image-20220224211329307](../../img/docker_devops/image-20220224211329307.png)





#### 4.4.3.3 配置jenkins-sever主机的私钥到凭据列表



~~~powershell
[root@jenkins-server ~]# cat /root/.ssh/id_rsa
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAsoN1mhJuch/cr2vCZucH0z8Dd0ThjDT6QHsfM2I/jNRnrKDL
ROoJIih1snQCQYi7rv9Xwceh5YM88YIVY/aCuA5k0WUIdiGWOPs2SBgUWgwbgTtX
+/knVRP42aC3dWvsmdxUJst+wJV1HCCsW6wwbXn7yd9X2s4lsmSr0+ARhSQs50VO
gDsToNaXuG1m1iPnRpzCCKuyIbSvurWP8NzpRe8XFpqyT9aLnKat9wWDq50Qi/RD
uWado3How3huVL1zjRuwoIE+xQ4Y8HAkWb1/gLrQxgLYAXJDV2Y1fUgyloA4nwkg
7Q31eAXuM2/G94cbUjLGxGPGB8bE4bJh61JG8wIDAQABAoIBAEOwy6BPyuelo1Y1
g3LnujTlWRgZ23kCAb7/sPYYFEb/qAxysIGCSVJVi0PO76gQBDM4iftmCsLv/+UI
UbolGK5Ybuxj5lB9LeyPfaba0qTOoINhkFxwvvRo7V0Ar3BsKzywqoxHb9nxEoZG
8XSVl4t7zPlgonzK3MqHmAxwk9QrIB/rnjolHGN6HvfK2Cwq5WN1crspwQ+XDbRS
J5qoAtv6PJzrU6QhJl/zSMCb0MytlIhZi+V+1yY/QhAYrWJgWypEwGlAXlVC90r4
twX1W/sl63xzFF396WjM1478yqpttvID06dKTC9T3y/k8lLmRNXwqmTCIm7C/jxP
9wjXJUECgYEA4r1N4AML7JpvE7hBRkreSdIIwoppRkBwl6gt/AJj8yt2ydQ8PY4P
X3s5ZkCfPzHX2XsVUUcQpsBFcU2PyG29+qzt3XOmlGYgJG11xPQbwi95/u9VSd5u
AuaNNa2YPw2teuM0hKVAl5knfy0+YHcOCdU14gHCCWsD4uOz5Zg9jVMCgYEAyYzv
SBvCqbZ4d5agTn+ZiOkmgKVT4UVnmZPivFXnCWiIbX2fi3ok7jU1hZAs6lf6VlTU
EPV8T1LwjO9yhFmicepzSl9lJCMbMXHt20OsqN0oUQFpoTQ07pbBE2K8c1IuQUEi
B2SoLHqv7Ym9jHQqvT3DVhTiC+H2LwsgVRvvi+ECgYAxaID0xJUvnMOBr5ABykTA
H1WrVs/z8AzY71v942N2VM1Q07/AxhkRfF+YqZJKCgl4KbsOeAbn31QCiZ1AVrGk
U1SOAiqVgd+VMIkOPwdhfEkARZT3QNIGLcktnkNj0g4wjhwen4gAwO37Z5eFG8xi
ViSkuC9ZMAmrwmSsLk2TYwKBgHQh0tYXuMiVLUCq99+DQnJS9S53FKfel900Cxc9
4AvZwZJlKgLx9EmVOyukcVzuKH6KDk9fQ6tpPNXYOoHsK9+7mYanBN4XpFmPLeCD
U/9QvyQ9ziFmtYEsOD/1SmSgW6qZ3wOnigdnAeu6zA8b+GxmJCF7kuwJ3RIqNQ0V
NafBAoGAXyynoTT2zugFq8jYRubxkMk7NdnTRAnGh+mlyrGGMsNLmPvfAw+6yKph
1fVHKXHtSrgtK0CVOIcmaH3r+LfG4Mfrjlq+8qiKcepBFvO9cZLNKn11vqQtzs7m
y+ydl4xTcCPoAMDsVeamJ3fv+9nyXe5KqYtw+BJMjpP+PnNN2YQ=
-----END RSA PRIVATE KEY-----
~~~



![image-20220224212308684](../../img/docker_devops/image-20220224212308684.png)

![image-20220224212411414](../../img/docker_devops/image-20220224212411414.png)



![image-20220224212543257](../../img/docker_devops/image-20220224212543257.png)



![image-20220224212622017](../../img/docker_devops/image-20220224212622017.png)



![image-20220224212928853](../../img/docker_devops/image-20220224212928853.png)





![image-20220224213022249](../../img/docker_devops/image-20220224213022249.png)





## 4.5 jenkins插件安装

### 4.5.1 maven integration

> 用于编译JAVA项目



![image-20220224214012429](../../img/docker_devops/image-20220224214012429.png)



![image-20220224214041517](../../img/docker_devops/image-20220224214041517.png)



![image-20220224214133277](../../img/docker_devops/image-20220224214133277.png)



![image-20220224214217988](../../img/docker_devops/image-20220224214217988.png)





### 4.5.2 git parameter

> 用于基于git版本提交进行参数构建项目



![image-20220224214317316](../../img/docker_devops/image-20220224214317316.png)





![image-20220224214329349](../../img/docker_devops/image-20220224214329349.png)







### 4.5.3 gitlab

> 用于jenkins-server拉取项目



![image-20220224214412283](../../img/docker_devops/image-20220224214412283.png)



![image-20220224214442366](../../img/docker_devops/image-20220224214442366.png)







### 4.5.4 Generic Webhook Trigger

> 用于项目自动化构建



![image-20220224214812077](../../img/docker_devops/image-20220224214812077.png)





![image-20220224214922182](../../img/docker_devops/image-20220224214922182.png)







### 4.5.5 ssh

> 用于jenkins-server对web-server实施项目部署



![image-20220224215008239](../../img/docker_devops/image-20220224215008239.png)



![image-20220224215019932](../../img/docker_devops/image-20220224215019932.png)



## 4.6 jenkins全局工具配置

![image-20220224215857618](../../img/docker_devops/image-20220224215857618.png)



### 4.6.1 JDK配置



~~~powershell
[root@jenkins-server ~]# java -version
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
[root@jenkins-server ~]# echo $JAVA_HOME
/usr/local/jdk
~~~





![image-20220224220023637](../../img/docker_devops/image-20220224220023637.png)



![image-20220224220323445](../../img/docker_devops/image-20220224220323445.png)



### 4.6.2 Git配置



~~~powershell
[root@jenkins-server ~]# git version
git version 1.8.3.1
~~~



![image-20220224220502686](../../img/docker_devops/image-20220224220502686.png)







### 4.6.3 Maven配置



~~~powershell
[root@jenkins-server ~]# mvn --version
Apache Maven 3.8.4 (9b656c72d54e5bacbed989b64718c159fe39b537)
Maven home: /usr/local/mvn
Java version: 1.8.0_191, vendor: Oracle Corporation, runtime: /usr/local/jdk/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-1160.49.1.el7.x86_64", arch: "amd64", family: "unix"
[root@jenkins-server ~]# echo $MAVEN_HOME
/usr/local/mvn
~~~





![image-20220224220529911](../../img/docker_devops/image-20220224220529911.png)







![image-20220224220733835](../../img/docker_devops/image-20220224220733835.png)







## 4.7 jenkins系统配置

> 主要配置jenkins-server通过ssh协议连接web-server



### 4.7.1 添加jenkins-server访问web-server凭据



![image-20220224221320500](../../img/docker_devops/image-20220224221320500.png)



![image-20220224221347030](../../img/docker_devops/image-20220224221347030.png)



![image-20220224221416358](../../img/docker_devops/image-20220224221416358.png)



![image-20220224221609980](../../img/docker_devops/image-20220224221609980.png)



![image-20220224221643648](../../img/docker_devops/image-20220224221643648.png)







### 4.7.2 配置ssh协议连接主机



![image-20220224221754566](../../img/docker_devops/image-20220224221754566.png)



![image-20220224221832480](../../img/docker_devops/image-20220224221832480.png)



![image-20220224221901770](../../img/docker_devops/image-20220224221901770.png)



![image-20220224222146699](../../img/docker_devops/image-20220224222146699.png)







# 五、企业业务代码项目发布

## 5.1 数据库管理系统部署 mariadb及创建项目数据库



~~~powershell
[root@web-server ~]# yum -y install mariadb mariadb-server
~~~



~~~powershell
[root@web-server ~]# systemctl enable mariadb
[root@web-server ~]# systemctl start mariadb
~~~



~~~powershell
[root@web-server ~]# mysqladmin -uroot password 'abc123'
~~~



~~~powershell
[root@web-server ~]# mysql -uroot -pabc123
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 5.5.68-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
~~~



~~~powershell
MariaDB [(none)]> create database if not exists solo default charset utf8 collate utf8_general_ci;
~~~



~~~powershell
MariaDB [(none)]> grant all on solo.* to 'root'@'%' identified by "123456";
Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> grant all on solo.* to 'root'@'localhost' identified by "123456";
Query OK, 0 rows affected (0.00 sec)
~~~





## 5.2 项目代码获取



![image-20220224223418318](../../img/docker_devops/image-20220224223418318.png)



~~~powershell
# git clone --recurse-submodules https://gitee.com/dl88250/solo.git
~~~





## 5.3 项目代码修改

~~~powershell
[root@dev ~]# ls
solo
~~~



~~~powershell
[root@dev ~]# vim solo/src/main/resources/local.properties
[root@dev ~]# cat solo/src/main/resources/local.properties
#
# Solo - A small and beautiful blogging system written in Java.
# Copyright (c) 2010-present, b3log.org
#
# Solo is licensed under Mulan PSL v2.
# You can use this software according to the terms and conditions of the Mulan PSL v2.
# You may obtain a copy of Mulan PSL v2 at:
#         http://license.coscl.org.cn/MulanPSL2
# THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
# See the Mulan PSL v2 for more details.
#

#
# Description: Solo local environment configurations.
# Version: 1.1.3.15, Mar 17, 2019
# Author: Liang Ding
#

#### MySQL runtime ####
runtimeDatabase=MYSQL
jdbc.username=root
jdbc.password=123456
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.URL=jdbc:mysql://192.168.10.24:3306/solo?useUnicode=yes&characterEncoding=UTF-8&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

#### H2 runtime ####
#runtimeDatabase=H2
#jdbc.username=root
#jdbc.password=
#jdbc.driver=org.h2.Driver
#jdbc.URL=jdbc:h2:~/solo_h2/db;MODE=MYSQL

# The minConnCnt MUST larger or equal to 3
jdbc.minConnCnt=5
jdbc.maxConnCnt=10

# The specific table name prefix
jdbc.tablePrefix=b3_solo
~~~



## 5.4 项目代码上传到gitlab



![image-20220224223855433](../../img/docker_devops/image-20220224223855433.png)



![image-20220224223917897](../../img/docker_devops/image-20220224223917897.png)



![image-20220224224014013](../../img/docker_devops/image-20220224224014013.png)







~~~powershell
# git config --global user.name "dev"
# git config --global user.email "dev@kubemsb.com"
~~~



~~~powershell
[root@dev solo]# git remote remove origin
~~~



~~~powershell
[root@dev solo]# git remote add origin git@192.168.10.21:root/solo.git
~~~



~~~powershell
[root@dev solo]# git add -A .
[root@dev solo]# git commit -m "new"
[master 3e39b0a] new
 1 file changed, 1 insertion(+), 1 deletion(-)
~~~



~~~powershell
[root@dev solo]# git tag 1.0.0
~~~



~~~powershell
[root@dev solo]# git push origin 1.0.0
~~~



~~~powershell
[root@dev solo]# git push -u origin --all
~~~



![image-20220224225051498](../../img/docker_devops/image-20220224225051498.png)





## 5.5 构建项目运行基础应用容器镜像

> 在harbor-server主机上操作

### 5.5.1 创建项目目录



~~~powershell
[root@harbor-server ~]# mkdir tomcatdir
[root@harbor-server ~]# cd tomcatdir
~~~



### 5.5.2 生成Dockerfile文件



~~~powershell
[root@harbor-server tomcatdir]# echo "tomcat is running" >> index.html
~~~



~~~powershell
[root@harbor-server tomcatdir]# vim Dockerfile
[root@harbor-server tomcatdir]# cat Dockerfile
FROM centos:centos7

MAINTAINER "www.kubemsb.com"

ENV VERSION=8.5.75
ENV JAVA_HOME=/usr/local/jdk
ENV TOMCAT_HOME=/usr/local/tomcat

RUN yum -y install wget

RUN wget https://dlcdn.apache.org/tomcat/tomcat-8/v${VERSION}/bin/apache-tomcat-${VERSION}.tar.gz --no-check-certificate

RUN tar xf apache-tomcat-${VERSION}.tar.gz

RUN mv apache-tomcat-${VERSION} /usr/local/tomcat

RUN rm -rf apache-tomcat-${VERSION}.tar.gz /usr/local/tomcat/webapps/*

RUN mkdir /usr/local/tomcat/webapps/ROOT

ADD ./index.html /usr/local/tomcat/webapps/ROOT/

ADD ./jdk /usr/local/jdk


RUN echo "export TOMCAT_HOME=/usr/local/tomcat" >> /etc/profile

RUN echo "export JAVA_HOME=/usr/local/jdk" >> /etc/profile

RUN echo "export PATH=${TOMCAT_HOME}/bin:${JAVA_HOME}/bin:$PATH" >> /etc/profile

RUN echo "export CLASSPATH=.:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar" >> /etc/profile


RUN source /etc/profile

EXPOSE 8080

CMD ["/usr/local/tomcat/bin/catalina.sh","run"]
~~~



~~~powershell
[root@harbor-server tomcatdir]# ls
Dockerfile  index.html  jdk
~~~





### 5.5.3 使用docker build构建容器镜像



~~~powershell
[root@harbor-server tomcatdir]# docker build -t 192.168.10.23/library/tomcat:8575 .
~~~



### 5.5.4 推送容器镜像至harbor容器镜像仓库



~~~powershell
[root@harbor-server tomcatdir]# docker images
REPOSITORY                      TAG       IMAGE ID       CREATED              SIZE
192.168.10.23/library/tomcat    8575      01c433f8562d   About a minute ago   796MB
~~~



~~~powershell
[root@harbor-server tomcatdir]# docker login 192.168.10.23
Username: admin
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
~~~



~~~powershell

[root@harbor-server tomcatdir]# docker push 192.168.10.23/library/tomcat:8575
~~~



![image-20220224231004637](../../img/docker_devops/image-20220224231004637.png)





### 5.5.5 验证容器镜像可用性



~~~powershell
[root@harbor-server ~]# docker run -d 192.168.10.23/library/tomcat:8575
d5443961ca65311ca0d68d53d44be997f5d6fde2d78772173ac6927112f34579
~~~



~~~powershell
[root@harbor-server ~]# docker ps
CONTAINER ID   IMAGE                                COMMAND                  CREATED         STATUS                 PORTS                                   NAMES
d5443961ca65   192.168.10.23/library/tomcat:8575    "/usr/local/tomcat/b…"   3 seconds ago   Up 2 seconds           8080/tcp                                nifty_tesla
~~~



~~~powershell
[root@harbor-server ~]# docker inspect d544

获得：172.17.0.2
~~~



~~~powershell
[root@harbor-server ~]# curl http://172.17.0.2:8080
tomcat is running
~~~



## 5.6 项目构建及发布

### 5.6.1 项目构建及发布步骤

第一步：jenkins获取项目代码

第二步：jenkins对项目代码编译，由maven完成

第三步：jenkins使用docker对编译完成的项目代码进行打包，打包成容器应用镜像

第四步：jenkins把打包的容器应用镜像上传到harbor

第五步：jenkins通过ssh插件完成对web-server进行运行容器应用镜像的操作



### 5.6.2 创建项目任务



![image-20220224231659567](../../img/docker_devops/image-20220224231659567.png)



![image-20220224231808502](../../img/docker_devops/image-20220224231808502.png)





![image-20220224233231807](../../img/docker_devops/image-20220224233231807.png)







![image-20220224233433469](../../img/docker_devops/image-20220224233433469.png)







![image-20220225014415364](../../img/docker_devops/image-20220225014415364.png)







![image-20220225014449916](../../img/docker_devops/image-20220225014449916.png)







![image-20220225014608778](../../img/docker_devops/image-20220225014608778.png)







![image-20220225014711014](../../img/docker_devops/image-20220225014711014.png)







~~~powershell
Dockerfile：
REPOSITORY=192.168.10.23/library/solo:${Tag}
# 构建镜像
cat > Dockerfile << EOF
FROM 192.168.10.23/library/tomcat:8575
RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY target/*.war /usr/local/tomcat/webapps/ROOT.war
CMD ["/usr/local/tomcat/bin/catalina.sh", "run"]
EOF
docker build -t $REPOSITORY .

# 上传镜像
docker login 192.168.10.23 -u admin -p Harbor12345
docker push $REPOSITORY
docker logout 192.168.10.23
~~~





~~~powershell
shell script:
REPOSITORY=192.168.10.23/library/solo:${Tag}
# 部署
docker rm -f blog-solo |true
docker image rm $REPOSITORY |true
docker container run -d --name blog-solo -p 80:8080 $REPOSITORY
~~~









![image-20220225014217956](../../img/docker_devops/image-20220225014217956.png)



![image-20220225014302077](../../img/docker_devops/image-20220225014302077.png)







![image-20220225014131634](../../img/docker_devops/image-20220225014131634.png)





![image-20220225014949917](../../img/docker_devops/image-20220225014949917.png)





![image-20220225013841677](../../img/docker_devops/image-20220225013841677.png)

