---
title: spring原理
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

<a name="hbr74"></a>

## 什么是 spring?

Spring 是个 java 企业级应用的开源开发框架。Spring 主要用来开发 Java 应用，但是有些扩展是针对构建 J2EE 平台的 web 应用。Spring 框架目标是简化 Java 企业级应用开发，并通过 POJO 为基础的编程模型促进良好的编程习惯。
<a name="sdILi"></a>

## 使用 Spring 框架的好处是什么？

- **轻量：**Spring 是轻量的，基本的版本大约 2MB。
- **控制反转：**Spring 通过控制反转实现了松散耦合，对象们给出它们的依赖，而不是创建或查找依赖的对象们。
- **面向切面的编程(AOP)：**Spring 支持面向切面的编程，并且把应用业务逻辑和系统服务分开。
- **容器：**Spring 包含并管理应用中对象的生命周期和配置。
- **MVC 框架**：Spring 的 WEB 框架是个精心设计的框架，是 Web 框架的一个很好的替代品。
- **事务管理：**Spring 提供一个持续的事务管理接口，可以扩展到上至本地事务下至全局事务（
- JTA）。
- **异常处理：**Spring 提供方便的 API 把具体技术相关的异常（比如由 JDBC，Hibernate or JDO 抛出的）转化 为一致的 unchecked 异常。
  <a name="HqV7J"></a>

## ApplicationContext 和 beanfactory 的区别

- 1. 利用 MessageSource 进行国际化 BeanFactory 是不支持国际化功能的，因为 BeanFactory 没有扩展 Spring 中 MessageResource 接口。相反，由于 ApplicationContext 扩展了 MessageResource 接口，因而具有消息处理的能力(i18N)
- 2.强大的事件机制(Event) 基本上牵涉到事件(Event)方面的设计，就离不开观察者模式。不明白观察者模式的朋友，最好上网了解下。因为，这种模式在 java 开发中是比较常用的，又是比较重要的。ApplicationContext 的事件机制主要通过 ApplicationEvent 和 ApplicationListener 这两个接口来提供的，和 java swing 中的事件机制一样。即当 ApplicationContext 中发布一个事件的时，所有扩展了 ApplicationListener 的 Bean 都将会接受到这个事件，并进行相应的处理。
- 3.底层资源的访问 ApplicationContext 扩展了 ResourceLoader(资源加载器)接口，从而可以用来加载多个 Resource，而 BeanFactory 是没有扩展 ResourceLoader
- 4. BeanFactroy 采用的是延迟加载形式来注入 Bean 的，即只有在使用到某个 Bean 时(调用 getBean())，才对该 Bean 进行加载实例化，这样，我们就不能发现一些存在的 Spring 的配置问题。而 ApplicationContext 则相反，它是在容器启动时，一次性创建了所有的 Bean。这样，在容器启动时，我们就可以发现 Spring 中存在的配置错误。
     <a name="ab3Tk"></a>

## Spring Bean 生命周期

- 1、实例化一个 Bean－－也就是我们常说的 new；
- 2、按照 Spring 上下文对实例化的 Bean 进行配置－－也就是 IOC 注入；
- 3、如果这个 Bean 已经实现了 BeanNameAware 接口，会调用它实现的 setBeanName(String)方法，此处传递的就是 Spring 配置文件中 Bean 的 id 值
- 4、如果这个 Bean 已经实现了 BeanFactoryAware 接口，会调用它实现的 setBeanFactory(setBeanFactory(BeanFactory)传递的是 Spring 工厂自身（可以用这个方式来获取其它 Bean，只需在 Spring 配置文件中配置一个普通的 Bean 就可以）；
- 5、如果这个 Bean 已经实现了 ApplicationContextAware 接口，会调用 setApplicationContext(ApplicationContext)方法，传入 Spring 上下文（同样这个方式也可以实现步骤 4 的内容，但比 4 更好，因为 ApplicationContext 是 BeanFactory 的子接口，有更多的实现方法）；
- 6、如果这个 Bean 关联了 BeanPostProcessor 接口，将会调用 postProcessBeforeInitialization(Object obj, String s)方法，BeanPostProcessor 经常被用作是 Bean 内容的更改，并且由于这个是在 Bean 初始化结束时调用那个的方法，也可以被应用于内存或缓存技术；
- 7、如果 Bean 在 Spring 配置文件中配置了 init-method 属性会自动调用其配置的初始化方法。
- 8、如果这个 Bean 关联了 BeanPostProcessor 接口，将会调用 postProcessAfterInitialization(Object obj, String s)方法、注：以上工作完成以后就可以应用这个 Bean 了，那这个 Bean 是一个 Singleton 的，所以一般情况下我们调用同一个 id 的 Bean 会是在内容地址相同的实例，当然在 Spring 配置文件中也可以配置非 Singleton，这里我们不做赘述。
- 9、当 Bean 不再需要时，会经过清理阶段，如果 Bean 实现了 DisposableBean 这个 接口，会调用那个其实现的 destroy()方法；
- 10、最后，如果这个 Bean 的 Spring 配置中配置了 destroy-method 属性，会自动调 用其配置的销毁方法
  <a name="iC55S"></a>

## Spring IOC

IOC:，IOC 利用 java 反射机制，AOP 利用代理模式。所谓控制反转是指，本来被调用者的实例是有调用者来创建的，这样的缺点是耦合性太强，IOC 则是统一交给 spring 来管理创建，将对象交给容器管理，你只需要在 spring 配置文件总配置相应的 bean，以及设置相关的属性，让 spring 容器来生成类的实例对象以及管理对象。在 spring 容器启动的时候，spring 会把你在配置文件中配置的 bean 都初始化好，然后在你需要调用的时候，就把它已经初始化好的那些 bean 分配给你需要调用这些 bean 的类。 <br />IoC 的一个重点是在系统运行中，动态的向某个对象提供它所需要的其他对象。这一点是通过 DI（Dependency Injection，依赖注入）来实现的。比如对象 A 需要操作数据库，以前我们总是要在 A 中自己编写代码来获得一个 Connection 对象，有了 spring 我们就只需要告诉 spring，A 中需要一个 Connection，至于这个 Connection 怎么构造，何时构造，A 不需要知道。在系统运行时，spring 会在适当的时候制造一个 Connection，然后像打针一样，注射到 A 当中，这样就完成了对各个对象之间关系的控制。A 需要依赖 Connection 才能正常运行，而这个 Connection 是由 spring 注入到 A 中的，依赖注入的名字就这么来的。那么 DI 是如何实现的呢？ Java 1.3 之后一个重要特征是反射（reflection），它允许程序在运行的时候动态的生成对象、执行对象的方法、改变对象的属性，spring 就是通过反射来实现注入的。
<a name="AjYVb"></a>

## Spring AOP

AOP 技术利用一种称为“横切”的技术，剖解开封装的对象内部，并将那些影响了多个类的公共行为封装到一个可重用模块，并将其名为“Aspect”，即方面。所谓“方面”，简单地说，就是将那些与业务无关，却为业务模块所共同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可操作性和可维护性。使用“横切”技术， AOP 把软件系统分为两个部分：核心关注点和横切关注点。业务处理的主要流程是核心关 注点，与之关系不大的部分是横切关注点。横切关注点的一个特点是，他们经常发生在核心关注点的多处，而各处都基本相似。比如权限认证、日志、事务处理。Aop 的作用在于分离系统中的各种关注点，将核心关注点和横切关注点分离开来。
<a name="tkPCs"></a>

## 基于动态代理(Proxy)的 AOP 实现

首先，这是一种基于代理(Proxy)的实现方式。下面这张图很好地表达了这层关系：

![image.png](/assets/image/4.png)
这张图反映了参与到 AOP 过程中的几个关键组件(以@Before Advice 为例)：

1. 调用者 Beans - 即调用发起者，它只知道目标方法所在 Bean，并不清楚代理以及 Advice 的存在
2. 目标方法所在 Bean - 被调用的目标方法
3. 生成的代理 - 由 Spring AOP 为目标方法所在 Bean 生成的一个代理对象
4. Advice - 切面的执行逻辑

它们之间的调用先后次序反映在上图的序号中：

1. 调用者 Bean 尝试调用目标方法，但是被生成的代理截了胡
2. 代理根据 Advice 的种类(本例中是@Before Advice)，对 Advice 首先进行调用
3. 代理调用目标方法
4. 返回调用结果给调用者 Bean
   <a name="ym9rs"></a>

## 具体例子

有一个接口 Show(表演)里面有个抽象方法 sing()<br />有一个 Star 类(明星)实现 Show 接口中的 sing 去唱歌，他只需要唱歌其他不用管。<br />明星去唱歌就行了，至于谈酬劳以及签合同都是经纪人的事情了，因此我们这里需要一个经纪人类 AgentMan，商家有事情都找他就行了，因为经纪人就是明星的代理人，他可以全权负责。下面我们用代码来实现。

```java
Show接口
public interface Show {
    void sing();
}
```

```java
RealStar类
public class RealStar implements Show {
    @Override
    public void sing() {
        System.out.println("我是歌手只负责唱歌就可以了");
    }
}
```

```java
经纪人类
public class AgentMan implements Show {
    private Show show;

    public AgentMan(Show show) {
        this.show = show;
    }

    @Override
    public void sing() {
        System.out.println("我是经纪人我负责签合同");
        show.sing();
        System.out.println("唱完了，我该去收钱了");

    }
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686996028112-abef3dfb-dc1b-46fa-9880-4c1464c45d6f.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />测试<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686996042782-77328498-45e1-4895-a23e-3c073783154e.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)
<a name="W78ki"></a>

## Cglib 代理

Cglib 是一个强大的、高性能的代码生成包，它广泛被许多 AOP 框架使用，为他们提供方法的拦截。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686996172567-d2cc895e-2c48-4c4b-99a9-b38d40bfbb28.png#averageHue=%23fdf8f3&clientId=uea0b87af-cc81-4&from=paste&height=265&id=uf6b0ee85&originHeight=212&originWidth=550&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=72613&status=done&style=none&taskId=uebcbe6c9-491e-440f-b720-cd9fcb9817c&title=&width=687.4999897554518)

- 最顶层是字节码，字节码相关的知识请参考 [JVM 基础 - 类字节码详解](https://pdai.tech/md/java/jvm/java-jvm-class.html)
- ASM 是操作字节码的工具
- cglib 基于 ASM 字节码工具操作字节码（即动态生成代理，对方法进行增强）
- SpringAOP 基于 cglib 进行封装，实现 cglib 方式的动态代理
  <a name="z1djM"></a>

## 具体例子

引入依赖

```java
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.0.8.RELEASE</version>
    </dependency>
</dependencies>

```

**编写 Cglib 动态代理代码**

```java
public class CglibProxy implements MethodInterceptor {

    private Object target;

    public CglibProxy(Object target){
        this.target = target;
    }

    public Object createProxy() {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(target.getClass());
        enhancer.setCallback(this);
        Object proxy = enhancer.create();
        return proxy;
    }

    @Override
    public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        System.out.println("Cglib动态代理前置通知......");
        Object object = method.invoke(target, args);
        System.out.println("Cglib动态代理后置通知......");
        return object;
    }
}

```

**编写被代理类**

```java
public class CustomerDao {
    public void save() {
        System.out.println("保存客户......");
    }
    public void update() {
        System.out.println("修改客户......");
    }
    public void find() {
        System.out.println("查找客户......");
    }
    public void delete() {
        System.out.println("删除客户......");
    }
}

```

**测试**

```java
public class CglibProxyTest {
    public static void main(String[] args) {
        CustomerDao customerDao = new CustomerDao();
        CustomerDao proxy = (CustomerDao) new CglibProxy(customerDao).createProxy();
        proxy.save();
        proxy.update();
        proxy.find();
        proxy.delete();
    }
}

```

**测试结果**

```java
Cglib动态代理前置通知......
保存客户......
Cglib动态代理后置通知......
Cglib动态代理前置通知......
修改客户......
Cglib动态代理后置通知......
Cglib动态代理前置通知......
查找客户......
Cglib动态代理后置通知......
Cglib动态代理前置通知......
删除客户......
Cglib动态代理后置通知......

```
