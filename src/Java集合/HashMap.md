---
title: HashMap
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

## HashMap 原理

基于[哈希表](https://so.csdn.net/so/search?q=%E5%93%88%E5%B8%8C%E8%A1%A8&spm=1001.2101.3001.7020)的 Map 接口的实现。此实现提供所有可选的映射操作，并允许使用 null 值和 null 键。（除了非同步和允许使用 null 之外，HashMap 类与 [Hashtable](https://baike.baidu.com/item/Hashtable/3149676) 大致相同。）此类不保证映射的顺序，特别是它不保证该顺序恒久不变。 此实现假定[哈希函数](https://so.csdn.net/so/search?q=%E5%93%88%E5%B8%8C%E5%87%BD%E6%95%B0&spm=1001.2101.3001.7020)将元素适当地分布在各桶之间，可为基本操作（get 和 put）提供稳定的性能。迭代 collection 视图所需的时间与 HashMap 实例的“容量”（桶的数量）及其大小（键-值映射关系数）成比例。所以，如果迭代性能很重要，则不要将初始容量设置得太高（或将加载因子设置得太低）。
<a name="k3PKE"></a>

## 数据结构

我们知道，在 Java 中最常用的两种结构是** 数组** 和** 链表**，几乎所有的数据结构都可以利用这两种来组合实现，HashMap 就是这种应用的一个典型。实际上，HashMap 就是一个 **链表数组**，如下是它数据结构：<br />![image.png](/assets/image/1.png)<br />从上图我们可以看出 HashMap 底层实现还是数组，只是数组的每一项都是一条链。其中参数 initialCapacity 就代表了该数组的长度。下面为 HashMap 构造函数的源码：

```java
public HashMap(int initialCapacity, float loadFactor) {
    //初始容量不能<0
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: "
                                           + initialCapacity);
    //初始容量不能 > 最大容量值，HashMap的最大容量值为2^30
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    //负载因子不能 < 0
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: "
                                           + loadFactor);

    // 计算出大于 initialCapacity 的最小的 2 的 n 次方值。
    int capacity = 1;
    while (capacity < initialCapacity)
    capacity <<= 1;

    this.loadFactor = loadFactor;
    //设置HashMap的容量极限，当HashMap的容量达到该极限时就会进行扩容操作
    threshold = (int) (capacity * loadFactor);
    //初始化table数组
    table = new Entry[capacity];
    init();
}
```

从源码中可以看出，每次新建一个 HashMap 时，都会初始化一个 table 数组。table 数组的元素为 Entry 节点

```java
static class Entry<K,V> implements Map.Entry<K,V> {
        final K key;
        V value;
        Entry<K,V> next;
        final int hash;

        /**
         * Creates new entry.
         */
        Entry(int h, K k, V v, Entry<K,V> n) {
            value = v;
            next = n;
            key = k;
            hash = h;
        }
        .......
    }
```

其中 Entry 为 HashMap 的内部类，它包含了键 key、值 value、下一个节点 next，以及 hash 值，这是非常重要的，正是由于 Entry 才构成了 table 数组的项为链表。
<a name="QIQLq"></a>

## 扰动函数

在 HashMap 存放元素时候有这样一段代码来处理哈希值，这是 java 8 的散列值扰动函数，用于优化散列效果；

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

为什么使用扰动函数？<br />理论上来说字符串的 hashCode 是一个 int 类型值，那可以直接作为数组下标了， 且不会出现碰撞。但是这个 hashCode 的取值范围是[-2147483648, 2147483647]， 有将近 40 亿的长度，谁也不能把数组初始化的这么大，内存也是放不下的。<br />我们默认初始化的 Map 大小是 16 个长度 DEFAULT_INITIAL_CAPACITY = 1 << 4， 所以获取的 Hash 值并不能直接作为下标使用，需要与数组长度进行取模运算得到一个下标值，也就是我们上面做的散列列子。<br />那么，hashMap 源码这里不只是直接获取哈希值，还进行了一次扰动计算，(h = key.hashCode()) ^ (h >>> 16)。把哈希值右移 16 位，也就正好是自己长度的一 半，之后与原哈希值做异或运算，这样就混合了原哈希值中的高位和低位，增大了**随机性**。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686465972507-525d80d9-354b-4d73-ba5a-db32f6b99e43.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />其实使用扰动函数就是为了增加随机性，让数据元素更加均衡的散 列，减少碰撞。

<a name="FXT2F"></a>

## 负载因子

负载因子，可以理解成一辆车可承重重量超过某个阀值时，把货放到新的车上。 那么在 HashMap 中，负载因子决定了数据量多少了以后进行扩容。这里要提到上 面做的 HashMap 例子，我们准备了 7 个元素，但是最后还有 3 个位置空余，2 个 位置存放了 2 个元素。 所以可能即使你数据比数组容量大时也是不一定能正正 好好的把数组占满的，而是在某些小标位置出现了大量的碰撞，只能在同一个位置用链表存放，那么这样就失去了 Map 数组的性能。<br />所以，要选择一个合理的大小下进行扩容，默认值 0.75 就是说当阀值容量占了 3/4 时赶紧扩容，减少 Hash 碰撞。 同时 0.75 是一个默认构造值，在创建 HashMap 也可以调整，比如你希望用更多的空间换取时间，可以把负载因子调的更小一些，减少碰撞。
<a name="oWCWV"></a>

## 扩容机制

**HashMap 会在两个地方进行 resize(扩容):**

- HashMap 实行了**懒加载**, 新建 HashMap 时不会对 table 进行赋值, 而是到第一次插入时, 进行 resize 时构建 table;
- 当 HashMap.size 大于 threshold 时, 会进行 resize;threshold 的值，当第一次构建时, 如果没有指定 HashMap.table 的初始长度, 就用默认值 16, 否则就是指定的值; 然后不管是第一次构建还是后续扩容, threshold = table.length \* loadFactor;

在 Java8 的扩容中，不是简单的将原数组中的每一个元素取出进行重新[hash](https://so.csdn.net/so/search?q=hash&spm=1001.2101.3001.7020)映射，而是做移位检测。所谓移位检测的含义具体是针对 HashMap 做映射时的&运算所提出的，通过上文对&元算的分析可知，映射的本质即看 hash 值的某一位是 0 还是 1，当扩容以后，会相比于原数组多出一位做比较，由多出来的这一位是 0 还是 1 来决定是否进行移位，而具体的移位距离，也是可知的，及位原数组的大小，我们来看下表的分析，假定原表大小 16。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686466527321-205a1881-40a1-436b-9a86-f6735756653e.png)<br />由上表可知，是否移位，由扩容后表示的最高位是否 1 为所决定，并且移动的方向只有一个，即向高位移动。因此，可以根据对最高位进行检测的结果来决定是否移位，从而可以优化性能，**不用每一个元素都进行移位**，
<a name="ra6wj"></a>

## 扩容为什么 2 倍

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686466588195-953d01e1-3301-48ea-bd81-710683c6de8e.png)<br />**第一是因为哈希函数的问题**<br />通过**除留余数法**方式获取桶号，因为**Hash 表的大小始终为 2 的 n 次幂**，因此可以将**取模转为位运算操作**，提高效率，容量 n 为 2 的幂次方，n-1 的二进制会全为 1，位运算时可以充分散列，避免不必要的哈希冲突，这也就是为什么要按照 2 倍方式扩容的一个原因<br />**第二是因为是否移位的问题**<br />是否移位，**由扩容后表示的最高位是否 1 为所决定**，并且移动的方向只有一个，**即向高位移动**。因此，可以根据对最高位进行检测的结果来决定是否移位，从而可以优化性能，**不用每一个元素都进行移位**，**因为为 0 说明刚好在移位完之后的位置，为 1 说明不是需要移动 oldCop**，这也是其为什么要按照 2 倍方式扩容的第二个原因。
<a name="Sqypw"></a>

## get 方法

HashMap::get 返回一个数据节点, 如果不存在则返回空;

```java
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            if ((e = first.next) != null) {
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }

```

<a name="L6DbK"></a>

## put 方法

这里 HashMap 里面用到链式数据结构的一个概念。上面我们提到过 Entry 类里面 有一个 next 属性，作用是指向下一个 Entry。打个比方， 第一个键值对 A 进来，通过 计算其 key 的 hash 得到的 index=0，记做:Entry[0] = A。一会后又进来一个键值对 B，通过计算其 index 也等于 0，现在怎么办？HashMap 会这样做:B.next = A,Entry[0] = B, 如果又进来 C,index 也等于 0,那么 C.next = B,Entry[0] = C；这样我们发现 index=0 的 地方其实存取了 A,B,C 三个键值对,他们通过 next 这个属性链接在一起。所以疑问不用担心。也就是说数组中存储的是最后插入的元素。到这里为止，HashMap 的大致实现。

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        // tab指代是hashmap的散列表再，在下方初始化，hashmap不是在创建的时候初始化，而是在put的时候初始化，属于懒初始化
        // p表示当前散列表元素
        // n表示散列表数组长度
        // i表示路由寻址的结果
        Node<K,V>[] tab; Node<K,V> p; int n, i;
       //判断是否为空，为空的话初始化，不为空对tab和n进行赋值
        if ((tab = table) == null || (n = tab.length) == 0)
            //resize扩容
            n = (tab = resize()).length;
         //这个i就是（n-1）和hash做与运算得到的位置，p就是这个位置的Node元素
        if ((p = tab[i = (n - 1) & hash]) == null)
            //直接在当前下表newNode
            tab[i] = newNode(hash, key, value, null);
         //如果要插入的元素在这个位置有元素了，执行以下操作
        else {
            //e 临时的node元素
            //k 表示临时的一个key
            Node<K,V> e; K k;
            //如果这个桶的位置的元素的key和将要插入的key是一个，会进行替换
            // 比较 哈希值 ： 引用地址  ： key
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                //如果相等则老元素地址指向新元素
                e = p;
            //不相等则判断节点类型：
            //结点类型为树 TreeNode是Node的一个子类
            else if (p instanceof TreeNode)
                //红黑树的插入操作
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            //节点类型为链表
            else {
                ///for循环：1.遍历到链表尾部，进行尾插
                //2.判断链表长度，超过8将链表改为红黑树
                for (int binCount = 0; ; ++binCount) {
                    //判断节点的下一个节点为空，遍历到链表尾部，进行尾插
                    if ((e = p.next) == null) {
                        //生成一个Node对象，将Node对象作为新节点插入到链表(p.next)
                        p.next = newNode(hash, key, value, null);
                          //如果链表长度 >= TREEIFY_THRESHOLD-1 = 7 因为是从0开始遍历，所以此时链表长度为8
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            //树化函数
                            treeifyBin(tab, hash);
                        break;
                    }

                    //key相同时同样插入返回
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            //这种属于覆盖操作，当e中有值进入操作
            if (e != null) { // existing mapping for key
                //oldValue保存老的值，方便return
                V oldValue = e.value;
                //onlyIfAbsent传入的是false，指定能进入判断
                if (!onlyIfAbsent || oldValue == null)
                    //新元素的值将老元素的值覆盖掉
                    e.value = value;
                //HashMap提供给子类的方法
                afterNodeAccess(e);
                //put操作有返回值，返回的是插入之前已经存在的元素的value值
                return oldValue;
            }
        }

        //增加修改次数
        ++modCount;
    	//统计当前map中有多少元素，和阈值对比，判断是否需要扩容
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
```

具体流程如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686467256338-0903f238-fa52-4e32-80cb-8aa68625ae3d.png)
<a name="aiEYw"></a>

## java8 的优化

在从 JDK7 转化为 JDK8 时，HashMap 的实现也发生了很大的改变，先来看一下它们的区别：

- JDK7 中使用数组+链表，JDk8 中使用数组+链表+[红黑树](https://so.csdn.net/so/search?q=%E7%BA%A2%E9%BB%91%E6%A0%91&spm=1001.2101.3001.7020)实现
- 新节点在插入到链表时插入的顺序不同(JDK7 插入在头节点，JDK8 插入在尾节点)
- 在 java 1.8 中，Entry 被 Node 替代(换了一个马甲)。
  <a name="FZaQD"></a>

## 链表树化

HashMap 这种散列表的数据结构，最大的性能在于可以 O(1)时间复杂度定位到元 素，但因为哈希碰撞不得已在一个下标里存放多组数据，那么 jdk1.8 之前的设 计只是采用链表的方式进行存放，如果需要从链表中定位到数据时间复杂度就是 O(n)，链表越长性能越差。因为在 jdk1.8 中把过长的链表也就是 8 个，优化为自平衡的红黑树结构，以此让定位元素的时间复杂度优化近似于 O(logn)，这样 来提升元素查找的效率。但也不是完全抛弃链表，因为在元素相对不多的情况下， 链表的插入速度更快，所以综合考虑下设定阈值为 8 才进行红黑树转换操作<br />链表转红黑树如图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686467829937-fb66f9e6-8195-45f1-aef7-2d54e8763763.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

<a name="SW5Sf"></a>

## 环型链表

在 JDK7 版本下，很多人都知道 HashMap 会有链表成环的问题，但大多数人只知道，是多线程引起的，至于具体细节的原因，和 JDK8 中如何解决这个问题，很少有人说的清楚，百度也几乎看不懂，本文就和大家聊清楚两个问题：<br />1：JDK7 中 HashMap 成环原因<br />2：JDK8 中是如何解决的。<br />总得来说，就是拷贝旧的数据元素，从新新建一个更大容量的空间，然后进行数据复制，具体代码如下

```java
void transfer(Entry[] newTable, boolean rehash) {
            int newCapacity = newTable.length;
            for (Entry<K,V> e : table) {
                while(null != e) {
                    Entry<K,V> next = e.next;
                    if (rehash) {
                        e.hash = null == e.key ? 0 : hash(e.key);
                    }
                    int i = indexFor(e.hash, newCapacity);
                    //
                    e.next = newTable[i];
                    newTable[i] = e;
                    e = next;
                }
            }
        }
```

假设原来在数组 1 的下标位置有个链表，链表元素是 a-b-null，现在有两个线程同时执行这个方法，我们先来根据线程 1 的执行情况来分别分析下这三行代码：<br />e.next = newTable[i];<br />newTable 表示新的数组，newTable[i] 表示新数组下标为 i 的值，第一次循环的时候为 null，e 表示原来链表位置的头一个元素，是 a，e.next 是 b，<br />e.next = newTable[i] 的意思就是拿出 a 来，并且使 a 的后一个节点是 null，如下图 1 的位置：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686468286029-63a1f40f-7ca5-4f49-9437-e53a20692d0d.png#averageHue=%23f6f6f6&clientId=u33b22f71-53b8-4&from=paste&height=567&id=uf98e495d&originHeight=454&originWidth=1276&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=62405&status=done&style=none&taskId=u83156969-c838-4832-825a-2bd2afb84dc&title=&width=1594.9999762326484)<br />newTable[i] = e;<br />就是把 a 赋值给新数组下标为 1 的地方，如下图 2 的位置：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686468300358-9221b083-77b4-46af-b50b-257b22589381.png#averageHue=%23f9f8f8&clientId=u33b22f71-53b8-4&from=paste&height=706&id=uc1424a17&originHeight=565&originWidth=671&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=51954&status=done&style=none&taskId=u2d8191f7-9f6d-4c6c-a47d-a670dfa8da5&title=&width=838.7499875016513)<br />e = next;<br />next 的值在 while 循环一开始就有了，为：Entrynext = e.next; 在此处 next 的值就是 b，把 b 赋值给 e，接着下一轮循环。<br />从 b 开始下一轮循环，重复 1、2、3，注意此时 e 是 b 了，而 newTable[i] 的值已经不是空了，已经是 a 了，所以 1，2，3 行代码执行下来，b 就会插入到 a 的前面，如下图 3 的位置：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686468314113-aff6cc99-4bb8-4423-8b3c-b810519eee65.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />这个就是线程 1 的插入节奏。<br />重点来了，假设线程 1 执行到现在的时候，线程 2 也开始执行，线程 2 是从 a 开始执行 1、2、3、4 步，此时数组上面链表已经形成了 b-a-null，线程 2 拿出 a 再次执行 1、2、3、4，就会把 a 放到 b 的前面，大家可以想象一下，结果是如下图的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686468331303-9906ac77-0a07-4499-93ef-1e67420bd9d3.png#averageHue=%23f7f7f7&clientId=u33b22f71-53b8-4&from=paste&height=580&id=ub51fee13&originHeight=464&originWidth=1138&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=68812&status=done&style=none&taskId=u1555c62e-3068-4259-86f5-c23bbc4140c&title=&width=1422.4999788030984)<br />从图中可以看出，有两个相同的 a 和两个相同的 b，这就是大家说的成环，自己经过不断 next 最终指向自己。<br />注意!!!这种解释看似好像很有道理，但实际上是不正确的，网上很多这种解释，这种解释最致命的地方在于 newTable 不是共享的，线程 2 是无法在线程 1 newTable 的基础上再进行迁移数据的，1、2、3 都没有问题，但 4 有问题，最后的结论也是有问题的<br />因为 newTable 是在扩容方法中新建的局部变量，方法的局部变量线程之间肯定是无法共享的，所以以上解释是有问题的，是错误的。<br />那么真正的问题出现在那里呢，其实线程 1 完成 1、2、3、4 步后就出现问题了，如下图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686468344626-0195d0e2-2c0e-47da-8105-2c28e0b97550.png#averageHue=%23f9f7f7&clientId=u33b22f71-53b8-4&from=paste&height=534&id=ua2765909&originHeight=427&originWidth=896&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=65628&status=done&style=none&taskId=ud8f39187-bcb5-480e-9889-c810fb4a82d&title=&width=1119.9999833106997)<br />**总结一下产生这个问题的原因：**<br />插入的时候和平时我们追加到尾部的思路是不一致的，是链表的头结点开始循环插入，导致插入的顺序和原来链表的顺序相反的。<br />table 是共享的，table 里面的元素也是共享的，while 循环都直接修改 table 里面的元素的 next 指向，导致指向混乱。<br />接下来我们来看下 JDK8 是怎么解决这个问题。
<a name="xASyz"></a>

### JDK8 中解决方案

JDK 8 中扩容时，已经没有 JDK7 中的 transfer 方法了，而是自己重新写了扩容方法，叫做 resize，链表从老数组拷贝到新数组时的代码如下：<br />//规避了 8 版本以下的成环问题

```java
else { // preserve order

// loHead 表示老值,老值的意思是扩容后，该链表中计算出索引位置不变的元素

// hiHead 表示新值，新值的意思是扩容后，计算出索引位置发生变化的元素

// 举个例子，数组大小是 8 ，在数组索引位置是 1 的地方挂着一个链表，链表有两个值，两个值的 hashcode 分别是是9和33。

// 当数组发生扩容时，新数组的大小是 16，此时 hashcode 是 33 的值计算出来的数组索引位置仍然是 1，我们称为老值

// hashcode 是 9 的值计算出来的数组索引位置是 9，就发生了变化，我们称为新值。

	NodeloHead = null, loTail = null;

	NodehiHead = null, hiTail = null;

	Nodenext;

// java 7 是在 while 循环里面，单个计算好数组索引位置后，单个的插入数组中，在多线程情况下，会有成环问题

// java 8 是等链表整个 while 循环结束后，才给数组赋值，所以多线程情况下，也不会成环

	do {

		next = e.next;

	// (e.hash oldCap) == 0 表示老值链表

		if ((e.hash oldCap) == 0) {

			if (loTail == null)

				loHead = e;

			else

				loTail.next = e;

				loTail = e;

		}

	// (e.hash oldCap) == 0 表示新值链表

		else {

			if (hiTail == null)

				hiHead = e;

			else

				hiTail.next = e;

				hiTail = e;

		}

	} while ((e = next) != null);

// 老值链表赋值给原来的数组索引位置

	if (loTail != null) {

		loTail.next = null;

		newTab[j] = loHead;

	}

// 新值链表赋值到新的数组索引位置

	if (hiTail != null) {

		hiTail.next = null;

		newTab[j + oldCap] = hiHead;

	}

}

```

解决办法其实代码中的注释已经说的很清楚了，我们总结一下：<br />JDK8 是等链表整个 while 循环结束后，才给数组赋值，此时使用局部变量 loHead 和 hiHead 来保存链表的值，因为是局部变量，所以多线程的情况下，肯定是没有问题的。<br />为什么有 loHead 和 hiHead 两个新老值来保存链表呢，主要是因为扩容后，链表中的元素的索引位置是可能发生变化的，代码注释中举了一个例子：<br />数组大小是 8 ，在数组索引位置是 1 的地方挂着一个链表，链表有两个值，两个值的 hashcode 分别是是 9 和 33。当数组发生扩容时，新数组的大小是 16，此时 hashcode 是 33 的值计算出来的数组索引位置仍然是 1，我们称为老值(loHead)，而 hashcode 是 9 的值计算出来的数组索引位置却是 9，不是 1 了，索引位置就发生了变化，我们称为新值(hiHead)。
