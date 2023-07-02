---
title: Java基础
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

## 八种基本数据类型

- 布尔型: boolean
- 字符型: char
- 整数型: byte, short, int, long
- 浮点数型: float, double

这 8 种基本数据类型的默认值以及所占空间的大小如下：<br />![image.png](/assets/image/image.png)<br />另外，对于 boolean，官方文档未明确定义，它依赖于 JVM 厂商的具体实现。逻辑上理解是占用 1 位，但是实际中会考虑计算机高效存储因素。<br />**注意：**<br />1Java 里使用 long 类型的数据一定要在数值后面加上 **L**，否则将作为整型解析：2char a = 'h'char :单引号，String a = "hello" :双引号
<a name="XsnaL"></a>

## 拆箱装箱

自动装箱是 Java 编译器在基本数据类型和对应的对象包装类型之间做的一个转化。比 <br />如：把 int 转化成 Integer，double 转化成 Double，等等。反之就是自动拆箱。 <br />原始类型: boolean，char，byte，short，int，long，float，double <br />封装类型：Boolean，Character，Byte，Short，Integer，Long，Float，Double
<a name="yWu61"></a>

## 自动装箱和拆箱的实现原理

<a name="cEIRI"></a>

### 自动装箱与拆箱

```java
//自动装箱
Integer i = 5;
//自动拆箱
int i = i;
```

通过 javap 反编译看一下 class：

```java
//装箱
Integer i = Integer.valueOf(5);
//拆箱
int i = intValue(5);

```

当你使用基本类型数据在做运算或者将其放入泛型仓库的时候，jvm 识别到需要转型，就会触发装箱，装箱其实不是自动调用 valueOf 函数，在编译器编译的时候，如果发现了这样的程序，jvm 就会在 class 指令中加入装箱程序，改变编译的结果。自动拆箱也是如此。
<a name="qfVCV"></a>

## 包装类型的常量池技术

Byte,Short,Integer,Long 这 4 种包装类默认创建了数值 **[-128，127]** 的相应类型的缓存数据，Character 创建了数值在[0,127]范围的缓存数据，Boolean 直接返回 True Or False。
<a name="JSVlq"></a>

### 包装类作用

包装类的作用是为了方便对基本数据类型进行操作。以 Integer 为例，部分源码如下：

```java
public final class Integer extends Number implements Comparable<Integer>, Constable, ConstantDesc {
	//int类型的最小值为, -2^31
	@Native public static final int   MIN_VALUE = 0x80000000;
	//int类型的最大值为, 2^31-1
	@Native public static final int   MAX_VALUE = 0x7fffffff;

	//int的toString方法
	public static String toString(int i, int radix) {
	...
	}
	//int转16进制方法
	public static String toHexString(int i) {
        return toUnsignedString0(i, 4);
    }
	//int转8进制方法
	public static String toOctalString(int i) {
        return toUnsignedString0(i, 3);
    }
    //int转2进制方法
    public static String toBinaryString(int i) {
        return toUnsignedString0(i, 1);
    }
    ...
}
```

所以，在这个数值区间内的 Integer 对象的栈指向(属性名) 可以直接使用==进行判断，因为值相同，指向的就是同一片区域。但是这个区间之外的所有数据，自动装箱都会在堆上产生实例化，并不再复用已有对象，尤其要注意，为了避免这个问题，推荐使用 equals 方法进行 Integer 值的比较判断。当然判断值和地址是否都相同，还是得用 ==。<br />除了两个包装类 Long 和 Double 没有实现这个缓存技术，其它的包装类均实现了它。这是因为 Long 和 Double 类型的对象占用内存较大，不宜应用于常量池中，长时间占用内存。<br />包装类都实现了 equals 方法，如 Integer 中：

```java
public boolean equals(Object obj) {
    if (obj instanceof Integer) {
        return value == ((Integer)obj).intValue();
    }
    return false;
}

```

<a name="dtOIr"></a>

### 包装类应用

- 所有的相同类型的包装类对象之间值的比较，全部使用 equals()方法。
- 所有的 POJO(简单 Java 类，只包含基本属性，有参构造，get/set)类属性推荐使用包装类数据类型，类属性即 static 属性。
- RPC(远程方法调用)方法返回值和参数必须使用包装数据类型。
- 推荐所有的局部变量使用基本数据类型。
  <a name="bBJ82"></a>

### 包装类转换要点

字符串转数值类型时字符串只能包含数字，否则会抛出 NumberFormatException 异常，这是一个非受查异常。<br />但是字符串转 Boolean 是个特例，parseBoolean()方法会将”true”转为 true，而将非”true”的字符串转为 false。
<a name="O8zG1"></a>

## String

问：String 转出 int 型，判断能不能转？如何转？<br />答：可以转，得处理异常 Integer.parseInt(s) 主要为 NumberFormatException：1）当 <br />你输入为字母时，也就是内容不是数字时，如 abcd 2）当你输入为空时 3）当你输入超出 <br />int 上限时 Long.parseLong("123")转换为 long<br />问：short s1 = 1; s1 = s1 + 1;有什么错? short s1 = 1; s1 += 1;有什么错?

- 对于 short s1=1;s1=s1+1 来说，在 s1+1 运算时会自动提升表达式的类型为 int， 那么将 int 赋予给 short 类型的变量 s1 会出现类型转换错误。
- 对于 short s1=1;s1+=1 来说 +=是 java 语言规定的运算符，java 编译器会对它 进行特殊处理，因此可以正确编译。
  <a name="jqqWk"></a>

## Int 与 Integer 区别

1、Integer 是 int 的包装类，int 则是 java 的一种基本数据类型 <br />2、Integer 变量必须实例化后才能使用，而 int 变量不需要 <br />3、Integer 实际是对象的引用，当 new 一个 Integer 时，实际上是生成一个指针指向此对象；而 int 则是直接存储数据值 <br />4、Integer 的默认值是 null，int 的默认值是 0<br />延伸： <br />关于 Integer 和 int 的比较 <br />1、由于 Integer 变量实际上是对一个 Integer 对象的引用，所以两个通过 new 生成的 Integer 变量永远是不相等的（因为 new 生成的是两个对象，其内存地址不同）。

```java
Integer i = new Integer(100);
Integer j = new Integer(100);
System.out.print(i == j); //false
```

2、Integer 变量和 int 变量比较时，只要两个变量的值是向等的，则结果为 true（因为包装类 Integer 和基本数据类型 int 比较时，java 会自动拆包装为 int，然后进行比较，实际上就变为两个 int 变量的比较）

```java
Integer i = new Integer(100);
int j = 100；
System.out.print(i == j); //true

```

3、非 new 生成的 Integer 变量和 new Integer()生成的变量比较时，结果为 false。（因为 ① 当变量值在-128~127 之间时，非 new 生成的 Integer 变量指向的是 java 常量池中的对象，而 new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同；② 当变量值不在-128~127 之间时，非 new 生成 Integer 变量时，java API 中最终会按照 new Integer(i)进行处理（参考下面第 4 条），最终两个 Interger 的地址同样是不相同的）

```java
Integer i = new Integer(100);
Integer j = 100;
System.out.print(i == j); //false

```

4、对于两个非 new 生成的 Integer 对象，进行比较时，如果两个变量的值在区间-128 到 127 之间，则比较结果为 true，如果两个变量的值不在此区间，则比较结果为 false

```java
Integer i = 100;
Integer j = 100;
System.out.print(i == j); //true

```

```java
Integer i = 128;
Integer j = 128;
System.out.print(i == j); //false

```

对于第 4 条的原因： <br />java 在编译 Integer i = 100 ;时，会翻译成为 Integer i = Integer.valueOf(100)；，而 java API 中对 Integer 类型的 valueOf 的定义如下

```java
public static Integer valueOf(int i){
    assert IntegerCache.high >= 127;
    if (i >= IntegerCache.low && i <= IntegerCache.high){
        return IntegerCache.cache[i + (-IntegerCache.low)];
    }
    return new Integer(i);
}

```

java 对于-128 到 127 之间的数，会进行缓存，Integer i = 127 时，会将 127 进行缓存，下次再写 Integer j = 127 时，就会直接从缓存中取，就不会 new 了
<a name="pFCZV"></a>

## 字符字节区别

字节是存储容量的基本单位，字符是数子，字母，汉子以及其他语言的各种符号。 1 字节=8 个二进制单位：一个一个字符由一个字节或多个字节的二进制单位组成
<a name="EGhNg"></a>

## 基本类型引用类型区别

基本类型保存原始值，引用类型保存的是引用值（引用值就是指对象在堆中所 处的位置/地址）
<a name="yFlTI"></a>

## 重写和重载区别

Java 中的方法重载发生在同一个类里面两个或者是多个方法的方法名相同但是参数不同的情况。与此相对，方法覆盖是说子类重新定义了父类的方法。方法覆盖必须有相同的方法名，参数列表和返回类型。覆盖者可能不会限制它所覆盖的方法的访问。<br />重写（override)又名覆盖:

- 1.不能存在同一个类中，在继承或实现关系的类中；
- 2. 名相同，参数列表相同，方法返回值相同，
- 3.子类方法的访问修饰符要大于父类的。
- 4.子类的检查异常类型要小于父类的检查异常。

重载（overload）

- 1.可以在一个类中也可以在继承关系的类中；
- 2.名相同；
- 3.参数列表不同（个数，顺序，类型） 和方法的返回值类型无关。
  <a name="F8d8f"></a>

## static 为什么不能覆盖

Java 中 static 方法不能被覆盖，因为方法覆盖是基于运行时动态绑定的，而 static 方法 是编译时静态绑定的。static 方法跟类的任何实例都不相关，所以概念上不适用。 <br />java 中也不可以覆盖 private 的方法，因为 private 修饰的变量和方法只能在当前类中使用， 如果是其他的类继承当前类是不能访问到 private 变量或方法的，当然也不能覆盖。
<a name="o8Ne8"></a>

## Stack Queue

<a name="flRcY"></a>

### PriorityQueue

PriorityQueue 是一个基于优先级堆的无界队列，它的元素是按照自 然顺序(natural order)排序的。在创建的时候，我们可以给它提供一个负责给元素 排序的比较器。PriorityQueue 不允许 null 值，因为他们没有自然顺序，或者说他们没有任何的相关联的比较器。最后，PriorityQueue 不是线程安全的，入队和出 <br />队的时间复杂度是 O(log(n))。<br />堆树的定义如下：

- 堆树是一颗完全二叉树；
- 堆树中某个节点的值总是不大于或不小于其孩子节点的值；
- 堆树中每个节点的子树都是堆树。

详细可以看下面这篇文章<br />[深入理解 Java PriorityQueue - CarpenterLee - 博客园](https://www.cnblogs.com/CarpenterLee/p/5488070.html)
<a name="NZEcC"></a>

## 面向对象

<a name="fCZts"></a>

### 面向对象六大原则详解

- 单一职责原则——SRP
- 开闭原则——OCP
- 里式替换原则——LSP
- 依赖倒置原则——DIP
- 接口隔离原则——ISP
- 迪米特原则——LOD
  <a name="EKVRi"></a>

#### 单一职责原则

单一职责原则的定义是就一个类而言，应该仅有一个引起他变化的原因。也就是说一个类应该只负责一件事情。如果一个类负责了方法 M1,方法 M2 两个不同的事情，当 M1 方法发生变化的时候，我们需要修改这个类的 M1 方法，但是这个时候就有可能导致 M2 方法不能工作。这个不是我们期待的，但是由于这种设计却很有可能发生。所以这个时候，我们需要把 M1 方法，M2 方法单独分离成两个类。让每个类只专心处理自己的方法。<br />单一职责原则的好处如下：

- 可以降低类的复杂度，一个类只负责一项职责，这样逻辑也简单很多
- 提高类的可读性，和系统的维护性，因为不会有其他奇怪的方法来干扰我们理解这个类的含义
- 当发生变化的时候，能将变化的影响降到最小，因为只会在这个类中做出修改。
  <a name="celbD"></a>

#### 开闭原则

开闭原则和单一职责原则一样，是非常基础而且一般是常识的原则。开闭原则的定义是软件中的对象(类，模块，函数等)应该对于扩展是开放的，但是对于修改是关闭的。<br />当需求发生改变的时候，我们需要对代码进行修改，这个时候我们应该尽量去扩展原来的代码，而不是去修改原来的代码，因为这样可能会引起更多的问题。<br />这个准则和单一职责原则一样，是一个大家都这样去认为但是又没规定具体该如何去做的一种原则。<br />开闭原则我们可以用一种方式来确保他，我们用抽象去构建框架，用实现扩展细节。这样当发生修改的时候，我们就直接用抽象了派生一个具体类去实现修改。
<a name="SwWZE"></a>

#### 里氏替换原则

里氏替换原则是一个非常有用的一个概念。他的定义

> 如果对每一个类型为 T1 的对象 o1,都有类型为 T2 的对象 o2,使得以 T1 定义的所有程序 P 在所有对象 o1 都替换成 o2 的时候，程序 P 的行为都没有发生变化，那么类型 T2 是类型 T1 的子类型。

这样说有点复杂，其实有一个简单的定义

> 所有引用基类的地方必须能够透明地使用其子类的对象。

里氏替换原则通俗的去讲就是：子类可以去扩展父类的功能，但是不能改变父类原有的功能。他包含以下几层意思：

- 子类可以实现父类的抽象方法，但是不能覆盖父类的非抽象方法。
- 子类可以增加自己独有的方法。
- 当子类的方法重载父类的方法时候，方法的形参要比父类的方法的输入参数更加宽松。
- 当子类的方法实现父类的抽象方法时，方法的返回值要比父类更严格。

里氏替换原则之所以这样要求是因为继承有很多缺点，他虽然是复用代码的一种方法，但同时继承在一定程度上违反了封装。父类的属性和方法对子类都是透明的，子类可以随意修改父类的成员。这也导致了，如果需求变更，子类对父类的方法进行一些复写的时候，其他的子类无法正常工作。所以里氏替换法则被提出来。<br />确保程序遵循里氏替换原则可以要求我们的程序建立抽象，通过抽象去建立规范，然后用实现去扩展细节，这个是不是很耳熟，对，里氏替换原则和开闭原则往往是相互依存的。
<a name="UwK9E"></a>

#### 依赖倒置原则

依赖倒置原则指的是一种特殊的解耦方式，使得高层次的模块不应该依赖于低层次的模块的实现细节的目的，依赖模块被颠倒了。<br />这也是一个让人难懂的定义，他可以简单来说就是

> 高层模块不应该依赖底层模块，两者都应该依赖其抽象，抽象不应该依赖细节，细节应该依赖抽象

在 Java 中抽象指的是接口或者抽象类，两者皆不能实例化。而细节就是实现类，也就是实现了接口或者继承了抽象类的类。他是可以被实例化的。高层模块指的是调用端，底层模块是具体的实现类。在 Java 中，依赖倒置原则是指模块间的依赖是通过抽象来发生的，实现类之间不发生直接的依赖关系，其依赖关系是通过接口是来实现的。这就是俗称的面向接口编程。<br />我们下面有一个例子来讲述这个问题。这个例子是工人用锤子来修理东西。我们的代码如下：

```java
public class Hammer {
    public String function(){
        return "用锤子修理东西";
    }
}

public class Worker {
    public void fix(Hammer hammer){
        System.out.println("工人" + hammer.function());
    }


    public static void main(String[] args) {
        new Worker().fix(new Hammer());
    }
}

```

这个是一个很简单的例子，但是如果我们要新增加一个功能，工人用 螺丝刀来修理东西，在这个类，我们发现是很难做的。因为我们 Worker 类依赖于一个具体的实现类 Hammer。所以我们用到面向接口编程的思想，改成如下的代码：

```java
public interface Tools {
    public String function();
}
```

然后我们的 Worker 是通过这个接口来于其他细节类进行依赖。代码如下：

```java
public class Worker {
    public void fix(Tools tool){
        System.out.println("工人" + tool.function());
    }


    public static void main(String[] args) {
        new Worker().fix(new Hammer());
        new Worker().fix(new Screwdriver());

    }
}

```

我们的 Hammer 类与 Screwdriver 类实现这个接口

```java
public class Hammer implements Tools{
    public String function(){
        return "用锤子修理东西";
    }
}

public class Screwdriver implements Tools{
    @Override
    public String function() {
        return "用螺丝刀修理东西";
    }
}

```

这样，通过面向接口编程，我们的代码就有了很高的扩展性，降低了代码之间的耦合度，提高了系统的稳定性。
<a name="Steth"></a>

#### 接口隔离原则

接口隔离原则的定义是

> 客户端不应该依赖他不需要的接口

换一种说法就是类间的依赖关系应该建立在最小的接口上。这样说好像更难懂。我们通过一个例子来说明。我们知道在 Java 中一个具体类实现了一个接口，那必然就要实现接口中的所有方法。如果我们有一个类 A 和类 B 通过接口 I 来依赖，类 B 是对类 A 依赖的实现，这个接口 I 有 5 个方法。但是类 A 与类 B 只通过方法 1,2,3 依赖，然后类 C 与类 D 通过接口 I 来依赖，类 D 是对类 C 依赖的实现但是他们却是通过方法 1,4,5 依赖。那么是必在实现接口的时候，类 B 就要有实现他不需要的方法 4 和方法 5 而类 D 就要实现他不需要的方法 2，和方法 3。这简直就是一个灾难的设计。<br />所以我们需要对接口进行拆分，就是把接口分成满足依赖关系的最小接口，类 B 与类 D 不需要去实现与他们无关接口方法。比如在这个例子中，我们可以把接口拆成 3 个，第一个是仅仅由方法 1 的接口，第二个接口是包含 2,3 方法的，第三个接口是包含 4,5 方法的。这样，我们的设计就满足了接口隔离原则。<br />以上这些设计思想用英文的第一个字母可以组成 SOLID ，满足这个 5 个原则的程序也被称为满足了 SOLID 准则。
<a name="C3pzt"></a>

#### 迪米特原则

迪米特原则也被称为最小知识原则，他的定义

> 一个对象应该对其他对象保持最小的了解。

因为类与类之间的关系越密切，耦合度越大，当一个类发生改变时，对另一个类的影响也越大，所以这也是我们提倡的软件编程的总的原则：低耦合，高内聚。<br />迪米特法则还有一个更简单的定义

> 只与直接的朋友通信。首先来解释一下什么是直接的朋友：每个对象都会与其他对象有耦合关系，只要两个对象之间有耦合关系，我们就说这两个对象之间是朋友关系。耦合的方式很多，依赖、关联、组合、聚合等。其中，我们称出现成员变量、方法参数、方法返回值中的类为直接的朋友，而出现在局部变量中的类则不是直接的朋友。也就是说，陌生的类最好不要作为局部变量的形式出现在类的内部。

这里我们可以用一个现实生活中的例子来讲解一下。比如我们需要一张 CD,我们可能去音像店去问老板有没有我们需要的那张 CD，老板说现在没有，等有的时候你们来拿就行了。在这里我们不需要关心老板是从哪里，怎么获得的那张 CD，我们只和老板（直接朋友）沟通，至于老板从他的朋友那里通过何种条件得到的 CD，我们不关心，我们不和老板的朋友（陌生人）进行通信，这个就是迪米特的一个应用。说白了，就是一种中介的方式。我们通过老板这个中介来和真正提供 CD 的人发生联系。
<a name="tra5l"></a>

### 创建对象的四种方法

Java 程序中对象的创建有四种方式：

- 调用 new 语句创建对象，最常见的一种
- 运用反射手段创建对象,调用 java.lang.Class 或者 java.lang.reflect.Constructor 类的 newInstance()实例方法
- 调用对象的 clone()方法
- 运用序列化手段,调用 java.io.ObjectInputStream 对象的 readObject()方法.
  <a name="vYaKS"></a>

#### 一、new 语句创建

```java
// 使用java语言的关键字 new 创建对象，初始化对象数据　
    MyObject mo = new MyObject() ;
```

<a name="nr3Ga"></a>

#### 二、clone 方法创建对象

```php
构造函数不被自动调用。
　　　public class CreateInstance implements Cloneable{
　　　　public CreateInstance getInstance() throws CloneNotSupportedException{
　　　　　return (CreateInstance) this.clone();
            }
         }
　　如果需要复制上面的那个obj指向的对象实例时，调用new CreateInstance().getInstance()方法就ok了。
      但是为什么不直接使用new CreateInstance().clone()呢？
        JDK中Object# clone()方法的原型是：protected native Object clone() throws　 CloneNotSupportedException; 方法修饰符是protected，而不是public。
      这种访问的不可见性使得我们对Object#clone()方法不可见。所以，必需重写Object的clone方法后才能使用。
      Java代码：
　　　public class CreateInstance implements Cloneable{
　　　　public CreateInstance clone throws CloneNotSupportedException{
　　　　　return (CreateInstance) super.clone();
            }
         }
    值得注意的是 ：如果需要使用clone方法，必需实现java.lang.Cloneable接口，否则会抛出java.lang.CloneNotSupportedException。
      另外clone方法所做的的操作是直接复制字段的内容，换句话说，这个操作并不管该字段对应的对象实例内容。
      像这样字段对字段的拷贝（field to field copy）就成为"浅拷贝"，clone方法所做的正是"浅拷贝"。
```

<a name="xX0BJ"></a>

#### 三、反射方法 newInstance 创建对象

```vbnet
利用java.lang.Class类的newInstance方法，则可根据Class对象的实例，建立该Class所表示的类的对象实例。
      创建CreateInstace类的对象实例可以使用下面的语句（这样需要一个已经存在的对象实例）。
      CreateInstance instance = CreateInstance.class.newInstance();
      或者使用下面的语句（只需要存在相应的.class文件即可）
      CreateInstance instance = (CreateInstance)Class.forname("com.create.instance.CreateInstance").newInstance();
      如果包下不存在相应.class文件，则会抛出ClassNotFoundException。
      注意 ：newInstance创建对象实例的时候会调用无参的构造函数，所以必需确保类中有无参数的构造函数，否则将会抛出java.lang.InstantiationException异常。
      无法进行实例化。
```

<a name="kkvsG"></a>

#### 四、 序列化 readObject()方法创建对象

如果对象是通过 ObjectInputStream 类的 readObject()方法创建的，那么 Java 虚拟机通过从输入流中读入的序列化数据来初始化那些非暂时性（non-transient）的实例变量。<br />在其他情况下，如果实例变量在声明时被显式初始化，那么就把初始化值赋给实例变量，接着再执行构造方法。这是最常见的初始化对象的方式。
<a name="ghMCX"></a>

## String StringBuffer StringBuilder hashcode equal

<a name="CFkwg"></a>

### String StringBuffer StringBuilder 的区别

- String StringBuffer StringBuilder
  - 都是 final 类， 都不允许被继承
  - String 长度是不可变的， StringBuffer、StringBuilder 长度是可变的
  - StringBuffer 是线程安全的， StringBuilder 不是线程安全的， 但是它们两个中的所有方法都是相同， StringBuffer 在 StringBuilder 的方法上添加了 synchronized 修饰， 保证线程安全
  - StringBuilder 比 StringBuffer 拥有更好的性能
  - 如果一个 String 类型的字符串，在编译时就可以确定是一个字符串常量，则编译完成之后，字符串会自动拼接成一个常量，此时 String 的速度比 StringBuffer 和 StringBuilder 的性能好的多。
    <a name="fRK06"></a>

### String 不可变？

1、 String 不可变？ final？

- final
  - 首先因为 String 不可变，如果 String 不是 final，那么就可以有子类继承 String 类，然后子类覆盖其方法，使得这些方法修改字符串，这样就违背了 String 的不可变性。
- 不可变原因
  - 提高效率： 比如一个字符串 String s1 = “abc” ， “abc” 被放到常量池里面去了，再定义一个变量 s2 = “abc” 并不会复制字符串“abc”， 只会多个引用指向原来那个常量，这样就提高了效率，而这一前提就是 string 不可变， 如果可变，那么多个引用改变字符串，然后其他引用指向同一个字符串常量，我就可以通过一个引用改变字符串，然后其他的引用就被影响了。
  - 安全： string 常被用来表示 url， 文件路径
  - string 不可变， 那么他的 hashcode 就一样，不用每次都重新计算了
- String 不变性的理解
  - String 类是被 final 进行修饰的， 不能被继承
  - 在用 + 号连接字符串的时候会创建新的字符串
  - String s = new String（“Hello world”）； 可能创建两个对象，也可能创建一个对象，如果静态区中有 “Hello world” 字符串常量对象的话，则仅仅在堆中创建一个对象，如果静态区中没有“Hello world” 对象，则堆上和静态区中都需要创建对象
  - 在 Java 中， 通过使用 + 符号来串联字符串的时候，实际上底层会转换成通过 StringBuilder 实例的 append（）方法实现。
    <a name="gy6oF"></a>

### String 中的 hashcode 以及 toString

- String 重写了 Object 类的 hashcode 和 toString 方法
- 当 equals 方法被重写时，通常有必要重写 hashCode 方法，以维护 HashCode 方法的常规协定。
- 重写 equals 不重写 hashcode 会出现什么问题
  - 在存储散列集合时（Set）， Map 中存了两个数值一样的 key，这个问题很严重。所以在重写 equals 方法的时候，一定要重写 hashCode 方法。

在 Java 中， 通过使用 “+” 符号来串联字符串的时候， 实际上底层会转成 StringBuilder 实例的 append() 方法来实现
