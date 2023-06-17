# GitOps

# 一、什么是GitOps

说起GitOps，可能马上会联想到我们前面讲的DevOps，那么GitOps和DevOps之间有什么关系、又有什么区别呢？

DevOps是一种文化

DevOps包含了Development和Operations两个部分，是一种重视“软件开发人员（Dev）”和“IT运维技术人员（Ops）”之间沟通合作的文化或惯例。通过自动化“软件交付”和“架构变更”的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。

如今很多团队当中都在践行着DevOps文化，其中核心的一条理念就是“自动化一切可自动化的”。而GitOps，也正是基于这种理念下而诞生的一种持续交付方式。



# 二、为什么需要GitOps

GitOps核心思想是将应用系统的声明性基础架构和应用程序存放在Git版本库中。

将Git作为交付流水线的核心，每个开发人员都可以提交拉取请求（Pull Request）并使用Git来加速和简化应用程序部署和运维任务。通过使用Git，开发人员可以更高效地将注意力集中在创建新功能而不是运维相关任务上（例如，应用系统安装、配置、迁移等）。

同时，GitOps还是一整套CI/CD流水线方案。

在GitOps中可以自由地为流水线的不同部分选择最佳工具。可以从开源生态系统中选择一组工具，也可以从封闭源中选择一组工具，或者根据使用情况，甚至可以将它们组合在一起。



# 三、GitOps怎么实现

## 3.1实现方式介绍

通过gitlab实现CI流程，将 CD 部分使用 Argo CD 来完成，以实现应用部署及应用部署回滚的可控性。

![git_argo](../../img/kubernetes/kubernetes_gitops/git_argo.png)



## 3.2 环境准备

### 3.2.1主机规划



![image-20220908104352788](../../img/kubernetes/kubernetes_gitops/image-20220908104352788.png)



| 序号 | 主机名       | 主机ip        | 主机功能                | 软件                           |
| ---- | ------------ | ------------- | ----------------------- | ------------------------------ |
| 1    | dev          | 192.168.10.1  | 开发者 项目代码 apidemo | go、golang 、goland            |
| 2    | gitlab       | 192.168.10.11 | 代码仓库，CI操作        | git-lab、git、golang、docker   |
| 3    | harbor       | 192.168.10.21 | 管理和存储容器镜像      | docker、docker-compose、harbor |
| 4    | k8s-master01 | 192.168.10.31 | k8s-master              | k8s、ArgoCd                    |
| 5    | k8s-worker01 | 192.168.10.32 | k8s-worker              | k8s、ArgoCd                    |
| 6    | k8s-worker02 | 192.168.10.33 | k8s-worker              | k8s、ArgoCd                    |



![image-20220908104623080](../../img/kubernetes/kubernetes_gitops/image-20220908104623080.png)



### 3.2.2主机准备

#### 3.2.2.1主机ip地址配置

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
IPADDR="192.168.10.x"  把x替换为对应的IP地址
PREFIX="24"
GATEWAY="192.168.10.2"
DNS1="223.5.5.5"
DNS1="223.6.6.6"
~~~

#### 3.2.2.2主机名准备

~~~powershell
# hostnamectl set-hostname xxx
~~~

> 根据主机规划实施配置

#### 3.2.2.3主机名与ip地址解析配置

~~~powershell
# vim /etc/hosts
# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.10.11 gitlab
192.168.10.21 harbor
192.168.10.31 k8s-master01
192.168.10.32 k8s-worker01
192.168.10.33 k8s-worker02
~~~

#### 3.2.2.4 主机安全设置

~~~powershell
# systemctl stop firewalld;systemctl disable firewalld
~~~



~~~powershell
# firewall-cmd --state
~~~



~~~powershell
# sestatus 关闭selinux
~~~



#### 3.2.2.5主机时间同步

~~~powershell
编辑
# crontab -e

查看
# crotab -l
0 */1 * * * ntpdate time1.aliyun.com
~~~



## 3.3主机中工具安装

### 3.3.1 gitlab主机

#### 3.3.1.1 获取yum源

~~~powershell
[root@gitlab ~]# vim /etc/yum.repos.d/gitlab.repo
[gitlab]
name=gitlab-ce
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7
enabled=1
gpgcheck=0
~~~

#### 3.3.1.2 gitlab-ce安装

~~~powershell
[root@gitlab ~]# yum -y install gitlab-ce
~~~

#### 3.3.1.3 gitlab-ce配置

~~~powershell
[root@gitlab ~]# vim /etc/gitlab/gitlab.rb
32 external_url 'http://192.168.10.11'  #此ip为在gitlab上创建项目的url前缀
~~~

#### 3.3.1.4 启动gitlab-ce

~~~powershell
[root@gitlab ~]# gitlab-ctl reconfigure
~~~

~~~powershell
[root@gitlab ~]# gitlab-ctl status
~~~

#### 3.3.1.5 访问gitlab-ce

浏览器输入gitlab-ce的服务器地址：http://192.168.10.11

![登录gitlab-01](../../img/kubernetes/kubernetes_gitops/登录gitlab-01.png)

~~~powershell
[root@gitlab ~]# cat /etc/gitlab/initial_root_password  #获取gitlab-ce登录初始密码，登录账户名为：root
......

Password: znS4Bqlp0cfYUKg2dHzFiNCAN0GnhtnD4ENjEtEXMVE=

~~~

通过命令行获取初始化密码后登录gitlab-ce

![登录gitlab-02](../../img/kubernetes/kubernetes_gitops/登录gitlab-02.png)

gitlab-ce的UI界面

![gitlab-ui](../../img/kubernetes/kubernetes_gitops/gitlab-ui.png)

#### 3.3.1.6 修改gitlab-ce root用户的密码

方便后续操作，修改root用户的登录密码

![修改gitlab-ce,root用户密码-01](../../img/kubernetes/kubernetes_gitops/修改gitlab-ce,root用户密码-01.png)

![修改gitlab-ce,root用户密码-02](../../img/kubernetes/kubernetes_gitops/修改gitlab-ce,root用户密码-02.png)

![修改gitlab-ce,root用户密码-03](../../img/kubernetes/kubernetes_gitops/修改gitlab-ce,root用户密码-03.png)

![修改gitlab-ce,root用户密码-04](../../img/kubernetes/kubernetes_gitops/修改gitlab-ce,root用户密码-04.png)

重新登录gitlab-ce

![重新登录gitlab](../../img/kubernetes/kubernetes_gitops/重新登录gitlab.png)

#### 3.3.1.7 git安装

当开发者push代码以后，gitlab-runner会在gitlab-ce服务器执行流水线里定义的具体操作，流水线步骤里定义了gitlab-runner通过kustomize客户端工具修改应用部署资源清单文件里的容器镜像版本，并重新push代码到代码仓库，所以需要在gitlab-ce服务器安装git

```shell
[root@gitlab ~]# yum -y install git
操作系统自带的源里的git版本可能过低，gitlab-runner无法使用，需要升级下git版本
[root@gitlab ~]# yum install -y  http://opensource.wandisco.com/centos/7/git/x86_64/wandisco-git-release-7-2.noarch.rpm
[root@gitlab ~]# yum update -y  git
查看git版本
[root@gitlab ~]# git --version
git version 2.31.1
```



#### 3.3.1.8 go环境安装

本次应用demo是用go语言开发的，gitlab-runner在编译项目源码时，需要使用go命令，所以需要安装go环境

参考链接：https://golang.google.cn/dl/

```powershell
安装go解释器，并创建对应目录
[root@gitlab ~]# wget https://dl.google.com/go/go1.19.linux-amd64.tar.gz
[root@gitlab ~]# tar xzvf go1.19.linux-amd64.tar.gz -C /usr/local/
[root@gitlab ~]# mkdir /usr/local/go/gopath
[root@gitlab ~]# mkdir /usr/local/go/gopath/src
[root@gitlab ~]# mkdir /usr/local/go/gopath/bin
[root@gitlab ~]# mkdir /usr/local/go/gopath/pkg
```



~~~powershell
[root@gitlab ~]# vim /etc/profile
添加如下几行
export GOROOT="/usr/local/go"
export GOPATH="/usr/local/go/gopath"
export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOBIN

加载环境变量
[root@gitlab ~]# source /etc/profile

配置go环境变量
[root@gitlab ~]# go env -w GOPROXY=https://goproxy.cn
[root@gitlab ~]# go env -w GO111MODULE=on

将go可执行文件软链到/usr/bin/下
[root@gitlab ~]# ln -s /usr/local/go/bin/go /usr/bin/go
~~~



~~~powershell
为GOPATH添加其他用户可写权限，不然gitlab-runner无法执行相关命令
[root@gitlab ~]# chmod -R 757 /usr/local/go/gopath
~~~



#### 3.3.1.9 docker安装

gitlab-runner在执行流水线时需要将源码编译后的可执行文件制作成容器镜像，所以需要安装docker

~~~powershell
[root@gitlab ~]# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~

~~~powershell
[root@gitlab ~]# yum -y install docker-ce
~~~

~~~powershell
[root@gitlab ~]# systemctl enable docker
[root@gitlab ~]# systemctl start docker
~~~



### 3.3.2 harbor主机

#### 3.3.2.1 docker安装

~~~powershell
[root@harbor ~]# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~

~~~powershell
[root@harbor ~]# yum -y install docker-ce
~~~

~~~powershell
[root@harbor ~]# systemctl enable docker
[root@harbor ~]# systemctl start docker
~~~



#### 3.3.2.2 docker-compose安装

参考链接：https://github.com/docker/compose

~~~powershell
[root@harbor ~]# wget https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64
~~~

~~~powershell
[root@harbor ~]# ls
docker-compose-linux-x86_64
~~~

~~~powershell
[root@harbor ~]# chmod +x docker-compose-linux-x86_64
~~~

~~~powershell
[root@harbor ~]# mv docker-compose-linux-x86_64 /usr/bin/docker-compose
~~~

~~~powershell
[root@harbor ~]# docker-compose version
Docker Compose version v2.2.3
~~~



#### 3.3.2.3 部署harbor

参考链接：https://github.com/goharbor/harbor

~~~powershell
[root@harbor ~]# wget https://github.com/goharbor/harbor/releases/download/v2.4.1/harbor-offline-installer-v2.4.1.tgz
~~~

~~~powershell
[root@harbor ~]# ls
harbor-offline-installer-v2.4.1.tgz
~~~

~~~powershell
[root@harbor ~]# tar xf harbor-offline-installer-v2.4.1.tgz -C /home
~~~

~~~powershell
[root@harbor ~]# cd /home
[root@harbor home]# ls
harbor
[root@harbor home]# cd harbor/
[root@harbor harbor]# ls
common.sh  harbor.v2.4.1.tar.gz  harbor.yml.tmpl  install.sh  LICENSE  prepare
~~~

~~~powershell
[root@harbor harbor]# mv harbor.yml.tmpl harbor.yml
~~~

~~~powershell
[root@harbor harbor]# vim harbor.yml
# Configuration file of Harbor

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 192.168.10.21 修改

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
[root@harbor harbor]# ./prepare 
~~~

~~~powershell
[root@harbor harbor]# ./install.sh
......
[+] Running 10/10
 ⠿ Network harbor_harbor        Created                                                                                                                                                                                                                                                                                                0.0s
 ⠿ Container harbor-log         Started                                                                                                                                                                                                                                                                                                0.3s
 ⠿ Container harbor-portal      Started                                                                                                                                                                                                                                                                                                1.2s
 ⠿ Container harbor-db          Started                                                                                                                                                                                                                                                                                                1.3s
 ⠿ Container registry           Started                                                                                                                                                                                                                                                                                                1.3s
 ⠿ Container registryctl        Started                                                                                                                                                                                                                                                                                                1.3s
 ⠿ Container redis              Started                                                                                                                                                                                                                                                                                                1.2s
 ⠿ Container harbor-core        Started                                                                                                                                                                                                                                                                                                2.0s
 ⠿ Container nginx              Started                                                                                                                                                                                                                                                                                                2.8s
 ⠿ Container harbor-jobservice  Started                                                                                                                                                                                                                                                                                                2.8s
✔ ----Harbor has been installed and started successfully.----
输出以上内容，harbor安装成功
~~~

~~~powershell
[root@harbor harbor]# docker ps
CONTAINER ID   IMAGE                                COMMAND                  CREATED          STATUS                    PORTS                                   NAMES
18cf67f9557c   goharbor/harbor-jobservice:v2.4.1    "/harbor/entrypoint.…"   53 seconds ago   Up 50 seconds (healthy)                                           harbor-jobservice
4469424da41a   goharbor/nginx-photon:v2.4.1         "nginx -g 'daemon of…"   53 seconds ago   Up 50 seconds (healthy)   0.0.0.0:80->8080/tcp, :::80->8080/tcp   nginx
813ca518828f   goharbor/harbor-core:v2.4.1          "/harbor/entrypoint.…"   53 seconds ago   Up 51 seconds (healthy)                                           harbor-core
6119c3a9fe69   goharbor/harbor-db:v2.4.1            "/docker-entrypoint.…"   53 seconds ago   Up 52 seconds (healthy)                                           harbor-db
87b262aee8f4   goharbor/harbor-portal:v2.4.1        "nginx -g 'daemon of…"   53 seconds ago   Up 52 seconds (healthy)                                           harbor-portal
b2dfca1561f4   goharbor/redis-photon:v2.4.1         "redis-server /etc/r…"   53 seconds ago   Up 52 seconds (healthy)                                           redis
b9462946a5ca   goharbor/harbor-registryctl:v2.4.1   "/home/harbor/start.…"   53 seconds ago   Up 52 seconds (healthy)                                           registryctl
c95cb337f764   goharbor/registry-photon:v2.4.1      "/home/harbor/entryp…"   53 seconds ago   Up 51 seconds (healthy)                                           registry
58621f64a41f   goharbor/harbor-log:v2.4.1           "/bin/sh -c /usr/loc…"   53 seconds ago   Up 53 seconds (healthy)   127.0.0.1:1514->10514/tcp               harbor-log
~~~



#### 3.3.2.4 访问harbor

浏览器输入安装harbor配置文件里的hostname，http://192.168.10.21,用户名为admin,密码为配置文件里设置的Harbor12345

![登录harbor](../../img/kubernetes/kubernetes_gitops/登录harbor.png)



harborUI界面

![harborUI](../../img/kubernetes/kubernetes_gitops/harborUI.png)



### 3.3.3 k8s安装

#### 3.3.3.1 配置主机名与IP地址解析

> 下面解析是管理员添加，sealos在运行过程中，也会自动添加主机名与IP地址解析关系。

~~~powershell
[root@k8s-master01 ~]# cat /etc/hosts
192.168.10.31 k8s-master01
192.168.10.32 k8s-worker01
192.168.10.33 k8s-worker02
[root@k8s-worker01 ~]# cat /etc/hosts
192.168.10.31 k8s-master01
192.168.10.32 k8s-worker01
192.168.10.33 k8s-worker02
[root@k8s-worker02 ~]# cat /etc/hosts
192.168.10.31 k8s-master01
192.168.10.32 k8s-worker01
192.168.10.33 k8s-worker02
~~~



#### 3.3.3.2 升级操作系统内核

> k8s集群所有机器都需要升级内核

~~~powershell
# rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org

# yum -y install https://www.elrepo.org/elrepo-release-7.0-4.el7.elrepo.noarch.rpm

# yum --enablerepo="elrepo-kernel" -y install kernel-lt.x86_64

# awk -F \' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg

# grub2-set-default "CentOS Linux (5.4.204-1.el7.elrepo.x86_64) 7 (Core)"

# reboot
~~~



#### 3.3.3.3 kubernetes集群快速部署工具sealos准备

> 参考链接：https://github.com/labring/sealos



~~~powershell
[root@k8s-master01 ~]# wget https://github.com/labring/sealos/releases/download/v4.0.0/sealos_4.0.0_linux_amd64.tar.gz
~~~

~~~powershell
[root@k8s-master01 ~]# tar xf sealos_4.0.0_linux_amd64.tar.gz

[root@k8s-master01 ~]# ls
sealctl
sealos
~~~

~~~powershell
[root@k8s-master01 ~]# mv seal* /usr/bin/
~~~

~~~powershell
[root@k8s-master01 ~]# sealos version
{"gitVersion":"4.0.0","gitCommit":"7146cfe","buildDate":"2022-06-30T14:24:31Z","goVersion":"go1.17.11","compiler":"gc","platform":"linux/amd64"}
~~~



#### 3.3.3.4 kubernetes集群快速部署

~~~powershell
[root@k8s-master01 ~]# vim sealos-install-k8s.sh
sealos run labring/kubernetes:v1.24.0 labring/calico:v3.22.1     \
    --masters 192.168.10.31     \
    --nodes 192.168.10.32,192.168.10.33     \
    --passwd 123
~~~

~~~powershell
[root@k8s-master01 ~]# sh sealos-install-k8s.sh
~~~



#### 3.3.3.5 kubernetes集群可用性验证

~~~powershell
[root@k8s-master01 ~]# kubectl get nodes
NAME           STATUS   ROLES           AGE   VERSION
k8s-master01   Ready    control-plane   80s   v1.24.0
k8s-worker01   Ready    <none>          50s   v1.24.0
k8s-worker02   Ready    <none>          50s   v1.24.0
~~~

~~~powershell
[root@k8s-master01 ~]# kubectl get pod -A
NAMESPACE         NAME                                       READY   STATUS    RESTARTS      AGE
calico-system     calico-kube-controllers-6b44b54755-8ps2r   1/1     Running   0             57s
calico-system     calico-node-q6s64                          1/1     Running   0             57s
calico-system     calico-node-rflzc                          1/1     Running   0             57s
calico-system     calico-node-x2kv6                          1/1     Running   0             57s
calico-system     calico-typha-7df84cd569-sqmnb              1/1     Running   0             57s
calico-system     calico-typha-7df84cd569-ss49p              1/1     Running   0             48s
kube-system       coredns-6d4b75cb6d-g67cj                   1/1     Running   0             94s
kube-system       coredns-6d4b75cb6d-knxfk                   1/1     Running   0             94s
kube-system       etcd-k8s-master01                          1/1     Running   0             108s
kube-system       kube-apiserver-k8s-master01                1/1     Running   0             108s
kube-system       kube-controller-manager-k8s-master01       1/1     Running   0             108s
kube-system       kube-proxy-5ncc6                           1/1     Running   0             95s
kube-system       kube-proxy-rvntq                           1/1     Running   0             81s
kube-system       kube-proxy-s7gfr                           1/1     Running   0             81s
kube-system       kube-scheduler-k8s-master01                1/1     Running   0             108s
kube-system       kube-sealyun-lvscare-k8s-worker01          1/1     Running   0             74s
kube-system       kube-sealyun-lvscare-k8s-worker02          1/1     Running   0             72s
tigera-operator   tigera-operator-d7957f5cc-4twhq            1/1     Running   1 (60s ago)   79s
~~~



#### 3.3.3.6 安装ingress-nginx

通过配置ingress-nginx对象暴露服务

> 参考链接：https://github.com/kubernetes/ingress-nginx



```shell
[root@k8s-master01 ~]# curl -k https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/baremetal/deploy.yaml  -o deploy.yaml
```

```shell
[root@k8s-master1 ~]# ls
deploy.yaml
```

```shell
[root@k8s-master01 ~]# vim deploy.yaml

334 apiVersion: v1
335 kind: Service
336 metadata:
337   labels:
338     app.kubernetes.io/component: controller
339     app.kubernetes.io/instance: ingress-nginx
340     app.kubernetes.io/name: ingress-nginx
341     app.kubernetes.io/part-of: ingress-nginx
342     app.kubernetes.io/version: 1.3.0
343   name: ingress-nginx-controller
344   namespace: ingress-nginx
345 spec:
346   ipFamilies:
347   - IPv4
348   ipFamilyPolicy: SingleStack
349   ports:
350   - appProtocol: http
351     name: http
352     port: 80
353     protocol: TCP
354     targetPort: http
355   - appProtocol: https
356     name: https
357     port: 443
358     protocol: TCP
359     targetPort: https
360   selector:
361     app.kubernetes.io/component: controller
362     app.kubernetes.io/instance: ingress-nginx
363     app.kubernetes.io/name: ingress-nginx
364   type: LoadBalancer

把364行修改为LoadBalancer
365 ---
366 apiVersion: v1
367 kind: Service

```

```shell
[root@k8s-master01 ~]# kubectl apply -f deploy.yaml
```

```powershell
验证部署：
[root@k8s-master01 ~]# kubectl get pod -n ingress-nginx
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-rksbr        0/1     Completed   0          104s
ingress-nginx-admission-patch-zg8f8         0/1     Completed   3          104s
ingress-nginx-controller-6dc865cd86-7rvfx   0/1     Running     0          104s
[root@k8s-master01 ~]# kubectl get all -n ingress-nginx
NAME                                            READY   STATUS      RESTARTS   AGE
pod/ingress-nginx-admission-create-rksbr        0/1     Completed   0          111s
pod/ingress-nginx-admission-patch-zg8f8         0/1     Completed   3          111s
pod/ingress-nginx-controller-6dc865cd86-7rvfx   1/1     Running     0          111s

NAME                                         TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
service/ingress-nginx-controller             LoadBalancer   10.96.2.211   <pending>     80:32210/TCP,443:32004/TCP   111s
service/ingress-nginx-controller-admission   ClusterIP      10.96.0.20    <none>        443/TCP                      111s

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   1/1     1            1           111s

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-6dc865cd86   1         1         1       111s

NAME                                       COMPLETIONS   DURATION   AGE
job.batch/ingress-nginx-admission-create   1/1           43s        111s
job.batch/ingress-nginx-admission-patch    1/1           68s        111s
```



#### 3.3.3.7 安装metallb

MetalLB可以为kubernetes集群中的Service提供网络负载均衡功能。

MetalLB两大功能为:

- 地址分配，类似于DHCP
- 外部通告，一旦MetalLB为服务分配了外部IP地址，它就需要使群集之外的网络意识到该IP在群集中“存在”。MetalLB使用标准路由协议来实现此目的：ARP，NDP或BGP。

参考链接： https://metallb.universe.tf/installation/

```powershell
[root@k8s-master01 ~]# kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.12.1/manifests/namespace.yaml
[root@k8s-master01 ~]# kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.12.1/manifests/metallb.yaml
```

```powershell
[root@k8s-master01 ~]# vim metallb-conf.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.10.90-192.168.10.100
192.168.10.90-192.168.10.100是集群节点服务器IP同一段。      
[root@k8s-master01 ~]# kubectl apply -f metallb-conf.yaml
```

```powershell
验证配置：
[root@k8s-master01 ~]# kubectl get svc -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.96.2.211   192.168.10.90   80:32210/TCP,443:32004/TCP   7m49s
ingress-nginx-controller-admission   ClusterIP      10.96.0.20    <none>          443/TCP                      7m49s
ingress-nginx-controller已获取到metallb分配的LB-IP
```



### 3.3.4 ArgoCd安装

> 参考链接：https://argo-cd.readthedocs.io/en/stable/



#### 3.3.4.1 Arog介绍

Argo([https://argoproj.github.io/projects/argo](https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fargoproj.github.io%2Fprojects%2Fargo)) 项目是一组 Kubernetes 原生工具集合，用于运行和管理 Kubernetes 上的作业和应用程序。Argo 提供了一种在 Kubernetes 上创建工作和应用程序的三种计算模式 – 服务模式、工作流模式和基于事件的模式 。所有的 Argo 工具都实现为控制器和自定义资源。

**为什么选用Argo CD**

应用程序定义、配置和环境应该是声明性的，并受版本控制。应用程序部署和生命周期管理应该是自动化的、可审计的、易于理解的。



#### 3.3.4.2 Argo安装

```powershell
创建命名空间
[root@k8s-master01 ~]# kubectl create namespace argocd
namespace/argocd created
```

```powershell
由于后期使用ingress暴露服务，所以不建议直接使用，可下载下来，修改后再执行。
wget https://raw.githubusercontent.com/argoproj/argo-cd/v2.4.11/manifests/install.yaml
```

```powershell
在10184行下面添加如下内容：默认必须使用TLS证书才能访问，下面案例中，不使用TLS证书。
# vim install.yaml

10184       - command:
10185         - argocd-server
10186         - --insecure 添加此行内容
10187         env:
10188         - name: ARGOCD_SERVER_INSECURE
10189           valueFrom:
```

```shell
[root@k8s-master01 ~]# kubectl apply -f install.yaml -n argocd
```

```shell
[root@k8s-master01 ~]# kubectl get pod -n argocd
NAME                                                READY   STATUS             RESTARTS   AGE
argocd-application-controller-0                     1/1     Running            0          20m
argocd-applicationset-controller-7b74965f8c-zvxbc   1/1     Running            0          20m
argocd-dex-server-7f75d56bc6-xqzqj                  0/1     ImagePullBackOff   0          20m
argocd-notifications-controller-54dd686846-gknrm    1/1     Running            0          20m
argocd-redis-5dff748d9c-rknln                       0/1     ImagePullBackOff   0          20m
argocd-repo-server-5576f8d84b-sf24d                 1/1     Running            0          20m
argocd-server-54b95b8c6-7xxcf                       1/1     Running            0          20m
```



**注意：如果argocd-dex-server-7f75d56bc6-xqzqj，argocd-redis-5dff748d9c-rknln两个pod无法拉取镜像的话需要修改Argocd部署方式**

```powershell
以下操作在所有k8s集群服务器上操作
上传“资源”文件夹下的镜像tar包（redis.tar,dex.tar）至所有k8s集群服务器，然后导入镜像
# ctr -n=k8s.io image import redis.tar
# ctr -n=k8s.io image import dex.tar
# crictl ../../img/kubernetes/kubernetes_gitops list
IMAGE                                       TAG                 IMAGE ID            SIZE
docker.io/library/redis                     7.0.4-alpine        9192ed4e49554       29.7MB
ghcr.io/dexidp/dex                          v2.32.0             cee62569fdc12       80.5MB
sealos.hub:5000/calico/cni                  v3.22.1             2a8ef6985a3e5       80.5MB
sealos.hub:5000/calico/node                 v3.22.1             7a71aca7b60fc       69.6MB
sealos.hub:5000/calico/pod2daemon-flexvol   v3.22.1             17300d20daf93       8.46MB
sealos.hub:5000/coredns/coredns             v1.8.6              a4ca41631cc7a       13.6MB
sealos.hub:5000/etcd                        3.5.3-0             aebe758cef4cd       102MB
sealos.hub:5000/kube-apiserver              v1.24.0             529072250ccc6       33.8MB
sealos.hub:5000/kube-controller-manager     v1.24.0             88784fb4ac2f6       31MB
sealos.hub:5000/kube-proxy                  v1.24.0             77b49675beae1       39.5MB
sealos.hub:5000/kube-scheduler              v1.24.0             e3ed7dee73e93       15.5MB
sealos.hub:5000/pause                       3.7                 221177c6082a8       311kB
```

```powershell
修改ArgoCd安装资源清单文件中，这两个镜像的拉取策略
 9763       containers:
 9764       - command:
 9765         - /shared/argocd-dex
 9766         - rundex
 9767         image: ghcr.io/dexidp/dex:v2.32.0
 9768         imagePullPolicy: IfNotPresent
 修改9768行镜像拉取策略为IfNotPresent
 9769         name: dex
 9770         ports:
 9771         - containerPort: 5556
 9772         - containerPort: 5557
 9773         - containerPort: 5558

...
 9901       containers:
 9902       - args:
 9903         - --save
 9904         - ""
 9905         - --appendonly
 9906         - "no"
 9907         image: redis:7.0.4-alpine
 9908         imagePullPolicy: IfNotPresent
 修改9908行镜像拉取策略为IfNotPresent
 9909         name: redis
 9910         ports:
 9911         - containerPort: 6379

```

```powershell
然后重新应用ArgoCd部署资源清单文件
[root@k8s-master01 ~]# kubectl apply -f install.yaml -n argocd
```

```powershell
# kubectl get pods -n argocd
NAME                                                READY   STATUS    RESTARTS   AGE
argocd-application-controller-0                     1/1     Running   0          7m27s
argocd-applicationset-controller-7b74965f8c-7wsv6   1/1     Running   0          7m28s
argocd-dex-server-7f75d56bc6-j6bmk                  1/1     Running   0          7m28s
argocd-notifications-controller-54dd686846-kj579    1/1     Running   0          7m28s
argocd-redis-5dff748d9c-vxlbx                       1/1     Running   0          7m28s
argocd-repo-server-5576f8d84b-ztv4l                 1/1     Running   0          7m28s
argocd-server-54b95b8c6-rdc74                       1/1     Running   0          7m28s

# kubectl get svc -n argocd
NAME                                      TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
argocd-applicationset-controller          ClusterIP   10.96.2.13    <none>        7000/TCP,8080/TCP            7m36s
argocd-dex-server                         ClusterIP   10.96.3.96    <none>        5556/TCP,5557/TCP,5558/TCP   7m36s
argocd-metrics                            ClusterIP   10.96.1.126   <none>        8082/TCP                     7m36s
argocd-notifications-controller-metrics   ClusterIP   10.96.2.53    <none>        9001/TCP                     7m36s
argocd-redis                              ClusterIP   10.96.0.83    <none>        6379/TCP                     7m36s
argocd-repo-server                        ClusterIP   10.96.2.163   <none>        8081/TCP,8084/TCP            7m36s
argocd-server                             ClusterIP   10.96.3.54    <none>        80/TCP,443/TCP               7m36s
argocd-server-metrics                     ClusterIP   10.96.1.3     <none>        8083/TCP                     7m36s
```

#### 3.3.4.3 创建Argo Ingress对象

> 使用ingress，方便在k8s集群外访问。

```powershell
[root@k8s-master01 ~]# vim ingress-argocd.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
  namespace: argocd
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: argocd.kubemsb.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: argocd-server
            port:
              number: 80 	 	
```

```shell
[root@k8s-master01 ~]# kubectl apply -f ingress-argocd.yaml 
ingress.networking.k8s.io/ingress created
[root@k8s-master01 ~]# kubectl get ingress -n argocd
NAME      CLASS    HOSTS             ADDRESS         PORTS   AGE
ingress   <none>   argocd.alan.com   192.168.10.32   80      14s
```



#### 3.3.4.4 添加argocd.kubemsb.com域名解析

```powershell
在k8s-master01上添加hosts,通过argocd客户端修改argocd登录密码时，访问argocd
[root@k8s-master01 ~]# vim /etc/hosts
192.168.10.90 argocd.kubemsb.com
```



在pc添加hosts,访问argocdWeb界面



PC按住win+R键，输入drivers,点击确定

![配置hosts-01](../../img/kubernetes/kubernetes_gitops/配置hosts-01.png)

![配置hosts-02](../../img/kubernetes/kubernetes_gitops/配置hosts-02.png)

![配置hosts-03](../../img/kubernetes/kubernetes_gitops/配置hosts-03.png)

![配置hosts-04](../../img/kubernetes/kubernetes_gitops/配置hosts-04.png)



#### 3.3.4.5 访问Argo UI界面

浏览器输入argocd域名：http://argocd.kubemsb.com

![登录argocd-01](../../img/kubernetes/kubernetes_gitops/登录argocd-01.png)



#### 3.3.4.6 获取登录密码

> 用户名为：admin，密码需要查询后解密方可知晓

~~~powershell
查看加密后的密码
[root@k8s-master01 ~]# kubectl get secret argocd-initial-admin-secret -o yaml -n argocd
apiVersion: v1
data:
  password: clpYZ3d4dkY4TGlmMTV4Qw==  此处为加密后密码，需要解密才能使用。
kind: Secret
metadata:

~~~

~~~powershell
把加密后的密码进行解密
[root@k8s-master01 ~]# echo clpYZ3d4dkY4TGlmMTV4Qw== | base64 -d
g50ElRK4jlYElORK 此为真正的密码
~~~

~~~powershell
或使用下面命令直接获取登录密码：
[root@k8s-master01 ~]# kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
g50ElRK4jlYElORK
~~~



重新登录argo cd:http://argocd.kubemsb.com

![登录argocd-02](../../img/kubernetes/kubernetes_gitops/登录argocd-02.png)



ArgoCd web界面

![argocd-ui](../../img/kubernetes/kubernetes_gitops/argocd-ui.png)



#### 3.3.4.7 客户端安装

> 可通过客户端登录Argocd命令行或直接修改admin登录密码等

参考链接：https://github.com/argoproj/argo-cd/releases

```powershell
下载argocd客户端软件
[root@k8s-master01 ~]# wget https://github.com/argoproj/argo-cd/releases/download/v2.4.11/argocd-linux-amd64
```

~~~powershell
安装Argocd客户端软件
[root@k8s-master01 ~]# chmod +x argocd-linux-amd64
[root@k8s-master01 ~]# mv argocd-linux-amd64 /usr/local/bin/argocd
~~~

~~~powershell
使用argocd version查看版本相关信息
[root@k8s-master01 ~]# argocd version
argocd: v2.4.11+3d9e9f2
  BuildDate: 2022-08-22T09:35:38Z
  GitCommit: 3d9e9f2f95b7801b90377ecfc4073e5f0f07205b
  GitTreeState: clean
  GoVersion: go1.18.5
  Compiler: gc
  Platform: linux/amd64
WARN[0000] Failed to invoke grpc call. Use flag --grpc-web in grpc calls. To avoid this warning message, use flag --grpc-web. 
argocd-server: v2.4.11+3d9e9f2
~~~

~~~powershell
在命令行登录

[root@k8s-master01 ~]# argocd login argocd.alan.com
WARNING: server certificate had error: x509: certificate is valid for ingress.local, not argocd.alan.com. Proceed insecurely (y/n)? y
WARN[0002] Failed to invoke grpc call. Use flag --grpc-web in grpc calls. To avoid this warning message, use flag --grpc-web. 
Username: admin
Password: 输入初始密码
'admin:login' logged in successfully
Context 'argocd.alan.com' updated
~~~

~~~powershell
修改admin管理员密码

[root@k8s-master01 ~]# argocd account update-password
WARN[0000] Failed to invoke grpc call. Use flag --grpc-web in grpc calls. To avoid this warning message, use flag --grpc-web.
*** Enter password of currently logged in user (admin): 输入当前密码，可直接复制粘贴
*** Enter new password for user admin: 12345678 必须为8-32位
*** Confirm new password for user admin: 密码确认
Password updated 更新成功，可使用此密码登录WEB UI界面。
Context 'argocd.alan.com' updated
~~~

~~~powershell
登出argocd
[root@k8s-master01 ~]# argocd logout argocd.alan.com
Logged out from 'argocd.alan.com'
~~~



重新登录argocd:http://argocd.kubemsb.com

![重新登录argocd](../../img/kubernetes/kubernetes_gitops/重新登录argocd.png)



## 3.4 工具集成配置

### 3.4.1 配置主机使用harbor

#### 3.4.1.1 harbor

~~~powershell
[root@harbor ~]# vim /etc/docker/daemon.json
{
        "insecure-registries": ["http://192.168.10.21"],
         "registry-mirrors": ["https://a237mf1e.mirror.aliyuncs.com"]
}
~~~

~~~powershell
[root@harbor ~]# docker-compose down
~~~

~~~powershell
[root@harbor ~]# systemctl restart docker
~~~

~~~powershell
[root@harbor ~]# docker-compose up -d
~~~



#### 3.4.1.2 k8s

```powershell
[root@k8s-master01 ~]# cd /etc/containerd/
[root@k8s-master01 containerd]# vim config.toml
添加如下内容
[plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.10.21".auth]
            username = "admin"
            password = "Harbor12345"
            
[root@k8s-master01 containerd]# cd /etc/containerd/certs.d/
[root@k8s-master01 certs.d]# mkdir 192.168.10.21
[root@k8s-master01 certs.d]# cp sealos.hub\:5000/hosts.toml 192.168.10.21/
[root@k8s-master01 certs.d]# cd 192.168.10.21/
[root@k8s-master01 192.168.10.21]# vim hosts.toml
server = "http://192.168.10.21"

[host."http://192.168.10.21"]
  capabilities = ["pull", "resolve", "push"]
  skip_verify = true
 
[root@k8s-master01 192.168.10.21]# systemctl restart containerd
```

```powershell
将私有仓库连接配置文件同步到k8s其他节点
[root@k8s-master01 certs.d]# cd /etc/containerd/certs.d/
[root@k8s-master01 certs.d]# scp -r 192.168.10.21/  k8s-worker01:/etc/containerd/certs.d/
[root@k8s-master01 certs.d]# scp -r 192.168.10.21/  k8s-worker02:/etc/containerd/certs.d/
[root@k8s-master01 certs.d]# cd /etc/containerd/
[root@k8s-master01 containerd]# scp -r config.toml  k8s-worker01:/etc/containerd/config.toml
[root@k8s-master01 containerd]# scp -r config.toml  k8s-worker02:/etc/containerd/config.toml

k8s其他节点重启containerd
[root@k8s-worker01 ~]# systemctl restart containerdcd 
[root@k8s-worker02 ~]# systemctl restart containerd
```



#### 3.4.1.3 gitlab

~~~powershell
[root@gitlab ~]# vim /etc/docker/daemon.json
{
        "insecure-registries": ["http://192.168.10.21"],
         "registry-mirrors": ["https://a237mf1e.mirror.aliyuncs.com"]
}
~~~

~~~powershell
[root@harbor ~]# systemctl restart docker
~~~



### 3.4.2 Kustomize安装

> 安装参考链接：https://kubectl.docs.kubernetes.io/installation/kustomize/

> 使用参考链接：https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/

当开发者push代码以后，gitlab-runner会在gitlab-ce服务器执行流水线里定义的具体操作，流水线步骤里定义了gitlab-runner通过kustomize客户端工具修改应用部署资源清单文件里的容器镜像版本，并重新push代码到代码仓库，所以需要在gitlab-ce服务器安装kustomize



```powershell
[root@gitlab ~]# curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
{Version:kustomize/v4.5.7 GitCommit:56d82a8378dfc8dc3b3b1085e5a6e67b82966bd7 BuildDate:2022-08-02T16:35:54Z GoOs:linux GoArch:amd64}
kustomize installed to //root/kustomize
[root@gitlab ~]# mv /root/kustomize /usr/bin/
```



### 3.4.3 runner安装

#### 3.4.3.1 runner介绍

GitLab Runner是一个开源项目，用于运行您的作业并将结果发送回GitLab。它与GitLab CI一起使用，GitLab CI是GitLab随附的开源持续集成服务，用于协调作业。相当于流水线工人。

#### 3.4.3.2 runner安装

![安装runner-01](../../img/kubernetes/kubernetes_gitops/安装runner-01.png)

![安装runner-02](../../img/kubernetes/kubernetes_gitops/安装runner-02.png)

![安装runner-03](../../img/kubernetes/kubernetes_gitops/安装runner-03.png)

![安装runner-04](../../img/kubernetes/kubernetes_gitops/安装runner-04.png)

![安装runner-05](../../img/kubernetes/kubernetes_gitops/安装runner-05.png)

![安装runner-06](../../img/kubernetes/kubernetes_gitops/安装runner-06.png)

![安装runner-07](../../img/kubernetes/kubernetes_gitops/安装runner-07.png)

![安装runner-08](../../img/kubernetes/kubernetes_gitops/安装runner-08.png)

![安装runner-09](../../img/kubernetes/kubernetes_gitops/安装runner-09.png)

```powershell
[root@gitlab ~]# curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
[root@gitlab ~]# chmod +x /usr/local/bin/gitlab-runner
[root@gitlab ~]# useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash #添加gitlab-runner用户
[root@gitlab ~]# gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner #配置runner工作目录
[root@gitlab ~]# gitlab-runner start
[root@gitlab ~]# gitlab-runner register #添加runner实例
Runtime platform                                    arch=amd64 os=linux pid=25519 revision=bbcb5aba version=15.3.0
Running in system-mode.                            
                                                   
Enter the GitLab instance URL (for example, https://gitlab.com/):
http://192.168.10.11/  #gitlab地址
Enter the registration token:
GR1348941CGPH49ziznkXMcX6sumR #runner配置页面复制的仓库token
Enter a description for the runner:
[gitlab]: apidemo #runner实例描述，这里设置为apidemo，意为这个runner为apidemo项目的runner
Enter tags for the runner (comma-separated):

Enter optional maintenance note for the runner:

Registering runner... succeeded                     runner=GR1348941CGPH49zi
Enter an executor: virtualbox, docker-ssh+machine, custom, docker, shell, docker+machine, kubernetes, docker-ssh, parallels, ssh:
shell
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
 
Configuration (with the authentication token) was saved in "/etc/gitlab-runner/config.toml"
启动runner
[root@gitlab ~]# gitlab-runner run &
```

```powershell
配置gitlab-runner用户能使用docker
[root@gitlab ~]# usermod -G docker gitlab-runner
[root@gitlab ~]# grep docker /etc/group
docker:x:989:gitlab-runner
```

```powershell
为runner配置构建目录
[root@gitlab gitlab-runner]# cd /etc/gitlab-runner/
[root@gitlab gitlab-runner]# vim config.toml 
concurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "apidemo"
  url = "http://192.168.10.11/"
  id = 2
  token = "DGzeaCQPGvQHjbH5kUt2"
  token_obtained_at = 2022-09-04T11:46:00Z
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "shell"
  [runners.custom_build_dir]
    enabled = true
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
    
输出如下内容表示配置生效
Configuration loaded                                builds=0
```



#### 3.4.3.3 为项目配置runner



![image-20220907132058971](../../img/kubernetes/kubernetes_gitops/image-20220907132058971.png)



![runner配置01](../../img/kubernetes/kubernetes_gitops/runner配置01.png)

![runner配置02](../../img/kubernetes/kubernetes_gitops/runner配置02.png)



## 3.5 项目代码发布

> 本次项目代码发布使用自己pc作为开发者环境



### 3.5.1 获取项目源码

项目源代码在“资源”目录下apidemo



### 3.5.2 go环境安装

> 安装git工具,这个是重点

进入“资源”目录下，双击”go1.17.11.windows-386“安装程序，安装go



go安装完成后，配置环境变量





![image-20220907134513508](../../img/kubernetes/kubernetes_gitops/image-20220907134513508.png)

![配置go环境变量-01](../../img/kubernetes/kubernetes_gitops/配置go环境变量-01.png)





![配置go环境变量-02](../../img/kubernetes/kubernetes_gitops/配置go环境变量-02.png)

![配置go环境变量-03](../../img/kubernetes/kubernetes_gitops/配置go环境变量-03.png)



### 3.5.3 安装goIDE(goland)

进入“资源”目录下，双击”goland“安装程序，安装goland



### 3.5.4 IDE中打开项目

#### 3.5.4.1 打开goland，选择项目

![打开go项目-01](../../img/kubernetes/kubernetes_gitops/打开go项目-01.png)



![打开go项目-02](../../img/kubernetes/kubernetes_gitops/打开go项目-02.png)



#### 3.5.4.2 项目结构

![项目结构](../../img/kubernetes/kubernetes_gitops/项目结构.png)



### 3.5.5 编写Dockerfile文件

```dockerfile
FROM centos:centos7 #基础镜像

ADD ./apidemo /root #将编译后的可执行文件添加至/root目录下

EXPOSE 10088  #镜像实例为容器时，容器暴露的端口

CMD ["/root/apidemo"] #镜像实例为容器时，容器执行的命令
```



### 3.5.6 编写应用部署资源清单文件

#### 3.5.6.1 编写项目Deployment资源清单文件

```yaml
apiVersion: apps/v1 #k8s资源版本
kind: Deployment #k8s资源类型
metadata:
  namespace: apidemo #资源所在命名空间
  name: apidemo #资源名称
  labels:
    app: apidemo
spec:
  replicas: 4 #资源副本数
  selector:
    matchLabels:
      app: apidemo
  template:
    metadata:
      name: apidemo
      labels:
        app: apidemo
    spec:
      containers:
        - name: apidemo
          image: 192.168.10.21/apidemo/apidemo:v3.0 #容器镜像，会通过kustomize进行修改，版本信息会随项目提交而发生变化
          imagePullPolicy: Always
          ports:
            - containerPort: 10088 #容器端口
```



#### 3.5.6.2 编写项目Svc资源清单文件

```yaml
apiVersion: v1 #k8s资源版本
kind: Service #k8s资源类型
metadata:
  namespace: apidemo #资源所在命名空间
  name: apidemo #资源名称
  labels:
    app: apidemo
spec:
  type: NodePort #svc类型
  ports:
    - name: apidemoport
      port: 10088 #svc集群内访问端口
      targetPort: 10088 #容器端口
      nodePort: 30080 #nodePort暴露端口
  selector:
    app: apidemo
```



#### 3.5.6.3 编写ingress资源清单文件

```yaml
apiVersion: networking.k8s.io/v1 #k8s资源版本
kind: Ingress #k8s资源类型
metadata:
  name: ingress-apidemo                    #自定义ingress名称
  namespace: apidemo
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: apidemo.alan.com                   # 自定义域名
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: apidemo     # 对应上面创建的service名称
                port:
                  number: 10088  # 对应上面创建的service端口
```



#### 3.5.6.4 编写kustomization.yaml文件，管理资源清单文件

```yaml
resources: #依赖的资源清单文件
- apidemo-deployment.yaml
- apidemo-service.yaml
- apidemo-ingress.yaml
apiVersion: kustomize.config.k8s.io/v1beta1 #k8s资源版本
kind: Kustomization  #k8s资源类型
```



### 3.5.7 编写gitlabCi流水线文件(.gitlab-ci.yml)

注意：此文件必须放在项目根目录下

```yaml
workflow:  #设置工作流
  rules:
    - if: $CI_COMMIT_BRANCH == 'master'  #如果代码分支为master则使用以下环境变量
      variables:
        registry: $ci_registry  #镜像仓库地址，gitlab配置全局变量
        registry_name: $ci_registry_name #镜像仓库登录用户，gitlab配置全局变量
        registry_passwd: $ci_registry_passwd #镜像仓库登录密码，gitlab配置全局变量

variables:  #
  app_name: $CI_PROJECT_NAME #项目名，gitlab项目仓库名，gitlab内置变量
  app_version: $CI_COMMIT_SHORT_SHA #app版本号，每次push项目的编号，后面会作为镜像版本，gitlab内置变量
  namespace: $CI_PROJECT_NAMESPACE #项目所在组，gitlab内置变量
  GIT_CLONE_PATH: '$CI_BUILDS_DIR/$CI_JOB_ID/$CI_PROJECT_NAME' #定义gitlab-runner,clone代码的位置

stages: #定义流水线有几个阶段
  - build #编译阶段
  - deploy #部署阶段

build code: #自定义的步骤名称
  stage: build #此步骤为build阶段
  script:
    - go build #具体执行的命令，此处为编译go项目，编译完成会产生apidemo可执行文件
  artifacts: #gitlab流水线文件内置关键字，作用为保留制品
    paths: #保留制品所在位置
      - apidemo #当前步骤需要保留的制品文件，提供个下一步骤使用

docker build:
  stage: build
  script:
    - docker build -t $app_name:$app_version .  #此步骤通过项目源码内的Dockerfile文件编译docker镜像
  needs: #gitlab流水线文件内置关键字，作用为此步骤所依赖的步骤，只有当被依赖的步骤完成后，此步骤才会执行
    - build code #此步骤被依赖的步骤

docker tag:
  stage: build
  script:
    - docker tag $app_name:$app_version $registry/$app_name/$app_name:$app_version #此步骤为上一步骤生成的镜像打上仓库标签
  needs:
    - docker build

docker push:
  stage: build
  script:
    - docker login -u $ci_registry_name -p $ci_registry_passwd $ci_registry #登录镜像仓库
    - docker push $registry/$app_name/$app_name:$app_version #推送镜像至镜像仓库
    - docker logout #登出镜像仓库
  needs:
    - docker tag

deploy dev:
  stage: deploy
  before_script: #gitlab流水线内置关键字，作用为在该步骤执行流水线操作前所依赖步骤。这里需要runner通过修改kustomization.yaml文件，来修改镜像版本信息
  #所以需要在修改镜像版本信息后，重新push代码
    - git remote set-url origin http://${CI_USERNAME}:${CI_PASSWORD}@192.168.10.11/apidemo/apidemo.git #设置远程仓库地址，CI_USERNAME为代码仓库登录用户名，需要在gitlab自定义全局变量，CI_PASSWORD为代码仓库登录密码，需要在gitlab自定义全局变量
    - git config --global user.name "Administrator" #配置本地仓库用户名信息
    - git config --global user.email "admin@example.com" #配置本地仓库邮箱信息
  script:
    - git checkout -B master #切换项目分支
    - cd base #进入资源清单文件目录
    - kustomize edit set image 192.168.10.21/apidemo/apidemo:v3.0=$registry/$app_name/$app_name:$app_version #runner通过kustomize客户端工具修改镜像版本信息
    - cat kustomization.yaml
    - git commit -am '[skip ci] DEV image update'  #git 本地提交，注意“skip ci”为gitlab流水线文件内置关键字，作用为跳过ci流水线操作，未设置可能导致流水线进入死循环
    - git push origin master #重新提交修改镜像版本后的代码
  needs:
    - docker push
```



### 3.5.8 gitlab全局变量配置![gitlab配置环境变量-01](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-01.png)

![gitlab配置环境变量-02](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-02.png)

![gitlab配置环境变量-03](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-03.png)

![gitlab配置环境变量-04](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-04.png)

![gitlab配置环境变量-05](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-05.png)





![gitlab配置环境变量-06](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-06.png)



![gitlab配置环境变量-07](../../img/kubernetes/kubernetes_gitops/gitlab配置环境变量-07.png)



### 3.5.9 开发者环境添加远程地址仓库

![本地添加远程仓库](../../img/kubernetes/kubernetes_gitops/本地添加远程仓库.png)

![本地添加远程仓库-02](../../img/kubernetes/kubernetes_gitops/本地添加远程仓库-02.png)





### 3.5.10 在ArgoCd中创建项目

![argo添加项目-01](../../img/kubernetes/kubernetes_gitops/argo添加项目-01.png)





![argo添加项目-02](../../img/kubernetes/kubernetes_gitops/argo添加项目-02.png)



![argo添加代码仓库-01](../../img/kubernetes/kubernetes_gitops/argo添加代码仓库-01.png)

![argo添加代码仓库-02](../../img/kubernetes/kubernetes_gitops/argo添加代码仓库-02.png)



### 3.5.11 ArgoCd中项目配置

![argo项目配置01](../../img/kubernetes/kubernetes_gitops/argo项目配置01.png)

![argo项目配置02](../../img/kubernetes/kubernetes_gitops/argo项目配置02.png)

![argo项目配置03](../../img/kubernetes/kubernetes_gitops/argo项目配置03.png)





![argo项目配置04](../../img/kubernetes/kubernetes_gitops/argo项目配置04.png)



### 3.5.12 ArgoCd中应用配置



![image-20220907224523395](../../img/kubernetes/kubernetes_gitops/image-20220907224523395.png)







![image-20220907224746513](../../img/kubernetes/kubernetes_gitops/image-20220907224746513.png)



![image-20220907224925515](../../img/kubernetes/kubernetes_gitops/image-20220907224925515.png)



![image-20220907224948483](../../img/kubernetes/kubernetes_gitops/image-20220907224948483.png)



![image-20220907225007964](../../img/kubernetes/kubernetes_gitops/image-20220907225007964.png)





### 3.5.13 本地提交代码



![本地提交代码](../../img/kubernetes/kubernetes_gitops/本地提交代码.png)



### 3.5.14 查看pipeline执行情况

![查看ci](../../img/kubernetes/kubernetes_gitops/查看ci.png)



### 3.5.15 查看ArgoCd执行情况

![查看cd](../../img/kubernetes/kubernetes_gitops/查看cd.png)



### 3.5.16 查看应用部署情况

```shell
[root@k8s-master01 ~]# kubectl get all -n apidemo
NAME                           READY   STATUS    RESTARTS   AGE
pod/apidemo-75f68d8584-6ttqz   1/1     Running   0          55s
pod/apidemo-75f68d8584-bznbr   1/1     Running   0          53s
pod/apidemo-75f68d8584-fbjtw   1/1     Running   0          50s
pod/apidemo-75f68d8584-vvv9m   1/1     Running   0          55s

NAME              TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)           AGE
service/apidemo   NodePort   10.96.1.218   <none>        10088:30080/TCP   12m

NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/apidemo   4/4     4            4           12m

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/apidemo-596865b76    0         0         0       6m22s
replicaset.apps/apidemo-75f68d8584   4         4         4       55s
replicaset.apps/apidemo-776c87dfb8   0         0         0       4m11s
replicaset.apps/apidemo-f5dd44695    0         0         0       12m
访问应用
[root@k8s-master01 ~]# curl http://apidemo.alan.com/info
{"version":"1.1.1"}
```



## 3.6 Argo CD项目回滚



![image-20220907230140527](../../img/kubernetes/kubernetes_gitops/image-20220907230140527.png)





![image-20220907230348772](../../img/kubernetes/kubernetes_gitops/image-20220907230348772.png)



![image-20220907230413912](../../img/kubernetes/kubernetes_gitops/image-20220907230413912.png)





![image-20220907230610324](../../img/kubernetes/kubernetes_gitops/image-20220907230610324.png)

![image-20220907230632019](../../img/kubernetes/kubernetes_gitops/image-20220907230632019.png)



![image-20220907230654857](../../img/kubernetes/kubernetes_gitops/image-20220907230654857.png)



![image-20220907230703654](../../img/kubernetes/kubernetes_gitops/image-20220907230703654.png)



![image-20220907230715094](../../img/kubernetes/kubernetes_gitops/image-20220907230715094.png)



![image-20220907230729871](../../img/kubernetes/kubernetes_gitops/image-20220907230729871.png)