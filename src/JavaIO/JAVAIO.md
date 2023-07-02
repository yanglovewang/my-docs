---
title: JavaIO
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---
## JAVA IO/NIO 
<a name="B5Jmh"></a>
### 阻塞 IO 模型 
最传统的一种 IO 模型，即在读写数据过程中会发生阻塞现象。当用户线程发出 IO 请求之后，内 核会去查看数据是否就绪，如果没有就绪就会等待数据就绪，而用户线程就会处于阻塞状态，用 户线程交出 CPU。当数据就绪之后，内核会将数据拷贝到用户线程，并返回结果给用户线程，用户线程才解除 block 状态典型的阻塞 IO 模型的例子为：data = socket.read();如果数据没有就 绪，就会一直阻塞在 read 方法。
```java
while(true) {
    data = socket.read();
    	if(data!= error){
    		//处理数据
   			 break;
    }
}
```
但是对于非阻塞 IO 就有一个非常严重的问题，在 while 循环中需要不断地去询问内核数据是否就 <br />绪，这样会导致 CPU 占用率非常高，因此一般情况下很少使用 while 循环这种方式来读取数据。
<a name="ngdIa"></a>
### 多路复用 IO 模型 
多路复用 IO 模型是目前使用得比较多的模型。Java NIO 实际上就是多路复用 IO。在多路复用 IO <br />模型中，会有一个线程不断去轮询多个 socket 的状态，只有当 socket 真正有读写事件时，才真 <br />正调用实际的 IO 读写操作。因为在多路复用 IO 模型中，只需要使用一个线程就可以管理多个 <br />socket，系统不需要建立新的进程或者线程，也不必维护这些线程和进程，并且只有在真正有 <br />socket 读写事件进行时，才会使用 IO 资源，所以它大大减少了资源占用。在 Java NIO 中，是通 <br />过 selector.select()去查询每个通道是否有到达事件，如果没有事件，则一直阻塞在那里，因此这 <br />种方式会导致用户线程的阻塞。多路复用 IO 模式，通过一个线程就可以管理多个 socket，只有当 <br />socket 真正有读写事件发生才会占用资源来进行实际的读写操作。因此，多路复用 IO 比较适合连 <br />接数比较多的情况。 <br />另外多路复用 IO 为何比非阻塞 IO 模型的效率高是因为在非阻塞 IO 中，不断地询问 socket 状态 <br />时通过用户线程去进行的，而在多路复用 IO 中，轮询每个 socket 状态是内核在进行的，这个效 <br />率要比用户线程要高的多。 <br />不过要注意的是，多路复用 IO 模型是通过轮询的方式来检测是否有事件到达，并且对到达的事件 <br />逐一进行响应。因此对于多路复用 IO 模型来说，一旦事件响应体很大，那么就会导致后续的事件 <br />迟迟得不到处理，并且会影响新的事件轮询。
<a name="Y8PSj"></a>
### 信号驱动 IO 模型 
在信号驱动 IO 模型中，当用户线程发起一个 IO 请求操作，会给对应的 socket 注册一个信号函 <br />数，然后用户线程会继续执行，当内核数据就绪时会发送一个信号给用户线程，用户线程接收到 <br />信号之后，便在信号函数中调用 IO 读写操作来进行实际的 IO 请求操作。 
<a name="uzhG2"></a>
### 异步 IO 模型 
异步 IO 模型才是最理想的 IO 模型，在异步 IO 模型中，当用户线程发起 read 操作之后，立刻就 <br />可以开始去做其它的事。而另一方面，从内核的角度，当它受到一个 asynchronous read 之后， <br />它会立刻返回，说明 read 请求已经成功发起了，因此不会对用户线程产生任何 block。然后，内 <br />核会等待数据准备完成，然后将数据拷贝到用户线程，当这一切都完成之后，内核会给用户线程 <br />发送一个信号，告诉它 read 操作完成了。也就说用户线程完全不需要实际的整个 IO 操作是如何 <br />进行的，只需要先发起一个请求，当接收内核返回的成功信号时表示 IO 操作已经完成，可以直接 <br />去使用数据了。 <br />也就说在异步 IO 模型中，IO 操作的两个阶段都不会阻塞用户线程，这两个阶段都是由内核自动完 <br />成，然后发送一个信号告知用户线程操作已完成。用户线程中不需要再次调用 IO 函数进行具体的 <br />读写。这点是和信号驱动模型有所不同的，在信号驱动模型中，当用户线程接收到信号表示数据 <br />已经就绪，然后需要用户线程调用 IO 函数进行实际的读写操作；而在异步 IO 模型中，收到信号 <br />表示 IO 操作已经完成，不需要再在用户线程中调用 IO 函数进行实际的读写操作。 <br />注意，异步 IO 是需要操作系统的底层支持，在 Java 7 中，提供了 Asynchronous IO。

<a name="OwXfl"></a>
## JAVA IO 包
![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686058929736-4eb504e4-c02d-4304-86d2-e197afbb359a.png#averageHue=%23fcfcfa&clientId=u53e77f05-9b31-4&from=paste&height=1240&id=u6526c29d&originHeight=992&originWidth=790&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=367730&status=done&style=none&taskId=ud69750db-e988-4d89-955f-736c73b2d9d&title=&width=987.4999852851035)
<a name="PbboB"></a>
## Java NIO
NIO 主要有三大核心部分：Channel(通道)，Buffer(缓冲区), Selector。传统 IO 基于字节流和字 <br />符流进行操作，而 NIO 基于 Channel 和 Buffer(缓冲区)进行操作，数据总是从通道读取到缓冲区 <br />中，或者从缓冲区写入到通道中。Selector(选择区)用于监听多个通道的事件（比如：连接打开， <br />数据到达）。因此，单个线程可以监听多个数据通道。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686058984936-0affacca-845d-407b-99b5-349f4e2f8c98.png#averageHue=%23f2f2ef&clientId=u53e77f05-9b31-4&from=paste&height=1157&id=u77d58302&originHeight=926&originWidth=1144&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=457360&status=done&style=none&taskId=uc0a34f62-3bfc-48d4-b33e-31fee7de9a1&title=&width=1429.9999786913397)<br />NIO 和传统 IO 之间第一个最大的区别是，IO 是面向流的，NIO 是面向缓冲区的。
<a name="wig9D"></a>
### NIO 的缓冲区
Java IO 面向流意味着每次从流中读一个或多个字节，直至读取所有字节，它们没有被缓存在任何 <br />地方。此外，它不能前后移动流中的数据。如果需要前后移动从流中读取的数据，需要先将它缓 <br />存到一个缓冲区。NIO 的缓冲导向方法不同。数据读取到一个它稍后处理的缓冲区，需要时可在 <br />缓冲区中前后移动。这就增加了处理过程中的灵活性。但是，还需要检查是否该缓冲区中包含所 <br />有您需要处理的数据。而且，需确保当更多的数据读入缓冲区时，不要覆盖缓冲区里尚未处理的 <br />数据。
<a name="CgyXb"></a>
### NIO 的非阻塞
IO 的各种流是阻塞的。这意味着，当一个线程调用 read() 或 write()时，该线程被阻塞，直到有 <br />一些数据被读取，或数据完全写入。该线程在此期间不能再干任何事情了。 NIO 的非阻塞模式， <br />使一个线程从某通道发送请求读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可 <br />用时，就什么都不会获取。而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以 <br />继续做其他的事情。 非阻塞写也是如此。一个线程请求写入一些数据到某通道，但不需要等待它 <br />完全写入，这个线程同时可以去做别的事情。 线程通常将非阻塞 IO 的空闲时间用于在其它通道上 <br />执行 IO 操作，所以一个单独的线程现在可以管理多个输入和输出通道（channel）。

<a name="gASQH"></a>
### Channel
首先说一下 Channel，国内大多翻译成“通道”。Channel 和 IO 中的 Stream(流)是差不多一个 <br />等级的。只不过 Stream 是单向的，譬如：InputStream, OutputStream，而 Channel 是双向 <br />的，既可以用来进行读操作，又可以用来进行写操作。 <br />NIO 中的 Channel 的主要实现有： <br />1. FileChannel <br />2. DatagramChannel <br />3. SocketChannel <br />4. ServerSocketChannel <br />这里看名字就可以猜出个所以然来：分别可以对应文件 IO、UDP 和 TCP（Server 和 Client）。 <br />下面演示的案例基本上就是围绕这 4 个类型的 Channel 进行陈述的。
<a name="SugaG"></a>
### Buffer
Buffer，故名思意，缓冲区，实际上是一个容器，是一个连续数组。Channel 提供从文件、 <br />网络读取数据的渠道，但是读取或写入的数据都必须经由 Buffer。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1686386448344-c4320635-95ad-4d49-8cc6-5516eed64584.png#averageHue=%23f8f8f5&clientId=u29c52924-f84c-4&from=paste&height=520&id=uc89e7598&originHeight=416&originWidth=1546&originalType=binary&ratio=0.800000011920929&rotation=0&showTitle=false&size=266607&status=done&style=none&taskId=u1f0897f6-1fec-4f0f-a6fc-2bed28d3a4f&title=&width=1932.4999712035064)

上面的图描述了从一个客户端向服务端发送数据，然后服务端接收数据的过程。客户端发送 <br />数据时，必须先将数据存入 Buffer 中，然后将 Buffer 中的内容写入通道。服务端这边接收数据必 <br />须通过 Channel 将数据读入到 Buffer 中，然后再从 Buffer 中取出数据来处理。 <br />在 NIO 中，Buffer 是一个顶层父类，它是一个抽象类，常用的 Buffer 的子类有： <br />ByteBuffer、IntBuffer、 CharBuffer、 LongBuffer、 DoubleBuffer、FloatBuffer、 <br />ShortBuffer
<a name="rF10C"></a>
### Selector
Selector 类是 NIO 的核心类，Selector 能够检测多个注册的通道上是否有事件发生，如果有事 <br />件发生，便获取事件然后针对每个事件进行相应的响应处理。这样一来，只是用一个单线程就可 <br />以管理多个通道，也就是管理多个连接。这样使得只有在连接真正有读写事件发生时，才会调用 <br />函数来进行读写，就大大地减少了系统开销，并且不必为每个连接都创建一个线程，不用去维护 <br />多个线程，并且避免了多线程之间的上下文切换导致的开销。
