---
title: Spring中的设计模式
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

<a name="HdujK"></a>

## 1. 简单工厂模式

简单工厂模式又叫做静态工厂方法（StaticFactory Method）模式，但不属于 23 种 GOF[设计模式](https://so.csdn.net/so/search?q=%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&spm=1001.2101.3001.7020)之一。 <br />简单工厂模式的实质是由一个工厂类根据传入的参数，动态决定应该创建哪一个产品类。 <br />spring 中的 BeanFactory 就是简单工厂模式的体现，根据传入一个唯一的标识来获得 bean 对象，但是否是在传入参数后创建还是传入参数前创建这个要根据具体情况来定。<br />如下配置，就是在 HelloItxxz 类中创建一个 itxxzBean，xml 文件的配置

```java
<beans>
    <bean id="singletonBean" class="com.itxxz.HelloItxxz">
        <constructor-arg>
            <value>Hello! 这是singletonBean!value>
        </constructor-arg>
   </ bean>

    <bean id="itxxzBean" class="com.itxxz.HelloItxxz" singleton="false">
        <constructor-arg>
            <value>Hello! 这是itxxzBean! value>
        </constructor-arg>
    </bean>

</beans>
```

**1.1 实现方式**

- Spring 使用工厂模式可以通过 BeanFactory 或 ApplicationContext 创建 bean 对象。

**两者对比：**

- BeanFactory ：延迟注入(使用到某个 bean 的时候才会注入),相比于 BeanFactory 来说会占用更少的内存，程序启动速度更快。
- ApplicationContext ：容器启动的时候，不管你用没用到，一次性创建所有 bean 。BeanFactory 仅提供了最基本的依赖注入支持，ApplicationContext 扩展了 BeanFactory ,除了有 BeanFactory 的功能还有额外更多功能，所以一般开发人员使用 ApplicationContext 会更多。

ApplicationContext 的三个实现类：

1. ClassPathXmlApplication：把上下文文件当成类路径资源。
2. FileSystemXmlApplication：从文件系统中的 XML 文件载入上下文定义信息。
3. XmlWebApplicationContext：从 Web 系统中的 XML 文件载入上下文定义信息。

**1.2 实现原理**<br />**（1）bean 容器的启动阶段：**

- 读取 bean 的 xml 配置文件,将 bean 元素分别转换成一个 BeanDefinition 对象。
- 然后通过 BeanDefinitionRegistry 将这些 bean 注册到 beanFactory 中，保存在它的一个 ConcurrentHashMap 中。
- 将 BeanDefinition 注册到了 beanFactory 之后，在这里 Spring 为我们提供了一个扩展的切口，允许我们通过实现接口 BeanFactoryPostProcessor 在此处来插入我们定义的代码。典型的例子就是：PropertyPlaceholderConfigurer，我们一般在配置数据库的 dataSource 时使用到的占位符的值，就是它注入进去的。

**（2）容器中 bean 的实例化阶段：**<br />**实例化阶段主要是通过反射或者 CGLIB 对 bean 进行实例化，**在这个阶段 Spring 又给我们暴露了很多的扩展点：

- **各种的 Aware 接口** ，比如 BeanFactoryAware，对于实现了这些 Aware 接口的 bean，在实例化 bean 时 Spring 会帮我们注入对应的 BeanFactory 的实例。
- **BeanPostProcessor 接口** ，实现了 BeanPostProcessor 接口的 bean，在实例化 bean 时 Spring 会帮我们调用接口中的方法。
- **InitializingBean 接口** ，实现了 InitializingBean 接口的 bean，在实例化 bean 时 Spring 会帮我们调用接口中的方法。
- **DisposableBean 接口** ，实现了 BeanPostProcessor 接口的 bean，在该 bean 死亡时 Spring 会帮我们调用接口中的方法。

**1.3 设计意义**

- **松耦合。** 可以将原来硬编码的依赖，通过 Spring 这个 beanFactory 这个工厂来注入依赖，也就是说原来只有依赖方和被依赖方，现在我们引入了第三方——spring 这个 beanFactory，由它来解决 bean 之间的依赖问题，达到了松耦合的效果.（**IOC**）
- **bean 的额外处理。** 通过 Spring 接口的暴露，在实例化 bean 的阶段我们可以进行一些额外的处理，这些额外的处理只需要让 bean 实现对应的接口即可，那么 spring 就会在 bean 的生命周期调用我们实现的接口来处理该 bean。[非常重要]

**1.4 案例分析二，加载 xml 文件的 bean**

```java
// 以工厂方法中的静态方法为例讲解一下：import java.util.Random;
public class StaticFactoryBean {
    public static Integer createRandom() {
        return new Integer(new Random().nextInt());
    }
}
// 建一个config.xm配置文件，将其纳入Spring容器来管理,需要通过factory-method指定静态方法名称
//createRandom方法必须是static的,才能找到 scope="prototype"
<bean id="random" class="example.chapter3.StaticFactoryBean" factory-method="createRandom"/>

// 测试:
//调用getBean()时,返回随机数.如果没有指定factory-method,会返回StaticFactoryBean的实例,即返回工厂Bean的实例
public static void main(String[] args) {
    XmlBeanFactory factory = new XmlBeanFactory(new ClassPathResource("config.xml"));
    System.out.println("我是IT学习者创建的实例:"+factory.getBean("random").toString());
}
```

<a name="Dq8Z2"></a>

## 2. 工厂方法

**2.1 实现方式** [FactoryBean](https://so.csdn.net/so/search?q=FactoryBean&spm=1001.2101.3001.7020)接口。<br />**2.2 实现原理：**<br />实现了 FactoryBean 接口的 bean 是一类叫做 factory 的 bean。其**特点**是:

- spring 会在使用 getBean()调用获得该 bean 时，会自动调用该 bean 的 getObject()方法，所以返回的不是 factory 这个 bean，而是这个 bean.getOjbect()方法的返回值。

**2.3 典型例子**

1. spring 与 mybatis 的结合。

![image.png](https://cdn.nlark.com/yuque/0/2023/jpeg/1635081/1687010997811-1a88ab77-5223-4eb9-9dee-a4cab0203e1e.jpeg#averageHue=%23fafcfb&clientId=u632d91f1-d7ba-4&from=paste&id=ue00c597c&originHeight=81&originWidth=606&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=u722cb8e2-2e53-4166-9ce1-ad89fd70516&title=)<br />**说明：**<br />我们看上面该 bean，因为实现了 FactoryBean 接口，所以返回的不是 SqlSessionFactoryBean 的实例，而是它的 SqlSessionFactoryBean.getObject() 的返回值。
<a name="tQKmQ"></a>

## 3. 单例设计模式

在我们的系统中，有一些对象其实我们只需要一个，比如说：线程池、缓存、对话框、注册表、日志对象、充当打印机、显卡等设备驱动程序的对象。事实上，这一类对象只能有一个实例，如果制造出多个实例就可能会导致一些问题的产生，比如：程序的行为异常、资源使用过量、或者不一致性的结果。<br />**3.1 使用单例模式的好处**

- 对于频繁使用的对象，可以省略创建对象所花费的时间，这对于那些重量级对象而言，是非常可观的一笔系统开销；
- 由于 new 操作的次数减少，因而对系统内存的使用频率也会降低，这将减轻 GC 压力，缩短 GC 停顿时间。

**Spring 中 bean 的默认作用域就是 singleton(单例)的。** 除了 singleton 作用域，Spring 中 bean 还有下面几种作用域：<br />prototype : 每次请求都会创建一个新的 bean 实例。

- request : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。
- session : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。
- global-session： 全局 session 作用域，仅仅在基于 portlet 的 web 应用中才有意义，Spring5 已经没有了。Portlet 是能够生成语义代码(例如：HTML)片段的小型 Java Web 插件。它们基于 portlet 容器，可以像 servlet 一样处理 HTTP 请求。但是，与 servlet 不同，每个 portlet 都有不同的会话

**3.2 Spring 实现单例的方式**

- xml :
- 注解：@Scope(value = "singleton")

**（1）Spring 通过** **ConcurrentHashMap** **实现单例注册表的特殊方式实现单例模式。Spring 实现单例的核心代码如下**

```java
// 通过 ConcurrentHashMap（线程安全） 实现单例注册表 （三级缓存）
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(64);

public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(beanName, "'beanName' must not be null");
    synchronized (this.singletonObjects) {
        // 检查缓存中是否存在实例
        Object singletonObject = this.singletonObjects.get(beanName);
        if (singletonObject == null) {
            //...省略了很多代码
            try {
                singletonObject = singletonFactory.getObject();
            }
            //...省略了很多代码
            // 如果实例对象在不存在，我们注册到单例注册表中。
            addSingleton(beanName, singletonObject);
        }
        return (singletonObject != NULL_OBJECT ? singletonObject : null);
    }
}
//将对象添加到单例注册表
protected void addSingleton(String beanName, Object singletonObject) {
    synchronized (this.singletonObjects) {
        this.singletonObjects.put(beanName, (singletonObject != null ? singletonObject : NULL_OBJECT));

    }
}
}
```

（2）Spring 依赖注入 Bean 实例默认是单例的。

- Spring 的依赖注入（包括 lazy-init 方式）都是发生在 AbstractBeanFactory 的 getBean 里。getBean 的 doGetBean 方法调用 getSingleton 进行 bean 的创建。

**分析 getSingleton()方法**

```java
public Object getSingleton(String beanName){
//参数true设置标识允许早期依赖
return getSingleton(beanName,true);
}
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    //检查缓存中是否存在实例
    Object singletonObject = this.singletonObjects.get(beanName);
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        //如果为空，则锁定全局变量并进行处理。
        synchronized (this.singletonObjects) {
            //如果此bean正在加载，则不处理
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                //当某些方法需要提前初始化的时候则会调用addSingleFactory 方法将对应的ObjectFactory初始化策略存储在singletonFactories
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    //调用预先设定的getObject方法
                    singletonObject = singletonFactory.getObject();
                    //记录在缓存中，earlysingletonObjects和singletonFactories互斥
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```

**getSingleton()过程图**

- spring 依赖注入时，使用了 双重判断加锁 的单例模式

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010997808-f011c4a3-c755-42fb-80d5-4d54a2bacf8a.png#averageHue=%23f7f7f4&clientId=u632d91f1-d7ba-4&from=paste&id=u0bc09178&originHeight=521&originWidth=744&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=udd84a372-59f6-45c3-a790-56deb177bb2&title=)<br />**3.3 单例模式小结**<br />**单例模式定义：** 保证一个类仅有一个实例，并提供一个访问它的全局访问点。<br />**spring 对单例的实现：** spring 中的单例模式完成了后半句话，即提供了全局的访问点 BeanFactory。但没有从构造器级别去控制单例，这是因为 spring 管理的是任意的 java 对象。
<a name="naUDd"></a>

## 4. 代理模式

**4.1 代理模式在 AOP 中的应用**<br />AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，**却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来**，便于**减少系统的重复代码**，**降低模块间的耦合度**，并**有利于未来的可拓展性和可维护性**。<br />**Spring AOP 就是基于动态代理的**，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用**JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用**Cglib** ，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010997814-3dafce13-5f70-4b7a-a1c4-b70136b1f013.png#averageHue=%23fbfbfa&clientId=u632d91f1-d7ba-4&from=paste&id=udb1efca0&originHeight=366&originWidth=770&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=u9fb7690a-c5a7-429c-a3d9-0b2c852cd45&title=)<br />使用 AOP 之后我们可以把一些通用功能抽象出来，在需要用到的地方直接使用即可，这样大大简化了代码量。我们需要增加新功能时也方便，这样也提高了系统扩展性。日志功能、事务管理等等场景都用到了 AOP 。<br />**4.2 Spring AOP 和 AspectJ AOP 有什么区别?**

1. **Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。**
2. Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。
3. Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单，

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。
<a name="DL6XZ"></a>

## 5. 模板方法

**5.1 经典模板方法定义：**<br />父类定义了骨架（调用哪些方法及顺序），某些特定方法由子类实现。

- **最大的好处**：代码复用，减少重复代码。除了子类要实现的特定方法，其他方法及方法调用顺序都在父类中预先写好了。

**所以父类模板方法中有两类方法：**<br />**（1）共同的方法：** 所有子类都会用到的代码<br />**（2）不同的方法：** 子类要覆盖的方法，分为两种：

- 抽象方法：父类中的是抽象方法，子类必须覆盖
- 钩子方法：父类中是一个空方法，子类继承了默认也是空的

注：为什么叫钩子，子类可以通过这个钩子（方法），控制父类，因为这个钩子实际是父类的方法（空方法）！<br />**5.2 Spring 模板方法模式实质**<br />是模板方法模式和回调模式的结合，是 Template Method 不需要继承的另一种实现方式。Spring 几乎所有的外接扩展都采用这种模式。<br />**5.3 具体实现**<br />JDBC 的抽象和对 Hibernate 的集成，都采用了一种理念或者处理方式，那就是模板方法模式与相应的 Callback 接口相结合。<br />采用模板方法模式是为了以一种统一而集中的方式来处理资源的获取和释放，以 JdbcTempalte 为例:

```java
public  abstract  class JdbcTemplate {
    public final Object execute（String sql）{
        Connection con=null;
        Statement stmt=null;
        try{
            con=getConnection（）;
            stmt=con.createStatement（）;
            Object retValue=executeWithStatement（stmt,sql）;
            return retValue;
        }catch（SQLException e）{
            ...
        }finally{
            closeStatement（stmt）;
            releaseConnection（con）;
        }
    }
    protected abstract Object executeWithStatement（Statement   stmt, String sql）;
}
```

**引入回调原因：**<br />JdbcTemplate 是抽象类，不能够独立使用，我们每次进行数据访问的时候都要给出一个相应的子类实现,这样肯定不方便，所以就引入了回调。<br />回调代码：

```typescript
public  interface StatementCallback{
    Object doWithStatement（Statement stmt）;
}
```

**利用回调方法重写 JdbcTemplate 方法**

```java
public class JdbcTemplate {
    public final Object execute（StatementCallback callback）{
        Connection con=null;
        Statement stmt=null;
        try{
            con=getConnection（）;
            stmt=con.createStatement（）;
            Object retValue=callback.doWithStatement（stmt）;
            return retValue;
        }catch（SQLException e）{
            ...
        }finally{
            closeStatement（stmt）;
            releaseConnection（con）;
        }
    }

    ...//其它方法定义
}
```

**Jdbc 使用方法如下：**

```java
JdbcTemplate jdbcTemplate=...;
final String sql=...;
StatementCallback callback=new StatementCallback(){
    public Object=doWithStatement(Statement stmt){
        return ...;
    }
}
jdbcTemplate.execute(callback);
```

**5.4 为什么 JdbcTemplate 没有使用继承？**<br />因为这个类的方法太多，但是我们还是想用到 JdbcTemplate 已有的稳定的、公用的数据库连接，那么我们怎么办呢？<br />我们可以把变化的东西抽出来作为一个参数传入 JdbcTemplate 的方法中。但是变化的东西是一段代码，而且这段代码会用到 JdbcTemplate 中的变量。怎么办？<br />那我们就用回调对象吧。在这个回调对象中定义一个操纵 JdbcTemplate 中变量的方法，我们去实现这个方法，就把变化的东西集中到这里了。然后我们再传入这个回调对象到 JdbcTemplate，从而完成了调用。
<a name="S5OHQ"></a>

## 6. 观察者模式

观察者模式是一种对象行为型模式。它表示的是一种对象与对象之间具有依赖关系，当一个对象发生改变的时候，这个对象所依赖的对象也会做出反应。Spring 事件驱动模型就是观察者模式很经典的一个应用。Spring 事件驱动模型非常有用，在很多场景都可以解耦我们的代码。比如我们每次添加商品的时候都需要重新更新商品索引，这个时候就可以利用观察者模式来解决这个问题。<br />**6.1 Spring 事件驱动模型中的三种角色**

- **事件角色**

ApplicationEvent (org.springframework.context 包下)充当事件的角色,这是一个抽象类，它继承了 java.util.EventObject 并实现了 java.io.Serializable 接口。<br />Spring 中默认存在以下事件，他们都是对 ApplicationContextEvent 的实现(继承自 ApplicationContextEvent)：

- ContextStartedEvent：ApplicationContext 启动后触发的事件;
- ContextStoppedEvent：ApplicationContext 停止后触发的事件;
- ContextRefreshedEvent：ApplicationContext 初始化或刷新完成后触发的事件;
- ContextClosedEvent：ApplicationContext 关闭后触发的事件。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010997827-7b62d460-8f6f-4666-bed1-7a37702694f4.png#averageHue=%23fbfbfb&clientId=u632d91f1-d7ba-4&from=paste&id=ucc1a3e69&originHeight=227&originWidth=698&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=ua71fb37a-deed-438d-9e03-870be9005ff&title=)

- **事件监听者角色**

ApplicationListener 充当了事件监听者角色，它是一个接口，里面只定义了一个 onApplicationEvent（）方法来处理 ApplicationEvent。ApplicationListener 接口类源码如下，可以看出接口定义看出接口中的事件只要实现了 ApplicationEvent 就可以了。所以，在 Spring 中我们只要实现 ApplicationListener 接口实现 onApplicationEvent() 方法即可完成监听事件

```java
package org.springframework.context;
import java.util.EventListener;

@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E var1);
}
```

- **事件发布者角色**

ApplicationEventPublisher 充当了事件的发布者，它也是一个接口。

```typescript
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        this.publishEvent((Object)event);
    }

    void publishEvent(Object var1);
}
```

ApplicationEventPublisher 接口的 publishEvent（）这个方法在 AbstractApplicationContext 类中被实现，阅读这个方法的实现，你会发现实际上事件真正是通过 ApplicationEventMulticaster 来广播出去的。具体内容过多，就不在这里分析了，后面可能会单独写一篇文章提到。<br />**6.2 Spring 的事件流程总结**

1. 定义一个事件: 实现一个继承自 ApplicationEvent，并且写相应的构造函数；
2. 定义一个事件监听者：实现 ApplicationListener 接口，重写 onApplicationEvent() 方法；
3. 使用事件发布者发布消息: 可以通过 ApplicationEventPublisher 的 publishEvent() 方法发布消息。

**Example:**

```java
// 定义一个事件,继承自ApplicationEvent并且写相应的构造函数
public class DemoEvent extends ApplicationEvent{
    private static final long serialVersionUID = 1L;

    private String message;

    public DemoEvent(Object source,String message){
        super(source);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }


    // 定义一个事件监听者,实现ApplicationListener接口，重写 onApplicationEvent() 方法；
    @Component
    public class DemoListener implements ApplicationListener<DemoEvent>{

        //使用onApplicationEvent接收消息
        @Override
        public void onApplicationEvent(DemoEvent event) {
            String msg = event.getMessage();
            System.out.println("接收到的信息是："+msg);
        }

    }

    // 发布事件，可以通过ApplicationEventPublisher  的 publishEvent() 方法发布消息。
    @Component
    public class DemoPublisher {

        @Autowired
        ApplicationContext applicationContext;

        //当调用 DemoPublisher 的 publish() 方法的时候，
        //比如 demoPublisher.publish("你好") ，控制台就会打印出:接收到的信息是：你好 。
        public void publish(String message){
            //发布事件
            applicationContext.publishEvent(new DemoEvent(this, message));
        }
    }
```

<a name="MWfpr"></a>

## 7. 适配器模式

适配器模式(Adapter Pattern) 将一个接口转换成客户希望的另一个接口，适配器模式使接口不兼容的那些类可以一起工作，其别名为包装器(Wrapper)。<br />**7.1 spring AOP 中的适配器模式**<br />我们知道 Spring AOP 的实现是基于代理模式，但是 Spring AOP 的增强或通知(Advice)使用到了适配器模式，与之相关的接口是 AdvisorAdapter 。Advice 常用的类型有：

- BeforeAdvice（目标方法调用前,前置通知）
- AfterAdvice（目标方法调用后,后置通知）
- AfterReturningAdvice(目标方法执行结束后，return 之前)等等。

每个类型 Advice（通知）都有对应的拦截器:MethodBeforeAdviceInterceptor、AfterReturningAdviceAdapter、AfterReturningAdviceInterceptor。<br />Spring 预定义的通知要通过对应的适配器，适配成 MethodInterceptor 接口(方法拦截器)类型的对象（如：MethodBeforeAdviceInterceptor 负责适配 MethodBeforeAdvice）。<br />**7.2 spring MVC 中的适配器模式**<br />在 Spring MVC 中，DispatcherServlet 根据请求信息调用 HandlerMapping，解析请求对应的 Handler。解析到对应的 Handler（也就是我们平常说的 Controller 控制器）后，开始由 HandlerAdapter 适配器处理。HandlerAdapter 作为期望接口，具体的适配器实现类用于对目标类进行适配，Controller 作为需要适配的类。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010997858-98fc1479-eb44-4d1e-a0b8-0f07f5a7ce7a.png#averageHue=%23f6f6f6&clientId=u632d91f1-d7ba-4&from=paste&id=u693114ce&originHeight=483&originWidth=1080&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=u53c1936d-d086-4801-b2cc-2bf37827d63&title=)<br />**（1）为什么要在 Spring MVC 中使用适配器模式？** <br />Spring MVC 中的 Controller 种类众多，不同类型的 Controller 通过不同的方法来对请求进行处理。如果不利用适配器模式的话，DispatcherServlet 直接获取对应类型的 Controller，需要的自行来判断，像下面这段代码一样：

```java
if(mappedHandler.getHandler() instanceof MultiActionController){
   ((MultiActionController)mappedHandler.getHandler()).xxx
}else if(mappedHandler.getHandler() instanceof XXX){
    ...
}else if(...){
   ...
}
```

假如我们再增加一个 Controller 类型就要在上面代码中再加入一行 判断语句，这种形式就使得程序难以维护，也违反了设计模式中的开闭原则 – 对扩展开放，对修改关闭。
<a name="JXvTY"></a>

## 8. 装饰者模式

装饰者模式可以动态地给对象添加一些额外的属性或行为。相比于使用继承，装饰者模式更加灵活。简单点儿说就是当我们需要修改原有的功能，但我们又不愿直接去修改原有的代码时，设计一个 Decorator 套在原有代码外面。其实在 JDK 中就有很多地方用到了装饰者模式，比如 :

- InputStream 家族，InputStream 类下有 FileInputStream (读取文件)、BufferedInputStream (增加缓存,使读取文件速度大大提升)等子类都在不修改 InputStream 代码的情况下扩展了它的功能。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010998129-4efc0c43-c0a8-4845-9d0e-6f683823aedb.png#averageHue=%23f7f7f7&clientId=u632d91f1-d7ba-4&from=paste&id=u3c19240c&originHeight=290&originWidth=670&originalType=url&ratio=0.800000011920929&rotation=0&showTitle=false&status=done&style=none&taskId=u09735f6a-4dfc-44cc-af35-926da94d293&title=)<br />Spring 中配置 DataSource 的时候，DataSource 可能是不同的数据库和数据源。我们能否根据客户的需求在少修改原有类的代码下动态切换不同的数据源？<br />这个时候就要用到装饰者模式(这一点我自己还没太理解具体原理)。Spring 中用到的包装器模式在类名上含有 Wrapper 或者 Decorator。这些类基本上都是动态地给一个对象添加一些额外的职责;
<a name="hc6w2"></a>

## 9. 策略模式

在策略模式（Strategy Pattern）中，一个类的行为或其算法可以在运行时更改。这种类型的设计模式属于行为型模式。<br />在策略模式中，我们创建表示各种策略的对象和一个行为随着策略对象改变而改变的 context 对象。策略对象改变 context 对象的执行算法

- [菜鸟教程—策略模式](https://www.runoob.com/design-pattern/strategy-pattern.html)

**9.1 实现方式**<br />Spring 框架的资源访问 Resource 接口。该接口提供了更强的资源访问能力，Spring 框架本身大量使用了 Resource 接口来访问底层资源。<br />**Resource 接口介绍**<br />source 接口是具体资源访问策略的抽象，也是所有资源访问类所实现的接口。<br />Resource 接口主要提供了如下几个方法:

- **getInputStream()：** 定位并打开资源，返回资源对应的输入流。每次调用都返回新的输入流。调用者必须负责关闭输入流。
- **exists()：** 返回 Resource 所指向的资源是否存在。
- **isOpen()：** 返回资源文件是否打开，如果资源文件不能多次读取，每次读取结束应该显式关闭，以防止资源泄漏。
- **getDescription()：** 返回资源的描述信息，通常用于资源处理出错时输出该信息，通常是全限定文件名或实际 URL。
- **getFile：** 返回资源对应的 File 对象。
- **getURL：** 返回资源对应的 URL 对象。

最后两个方法通常无须使用，仅在通过简单方式访问无法实现时，Resource 提供传统的资源访问的功能;<br />Resource 接口本身没有提供访问任何底层资源的实现逻辑，**针对不同的底层资源，Spring 将会提供不同的 Resource 实现类，不同的实现类负责不同的资源访问逻辑。**<br />Spring 为 Resource 接口提供了如下实现类：

- **UrlResource：** 访问网络资源的实现类。
- **ClassPathResource：** 访问类加载路径里资源的实现类。
- **FileSystemResource：** 访问文件系统里资源的实现类。
- **ServletContextResource：** 访问相对于 ServletContext 路径里的资源的实现类.
- **InputStreamResource：** 访问输入流资源的实现类。
- **ByteArrayResource：** 访问字节数组资源的实现类。

这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。
