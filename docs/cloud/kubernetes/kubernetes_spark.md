## 1.1 **Kubernetes 介绍**

Kubernetes是Google公司在2014年6月开源的一个容器集群管理系统，使用Go语言开发，也叫K8S（k8s 这个缩写是因为k和s之间有八个字符的关系）。Kubernetes这个名字源于希腊语，意为“舵手”或“飞行员”。Kubernetes的目标是让部署容器化的应用 简单并且高效,提供应用部署，维护，规划，更新。Kubernetes一个核心的特点就是能够自主的管理容器来保证云平台中的容器按照用户的期望状态运行，让用户能够方便的部署自己的应用。

Kubernetes官网地址如下:[https://kubernetes.io/](https://kubernetes.io/)，中文官网地址如下：[https://kubernetes.io/zh-cn/](https://kubernetes.io/zh-cn/)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/1ffd5c05d5804b12a2835ce752678ae6.png)

企业中应用程序的部署经历了传统部署时代、虚拟化部署时代、容器化部署时代，尤其是今天容器化部署应用在企业中应用非常广泛，Kubernetes作为容器编排管理工具也越来越重要。

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/65c590ae4fee44249a01e40aee1ee6aa.png)

### 1.1.1 **传统部署时代**

早期，各个公司是在物理服务器上运行应用程序。由于无法限制在物理服务器中运行的应用程序资源使用，因此会导致资源分配问题。例如，如果在同一台物理服务器上运行多个应用程序，则可能会出现一个应用程序占用大部分资源的情况，而导致其他应用程序的性能下降。一种解决方案是将每个应用程序都运行在不同的物理服务器上，但是当某个应用资源利用率不高时，服务器上剩余资源无法被分配给其他应用，而且维护许多物理服务器的成本很高。

**物理服务器部署应用痛点如下：**

* 物理服务器环境部署人力成本大，特别是在自动化手段不足的情况下，依靠人肉运维的方式解决。
* 当物理服务器出现宕机后，服务器重启时间过长，短则1-2分钟，长则3-5分钟，有背于服务器在线时长达到99.999999999%标准的要求。
* 物理服务器在应用程序运行期间硬件出现故障，解决较麻烦。
* 物理服务器计算资源不能有效调度使用，无法发挥其充足资源的优势。
* 物理服务器环境部署浪费时间，没有自动化运维手段，时间是成倍增加的。
* 在物理服务器上进行应用程序配置变更，需要停止之前部署重新实施部署。

### 1.1.2 **虚拟化部署时代**

由于以上原因，虚拟化技术被引入了，虚拟化技术允许你在单个物理服务器的CPU上运行多台虚拟机（VM）。虚拟化能使应用程序在不同VM之间被彼此隔离，且能提供一定程度的安全性，因为一个应用程序的信息不能被另一应用程序随意访问。每个 VM 是一台完整的计算机，在虚拟化硬件之上运行所有组件，包括其自己的操作系统。

虚拟化技术能够更好地利用物理服务器的资源，并且因为可轻松地添加或更新应用程序，因此具有更高的可扩缩性，以及降低硬件成本等等的好处。通过虚拟化，你可以将一组物理资源呈现为可丢弃的虚拟机集群。

**虚拟机部署应用优点：**

* 虚拟机较物理服务器轻量，可借助虚拟机模板实现虚拟机快捷生成及应用。
* 虚拟机中部署应用与物理服务器一样可控性强，且当虚拟机出现故障时，可直接使用新的虚拟机代替。
* 在物理服务器中使用虚拟机可高效使用物理服务器的资源。
* 虚拟机与物理服务器一样可达到良好的应用程序运行环境的隔离。
* 当部署应用程序的虚拟机出现宕机时，可以快速启动，时间通常可达秒级，10秒或20秒即可启动，应用程序可以继续提供服务。
* 在虚拟机中部署应用，容易扩容及缩容实现、应用程序迁移方便。

**虚拟机部署应用缺点：**

* 虚拟机管理软件本身占用物理服务器计算资源较多，例如:VMware Workstation Pro就会占用物理服务器大量资源。
* 虚拟机底层硬件消耗物理服务器资源较大，例如：虚拟机操作系统硬盘，会直接占用大量物理服务器硬盘空间。
* 相较于容器技术，虚拟机启动时间过长，容器启动可按毫秒级计算。
* 虚拟机对物理服务器硬件资源调用添加了调链条，存在浪费时间的现象，所以虚拟机性能弱于物理服务器。
* 由于应用程序是直接部署在虚拟机硬盘上，应用程序迁移时，需要连同虚拟机硬盘中的操作系统一同迁移，会导致迁移文件过大，浪费更多的存储空间及时间消耗过长。

### 1.1.3 **容器化部署时代**

容器类似于VM，但具备更宽松的隔离特性，使容器之间可以共享操作系统（OS），因此，容器比起VM被认为是更轻量级的。容器化技术中常用的就是Docker容器引擎技术，让开发者可以打包应用以及依赖到一个可移植的镜像中，然后发布到任何平台，其与VM类似，每个容器都具有自己的文件系统、CPU、内存、进程空间等。由于它们与基础架构分离，因此可以跨云和OS发行版本进行移植。

***基于容器化技术部署应用优点* ：**

* 不需要为容器安装操作系统，可以节约大量时间。
* 不需要通过手动的方式在容器中部署应用程序的运行环境，直接部署应用就可以了。
* 不需要管理容器网络，以自动调用的方式访问容器中应用提供的服务。
* 方便分享与构建应用容器，一次构建，到处运行，可在 Ubuntu、RHEL、CoreOS、本地、 Google Kubernetes Engine 等地方运行。
* 毫秒级启动。
* 资源隔离与资源高效应用。应用程序被分解成较小的独立部分，并且可以动态部署和管理，而不是在一台大型单机上整体运行，可以在一台物理机上高密度的部署容器。

虽然使用容器有以上各种优点，但是 **使用容器相比于物理机容器可控性不强** ，例如：对容器的访问，总想按物理服务器或虚拟机的方式去管理它，其实容器与物理服务器、虚拟机管理方式上有着本质的区别的，最好不要管理。

### 1.1.4 **为什么需要Kubernetes**

一般一个容器中部署运行一个服务，一般不会在一个容器运行多个服务，这样会造成容器镜像复杂度的提高，违背了容器初衷。企业中一个复杂的架构往往需要很多个应用，这就需要运行多个容器，并且需要保证这些容器之间有关联和依赖，那么如何保证各个容器自动部署、容器之间服务发现、容器故障后重新拉起正常运行，这就需要容器编排工具。

Kubernetes就是一个容器编排工具，可以实现容器集群的自动化部署、自动扩展、维护等功能，可以基于Docker技术的基础上，为容器化应用提供部署运行、资源调度、服务发现和动态伸缩等一系列完整功能，提高大规模容器集群管理的便捷性。

**Kubernetes**优点如下：

* 服务发现和负载均衡

Kubernetes可以使用DNS名称或自己的IP地址来曝露容器。如果进入容器的流量很大，Kubernetes 可以负载均衡并分配网络流量，从而使部署稳定。

* 存储编排

Kubernetes允许你自动挂载你选择的存储系统，例如本地存储、公共云提供商等。

* 自动部署和回滚

你可以使用Kubernetes描述已部署容器的所需状态，它可以以受控的速率将实际状态更改为期望状态。例如，可以通过Kubernetes来为你部署创建新容器、删除现有容器并将它们的所有资源用于新容器。

* 自动完成装箱计算

在Kubernetes集群上运行容器化的任务时，Kubernetes可以根据运行每个容器指定的多少CPU和内存(RAM)将这些容器按实际情况调度到Kubernetes集群各个节点上，以最佳方式利用集群资源。

* 自我修复

Kubernetes将重新启动失败的容器、替换容器、杀死不响应的容器，并且在准备好服务之前不将其通告给客户端。

* 密钥与配置管理

Kubernetes允许你存储和管理敏感信息，例如密码、OAuth令牌和ssh密钥。 你可以在不重建容器镜像的情况下部署和更新密钥和应用程序配置，也无需在堆栈配置中暴露密钥。

## 1.2 **Kubernetes集群架构及组件**

一个Kubernetes集群至少有一个主控制平面节点（Control Plane）和一台或者多台工作节点（Node）组成，控制面板和工作节点实例可以是物理设备或云中的实例。Kubernetes 架构如下：

![](file:///C:\Temp\ksohtml16136\wps9.jpg)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/a574f87c70034ec1b0abb158368cc765.png)

### 1.2.1 **Kubernetes 控制平面（Contorl Plane）**

Kubernetes控制平面也称为主节点（Master Node），其管理集群中的工作节点（Worker Node）和Pod，在生产环境中,Master节点可以运行在多台节点实例上形成主备，提供Kubernetes集群的容错和高可用性。我们可以通过CLI或者UI页面中向Master节点输入参数控制Kubernetes集群。

Master节点是Kubernetes集群的管理中心，包含很多组件，这些组件管理Kubernetes集群各个方面，例如集群组件通信、工作负载调度和集群状态持久化。这些组件可以在集群内任意节点运行，但是为了方便会在一台实例上运行Master所有组件，并且不会在此实例上运行用户容器。

**Kubernetes Master主节点包含组件如下：**

* **kube-apiserver：**

用于暴露kubernetes API，任何的资源请求/调用操作都是通过kube-apiserver提供的接口进行。例如:通过REST/kubectl 操作Kubernetes集群调用的就是Kube-apiserver。

* **etcd：**

etcd是一个一致的、高度可用的键值存储库，是kubernetes提供默认的存储系统，用于存储Kubernetes集群的状态和配置数据。

* **kube-scheduler：**

scheduler负责监视新创建、未指定运行节点的Pods并选择节点来让Pod在上面运行。如果没有合适的节点，则将Pod处于挂起的状态直到出现一个健康的Node节点。

* **kube-controller-manager：**

controller-manager 负责运行Kubernetes中的Controller控制器，这些Controller控制器包括：

> * 节点控制器（Node Controller）：负责在节点出现故障时进行通知和响应。
> * 任务控制器（Job Controller）：监测代表一次性任务的 Job 对象，然后创建 Pods 来运行这些任务直至完成。
> * 端点分片控制器（EndpointSlice controller）：填充端点分片（EndpointSlice）对象（以提供 Service 和 Pod 之间的链接）。
> * 服务账号控制器（ServiceAccount controller）：为新的命名空间创建默认的服务账号（ServiceAccount）。

* **cloud-controller-manager**

云控制器管理器（Cloud Controller Manager）嵌入了特定于云平台的控制逻辑，允许你将你的集群连接到云提供商的 API 之上， 并将与该云平台交互的组件同与你的集群交互的组件分离开来。cloud-controller-manager 仅运行特定于云平台的控制器。 因此如果你在自己的环境中运行 Kubernetes，或者在本地计算机中运行学习环境， 所部署的集群不需要有云控制器管理器。

### 1.2.2 **Kubernetes Node节点**

Kubernetes Node节点又称为工作节点（Worker Node），一个Kubernetes集群至少需要一个工作节点，但通常很多，工作节点也包含很多组件，用于运行以及维护Pod及service等信息, 管理volume(CVI)和网络(CNI)。在Kubernetes集群中可以动态的添加和删除节点来扩展和缩减集群。

**工作节点Node上的组件如下：**

* **Kubelet:**

Kubelet会在集群中每个Worker节点上运行，负责维护容器（Containers）的生命周期(创建pod，销毁pod)，确保Pod处于运行状态且健康。同时也负责Volume(CVI)和网络(CNI)的管理。Kubelet不会管理不是由Kubernetes创建的容器。

* **kube-proxy:**

Kube-proxy是集群中每个Worker节点上运行的网络代理，管理IP转换和路由，确保每个Pod获得唯一的IP地址，维护网络规则，这些网络规则会允许从集群内部或外部的网络会话与Pod进行网络通信。

* **container Runtime:**

容器运行时(Container Runtime)负责运行容器的软件，为了运行容器每个Worker节点都有一个Container Runtime引擎，负责镜像管理以及Pod和容器的启动停止。

## 1.3 **Kubernetes 核心概念**

Kubernetes中有非常多的核心概念，下面主要介绍Kubernetes集群中常见的一些概念。

### 1.3.1 **Pod**

Pod是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元，是Kubernetes调度的基本单位，Pod设计的理念是每个Pod都有一个唯一的IP。Pod就像豌豆荚一样，其中包含着一组（一个或多个）容器，这些容器共享存储、网络、文件系统以及怎样运行这些容器的声明。

![](file:///C:\Temp\ksohtml16136\wps10.jpg)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/a50dae4997a14440ac578cd042c9a4cc.png)

**Node&Pod&Container&应用程序关系如下图所示：**

![](file:///C:\Temp\ksohtml16136\wps11.jpg)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/56789990f8a04f7a9d0cc2b75d727654.png)

### 1.3.2 **Label**

Label是附着到object上（例如Pod）的键值对。可以在创建object的时候指定，也可以在object创建后随时指定。Labels的值对系统本身并没有什么含义，只是对用户才有意义。

一个Label是一个key=value的键值对，其中key与value由用户自己指定。Label可以附加到各种资源对象上，例如Node、Pod、Service、RC等，一个资源对象可以定义任意数量的Label，同一个Label也可以被添加到任意数量的资源对象上去，Label通常在资源对象定义时确定，也可以在对象创建后动态添加或者删除。

我们可以通过指定的资源对象捆绑一个或多个不同的Label来实现多维度的资源分组管理功能，以便于灵活、方便地进行资源分配、调度、配置、部署等管理工作。例如：部署不同版本的应用到不同的环境中；或者监控和分析应用（日志记录、监控、告警）等。

一些常用abel示例如下所示:

* 版本标签："release" : "stable" , "release" : "canary"...
* 环境标签："environment" : "dev" , "environment" : "production"
* 架构标签："tier" : "frontend" , "tier" : "backend" , "tier" : "middleware"
* 分区标签："partition" : "customerA" , "partition" : "customerB"...
* 质量管控标签："track" : "daily" , "track" : "weekly"

Label相当于我们熟悉的“标签”，给某个资源对象定义一个Label，就相当于给它打了一个标签，随后可以通过Label Selector（标签选择器）查询和筛选拥有某些Label的资源对象，Kubernetes通过这种方式实现了类似SQL的简单又通用的对象查询机制。

### 1.3.3 **NameSpace**

Namespace 命名空间是对一组资源和对象的抽象集合，比如可以用来将系统内部的对象划分为不同的项目组或者用户组。常见的pod、service、replicaSet和deployment等都是属于某一个namespace的(默认是default)，而node, persistentVolumes等则不属于任何namespace。

当删除一个命名空间时会自动删除所有属于该namespace的资源，default和kube-system命名空间不可删除。

### 1.3.4 **Controller控制器**

在 Kubernetes 中，Contorller用于管理和运行Pod的对象，控制器通过监控集群的公共状态，并致力于将当前状态转变为期望的状态。一个Controller控制器至少追踪一种类型的 Kubernetes 资源。这些对象有一个代表期望状态的spec字段。该资源的控制器负责确保其当前状态接近期望状态。

不同类型的控制器实现的控制方式不一样，以下介绍常见的几种类型的控制器。

#### 1.3.4.1 deployments控制器

deployments控制器用来部署无状态应用。基于容器部署的应用一般分为两种，无状态应用和有状态应用。

* 无状态应用：认为Pod都一样，没有顺序要求，随意进行扩展和伸缩。例如：nginx,请求本身包含了响应端为响应这一请求所@需的全部信息。每一个请求都像首次执行一样，不会依赖之前的数据进行响应，不需要持久化数据，无状态应用的多个实例之间互不依赖，可以无序的部署、删除或伸缩。
* 有状态应用：每个pod都是独立运行，有唯一的网络表示符，持久化存储，有序。例如：mysql主从，主机名称固定，而且其扩容以及升级等操作也是按顺序进行。有状态应用前后请求有关联与依赖，需要持久化数据，有状态应运用的多个实例之间有依赖，不能相互替换。

在Kubernetes中，一般情况下我们不需要手动创建Pod实例，而是采用更高一层的抽象或定义来管理Pod，针对无状态类型的应用，Kubernetes使用Deloyment的Controller对象与之对应，其典型的应用场景包括：

> * 定义Deployment来创建Pod和ReplicaSet
> * 滚动升级和回滚应用
> * 扩容和缩容
> * 暂停和继续Deployment

#### 1.3.4.2 **ReplicaSet控制器**

通过改变Pod副本数量实现Pod的扩容和缩容，一般Deployment里包含并使用了ReplicaSet。对于ReplicaSet而言，它希望pod保持预期数目、持久运行下去，除非用户明确删除，否则这些对象一直存在，它们针对的是耐久性任务，如web服务等。

#### 1.3.4.3 **statefulSet控制器**

Deployments和ReplicaSets是为无状态服务设计的，StatefulSet则是为了有状态服务而设计，其应用场景包括：

* 稳定的持久化存储，即Pod重新调度后还是能访问到相同的持久化数据，基于PVC（PersistentVolumeClaim，持久存储卷声明）来实现。
* 稳定的网络标志，即Pod重新调度后其PodName和HostName不变，基于Headless Service(即没有Cluster IP的Service)来实现。

注意从写法上来看statefulSet与deployment几乎一致，就是类型不一样。

#### 1.3.4.4 **DaemonSet控制器**

DaemonSet保证在每个Node上都运行一个相同Pod实例，常用来部署一些集群的日志、监控或者其他系统管理应用。DaemonSet使用注意以下几点：

* 当节点加入到Kubernetes集群中，pod会被（DaemonSet）调度到该节点上运行。
* 当节点从Kubernetes集群中被移除，被DaemonSet调度的pod会被移除。
* 如果删除一个Daemonset，所有跟这个DaemonSet相关的pods都会被删除。
* 如果一个DaemonSet的Pod被杀死、停止、或者崩溃，那么DaemonSet将会重新创建一个新的副本在这台计算节点上。
* DaemonSet一般应用于日志收集、监控采集、分布式存储守护进程等。

#### 1.3.4.5 **Job控制器**

ReplicaSet针对的是耐久性任务，对于非耐久性任务，比如压缩文件，任务完成后，pod需要结束运行，不需要pod继续保持在系统中，这个时候就要用到Job。Job负责批量处理短暂的一次性任务 (short lived one-off tasks)，即仅执行一次的任务，它保证批处理任务的一个或多个Pod成功结束。

#### 1.3.4.6 **Cronjob控制器**

Cronjob类似于Linux系统的crontab，在指定的时间周期运行相关的任务。

### 1.3.5 **Service**

使用kubernetes集群运行工作负载时，由于Pod经常处于用后即焚状态，Pod经常被重新生成，因此Pod对应的IP地址也会经常变化，导致无法直接访问Pod提供的服务，Kubernetes中使用了Service来解决这一问题，即在Pod前面使用Service对Pod进行代理，无论Pod怎样变化 ，只要有Label，就可以让Service能够联系上Pod，把PodIP地址添加到Service对应的端点列表（Endpoints）实现对Pod IP跟踪，进而实现通过Service访问Pod目的。

Service有以下几个注意点：

* 通过service为pod客户端提供访问pod方法，即可客户端访问pod入口
* 通过标签动态感知pod IP地址变化等
* 防止pod失联
* 定义访问pod访问策略
* 通过label-selector相关联
* 通过Service实现Pod的负载均衡

Service 有如下四种类型：

* ClusterIP：默认，分配一个集群内部可以访问的虚拟IP。
* NodePort：在每个Node上分配一个端口作为外部访问入口。nodePort端口范围为:30000-32767
* LoadBalancer：工作在特定的Cloud Provider上，例如Google Cloud，AWS，OpenStack。
* ExternalName：表示把集群外部的服务引入到集群内部中来，即实现了集群内部pod和集群外部的服务进行通信，适用于外部服务使用域名的方式，缺点是不能指定端口。

### 1.3.6 **Volume 存储卷**

默认情况下容器的数据是非持久化的，容器消亡以后数据也会跟着丢失。Docker容器提供了Volume机制以便将数据持久化存储。Kubernetes提供了更强大的Volume机制和插件，解决了容器数据持久化以及容器间共享数据的问题。

Kubernetes存储卷的生命周期与Pod绑定，容器挂掉后Kubelet再次重启容器时，Volume的数据依然还在，Pod删除时，Volume才会清理。数据是否丢失取决于具体的Volume类型，比如emptyDir的数据会丢失，而PV的数据则不会丢。

目前Kubernetes主要支持以下Volume类型：

* emptyDir：Pod存在，emptyDir就会存在，容器挂掉不会引起emptyDir目录下的数据丢失，但是pod被删除或者迁移，emptyDir也会被删除。
* hostPath：hostPath允许挂载Node上的文件系统到Pod里面去。
* NFS（Network File System）：网络文件系统，Kubernetes中通过简单地配置就可以挂载NFS到Pod中，而NFS中的数据是可以永久保存的，同时NFS支持同时写操作。
* glusterfs：同NFS一样是一种网络文件系统，Kubernetes可以将glusterfs挂载到Pod中，并进行永久保存。
* cephfs：一种分布式网络文件系统，可以挂载到Pod中，并进行永久保存。
* subpath：Pod的多个容器使用同一个Volume时，会经常用到。
* secret：密钥管理，可以将敏感信息进行加密之后保存并挂载到Pod中。
* persistentVolumeClaim：用于将持久化存储（PersistentVolume）挂载到Pod中。

除了以上几种Volume类型，Kubernetes还支持很多类型的Volume，详细可以参考：[https://kubernetes.io/docs/concepts/storage/](https://kubernetes.io/docs/concepts/storage/)

### 1.3.7 **PersistentVolume(PV) 持久化存储卷**

kubernetes存储卷的分类太丰富了，每种类型都要写相应的接口与参数才行，这就让维护与管理难度加大，PersistentVolume(PV)是集群之中的一块网络存储，跟 Node 一样，也是集群的资源。PV是配置好的一段存储(可以是任意类型的存储卷)，将网络存储共享出来,配置定义成PV。PersistentVolume (PV)和PersistentVolumeClaim (PVC)提供了方便的持久化卷， PV提供网络存储资源，而PVC请求存储资源并将其挂载到Pod中，通过PVC用户不需要关心具体的volume实现细节,只需要关心使用需求。

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/fbf2a1687a1e4d3daf73600c19fccaa5.png)

### 1.3.8 **ConfigMap**

ConfigMap用于保存配置数据的键值对，可以用来保存单个属性，也可以用来保存配置文件，实现对容器中应用的配置管理，可以把ConfigMap看作是一个挂载到pod中的存储卷。ConfigMap跟secret很类似，但它可以更方便地处理不包含敏感信息的明文字符串。

### 1.3.9 **Secret**

Sercert-密钥解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者Pod Spec中。

### 1.3.10 **ServiceAccount**

Service account是为了方便Pod里面的进程调用Kubernetes API或其他外部服务而设计的。Service Account为服务提供了一种方便的认证机制，但它不关心授权的问题。可以配合RBAC(Role Based Access Control)来为Service Account鉴权，通过定义Role、RoleBinding、ClusterRole、ClusterRoleBinding来对sa进行授权。

## 1.4 **Kubernetes 集群搭建环境准备**

这里使用kubeadm部署工具来进行部署Kubernetes。Kubeadm是为创建Kubernetes集群提供最佳实践并能够“快速路径”构建kubernetes集群的工具。它能够帮助我们执行必要的操作，以获得最小可行的、安全的集群，并以用户友好的方式运行。

### 1.4.1 **节点划分**

kubernetes 集群搭建节点分布：

| **节点IP** | **节点名称** | **Master** | **Worker** |
| ---------------- | ------------------ | ---------------- | ---------------- |
| 192.168.179.4    | node1              | ★               |                  |
| 192.168.179.5    | node2              |                  | ★               |
| 192.168.179.6    | node3              |                  | ★               |
| 192.168.179.7    | node4              |                  |                  |
| 192.168.179.8    | node5              |                  |                  |

### 1.4.2 **升级内核**

升级操作系统内核，升级到3.10内核版本以上。这里所有主机均操作，包括node4,node5节点。

```
#导入elrepo gpg key
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
#安装elrepo YUM源仓库
yum -y install https://www.elrepo.org/elrepo-release-7.0-4.el7.elrepo.noarch.rpm
#安装kernel-ml版本，ml为长期稳定版本，lt为长期维护版本
yum --enablerepo="elrepo-kernel" -y install kernel-lt.x86_64

#设置grub2默认引导为0
grub2-set-default 0

#重新生成grub2引导文件
grub2-mkconfig -o /boot/grub2/grub.cfg

#更新后，需要重启，使用升级的内核生效。
reboot

#重启后，需要验证内核是否为更新对应的版本
uname -r
6.0.6-1.el7.elrepo.x86_64
```

### 1.4.3 **配置内核转发及网桥过滤**

在所有K8S主机配置。添加网桥过滤及内核转发配置文件：

```
vim /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
```

加载br_netfilter模块：

```
#加载br_netfilter模块
modprobe br_netfilter

#查看是否加载
lsmod | grep br_netfilter
```

加载网桥过滤及内核转发配置文件：

```
sysctl -p /etc/sysctl.d/k8s.conf
```

### 1.4.4 **安装ipset及ipvsadm**

所有主机均需要操作。主要用于实现service转发。

```
#安装ipset及ipvsadm
yum -y install ipset ipvsadm

配置ipvsadm模块加载方式，添加需要加载的模块
vim  /etc/sysconfig/modules/ipvs.modules
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack

授权、运行、检查是否加载
chmod 755 /etc/sysconfig/modules/ipvs.modules 
bash /etc/sysconfig/modules/ipvs.modules
lsmod | grep -e ip_vs -e nf_conntrack
```

### 1.4.5 **关闭SWAP分区**

修改完成后需要重启操作系统，如不重启，可临时关闭，命令为swapoff -a。永远关闭swap分区，需要重启操作系统。

```
#永久关闭swap分区 ,在 /etc/fstab中注释掉下面一行
vim /etc/fstab
#/dev/mapper/centos-swap swap  swap    defaults        0 0

#重启机器
reboot
```

### 1.4.6 **安装docker**

所有集群主机均需操作。

获取docker repo文件

```
wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

查看docker可以安装的版本：

```
yum list docker-ce.x86_64 --showduplicates | sort -r
```

安装docker:这里指定docker版本为20.10.9版本

```
yum -y install docker-ce-20.10.9-3.el7
```

> 如果安装过程中报错:

```
Error: Package: 3:docker-ce-20.10.9-3.el7.x86_64 (docker-ce-stable)
           Requires: container-selinux >= 2:2.74
Error: Package: docker-ce-rootless-extras-20.10.9-3.el7.x86_64 (docker-ce-stable)
           Requires: fuse-overlayfs >= 0.7
Error: Package: docker-ce-rootless-extras-20.10.9-3.el7.x86_64 (docker-ce-stable)
           Requires: slirp4netns >= 0.4
Error: Package: containerd.io-1.4.9-3.1.el7.x86_64 (docker-ce-stable)
```

> 缺少一些依赖，解决方式：在/etc/yum.repos.d/docker-ce.repo开头追加如下内容:

```
[centos-extras]
name=Centos extras - $basearch
baseurl=http://mirror.centos.org/centos/7/extras/x86_64
enabled=1
gpgcheck=0
```

> 然后执行安装命令：

```
yum -y install slirp4netns fuse-overlayfs container-selinux
```

> 执行完以上之后，再次执行yum -y install docker-ce-20.10.9-3.el7安装docker即可。

设置docker 开机启动，并启动docker：

```
systemctl enable docker
systemctl start docker
```

查看docker版本

```
docker version
```

修改cgroup方式，并重启docker。

```
vim /etc/docker/daemon.json
{
        "exec-opts": ["native.cgroupdriver=systemd"]
}

#重启docker
systemctl restart docker
```

### 1.4.7 **cri-docker安装**

从kubernetes 1.24开始，dockershim已经从kubelet中移除（dockershim 是 Kubernetes 的一个组件，主要目的是为了通过 CRI 操作 Docker），但因为历史问题docker却不支持kubernetes主推的CRI（容器运行时接口）标准，所以docker不能再作为kubernetes的容器运行时了，即从kubernetesv1.24开始不再使用docker了，默认使用的容器运行时是containerd。目前containerd比较新，可能存在一些功能不稳定的情况，所以这里我们使用容器运行时还是选择docker。

如果想继续使用docker的话，可以在kubelet和docker之间加上一个中间层cri-docker。cri-docker是一个支持CRI标准的shim（垫片）。一头通过CRI跟kubelet交互，另一头跟docker api交互，从而间接的实现了kubernetes以docker作为容器运行时。这里需要在全部节点执行cri-docker安装。

1) **下载cri-docker源码**

可以从[https://github.com/Mirantis/cri-dockerd/archive/refs/tags/v0.3.1.tar.gz地址下载cri-docker源码，然后使用go进行编译安装。](https://github.com/Mirantis/cri-dockerd/archive/refs/tags/v0.2.6.tar.gz地址下载cri-docker源码，然后使用go进行编译安装。) cri-docker源码下载完成后，上传到Master并解压，改名:

```
[root@node1 ~]# tar -zxvf ./cri-dockerd-0.2.6.tar.gz 
[root@node1 ~]# mv cri-dockerd-0.2.6 cri-dockerd
```

2) **安装go**

```
[root@node1 ~]# wget https://storage.googleapis.com/golang/getgo/installer_linux
[root@node1 ~]# chmod +x ./installer_linux
[root@node1 ~]# ./installer_linux
[root@node1 ~]# source ~/.bash_profile
[root@node1 ~]#  go version
go version go1.19.3 linux/amd64
```

如果在线安装go安装不上，可以选择离线安装go，步骤如下：

```
#在资料中获取“go1.19.3.linux-amd64.tar.gz”并解压，或者通过wget下载: wget https://go.dev/dl/go1.19.3.linux-amd64.tar.gz
[root@node1 ~]# tar -C /usr/local -zxvf go1.19.3.linux-amd64.tar.gz

#解压完成后，配置环境变量
[root@node1 ~]# echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile

#环境变量生效
[root@node1 ~]# source /etc/profile

#检查go 版本
[root@node1 ~]# go version
go version go1.19.3 linux/amd64
```

4) **编译安装cri-docker**

```
#进入 cri-dockerd 中，并创建目录bin
[root@node1 ~]# cd cri-dockerd && mkdir bin

#编译，大概等待1分钟
[root@node1 cri-dockerd]# go build -o bin/cri-dockerd

#安装cri-docker，安装-o指定owner -g指定group -m指定指定权限
[root@node1 cri-dockerd]# mkdir -p /usr/local/bin
[root@node1 cri-dockerd]# install -o root -g root -m 0755 bin/cri-dockerd /usr/local/bin/cri-dockerd

#复制服务管理文件至/etc/systemd/system目录中
[root@node1 cri-dockerd]# cp -a packaging/systemd/* /etc/systemd/system

#指定cri-dockerd运行位置
[root@node1 cri-dockerd]# sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service
[root@node1 cri-dockerd]# systemctl daemon-reload

#启动服务
[root@node1 cri-dockerd]# systemctl enable cri-docker.service
[root@node1 cri-dockerd]# systemctl enable --now cri-docker
```

## 1.5 **Kubernetes 基于Docker Runtime 集群部署**

### 1.5.1 **软件版本**

这里安装Kubernetes版本为1.25.3，在所有主机（node1,node2,node3）安装kubeadm，kubelet，kubectl。

* kubeadm：初始化集群、管理集群等。
* kubelet:用于接收api-server指令，对pod生命周期进行管理。
* kubectl:集群应用命令行管理工具。

### 1.5.2 **准备阿里yum源**

每台k8s节点vim /etc/yum.repos.d/k8s.repo，写入以下内容：

```
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
```

### 1.5.3 **集群软件安装**

```
#查看指定版本
yum list kubeadm.x86_64 --showduplicates | sort -r
yum list kubelet.x86_64 --showduplicates | sort -r
yum list kubectl.x86_64 --showduplicates | sort -r

#安装指定版本
yum -y install --setopt=obsoletes=0 kubeadm-1.25.3-0  kubelet-1.25.3-0 kubectl-1.25.3-0
```

安装过程有有如下错误：

```
Error: Package: kubelet-1.25.3-0.x86_64 (kubernetes)
           Requires: conntrack
```

解决方式：

```
wget http://mirrors.aliyun.com/repo/Centos-7.repo -O /etc/yum.repos.d/Centos-7.repo
yum install -y conntrack-tools
```

### 1.5.4 **配置kubelet**

为了实现docker使用的cgroup driver与kubelet使用的cgroup的一致性，建议修改如下文件内容。

```
#vim /etc/sysconfig/kubelet
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"
```

设置kubelet为开机自启动即可，由于没有生成配置文件，集群初始化后自动启动

```
systemctl enable kubelet
```

### 1.5.5 **集群镜像准备**

只需要在node1 Master节点上执行如下下载镜像命令即可，这里先使用kubeadm查询下镜像。

```
[root@node1 ~]#kubeadm config images list --kubernetes-version=v1.25.3
registry.k8s.io/kube-apiserver:v1.25.3
registry.k8s.io/kube-controller-manager:v1.25.3
registry.k8s.io/kube-scheduler:v1.25.3
registry.k8s.io/kube-proxy:v1.25.3
registry.k8s.io/pause:3.8
registry.k8s.io/etcd:3.5.4-0
registry.k8s.io/coredns/coredns:v1.9.3
```

编写下载镜像脚本image_download.sh：

```
#!/bin/bash
images_list='
registry.k8s.io/kube-apiserver:v1.25.3
registry.k8s.io/kube-controller-manager:v1.25.3
registry.k8s.io/kube-scheduler:v1.25.3
registry.k8s.io/kube-proxy:v1.25.3
registry.k8s.io/pause:3.8
registry.k8s.io/etcd:3.5.4-0
registry.k8s.io/coredns/coredns:v1.9.3
'
for i in $images_list
do
  docker pull $i
done
docker save -o k8s-1-25-3.tar $images_list
```

以上脚本准备完成之后，执行命令：sh image_download.sh 进行镜像下载

注意：下载时候需要科学上网，否则下载不下来。也可以使用资料中的“k8s-1-25-3.tar”下载好的包。

> #如果下载不下来，使用资料中打包好的k8s-1-25-3.tar，将镜像导入到docker中
>
> docker load -i k8s-1-25-3.tar

### 1.5.6 **集群初始化**

只需要在Master节点执行如下初始化命令即可。

```
[root@node1 ~]# kubeadm init --kubernetes-version=v1.25.3 --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=192.168.179.4 --cri-socket unix:///var/run/cri-dockerd.sock
```

注意：--apiserver-advertise-address=192.168.179.4 要写当前主机Master IP

> 初始化过程中报错：

```
[init] Using Kubernetes version: v1.25.3
[preflight] Running pre-flight checks
error execution phase preflight: [preflight] Some fatal errors occurred:
	[ERROR CRI]: container runtime is not running: output: E1102 20:14:29.494424   10976 remote_runtime.go:948] "Status from runtime service 
failed" err="rpc error: code = Unimplemented desc = unknown service runtime.v1alpha2.RuntimeService"time="2022-11-02T20:14:29+08:00" level=fatal msg="getting status of runtime: rpc error: code = Unimplemented desc = unknown service runtime.v1alp
ha2.RuntimeService", error: exit status 1
[preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`
To see the stack trace of this error execute with --v=5 or higher
```

执行如下命令，重启containerd后，再次init 初始化。

```
[root@node1 ~]# rm -rf /etc/containerd/config.toml
[root@node1 ~]# systemctl restart containerd
```

初始化完成后，结果如下：

```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.179.4:6443 --token tpynmm.7picylv5i83q9ghw \
	--discovery-token-ca-cert-hash sha256:2924026774d657b8860fbac4ef7698e90a3811137673af45e533c91e567a1529
```

### 1.5.7 **集群应用客户端管理集群文件准备**

参照初始化的内容来执行如下命令：

```
[root@node1 ~]# mkdir -p $HOME/.kube
[root@node1 ~]# cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
[root@node1 ~]# chown $(id -u):$(id -g) $HOME/.kube/config
[root@node1 ~]# export KUBECONFIG=/etc/kubernetes/admin.conf
```

### 1.5.8 **集群网络准备**

#### 1.5.8.1 **calico安装**

K8s使用calico部署集群网络,安装参考网址：https://projectcalico.docs.tigera.io/about/about-calico。

只需要在Master节点安装即可。

```
#下载operator资源清单文件
wget https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/tigera-operator.yaml --no-check-certificate

#应用资源清单文件，创建operator
kubectl create -f tigera-operator.yaml

#通过自定义资源方式安装
wget https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/custom-resources.yaml --no-check-certificate

#修改文件第13行，修改为使用kubeadm init ----pod-network-cidr对应的IP地址段
# vim custom-resources.yaml 【修改和增加以下加粗内容】
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  # Configures Calico networking.
  calicoNetwork:
    # Note: The ipPools section cannot be modified post-install.
    ipPools:
    - blockSize: 26
      cidr: 10.244.0.0/16
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()
    nodeAddressAutodetectionV4:
      interface: ens.*

#应用清单文件
kubectl create -f custom-resources.yaml

#监视calico-sysem命名空间中pod运行情况
watch kubectl get pods -n calico-system
[root@node1 ~]# watch kubectl get pods -n calico-system

Every 2.0s: kubectl get pods -n calico-system                                                                            Thu Nov  3 14:14:30 2022

NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-65648cd788-flmk4   1/1     Running   0          2m21s
calico-node-chnd5                          1/1     Running   0          2m21s
calico-node-kc5bx                          1/1     Running   0          2m21s
calico-node-s2cp5                          1/1     Running   0          2m21s
calico-typha-d76595dfb-5z6mg               1/1     Running   0          2m21s
calico-typha-d76595dfb-hgg27               1/1     Running   0          2m19s

#已经全部运行
[root@node1 ~]# kubectl get pods -n calico-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-65648cd788-ktjrh   1/1     Running   0          110m
calico-node-dvprv                          1/1     Running   0          110m
calico-node-nhzch                          1/1     Running   0          110m
calico-node-q44gh                          1/1     Running   0          110m
calico-typha-6bc9d76554-4bv77              1/1     Running   0          110m
calico-typha-6bc9d76554-nkzxq              1/1     Running   0          110m

#查看kube-system命名空间中coredns状态，处于Running状态表明联网成功。
[root@node1 ~]# kubectl get pods -n kube-system
NAME                            READY   STATUS    RESTARTS   AGE
coredns-565d847f94-bjtlh        1/1     Running   0          19h
coredns-565d847f94-wlxmf        1/1     Running   0          19h
etcd-node1                      1/1     Running   0          19h
kube-apiserver-node1            1/1     Running   0          19h
kube-controller-manager-node1   1/1     Running   0          19h
kube-proxy-bgpz2                1/1     Running   0          19h
kube-proxy-jlltp                1/1     Running   0          19h
kube-proxy-stfrx                1/1     Running   0          19h
kube-scheduler-node1            1/1     Running   0          19h
```

#### 1.5.8.2 **calico客户端安装**

主要用来验证k8s集群节点网络是否正常。这里只需要在Master节点安装就可以。

```
#下载二进制文件，注意，这里需要检查calico 服务端的版本，客户端要与服务端版本保持一致，这里没有命令验证calico的版本，所以安装客户端的时候安装最新版本即可。
curl -L https://github.com/projectcalico/calico/releases/download/v3.25.0/calicoctl-linux-amd64 -o calicoctl

#安装calicoctl
mv calicoctl /usr/bin/

#为calicoctl添加可执行权限
chmod +x /usr/bin/calicoctl

#查看添加权限后文件
ls /usr/bin/calicoctl

#查看calicoctl版本
[root@node1 ~]# calicoctl  version
Client Version:    v3.25.0
Git commit:        3f7fe4d29
Cluster Version:   v3.25.0
Cluster Type:      typha,kdd,k8s,operator,bgp,kubeadm

通过~/.kube/config连接kubernetes集群，查看已运行节点
[root@node1 ~]#  DATASTORE_TYPE=kubernetes KUBECONFIG=~/.kube/config calicoctl get nodes
NAME  
node1 
```

### 1.5.9 **集群工作节点添加**

这里在node2,node3 worker节点上执行命令，将worker节点加入到k8s集群。

```
[root@node2 ~]# kubeadm join 192.168.179.4:6443 --token tpynmm.7picylv5i83q9ghw \
	--discovery-token-ca-cert-hash sha256:2924026774d657b8860fbac4ef7698e90a3811137673af45e533c91e567a1529 --cri-socket unix:///var/run/cri-dockerd.sock
[root@node3 ~]# kubeadm join 192.168.179.4:6443 --token tpynmm.7picylv5i83q9ghw \
	--discovery-token-ca-cert-hash sha256:2924026774d657b8860fbac4ef7698e90a3811137673af45e533c91e567a1529 --cri-socket unix:///var/run/cri-dockerd.sock
```

注意：如果以上node2,node3 Worker节点已经错误的加入到Master节点，需要再Worker节点执行如下命令清除对应的信息，然后再次加入即可。

```
#重置kubeadm 
[root@node2 ~]# kubeadm reset -cri-socket unix:///var/run/cri-dockerd.sock
#删除k8s配置文件和证书文件
[root@node2 kubernetes]# rm -f /etc/kubernetes/kubelet.conf 
[root@node2 kubernetes]# rm -f /etc/kubernetes/pki/ca.crt

#重置kubeadm 
[root@node3 ~]# kubeadm reset
#删除k8s配置文件和证书文件
[root@node3 kubernetes]# rm -f /etc/kubernetes/kubelet.conf 
[root@node3 kubernetes]# rm -f /etc/kubernetes/pki/ca.crt
```

此外如果忘记了node join加入master节点的命令，可以按照以下步骤操作：

```
#查看discovery-token-ca-cert-hash
[root@node1 ~]# openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'

#查看token
[root@node1 ~]# kubeadm token list
TOKEN                     TTL         EXPIRES                USAGES                   DESCRIPTION  
EXTRA GROUPS1945mk.ved91lifrc8l0zj9   23h         2022-11-10T08:14:46Z   authentication,signing   The default bootstrap token generated by 'kubeadm init'.   
system:bootstrappers:kubeadm:default-node-token

#节点加入集群
[root@node1 ~]# kubeadm join 192.168.179.4:6443 --token 查询出来的token \
	--discovery-token-ca-cert-hash 查询出来的hash码
```

在master节点上操作，查看网络节点是否添加

```
[root@node1 ~]# DATASTORE_TYPE=kubernetes KUBECONFIG=~/.kube/config calicoctl get nodes
NAME  
node1   
node2   
node3
```

### 1.5.10 **验证集群可用性**

使用命令查看所有的节点：

```
[root@node1 ~]# kubectl get nodes
NAME    STATUS   ROLES           AGE   VERSION
node1   Ready    control-plane   20h   v1.25.3
node2   Ready    <none>          20h   v1.25.3
node3   Ready    <none>          20h   v1.25.3
```

查看集群健康情况：

```
[root@node1 ~]# kubectl get cs
Warning: v1 ComponentStatus is deprecated in v1.19+
NAME                 STATUS    MESSAGE                         ERROR
etcd-0               Healthy   {"health":"true","reason":""}   
scheduler            Healthy   ok  
controller-manager   Healthy   ok
```

查看kubernetes集群pod运行情况:

```
[root@node1 ~]# kubectl get pods -n kube-system
NAME                            READY   STATUS    RESTARTS   AGE
coredns-565d847f94-bjtlh        1/1     Running   0          20h
coredns-565d847f94-wlxmf        1/1     Running   0          20h
etcd-node1                      1/1     Running   0          20h
kube-apiserver-node1            1/1     Running   0          20h
kube-controller-manager-node1   1/1     Running   0          20h
kube-proxy-bgpz2                1/1     Running   1          20h
kube-proxy-jlltp                1/1     Running   1          20h
kube-proxy-stfrx                1/1     Running   0          20h
kube-scheduler-node1            1/1     Running   0          20h
```

查看集群信息:

```
[root@node1 ~]# kubectl cluster-info
Kubernetes control plane is running at https://192.168.179.4:6443
CoreDNS is running at https://192.168.179.4:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

### 1.5.11 **K8s集群其他一些配置**

当在Worker节点上执行kubectl命令管理时会报如下错误：

```
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

只要把master上的管理文件/etc/kubernetes/admin.conf拷贝到Worker节点的$HOME/.kube/config就可以让Worker节点也可以实现kubectl命令管理。

```
#在Worker节点创建.kube目录
[root@node2 ~]# mkdir /root/.kube
[root@node3 ~]# mkdir /root/.kube

#在master节点做如下操作
[root@node1 ~]# scp /etc/kubernetes/admin.conf node2:/root/.kube/config
[root@node1 ~]# scp /etc/kubernetes/admin.conf node3:/root/.kube/config

#在worker 节点验证
 [root@node2 ~]# kubectl get nodes
NAME    STATUS   ROLES           AGE   VERSION
node1   Ready    control-plane   24h   v1.25.3
node2   Ready    <none>          24h   v1.25.3
node3   Ready    <none>          24h   v1.25.3

[root@node3 ~]# kubectl get nodes
NAME    STATUS   ROLES           AGE   VERSION
node1   Ready    control-plane   24h   v1.25.3
node2   Ready    <none>          24h   v1.25.3
node3   Ready    <none>          24h   v1.25.3
```

此外，无论在Master节点还是Worker节点使用kubenetes 命令时，默认不能自动补全，例如：kubectl describe 命令中describe不能自动补全，使用非常不方便，那么这里配置命令自动补全功能。

在所有的kubernetes节点上安装bash-completion并source执行，同时配置下开机自动source，每次开机能自动补全命令。

```
#安装bash-completion 并 source
yum install -y bash-completion
source /usr/share/bash-completion/bash_completion
kubectl completion bash > ~/.kube/completion.bash.inc
source '/root/.kube/completion.bash.inc' 

#实现用户登录主机自动source ,自动使用命令补全
vim ~/.bash_profile 【加入加粗这一句】
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs
source '/root/.kube/completion.bash.inc'
PATH=$PATH:$HOME/bin

export PATH
```

默认K8S我们只要设置了systemctl enable kubelet 后，会在开机自动启动K8S集群，如果想要停止kubernetes集群，我们可以通过systemctl stop kubelet 命令停止集群，但是必须先将节点上的docker停止，命令如下：

### 1.5.12 **K8s集群启停**

```
systemctl stop docker
```

然后再停止k8s集群：

```
systemctl stop kubelet
```

启动Kubernetes集群步骤如下：

```
# 先启动docker
systemctl start docker

# 再启动kubelet
systemctl start kubelet
```

## 1.6 **Kubernetes集群UI及主机资源监控**

### 1.6.1 **Kubernetes dashboard作用**

通过Kubernetes dashboard能够直观了解Kubernetes集群中运行的资源对象，通过dashboard可以直接管理（创建、删除、重启等操作）资源对象。

### 1.6.2 **获取Kubernetes dashboard资源清单文件**

这里只需要在Kubernetes Master节点上来下载应用资源清单文件即可。这里去github.com 搜索“kubernetes dashboard”即可，找到匹配Kubernetes 版本的dashboard，下载对应版本的dashboard yaml文件。

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/0cddbf7f85004d91afec4b37a36a382d.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/8c8cde92fb3c4208a8da4ae772c5944c.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/d1c47c507a014c2cab5388b06150c29f.png)

```
[root@node1 ~]# mkdir kube-dashboard
[root@node1 ~]# cd kube-dashboard/
[root@node1 kube-dashboard]# wget  https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

![](file:///C:\Temp\ksohtml16136\wps26.jpg)对应yaml文件下载完成后，为了方便后续在容器主机上访问，在yaml文件中添加对应的NodePort类型、端口以及修改登录kubernetes dashboard的用户。

```
#vi recommended.yaml 【只需要添加或修改以下加粗部分】
... ...

kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: NodePort
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30000
  selector:
    k8s-app: kubernetes-dashboard

... ....
---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: kubernetes-dashboard
    namespace: kubernetes-dashboard
```

注意：一定要把原来kind为ClusterRole下的name对应值kubernetes-dashboard修改为cluster-admin，不然进入UI后会报错。

```
#部署Kubernetes dashboard
[root@node1 kube-dashboard]# kubectl apply -f recommended.yaml 

#查看部署是否成功，出现kubenetes-dashboard命名空间即可。
[root@node1 kube-dashboard]# kubectl get ns
NAME                   STATUS   AGE
calico-apiserver       Active   5h33m
calico-system          Active   5h35m
default                Active   23h
kube-node-lease        Active   23h
kube-public            Active   23h
kube-system            Active   23h
kubernetes-dashboard   Active   6s
tigera-operator        Active   5h36m

[root@node1 kube-dashboard]# kubectl get pod,svc -n kubernetes-dashboard
NAME                                             READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-64bcc67c9c-gsqsn   1/1     Running   0          112s
pod/kubernetes-dashboard-5c8bd6b59-x4p8r         1/1     Running   0          112s

NAME                                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.106.178.119   <none>        8000/TCP        112s
service/kubernetes-dashboard        NodePort    10.96.4.46       <none>        443:30000/TCP   113s
```

### 1.6.3 **访问Kubernetes dashboard**

WebUI访问Kubernetes dashboard：[https://192.168.179.4:3000](http://192.168.179.4:3000)0

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/093e784b4abf42f098dfc184a36789c0.png)

选择“Token”，使用如下命令获取Kubernetes的Token:

```
#注意最后的kubernetes-dashboard 为部署dashboard创建的serviceaccounts
[root@node1 kube-dashboard]# kubectl -n kubernetes-dashboard create token kubernetes-dashboard
eyJhbGciOiJSUzI1NiIsImtpZCI6IlFDVlB4Wng3REtPNGZhd05sYnJvbFBWbE9iS2pDYmtEYUZyQ2VaSjA0MjAifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjY3NDgxODQ0LCJpYXQiOjE2Njc0NzgyNDQsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInVpZCI6ImY3ZGQ0YTI1LTEwOTAtNDYyZC04N2JhLTM4NjNlM2Q3MjQxNCJ9fSwibmJmIjoxNjY3NDc4MjQ0LCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQifQ.b0S3YAJrFTUb-pgiPLp3kuB510sL7r9LPvmeO5kXM86ZRJhbGOFsD-CK-ONQnDF2EVAg76YsV_I7Afv_P_RkSspfy0AnBDUFj-LBufocX1cofCHc1_dErVbCQ5MvUsnw67PvpdcZMWuAndYhMVorOIxOc_RxhUM6tre3kuZJ40r2W-8Kbgd4b3HvLeaE2gJNTofn5ChYLkDd7TQYqRtmZN14l6CFZMUSl1dHqSuWhUncNHELhI8uRRD1pfFmMlYrqkZOTqzkw5_czMFrE9yIFKktMqT3wpvRVWFzYZFd9SpGMoQtshKjR3h508N-KG2Ob3PQYbvpBdoap2UjOjQJVg
```

将以上生成的Token复制粘贴到登录的WebUI页面中登录Kubernetes DashBoard。注意：以上token复制时不要有空格。

## 1.7 **Kuberneters 部署案例**

这里为了强化对Kubernetes集群的理解，我们基于Kubernetes集群进行部署nginx服务，nginx服务我们设置2个副本，同时将nginx服务端口80暴露到宿主机上。在kubernetes中，我们可以通过WebUI来添加服务，也可以在命令行中通过应用yaml来部署服务，下面以命令行部署nginx服务为例：

1) **创建资源清单文件**

* **nginx.yaml** **：**

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-test
spec:
  selector:
    matchLabels:
      app: nginx
      env: test
      owner: rancher
  replicas: 2 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: nginx
        env: test
        owner: rancher
    spec:
      containers:
        - name: nginx-test
          image: nginx:1.19.9
          ports:
            - containerPort: 80
```

* **nginx-service.yaml** **：**

```
apiVersion: v1
kind: Service
metadata:
  name: nginx-test
  labels:
    run: nginx
spec:
  type: NodePort
  ports:
  - port: 80
    protocol: TCP
    nodePort: 30080
  selector:
    owner: rancher
```

2) **应用资源清单文件**

```
[root@node1 nginx-test]# kubectl apply -f nginx.yaml
[root@node1 nginx-test]# kubectl apply -f nginx-service.yaml
```

3) **验证**

```
[root@node1 test]# kubectl get all
NAME                              READY   STATUS    RESTARTS   AGE
pod/nginx-test-74845c57fb-7tl86   1/1     Running   0          45s
pod/nginx-test-74845c57fb-qjc6d   1/1     Running   0          45s

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        123m
service/nginx-test   NodePort    10.107.171.29   <none>        80:30204/TCP   21s

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-test   2/2     2            2           45s

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-test-74845c57fb   2         2         2       45s
```

4) **访问验证**

访问任意kubernetes集群的节点30080端口查看nginx服务是正常，例如：浏览器输入node1:30080

![](file:///C:\Temp\ksohtml10300\wps1.jpg)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/ce75b5426f07418d8cd0015726d6ac9e.png)

5) **删除nginix服务**

```
[root@node1 nginx-test]# kubectl delete -f nginx-service.yaml
[root@node1 nginx-test]# kubectl delete -f nginx.yaml
```

## 1.8 **搭建nfs服务**

后续基于Native Kubernetes部署Spark后，提交任务的jar包可以是本地编写的jar，在提交命令时，jar包存放位置不能是单独的本地位置，因为executor以pod方式运行在找对应的jar时无法获取提交任务节点的jar，提交任务的jar路径可以放在hdfs或者nfs路径中，但是需要executor pod能访问到。后续提交jar时选择nfs服务器，所以这里需要搭建nfs服务。

nfs搭建分为nfs-server和nfs-client两部分，节点划分如下：

| **节点IP** | **节点名称** | **nfs-server** | **nfs-client** |
| ---------------- | ------------------ | -------------------- | -------------------- |
| 192.168.179.4    | node1              |                      | ★                   |
| 192.168.179.5    | node2              |                      | ★                   |
| 192.168.179.6    | node3              |                      | ★                   |
| 192.168.179.7    | node4              | ★                   | ★                   |
| 192.168.179.8    | node5              |                      |                      |

详细搭建nfs步骤如下：

1. **在**nfs-server ****节点上安装**** nfs**并配置目录**

```
#node4节点安装nfs-server
[root@node4 harbor]# yum install nfs-utils -y

#node4节点创建/localfolder 目录并配置
[root@node4 ~]# mkdir -p  /localfolder
[root@node4 ~]# vim /etc/exports
/localfolder       *(rw,no_root_squash,sync)

#重启并设置开机启动
[root@node4 ~]# systemctl restart nfs-server
[root@node4 ~]# systemctl enable nfs-server
```

2. **在**nfs-client ****节点上安装**** nfs

```
#在node1~node3节点上安装nfs
[root@node1 ~]# yum install nfs-utils -y
[root@node2 ~]# yum install nfs-utils -y
[root@node3 ~]# yum install nfs-utils -y
```

3. **所有节点验证**nfs**可用性**

```
#node1~node4节点验证nfs可用性
showmount -e 192.168.179.7
```

至此，nfs集群搭建完成。

## 1.9**Harbor构建私有镜像仓库**

在企业中使用Kubernetes时，为了方便下载和管理镜像一般都会构建本地的私有镜像仓库。Harbor正是一个用于存储镜像的企业级Registry服务，我们可以通过Harbor来存储容器镜像构建企业本地的镜像仓库。

这里我们选择一台Kubernetes集群外的一台节点搭建Harbor，当然也可以选择Kubernetes集群内的一台节点。

| **节点IP** | **节点名称** | **Harbor** |
| ---------------- | ------------------ | ---------------- |
| 192.168.179.4    | node1              |                  |
| 192.168.179.5    | node2              |                  |
| 192.168.179.6    | node3              |                  |
| 192.168.179.7    | node4              | ★               |
| 192.168.179.8    | node5              |                  |

1) **安装docker**

```
#准备docker-ce对应的repo文件
[root@node4 ~]# wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo

#安装docker-ce
[root@node4 ~]# yum -y install docker-ce-20.10.9-3.el7


#设置docker开机启动，并启动docker
[root@node4 ~]# systemctl enable docker
[root@node4 ~]# systemctl start docker
```

2) **安装docker-compose**

后续需要docker-compose编排工具进行harbor的启停，这里需要安装docker-compose。

```
#下载docker-compose的二进制文件,改文件如果下载不下来可以参照资料中“docker-compose-Linux-x86_64”文件
[root@node4 ~]# wget https://github.com/docker/compose/releases/download/1.25.0/docker-compose-Linux-x86_64

#移动二进制文件到/usr/bin目录，并更名为docker-compose
[root@node4 ~]# mv docker-compose-Linux-x86_64 /usr/bin/docker-compose

# 为二进制文件添加可执行权限
chmod +x /usr/bin/docker-compose

#以上操作完成后，查看docker-compse版本
[root@node4 ~]# docker-compose version
docker-compose version 1.25.0, build 0a186604
docker-py version: 4.1.0
CPython version: 3.7.4
OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019
```

3. **获取Harbor安装文件并解压**

```
#下载harbor离线安装包，如果下载不下来参考资料中“harbor-offline-installer-v2.5.1.tgz”文件
[root@node4 ~]# wget https://github.com/goharbor/harbor/releases/download/v2.5.1/harbor-offline-installer-v2.5.1.tgz

#解压下载好的安装包
[root@node4 ~]# tar -zxvf ./harbor-offline-installer-v2.5.1.tgz
```

4. **修改Harbor配置文件**

搭建Harbor本地镜像仓库时，可以使用ssl安全访问私有镜像仓库，也可以不使用，直接使用ip访问。

* **准备Harbor的harbor.yml配置文件：**

```
[root@node4 ~]# cd harbor
[root@node4 harbor]# mv harbor.yml.tmpl harbor.yml

```

* **修改harbor.yml文件内容如下：**

```
# Configuration file of Harbor
# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 192.168.179.7

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
#https:
  # https port for harbor, default is 443
 # port: 443
  # The path of cert and key files for nginx
#  certificate: /root/harbor/6864844_kubemsb.com.pem
 # private_key: /root/harbor/6864844_kubemsb.com.key

# # Uncomment following will enable tls communication between all harbor components
# internal_tls:
#   # set enabled to true means internal tls is enabled
#   enabled: true
#   # put your cert and key files on dir
#   dir: /etc/harbor/tls/internal

# Uncomment external_url if you want to enable external proxy
# And when it enabled the hostname will no longer used
# external_url: https://reg.mydomain.com:8433

# The initial password of Harbor admin
# It only works in first time to install harbor
# Remember Change the admin password from UI after launching Harbor.
harbor_admin_password: 123456
... ...
```

注意harbor.yml文件中只需要配置hostname、certificate、private_key、harbor_admin_password即可。

5. **执行预备脚本并安装**

```
#执行预备脚本，检查安装所需镜像
[root@node4 harbor]# ./prepare 
prepare base dir is set to /root/harbor
Clearing the configuration file: /config/portal/nginx.conf
Clearing the configuration file: /config/log/logrotate.conf
Clearing the configuration file: /config/log/rsyslog_docker.conf
Clearing the configuration file: /config/nginx/nginx.conf
Clearing the configuration file: /config/core/env
Clearing the configuration file: /config/core/app.conf
Clearing the configuration file: /config/registry/passwd
Clearing the configuration file: /config/registry/config.yml
Clearing the configuration file: /config/registryctl/env
Clearing the configuration file: /config/registryctl/config.yml
Clearing the configuration file: /config/db/env
Clearing the configuration file: /config/jobservice/env
Clearing the configuration file: /config/jobservice/config.yml
Generated configuration file: /config/portal/nginx.conf
Generated configuration file: /config/log/logrotate.conf
Generated configuration file: /config/log/rsyslog_docker.conf
Generated configuration file: /config/nginx/nginx.conf
Generated configuration file: /config/core/env
Generated configuration file: /config/core/app.conf
Generated configuration file: /config/registry/config.yml
Generated configuration file: /config/registryctl/env
Generated configuration file: /config/registryctl/config.yml
Generated configuration file: /config/db/env
Generated configuration file: /config/jobservice/env
Generated configuration file: /config/jobservice/config.yml
loaded secret from file: /data/secret/keys/secretkey
Generated configuration file: /compose_location/docker-compose.yml
Clean up the input dir

#执行安装脚本
[root@node4 harbor]# ./install.sh 
...
[Step 5]: starting Harbor ...
Creating network "harbor_harbor" with the default driver
Creating harbor-log ... done
Creating registryctl   ... done
Creating harbor-db     ... done
Creating registry      ... done
Creating harbor-portal ... done
Creating redis         ... done
Creating harbor-core   ... done
Creating nginx             ... done
Creating harbor-jobservice ... done
✔ ----Harbor has been installed and started successfully.----
```

6. **验证Harbor情况**

```
#使用docker ps 命令检查是否是运行9个镜像，如下
[root@node4 harbor]# docker ps 
CONTAINER ID   IMAGE                                                                                  a81fbd05dc13   goharbor/harbor-jobservice:v2.5.1                                                      c374cf3d741a   goharbor/nginx-photon:v2.5.1
152c165b0804   goharbor/harbor-core:v2.5.1                                                            4e48926df8b0   goharbor/redis-photon:v2.5.1                                                           6d514441a600   goharbor/harbor-db:v2.5.1                                                              0a170f716955   goharbor/registry-photon:v2.5.1                                                        a8d99c7b2421   goharbor/harbor-portal:v2.5.1                                                          2b808612f108   goharbor/harbor-registryctl:v2.5.1                                                     69c2c7818e6a   goharbor/harbor-log:v2.5.1   
```

注意：安装harbor后，查看对应的 docker images 是否是9个，不是9个需要重新启动harbor。重启Harbor的命令如下：

```
[root@node4 harbor]# cd /root/harbor
#停止harbor服务
[root@node4 harbor]# docker-compose down

#启动harbor服务
[root@node4 harbor]# docker-compose up -d
```

7. **配置Kubernetes节点及harbor节点访问harbor服务**

后续Kubernetes各个节点（包括harbor节点本身）需要连接Harbor上传或者下载镜像，所以这里配置各个节点访问harbor。kubernetes集群所有节点配置harbor仓库（包括harbor节点本身也要配置）：

```
#kubernetes 集群各个节点配置/etc/docker/daemon.json文件，追加"insecure-registries": ["https://www.kubemsb.com"]
vim /etc/docker/daemon.json
{
        "exec-opts": ["native.cgroupdriver=systemd"],
        "insecure-registries": ["https://www.kubemsb.com"]
}

#harbor节点配置 /etc/docker/daemon.json文件
{
  "insecure-registries": ["http://192.168.179.7"]   
}
```

以上配置完成后，配置的每台节点需要重启docker，重点需要注意harbor节点docker重启后是否是对应有9个image，如果不是9个需要使用docker-compose down 停止harbor集群后再次使用命令docker-compse up -d 启动。

```
systemctl restart docker
```

检查每个节点是否能正常连接Harbor，这里每台节点连接harbor前必须需要执行如下命令登录下harbor私有镜像仓库。

```
docker login 192.168.179.7
输入用户：admin
输入密码：123456
```

8. **访问Harbor UI界面**

然后浏览器访问harbor(只能是ip访问)，用户名为admin，密码为配置的123456。

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/3385b90f53db463ba6c742dc2b08ba29.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/b73afe0351014104a0bebd6a4ddfd50e.png)

9. **测试Harbor**

使用docker下载nginx镜像并上传至harbor，然后通过docker从harbor中下载该上传镜像，测试是否能正常从harbor下载存储管理的镜像。具体操作如下：

```
#docker 下载nginx镜像
[root@node1 ~]# docker pull nginx:1.15-alpine

#检查镜像
[root@node1 ~]# docker images
REPOSITORY                                TAG                       IMAGE ID       CREATED        SIZE
nginx                                     1.15-alpine               dd025cdfe837   3 years ago    16.1MB

#对nginx镜像进行标记打tag
[root@node1 ~]# docker tag nginx:1.15-alpine 192.168.179.7/library/nginx:v1

#检查镜像
[root@node1 software]# docker images
REPOSITORY                                TAG                       IMAGE ID       CREATED        SIZE
nginx                                     1.15-alpine               dd025cdfe837   3 years ago    16.1MB
www.kubemsb.com/library/nginx             v1                        dd025cdfe837   3 years ago    16.1MB

#推送本地镜像到harbor镜像仓库
[root@node1 ~]# docker push www.kubemsb.com/library/nginx:v1
```

将本地镜像推送到harbor镜像仓库后，可以通过WebUI查看对应内容：

![](file:///C:\Temp\ksohtml21784\wps21.jpg)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1667826904074/ed61cd24eb7a4b8aa9c55545d6310941.png)

可以在本地任何一台节点上从Harbor镜像仓库中下载镜像到本地：

```
[root@node2 ~]# docker pull 192.168.179.7/library/nginx:v1
```

## 1.10 **Spark基于Kubernetes部署优势**

Spark是新一代分布式内存计算框架，Apache开源的顶级项目。相比于Hadoop Map-Reduce计算框架，Spark将中间计算结果保留在内存中，速度提升10~100倍；同时它还提供更丰富的算子，采用弹性分布式数据集(RDD)实现迭代计算，更好地适用于数据挖掘、机器学习算法，极大提升开发效率。相比于在物理机上部署，在Kubernetes集群上部署Spark集群，具有以下优势：

- **快速部署** ：安装1000台级别的Spark集群，在Kubernetes集群上只需设定worker副本数目replicas=1000，即可一键部署。
- **快速升级** ：升级Spark版本，只需替换Spark镜像，一键升级。
- **弹性伸缩** ：需要扩容、缩容时，自动修改worker副本数目replicas即可。
- **高一致性** ：各个Kubernetes节点上运行的Spark环境一致、版本一致。
- **高可用性** ：如果Spark所在的某些node或pod死掉，Kubernetes会自动将计算任务，转移到其他node或创建新pod。
- **强隔离性** ：通过设定资源配额等方式，可与Web、大数据应用部署在同一集群，提升机器资源使用效率，从而降低服务器成本。

## 1.11 **Spark角色介绍**

下图是Spark框架中对应的角色，每个角色作用如下:

![](RackMultipart20230217-1-cc67zi_html_178ab66d6716895f.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/8457fc89c24741a3a22e4f90796bbb50.png)

- Client ：客户端进程，负责提交作业到Master。
- Master ：Standalone模式中主节点，负责接收Client提交的作业，管理Worker，并命令Worker启动Driver和Executor。
- Worker ：Standalone模式中slave节点上的守护进程，负责管理本节点的资源，定期向Master汇报心跳，接收Master的命令，启动Driver和Executor。
- Driver ： 一个Spark作业运行时包括一个Driver进程，也是作业的主进程，负责作业的解析、生成Stage并调度Task到Executor上，包括 DAGScheduler ， TaskScheduler 。

## 1.12 **Spark任务提交模式**

Spark任务可以运行在多种资源调度框架上，可以基于Standalone、Yarn、Kubernetes进行任务调度，Standalone、Yarn、Kubernetes中运行Spark任务时这些框架主要提供任务所需的计算资源，任务运行也都有Client模式和Cluster模式。

下面以Spark 基于 Standalone集群提交任务为例来介绍Spark任务提交的模式,Spark Standalone集群是Spark自带的资源调度框架，资源由Spark自己管理。

### 1.12.1**Standalone集群搭建**

Standalone集群中有Master和Worker，Standalone集群搭建节点划分如下：

| **节点IP** | **节点名称** | **Master** | **Worker** | **客户端** |
| ---------------- | ------------------ | ---------------- | ---------------- | ---------------- |
| 192.168.179.4    | node1              | ★               |                  |                  |
| 192.168.179.5    | node2              |                  | ★               |                  |
| 192.168.179.6    | node3              |                  | ★               |                  |
| 192.168.179.7    | node4              |                  |                  | ★               |
| 192.168.179.8    | node5              |                  |                  |                  |

详细的搭建步骤如下：

1. **下载** Spark **安装包**

这里在Spark官网中现在Spark安装包，安装包下载地址：https://www.apache.org/dyn/closer.lua/spark/spark-3.3.1/spark-3.3.1-bin-hadoop3.tgz/

2. **上传、解压、修改名称**

这里将下载好的安装包上传至node1节点的""路径，进行解压，修改名称：

```
#解压
[root@node1 ~]# tar -zxvf /software/spark-3.3.1-bin-hadoop3.tgz -C /software/

#修改名称
[root@node1 software]# mv spark-3.3.1-bin-hadoop3 spark-3.3.1
```

3. **配置**conf **文件**

```
#进入conf路径
[root@node1 ~]# cd /software/spark-3.3.1/conf/

#改名
[root@node1 conf]# cp spark-env.sh.template spark-env.sh
[root@node1 conf]# cp workers.template workers

#配置spark-env.sh，在改文件中写入如下配置内容
export SPARK_MASTER_HOST=node1
export SPARK_MASTER_PORT=7077
export SPARK_WORKER_CORES=3
export SPARK_WORKER_MEMORY=3g

#配置workers，在workers文件中写入worker节点信息
node2
node3
```

将以上配置好Spark解压包发送到node2、node3节点上：

```
[root@node1 ~]# cd /software/
[root@node1 software]# scp -r ./spark-3.3.1 node2:/software/
[root@node1 software]# scp -r ./spark-3.3.1 node3:/software/
```

4. **启动集群**

在node1节点上进入"$SPARK\_HOME/sbin"目录中执行如下命令启动集群：

```
#启动集群
[root@node1 ~]# cd /software/spark-3.3.1/sbin/
[root@node1 sbin]# ./start-all.sh 
```

5. **访问**webui

Spark集群启动完成之后，可以在浏览器中输入"http://node1:8080"来查看Spark WebUI：
![](RackMultipart20230217-1-cc67zi_html_978544d7d75c9fae.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/7bfb13b30d5e4efbb09487fb1c22dbfc.png)

在浏览器中输入地址出现以上页面，并且对应的worker状态为Alive，说明Spark Standalone集群搭建成功。

6. Spark Pi 任务提交测试

这里在客户端提交Spark PI任务来进行任务测试，首先在node4节点上传Spark安装包，然后进行任务提交，这里只需要将Spark安装包在node4节点进行解压即可，操作如下：

```
#上传安装包，解压
[root@node4 ~]# cd /software/
[root@node4 software]# tar -zxvf ./spark-3.3.1-bin-hadoop3.tgz 

#提交Spark Pi任务
[root@node4 ~]# cd /software/spark-3.3.1-bin-hadoop3/bin/
[root@node4 bin]# ./spark-submit --master spark://node1:7077 --class org.apache.spark.examples.SparkPi ../examples/jars/spark-examples_2.12-3.3.1.jar 
...
Pi is roughly 3.1410557052785264
...
```

### 1.12.2 **Client模式**

Spark基于Standalone模式提交任务流程如下：

![](RackMultipart20230217-1-cc67zi_html_ad8253af709aea76.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/b0c38807aa9f411098af69ba48b81072.png)

1. client模式提交任务后，会在客户端启动Driver进程。
2. Driver会向Master申请启动Application启动的资源。
3. Master收到请求之后会在对应的Worker节点上启动Executor
4. Executor启动之后，会注册给Driver端，Driver掌握一批计算资源。
5. Driver端将task发送到worker端执行,worker将task执行结果返回到Driver端。

client模式适用于测试调试程序，Driver进程是在客户端启动的，这里的客户端就是指提交应用程序的当前节点。在Driver端可以看到task执行的情况。生产环境下不能使用client模式，原因是假设要提交100个application到集群运行，Driver每次都会在client端启动，那么就会导致客户端100次网卡流量暴增的问题。client模式适用于程序测试，不适用于生产环境，在客户端可以看到task的执行和结果。

standalone-client模式提交任务命令如下：

```
spark-submit --master spark://spark_master_ip:7077 --class xxx jar 参数
或者
spark-submit --master spark://spark_master_ip:7077 --deploy-mode client --class xxx jar 参数
```

### 1.12.3 **Cluster模式**

Spark基于Standalone cluster模式提交任务流程如下:

![](RackMultipart20230217-1-cc67zi_html_6321aae2ba75e80.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/638b6c046c5b4ae9b782e60cf95e7038.png)

1. cluster模式提交应用程序后，会向Master请求启动Driver.
2. Master接受请求，随机在集群一台节点启动Driver进程。
3. Driver启动后为当前的应用程序申请资源。
4. Driver端发送task到worker节点上执行。
5. worker将执行情况和执行结果返回给Driver端。

Spark基于Standalone-Cluster模式提交任务，Driver是随机在一台Worker节点启动的，如果在客户端提交多个Spark application，每个application 都会启动独立的Driver，这些Driver是分散到集群中启动，如果一次提交多个任务，会将单节点网卡流量激增问题分散到集群中，这种模式适用于生产环境，在客户端看不到task执行和结果。可以去webui中查看日志和结果。

standalone-client模式提交任务命令如下：

```
spark-submit --master spark://spark_master_ip:7077 --deploy-mode cluster --class xxx jar 参数
```

## 1.13 **Spark 基于Kubernetes部署**

Spark基于Kubernetes部署分为两种方式。第一种是Spark Standalone集群中的各个角色(Master、Worker)以pod的方式运行在Kubernetes集群中，这种方式这里称作Standalone on Kubernetes 部署；另外一种方式是将Kuberntes 看成资源调度平台，类似于Yarn，直接基于Kubernetes提交任务运行，这种方式这里成为Spark Native Kubernetes部署。

以上两种方式，无论哪一种方式，目前Spark 官方没有提供构建好的Spark镜像，需要我们自己构建镜像。在介绍每种部署方式时进行再介绍镜像构建步骤。

### 1.13.1 **Standalone on Kubernetes部署**

Spark Standalone 集群中有Master和Worker两种角色，基于Kubernetes进行部署，即将两种对象以pod的方式部署到Kubernetes集群中，Master和Worker所需要的资源由Kubernetes集群提供。

#### 1.13.1.1 **构建镜像**

Spark官方没有提供Spark的容器镜像，这里需要自己构建，构建Spark镜像的步骤如下：

1. **下载**Spark**安装包**

在自己使用Dockerfile构建Spark容器镜像时，我们需要添加Spark的安装包，也可以在Dockfile中直接下载，由于速度慢，这里选择手动下载安装包后，通过ADD 命令加入到容器中,通过Dockerfile构建镜像时还需要下载Hadoop安装包并添加到镜像中。在官网下载Spark3.3.1安装包和hadoop3.1.4，下载地址分别为：https://www.apache.org/dyn/closer.lua/spark/spark-3.3.1/spark-3.3.1-bin-hadoop3.tgz/

[https://archive.apache.org/dist/hadoop/common/hadoop-3.1.4/](https://archive.apache.org/dist/hadoop/common/hadoop-3.1.4/)

```
#node1创建/root/spark目录，将下载的Spark安装包和hadoop安装包上传到此路径
[root@node1 ~]# mkdir -p /root/spark && cd spark
[root@node1 spark]# ls
hadoop-3.1.4.tar.gz  spark-3.3.1-bin-hadoop3.tgz
```

2. **编写**Docker File

在/root/spark目录中创建Dockerfile，内容如下：

```
FROM openjdk:8u151

ENV hadoop_version 3.1.4
ENV spark_version 3.3.1

ADD hadoop-3.1.4.tar.gz /opt
ADD spark-3.3.1-bin-hadoop3.tgz /opt

RUN mv /opt/hadoop-3.1.4 /opt/hadoop && mv /opt/spark-3.3.1-bin-hadoop3 /opt/spark && \
    echo HADOOP ${hadoop_version} installed in /opt/hadoop && \
    echo Spark ${spark_version} installed in /opt/spark

ENV SPARK_HOME=/opt/spark
ENV PATH=$PATH:$SPARK_HOME/bin
ENV HADOOP_HOME=/opt/hadoop
ENV PATH=$PATH:$HADOOP_HOME/bin
ENV LD_LIBRARY_PATH=$HADOOP_HOME/lib/native

ADD start-common.sh start-worker start-master /
ADD spark-defaults.conf /opt/spark/conf/spark-defaults.conf

ENV PATH $PATH:/opt/spark/bin
ENV SPARK_WORKER_MEMORY=1024m
ENV SPARK_WORKER_CORES=2
```

3. **上传**Dockerfile构建需要的文件

start-common.sh，内容如下：

```
#!/bin/sh
unset SPARK_MASTER_PORT
export SPARK_DIST_CLASSPATH=$(hadoop classpath)
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/opt/hadoop/lib/native
```

start-master，内容如下：

```
#!/bin/sh
. /start-common.sh
echo "$(hostname -i) spark-master" >> /etc/hosts
/opt/spark/bin/spark-class org.apache.spark.deploy.master.Master --ip spark-master --port 7077 --webui-port 8080
```

start-worker，内容如下：

```
#!/bin/sh
. /start-common.sh

if ! getent hosts spark-master; then
  echo "=== Cannot resolve the DNS entry for spark-master. Has the service been created yet, and is SkyDNS functional?"
  echo "=== See http://kubernetes.io/v1.1/docs/admin/dns.html for more details on DNS integration."
  echo "=== Sleeping 10s before pod exit."
  sleep 10
  exit 0
fi

/opt/spark/bin/spark-class org.apache.spark.deploy.worker.Worker spark://spark-master:7077 --webui-port 8081
```

spark-defaults.conf，内容如下：

```
spark.master                            spark://spark-master:7077
spark.driver.extraLibraryPath           /opt/hadoop/lib/native
#spark.driver.extraClassPath             /opt/spark/jars/hadoop-aws-2.8.2.jar:/opt/spark/jars/aws-java-sdk-1.11.712.jar
#spark.hadoop.fs.s3a.impl                org.apache.hadoop.fs.s3a.S3AFileSystem
#spark.fs.s3a.connection.ssl.enabled     false
#spark.executor.extraJavaOptions         -Dcom.amazonaws.sdk.disableCertChecking=1
spark.app.id                            KubernetesSpark
spark.executor.memory 512m
spark.executor.cores 1
```

以上start-common.sh、start-master、start-worker三个文件上传到/root/spark目录后，需要通过"chmod + x ./对应文件"来增加可执行权限。

```
[root@node1 spark]# chmod +x ./start-common.sh  ./start-master ./start-worker
```

4. **构建**Spark**容器镜像**

执行如下命令，构建Spark容器镜像:

```
#构建spark 容器镜像
[root@node1 spark]# docker build -t myspark:v1 .
...
Successfully built 46cfc6d5f975
Successfully tagged myspark:v1
...

#查看spark 容器镜像
[root@node1 spark]# docker images
REPOSITORY                                TAG           IMAGE ID       CREATED         SIZE
myspark                                   v1            46cfc6d5f975   5 minutes ago   1.21GB
```

注意:以上构建过程中下载openjdk比较慢，可以将资料中打包好的"openjdk.tar"加载到docker中：

```
[root@node1 ~]# docker load -i openjdk.tar
[root@node1 ~]# docker images
openjdk                         8u151     a30a1e547e6d ... ...
```

5. **将镜像上传到** harbor

后续基于Kubernetes部署Spark standalone集群时需要使用该spark容器镜像，需要从harbor私有镜像仓库进行拉取，这里我们将myspark:v1镜像上传至Harbor私有镜像仓库，步骤如下：

```
#给当前镜像打标签
[root@node1 spark]# docker tag myspark:v1 192.168.179.7/library/spark:v1

#上传到harbor
[root@node1 spark]# docker push 192.168.179.7/library/spark:v1
```

登录harbor观察对应的镜像是否上传成功，通过webui观察，上传已经成功。

![](RackMultipart20230217-1-cc67zi_html_c15c30ac660082d4.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/ad532b75beec49a283ff6489bc24e83c.png)

资料中"myspark\_v1.tar"为打包好自定义spark镜像，可以通过以下命令加载到docker中：

```
[root@node1 ~]# docker load -i myspark_v1.tar 
[root@node1 ~]# docker images
...
REPOSITORY                                TAG       IMAGE ID     192.168.179.7/library/spark               v1        f61c90cf4473 
...
```

#### 1.13.1.2  **yaml资源清单文件**

创建/root/spark-standalone-deployment目录:

```
[root@node1 ~]# mkdir -p /root/spark-standalone-deployment
[root@node1 ~]# cd /root/spark-standalone-deployment/
```

在该目录中创建如下yaml资源清单文件：

spark-master-controller.yaml:

```
kind: ReplicationController
apiVersion: v1
metadata:
  name: spark-master-controller
spec:
  replicas: 1
  selector:
    component: spark-master
  template:
    metadata:
      labels:
        component: spark-master
    spec:
      hostname: spark-master-hostname
      subdomain: spark-master-nodeport
      containers:
        - name: spark-master
          image: 192.168.179.7/library/spark:v1
          imagePullPolicy: Always
          command: ["/start-master"]
          ports:
            - containerPort: 7077
            - containerPort: 8080
          resources:
            requests:
              cpu: 100m
```

spark-master-service.yaml:

```
kind: Service
apiVersion: v1
metadata:
  name: spark-master-nodeport
spec:
  ports:
  - name: rest
    port: 8080
    targetPort: 8080
    nodePort: 30080
  - name: submit
    port: 7077
    targetPort: 7077
    nodePort: 30077
  type: NodePort
  selector:
    component: spark-master
---
kind: Service
apiVersion: v1
metadata:
  name: spark-master
spec:
  ports:
    - port: 7077
      name: spark
    - port: 8080
      name: http
  selector:
    component: spark-master

```

spark-worker-controller.yaml:

```
kind: ReplicationController
apiVersion: v1
metadata:
  name: spark-worker-controller
spec:
  replicas: 2
  selector:
    component: spark-worker
  template:
    metadata:
      labels:
        component: spark-worker
    spec:
      containers:
        - name: spark-worker
          image: 192.168.179.7/library/spark:v1
          imagePullPolicy: Always
          command: ["/start-worker"]
          ports:
            - containerPort: 8081
          resources:
            requests:
              cpu: 100m
```

#### 1.13.1.3 **部署yaml资源清单文件**

通过以下命令进行部署以上yaml资源清单文件：

```
#部署yaml资源清单文件
[root@node1 spark-standalone-deployment]# kubectl create -f .

#查看pod启动情况
[root@node1 spark-standalone-deployment]# watch kubectl get all
Every 2.0s: kubectl get all                                                                                              Thu Feb 16 15:09:54 2023

NAME                                READY   STATUS    RESTARTS   AGE
pod/spark-master-controller-gsvdt   1/1     Running   0          13s
pod/spark-worker-controller-hhl2c   1/1     Running   0          13s
pod/spark-worker-controller-lrprt   1/1     Running   0          13s
```

部署完成之后，我们可以登录webui查看对应的Spark Standalone集群启动情况，node1:8080:
![](RackMultipart20230217-1-cc67zi_html_246dd0c1ab1575b.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/d73ae86fdde049f3ab8cfcc81bfe10d7.png)

#### 1.13.1.4 **任务提交及日志查看**

这种Standalone集群部署方式想要提交Spark任务只能进入到pod中进行任务提交。所以这种方式在真实的生产环境中我们也不会使用，官网中也没有给出这种方式的部署方式，这里只用作测试。

1. **Spark Shell**  **执行任务：**

```
#进入容器，执行spark shell
[root@node1 ~]# kubectl exec -it spark-master-controller-gsvdt -- bash
root@spark-master-hostname:/#  /opt/spark/bin/spark-shell
... 
#编程scala代码进行测试
scala> val rdd = sc.makeRDD(List("hello k8s","hello k8s","hello spark"))
rdd: org.apache.spark.rdd.RDD[String] = ParallelCollectionRDD[0] at makeRDD at <console>:23

scala> rdd.flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).collect()
res0: Array[(String, Int)] = Array((spark,1), (k8s,2), (hello,3))
 ...
```

2. **client**模式提交 ****SparkPi**** 任务：

```
#登录master pod
[root@node1 spark-standalone-deployment]#kubectl exec -it spark-master-controller-gsvdt -- bash

#client模式提交任务
root@spark-master-hostname:cd /opt/spark/bin
# ./spark-submit --master spark://spark-master:7077 --deploy-mode client --class org.apache.spark.examples.SparkPi ../examples/jars/spark-examples_2.12-3.3.1.jar 
...
Pi is roughly 3.13439567197836
...

```

3. **cluster**模式提交 ****SparkPi**** 任务：

cluster模式运行，目前只能在webui中看到任务执行完成，在worker节点上运行的Driver(Exector)的日志没有挂载出来，所以 **对应最终的** pi **结果无法查看** ，这里只关注集群模式提交任务命令即可。

```
#登录master pod
[root@node1 ~]# kubectl exec -it spark-master-controller-gsvdt -- bash
root@spark-master-hostname:/# cd /opt/spark/bin/
root@spark-master-hostname:/opt/spark/bin# ./spark-submit --master spark://spark-master:7077 --deploy-mode cluster --driver-memory 512m --class org.apache.spark.examples.SparkPi ../examples/jars/spark-examples_2.12-3.3.1.jar 
```

以上命令执行完成之后结果如下：

![](RackMultipart20230217-1-cc67zi_html_238d575eb517f74c.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/eee6425d23a5459ab4631528746f63e3.png)

注意：执行过程中如果delete对应的yaml资源清单后，pod状态一直为Terminating，可以通过强制删除pod命令删除,命令如下：

```
# --grace-period=0 直接删除 pod
kubectl delete pod xxx -n xxx --force --grace-period=0
```

### 1.13.2 **Spark Native Kubernetes部署**

Spark Native Kubernetes 部署类似于Spark 基于Yarn部署，Kubernetes看成是资源调度中心负责资源调度，运行executor。这种方式部署提交Spark任务可以是client模式提交任务也可以cluster模式提交任务，Spark Native Kuberntes提交任务原理图如下：

![](RackMultipart20230217-1-cc67zi_html_b36f8568ddf71dd1.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/7d3a575ba7d747a194261aa257d7412c.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/80392b13372c457b861c8bdb39168890.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/426325be79c845c4858701e337d8454f.png)

Client提交任务模式中，Driver运行在提交Spark任务的服务器上，也就是客户端，提交任务申请启动的executor以pod方式运行在Kubernetes集群中，当应用程序执行完成后，executor pod被终止被清理，Spark应用程序的日志会在客户端显示。

Cluster提交任务模式中，Driver会以pod的方式运行在Kubernetes集群中，Driver向Kubernetes申请启动Executor，Executor以pod方式运行在Kubernetes集群中，应用程序的日志不能在客户端显示，需要在Kubernetes集群对应的pod中查看日志，当应用程序完成时，执行程序pod将终止并被清理，但Driver pod会保存日志并在Kubernetes API中保持“已完成”状态。

#### 1.13.2.1 **构建并上传镜像**

Spark Native Kubernetes部署模式中官方也没有提供对应的镜像，但是从Spark2.3版本后官方提供了Dockerfile，默认路径在”SPARK_HOME/kubernetes/dockerfiles/spark”路径下，要基于此Dockerfile构建Spark镜像，用户无需关心该Dockerfile文件位置，Spark提供了自动构建Spark镜像脚本，脚本为“SPARK_HOME/bin/docker-image-tool.sh”,只需要运行该脚本会自动构架Spark镜像。

```
#运行docker-image-tool.sh构建镜像
[root@node1 ~]# cd /software/spark-3.3.1-bin-hadoop3/bin/
[root@node1 bin]# ./docker-image-tool.sh  -r 192.168.179.7/library -t v2 build
...
Successfully built c96b8604936f
Successfully tagged 192.168.179.7/library/spark:v2

#检查构建的镜像
[root@node1 bin]# docker images
REPOSITORY                                TAG           IMAGE ID    192.168.179.7/library/spark               v2            c96b8604936f
```

注意以上构建命令参数解释如下:

- -r :指定镜像仓库名称
- -t :指定构建镜像的tag

镜像构建完成后通过以下命令将镜像上传到私有镜像仓库：

```
[root@node1 bin]# docker push 192.168.179.7/library/spark:v2
```

检查上传镜像：

![](RackMultipart20230217-1-cc67zi_html_1dd296a47a985683.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/bf834dfc56d34c55aede4f37ffb29801.png)

#### 1.13.2.2 **配置用户权限**

后续基于Kubernetes提交Spark任务时需要指定用户，Kubernetes是基于角色进行授权，所以这里创建对应的serviceaccount，然后给serviceaccount进行角色赋权。

```
#创建命名空间
[root@node1 ~]# kubectl create ns spark
namespace/spark created

#创建serviceaccount
[root@node1 ~]# kubectl create serviceaccount spark -n spark
serviceaccount/spark created

#给serviceaccount进行角色赋权
[root@node1 ~]# kubectl create clusterrolebinding spark-role --clusterrole=edit --serviceaccount=spark:spark
clusterrolebinding.rbac.authorization.k8s.io/spark-role created
```

#### 1.13.2.3 **client模式任务提交**

client模式提交任务需要在节点上有Spark安装包，使用spark-submit命令进行任务提交，client模式进行任务提交在生产环境中使用较少，作为了解即可。以运行SparkPi任务为例，client模式提交任务命令如下：

```
[root@node1 ~]# cd /software/spark-3.3.1-bin-hadoop3/bin/
./spark-submit \
 --master k8s://https://192.168.179.4:6443 \
 --deploy-mode client \
 --name spark-pi \
 --class org.apache.spark.examples.SparkPi \
 --conf spark.kubernetes.namespace=spark \
 --conf spark.executor.instances=2 \
 --conf spark.kubernetes.container.image=192.168.179.7/library/spark:v2 \
 --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
 --conf spark.driver.host=192.168.179.4 \
 /software/spark-3.3.1-bin-hadoop3/examples/jars/spark-examples_2.12-3.3.1.jar
```

以上提交任务命令参数解释如下：

- --master：指定Kubernetes集群，格式为k8s://https://\<k8s-apiserver-host\>:\<k8s-apiserver-port\>，可以在k8s集群中执行"kubectl cluster-info"来获取k8s-apiserver-host和k8s-apiserver-port。
- --deploy-ment:指定部署模式
- --name:指定应用程序名称
- --class:指定运行主类
- --conf:指定配置
  - spark.kubernetes.namespace：指定使用的Kubernetes的命名空间。
  - spark.executor.instances：运行该Application时申请启动的executor的实例个数。
  - spark.kubernetes.container.image：指定启动Container使用的镜像。
  - spark.kubernetes.authenticate.driver.serviceAccountName：指定操作pod使用的用户。
  - spark.driver.host：指定提交任务的driver地址，这里在哪个节点提交spark任务就写哪个节点的ip即可。

以上命令使用的jar包为节点上用户提供的jar包，提交之后，可以通过以下命令查看kubernetes中启动的executor情况：

```
[root@node1 ~]# watch kubectl get all -n spark
Every 2.0s: kubectl get all -n spark                                                                                     Thu Feb 16 19:09:49 2023

NAME                                   READY   STATUS    RESTARTS   AGE
pod/spark-pi-9a5ebe8659e9d1f0-exec-1   1/1     Running   0          46s
pod/spark-pi-9a5ebe8659e9d1f0-exec-2   1/1     Running   0          45s
```

任务执行完成之后，可以在提交任务的节点(客户端)看到对应PI结果：

```
...
Pi is roughly 3.142755713778569
...
```

#### 1.13.2.4 **cluster模式任务提交**

1. **使用** pod ****内的**** jar **包**

Cluster模式提交任务中，Driver与Exector都是以Pod方式运行在Kubernetes集群中,以运行SparkPi为例，Cluster模式提交任务命令如下：

```
[root@node1 ~]# cd /software/spark-3.3.1-bin-hadoop3/bin/
./spark-submit \
 --master k8s://https://192.168.179.4:6443 \
 --deploy-mode cluster \
 --name spark-pi \
 --class org.apache.spark.examples.SparkPi \
 --conf spark.kubernetes.namespace=spark \
 --conf spark.executor.instances=5 \
 --conf spark.kubernetes.container.image=192.168.179.7/library/spark:v2 \
 --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
 local:///opt/spark/examples/jars/spark-examples_2.12-3.3.1.jar
```

以上执行SparkPi任务jar包以local://xxx 方式指定，local方式是pod镜像内的路径，这里指Driver对应pod内的jar包路径，在对应启动的executor pod中由于使用镜像都一样，所以该jar同样都存在于各个exeutor pod中。

命令执行之后，可以观察，kubernetes集群spark命名空间下的pod：

```
[root@node1 ~]# watch kubectl get all -n spark
Every 2.0s: kubectl get all -n spark                                                                                     Thu Feb 16 19:31:43 2023

NAME                                   READY   STATUS      RESTARTS   AGE
pod/spark-pi-467c6b8659fe633c-exec-1   1/1     Running     0          12s
pod/spark-pi-467c6b8659fe633c-exec-2   1/1     Running     0          12s
pod/spark-pi-467c6b8659fe633c-exec-3   1/1     Running     0          12s
pod/spark-pi-467c6b8659fe633c-exec-4   0/1     Pending     0          12s
pod/spark-pi-467c6b8659fe633c-exec-5   0/1     Pending     0          12s
pod/spark-pi-d3e33d8659fe3a9b-driver   1/1     Running     0          22s

#等待任务执行完成后，可以最终看到
NAME                                   READY   STATUS	   RESTARTS   AGE
pod/spark-pi-d3e33d8659fe3a9b-driver   0/1     Completed   0          2m40s
```

Spark Application执行的结果在客户端看不到，需要通过Kubernetes集群pod日志来查看，WebUI访问Kubernetes dashboard：[https://192.168.179.4:3000](http://192.168.179.4:3000/)0：

![](RackMultipart20230217-1-cc67zi_html_98741c5d053c7504.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/29ec6a81c8cf42e58a02c42e75751aca.png)

需要提供token，在Kubernetes集群中任意一台节点执行如下命令查询临时token:

```
#注意最后的kubernetes-dashboard 为部署dashboard创建的serviceaccounts
[root@node1 kube-dashboard]# kubectl -n kubernetes-dashboard create token kubernetes-dashboard
eyJhbGciOiJSUzI1NiIsImtpZCI6IktKSkJla1plMTJ6VHpNTmgxVG42OC1jaktuR1dOSzNqeHpWajRBQUZLZ1kifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjc2NTUxMjUzLCJpYXQiOjE2NzY1NDc2NTMsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInVpZCI6ImM2ZDg0NjJiLWI0YTItNDQyZC04ZDg2LTAyODc5ZDhkZmZiNCJ9fSwibmJmIjoxNjc2NTQ3NjUzLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQifQ.XRLNTx39s1hRcy8hbYFEwFp7JKoDBqd7XzKGieB5SPFeXXDiK6i4DHorg51H0CrxIejGeRJclwiCMk4UPtWM2Yxd07gchCouxsfxMxs4HEK5r1X-eeBv7BlBboZjAjldlhCV6v5cE2yxJkm0BSWOU91zMruRy0q4bzCFxP9mYPPovcaVAWah7EtBytqwuo0aGBM_XeJSmoXKrpApSTaeD5sBzfdsNMu4nhx4Tg8piBlaOALUKgko96ZusyrNokpEwMFyKX5q33vYNFs28tNQR8Nf45xLDTnCdGnOVmBWCSMYD7fxRe56fsPtHkZs7SHOfUWOvRu0QZM2KxntHceThw
```

登录webui后查看对应pod日志：

![](RackMultipart20230217-1-cc67zi_html_f9b9bf17caf6ae89.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/f416db97747047b1b2a715efeeff599a.png)

![](RackMultipart20230217-1-cc67zi_html_6b9675730f08729b.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/a37255eda96142ae8c0a7e4220733665.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/e9a10f64114249c3b2f3561678dfb4fb.png)

2. **使用**pod ****外用户提供的**** jar**包**

如果想要使用用户自己的jar包运行任务，需要保证Driver和Executor对应的pod能访问到该jar包，一般可以基于Kubernetes构建通用的HDFS集群，将jar包提交到基于K8s的集群中，那么运行的Driver和Executor pod自然就能访问到该jar。也可以通过一些命令将k8s集群外的jar包通过挂载方式挂载到Driver和Executor对应的pod中。

目前k8s集群中没有HDFS集群，这里我们使用挂载的方式将用户jar包挂载到各个pod中，由于每个pod不一定启动在k8s集群哪个节点，所以这里挂载的文件类型我们选择nfs，这样无论pod启动在k8s集群哪个节点都能访问到统一的nfs目录。

前面我们已经搭建过nfs集群，nfs-server节点是node4节点，nfs公共目录为：/localfolder，现在我们将位于k8s集群外的"spark-examples\_2.12-3.3.1.jar"看做用户提供的jar，上传到node4节点的nfs公共目录/localfolder中，这样在基于Kubernetes以Cluster模式提交Spark任务时，可以通过参数方式指定挂载到Driver和Executor的路径为该nfs公共目录路径，这样各个pod就能访问到用户提供的jar包。

首先将"spark-examples\_2.12-3.3.1.jar"放在node4节点/localfolder目录下：

```
[root@node1 ~]# scp /software/spark-3.3.1-bin-hadoop3/examples/jars/spark-examples_2.12-3.3.1.jar  node4:/localfolder
```

以运行SparkPi任务为例，Cluster模式提交任务命令如下：

```
[root@node1 ~]# cd /software/spark-3.3.1-bin-hadoop3/bin/
./spark-submit \
 --master k8s://https://192.168.179.4:6443 \
 --deploy-mode cluster \
 --name spark-pi \
 --class org.apache.spark.examples.SparkPi \
 --conf spark.kubernetes.namespace=spark \
 --conf spark.executor.instances=5 \
 --conf spark.kubernetes.container.image=192.168.179.7/library/spark:v2 \
 --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
 --conf spark.kubernetes.driver.volumes.nfs.up-jars.options.server=192.168.179.7 \
 --conf spark.kubernetes.driver.volumes.nfs.up-jars.options.path=/localfolder \
 --conf spark.kubernetes.driver.volumes.nfs.up-jars.mount.path=/localfolder \
 --conf spark.kubernetes.executor.volumes.nfs.up-jars.options.server=192.168.179.7 \
 --conf spark.kubernetes.executor.volumes.nfs.up-jars.options.path=/localfolder \
 --conf spark.kubernetes.executor.volumes.nfs.up-jars.mount.path=/localfolder \
 local:///localfolder/spark-examples_2.12-3.3.1.jar
```

以上任务提交--conf执行的参数解释如下：

- spark.kubernetes.namespace：指定使用的命名空间
- spark.executor.instances：指定启动executor pod实例个数
- spark.kubernetes.container.image:指定container使用的镜像地址
- spark.kubernetes.authenticate.driver.serviceAccountName:指定操作pod的用户
- spark.kubernetes.driver.volumes.nfs.up-jars.options.server:指定driver pod 挂载使用的nfs服务器地址
- spark.kubernetes.driver.volumes.nfs.up-jars.options.path:指定driver pod 挂载使用的nfs服务器共享目录
- spark.kubernetes.driver.volumes.nfs.up-jars.mount.path：指定nfs 目录挂载到driver pod 的路径
- spark.kubernetes.executor.volumes.nfs.up-jars.options.server:指定executor pod 挂载使用的nfs服务器地址
- spark.kubernetes.executor.volumes.nfs.up-jars.options.path:指定executor pod 挂载使用的nfs服务器共享目录
- spark.kubernetes.executor.volumes.nfs.up-jars.mount.path:指定nfs 目录挂载到executor pod 的路径

更多参数可以参考官网：https://spark.apache.org/docs/latest/running-on-kubernetes.html#configuration

任务提交之后可以观察kubernetes集群spark命名空间中pod启动情况:

```
[root@node1 ~]# watch kubectl get all -n spark
Every 2.0s: kubectl get all -n spark                                                                                     Thu Feb 16 20:19:58 2023

NAME                                   READY   STATUS             RESTARTS   AGE
pod/spark-pi-e29c77865a2ab033-exec-1   1/1     Running            0          3s
pod/spark-pi-e29c77865a2ab033-exec-2   1/1     Running            0          3s
pod/spark-pi-e29c77865a2ab033-exec-3   0/1     Pending            0          3s
pod/spark-pi-e29c77865a2ab033-exec-4   0/1     Pending            0          3s
pod/spark-pi-e29c77865a2ab033-exec-5   0/1     Pending            0          3s
pod/spark-pi-eee459865a2a8a5e-driver   1/1     Running            0          13s

#等待一段时间后，可以看到driver运行完成
pod/spark-pi-eee459865a2a8a5e-driver   0/1     Completed      0          52s
```

查看对应运行结果，也需要登录Kubernetes webui中找到对应的pod查看日志。登录Kubernetes Webui https://node1:30000查看日志:

![](RackMultipart20230217-1-cc67zi_html_60c0c4d056822a51.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/ce20c6f171eb4ef58c6f073d6c331b1d.png)

执行如下命令获取token:

```
#注意最后的kubernetes-dashboard 为部署dashboard创建的serviceaccounts
[root@node1 kube-dashboard]# kubectl -n kubernetes-dashboard create token kubernetes-dashboard
eyJhbGciOiJSUzI1NiIsImtpZCI6IktKSkJla1plMTJ6VHpNTmgxVG42OC1jaktuR1dOSzNqeHpWajRBQUZLZ1kifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjc2NTUxMjUzLCJpYXQiOjE2NzY1NDc2NTMsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInVpZCI6ImM2ZDg0NjJiLWI0YTItNDQyZC04ZDg2LTAyODc5ZDhkZmZiNCJ9fSwibmJmIjoxNjc2NTQ3NjUzLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQifQ.XRLNTx39s1hRcy8hbYFEwFp7JKoDBqd7XzKGieB5SPFeXXDiK6i4DHorg51H0CrxIejGeRJclwiCMk4UPtWM2Yxd07gchCouxsfxMxs4HEK5r1X-eeBv7BlBboZjAjldlhCV6v5cE2yxJkm0BSWOU91zMruRy0q4bzCFxP9mYPPovcaVAWah7EtBytqwuo0aGBM_XeJSmoXKrpApSTaeD5sBzfdsNMu4nhx4Tg8piBlaOALUKgko96ZusyrNokpEwMFyKX5q33vYNFs28tNQR8Nf45xLDTnCdGnOVmBWCSMYD7fxRe56fsPtHkZs7SHOfUWOvRu0QZM2KxntHceThw
```

登录之后，找打对应spark命名空间，查看对应pod日志如下：

![](RackMultipart20230217-1-cc67zi_html_8d45567ad274bf37.png)![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1676618640055/0bf82f31aa7643b4941996f47b304b9b.png)
