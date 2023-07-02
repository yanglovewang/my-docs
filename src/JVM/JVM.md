---
title: JVM
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

基本概念： <br />JVM 是可运行 Java 代码的假想计算机 ，包括一套字节码指令集、一组寄存器、一个栈、 <br />一个垃圾回收，堆 和 一个存储方法域。JVM 是运行在操作系统之上的，它与硬件没有直接 <br />的交互。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685875446862-34278b25-bd70-4c3d-8b77-8c81c601477f.png#averageHue=%23fbfbfb&clientId=u2ef7f0aa-1610-4&from=paste&height=1085&id=ue2fe36f1&originHeight=868&originWidth=700&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=120604&status=done&style=none&taskId=uc64fe19f-fe58-442d-8dc2-e857b6f5116&title=&width=874.9999869614842)<br />我们都知道 Java 源文件，通过编译器，能够生产相应的.Class 文件，也就是字节码文件， <br />而字节码文件又通过 Java 虚拟机中的解释器，编译成特定机器上的机器码 。 <br />也就是如下：

- Java 源文件—->编译器—->字节码文件
- 字节码文件—->JVM—->机器码

每一种平台的解释器是不同的，但是实现的虚拟机是相同的，这也就是 Java 为什么能够 <br />跨平台的原因了 ，当一个程序从开始运行，这时虚拟机就开始实例化了，多个程序启动就会 <br />存在多个虚拟机实例。程序退出或者关闭，则虚拟机实例消亡，多个虚拟机实例之间数据不 <br />能共享。<br />
![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685875700694-1c87252c-ed18-4433-af66-d079d799ee2c.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="aUpCo"></a>

## 线程

这里所说的线程指程序执行过程中的一个线程实体。JVM 允许一个应用并发执行多个线程。 <br />Hotspot JVM 中的 Java 线程与原生操作系统线程有直接的映射关系。当线程本地存储、缓 <br />冲区分配、同步对象、栈、程序计数器等准备好以后，就会创建一个操作系统原生线程。 <br />Java 线程结束，原生线程随之被回收。操作系统负责调度所有线程，并把它们分配到任何可 <br />用的 CPU 上。当原生线程初始化完毕，就会调用 Java 线程的 run() 方法。当线程结束时，<br />会释放原生线程和 Java 线程的所有资源。<br />Hotspot JVM 后台运行的系统线程主要有下面几个：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685875891089-a813b428-e2d7-4bed-b077-c4a21bf601f2.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="Ehz7R"></a>

## JVM 内存

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685875970494-b3f547c1-92d2-430c-9b22-b0b4fd875f3b.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

JVM 内存区域主要分为线程私有区域【程序计数器、虚拟机栈、本地方法区】、线程共享区 <br />域【JAVA 堆、方法区】、直接内存。 <br />线程私有数据区域生命周期与线程相同, 依赖用户线程的启动/结束 而 创建/销毁(在 Hotspot <br />VM 内, 每个线程都与操作系统的本地线程直接映射, 因此这部分内存区域的存/否跟随本地线程的 <br />生/死对应)。<br />JVM 内存区域主要分为线程私有区域【程序计数器、虚拟机栈、本地方法区】、线程共享区 <br />域【JAVA 堆、方法区】、直接内存。 <br />线程私有数据区域生命周期与线程相同, 依赖用户线程的启动/结束 而 创建/销毁(在 Hotspot <br />VM 内, 每个线程都与操作系统的本地线程直接映射, 因此这部分内存区域的存/否跟随本地线程的 <br />生/死对应)。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685882649241-894ed6a8-8e66-4a85-b7df-a59d70337a68.png?x-oss-process=image%2Fresize%2Cw_909%2Climit_0)

**程序计数器(线程私有)**<br />一块较小的内存空间, 是当前线程所执行的字节码的行号指示器，每条线程都要有一个独立的 <br />程序计数器，这类内存也称为“线程私有”的内存。 <br />正在执行 java 方法的话，计数器记录的是虚拟机字节码指令的地址（当前指令的地址）。如 <br />果还是 Native 方法，则为空。 <br />这个内存区域是唯一一个在虚拟机中没有规定任何 OutOfMemoryError 情况的区域。

**虚拟机栈(线程私有)**<br />是描述 java 方法执行的内存模型，每个方法在执行的同时都会创建一个栈帧（Stack Frame） <br />用于存储局部变量表、操作数栈、动态链接、方法出口等信息。每一个方法从调用直至执行完成 <br />的过程，就对应着一个栈帧在虚拟机栈中入栈到出栈的过程。 <br />栈帧（ Frame）是用来存储数据和部分过程结果的数据结构，同时也被用来处理动态链接 (Dynamic Linking)、 方法返回值和异常分派（ Dispatch Exception）。栈帧随着方法调用而创建，随着方法结束而销毁——无论方法是正常完成还是异常完成（抛出了在方法内未被捕获的异 <br />常）都算作方法结束。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685882840292-41b78cbd-9779-49dc-8369-af3f160e3a26.png#averageHue=%23fafafa&clientId=u2ef7f0aa-1610-4&from=paste&height=716&id=uf17e17ce&originHeight=573&originWidth=626&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=75449&status=done&style=none&taskId=uafed943f-0472-4705-a83f-6ef8c2e7af2&title=&width=782.4999883398416)
<a name="XRRrm"></a>

### **本地方法区(线程私有)**

本地方法区和 Java Stack 作用类似, 区别是虚拟机栈为执行 Java 方法服务, 而本地方法栈则为 <br />Native 方法服务, 如果一个 VM 实现使用 C-linkage 模型来支持 Native 调用, 那么该栈将会是一个 <br />C 栈，但 HotSpot VM 直接就把本地方法栈和虚拟机栈合二为一。
<a name="RaqfX"></a>

### **堆（Heap-线程共享）-运行时数据区**

是被线程共享的一块内存区域，创建的对象和数组都保存在 Java 堆内存中，也是垃圾收集器进行 <br />垃圾收集的最重要的内存区域。由于现代 VM 采用**分代收集算法**, 因此 Java 堆从 GC 的角度还可以 <br />细分为: **新生代**(_Eden 区_、*From Survivor 区*和 _To Survivor 区_)和**老年代。**
<a name="dz9iz"></a>

### 方法区/永久代（线程共享）

即我们常说的**永久代(Permanent Generation)**, 用于存储**被 JVM 加载的类信息**、**常量**、**静 **<br />**态变量**、**即时编译器编译后的代码**等数据. HotSpot VM 把 GC 分代收集扩展至方法区, 即**使用 Java **<br />**堆的永久代来实现方法区**, 这样 HotSpot 的垃圾收集器就可以像管理 Java 堆一样管理这部分内存, <br />而不必为方法区开发专门的内存管理器(永久带的内存回收的主要目标是针对**常量池的回收**和**类型 **<br />**的卸载**, 因此收益一般很小)。 <br />运行时常量池（Runtime Constant Pool）是方法区的一部分。Class 文件中除了有类的版本、字段、方法、接口等描述等信息外，还有一项信息是常量池 Constant Pool Table），用于存放编译期生成的各种字面量和符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。 Java 虚拟机对 Class 文件的每一部分（自然也包括常量池）的格式都有严格的规定，每一个字节用于存储哪种数据都必须符合规范上的要求，这样才会被虚拟机认可、装载和执行。
<a name="LVHlu"></a>

## JVM 运行时内存

Java 堆从 GC 的角度还可以细分为: **新生代**(_Eden 区_、*From Survivor 区*和 _To Survivor 区_)和**老年 **<br />**代。**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685883040599-3c369af9-8c33-44ff-b4ea-ae12c5fc32bb.png#averageHue=%23b4bebb&clientId=u2ef7f0aa-1610-4&from=paste&height=365&id=uf25eb7fb&originHeight=292&originWidth=938&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=112271&status=done&style=none&taskId=u1134bb2f-8b18-49ae-8d5e-bfb29d783bd&title=&width=1172.4999825283887)
<a name="P2Arc"></a>

### 新生代

是用来存放新生的对象。一般占据堆的 1/3 空间。由于频繁创建对象，所以新生代会频繁触发 MinorGC 进行垃圾回收。新生代又分为 Eden 区、ServivorFrom、ServivorTo 三个区。
<a name="PbPBp"></a>

#### Eden 区

Java 新对象的出生地（如果新创建的对象占用内存很大，则直接分配到老 年代）。当 Eden 区内存不够的时候就会触发 MinorGC，对新生代区进行一次垃圾回收。
<a name="PkIIn"></a>

#### **ServivorFrom**

上一次 GC 的幸存者，作为这一次 GC 的被扫描者<br />**ServivorTo**<br />保留了一次 MinorGC 过程中的幸存者。<br />**MinorGC 的过程（复制->清空->互换）**<br />**\_1**：**eden**、**servicorFrom **复制到 **ServicorTo，年龄+1 \_**<br />首先，把 Eden 和 ServivorFrom 区域中存活的对象复制到 ServicorTo 区域（如果有对象的年龄以及达到了老年的标准，则赋值到老年代区），同时把这些对象的年龄+1（如果 ServicorTo 不够位置了就放到老年区）； <br />**\_2**：清空 **eden**、**servicorFrom \_**<br />然后，清空 Eden 和 ServicorFrom 中的对象； <br />**\_3**：**ServicorTo **和 **ServicorFrom \_\_互换 \_**<br />最后，ServicorTo 和 ServicorFrom 互换，原 ServicorTo 成为下一次 GC 时的 ServicorFrom 区。
<a name="Fet6F"></a>

### 老年代

主要存放应用程序中生命周期长的内存对象。 老年代的对象比较稳定，所以 MajorGC 不会频繁执行。在进行 MajorGC 前一般都先进行 了一次 MinorGC，使得有新生代的对象晋身入老年代，导致空间不够用时才触发。当无法找到足够大的连续空间分配给新创建的较大对象时也会提前触发一次 MajorGC 进行垃圾回收腾出空间。 MajorGC 采用标记清除算法：首先扫描一次所有老年代，标记出存活的对象，然后回收没有标记的对象。MajorGC 的耗时比较长，因为要扫描再回收。MajorGC 会产生内存碎片，为了减少内存损耗，我们一般需要进行合并或者标记出来方便下次直接分配。当老年代也满了装不下的时候，就会抛出 OOM（Out of Memory）异常。
<a name="m5vwo"></a>

### 永久代

指内存的永久保存区域，主要存放 Class 和 Meta（元数据）的信息,Class 在被加载的时候被 放入永久区域，它和和存放实例的区域不同,GC 不会在主程序运行期对永久区域进行清理。所以这 也导致了永久代的区域会随着加载的 Class 的增多而胀满，最终抛出 OOM 异常。
<a name="bhUvV"></a>

#### 元空间

Java8 中，永久代已经被移除，被一个称为“元数据区”（元空间）的区域所取代。元空间 的本质和永久代类似，元空间与永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用 本地内存。因此，默认情况下，元空间的大小仅受本地内存限制。类的元数据放入 native memory, 字符串池和类的静态变量放入 java 堆中，这样可以加载多少类的元数据就不再由 MaxPermSize 控制, 而由系统的实际可用空间来控制。
<a name="WQreP"></a>

## 垃圾回收算法

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685883380368-810630a9-6f15-4446-b538-490400aab749.png?x-oss-process=image%2Fresize%2Cw_897%2Climit_0)
<a name="umyUo"></a>

### **如何确定垃圾**

<a name="fO7OG"></a>

#### 引用计数法

在 Java 中，引用和对象是有关联的。如果要操作对象则必须用引用进行。因此，很显然一个简单的办法是通过引用计数来判断一个对象是否可以回收。简单说，即一个对象如果没有任何与之关联的引用，即他们的引用计数都不为 0，则说明对象不太可能再被用到，那么这个对象就是可回收对象。
<a name="PNM4A"></a>

#### 可达性分析

为了解决引用计数法的循环引用问题，Java 使用了可达性分析的方法。通过一系列的“GC roots”对象作为起点搜索。如果在“GC roots”和一个对象之间没有可达路径，则称该对象是不可达的。要注意的是，不可达对象不等价于可回收对象，不可达对象变为可回收对象至少要经过两次标记过程。两次标记后仍然是可回收对象，则将面临回收。
<a name="YHVUw"></a>

#### 标记清除法

最基础的垃圾回收算法，分为两个阶段，标注和清除。标记阶段标记出所有需要回收的对象，清除阶段回收被标记的对象所占用的空间。如图<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685883821368-4dea4e06-9266-4ce6-a1d8-36cdfcaf35fa.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />从图中我们就可以发现，该算法最大的问题是内存碎片化严重，后续可能发生大对象不能找到可 利用空间的问题。
<a name="nBskP"></a>

### 复制算法

为了解决 Mark-Sweep 算法内存碎片化的缺陷而被提出的算法。按内存容量将内存划分为等大小的两块。每次只使用其中一块，当这一块内存满后将尚存活的对象复制到另一块上去，把已使用的内存清掉，如图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685883877291-4eac5215-2933-4df0-8a55-07e977e77e6f.png#averageHue=%23c3c1b4&clientId=u7eb5c3f8-9cb8-4&from=paste&height=469&id=u236dc1ec&originHeight=375&originWidth=685&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=69604&status=done&style=none&taskId=u910438bd-7292-4352-96c9-e331bc4d411&title=&width=856.249987240881)<br />这种算法虽然实现简单，内存效率高，不易产生碎片，但是最大的问题是可用内存被压缩到了原本的一半。且存活对象增多的话，Copying 算法的效率会大大降低。
<a name="GSdu8"></a>

### 分代收集法

分代收集法是目前大部分 JVM 所采用的方法，其核心思想是根据对象存活的不同生命周期将内存划分为不同的域，一般情况下将 GC 堆划分为老生代(Tenured/Old Generation)和新生代(Young Generation)。老生代的特点是每次垃圾回收时只有少量对象需要被回收，新生代的特点是每次垃圾回收时都有大量垃圾需要被回收，因此可以根据不同区域选择不同的算法。
<a name="ZyPvA"></a>

#### 新生代与复制算法

目前大部分 JVM 的 GC 对于新生代都采取 Copying 算法，因为新生代中每次垃圾回收都要回收大部分对象，即要复制的操作比较少，但通常并不是按照 1：1 来划分新生代。一般将新生代划分为一块较大 Eden 空间和两个较小的 Survivor 空间(From Space, To Space)，每次使用 Eden 空间和其中的一块 Survivor 空间，当进行回收时，将该两块空间中还存活的对象复制到另一块 Survivor 空间中。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685884839901-0af04128-376b-4d63-b882-7d1518e69f83.png#averageHue=%23fcfcfc&clientId=u7eb5c3f8-9cb8-4&from=paste&height=245&id=uf8b38597&originHeight=196&originWidth=898&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=57030&status=done&style=none&taskId=uefac2375-0d98-4b82-ba9c-96d19b2e946&title=&width=1122.4999832734468)
<a name="rUOS8"></a>

#### 老年代与标记复制算法

- 而老年代因为每次只回收少量对象，因而采用 Mark-Compact 算法。
- JAVA 虚拟机提到过的处于方法区的永生代(Permanet Generation)，它用来存储 class 类， 常量，方法描述等。对永生代的回收主要包括废弃常量和无用的类。
- 对象的内存分配主要在新生代的 Eden Space 和 Survivor Space 的 From Space(Survivor 目 前存放对象的那一块)，少数情况会直接分配到老生代。
- 当新生代的 Eden Space 和 From Space 空间不足时就会发生一次 GC，进行 GC 后，Eden Space 和 From Space 区的存活对象会被挪到 To Space，然后将 Eden Space 和 From Space 进行清理。
- 如果 To Space 无法足够存储某个对象，则将这个对象存储到老生代。
- 在进行 GC 后，使用的便是 Eden Space 和 To Space 了，如此反复循环。
- 当对象在 Survivor 区躲过一次 GC 后，其年龄就会+1。默认情况下年龄到达 15 的对象会被移到老生代中。

<a name="cf0AW"></a>

## Java 四种引用

**2.5.1. 强引用**
在 Java 中最常见的就是强引用，把一个对象赋给一个引用变量，这个引用变量就是一个强引用。当一个对象被强引用变量引用时，它处于可达状态，它是不可能被垃圾回收机制回收的，即使该对象以后永远都不会被用到 JVM 也不会回收。因此强引用是造成 Java 内存泄漏的主要原因之一。
**2.5.2. 软引用**
软引用需要用 SoftReference 类来实现，对于只有软引用的对象来说，当系统内存足够时它不会被回收，当系统内存空间不足时它会被回收。软引用通常用在对内存敏感的程序中。
**2.5.3. 弱引用**
弱引用需要用 WeakReference 类来实现，它比软引用的生存期更短，对于只有弱引用的对象来说，只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，总会回收该对象占用的内存。
**2.5.4. 虚引用**
虚引用需要 PhantomReference 类来实现，它不能单独使用，必须和引用队列联合使用。虚引用的主要作用是跟踪对象被垃圾回收的状态
<a name="NDbZj"></a>

## GC 分代收集算法 VS 分区收集算法

<a name="ZXIrl"></a>

### 分代收集算法

当前主流 VM 垃圾收集都采用”分代收集”(Generational Collection)算法, 这种算法会根据对象存活周期的不同将内存划分为几块, 如 JVM 中的 新生代、老年代、永久代，这样就可以根据各年代特点分别采用最适当的 GC 算法
<a name="aocE8"></a>

#### 在新生代-复制算法

每次垃圾收集都能发现大批对象已死, 只有少量存活. 因此选用复制算法, 只需要付出少量存活对象的复制成本就可以完成收集.
<a name="E3qEQ"></a>

#### 在老年代-标记整理算法

因为对象存活率高、没有额外空间对它进行分配担保, 就必须采用“标记—清理”或“标记—整理”算法来进行回收, 不必进行内存复制, 且直接腾出空闲内存
<a name="VTTRG"></a>

#### 分区收集算法

分区算法则将整个堆空间划分为连续的不同小区间, 每个小区间独立使用, 独立回收. 这样做的好处是可以控制一次回收多少个小区间 , 根据目标停顿时间, 每次合理地回收若干个小区间(而不是整个堆), 从而减少一次 GC 所产生的停顿。
<a name="Lp9Ye"></a>

## GC 垃圾收集器

Java 堆内存被划分为新生代和年老代两部分，新生代主要使用复制和标记-清除垃圾回收算法；年老代主要使用标记-整理垃圾回收算法，因此 java 虚拟中针对新生代和年老代分别提供了多种不同的垃圾收集器，JDK1.6 中 Sun HotSpot 虚拟机的垃圾收集器如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685885186743-ec01ba65-9823-46b3-9592-469c09ae4731.png?x-oss-process=image%2Fresize%2Cw_787%2Climit_0)
<a name="unnTX"></a>

### Serial 垃圾收集器（单线程、复制算法）

Serial（英文连续）是最基本垃圾收集器，使用复制算法，曾经是 JDK1.3.1 之前新生代唯一的垃圾收集器。Serial 是一个单线程的收集器，它不但只会使用一个 CPU 或一条线程去完成垃圾收集工作，并且在进行垃圾收集的同时，必须暂停其他所有的工作线程，直到垃圾收集结束。 <br />Serial 垃圾收集器虽然在收集垃圾过程中需要暂停所有其他的工作线程，但是它简单高效，对于限定单个 CPU 环境来说，没有线程交互的开销，可以获得最高的单线程垃圾收集效率，因此 Serial 垃圾收集器依然是 java 虚拟机运行在 Client 模式下默认的新生代垃圾收集器。
<a name="lHpJr"></a>

### ParNew 垃圾收集器（Serial+多线程）

ParNew 垃圾收集器其实是 Serial 收集器的多线程版本，也使用复制算法，除了使用多线程进行垃圾收集之外，其余的行为和 Serial 收集器完全一样，ParNew 垃圾收集器在垃圾收集过程中同样也要暂停所有其他的工作线程。<br />ParNew 收集器默认开启和 CPU 数目相同的线程数，可以通过-XX:ParallelGCThreads 参数来限制垃圾收集器的线程数。【Parallel：平行的】ParNew 虽然是除了多线程外和 Serial 收集器几乎完全一样，但 ParNew 垃圾收集器是很多 java 虚拟机运行在 Server 模式下新生代的默认垃圾收集器。
<a name="Jo40c"></a>

#### Parallel Scavenge 收集器（多线程复制算法、高效）

Parallel Scavenge 收集器也是一个新生代垃圾收集器，同样使用复制算法，也是一个多线程的垃圾收集器，它重点关注的是程序达到一个可控制的吞吐量（Thoughput，CPU 用于运行用户代码的时间/CPU 总消耗时间，即吞吐量=运行用户代码时间/(运行用户代码时间+垃圾收集时间)）， 高吞吐量可以最高效率地利用 CPU 时间，尽快地完成程序的运算任务，主要适用于在后台运算而不需要太多交互的任务。自适应调节策略也是 ParallelScavenge 收集器与 ParNew 收集器的一个重要区别。
<a name="jte61"></a>

#### Serial Old 收集器（单线程标记整理算法 ）

Serial Old 是 Serial 垃圾收集器年老代版本，它同样是个单线程的收集器，使用标记-整理算法，这个收集器也主要是运行在 Client 默认的 java 虚拟机默认的年老代垃圾收集器。在 Server 模式下，主要有两个用途： <br />1. 在 JDK1.5 之前版本中与新生代的 Parallel Scavenge 收集器搭配使用。 <br />2. 作为年老代中使用 CMS 收集器的后备垃圾收集方案。 <br />新生代 Serial 与年老代 Serial Old 搭配垃圾收集过程图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685885278916-9e9fbde2-b6a2-4c2d-8e64-f85cac02cad0.png?x-oss-process=image%2Fresize%2Cw_808%2Climit_0)<br />新生代 Parallel Scavenge 收集器与 ParNew 收集器工作原理类似，都是多线程的收集器，都使用的是复制算法，在垃圾收集过程中都需要暂停所有的工作线程。新生代 Parallel Scavenge/ParNew 与年老代 Serial Old 搭配垃圾收集过程图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685885304572-1158c29d-deed-42f9-924b-a12900f92761.png?x-oss-process=image%2Fresize%2Cw_820%2Climit_0)
<a name="PAeZm"></a>

#### Parallel Old 收集器（多线程标记整理算法）

Parallel Old 收集器是 Parallel Scavenge 的年老代版本，使用多线程的标记-整理算法，在 JDK1.6 才开始提供。 <br />在 JDK1.6 之前，新生代使用 ParallelScavenge 收集器只能搭配年老代的 Serial Old 收集器，只能保证新生代的吞吐量优先，无法保证整体的吞吐量，Parallel Old 正是为了在年老代同样提供吞吐量优先的垃圾收集器，如果系统对吞吐量要求比较高，可以优先考虑新生代 Parallel Scavenge 和年老代 Parallel Old 收集器的搭配策略。 <br />新生代 Parallel Scavenge 和年老代 Parallel Old 收集器搭配运行过程图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685885336992-891bb698-3cc2-4627-bdb9-5d6709a5e683.png?x-oss-process=image%2Fresize%2Cw_706%2Climit_0)
<a name="bFCoY"></a>

#### CMS 收集器（多线程标记清除算法）

Concurrent mark sweep(CMS)收集器是一种年老代垃圾收集器，其最主要目标是获取最短垃圾回收停顿时间，和其他年老代使用标记-整理算法不同，它使用多线程的标记-清除算法。最短的垃圾收集停顿时间可以为交互比较高的程序提高用户体验。 CMS 工作机制相比其他的垃圾收集器来说更复杂，整个过程分为以下 4 个阶段：
<a name="umo9e"></a>

#### 初始标记

只是标记一下 GC Roots 能直接关联的对象，速度很快，仍然需要暂停所有的工作线程。
<a name="vGNQp"></a>

#### 并发标记

进行 GC Roots 跟踪的过程，和用户线程一起工作，不需要暂停工作线程。
<a name="CyJrG"></a>

#### 重新标记

为了修正在并发标记期间，因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录，仍然需要暂停所有的工作线程。
<a name="llgWw"></a>

#### 并发清除

清除 GC Roots 不可达对象，和用户线程一起工作，不需要暂停工作线程。由于耗时最长的并发标记和并发清除过程中，垃圾收集线程可以和用户现在一起并发工作，所以总体上来看 CMS 收集器的内存回收和用户线程是一起并发地执行。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1685885397441-1a6a906d-6333-4bde-bdaf-08a748610e40.png?x-oss-process=image%2Fresize%2Cw_908%2Climit_0)
<a name="Rpa9Q"></a>

### G1 收集器

Garbage first 垃圾收集器是目前垃圾收集器理论发展的最前沿成果，相比与 CMS 收集器，G1 收集器两个最突出的改进是： <br />1. 基于标记-整理算法，不产生内存碎片。 <br />2. 可以非常精确控制停顿时间，在不牺牲吞吐量前提下，实现低停顿垃圾回收。 <br />G1 收集器避免全区域垃圾收集，它把堆内存划分为大小固定的几个独立区域，并且跟踪这些区域的垃圾收集进度，同时在后台维护一个优先级列表，每次根据所允许的收集时间，优先回收垃圾最多的区域。区域划分和优先级区域回收机制，确保 G1 收集器可以在有限时间获得最高的垃圾收集效率。
<a name="Tl2md"></a>

## 类加载机制

JVM 类加载机制分为五个部分：加载，验证，准备，解析，初始化，下面我们就分别来看一下这五个过程。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686059296356-43306032-0b56-4c93-90ee-5c37e6b2e15d.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="OpT6Z"></a>

### 加载

加载是类加载过程中的一个阶段，这个阶段会在内存中生成一个代表这个类的 java.lang.Class 对象，作为方法区这个类的各种数据的入口。注意这里不一定非得要从一个 Class 文件获取，这里既可以从 ZIP 包中读取（比如从 jar 包和 war 包中读取），也可以在运行时计算生成（动态代理）， 也可以由其它文件生成（比如将 JSP 文件转换成对应的 Class 类）。
<a name="BpvF6"></a>

### 验证

这一阶段的主要目的是为了确保 Class 文件的字节流中包含的信息是否符合当前虚拟机的要求，并且不会危害虚拟机自身的安全。
<a name="abvhq"></a>

### 准备

准备阶段是正式为类变量分配内存并设置类变量的初始值阶段，即在方法区中分配这些变量所使用的内存空间。注意这里所说的初始值概念，比如一个类变量定义为：

```java
public static int v = 8080;
```

实际上变量 v 在准备阶段过后的初始值为 0 而不是 8080，将 v 赋值为 8080 的 put static 指令是程序被编译后，存放于类构造器 client 方法之中。 <br />但是注意如果声明为：

```java
public static final int v = 8080;
```

在编译阶段会为 v 生成 ConstantValue 属性，在准备阶段虚拟机会根据 ConstantValue 属性将 v 赋值为 8080。
<a name="AbOOk"></a>

### 解析

解析阶段是指虚拟机将常量池中的符号引用替换为直接引用的过程。符号引用就是 class 文件中的：

1. CONSTANT_Class_info
2. CONSTANT_Field_info
3. CONSTANT_Method_info

等类型的常量。
<a name="ChP2O"></a>

### 符号引用

符号引用与虚拟机实现的布局无关，引用的目标并不一定要已经加载到内存中。各种虚拟机实现的内存布局可以各不相同，但是它们能接受的符号引用必须是一致的，因为符号引用的字面量形式明确定义在 Java 虚拟机规范的 Class 文件格式中。
<a name="oyztR"></a>

### 直接引用

直接引用可以是指向目标的指针，相对偏移量或是一个能间接定位到目标的句柄。如果有了直接引用，那引用的目标必定已经在内存中存在。
<a name="MjS9X"></a>

### 初始化

初始化阶段是类加载最后一个阶段，前面的类加载阶段之后，除了在加载阶段可以自定义类加载器以外，其它操作都由 JVM 主导。到了初始阶段，才开始真正执行类中定义的 Java 程序代码。
<a name="KU5p4"></a>

### 类构造器

初始化阶段是执行类构造器 client 方法的过程。client 方法是由编译器自动收集类中的类变量的赋值操作和静态语句块中的语句合并而成的。虚拟机会保证子 client 方法执行之前，父类的 client 方法已经执行完毕，如果一个类中没有对静态变量赋值也没有静态语句块，那么编译器可以不为这个类生成 client ()方法。<br />注意以下几种情况不会执行类初始化：

- 通过子类引用父类的静态字段，只会触发父类的初始化，而不会触发子类的初始化。
- 定义对象数组，不会触发该类的初始化。
- 常量在编译期间会存入调用类的常量池中，本质上并没有直接引用定义常量的类，不会触 发定义常量所在的类。
- 通过类名获取 Class 对象，不会触发类的初始化。
- 通过 Class.forName 加载指定类时，如果指定参数 initialize 为 false 时，也不会触发类初 始化，其实这个参数是告诉虚拟机，是否要对类进行初始化。
- 通过 ClassLoader 默认的 loadClass 方法，也不会触发初始化动作。
  <a name="HRCM3"></a>

### 类加载器

虚拟机设计团队把加载动作放到 JVM 外部实现，以便让应用程序决定如何获取所需的类，JVM 提 供了 3 种类加载器：
<a name="J737Y"></a>

#### 启动类加载器

负责加载 JAVA_HOME\lib 目录中的，或通过-Xbootclasspath 参数指定路径中的，且被虚拟机认可（按文件名识别，如 rt.jar）的类。
<a name="efj2c"></a>

#### 扩展类加载器

负责加载 JAVA_HOME\lib\ext 目录中的，或通过 java.ext.dirs 系统变量指定路径中的类 库。
<a name="exKzg"></a>

#### 应用程序类加载器

负责加载用户路径（classpath）上的类库。 JVM 通过双亲委派模型进行类的加载，当然我们也可以通过继承 java.lang.ClassLoader 实现自定义的类加载器。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686059677175-57bb7252-f246-4f48-8d1c-e1604f67f467.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="PAYIL"></a>

### 双亲委派

一个类收到了类加载请求，他首先不会尝试自己去加载这个类，而是把这个请求委派给父类去完成，每一个层次类加载器都是如此，因此所有的加载请求都应该传送到启动类加载其中，只有当父类加载器反馈自己无法完成这个请求的时候（在它的加载路径下没有找到所需加载的 Class），子类加载器才会尝试自己去加载。 <br />采用双亲委派的一个好处是比如加载位于 rt.jar 包中的类 java.lang.Object，不管是哪个加载器加载这个类，最终都是委托给顶层的启动类加载器进行加载，这样就保证了使用不同的类加载器最终得到的都是同样一个 Object 对象。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686059734271-68b96f64-f97c-475e-a5c7-bdd14e25f144.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="K7qZL"></a>

### OSGI（动态模型系统）

OSGi(Open Service Gateway Initiative)，是面向 Java 的动态模型系统，是 Java 动态化模块化系统的一系列规范。
<a name="oZYYV"></a>

#### 动态改变构造

OSGi 服务平台提供在多种网络设备上无需重启的动态改变构造的功能。为了最小化耦合度和促使这些耦合度可管理，OSGi 技术提供一种面向服务的架构，它能使这些组件动态地发现对方。
<a name="RcAjk"></a>

#### 模块化编程与热插拔

OSGi 旨在为实现 Java 程序的模块化编程提供基础条件，基于 OSGi 的程序很可能可以实现模块级的热插拔功能，当程序升级更新时，可以只停用、重新安装然后启动程序的其中一部分，这对企业级程序开发来说是非常具有诱惑力的特性。 <br />OSGi 描绘了一个很美好的模块化开发目标，而且定义了实现这个目标的所需要服务与架构，同时也有成熟的框架进行实现支持。但并非所有的应用都适合采用 OSGi 作为基础架构，它在提供强大功能同时，也引入了额外的复杂度，因为它不遵守了类加载的双亲委托模型。

成特定机器上的机器码。<br />也就是如下：<br />①Java 源文件—->编译器—->字节码文件<br />② 字节码文件—->JVM—->机器码<br />每一种平台的解释器是不同的，但是实现的虚拟机是相同的，这也就是 Java 为什么能够<br />跨平台的原因了，当一个程序从开始运行，这时虚拟机就开始实例化了，多个程序启动就会<br />存在多个虚拟机实例。程序退出或者关闭，则虚拟机实例消亡，多个虚拟机实例之间数据不<br />能共享。
