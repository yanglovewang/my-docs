---
title: SpringMVC
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

Spring MVC 是一个基于 MVC 架构的用来简化 web 应用程序开发的应用开发框架，它是 Spring 的一个模块,无需中间整合层来整合 ，它和 Struts2 一样都属于表现层的框架。在 web 模型中，MVC 是一种很流行的框架，通过把 Model，View，Controller 分离，把较为复杂的 web 应用分成逻辑清晰的几部分，简化开发，减少出错，方便组内开发人员之间的配合。
<a name="IDAyp"></a>

## SpringMVC 执行流程

- 1.用户发送请求至前端控制器 DispatcherServlet
- 2.DispatcherServlet 收到请求调用 HandlerMapping 处理器映射器。
- 3.处理器映射器根据请求 url 找到具体的处理器，生成处理器对象及处理器拦截器(如果有则生成)一并返回给 DispatcherServlet。
- 4.DispatcherServlet 通过 HandlerAdapter 处理器适配器调用处理器
- 5.执行处理器(Controller，也叫后端控制器)。
- 6.Controller 执行完成返回 ModelAndView
- 7.HandlerAdapter 将 controller 执行结果 ModelAndView 返回给 DispatcherServlet
- 8.DispatcherServlet 将 ModelAndView 传给 ViewReslover 视图解析器
- 9.ViewReslover 解析后返回具体 View
- 10.DispatcherServlet 对 View 进行渲染视图（即将模型数据填充至视图中）。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687010684728-da247769-45c5-47e4-911a-a4ef9f6b996a.png#averageHue=%23161513&clientId=uc054170e-d842-4&from=paste&height=707&id=uee0a759d&originHeight=566&originWidth=793&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=60707&status=done&style=none&taskId=u667b0e11-1297-43b2-a253-ac28a5608b7&title=&width=991.2499852292242)
<a name="FqS6u"></a>

## Spring MVC 和 Struts 的区别

Spring MVC 是基于方法开发，Struts2 是基于类开发的。<br />Spring MVC 会将用户请求的 URL 路径信息与 Controller 的某个方法进行映射，所有请求参数会注入到对应方法的形参上，生成 Handler 对象，对象中只有一个方法；<br />Struts 每处理一次请求都会实例一个 Action，Action 类的所有方法使用的请求参数都是 Action 类中的成员变量，随着方法增多，整个 Action 也会变得混乱。<br />Spring MVC 支持单例开发模式，Struts 只能使用多例<br />Struts 由于只能通过类的成员变量接收参数，故只能使用多例。<br />Struts2 的核心是基于一个 Filter 即 StrutsPreparedAndExcuteFilter，Spring MVC 的核心是基于一个 Servlet 即 DispatcherServlet(前端控制器)。<br />Struts 处理速度稍微比 Spring MVC 慢，Struts 使用了 Struts 标签，加载数据较慢。
