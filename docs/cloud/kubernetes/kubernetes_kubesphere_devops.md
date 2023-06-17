# Kubesphere应用前 账号准备



# 一、Docker Hub账号注册

![image-20221026164044647](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164044647.png)





![image-20221026164119433](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164119433.png)





![image-20221026164158778](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164158778.png)



![image-20221026164540247](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164540247.png)



![image-20221026164602299](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164602299.png)





![image-20221026164638283](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164638283.png)





![image-20221026164728173](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164728173.png)



# 二、GitHub账号注册



![image-20221026164905539](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026164905539.png)



![image-20221026165212818](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165212818.png)



![image-20221026165307549](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165307549.png)



![image-20221026165328295](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165328295.png)





![image-20221026165349757](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165349757.png)



![image-20221026165432544](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165432544.png)



![image-20221026165842535](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165842535.png)





![image-20221026165919225](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165919225.png)



![image-20221026165949811](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026165949811.png)



![image-20221026170055031](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026170055031.png)



![image-20221026170144901](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026170144901.png)





![image-20221026170249245](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026170249245.png)



# 基于Kubesphere实现DevOps

# 一、DevOps介绍

## 1.1 项目开发需要考虑的维度

- dev 怎么开发

- ops 怎么运维




> 参考项目链接：https://github.com/kubesphere/devops-maven-sample



## 1.2 DevOps是什么

![image-20221026122520801](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026122520801.png)





# 二、CI/CD介绍



![image-20221031094406755](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031094406755.png)



## 2.1 持续集成（Continuous Integration）

持续集成是指软件个人的部分向软件整体部分交付，频繁进行集成以便更快地发现其中错误。

CI需要具备这些：

- 全面的自动化测试 

这是实践持续集成&持续部署的基础，同时，选择合适的自动化测试工具也很重要

- 灵活的基础设施

容器、虚拟机的存在让开发人员和QA人员不必再大费周张去做IT基础设施环境的准备

- 版本控制工具

如：Git、SNV、Gitlab等

- 自动化的构建和软件发布流程工具

如：Jenkins Gitlab Tekton等

- 反馈机制

如果构建/测试失败，可以快速地反馈到相关负责人，以尽快速度解决问题，实现软件开发稳定版本推出。



## 2.2 持续交付（Continuous Delivery ）

持续交付在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境的类生产环境中，持续交付优先于整个产品生命周期的软件部署，建立在高水平自动化持续集成之上。

- 快速发布

能够应对业务需求，并更快地实现软件价值，实现编码、测试、上线、交付的频繁迭代周期缩短，同时获得迅速反馈

- 高质量软件发布标准 

整个交付过程标准化、可重复、可靠

- 整个交付过程进度可视化

方便团队成员了解项目成熟度

- 更先进的团队协作方式

从需求分析、产品的用户体验到交互设计、开发、测试、运维等角色密切协作，相比于传统的的开发模式，减少浪费



## 2.3 持续部署（Continuous Deployment）

持续部署是指当交付的代码通过评审之后，自动部署到生产环境中。

持续部署是持续交付的最高阶段。这就意味着，所有通过了一系列的自动化测试的发动都将自动部署到生产环境。它也可以被称为Continuous Release

持续部署主要好处是，可以相对独立地部署新的功能，并能快速地收集真实用户的反馈。





![image-20221026121709183](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221026121709183.png)



# 三、KubeSphere DevOps凭证管理



## 3.1 凭证介绍

凭证是包含敏感信息的对象，例如用户名和密码、SSH 密钥和令牌 (Token)。当 KubeSphere DevOps 流水线运行时，会与外部环境中的对象进行交互，以执行一系列任务，包括拉取代码、推送和拉取镜像以及运行脚本等。此过程中需要提供相应的凭证，而这些凭证不会明文出现在流水线中。

具有必要权限的 DevOps 项目用户可以为 Jenkins 流水线配置凭证。用户在 DevOps 项目中添加或配置这些凭证后，便可以在 DevOps 项目中使用这些凭证与第三方应用程序进行交互。

目前，您可以在 DevOps 项目中创建以下 4 种类型的凭证：

- **用户名和密码**：用户名和密码，可以作为单独的组件处理，或者作为用冒号分隔的字符串（格式为 `username:password`）处理，例如 GitHub、GitLab 和 Docker Hub 的帐户。
- **SSH 密钥**：带有私钥的用户名，SSH 公钥/私钥对。
- **访问令牌**：具有访问权限的令牌。
- **kubeconfig**：用于配置跨集群认证。如果选择此类型，将自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充在当前页面对话框中。

本教程演示如何在 DevOps 项目中创建和管理凭证。有关如何使用凭证的更多信息，请参见[使用 Jenkinsfile 创建流水线](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)和[使用图形编辑面板创建流水线](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/create-a-pipeline-using-graphical-editing-panel/)。



## 3.2 准备工作

- 您已启用 [KubeSphere DevOps 系统](https://v3-2.docs.kubesphere.io/zh/docs/pluggable-components/devops/)。
- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参见[创建企业空间、项目、用户和角色](https://v3-2.docs.kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。



## 3.3 创建凭证

以 `project-regular` 身份登录 KubeSphere 控制台。进入您的 DevOps 项目，选择**凭证**，然后点击**创建**。



### 3.3.1 创建 Docker Hub 凭证

1. 在弹出的对话框中输入以下信息。
   - **名称**：设置可以在流水线中使用的 ID，例如 `dockerhub-id`。
   - **类型**：选择**用户名和密码**。
   - **用户名**：您的 Docker Hub 帐户（即 Docker ID）。
   - **密码/令牌**：您的 Docker Hub 密码。
   - **描述信息**：凭证的简介。
2. 完成操作后点击**确定**。



![image-20221027165442735](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027165442735.png)

![image-20221027165531852](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027165531852.png)



![image-20221027165550931](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027165550931.png)





### 3.3.2 创建 GitHub 凭证

同样地，按照上述相同步骤创建 GitHub 凭证。设置不同的**名称**（例如 `github-id`），**类型**同样选择**用户名和密码**。分别在**用户名**和 **密码/令牌**中输入您的 GitHub 用户名和令牌。



>- 自 2021 年 8 月起，GitHub 要求使用基于令牌的身份验证，此处需要输入令牌，而非 GitHub 密码。关于如如何生成令牌，请参阅[创建个人访问令牌](https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)。
>- 如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。



![image-20221027165713572](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027165713572.png)



![image-20221027170151637](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027170151637.png)







### 3.3.3 创建 kubeconfig 凭证

同样地，按照上述相同步骤创建 kubeconfig 凭证。设置不同的凭证 ID（例如 `demo-kubeconfig`）并选择 **kubeconfig**。



>用于配置集群访问的文件称为 kubeconfig 文件。这是引用配置文件的通用方法。有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)。您可以创建 kubeconfig 凭证来访问当前 Kubernetes 集群，该凭证将在流水线中使用。您不需要更改该文件，因为 KubeSphere 会自动使用当前 Kubernetes 集群的 kubeconfig 填充该字段。访问其他集群时，您可能需要更改 kubeconfig。





![image-20221027170223311](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027170223311.png)

![image-20221027170323070](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027170323070.png)





### 3.3.4 查看和管理凭证

1. 凭证创建后，会在列表中显示。
2. 点击任意一个凭证，进入其详情页面，您可以查看帐户详情和与此凭证相关的所有事件。
3. 您也可以在此页面上编辑或删除凭证。请注意，编辑凭证时，KubeSphere 不会显示现有用户名或密码信息。如果输入新的用户名和密码，则前一个将被覆盖。





# 四、将SonarQube集成到流水线

[SonarQube](https://www.sonarqube.org/) 是一种主流的代码质量持续检测工具。您可以将其用于代码库的静态和动态分析。SonarQube 集成到 KubeSphere 流水线后，如果在运行的流水线中检测到问题，您可以直接在仪表板上查看常见代码问题，例如 Bug 和漏洞。



## 4.1 准备工作

您需要[启用 KubeSphere DevOps 系统](https://v3-2.docs.kubesphere.io/zh/docs/pluggable-components/devops/)。



## 4.2 安装 SonarQube 服务器

要将 SonarQube 集成到您的流水线，必须先安装 SonarQube 服务器。

1.请先安装 Helm，以便后续使用该工具安装 SonarQube。例如，运行以下命令安装 Helm 3：

~~~powershell
# curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
~~~



2.查看helm版本



~~~powershell
# helm version

version.BuildInfo{Version:"v3.10.1", GitCommit:"9f88ccb6aee40b9a0535fcc7efea6055e1ef72c9", GitTreeState:"clean", GoVersion:"go1.18.7"}
~~~



3.执行以下命令安装 SonarQube 服务器

~~~powershell
# helm upgrade --install sonarqube sonarqube --repo https://charts.kubesphere.io/main -n kubesphere-devops-system  --create-namespace --set service.type=NodePort
~~~



4.您会获取以下提示内容

~~~powershell
[root@k8s-master01 ~]# kubectl get svc -n kubesphere-devops-system
NAME                            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE
devops-apiserver                ClusterIP   10.96.2.56    <none>        9090/TCP         5d16h
devops-jenkins                  NodePort    10.96.1.111   <none>        80:30180/TCP     5d16h
devops-jenkins-agent            ClusterIP   10.96.2.94    <none>        50000/TCP        5d16h
s2ioperator-metrics-service     ClusterIP   10.96.2.41    <none>        8080/TCP         5d16h
s2ioperator-trigger-service     ClusterIP   10.96.2.217   <none>        8081/TCP         5d16h
sonarqube-postgresql            ClusterIP   10.96.2.172   <none>        5432/TCP         3m38s
sonarqube-postgresql-headless   ClusterIP   None          <none>        5432/TCP         3m38s
sonarqube-sonarqube             NodePort    10.96.0.120   <none>        9000:30058/TCP   3m38s
webhook-server-service          ClusterIP   10.96.3.74    <none>        443/TCP          5d16h
~~~



## 4.3 获取 SonarQube 控制台地址



1.执行以下命令以获取 SonarQube NodePort

~~~powershell
# export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
~~~



~~~powershell
# export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
~~~



~~~powershell
# echo http://$NODE_IP:$NODE_PORT
~~~



2.您可以获得如下输出（本示例中端口号为 `30058`，可能与您的端口号不同）



~~~powershell
http://192.168.10.141:30058
~~~



## 4.4 配置 SonarQube 服务器



### 4.4.1 访问 SonarQube 控制台

1.执行以下命令查看 SonarQube 的状态。请注意，只有在 SonarQube 启动并运行后才能访问 SonarQube 控制台。



~~~powershell
[root@k8s-master01 ~]# kubectl get pods -n kubesphere-devops-system
NAME                                  READY   STATUS      RESTARTS         AGE
sonarqube-postgresql-0                1/1     Running     0                37m
sonarqube-sonarqube-df8d79d5c-hxxbx   1/1     Running     10 (2m34s ago)   37m
~~~



2.在浏览器中访问 SonarQube 控制台 `http://<Node IP>:<NodePort>`。



![image-20221027180700822](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027180700822.png)



3.点击右上角的 **Log in**，然后使用默认帐户 `admin/admin` 登录。

>取决于您的实例的部署位置，您可能需要设置必要的端口转发规则，并在您的安全组中放行该端口，以便访问 SonarQube。



![image-20221027180719770](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027180719770.png)



![image-20221027180859117](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027180859117.png)



### 4.4.2 创建 SonarQube 管理员令牌 (Token)



1.点击右上角字母 **A**，然后从菜单中选择 **My Account** 以转到 **Profile** 页面。



![image-20221027181023772](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027181023772.png)





![image-20221027181046300](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027181046300.png)



2.点击 **Security** 并输入令牌名称，例如 `kubesphere`。



![image-20221027181424797](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027181424797.png)



3.点击 **Generate** 并复制此令牌。

![image-20221027181543213](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027181543213.png)



~~~powershell
c3ee79a4c4b25bd03867db735dc439e3bb726426
~~~



>如提示所示，您无法再次查看此令牌，因此请确保复制成功。



### 4.4.3  创建 Webhook 服务器



1.执行以下命令获取 SonarQube Webhook 的地址



~~~powershell
# export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
~~~



~~~powershell
# export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
~~~



~~~powershell
# echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
~~~



2.输出结果



~~~powershell
http://192.168.10.141:30180/sonarqube-webhook/
~~~



3.依次点击 **Administration**、**Configuration** 和 **Webhooks** 创建一个 Webhook



![image-20221027182301953](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027182301953.png)



4.点击 **Create**



![image-20221027182342776](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027182342776.png)

5.在弹出的对话框中输入 **Name** 和 **Jenkins Console URL**（即 SonarQube Webhook 地址）。点击 **Create** 完成操作。



![image-20221027182504582](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027182504582.png)





![image-20221027182526782](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027182526782.png)





### 4.4.4 将 SonarQube 配置添加到 ks-installer



1.执行以下命令编辑 `ks-installer`



~~~powershell
# kubectl edit cc -n kubesphere-system ks-installer
~~~



2.搜寻至 `devops`。添加字段 `sonarqube` 并在其下方指定 `externalSonarUrl` 和 `externalSonarToken`。



~~~powershell
devops:
    enabled: true
    jenkinsJavaOpts_MaxRAM: 2g
    jenkinsJavaOpts_Xms: 512m
    jenkinsJavaOpts_Xmx: 512m
    jenkinsMemoryLim: 2Gi
    jenkinsMemoryReq: 1500Mi
    jenkinsVolumeSize: 8Gi
    sonarqube:
      externalSonarUrl: http://192.168.10.141:30058
      externalSonarToken: c3ee79a4c4b25bd03867db735dc439e3bb726426
~~~



3.完成操作后保存此文件



### 4.4.5 将 SonarQube 服务器添加至 Jenkins

1.执行以下命令获取 Jenkins 的地址



~~~powershell
# export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
~~~



~~~powershell
# export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
~~~



~~~powershell
# echo http://$NODE_IP:$NODE_PORT
~~~



2.可以获得以下输出，获取 Jenkins 的端口号



~~~powershell
http://192.168.10.141:30180
~~~



3.请使用地址 `http://<Node IP>:30180` 访问 Jenkins。安装 KubeSphere 时，默认情况下也会安装 Jenkins 仪表板。此外，Jenkins 还配置有 KubeSphere LDAP，这意味着您可以直接使用 KubeSphere 帐户（例如 `admin/P@88w0rd`）登录 Jenkins。有关配置 Jenkins 的更多信息，请参见 [Jenkins 系统设置](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/jenkins-setting/)。



> 取决于您的实例的部署位置，您可能需要设置必要的端口转发规则，并在您的安全组中放行端口 `30180`，以便访问 Jenkins。



![image-20221027183806808](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027183806808.png)



4.可以前往**系统管理**下的 **Manage Credentials** 并点击 **Stores scoped to Jenkins** 下的 **Jenkins**，再点击**全局凭据 (unrestricted)**，然后点击左侧导航栏的**添加凭据**，参考上方第二张截图用 SonarQube 管理员令牌添加凭证。添加凭证后，从 **Server authentication token** 旁边的下拉列表中选择该凭证。

![image-20221027185005042](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185005042.png)



![image-20221027185200948](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185200948.png)



![image-20221027185246499](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185246499.png)



![image-20221027185323676](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185323676.png)



![image-20221027185345516](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185345516.png)





![image-20221027185807991](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185807991.png)







![image-20221027185836783](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027185836783.png)





5.点击左侧导航栏中的**系统管理**



![image-20221027184323977](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027184323977.png)



6.向下翻页找到并点击**系统配置**



![image-20221027184409988](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027184409988.png)



6.搜寻到**SonarQube Server**,然后点击Add SonarQube



![image-20221027184516685](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027184516685.png)









7.输入 **Name** 和 **Server URL** (`http://<Node IP>:<NodePort>`)。点击**添加**，选择 **Jenkins**，然后在弹出的对话框中用 SonarQube 管理员令牌创建凭证（如下方第二张截图所示）。创建凭证后，从 **Server authentication token** 旁边的下拉列表中选择该凭证。点击**应用**完成操作。





![image-20221027190142850](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027190142850.png)



### 4.4.6 将 sonarqubeURL 添加到 KubeSphere 控制台

您需要指定 `sonarqubeURL`，以便可以直接从 KubeSphere 控制台访问 SonarQube

1.执行以下命令



~~~powershell
# kubectl edit  cm -n kubesphere-system  ks-console-config
~~~



2.搜寻到 `data.client.enableKubeConfig`，在下方添加 `devops` 字段并指定 `sonarqubeURL`



~~~powershell
apiVersion: v1
data:
  local_config.yaml: |
    server:
      http:
        hostname: localhost
        port: 8000
        static:
          production:
            /public: server/public
            /assets: dist/assets
            /dist: dist
      redis:
        port: 6379
        host: redis.kubesphere-system.svc
      redisTimeout: 5000
      sessionTimeout: 7200000
    client:
      version:
        kubesphere: v3.1.0
        kubernetes: v1.24.0
        openpitrix: v3.1.0
      enableKubeConfig: true
      devops: 手动添加
        sonarqubeURL: http://192.168.10.141:30058
    defaultClusterName: default

~~~



3.保存该文件



### 4.4.7 重启服务



~~~powershell
# kubectl -n kubesphere-devops-system rollout restart deploy devops-apiserver
~~~



~~~powershell
# kubectl -n kubesphere-system rollout restart deploy ks-console
~~~



### 4.4.8 为新项目创建 SonarQube Token

需要一个 SonarQube 令牌，以便您的流水线可以在运行时与 SonarQube 通信。



1.在 SonarQube 控制台上，点击 **Create new project**。



![image-20221027225949333](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027225949333.png)





![image-20221027230313253](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230313253.png)





![image-20221027230416982](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230416982.png)



![image-20221027230540439](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230540439.png)





![image-20221027230601587](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230601587.png)



~~~powershell
4c5c650e18a80f699d5301773230773ad6e17924
~~~



2.创建令牌后，点击 **Continue**



![image-20221027230705284](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230705284.png)



3.分别选择 **Java** 和 **Maven**。

> 复制下图所示绿色框中的序列号，如果要在流水线中使用，则需要在[凭证](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/credential-management/#创建凭证)中添加此序列号。



![image-20221027230847094](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230847094.png)



![image-20221027230917037](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027230917037.png)



~~~powershell
mvn sonar:sonar \
  -Dsonar.projectKey=java-demo \
  -Dsonar.host.url=http://192.168.10.141:30058 \
  -Dsonar.login=4c5c650e18a80f699d5301773230773ad6e17924
~~~





# 五、为 KubeSphere 流水线设置电子邮件服务器

内置 Jenkins 无法与平台通知系统共享相同的电子邮件配置。因此，您需要单独为 KubeSphere DevOps 流水线配置电子邮件服务器设置。

## 5.1 准备工作

- 您需要启用 [KubeSphere DevOps 系统](https://v3-2.docs.kubesphere.io/zh/docs/pluggable-components/devops/)。
- 您需要一个具有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台或者创建具有该权限的新角色并将该角色分配给一个用户。



## 5.2 设置电子邮件服务器

1.点击左上角的**平台管理**，然后选择**集群管理**。

2.如果您已经启用[多集群功能](https://v3-2.docs.kubesphere.io/zh/docs/multicluster-management/)并已导入成员集群，那么您可以选择一个特定集群以查看其节点。如果尚未启用该功能，请直接参考下一步。

3.转到**应用负载**下的**工作负载**，然后从下拉列表中选择 **kubesphere-devops-system** 项目。点击 `devops-jenkins` 右侧的 ![img](https://v3-2.docs.kubesphere.io/images/docs/common-icons/three-dots.png) 并选择**编辑 YAML** 以编辑其 YAML 配置文件。

![image-20221027232346190](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027232346190.png)



4.向下滚动到下图所示的需要指定的字段。完成修改后，点击**确定**以保存。



>在 `devops-jenkins` 部署 (Deployment) 中修改电子邮件服务器后，它会重新启动。因此，DevOps 系统将在几分钟内不可用，请在适当的时候进行此类修改。



![设置电子邮件](../../img/kubernetes/kubernetes_kubesphere_devops/set-jenkins-email.png)



| 环境变量名称    | 描述信息                  |
| :-------------- | :------------------------ |
| EMAIL_SMTP_HOST | SMTP 服务器地址           |
| EMAIL_SMTP_PORT | SMTP 服务器端口（如：25） |
| EMAIL_FROM_ADDR | 电子邮件发件人地址        |
| EMAIL_FROM_NAME | 电子邮件发件人姓名        |
| EMAIL_FROM_PASS | 电子邮件发件人密码        |
| EMAIL_USE_SSL   | 是否启用 SSL 配置         |

实际配置：

![image-20221027232704794](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027232704794.png)





![image-20221027232744625](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221027232744625.png)





# 六、使用图形编辑面板创建流水线



KubeSphere 中的图形编辑面板包含用于 Jenkins [阶段 (Stage)](https://www.jenkins.io/zh/doc/book/pipeline/#阶段) 和[步骤 (Step)](https://www.jenkins.io/zh/doc/book/pipeline/#步骤) 的所有必要操作。您可以直接在交互式面板上定义这些阶段和步骤，无需创建任何 Jenkinsfile。

本教程演示如何在 KubeSphere 中使用图形编辑面板创建流水线。KubeSphere 在整个过程中将根据您在编辑面板上的设置自动生成 Jenkinsfile，您无需手动创建 Jenkinsfile。待流水线成功运行，它会相应地在您的开发环境中创建一个部署 (Deployment) 和一个服务 (Service)，并将镜像推送至 Docker Hub。



## 6.1 准备工作

- 您需要[启用 KubeSphere DevOps 系统](https://v3-2.docs.kubesphere.io/zh/docs/pluggable-components/devops/)。
- 您需要有一个 [Docker Hub](http://www.dockerhub.com/) 帐户。
- 您需要创建一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，必须邀请该用户至 DevOps 项目中并赋予 `operator` 角色。如果尚未创建，请参见[创建企业空间、项目、用户和角色](https://v3-2.docs.kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。
- 设置 CI 专用节点来运行流水线（可选）。有关更多信息，请参见[为缓存依赖项设置 CI 节点](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/set-ci-node/)。
- 配置您的电子邮件服务器用于接收流水线通知（可选）。有关更多信息，请参见[为 KubeSphere 流水线设置电子邮件服务器](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/jenkins-email/)。
- 配置 SonarQube 将代码分析纳入流水线中（可选）。有关更多信息，请参见[将 SonarQube 集成到流水线](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-integrate/sonarqube/)。



## 6.2 流水线概述

本示例流水线包括以下六个阶段。

![Pipeline](../../img/kubernetes/kubernetes_kubesphere_devops/20190516091714.png)



- **阶段 1：Checkout SCM**：从 GitHub 仓库拉取源代码。
- **阶段 2：单元测试**：待该测试通过后才会进行下一阶段。
- **阶段 3：代码分析**：配置 SonarQube 用于静态代码分析。
- **阶段 4：构建并推送**：构建镜像并附上标签 `snapshot-$BUILD_NUMBER` 推送至 Docker Hub，其中 `$BUILD_NUMBER` 是流水线活动列表中的记录的序列号。
- **阶段 5：制品**：生成一个制品（JAR 文件包）并保存。
- **阶段 6：部署至开发环境**：在开发环境中创建一个部署和一个服务。该阶段需要进行审核，部署成功运行后，会发送电子邮件通知。



## 6.3 流水线设置

### 6.3.1 创建凭证

1.以 `project-regular` 身份登录 KubeSphere 控制台。转到您的 DevOps 项目，在 **DevOps 项目设置**下的**凭证**页面创建以下凭证。有关如何创建凭证的更多信息，请参见[凭证管理](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/credential-management/)。



> 如果您的帐户或密码中有任何特殊字符，例如 `@` 和 `$`，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。



| 凭证 ID         | 类型         | 用途       |
| :-------------- | :----------- | :--------- |
| dockerhub-id    | 用户名和密码 | Docker Hub |
| demo-kubeconfig | kubeconfig   | Kubernetes |



2.您还需要为 SonarQube 创建一个凭证 ID (`sonar-token`)，用于上述的阶段 3（代码分析）。请参阅[为新项目创建 SonarQube 令牌 (Token)](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-integrate/sonarqube/#create-sonarqube-token-for-new-project)，在**访问令牌**类型的凭证的**令牌**字段中输入 SonarQube 令牌。点击**确定**完成操作。



![image-20221028102436728](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028102436728.png)



![image-20221028102649494](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028102649494.png)





![image-20221028102709409](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028102709409.png)





3.你在列表中可以看到4个凭证



### 6.3.2 创建项目

在本教程中，示例流水线会将 [sample](https://github.com/kubesphere/devops-maven-sample/tree/sonarqube) 应用部署至一个项目。因此，您必须先创建一个项目（例如 `kubesphere-sample-dev`）。待流水线成功运行，会在该项目中自动创建该应用的部署和服务。

您可以使用 `project-admin` 帐户创建项目。此外，该用户也是 CI/CD 流水线的审核员。请确保将 `project-regular` 帐户邀请至该项目并授予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](https://v3-2.docs.kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。



![image-20221028000558491](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000558491.png)



![image-20221028000639889](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000639889.png)



![image-20221028000734548](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000734548.png)



![image-20221028000754528](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000754528.png)



![image-20221028000845544](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000845544.png)



![image-20221028000919311](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000919311.png)

![image-20221028000959470](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028000959470.png)



![image-20221028001015375](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001015375.png)





![image-20221028001042749](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001042749.png)



### 6.3.3 创建流水线

1.请确保以 `project-regular` 身份登录 KubeSphere 控制台，转到您的 DevOps 项目。在**流水线**页面点击**创建**。

![image-20221028001349754](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001349754.png)



![image-20221028001415837](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001415837.png)



2.在弹出的对话框中，将它命名为 `graphical-pipeline`，点击**下一步**。

![image-20221028001512033](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001512033.png)



![image-20221028001554927](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001554927.png)



3.在**高级设置**页面，点击**添加**，添加以下三个字符串参数。这些参数将用于流水线的 Docker 命令。添加完成后，点击**创建**。



![image-20221028001822672](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001822672.png)



| 参数类型 | 名称                | 值              | 描述信息                                   |
| :------- | :------------------ | :-------------- | :----------------------------------------- |
| 字符串   | REGISTRY            | `docker.io`     | 镜像仓库地址。本示例使用 `docker.io`。     |
| 字符串   | DOCKERHUB_NAMESPACE | Docker ID       | 您的 Docker Hub 帐户或该帐户下的组织名称。 |
| 字符串   | APP_NAME            | `devops-sample` | 应用名称。                                 |



![image-20221028001953606](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028001953606.png)





![image-20221028002324916](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028002324916.png)



>有关其他字段，请直接使用默认值或者参考[流水线设置](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/pipeline-settings/)以自定义配置。



4.创建的流水线会显示在列表中



![image-20221028002447067](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028002447067.png)



### 6.3.4 编辑流水线

- 点击流水线进入其详情页面。要使用图形编辑面板，请点击**任务状态**选项卡下的**编辑流水线**。在弹出的对话框中，点击**自定义流水线**。该流水线包括六个阶段，请按照以下步骤设置每个阶段。
- 您也可以点击**持续集成 (CI)** 和**持续集成&交付 (CI/CD)** 来使用 KubeSphere 提供的[内置流水线模板](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/use-pipeline-templates/)。



![image-20221028003020673](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028003020673.png)



![image-20221028003121067](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028003121067.png)





>流水线详情页面会显示**同步状态**，它是 KubeSphere 和 Jenkins 之间的同步结果。若同步成功，您会看到**成功**图标。您也可以点击**编辑 Jenkinsfile** 手动为流水线创建一个 Jenkinsfile。



#### 6.3.4.1 阶段 1：拉取源代码 (Checkout SCM)

图形编辑面板包括两个区域：左侧的**画布**和右侧的**内容**。它会根据您对不同阶段和步骤的配置自动生成一个 Jenkinsfile，为开发者提供更加用户友好的操作体验。

>流水线包括[声明式流水线](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#声明式流水线)和[脚本化流水线](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#脚本化流水线)。目前，您可以使用该面板创建声明式流水线。有关流水线语法的更多信息，请参见 [Jenkins 文档](https://www.jenkins.io/zh/doc/book/pipeline/syntax/)。



1.在图形编辑面板上，从**类型**下拉列表中选择 **node**，从 **Label** 下拉列表中选择 **maven**。

![image-20221028003238002](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028003238002.png)



> `agent` 用于定义执行环境。`agent` 指令指定 Jenkins 执行流水线的位置和方式。有关更多信息，请参见[选择 Jenkins Agent](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-use/choose-jenkins-agent/)。



2.请点击左侧的加号图标来添加阶段。点击**添加步骤**上方的文本框，然后在右侧的**名称**字段中为该阶段设置名称（例如 `Checkout SCM`）。



![image-20221028003607622](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028003607622.png)



3.点击**添加步骤**。在列表中选择 **git**，以从 GitHub 拉取示例代码。在弹出的对话框中，填写必需的字段。点击**确定**完成操作。

- **URL**：输入 GitHub 仓库地址 `https://github.com/kubesphere/devops-maven-sample.git`。请注意，这里是示例地址，您需要使用您自己的仓库地址。
- **凭证 ID**：本教程中无需输入凭证 ID。
- **分支**：如果您将其留空，则默认为 master 分支。请输入 `sonarqube`，或者如果您不需要代码分析阶段，请将其留空。



![image-20221028004820884](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028004820884.png)



![image-20221028004912412](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028004912412.png)



![image-20221028004955059](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028004955059.png)



![image-20221028005248406](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028005248406.png)



~~~powershell
https://github.com/nextgomsb/devops-maven-sample.git
~~~



**后续执行过程中有问题时，可以尝试修改容器基础镜像**



![image-20221031104243656](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031104243656.png)



**创建流水线**





![image-20221028005413460](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028005413460.png)





![image-20221028010524003](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028010524003.png)









4.第一阶段设置完成



![image-20221028005802017](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028005802017.png)





#### 6.3.4.2 阶段 2：单元测试

1.点击阶段 1 右侧的加号图标添加新的阶段，以在容器中执行单元测试。将它命名为 `Unit Test`。



![image-20221028010703560](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028010703560.png)



![image-20221028010805488](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028010805488.png)



2.点击**添加步骤**，在列表中选择**指定容器**。将其命名为 `maven` 然后点击**确定**。



![image-20221028010930565](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028010930565.png)



![image-20221028010953830](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028010953830.png)





3.点击**添加嵌套步骤**，在 `maven` 容器下添加一个嵌套步骤。在列表中选择 **shell** 并在命令行中输入以下命令。点击**确定**保存操作。



![image-20221028011117734](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028011117734.png)



![image-20221028011154458](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028011154458.png)



![image-20221030205259256](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030205259256.png)



~~~powershell
mvn clean package
~~~



>您可以在图形编辑面板上指定在给定阶段指令中执行的一系列[步骤](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#steps)。



#### 6.3.4.3 阶段 3：代码分析（可选）

本阶段使用 SonarQube 来测试您的代码。如果您不需要代码分析，可以跳过该阶段。

1.点击 `Unit Test` 阶段右侧的加号图标添加一个阶段，以在容器中进行 SonarQube 代码分析。将它命名为 `Code Analysis`。

![image-20221028101410290](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101410290.png)



2.在 **Code Analysis** 中，点击**任务**下的**添加步骤**，选择**指定容器**。将其命名为 `maven` 然后点击**确定**。



![image-20221028101510119](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101510119.png)



![image-20221028101631884](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101631884.png)



![image-20221028101709785](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101709785.png)



3.点击 `maven` 容器下的**添加嵌套步骤**，以添加一个嵌套步骤。点击**添加凭证**并从**凭证 ID** 列表中选择 SonarQube 令牌 (`sonar-token`)。在**文本变量**中输入 `SONAR_TOKEN`，然后点击**确定**。



![image-20221028101835008](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101835008.png)



![image-20221028101905088](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028101905088.png)



![image-20221028102927908](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028102927908.png)



4.在**添加凭证**步骤下，点击**添加嵌套步骤**为其添加一个嵌套步骤。

![image-20221028103940613](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028103940613.png)



5.点击 **Sonarqube 配置**，在弹出的对话框中保持默认名称 `sonar` 不变，点击**确定**保存操作



![image-20221028104138270](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104138270.png)



![image-20221028104207816](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104207816.png)



6.在 **Sonarqube 配置**步骤下，点击**添加嵌套步骤**为其添加一个嵌套步骤。



![image-20221028104342813](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104342813.png)



7.点击 **shell** 并在命令行中输入以下命令，用于 sonarqube 分支和认证，点击**确定**完成操作。

![image-20221028104524829](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104524829.png)





![image-20221028104701245](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104701245.png)



~~~powershell
mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN
~~~



8.点击**指定容器**步骤下的**添加嵌套步骤**（第三个），选择**超时**。在时间中输入 `1` 并将单位选择为**小时**，点击**确定**完成操作。

![image-20221028104841540](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104841540.png)



![image-20221028104953045](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028104953045.png)



![image-20221028105020275](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105020275.png)



9.点击**超时**步骤下的**添加嵌套步骤**，选择**代码质量检查 (SonarQube)**。在弹出的对话框中选择**检查通过后开始后续任务**。点击**确定**保存操作。



![image-20221028105118051](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105118051.png)



![image-20221028105202924](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105202924.png)



![image-20221028105244782](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105244782.png)



![image-20221028105324072](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105324072.png)



#### 6.3.4.4 阶段 4：构建并推送镜像

点击前一个阶段右侧的加号图标添加一个新的阶段，以构建并推送镜像至 Docker Hub。将其命名为 `Build and Push`。

![image-20221028105532996](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028105532996.png)



2.点击**任务**下的**添加步骤**，选择**指定容器**，将其命名为 `maven`，然后点击**确定**。



![image-20221028110037319](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110037319.png)



3.点击 `maven` 容器下的**添加嵌套步骤**添加一个嵌套步骤。在列表中选择 **shell** 并在弹出窗口中输入以下命令，点击**确定**完成操作。

![image-20221028110434696](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110434696.png)



![image-20221028110514370](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110514370.png)





~~~powershell
mvn -Dmaven.test.skip=true clean package
~~~



![image-20221028110621884](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110621884.png)



4.再次点击**添加嵌套步骤**，选择 **shell**。在命令行中输入以下命令，以根据 [Dockerfile](https://github.com/kubesphere/devops-maven-sample/blob/sonarqube/Dockerfile-online) 构建 Docker 镜像。点击**确定**确认操作。

> 请勿遗漏命令末尾的点 `.`



![image-20221028110746069](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110746069.png)



![image-20221028110832612](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110832612.png)



~~~powershell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
~~~



![image-20221028110943337](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028110943337.png)



5.再次点击**添加嵌套步骤**，选择**添加凭证**。在弹出的对话框中填写以下字段，点击**确定**确认操作。

- **凭证名称**：选择您创建的 Docker Hub 凭证，例如 `dockerhub-id`。
- **密码变量**：输入 `DOCKER_PASSWORD`。
- **用户名变量**：输入 `DOCKER_USERNAME`。



>出于安全原因，帐户信息在脚本中显示为变量。



![image-20221028111055981](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111055981.png)



![image-20221028111123696](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111123696.png)



![image-20221028111252997](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111252997.png)



6.在**添加凭证**步骤中点击**添加嵌套步骤**（第一个）。选择 **shell** 并在弹出窗口中输入以下命令，用于登录 Docker Hub。点击**确定**确认操作。

![image-20221028111539496](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111539496.png)



![image-20221028111622087](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111622087.png)



~~~powershell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
~~~



![image-20221028111712445](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028111712445.png)



7.在**添加凭证**步骤中点击**添加嵌套步骤**。选择 **shell** 并输入以下命令，将 SNAPSHOT 镜像推送至 Docker Hub。点击**确定**完成操作。

![image-20221028112001528](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112001528.png)



~~~powershell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
~~~



![image-20221028112053455](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112053455.png)



![image-20221028112123076](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112123076.png)



#### 6.3.4.5 阶段 5：生成制品

1.点击 **Build and Push** 阶段右侧的加号图标添加一个新的阶段，以保存制品，将其命名为 `Artifacts`。本示例使用 JAR 文件包。

![image-20221028112332849](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112332849.png)



2.选中 **Artifacts** 阶段，点击**任务**下的**添加步骤**，选择**保存制品**。在弹出的对话框中输入 `target/*.jar`，用于设置 Jenkins 中制品的保存路径。点击**确定**完成操作。



![image-20221028112459764](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112459764.png)



![image-20221028112521317](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112521317.png)





~~~powershell
target/*.jar
~~~



![image-20221028112612608](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112612608.png)



#### 6.3.4.6 阶段 6：部署至开发环境



1.点击 **Artifacts** 阶段右侧的加号图标添加最后一个阶段，将其命名为 `Deploy to Dev`。该阶段用于将资源部署至您的开发环境（即 `kubesphere-sample-dev` 项目）。



![image-20221028112843130](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112843130.png)



2.点击 **Deploy to Dev** 阶段下的**添加步骤**，在列表中选择**审核**，然后在**消息**字段中填入 `@project-admin`，即 `project-admin` 帐户在流水线运行到该阶段时会进行审核。点击**确定**保存操作。

![image-20221028112947342](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028112947342.png)



![image-20221028113026666](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113026666.png)



> 在 KubeSphere 3.2.x 中，能够运行流水线的帐户也能够继续或终止该流水线。此外，流水线创建者、拥有该项目管理员角色的用户或者您指定的帐户也有权限继续或终止流水线。



3.再次点击 **Deploy to Dev** 阶段下的**添加步骤**。在列表中选择**指定容器**，将其命名为 `maven` 然后点击**确定**。



![image-20221028113214211](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113214211.png)



4.点击 `maven` 容器步骤下的**添加嵌套步骤**。在列表中选择**添加凭证**，在弹出的对话框中填写以下字段，然后点击**确定**。

- 凭证名称：选择您创建的 kubeconfig 凭证，例如 `demo-kubeconfig`。
- kubeconfig 变量：输入 `KUBECONFIG_CONTENT`。

![image-20221028113256977](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113256977.png)



![image-20221028113408653](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113408653.png)





5.点击**添加凭证**步骤下的**添加嵌套步骤**。在列表中选择 **shell**，在弹出的对话框中输入以下命令，然后点击**确定**。



![image-20221028113510007](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113510007.png)



![image-20221028113533301](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113533301.png)





~~~powershell
mkdir ~/.kube
echo "$KUBECONFIG_CONTENT" > ~/.kube/config
envsubst < deploy/dev-ol/devops-sample-svc.yaml | kubectl apply -f -
envsubst < deploy/dev-ol/devops-sample.yaml | kubectl apply -f -
~~~



![image-20221028113628854](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113628854.png)



6.如果您想在流水线成功运行时接收电子邮件通知，请点击**添加步骤**，选择**邮件**，以添加电子邮件信息。请注意，配置电子邮件服务器是可选操作，如果您跳过该步骤，依然可以运行流水线。



![image-20221028113728197](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113728197.png)



![image-20221028113805090](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113805090.png)



![image-20221028113952848](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028113952848.png)





7.待您完成上述步骤，请在右下角点击**保存**。随后，您可以看到该流水线有完整的工作流，并且每个阶段也清晰列示。当您用图形编辑面板定义流水线时，KubeSphere 会自动创建相应的 Jenkinsfile。点击**编辑 Jenkinsfile** 查看该 Jenkinsfile。



>在**流水线**页面，您可以点击该流水线右侧的 ![img](https://v3-2.docs.kubesphere.io/images/docs/common-icons/three-dots.png)，然后选择**复制**来创建该流水线的副本。如果您需要同时运行多个不包含多分支的流水线，您可以全部选中这些流水线，然后点击**运行**来批量运行它们。



## 6.4 运行流水线

1.您需要手动运行使用图形编辑面板创建的流水线。点击**运行**，您可以在弹出的对话框中看到步骤 3 中已定义的三个字符串参数。点击**确定**来运行流水线。



![image-20221028114448532](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028114448532.png)



![image-20221031102324133](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031102324133.png)



2.要查看流水线的状态，请转到**运行记录**选项卡，点击您想查看的记录。



![image-20221028114605201](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221028114605201.png)



3.稍等片刻，流水线如果成功运行，则会在 **Deploy to Dev** 阶段停止。`project-admin` 作为流水线的审核员，需要进行审批，然后资源才会部署至开发环境。



## 6.5 下载制品



点击**制品**选项卡，然后点击右侧的图标下载该制品。



![image-20221030131750542](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030131750542.png)





## 6.6 查看代码分析结果





在**代码检查**页面，可以查看由 SonarQube 提供的本示例流水线的代码分析结果。如果您没有事先配置 SonarQube，则该部分不可用。有关更多信息，请参见[将 SonarQube 集成到流水线](https://v3-2.docs.kubesphere.io/zh/docs/devops-user-guide/how-to-integrate/sonarqube/)。

![SonarQube 详细结果](../../img/kubernetes/kubernetes_kubesphere_devops/sonarqube_result_detail.png)



## 6.7 验证 Kubernetes 资源

1.如果流水线的每个阶段都成功运行，则会自动构建一个 Docker 镜像并推送至您的 Docker Hub 仓库。最终，流水线将在您事先设置的项目中自动创建一个部署和一个服务。

2.前往该项目（本教程中即 `kubesphere-sample-dev`），请点击**应用负载**下的**工作负载**，您可以看到列表中显示的部署。



3.在**服务**页面，您可以看到示例服务通过 NodePort 暴露其端口号。要访问服务，请访问 `<Node IP>:<NodePort>`。

> 访问服务前，您可能需要配置端口转发规则并在安全组中放行该端口。



4.现在流水线已成功运行，将会推送一个镜像至 Docker Hub。登录 Docker Hub 查看结果。



![DockerHub 镜像](../../img/kubernetes/kubernetes_kubesphere_devops/dockerhub_image.png)



5.该应用的名称为 `devops-sample`，即 `APP_NAME` 的值，标签即 `SNAPSHOT-$BUILD_NUMBER` 的值。`$BUILD_NUMBER` 即**运行记录**选项卡列示的记录的序列号。



6.如果您在最后一个阶段设置了电子邮件服务器并添加了电子邮件通知的步骤，您还会收到电子邮件消息。





# 七、配置流水线把项目发布到生产环境





![流水线概览](../../img/kubernetes/kubernetes_kubesphere_devops/pipeline-overview.png)



## 7.1 创建GitHub tekens

>如需创建 GitHub 个人访问令牌，请转到您 GitHub 帐户的 **Settings**，点击 **Developer settings**，选择 **Personal access tokens**，然后点击 **Generate new token**。



![image-20221030231946644](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030231946644.png)





![image-20221030232050046](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232050046.png)





![image-20221030232332862](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232332862.png)



![image-20221030232439488](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232439488.png)

![image-20221030232504237](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232504237.png)



![image-20221030232743591](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232743591.png)





![image-20221030232825182](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232825182.png)



![image-20221030232906699](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030232906699.png)



**以project-regular用户登录后创建github访问凭证**



![image-20221030233212703](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030233212703.png)



![image-20221030233317075](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030233317075.png)





![image-20221030233338927](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030233338927.png)





## 7.2 GitHub创建代码仓库

![image-20221031001513477](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031001513477.png)



![image-20221031001740425](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031001740425.png)





## 7.3 创建项目

使用project-admin用户登录WEB控制器，创建kubesphere-sample-prod项目，并邀请project-regular用户成为项目成员，并为operator角色。

![image-20221030221900997](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030221900997.png)



![image-20221030222059644](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222059644.png)



![image-20221030222143880](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222143880.png)





![image-20221030222226462](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222226462.png)





## 7.4 为发布到生产环境准备TAG_NAME变量

使用project-regular用户登录，并编辑`graphical-pipeline`，添加TAG_NAME,值为v0.0.1

![image-20221030222449504](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222449504.png)



![image-20221030222635309](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222635309.png)





![image-20221030222719291](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030222719291.png)



![image-20221030225055086](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030225055086.png)



## 7.5 阶段7: 提交镜像和代码至仓库(push with tag)

### 7.5.1 添加条件



![image-20221031004855745](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004855745.png)



![image-20221031004936717](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004936717.png)



![image-20221031005012420](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005012420.png)



~~~powershell
scriptBlock   return params.TAG_NAME =~ /v.*/
~~~



![image-20221031005035219](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005035219.png)



![image-20221031005113742](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005113742.png)





### 7.5.2 添加步骤

![image-20221031005142758](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005142758.png)



![image-20221031005320532](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005320532.png)



![image-20221031005342665](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005342665.png)



#### 7.5.2.1 添加审核



![image-20221031005743582](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005743582.png)



![image-20221031005819223](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005819223.png)





~~~powershell
release image with tag?
@project-admin
~~~



![image-20221031005844113](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031005844113.png)









![image-20221031010317533](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010317533.png)



#### 7.5.2.2 添加凭证

![image-20221031010043691](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010043691.png)









![image-20221030234957787](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030234957787.png)



#### 7.5.2.3 添加GitHub配置



![image-20221031010619701](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010619701.png)



![image-20221031010657851](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010657851.png)



~~~powershell
git config --global user.email "nextgo@126.com" 
~~~



![image-20221031010717615](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010717615.png)



![image-20221031010746655](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010746655.png)





~~~powershell
git config --global user.name "nextgo" 
~~~



![image-20221031010816798](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010816798.png)





![image-20221031010852017](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010852017.png)



![image-20221031010935558](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031010935558.png)





~~~powershell
git tag -a $TAG_NAME -m "$TAG_NAME" 
~~~



![image-20221031011004651](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011004651.png)





**提前编辑流水线，添加如下变量**



![image-20221030235404156](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221030235404156.png)



![image-20221031011135117](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011135117.png)



![image-20221031011155995](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011155995.png)







~~~powershell
git push http://$GIT_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_ACCOUNT/devops-java-sample.git --tags --ipv4
~~~



![image-20221031011228502](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011228502.png)







#### 7.5.2.4 添加DockerHub配置



![image-20221031011355810](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011355810.png)



![image-20221031011426526](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011426526.png)



~~~powershell
docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:v$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$TAG_NAME 
~~~



![image-20221031011454860](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011454860.png)





![image-20221031011526454](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011526454.png)



![image-20221031011549068](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011549068.png)





~~~powershell
docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$TAG_NAME 
~~~



![image-20221031011618546](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011618546.png)





![image-20221031011650811](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031011650811.png)





## 7.6 阶段8: 发布到生产环境（deploy to production）

### 7.6.1 添加条件



![image-20221031003324495](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003324495.png)



![image-20221031003349884](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003349884.png)



![image-20221031003416608](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003416608.png)





~~~powershell
scriptBlock   return params.TAG_NAME =~ /v.*/
~~~



![image-20221031003516001](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003516001.png)





### 7.6.2 添加审核



![image-20221031003611345](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003611345.png)





![image-20221031003641520](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003641520.png)





~~~powershell
deploy to production?
@project-admin 
~~~



![image-20221031003712803](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003712803.png)



### 7.6.3 添加步骤



![image-20221031003804371](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031003804371.png)



![image-20221031004025210](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004025210.png)



![image-20221031004052139](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004052139.png)





![image-20221031004237267](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004237267.png)



#### 7.6.3.1 添加凭证

![image-20221031004318639](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004318639.png)







![image-20221031004202774](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004202774.png)



#### 7.6.3.2 添加执行步骤



![image-20221031004500945](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004500945.png)



![image-20221031004533534](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004533534.png)









~~~powershell
envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -
~~~



![image-20221031004601615](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031004601615.png)





## 7.7 执行流水线



![image-20221031103744239](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031103744239.png)



![image-20221031103820943](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031103820943.png)





![image-20221031103906025](../../img/kubernetes/kubernetes_kubesphere_devops/image-20221031103906025.png)



