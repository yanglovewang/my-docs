---
title: Java反射
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

## 什么是反射

- Java反射机制的核心是在程序运行时动态加载类并获取类的详细信息，从而操作类或对象的属性和方法。本质是JVM得到class对象之后，再通过class对象进行反编译，从而获取对象的各种信息。

- Java属于先编译再运行的语言，程序中对象的类型在编译期就确定下来了，而当程序在运行时可能需要动态加载某些类，这些类因为之前用不到，所以没有被加载到JVM。通过反射，可以在运行时动态地创建对象并调用其属性，不需要提前在编译期知道运行的对象是谁。
<a name="qDOeL"></a>
## 反射的主要优点
在运行时获得类的各种内容，进行[反编译](https://so.csdn.net/so/search?q=%E5%8F%8D%E7%BC%96%E8%AF%91&spm=1001.2101.3001.7020)，对于Java这种先编译再运行的语言，能够让我们很方便的创建灵活的代码，这些代码可以在运行时装配，无需在组件之间进行源代码的链接，更加容易实现面向对象。

<a name="OjwWb"></a>
### 反射有哪些应用
各个开发框架利用反射的灵活性都实现了便于业务开发的落地方案<br />例如 Mybatis 中
```swift
<select id="getUserList2" resultType="User">
        select * from user
        <where>
            <if test="query != null and query !=''"> username like "%"#{query}"%"</if>
        </where>
        limlt ${(pageNum - 1) * pageSize},#{pageSize}
    </select>

```
上面的 resultType="cn.mry.mybatis.pojo.User" 映射的结果封装到这个对象中, 利用反射方式获取 User 对象<br />${pageSize} 同样也是利用反射原理获取类中的属性,底层是将参数封装了Map集合中。

又比如很多框架（Spring）都是配置化的（比如通过XML文件配置Bean），为了保证框架的通用性，他们可能需要根据配置文件加载不同的类或者对象，调用不同的方法，这个时候就必须使用到反射了，运行时动态加载需要的加载的对象

还有像 JDBC 数据驱动，也是通过用到反射
```swift
Class.forName("com.mysql.jdbc.Driver"); // 动态加载mysql驱动

```
<a name="nCGN5"></a>
## 反射细谈

<a name="GGbyZ"></a>
### JVM 是如何通过反射构建一个实例
假设有以下代码，我们来分析一下它的整个创建对象的过程：<br />[Jvm](https://so.csdn.net/so/search?q=Jvm&spm=1001.2101.3001.7020)在执行时，遇到一个新的类时，会到内存中的方法区去找class的信息，如果找到就直接拿来用，如果没有找到，就会去将类文件加载到方法区。在类加载时，会经过验证准备解析等阶段，然后静态成员变量加载到方法区的静态区域，非静态成员变量加载到方法区的非静态区域，这一部分不在展开，具体可以看我之前的两篇文章：<br />虚拟机类加载机制（上）：<br />[https://zhuanlan.zhihu.com/p/505492592](https://zhuanlan.zhihu.com/p/505492592)<br />虚拟机类加载机制（下）：<br />[https://zhuanlan.zhihu.com/p/504684922](https://zhuanlan.zhihu.com/p/504684922)

所以大致流程可以理解成如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1684660989270-f5a83958-1337-47e1-a04e-f38ababbd497.png#averageHue=%23f9f9f9&clientId=ufedc2ed1-1a61-4&from=paste&height=266&id=u714e7f5b&originHeight=213&originWidth=395&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=34817&status=done&style=none&taskId=u94e321fa-b0ef-4a85-a4d9-4f2300a37fd&title=&width=493.7499926425518)
<a name="Rvg9L"></a>
### 了解 class 文件
我们直接看一下 Class 文件的源代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1684659675780-0349862b-b088-4ab2-a75f-d5e3585619d5.png#averageHue=%23f8f6f5&clientId=ufedc2ed1-1a61-4&from=paste&height=1297&id=ufedf974d&originHeight=1038&originWidth=1594&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=256250&status=done&style=none&taskId=ub9a309b2-8cc8-4280-b25d-dfb5afefa9f&title=&width=1992.4999703094368)<br />上面是 Class 文件的部分源码，红色方框中是用来描述一个类的所包含的所有信息：

- 修饰符
- 类名
- 参数化类型
- 接口
- 注解
- 字段
- 构造器
- 方法

现在我们来写一个类：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1684660375817-4ba2552b-f58e-4153-b7d4-6f7c12961002.png#averageHue=%23fafafa&clientId=ufedc2ed1-1a61-4&from=paste&height=877&id=u7e385fe6&originHeight=702&originWidth=1074&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=80981&status=done&style=none&taskId=u286a60a9-5e00-4aaa-b3bb-6d85854f2d2&title=&width=1342.4999799951913)<br />当我们编译这个类后会生成一个字节码 .class 结尾的字节码文件。在程序执行后，cpu会识别字节码的指令执行。可以理解成 .java 源码是给人类读的，而 .class 字节码是给计算机读的，.class 文件被加载后是以字节数组存在内存中的。<br />具体流程图如下：<br /> ![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1684661000940-5a19647e-fb40-43ec-bc54-74337a32e9dc.png#averageHue=%23fafafa&clientId=ufedc2ed1-1a61-4&from=paste&height=324&id=u639b9227&originHeight=259&originWidth=613&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=74049&status=done&style=none&taskId=u5aa717dc-0ea3-45a1-86e7-26568f35dd5&title=&width=766.2499885819853)<br />那么根据上面流程图，我们可以得出以下对应关系：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1684662091216-db5967e5-3f18-4f57-b066-5bbd57984958.png#averageHue=%23fcfcfc&clientId=ufedc2ed1-1a61-4&from=paste&height=700&id=ub288486f&originHeight=560&originWidth=1238&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=81924&status=done&style=none&taskId=ub088d2ae-0375-42fb-834d-b9057b52c8e&title=&width=1547.4999769404535)

希望以上能帮助你理解反射~~~







<a name="IzLxq"></a>
### <br />
