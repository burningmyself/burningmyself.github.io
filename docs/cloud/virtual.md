# 虚拟化技术

# 一、计算机系统虚拟化定义

## 1.1 物理机向虚拟机演进过程

当物理机资源足够某一应用使用，并有多余的富余时，可以把多余的资源提供给其它的应用使用，这时就需要一种计算资源“打包技术”，2001年vmware公司提出来虚拟机，即在一台物理机上运行多个虚拟机，让不同或相同的应用使用虚拟机运行，这就达到了共享一台物理机计算资源的方式。

![image-20220110200045146](../img/virtual/image-20220110200045146.png)





![image-20220110200109732](../img/virtual/image-20220110200109732.png)







## 1.2 计算机系统虚拟化定义

计算机系统虚拟化就是对计算机资源的抽像。在物理机中创建软件或虚拟表示形式的应用、服务器、存储和网络，以减少 IT 开销，同时提高效率和敏捷性。

虚拟化可以提高 IT 敏捷性、灵活性和可扩展性，同时大幅节约成本。更高的工作负载移动性、更高的性能和资源可用性、自动化运维 - 这些都是虚拟化的优势，虚拟化技术可以使 IT 部门更轻松地进行管理以及降低拥有成本和运维成本。



# 二、虚拟化技术分类

## 2.1 虚拟化管理程序 Hypervisor（VMM）

一种运行在物理机和虚拟机操作系统之间的中间==软件层==，可以允许多个操作系统和应用共享硬件，即虚拟机监视器，也可称之为VMM。



![image-20220110155353456](../img/virtual/image-20220110155353456.png)



## 2.2 虚拟化管理程序 Hypervisors作用

  Hypervisor是所有虚拟化技术的核心。 非中断地支持多工作负载迁移的能力是Hypervisor的基本功能。

   Hypervisors是一种在虚拟环境中的“元”操作系统。他们可以访问服务器上包括磁盘和内存在内的所有物理设备。Hypervisors不但协调着这些硬件资源的访问，而且在各个虚拟机之间施加防护。当服务器启动并执行Hypervisor时，它会加载所有虚拟机客户端的操作系统同时会分配给每一台虚拟机适量的内存，CPU，网络和磁盘。



## 2.3 虚拟化管理程序Hypervisors分类

目前市场上各种x86 管理程序(hypervisor)的架构存在差异，三个最主要的架构类别包括：

### 2.3.1 半虚拟化（Hypervisor Type I）

虚拟机直接运行在系统硬件上，创建硬件全仿真实例，被称为“裸机”型。 
裸机型在虚拟化中Hypervisor直接管理调用硬件资源，不需要底层操作系统，也可以将Hypervisor看作一个很薄的操作系统。这种方案的性能处于主机虚拟化与操作系统虚拟化之间。

例如：Xen

![image-20220110194319016](../img/virtual/image-20220110194319016.png)







![image-20220110194348034](../img/virtual/image-20220110194348034.png)







### 2.3.2 硬件辅助全虚拟化(HypervisorTyep II)

虚拟机运行在传统操作系统(HOST OS)上，同样创建的是硬件全仿真实例，被称为“托管（宿主）”型。托管型/主机型Hypervisor运行在基础操作系统上，构建出一整套虚拟硬件平台（CPU/Memory/Storage/Adapter），使用者根据需要安装新的操作系统和应用软件，底层和上层的操作系统可以完全无关化，如Windows运行Linux操作系统。主机虚拟化中VM的应用程序调用硬件资源时需要经过:VM内核->Hypervisor->主机内核，因此相对来说，性能是三种虚拟化技术中最差的。

例如：kvm



![image-20220110194527729](../img/virtual/image-20220110194527729.png)





![image-20220110194550287](../img/virtual/image-20220110194550287.png)



### 2.3.3 软件全虚拟化(Hypervisor Type III)

所谓的软件全虚拟化，即非硬件辅助全虚拟化，模拟CPU让VM使用，效率低，例如：QEMU



### 2.3.4 操作系统虚拟化

称为轻量级虚拟化，允许操作系统内核拥有彼此隔离和分割的多用户空间实例（instance），这些实例也被称之为容器。其是基于Linux内核中的namespace,cgroup实现

例如：LXC,Docker



![image-20220110195509448](../img/virtual/image-20220110195509448.png)









# 三、虚拟化技术管理工具



![image-20220110151928337](../img/virtual/image-20220110151928337.png)



# 四、虚拟机管理工具 VMware Workstation pro

## 4.1 安装前准备

- 创建安装目录



![image-20220111141447039](../img/virtual/image-20220111141447039.png)



- 准备操作系统ISO镜像文件



![image-20220111141519483](../img/virtual/image-20220111141519483.png)





- 虚拟机软件准备





![image-20220111141943956](../img/virtual/image-20220111141943956.png)







## 4.2 安装Linux操作系统虚拟机

### 4.2.1 创建虚拟机



![image-20220111152601888](../img/virtual/image-20220111152601888.png)







![image-20220111142255315](../img/virtual/image-20220111142255315.png)



![image-20220111142334823](../img/virtual/image-20220111142334823.png)





![image-20220111142511897](../img/virtual/image-20220111142511897.png)





![image-20220111142535948](../img/virtual/image-20220111142535948.png)



![image-20220111142606674](../img/virtual/image-20220111142606674.png)



![image-20220111142811078](../img/virtual/image-20220111142811078.png)





![image-20220111142844069](../img/virtual/image-20220111142844069.png)



![image-20220111142910855](../img/virtual/image-20220111142910855.png)





![image-20220111142933018](../img/virtual/image-20220111142933018.png)



![image-20220111142952608](../img/virtual/image-20220111142952608.png)





![image-20220111143014339](../img/virtual/image-20220111143014339.png)





![image-20220111143033619](../img/virtual/image-20220111143033619.png)





![image-20220111143138494](../img/virtual/image-20220111143138494.png)



![image-20220111143204016](../img/virtual/image-20220111143204016.png)





![image-20220111143237484](../img/virtual/image-20220111143237484.png)







### 4.2.2 安装操作系统



![image-20220111143507489](../img/virtual/image-20220111143507489.png)







![image-20220111143631795](../img/virtual/image-20220111143631795.png)





![image-20220111143747401](../img/virtual/image-20220111143747401.png)



![image-20220111143830169](../img/virtual/image-20220111143830169.png)



![image-20220111144005531](../img/virtual/image-20220111144005531.png)





![image-20220111144154956](../img/virtual/image-20220111144154956.png)



![image-20220111144254002](../img/virtual/image-20220111144254002.png)





![image-20220111144409337](../img/virtual/image-20220111144409337.png)





![image-20220111144453627](../img/virtual/image-20220111144453627.png)





![image-20220111144547786](../img/virtual/image-20220111144547786.png)



![image-20220111144638457](../img/virtual/image-20220111144638457.png)



![image-20220111144720723](../img/virtual/image-20220111144720723.png)



![image-20220111144745098](../img/virtual/image-20220111144745098.png)



![image-20220111144823978](../img/virtual/image-20220111144823978.png)





![image-20220111145005563](../img/virtual/image-20220111145005563.png)









![image-20220111144921587](../img/virtual/image-20220111144921587.png)



![image-20220111145053730](../img/virtual/image-20220111145053730.png)





![image-20220111145809091](../img/virtual/image-20220111145809091.png)





![image-20220111145937589](../img/virtual/image-20220111145937589.png)







![image-20220111150021029](../img/virtual/image-20220111150021029.png)



![image-20220111150042642](../img/virtual/image-20220111150042642.png)





![image-20220111150130846](../img/virtual/image-20220111150130846.png)



![image-20220111150430571](../img/virtual/image-20220111150430571.png)



![image-20220111150452529](../img/virtual/image-20220111150452529.png)





![image-20220111150516285](../img/virtual/image-20220111150516285.png)



![image-20220111150542618](../img/virtual/image-20220111150542618.png)



![image-20220111150600954](../img/virtual/image-20220111150600954.png)



![image-20220111150708634](../img/virtual/image-20220111150708634.png)



![image-20220111150735190](../img/virtual/image-20220111150735190.png)







## 4.3 VMware Workstation虚拟机网络设置



![image-20220111152914753](../img/virtual/image-20220111152914753.png)





![image-20220111153030283](../img/virtual/image-20220111153030283.png)





~~~powershell
# vim /etc/sysconfig/network-scripts/ifcfg-ens33 
# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="none"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="c8838cc3-83d3-45fb-8ddd-863e5f6c7c2c"
DEVICE="ens33"
ONBOOT="yes"
IPADDR="192.168.10.130"
PREFIX="24"
GATEWAY="192.168.10.2"
DNS1="119.29.29.29"
~~~



![image-20220111153523824](../img/virtual/image-20220111153523824.png)





~~~powershell
# systemctl restart network
# ip a s ens33
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:2d:2e:6b brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.130/24 brd 192.168.10.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::81a2:2c89:8b27:a756/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
~~~



~~~powershell
ping网关，检查网络连通性
# ping 192.168.10.2
PING 192.168.10.2 (192.168.10.2) 56(84) bytes of data.
64 bytes from 192.168.10.2: icmp_seq=1 ttl=128 time=0.186 ms
64 bytes from 192.168.10.2: icmp_seq=2 ttl=128 time=0.369 ms
64 bytes from 192.168.10.2: icmp_seq=3 ttl=128 time=0.145 ms
~~~



~~~powershell
ping互联网服务器，检查网络连通性
# ping -c 4 www.baidu.com
PING www.a.shifen.com (110.242.68.4) 56(84) bytes of data.
64 bytes from 110.242.68.4 (110.242.68.4): icmp_seq=1 ttl=128 time=11.7 ms
64 bytes from 110.242.68.4 (110.242.68.4): icmp_seq=2 ttl=128 time=11.6 ms
64 bytes from 110.242.68.4 (110.242.68.4): icmp_seq=3 ttl=128 time=12.1 ms
64 bytes from 110.242.68.4 (110.242.68.4): icmp_seq=4 ttl=128 time=11.6 ms

--- www.a.shifen.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.629/11.778/12.118/0.239 ms

~~~





## 4.4 VMware Workstation虚拟机系统安全设置及更新

### 4.4.1 关闭防火墙

~~~powershell
关闭防火墙
# systemctl stop firewalld
设置防火墙为开机禁用状态
# systemctl disable firewalld
~~~





### 4.4.2 关闭SELINUX

~~~powershell
关闭SELINUX后，必须重启系统才能使其修改生效。
# sed -ri 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
~~~



~~~powershell
确认是否关闭
# cat /etc/selinux/config

......
SELINUX=disabled
......
~~~



### 4.4.3 更新系统



~~~powershell
更新系统
# yum -y update
~~~



~~~powershell
重启操作系统
# reboot
~~~





## 4.5 VMware Workstation虚拟机快照设置

> 为了防止部署应用过程中多次使用同一环境，可以考虑使用虚拟机快照功能。建议关闭虚拟机后再做快照。



![image-20220111153951801](../img/virtual/image-20220111153951801.png)



![image-20220111154024872](../img/virtual/image-20220111154024872.png)





![image-20220111154107331](../img/virtual/image-20220111154107331.png)





![image-20220111154248279](../img/virtual/image-20220111154248279.png)





## 4.6 VMware Workstation Pro模板机

> 在后期应用中，可能会同时需要多台虚拟机，建议使用虚拟机模板机创建虚拟机使用。虚拟机模板机安装完成后，关闭防火墙、关闭SELINUX、更新操作系统即可，不需要配置IP地址，后期使用过程中再设置IP地址。



### 4.6.1 新安装的虚拟机硬盘文件注意事项



![image-20220111143138494](../img/virtual/image-20220111143138494.png)



### 4.6.2 利用模板机快速创建虚拟机

![image-20220111154718283](../img/virtual/image-20220111154718283.png)





![image-20220111154818419](../img/virtual/image-20220111154818419.png)







![image-20220111154951242](../img/virtual/image-20220111154951242.png)



![image-20220111155010629](../img/virtual/image-20220111155010629.png)



![image-20220111155037173](../img/virtual/image-20220111155037173.png)





![image-20220111155059999](../img/virtual/image-20220111155059999.png)







![image-20220111155159931](../img/virtual/image-20220111155159931.png)



![image-20220111155237982](../img/virtual/image-20220111155237982.png)





![image-20220111155300651](../img/virtual/image-20220111155300651.png)





![image-20220111155316649](../img/virtual/image-20220111155316649.png)



![image-20220111155338372](../img/virtual/image-20220111155338372.png)



![image-20220111155402773](../img/virtual/image-20220111155402773.png)



![image-20220111155423525](../img/virtual/image-20220111155423525.png)





![image-20220111155445712](../img/virtual/image-20220111155445712.png)



![image-20220111155549589](../img/virtual/image-20220111155549589.png)



![image-20220111155615710](../img/virtual/image-20220111155615710.png)







![image-20220111155640584](../img/virtual/image-20220111155640584.png)







# 五、虚拟机管理工具KVM

## 5.1  KVM系统需求

~~~powershell
官方推荐宿主机硬件需求 Host system requirements
1.1核心
2.2G内存
3.6G硬盘
~~~

~~~powershell
运行KVM虚拟机需求
KVM hypervisor requirements
[root@localhost ~]# lscpu
虚拟化：           VT-x       #intel虚拟技术
~~~

~~~powershell
检查CPU是否有以下特性，此特性支持CPU虚拟化
[root@localhost ~]#  egrep 'svm|vmx'  /proc/cpuinfo
vmx
~~~

~~~powershell
在BIOS中开启虚拟化功能
BIOS Enable Virtualization
~~~



~~~powershell
不同CPU厂商 CPU虚拟化技术名称
Intel CPU:  VT-x
AMD CPU:  AMD -V
~~~



## 5.2 安装KVM虚拟机管理工具

> 如果需要在vmware workstation 测试环境上安装kvm:



![](../img/virtual/vmware_workstation_install_option.png)





~~~powershell
管理KVM虚拟机管理工具组件
[root@localhost ~]# yum grouplist
[root@localhost ~]# yum -y groupinstall "虚拟化*"
~~~



~~~powershell
安装完成后验证libvirtd状态及系统模块是否添加
[root@localhost ~]#systemctl status libvirtd
[root@localhost ~]#lsmod | grep kvm
~~~



~~~powershell
在firewalld中配置default默认区域中masquerade，以便虚拟机通过连接外网。
[root@localhost ~]# firewall-cmd --permanent --zone=public  --add-masquerade

加载配置，使上述配置生效。
[root@localhost ~]# firewall-cmd --reload
~~~



~~~powershell
通过命令查看虚拟机列表
[root@localhost ~]# virsh list --all
~~~



## 5.3 使用virt-manager安装KVM虚拟机

### 5.3.1 准备

- 准备iso镜像文件
- 准备一套系统预备工具 PXE&kickstart || Cobbler



### 5.3.2 KVM虚拟机组成

- 磁盘镜像文件  /var/lib/libvirt/images
- 配置文件 /etc/libvirt/qemu/



### 5.3.3  Linux主机安装

```
virt-manager
```

![1545964085410](../img/virtual/1545964085410.png)



![1545964256167](../img/virtual/1545964256167.png)





![1545964311912](../img/virtual/1545964311912.png)





![1545964480043](../img/virtual/1545964480043.png)



![1545964650939](../img/virtual/1545964650939.png)



![1545964871080](../img/virtual/1545964871080.png)



![1545965036341](../img/virtual/1545965036341.png)



![1545965229134](../img/virtual/1545965229134.png)



![1545965315019](../img/virtual/1545965315019.png)



![1545965440953](../img/virtual/1545965440953.png)



![1545965688832](../img/virtual/1545965688832.png)



![1545965872625](../img/virtual/1545965872625.png)





![1545965938349](../img/virtual/1545965938349.png)



### 5.3.4 查看已安装的虚拟机



~~~powershell
通过命令查看虚拟机列表
[root@localhost ~]# virsh list --all
~~~











