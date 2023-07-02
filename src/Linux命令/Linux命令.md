---
title: Linux命令
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

<a name="h8y38"></a>

# cpu 使用率

<a name="lNNF5"></a>

### 1、top

这个命令很常用，在第三行有显示 CPU 当前的使用情况。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699254120-a0f80330-7d5e-4f8c-88d2-fe93b01cb568.png?x-oss-process=image%2Fresize%2Cw_706%2Climit_0)<br />如上所示，top 命令可以看到总体的系统运行状态和 cpu 的使用率 。<br />%us：表示用户空间程序的 cpu 使用率（没有通过 nice 调度）<br />%sy：表示系统空间的 cpu 使用率，主要是内核程序。<br />%ni：表示用户空间且通过 nice 调度过的程序的 cpu 使用率。<br />%id：空闲 cpu<br />%wa：cpu 运行时在等待 io 的时间<br />%hi：cpu 处理硬中断的数量<br />%si：cpu 处理软中断的数量<br />%st：被虚拟机偷走的 cpu
<a name="n3Fuq"></a>

### 2、vmstat

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699254184-b906b708-0796-458e-bc0d-5ba35d57aa03.png?x-oss-process=image%2Fresize%2Cw_713%2Climit_0)

<a name="cN2B9"></a>

### 3、sar

sar 命令语法和 vmstat 一样。命令不存在时需要安装 sysstat 包，这个包很有用。
<a name="QMWCR"></a>

#### CPU 使用率

例如每 1 秒采集一次 CPU 使用率，共采集 5 次。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699254107-a2819dc3-cfd2-4c5a-82b0-adf39327d5ae.png?x-oss-process=image%2Fresize%2Cw_711%2Climit_0)

和 top 一样，可以看到所有 cpu 的使用情况。如果需要查看某颗 cpu 的使用可以用-P 参数。例如指定显示 0 号 cpu 的使用情况。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699254113-18026836-b0ca-4670-a67b-ea84f73e0556.png?x-oss-process=image%2Fresize%2Cw_710%2Climit_0)
<a name="NFxP0"></a>

#### 进程队列长度和平均负载状态[#](https://www.cnblogs.com/daiorz/p/11736811.html#2353559150)

例如每 1 秒采集一次，共采集 5 次。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699254148-9a953289-dd61-4034-ac2a-7b7f9e12df9e.png?x-oss-process=image%2Fresize%2Cw_713%2Climit_0)<br />输出项：<br />runq-sz：运行队列的长度（等待运行的进程数）<br />plist-sz：进程列表中进程（processes）和线程（threads）的数量<br />ldavg-1：最后 1 分钟的系统平均负载（System load average）<br />ldavg-5：过去 5 分钟的系统平均负载<br />ldavg-15：过去 15 分钟的系统平均负载
<a name="tg4qF"></a>

# 内存使用率

Free 命令是 Linux 管理员广泛使用的最强大的命令。但与"/proc/meminfo"文件相比，它提供的信息很少。Free 命令显示系统上可用和已用物理内存和交换内存的总量，以及内核使用的缓冲区和缓存。<br />[root@sharplee creatfile]# free -m<br />![image.png](https://cdn.nlark.com/yuque/0/2023/jpeg/1635081/1687699344588-5dcf2f43-97e0-4c70-bea5-99f6854b58f5.jpeg?x-oss-process=image%2Fresize%2Cw_640%2Climit_0%2Finterlace%2C1)<br />下面是图中参数字段的含义：

1. **total: **总内存
2. **used: **正在运行的进程使用的内存(used= total – free – buff/cache)
3. **free:** 未使用的内存 (free= total – used – buff/cache)
4. **shared:** 多个进程共享的内存
5. **buffers:** 内存保留用于内核操作一个进程队列请求
6. **cache:** 在 RAM 中保存最近使用的文件的页面缓存的大小
7. **buff/cache:** Buffers + Cache
8. **available:** 估计有多少内存可用于启动新应用程序，而无需交换。
   <a name="fEV2S"></a>

# 磁盘空间<br /><br />

df ，disk free 的缩写，命令用于查看显示所有磁盘的信息，如磁盘总空间、已用空间、剩余磁盘空间、[挂载](https://so.csdn.net/so/search?q=%E6%8C%82%E8%BD%BD&spm=1001.2101.3001.7020)点等信息，语法格式如下：

```
df [选项]

```

常用参数：

```bash
-h  		：友好的可视化显示，如空间大小默认显示字节的显示为M
-T			：显示文件系统类型
-a			：显示所有磁盘的信息，默认选项
-i			：显示索引字节信息
```

演示示例：

```
[root@master ~]# df												#显示所有磁盘信息，等价于df -a
Filesystem          1K-blocks     Used Available Use% Mounted on
/dev/mapper/cl-root  59228412 33118580  26109832  56% /
devtmpfs              3981316        0   3981316   0% /dev
tmpfs                 4194304        0   4194304   0% /dev/shm
tmpfs                 3997160     9276   3987884   1% /run
tmpfs                 3997160        0   3997160   0% /sys/fs/cgroup
/dev/sda2              508580   170732    337848  34% /boot
tmpfs                  799432        0    799432   0% /run/user/0
tmpfs                  799432        0    799432   0% /run/user/1006
[root@master ~]# df -h												#以友好可视化显示所有磁盘信息
Filesystem           Size  Used Avail Use% Mounted on
/dev/mapper/cl-root   57G   32G   25G  56% /
devtmpfs             3.8G     0  3.8G   0% /dev
tmpfs                4.0G     0  4.0G   0% /dev/shm
tmpfs                3.9G  9.1M  3.9G   1% /run
tmpfs                3.9G     0  3.9G   0% /sys/fs/cgroup
/dev/sda2            497M  167M  330M  34% /boot
tmpfs                781M     0  781M   0% /run/user/0
tmpfs                781M     0  781M   0% /run/user/1006
[root@master ~]# df -i												#查看剩余iNode节点数
Filesystem            Inodes  IUsed    IFree IUse% Mounted on
/dev/mapper/cl-root 29622272 326640 29295632    2% /
devtmpfs              995329    431   994898    1% /dev
tmpfs                 999290      1   999289    1% /dev/shm
tmpfs                 999290    628   998662    1% /run
tmpfs                 999290     16   999274    1% /sys/fs/cgroup
/dev/sda2             256000    374   255626    1% /boot
tmpfs                 999290      1   999289    1% /run/user/0
tmpfs                 999290      1   999289    1% /run/user/1006
[root@master ~]# df -Th												#显示文件系统类型
文件系统                    类型      容量  已用  可用 已用% 挂载点
devtmpfs                    devtmpfs  2.0G     0  2.0G    0% /dev
tmpfs                       tmpfs     2.0G   29k  2.0G    1% /dev/shm
tmpfs                       tmpfs     2.0G   71M  2.0G    4% /run
tmpfs                       tmpfs     2.0G     0  2.0G    0% /sys/fs/cgroup
/dev/mapper/centos-root     xfs        40G   36G  4.6G   89% /


```

netstat [选项]

```bash
-a或--all：显示所有连线中的Socket；
-A<网络类型>或--<网络类型>：列出该网络类型连线中的相关地址；
-c或--continuous：持续列出网络状态；
-C或--cache：显示路由器配置的快取信息；
-e或--extend：显示网络其他相关信息；
-F或--fib：显示FIB；
-g或--groups：显示多重广播功能群组组员名单；
-h或--help：在线帮助；
-i或--interfaces：显示网络界面信息表单；
-l或--listening：显示监控中的服务器的Socket；
-M或--masquerade：显示伪装的网络连线；
-n或--numeric：直接使用ip地址，而不通过域名服务器；
-N或--netlink或--symbolic：显示网络硬件外围设备的符号连接名称；
-o或--timers：显示计时器；
-p或--programs：显示正在使用Socket的程序识别码和程序名称；
-r或--route：显示Routing Table；
-s或--statistice：显示网络工作信息统计表；
-t或--tcp：显示TCP传输协议的连线状况；
-u或--udp：显示UDP传输协议的连线状况；
-v或--verbose：显示指令执行过程；
-V或--version：显示版本信息；
-w或--raw：显示RAW传输协议的连线状况；
-x或--unix：此参数的效果和指定"-A unix"参数相同；
--ip或--inet：此参数的效果和指定"-A inet"参数相同。
```

<a name="pKOtD"></a>

### 实例

- 列出所有 TCP 监听服务器端口

```bash
[root@hdp-01 ~]# netstat -nltp
```

- 列出所有端口情况

```bash
[root@xiesshavip002 ~]# netstat -a      # 列出所有端口
[root@xiesshavip002 ~]# netstat -at     # 列出所有TCP端口
[root@xiesshavip002 ~]# netstat -au     # 列出所有UDP端口
```

- 列出所有处于监听状态的 Sockets

```bash
[root@xiesshavip002 ~]# netstat -l   # 只显示监听端口
[root@xiesshavip002 ~]# netstat -lt  # 显示监听TCP端口
[root@xiesshavip002 ~]# netstat -lu  # 显示监听UDP端口
[root@xiesshavip002 ~]# netstat -lx  # 显示监听UNIX端口
```

- 显示每个协议的统计信息

```bash
[root@xiesshavip002 ~]# netstat -s     # 显示所有端口的统计信息
[root@xiesshavip002 ~]# netstat -st    # 显示所有TCP的统计信息
[root@xiesshavip002 ~]# netstat -su    # 显示所有UDP的统计信息
```

- 显示 PID 和进程名称

```bash
[root@xiesshavip002 ~]# netstat -p
```

- 显示核心路由信息

```bash
[root@xiesshavip002 ~]# netstat -r
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
default         gateway         0.0.0.0         UG        0 0          0 eth0
192.168.130.0   0.0.0.0         255.255.255.0   U         0 0          0 eth0
[root@xiesshavip002 ~]# netstat -rn   # 显示数字格式，不查询主机名称
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.130.1   0.0.0.0         UG        0 0          0 eth0
192.168.130.0   0.0.0.0         255.255.255.0   U         0 0          0 eth0
[root@xiesshavip002 ~]#
```

- 查看端口和服务

```bash
[root@xiesshavip002 ~]# netstat -antp | grep ssh
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      734/sshd
tcp        0     52 192.168.130.20:22       119.129.118.189:58737   ESTABLISHED 1846/sshd: root@pts
tcp6       0      0 :::22                   :::*                    LISTEN      734/sshd
[root@xiesshavip002 ~]# netstat -antp | grep 22
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      734/sshd
tcp        0     52 192.168.130.20:22       119.129.118.189:58737   ESTABLISHED 1846/sshd: root@pts
tcp6       0      0 :::22                   :::*                    LISTEN      734/sshd
[root@xiesshavip002 ~]#
```

- netstat 命令帮助

```bash
[root@xiesshavip002 ~]# netstat --help
usage: netstat [-vWeenNcCF] [<Af>] -r         netstat {-V|--version|-h|--help}
       netstat [-vWnNcaeol] [<Socket> ...]
       netstat { [-vWeenNac] -I[<Iface>] | [-veenNac] -i | [-cnNe] -M | -s [-6tuw] } [delay]

        -r, --route              display routing table
        -I, --interfaces=<Iface> display interface table for <Iface>
        -i, --interfaces         display interface table
        -g, --groups             display multicast group memberships
        -s, --statistics         display networking statistics (like SNMP)
        -M, --masquerade         display masqueraded connections

        -v, --verbose            be verbose
        -W, --wide               don't truncate IP addresses
        -n, --numeric            don't resolve names
        --numeric-hosts          don't resolve host names
        --numeric-ports          don't resolve port names
        --numeric-users          don't resolve user names
        -N, --symbolic           resolve hardware names
        -e, --extend             display other/more information
        -p, --programs           display PID/Program name for sockets
        -o, --timers             display timers
        -c, --continuous         continuous listing

        -l, --listening          display listening server sockets
        -a, --all                display all sockets (default: connected)
        -F, --fib                display Forwarding Information Base (default)
        -C, --cache              display routing cache instead of FIB
        -Z, --context            display SELinux security context for sockets

  <Socket>={-t|--tcp} {-u|--udp} {-U|--udplite} {-w|--raw} {-x|--unix}
           --ax25 --ipx --netrom
  <AF>=Use '-6|-4' or '-A <af>' or '--<af>'; default: inet
  List of possible address families (which support routing):
    inet (DARPA Internet) inet6 (IPv6) ax25 (AMPR AX.25)
    netrom (AMPR NET/ROM) ipx (Novell IPX) ddp (Appletalk DDP)
    x25 (CCITT X.25)
```

<a name="dcDSn"></a>

# netstat

<a name="bjYgJ"></a>

### 查看进程占用的端口号

套接字是和 IP 地址、软件端口和协议结合起来使用的，而端口号对传输控制协议（TCP）和用户数据报协议（UDP）协议都适用，TCP 和 UDP 都可以使用 0 到 65535 之间的端口号进行通信。<br />以下是端口分配类别：

- 0 - 1023： 常用端口和系统端口
- 1024 - 49151： 软件的注册端口
- 49152 - 65535： 动态端口或私有端口

在 Linux 上的 /etc/services 文件可以查看到更多关于保留端口的信息。<br />可以使用以下六种方法查看端口信息。

- ss：可以用于转储套接字统计信息。
- netstat：可以显示打开的套接字列表。
- lsof：可以列出打开的文件。
- fuser：可以列出那些打开了文件的进程的进程 ID。
- nmap：是网络检测工具和端口扫描程序。
- systemctl：是 systemd 系统的控制管理器和服务管理器。
  <a name="pOFgc"></a>

##### 举例

以下将找出 sshd 守护进程所使用的端口号

- 方法 1：使用 ss 命令

一般用于转储套接字统计信息。它能够输出类似于 netstat 输出的信息，但它可以比其它工具显示更多的 TCP 信息和状态信息。<br />它还可以显示所有类型的套接字统计信息，包括 PACKET、TCP、UDP、DCCP、RAW、Unix 域等。

```bash
# ss -tnlp | grep ssh
LISTEN 0 128 *:22 *:* users:(("sshd",pid=997,fd=3))
LISTEN 0 128 :::22 :::* users:(("sshd",pid=997,fd=4))
```

也可以使用端口号来检查

```bash
# ss -tnlp | grep ":22"
LISTEN 0 128 *:22 *:* users:(("sshd",pid=997,fd=3))
LISTEN 0 128 :::22 :::* users:(("sshd",pid=997,fd=4))
```

- 方法 2：使用 netstat 命令

netstat 能够显示网络连接、路由表、接口统计信息、伪装连接以及多播成员。<br />默认情况下，netstat 会列出打开的套接字。如果不指定任何地址族，则会显示所有已配置地址族的活动套接字。但 netstat 已经过时了，一般会使用 ss 来替代。

```bash
# netstat -tnlp | grep ssh
tcp 0 0 0.0.0.0:22 0.0.0.0:* LISTEN 997/sshd
tcp6 0 0 :::22 :::* LISTEN 997/sshd
```

也可以使用端口号来检查

```bash
# netstat -tnlp | grep ":22"
tcp 0 0 0.0.0.0:22 0.0.0.0:* LISTEN 1208/sshd
tcp6 0 0 :::22 :::* LISTEN 1208/sshd
```

- 方法 3：使用 lsof 命令

lsof 能够列出打开的文件，并列出系统上被进程打开的文件的相关信息。

```bash
# lsof -i -P | grep ssh
COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
sshd 11584 root 3u IPv4 27625 0t0 TCP *:22 (LISTEN)
sshd 11584 root 4u IPv6 27627 0t0 TCP *:22 (LISTEN)
sshd 11592 root 3u IPv4 27744 0t0 TCP vps.2daygeek.com:ssh->103.5.134.167:49902 (ESTABLISHED)
```

也可以使用端口号来检查

```bash
# lsof -i tcp:22
COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
sshd 1208 root 3u IPv4 20919 0t0 TCP *:ssh (LISTEN)
sshd 1208 root 4u IPv6 20921 0t0 TCP *:ssh (LISTEN)
sshd 11592 root 3u IPv4 27744 0t0 TCP vps.2daygeek.com:ssh->103.5.134.167:49902 (ESTABLISHED)
```

- 方法 4：使用 fuser 命令

fuser 工具会将本地系统上打开了文件的进程的进程 ID 显示在标准输出中。

```bash
# fuser -v 22/tcp
 USER PID ACCESS COMMAND
22/tcp: root 1208 F.... sshd
 root 12388 F.... sshd
 root 49339 F.... sshd
```

- 方法 5：使用 nmap 命令

nmap（“Network Mapper”）是一款用于网络检测和安全审计的开源工具。它最初用于对大型网络进行快速扫描，但它对于单个主机的扫描也有很好的表现。<br />nmap 使用原始 IP 数据包来确定网络上可用的主机，这些主机的服务（包括应用程序名称和版本）、主机运行的操作系统（包括操作系统版本等信息）、正在使用的数据包过滤器或防火墙的类型，以及很多其它信息。

```bash
# nmap -sV -p 22 localhost
```

- 方法 6：使用 systemctl 命令

systemctl 是 systemd 系统的控制管理器和服务管理器。它取代了旧的 SysV 初始化系统管理，目前大多数现代 Linux 操作系统都采用了 systemd。

<a name="NXdEw"></a>

# vim

(1) 打开与退出 vi file：打开文件 file <br />:q ：退出 vi 编辑器 <br />:wq：保存缓冲区的修改并退出编辑器 <br />:q!：不保存直接退出 <br />:w 保存缓冲区内容至默认的文件 <br />:w file 保存缓冲区内容至 file 文件 <br />(2) 插入文本 <br />a : 在当前光标的右边插入文本 <br />A : 在当前光标行的末尾插入文本 <br />i : 在当前光标的左边插入文本 <br />I : 在当前光标所在行的开始处插入文本 <br />o: 在当前行在下面新建一行 <br />O:在当前行的上面新建一行 <br />R:替换当前光标位置以及以后的若干文本 <br />J:连接光标所在行和下一行 <br />(3) 删除文本 <br />x: 删除一个字符 <br />dd: 删除一行 <br />ndd: 删除 n 行 <br />u: 撤销上一次操作 <br />U: 撤销对当前行的所有操作 <br />(4) 搜索<br />/word 从前向后搜索第一个出现的 word <br />？word 从后向前搜索第一个出现的 word <br />(5) 设置行号 <br />:set nu 在屏幕上显示行号 <br />:set nonu 取消行号 <br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699816205-5adcfeca-7510-4e2e-938c-fc8a80360524.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="UlaX8"></a>

# 查看某个进程的线程

线程是现代操作系统上进行并行执行的一个流行的编程方面的抽象概念。当一个程序内有多个线程被叉分出用以执行多个流时，这些线程就会在它们之间共享特定的资源（如，内存地址空间、打开的文件），以使叉分开销最小化，并避免大量高成本的 IPC（进程间通信）通道。这些功能让线程在并发执行时成为一个高效的机制。<br />在 Linux 中，程序中创建的线程（也称为轻量级进程，LWP）会具有和程序的 PID 相同的“线程组 ID”。然后，各个线程会获得其自身的线程 ID（TID）。对于 Linux 内核调度器而言，线程不过是恰好共享特定资源的标准的进程而已。经典的命令行工具，如 ps 或 top，都可以用来显示线程级别的信息，只是默认情况下它们显示进程级别的信息。<br />这里提供了在 Linux 上显示某个进程的线程的几种方式。<br />**方法一：PS**<br />在 ps 命令中，“-T”选项可以开启线程查看。下面的命令列出了由进程号为 pid 的进程创建的所有线程。<br />ps -T -p pid <br />[![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699859369-1309d30c-9976-4f0b-8f06-8f742e67786e.png?x-oss-process=image%2Fresize%2Cw_800%2Climit_0)](https://images2017.cnblogs.com/blog/417876/201712/417876-20171224154237818-2089734676.png)<br />“SID”栏表示线程 ID，而“CMD”栏则显示了线程名称。<br />**方法二： Top**<br />top 命令可以实时显示各个线程情况。要在 top 输出中开启线程查看，请调用 top 命令的“-H”选项，该选项会列出所有 Linux 线程。在 top 运行时，你也可以通过按“H”键将线程查看模式切换为开或关。<br />top -H<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699859402-9cebc206-213e-4d13-99b3-d8866826d839.png?x-oss-process=image%2Fresize%2Cw_800%2Climit_0)<br />要让 top 输出某个特定进程 pid 并检查该进程内运行的线程状况：<br />top -H -p pid <br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699859390-4ff13448-58ee-496b-a584-f5e2646c83cb.png?x-oss-process=image%2Fresize%2Cw_800%2Climit_0)<br />**方法三： Htop**<br />一个对用户更加友好的方式是，通过 htop 查看单个进程的线程，它是一个基于 ncurses 的交互进程查看器。该程序允许你在树状视图中监控单个独立线程。<br />要在 htop 中启用线程查看，请开启 htop，然后按 F2 来进入 htop 的设置菜单。选择“设置”栏下面的“显示选项”，然后开启“树状视图”和“显示自定义线程名”选项。按 F10 退出设置。<br />[![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699859393-75930c36-1d42-4ed5-82e7-3fad4c79a269.png?x-oss-process=image%2Fresize%2Cw_799%2Climit_0)](https://images2017.cnblogs.com/blog/417876/201712/417876-20171224154341771-1447632241.png)<br />现在，你就会看到下面这样单个进程的线程视图。<br />[![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687699859388-6f6f1928-6911-4c2d-bf34-1e874884f071.png?x-oss-process=image%2Fresize%2Cw_800%2Climit_0)](https://images2017.cnblogs.com/blog/417876/201712/417876-20171224154352225-1958827666.png)
<a name="LVjv3"></a>

# Linux 中常见的锁

<a name="v3qe3"></a>

## 锁的用途

- 互斥锁是一个互斥的同步对象，意味着同一时间有且仅有一个线程可以获取它，互斥锁可适用于一个共享资源每次只能被一个线程访问的情况
- 自旋锁适用于：短暂的访问临界区时适用 – 达到减少切换消耗
- 读写锁适用于：用于解决读操作较多的场景 – 减少锁等待提高并发性。
  <a name="Tc6n9"></a>

## 接口

```
man pthread.h

关键字：
互斥锁：pthread_mutex_t
自旋锁：pthread_spinlock_t
读写锁：pthread_rwlock_t
```

<a name="pRPnO"></a>

## 1、互斥锁

互斥锁加锁失败后，线程会释放 CPU，给其他进程使用。<br />[自旋锁](https://so.csdn.net/so/search?q=%E8%87%AA%E6%97%8B%E9%94%81&spm=1001.2101.3001.7020)加锁失败后，线程会忙等待，知道它拿到锁。<br />互斥锁是一种独占锁，比如当线程 A 加锁成功后，此时互斥锁已经被线程 A 独占了，只要线程 A 没有释放手中的锁，线程 B 加锁就会失败，于是就会释放 CPU 给其他线程，既然线程 B 释放了 CPU，自然线程 B 加锁的代码就会被阻塞。<br />对于互斥锁加锁失败而阻塞的现象，是由操作系统内核实现的。当加锁失败时，内核会将线程置为睡眠状态，等到锁被释放后，内核会在合适的时机唤醒线程，当这个线程成功获取到锁后，于是就可以继续执行了。<br />所以，互斥锁加锁失败时，会从用户态陷入到内核态，让内核帮我们完成切换线程，虽然简化了使用锁的难度，但是存在一定的性能开销成本，即有两次线程上下文切换：<br />当线程加锁失败时，内核会把线程的状态从运行状态设置为睡眠状态，然后把 CPU 切换给其他进程运行；<br />当锁被释放时，之前睡眠状态的进程会变为就绪状态，然后内核会在合适的时候，把 CPU 切换给该线程运行。<br />如果你锁住的代码执行时间比较短，那可能上下文切换的时间比你锁住的代码执行时间还要长。<br />所以，如果你能确定被锁住的代码执行时间很短，就不应该使用互斥锁，而应该使用自旋锁，否则使用互斥锁。
<a name="ibxGs"></a>

## 2、自旋锁

自旋锁是通过 CPU 提供的 CAS 函数，在用户态完成加锁和解锁的操作，不会主动产生上下文的切换，所以相比互斥锁来说，会快一些，开销也小一些。<br />使用自旋锁的时候，当发生多线程竞争锁的情况，加锁失败的线程会忙等待，直到它拿到锁。所以，在单核 CPU 上，需要抢占式的调度器。否则，自旋锁在单 CPU 上无法使用，因为一个自旋的线程永远不会放弃 CPU。<br />自旋锁开销少，在多核系统下一般不会产生线程切换，适合异步、协程等在用户态切换请求的编程方式，但如果被锁住的代码执行时间过长，自旋的线程会长时间占用 CPU 资源。<br />自旋锁与互斥锁使用层面比较类似，但实现层面完全不同：当加锁失败时，互斥锁用线程切换来应对，自旋锁则用忙等待来应对。<br />它们俩是锁的最基本处理方式，更高级的锁都会选择其中一个来实现，比如[读写锁](https://so.csdn.net/so/search?q=%E8%AF%BB%E5%86%99%E9%94%81&spm=1001.2101.3001.7020)既可以选择基于互斥锁实现，也可以选择基于自旋锁实现。
<a name="npgkq"></a>

## 3、读写锁

读写锁由读锁和写锁两部分构成，如果只读取共享资源用读锁加锁，如果要修改共享资源则用写锁加锁。所以，读写锁适用于能明确区分读操作和写操作的场景。<br />读写锁工作原理：<br />——当写锁没有被线程持有时，多个线程能够并发地持有读锁，这大大提高了共享资源的访问效率，因为读锁是用于读取共享资源的场景，所以多个线程同时持有读锁也不会破坏共享资源。<br />——但是，一旦写锁被线程持有后，读线程的获取锁的操作会被阻塞，而且其他写线程的获取写锁的操作也会被阻塞。<br />所以说，写锁是独占锁，因为任何时刻只能有一个线程持有写锁，类似互斥锁和自旋锁，而读锁是共享锁，因为读锁可以被多个线程同时持有。所以，读写锁在读多写少的场景，能发挥出优势。<br />另外，根据实现的不同，读写锁可以分为读优先锁和写优先锁。<br />读优先锁对于读线程并发性更好，但是如果一直有读线程获取读锁，那么写线程将永远获取不到写锁，这就造成了写线程饥饿的现象。<br />写优先锁可以保证写线程不会饿死，但是如果一直有写线程获取写锁，读线程也会被饿死。<br />还有一种公平读写锁：用队列把获取锁的线程排队，不管是写线程还是读线程都按照先进先出的原则加锁即可，这样读线程仍然可以并发，也不会出现饥饿的现象。
<a name="mrvim"></a>

## 4、乐观锁与悲观锁

前面提到的互斥锁、自旋锁、读写锁，都属于悲观锁。<br />悲观锁认为多线程同时修改共享资源的概率比较高，于是很容易出现冲突，所以访问共享资源前，先要上锁。<br />而乐观锁认为冲突的概率很低，它的工作方式是：先修改完共享资源，再验证这段时间内有没有发生冲突，如果没有其他线程在修改资源，那么操作完成，如果发现有其他线程已经修改过这个资源，就放弃本次操作。<br />乐观锁全程没有加锁，所以它也叫无锁编程。<br />乐观锁虽然去除了加锁解锁的操作，但是一旦发生冲突，重试的成本非常高，所以只有在冲突概率非常低，且加锁成本非常高的场景时，才考虑使用乐观锁。

<a name="U6Dk0"></a>

# 零拷贝

零拷贝就是一种避免 CPU 将数据从一块存储拷贝到另外一块存储的技术。针对操作系统中的设备驱动程序、文件系统以及网络协议堆栈而出现的各种零拷贝技术极大地提升了特定应用程序的性能，并且使得这些应用程序可以更加有效地利用系统资源。这种性能的提升就是通过在数据拷贝进行的同时，允许 CPU 执行其他的任务来实现的。<br />零拷贝技术可以减少数据拷贝和共享总线操作的次数，消除传输数据在存储器之间不必要的中间拷贝次数，从而有效地提高数据传输效率。而且，零拷贝技术减少了用户应用程序地址空间和操作系统内核地址空间之间因为上下文切换而带来的开销。进行大量的数据拷贝操作其实是一件简单的任务，从操作系统的角度来说，如果 CPU 一直被占用着去执行这项简单的任务，那么这将会是很浪费资源的；如果有其他比较简单的系统部件可以代劳这件事情，从而使得 CPU 解脱出来可以做别的事情，那么系统资源的利用则会更加有效。综上所述，零拷贝技术的目标可以概括如下：

1. **避免数据拷贝**<br />① 避免操作系统内核缓冲区之间进行数据拷贝操作。<br />② 避免操作系统内核和用户应用程序地址空间这两者之间进行数据拷贝操作。<br />③ 用户应用程序可以避开操作系统直接访问硬件存储。<br />④ 数据传输尽量让 DMA 来做。
2. **综合目标**<br />① 避免不必要的系统调用和上下文切换。<br />② 需要拷贝的数据可以先被缓存起来。<br />③ 对数据进行处理尽量让硬件来做。
   <a name="Qbmtq"></a>

### 场景

接下来就探讨 Linux 中主要的几种零拷贝技术以及零拷贝技术适用的场景。为了迅速建立起零拷贝的概念，我们拿一个常用的场景进行引入<br />在写一个服务端程序时（Web Server 或者文件服务器），文件下载是一个基本功能。这时候服务端的任务是：将服务端主机磁盘中的文件不做修改地从已连接的 socket 发出去，我们通常用下面的代码完成：

1. while((n = read(diskfd, buf, BUF_SIZE)) > 0)
2. write(sockfd, buf , n);

基本操作就是循环的从磁盘读入文件内容到缓冲区，再将缓冲区的内容发送到 socket。但是由于 Linux 的 I/O 操作默认是缓冲 I/O。这里面主要使用的也就是 read 和 write 两个系统调用，我们并不知道操作系统在其中做了什么。实际上在以上 I/O 操作中，发生了多次的数据拷贝。<br />当应用程序访问某块数据时，操作系统首先会检查，是不是最近访问过此文件，文件内容是否缓存在内核缓冲区，如果是，操作系统则直接根据 read 系统调用提供的 buf 地址，将内核缓冲区的内容拷贝到 buf 所指定的用户空间缓冲区中去。如果不是，操作系统则首先将磁盘上的数据拷贝的内核缓冲区，这一步目前主要依靠 DMA 来传输，然后再把内核缓冲区上的内容拷贝到用户缓冲区中。接下来，write 系统调用再把用户缓冲区的内容拷贝到网络堆栈相关的内核缓冲区中，最后 socket 再把内核缓冲区的内容发送到网卡上。<br />说了这么多，不如看图清楚：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687700709962-dc0f1997-0790-427a-b806-836fcfe9b349.png?x-oss-process=image%2Fresize%2Cw_544%2Climit_0)<br />多次数据拷贝<br />从上图中可以看出，共产生了四次数据拷贝，即使使用了 DMA 来处理了与硬件的通讯，CPU 仍然需要处理两次数据拷贝，与此同时，在用户态与内核态也发生了多次上下文切换，无疑也加重了 CPU 负担。<br />在此过程中，我们没有对文件内容做任何修改，那么在内核空间和用户空间来回拷贝数据无疑就是一种浪费，而零拷贝主要就是为了解决这种低效性。
<a name="zlIGM"></a>

### 零拷贝技术（zero-copy）

零拷贝主要的任务就是避免 CPU 将数据从一块存储拷贝到另外一块存储，主要就是利用各种零拷贝技术，避免让 CPU 做大量的数据拷贝任务，减少不必要的拷贝，或者让别的组件来做这一类简单的数据传输任务，让 CPU 解脱出来专注于别的任务。这样就可以让系统资源的利用更加有效。<br />我们继续回到引文中的例子，我们如何减少数据拷贝的次数呢？一个很明显的着力点就是减少数据在内核空间和用户空间来回拷贝，这也引入了零拷贝的一个类型：让数据传输不需要经过 user space<br />使用 mmap<br />我们减少拷贝次数的一种方法是调用 mmap()来代替 read 调用：

1. buf = mmap(diskfd, len);
2. write(sockfd, buf, len);

应用程序调用 mmap()，磁盘上的数据会通过 DMA 被拷贝的内核缓冲区，接着操作系统会把这段内核缓冲区与应用程序共享，这样就不需要把内核缓冲区的内容往用户空间拷贝。应用程序再调用 write(),操作系统直接将内核缓冲区的内容拷贝到 socket 缓冲区中，这一切都发生在内核态，最后，socket 缓冲区再把数据发到网卡去。同样的，看图很简单：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687700709957-2280e5db-e1d5-4b7a-a3f4-02a4f3ea326b.png?x-oss-process=image%2Fresize%2Cw_550%2Climit_0)<br />mmap<br />使用 mmap 替代 read 很明显减少了一次拷贝，当拷贝数据量很大时，无疑提升了效率。但是使用 mmap 是有代价的。当你使用 mmap 时，你可能会遇到一些隐藏的陷阱。例如，当你的程序 map 了一个文件，但是当这个文件被另一个进程截断(truncate)时, write 系统调用会因为访问非法地址而被 SIGBUS 信号终止。SIGBUS 信号默认会杀死你的进程并产生一个 coredump,如果你的服务器这样被中止了，那会产生一笔损失。<br />通常我们使用以下解决方案避免这种问题：

1. 为 SIGBUS 信号建立信号处理程序<br />当遇到 SIGBUS 信号时，信号处理程序简单地返回，write 系统调用在被中断之前会返回已经写入的字节数，并且 errno 会被设置成 success,但是这是一种糟糕的处理办法，因为你并没有解决问题的实质核心。
2. 使用文件租借锁<br />通常我们使用这种方法，在文件描述符上使用租借锁，我们为文件向内核申请一个租借锁，当其它进程想要截断这个文件时，内核会向我们发送一个实时的 RT_SIGNAL_LEASE 信号，告诉我们内核正在破坏你加持在文件上的读写锁。这样在程序访问非法内存并且被 SIGBUS 杀死之前，你的 write 系统调用会被中断。write 会返回已经写入的字节数，并且置 errno 为 success。<br />我们应该在 mmap 文件之前加锁，并且在操作完文件后解锁：

```
if(fcntl(diskfd, F_SETSIG, RT_SIGNAL_LEASE) == -1) {

        perror("kernel lease set signal");

        return -1;

}

/* l_type can be F_RDLCK F_WRLCK 加锁*/

/* l_type can be F_UNLCK 解锁*/

        if(fcntl(diskfd, F_SETLEASE, l_type)){

        perror("kernel lease set type");

        return -1;

}
```

<a name="Cq94f"></a>

### 使用 sendfile

从 2.1 版内核开始，Linux 引入了 sendfile 来简化操作:

```
#include<sys/sendfile.h>

ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
```

系统调用 sendfile()在代表输入文件的描述符 in_fd 和代表输出文件的描述符 out_fd 之间传送文件内容（字节）。描述符 out_fd 必须指向一个套接字，而 in_fd 指向的文件必须是可以 mmap 的。这些局限限制了 sendfile 的使用，使 sendfile 只能将数据从文件传递到套接字上，反之则不行。使用 sendfile 不仅减少了数据拷贝的次数，还减少了上下文切换，数据传送始终只发生在 kernel space。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687700709982-4fd3fe2c-e199-4cbe-9a87-19606920af8c.png?x-oss-process=image%2Fresize%2Cw_626%2Climit_0)<br />在我们调用 sendfile 时，如果有其它进程截断了文件会发生什么呢？假设我们没有设置任何信号处理程序，sendfile 调用仅仅返回它在被中断之前已经传输的字节数，errno 会被置为 success。如果我们在调用 sendfile 之前给文件加了锁，sendfile 的行为仍然和之前相同，我们还会收到 RT_SIGNAL_LEASE 的信号。<br />目前为止，我们已经减少了数据拷贝的次数了，但是仍然存在一次拷贝，就是页缓存到 socket 缓存的拷贝。那么能不能把这个拷贝也省略呢？<br />借助于硬件上的帮助，我们是可以办到的。之前我们是把页缓存的数据拷贝到 socket 缓存中，实际上，我们仅仅需要把缓冲区描述符传到 socket 缓冲区，再把数据长度传过去，这样 DMA 控制器直接将页缓存中的数据打包发送到网络中就可以了。<br />总结一下，sendfile 系统调用利用 DMA 引擎将文件内容拷贝到内核缓冲区去，然后将带有文件位置和长度信息的缓冲区描述符添加 socket 缓冲区去，这一步不会将内核中的数据拷贝到 socket 缓冲区中，DMA 引擎会将内核缓冲区的数据拷贝到协议引擎中去，避免了最后一次拷贝。不过这一种收集拷贝功能是需要硬件以及驱动程序支持的。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687700710011-32dc03e5-eaa3-4eaf-a3c6-55a6f902308d.png?x-oss-process=image%2Fresize%2Cw_833%2Climit_0)<br />带 DMA 的 sendfile
<a name="WEMXl"></a>

### 使用 splice

**sendfile 只适用于将数据从文件拷贝到套接字上，限定了它的使用范围**。Linux 在 2.6.17 版本引入 splice 系统调用，用于在两个文件描述符中移动数据：

```
#define _GNU_SOURCE /* See feature_test_macros(7) */

#include <fcntl.h>

ssize_t splice(int fd_in, loff_t *off_in, int fd_out, loff_t *off_out, size_t len, unsigned int flags);
```

splice 调用在两个文件描述符之间移动数据，而不需要数据在内核空间和用户空间来回拷贝。他从 fd_in 拷贝 len 长度的数据到 fd_out，但是有一方必须是管道设备，这也是目前 splice 的一些局限性。flags 参数有以下几种取值：<br />1.SPLICE_F_MOVE ：尝试去移动数据而不是拷贝数据。这仅仅是对内核的一个小提示：如果内核不能从 pipe 移动数据或者 pipe 的缓存不是一个整页面，仍然需要拷贝数据。Linux 最初的实现有些问题，所以从 2.6.21 开始这个选项不起作用，后面的 Linux 版本应该会实现。

1. SPLICE_F_NONBLOCK ：splice 操作不会被阻塞。然而，如果文件描述符没有被设置为不可被阻塞方式的 I/O ，那么调用 splice 有可能仍然被阻塞。
2. SPLICE_F_MORE： 后面的 splice 调用会有更多的数据。<br />splice 调用利用了 Linux 提出的管道缓冲区机制， 所以至少一个描述符要为管道。<br />以上几种零拷贝技术都是减少数据在用户空间和内核空间拷贝技术实现的，但是有些时候，数据必须在用户空间和内核空间之间拷贝。这时候，我们只能针对数据在用户空间和内核空间拷贝的时机上下功夫了。Linux 通常利用写时复制(copy on write)来减少系统开销，这个技术又时常称作 COW。
   <a name="JsauK"></a>

# 系统调用和函数库的区别

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687701205971-9771181f-1c40-4d21-931d-c3e11e381c00.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
