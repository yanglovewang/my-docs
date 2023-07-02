---
title: ConcurrentHashMap
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---
## 简介
在包java.util.concurrent下，和HashMap不同的是专门处理并发问题<br />ConcurrentHashMap 采用了分段锁技术，其中 Segment 继承于 ReentrantLock。不会像 HashTable 那样不管是 put 还是 get 操作都需要做同步处理，理论上 ConcurrentHashMap 支持 CurrencyLevel (Segment 数组数量)的线程并发。每当一个线程占用锁访问一个 Segment 时，不会影响到其他的 Segment。
<a name="KF6Ua"></a>
## 核心的成员变量
```java
    /**
     * Segment 数组，存放数据时首先需要定位到具体的 Segment 中。
     */
    final Segment<K,V>[] segments;

    transient Set<K> keySet;
    transient Set<Map.Entry<K,V>> entrySet;

```
<a name="Tx4SS"></a>
## 分段锁
ConcurrentHashMap，它内部细分了若干个小的 HashMap，称之为段(Segment)。默认情况下 一个 ConcurrentHashMap 被进一步细分为 16 个段，既就是锁的并发度。如果需要在 ConcurrentHashMap 中添加一个新的表项，并不是将整个 HashMap 加锁，而是首 先根据 hashcode 得到该表项应该存放在哪个段中，然后对该段加锁，并完成put 操作。在多线程环境中，如果多个线程同时进行 put操作，只要被加入的表项不存放在同一个段中，则线程间可以做到真正的并行

ConcurrentHashMap 是由 Segment 数组结构和 HashEntry 数组结构组成Segment 是一种可重入锁 ReentrantLock，在 ConcurrentHashMap 里扮演锁的角色，HashEntry 则用于存储键值对数据。一个 ConcurrentHashMap 里包含一个 Segment 数组，Segment 的结构和 HashMap 类似，是一种数组和链表结构， 一个 Segment里包含一个 HashEntry 数组，每个 HashEntry 是一个链表结构的元素， 每个 Segment 守护一个 HashEntry 数组里的元素,当对 HashEntry 数组的数据进行修改时，必须首先获得它对应的 Segment 锁。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686991412523-5c9213f5-09dd-4efa-b7cb-73d0850eb627.png#averageHue=%23a4b8d5&clientId=u9777f4cf-98a3-4&from=paste&height=319&id=u009beda5&originHeight=255&originWidth=500&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=88222&status=done&style=none&taskId=u2546fd9b-44af-4ca3-be22-a854475f641&title=&width=624.9999906867744)<br />如下图是ConcurrentHashMap的内部结构图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686991489145-04c09741-d286-4752-9843-753194c2ce2b.png#averageHue=%23f6f6f6&clientId=u9777f4cf-98a3-4&from=paste&height=535&id=ua8e5e017&originHeight=428&originWidth=475&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=147158&status=done&style=none&taskId=u76ba72f8-244d-4fa7-bb7d-c0c51f7aa6f&title=&width=593.7499911524357)<br />Segment默认是**16**，按理说最多同时支持**16**个线程并发读写，但是是操作不同的Segment，初始化时也可以指定Segment数量，每一个Segment都会有一把锁，保证线程安全。<br />**该结构的优劣势**

1. 坏处是这一种结构的带来的副作用是Hash的过程要比普通的HashMap要长。
2. 好处是写操作的时候可以只对元素所在的Segment进行加锁即可，不会影响到其他的Segment，这样，在最理想的情况下，ConcurrentHashMap可以最高同时支持Segment数量大小的写操作(刚好这些写操作都非常平均地分布在所有的Segment上)。

所以，通过这一种结构，ConcurrentHashMap的并发能力可以大大的提高。
<a name="OgvGb"></a>
## JDK1.8的currentHashMap
JDK1.8的currentHashMap参考了1.8HashMap的实现方式,采用了**数组+链表+红黑树**的实现方式,其中大量的使用CAS操作.CAS(compare and swap)的缩写,也就是我们说的比较交换。<br />CAS是一种基于锁的操作，而且是乐观锁。java的锁中分为乐观锁和悲观锁。悲观锁是指将资源锁住，等待当前占用锁的线程释放掉锁，另一个线程才能够获取线程.乐观锁是通过某种方式不加锁，比如说添加version字段来获取数据。<br />CAS操作包含三个操作数(内存位置,预期的原值,和新值)。如果内存的值和预期的原值是一致的，那么就转化为新值。CAS是通过不断的循环来获取新值的,如果线程中的值被另一个线程修改了,那么A线程就需要自旋,到下次循环才有可能执行。<br />JDK8中彻底放弃了Segment转而采用的是Node，其设计思想也不再是JDK1.7中的分段锁思想。<br />Node：保存key，value及key的[hash](https://so.csdn.net/so/search?q=hash&spm=1001.2101.3001.7020)值的数据结构。其中value和next都用volatile修饰，保证并发的可见性。<br />Java8的ConcurrentHashMap结构基本上和Java8的HashMap一样，不过保证线程安全性。在JDK8中ConcurrentHashMap的结构，由于引入了红黑树，使得ConcurrentHashMap的实现非常复杂。<br />我们都知道，红黑树是一种性能非常好的二叉查找树，其查找性能为O(logN)，早期完全采用链表结构时Map的查找时间复杂度为O(N)，JDK8中ConcurrentHashMap在链表的长度大于某个阈值的时候会将链表转换成红黑树进一步提高其查找性能。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686991559794-bfa4bd29-6d92-42c4-86ed-577aea11a550.png#averageHue=%23f4f3f3&clientId=u9777f4cf-98a3-4&from=paste&height=445&id=u7dda9925&originHeight=356&originWidth=640&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=173769&status=done&style=none&taskId=u0e753374-3307-47b7-ac6d-78669d3aee7&title=&width=799.9999880790713)
<a name="pugTR"></a>
## 总结
看完了整个 HashMap 和 ConcurrentHashMap 在 1.7 和 1.8 中不同的实现方式相信大家对他们的理解应该会更加到位。其实这块也是面试的重点内容，通常的套路是：

- 谈谈你理解的 HashMap，讲讲其中的 get put 过程。
- 1.8 做了什么优化？
- 是线程安全的嘛？
- 不安全会导致哪些问题？
- 如何解决？有没有线程安全的并发容器？
- ConcurrentHashMap 是如何实现的？1.7、1.8 实现有何不同？为什么这么做？

这一串问题相信大家仔细看完都能怼回面试官。
