---
title: git
icon: fab fa-markdown
order: 3
category:
  - 使用指南
tag:
  - Markdown
---

<a name="avgR0"></a>

# 列举工作中常用的几个 git 命令？

远程仓库中 clone 代码到本地：git clone https://github.com/MatchlessHeroVIP/ssmtest.git<br />新增文件的命令：git add file 或者 git add .<br />提交文件的命令：git [commit](https://so.csdn.net/so/search?q=commit&spm=1001.2101.3001.7020) –m 或者 git commit –a<br />本地仓库提交到远程仓库：git push<br />查看工作区状况：git status –s<br />拉取合并远程分支的操作：git fetch/git merge 或者 git pull<br />查看提交记录命令：git reflog<br />切换到主分支： git checkout master
<a name="TifgK"></a>

# 提交时发生冲突，你能解释冲突是如何产生的吗？你是如何解决的？

开发过程中，我们都有自己的特性分支，所以冲突发生的并不多，但也碰到过。诸如公共类的公共方法，我和别人同时修改同一个文件，他提交后我再提交就会报冲突的错误。<br />发生冲突，在 IDE 里面一般都是对比本地文件和远程分支的文件，然后把远程分支上文件的内容手工修改到本地文件，然后再提交冲突的文件使其保证与远程分支的文件一致，这样才会消除冲突，然后再提交自己修改的部分。特别要注意下，修改本地冲突文件使其与远程仓库的文件保持一致后，需要提交后才能消除冲突，否则无法继续提交。必要时可与同事交流，消除冲突。<br />**发生冲突，也可以使用命令。**<br />通过 git stash 命令，把工作区的修改提交到栈区，目的是保存工作区的修改；<br />通过 git pull 命令，拉取远程分支上的代码并合并到本地分支，目的是消除冲突；<br />通过 git stash pop 命令，把保存在栈区的修改部分合并到最新的工作空间中；
<a name="aIH6I"></a>

# 如果本次提交误操作，如何撤销？

如果想撤销提交到索引区的文件，可以通过 git [reset](https://so.csdn.net/so/search?q=reset&spm=1001.2101.3001.7020) HEAD file；如果想撤销提交到本地仓库的文件，可以通过 git reset –soft HEAD^n 恢复当前分支的版本库至上一次提交的状态，索引区和工作空间不变更；可以通过 git reset –mixed HEAD^n 恢复当前分支的版本库和索引区至上一次提交的状态，工作区不变更；可以通过 git reset –hard HEAD^n 恢复当前分支的版本库、索引区和工作空间至上一次提交的状态。
<a name="Ao7FO"></a>

# 如果我想修改提交的历史信息，应该用什么命令？

如果修改最近一次提交的历史记录，就可以用 git commit –amend 命令；vim 编辑的方式；<br />如果修改之前提交的历史记录，就需要按照下面的步骤：<br />第一步：首先查看前三次的提交历史记录：

```
$ git log -3
commit a762fcafecbd92bbde088054644e1b0586589c4b (HEAD -> slave)
Author: 18073638 <18073638@cnsuning.com>
Date:   Sat Mar 30 10:58:44 2019 +0800

four commit

commit eedbc93d58780f63dd47f8388f8217892096e89a
Author: 18073638 <18073638@cnsuning.com>
Date:   Thu Mar 28 17:19:52 2019 +0800

third commit third commit

commit 05396135eba85140602107e01e5c211d74f6c739
Author: 18073638 <18073638@cnsuning.com>
Date:   Thu Mar 28 16:56:19 2019 +0800

second commit
```

注意：这里我们想把 053961 的 committer 对象信息修改为“second commit second commit”.<br />第二步：执行命令 git rebase –i HEAD~3，会把前 3 次的提交记录按照倒叙列出来；

```
pick 0539613 second commit
pick eedbc93 third commit third commit
pick a762fca four commit

# Rebase c8d7ad7..a762fca onto c8d7ad7 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

这里把第一行的‘pick’修改为‘edit’，然后 esc + :wq 退出 vim 编辑器；

```
$ git rebase -i HEAD~3
Stopped at 0539613...  second commit
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue
```

第三步：根据提示，执行 git commit –amend 命令，进入 vim 编辑器并修改提交信息。

```
$ git commit --amend
[detached HEAD 20fe643] second commit second commit
 Date: Thu Mar 28 16:56:19 2019 +0800
 1 file changed, 1 insertion(+)
```

第四步：然后执行 git rebase –continue 命令

```
$ git rebase --continue
Successfully rebased and updated refs/heads/slave.

查看修改结果

$ git log -3
commit 9024049ef990e79fa61295d5c2b64d70017cf412 (HEAD -> slave)
Author: 18073638 <18073638@cnsuning.com>
Date:   Sat Mar 30 10:58:44 2019 +0800

    four commit

commit 79cb4e26dd300591e6352d0488802f43b65c8ba2
Author: 18073638 <18073638@cnsuning.com>
Date:   Thu Mar 28 17:19:52 2019 +0800

    third commit third commit

commit 20fe643cbf80cdcc649d732065e8ebf4caf773c7
Author: 18073638 <18073638@cnsuning.com>
Date:   Thu Mar 28 16:56:19 2019 +0800

    second commit second commit
```

修改成功。
<a name="yA8Y2"></a>

# git 的 4 个区域及转换

Git 本地有三个工作区域：工作目录（Working Directory）、暂存区(Stage/Index)、资源库(Repository 或 Git Directory)。如果在加上远程的 git 仓库(Remote Directory)就可以分为四个工作区域。文件在这四个区域之间的转换关系如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600055-145cee1a-0c3d-4fea-a157-9d6417811060.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />Workspace：工作区，就是你平时存放项目代码的地方;<br />Index / Stage：暂存区，用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息,一般存放在 .git 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）;<br />Repository：仓库区（或本地仓库），就是安全存放数据的位置，这里面有你提交到所有版本的数据。其中 HEAD 指向最新放入仓库的版本;<br />Remote：远程仓库，托管代码的服务器，可以简单的认为是你项目组中的一台电脑用于远程数据交换;<br />本地的三个区域确切的说应该是 git 仓库中 HEAD 指向的版本：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600042-525d664a-e018-4656-9d5b-d4322abbb349.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)<br />Directory：使用 Git 管理的一个目录，也就是一个仓库，包含我们的工作空间和 Git 的管理空间。<br />WorkSpace：需要通过 Git 进行版本控制的目录和文件，这些目录和文件组成了工作空间。<br />.git：存放 Git 管理信息的目录，初始化仓库的时候自动创建。<br />Index/Stage：暂存区，或者叫待提交更新区，在提交进入 repo 之前，我们可以把所有的更新放在暂存区。<br />Local Repo：本地仓库，一个存放在本地的版本库；HEAD 会只是当前的开发分支（branch）。
<a name="dcW89"></a>

# 你使用过 git stash 命令吗？你一般什么情况下会使用它？

命令 git stash 是把工作区修改的内容存储在栈区。<br />以下几种情况会使用到它：<br />解决冲突文件时，会先执行 git stash，然后解决冲突；<br />遇到紧急开发任务但目前任务不能提交时，会先执行 git stash，然后进行紧急任务的开发，然后通过 git stash pop 取出栈区的内容继续开发；<br />切换分支时，当前工作空间内容不能提交时，会先执行 git stash 再进行分支切换；
<a name="sDGrC"></a>

# git add 和 git stage 的区别

在回答这个问题之前需要先了解 git 仓库的三个组成部分：工作区（Working Directory）、暂存区（Stage）和历史记录区（History）：<br />工作区：在 git 管理下的正常目录都算是工作区，我们平时的编辑工作都是在工作区完成。<br />暂存区：临时区域。里面存放将要提交文件的快照。<br />历史记录区：git commit 后的记录区。<br />然后是这三个区的转换关系以及转换所使用的命令：<br />然后我们就可以来说一下 git add 和 git stage 了。其实，他们两是同义的，所以，惊不惊喜，意不意外？这个问题竟然是个陷阱…<br />引入 git stage 的原因其实比较有趣：<br />是因为要跟 svn add 区分，两者的功能是完全不一样的，svn add 是将某个文件加入版本控制，而 git add 则是把某个文件加入暂存区，因为在 git 出来之前大家用 svn 比较多，所以为了避免误导，git 引入了 git stage，然后把 git diff –staged 做为 git diff –cached 的相同命令。基于这个原因，我们建议使用 git stage 以及 git diff –staged。
<a name="AAoRc"></a>

# git add . 和 git add \* 区别

git add . 会把本地所有 untrack 的文件都加入暂存区，并且会根据.gitignore 做过滤，但是 git add \* 会忽略.gitignore 把任何文件都加入
<a name="n3Tj7"></a>

# git add 和 git commit 的区别

要想弄明白 git add 和 git commit 的区别，首先我们需要知道三个概念：工作区(Working Directory)、版本库(Repository)、暂存区(Stage or index)。<br />工作区<br />当你在开发一个项目时，主目录就是你的工作区。<br />版本库<br />工作区中有一个隐藏目录.git，这个就是 git 的版本库了。<br />暂存区<br />Git 的版本库里存了很多文件，其中包括称为 Stage 或 index 的暂存区，还有一个 git 为我们自动创建的第一个分支 master，以及指向 master 的一个指针 HEAD。<br />下面就是三个区的示意图：图片来着廖雪峰老师的 博客。<br />三个区的示意图三个区的示意图<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600117-b7fae5cc-cd81-4aef-ac39-b85240026719.png?x-oss-process=image%2Fresize%2Cw_458%2Climit_0)<br />git add 和 git commit 的区别就在于：<br />git add 把文件添加进去，实际上就是把文件修改添加到暂存区；<br />git commit 提交更改，实际上就是把暂存区的所有内容提交到当前分支。<br />因为我们创建 Git 版本库时，Git 自动为我们创建了唯一一个 master 分支。所以，git commit 就是往 master 分支上提交更改。<br />你可以简单理解为，需要提交的文件修改通通放到暂存区，然后，一次性提交暂存区的所有修改。<br />所以要想将修改提交到 master 中一定要先 git add 到暂存区中，再 git commit 到 master 分支。
<a name="oOjSK"></a>

# 如何查看分支提交的历史记录？查看某个文件的历史记录呢？

查看分支的提交历史记录：<br />命令 git log –number：表示查看当前分支前 number 个详细的提交历史记录；<br />命令 git log –number –pretty=oneline：在上个命令的基础上进行简化，只显示 sha-1 码和提交信息；<br />命令 git reflog –number: 表示查看所有分支前 number 个简化的提交历史记录；<br />命令 git reflog –number –pretty=oneline：显示简化的信息历史信息；<br />如果要查看某文件的提交历史记录，直接在上面命令后面加上文件名即可。<br />注意：如果没有 number 则显示全部提交次数。
<a name="T5tAw"></a>

# git reset、git revert 和 git checkout 有什么区别

这个问题同样也需要先了解 git 仓库的三个组成部分：工作区（Working Directory）、暂存区（Stage）和历史记录区（History）。<br />首先是它们的共同点：用来撤销代码仓库中的某些更改。<br />然后是不同点：<br />首先，从 commit 层面来说：<br />git reset 可以将一个分支的末端指向之前的一个 commit。然后再下次 git 执行垃圾回收的时候，会把这个 commit 之后的 commit 都扔掉。git reset 还支持三种标记，用来标记 reset 指令影响的范围：<br />–mixed：会影响到暂存区和历史记录区。也是默认选项；<br />–soft：只影响历史记录区；<br />–hard：影响工作区、暂存区和历史记录区。<br />注意：因为 git reset 是直接删除 commit 记录，从而会影响到其他开发人员的分支，所以不要在公共分支（比如 develop）做这个操作。<br />git checkout 可以将 HEAD 移到一个新的分支，并更新工作目录。因为可能会覆盖本地的修改，所以执行这个指令之前，你需要 stash 或者 commit 暂存区和工作区的更改。<br />git revert 和 git reset 的目的是一样的，但是做法不同，它会以创建新的 commit 的方式来撤销 commit，这样能保留之前的 commit 历史，比较安全。另外，同样因为可能会覆盖本地的修改，所以执行这个指令之前，你需要 stash 或者 commit 暂存区和工作区的更改。<br />然后，从文件层面来说：<br />git reset 只是把文件从历史记录区拿到暂存区，不影响工作区的内容，而且不支持 –mixed、–soft 和 –hard。<br />git checkout 则是把文件从历史记录拿到工作区，不影响暂存区的内容。<br />当执行 git rm --cached 命令时，会直接从暂存区删除文件，工作区则不会做出改变<br />当执行 git checkout . 或者 git checkout -- 命令时，会用暂存区全部或指定的文件替换工作区的文件。这个操作很危险，会清除工作区中未添加到暂存区的改动<br />当执行 git checkout HEAD . 或者 git checkout HEAD 命令时，会用 HEAD 指向的 master 分支中的全部或者部分文件替换暂存区以及工作区的文件。这个命令也是具有危险性的，因为不但会清除工作区中未提交的改动，也会清除暂存区中未提交的改动<br />git revert 不支持文件层面的操作。<br />回答关键点：<br />对于 commit 层面和文件层面，这三个指令本身功能差别很大。<br />git revert 不支持文件层面的操作。<br />不要在公共分支做 git reset 操作。
<a name="Uysw7"></a>

# 能不能说一下 git fetch 和 git pull 命令之间的区别？

git pull 命令从中央存储库中提取特定分支的新更改或提交，并更新本地存储库中的目标分支。<br />git fetch 也用于相同的目的，但它的工作方式略有不同。当你执行 git fetch 时，它会从所需的分支中提取所有新提交，并将其存储在本地存储库中的新分支中。如果要在目标分支中反映这些更改，必须在 git fetch 之后执行 git merge。只有在对目标分支和获取的分支进行合并后才会更新目标分支。<br />为了方便起见，请记住以下等式：<br />git pull = git fetch + git merge
<a name="Qdpxu"></a>

# 使用过 git merge 和 git rebase 吗？它们之间有什么区别？

简单的说，git merge 和 git rebase 都是合并分支的命令。<br />git merge branch 会把 branch 分支的差异内容 pull 到本地，然后与本地分支的内容一并形成一个 committer 对象提交到主分支上，合并后的分支与主分支一致；<br />git rebase branch 会把 branch 分支优先合并到主分支，然后把本地分支的 commit 放到主分支后面，合并后的分支就好像从合并后主分支又拉了一个分支一样，本地分支本身不会保留提交历史。<br />例如：<br />假设最开始只有一个 origin 分支<br />然后你在本地新建了一个分支来开发自己的工作叫 mywork,然后我们做一些修改添加，并提交两个 commit<br />这时有人在 origin 中做了一些修改并提交，推送到 origin 了<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600116-99ca7098-a7bd-4b62-90e3-ad3e23bf4353.png?x-oss-process=image%2Fresize%2Cw_421%2Climit_0)<br />这时你可以"pull"命令把"origin"分支上的修改拉下来并且和你的修改合并； 结果看起来就像一个新的"合并的提交"，合并时可以用 rebase 和 merge<br />**git merge** <br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600099-dd5e18df-5c1d-43c8-b2d8-fb0268c3e46a.png?x-oss-process=image%2Fresize%2Cw_551%2Climit_0)

```sql
git checkout origin
git pull
git checkout mywork
git merge origin
```

这时 Git 会用两个分支的末端（C4 和 C6）以及它们的共同祖先（C2）进行一次简单的三方合并计算<br />对三方合并后的结果重新做一个新的快照，并自动创建一个指向它的提交对象（C7），此时 mywork 快进到 c7 也指向 c7。这就是 merge 他会保留每一次提交的历史。<br />**git rebase**<br />但是，如果你想让"mywork"分支历史看起来像没有经过任何合并一样，你也许可以用 git rebase:

```
git checkout mywork
git rebase origin
// git rebase --onto master server client

```

上面的命令会把你的"mywork"分支里的每个提交(commit)取消掉，并且把它们临时保存为补丁(patch)(这些补丁放到".git/rebase"目录中),然后把"mywork"分支更新到最新的"origin"分支，最后把保存的这些补丁应用到"mywork"分支上生成 c5' 和 c6‘<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/1635081/1687785600513-3f665caa-5b04-4a88-b1d8-1851bcd6584c.png?x-oss-process=image%2Fresize%2Cw_652%2Climit_0)<br />这时如果想把 mywork 合并到 origin 上，可以运行如下命令

```sql
git checkout origin
git merge mywork
```

Merge 命令会保留所有 commit 的历史时间。每个人对代码的提交是各式各样的。尽管这些时间对于程序本身并没有任何意义。但是 merge 的命令初衷就是为了保留这些时间不被修改。这样也就形成了以 merge 时间为基准的网状历史结构。每个分支上都会继续保留各自的代码记录, 主分支上只保留 merge 的历史记录。子分支随时都有可能被删除。子分子删除以后，你能够看到的记录也就是，merge 某 branch 到某 branch 上了。这个历史记录描述基本上是没有意义的。<br />还有一个比较有意思的是你不能，也不应该去修改这个历史记录描述。那是因为这个 merge 记录里面，不仅仅包含你自己的代码，也包含别人的代码。到这里你能想象有多乱吧？<br />再来说一下 rebase, 这个命令会始终把你最新的修改放到最前头。比如你对主 branch 进行 rebase 以后, 你的所有修改就会在主 branch 当前所有的修改之前。你会更有信心保证你的代码运行畅通无阻。通过你自己的测试以后, 你就可以放心的把代码合并到主的 branch 里面了。<br />这里值得一提的是，rebase 通常是发生在自己的个人 branch 上的。它的基础就是现有的主 branch。这样做的好处就是保证每个人的代码都可以运行在当前最新的主 branch 的代码上。<br />当合并代码时，**最好先在 feat 分支上 git rebase master，再合并到 master 分支上，这样会使提交历史更加清晰。**<br />**最后有两点是特别要注意的：**<br />**永远都不要在公共分支上使用 rebase**<br />**在公共分支上使用 merge**<br />比如，如果在 master 分支上使用 rebase，会导致提交历史变得非常混乱。因为其他人本地的 master 分支还是原来的，由于 rebase 导致全新的提交，Git 会认为你的 master 分支的历史与其他人的历史不同。所以公共分支上应该使用 merge，来保证提交历史的清晰。
<a name="O9pXD"></a>

# 能说一下 git 系统中 HEAD、工作树和索引之间的区别吗？

HEAD 文件包含当前分支的引用（指针）；<br />工作树是把当前分支检出到工作空间后形成的目录树，一般的开发工作都会基于工作树进行；<br />索引 index 文件是对工作树进行代码修改后，通过 add 命令更新索引文件；GIT 系统通过索引 index 文件生成 tree 对象；
<a name="kq0Jq"></a>

# GitFlow 工作流程分支有哪些

GitFlow 可以用来管理分支。GitFlow 工作流中常用的分支有下面几类：<br />master 分支：最为稳定功能比较完整的随时可发布的代码，即代码开发完成，经过测试，没有明显的 bug，才能合并到 master 中。请注意永远不要在 master 分支上直接开发和提交代码，以确保 master 上的代码一直可用；<br />develop 分支；用作平时开发的主分支，并一直存在，永远是功能最新最全的分支，包含所有要发布 到下一个 release 的代码，主要用于合并其他分支，比如 feature 分支； 如果修改代码，新建 feature 分支修改完再合并到 develop 分支。所有的 feature、release 分支都是从 develop 分支上拉的。<br />feature 分支；这个分支主要是用来开发新的功能，一旦开发完成，通过测试没问题（这个测试，测试新功能没问题），我们合并回 develop 分支进入下一个 release<br />release 分支；用于发布准备的专门分支。当开发进行到一定程度，或者说快到了既定的发布日，可以发布时，建立一个 release 分支并指定版本号(可以在 finish 的时候添加)。开发人员可以对 release 分支上的代码进行集中测试和修改 bug。（这个测试，测试新功能与已有的功能是否有冲突，兼容性）全部完成经过测试没有问题后，将 release 分支上的代码合并到 master 分支和 develop 分支<br />hotfix 分支；用于修复线上代码的 bug。**从 master 分支上拉。**完成 hotfix 后，打上 tag 我们合并回 master 和 develop 分支。
<a name="kmbCN"></a>

# GitFlow 主要工作流程

1.初始化项目为 gitflow , 默认创建 master 分支 , 然后从 master 拉取第一个 develop 分支<br />2.从 develop 拉取 feature 分支进行编码开发(多个开发人员拉取多个 feature 同时进行并行开发 , 互不影响)<br />3.feature 分支完成后 , 合并到 develop(不推送 , feature 功能完成还未提测 , 推送后会影响其他功能分支的开发)；合并 feature 到 develop , 可以选择删除当前 feature , 也可以不删除。但当前 feature 就不可更改了，必须从 release 分支继续编码修改<br />4.从 develop 拉取 release 分支进行提测 , 提测过程中在 release 分支上修改 BUG<br />5.release 分支上线后 , 合并 release 分支到 develop/master 并推送；合并之后，可选删除当前 release 分支，若不删除，则当前 release 不可修改。线上有问题也必须从 master 拉取 hotfix 分支进行修改；<br />6.上线之后若发现线上 BUG , 从 master 拉取 hotfix 进行 BUG 修改；<br />7.hotfix 通过测试上线后，合并 hotfix 分支到 develop/master 并推送；合并之后，可选删除当前 hotfix ，若不删除，则当前 hotfix 不可修改，若补丁未修复，需要从 master 拉取新的 hotfix 继续修改；<br />8.当进行一个 feature 时 , 若 develop 分支有变动 , 如其他开发人员完成功能并上线 , 则需要将完成的功能合并到自己分支上，即合并 develop 到当前 feature 分支；<br />9.当进行一个 release 分支时 , 若 develop 分支有变动 , 如其他开发人员完成功能并上线 , 则需要将完成的功能合并到自己分支上，即合并 develop 到当前 release 分支 (!!! 因为当前 release 分支通过测试后会发布到线上 , 如果不合并最新的 develop 分支 , 就会发生丢代码的情况)；<br />**GitFlow 的好处**<br />GitFlow 为不同的分支分配一个明确的角色，并定义分支之间如何交互以及什么时间交互；可以帮助大型项目理清分支之间的关系，简化分支的复杂度。
<a name="UZqAr"></a>

# 使用过 git cherry-pick，有什么作用？

命令 git cherry-pick 可以把 branch A 的 commit 复制到 branch B 上。<br />在 branch B 上进行命令操作：<br />复制单个提交：git cherry-pick commitId<br />复制多个提交：git cherry-pick commitId1…commitId3<br />注意：复制多个提交的命令不包含 commitId1.
<a name="kh9SU"></a>

# git 跟其他版本控制器有啥区别？

GIT 是分布式版本控制系统，其他类似于 SVN 是集中式版本控制系统。<br />分布式区别于集中式在于：每个节点的地位都是平等，拥有自己的版本库，在没有网络的情况下，对工作空间内代码的修改可以提交到本地仓库，此时的本地仓库相当于集中式的远程仓库，可以基于本地仓库进行提交、撤销等常规操作，从而方便日常开发。
<a name="stWdC"></a>

# 我们在本地工程常会修改一些配置文件，这些文件不需要被提交，而我们又不想每次执行 git status 时都让这些文件显示出来，我们该如何操作？

首先利用命令 touch .gitignore 新建文件<br />$ touch .gitignore<br />然后往文件中添加需要忽略哪些文件夹下的什么类型的文件<br />$ vim .gitignore<br />$ cat .gitignore<br />/target/class<br />.settings<br />.imp<br />\*.ini<br />注意：忽略/target/class 文件夹下所有后缀名为.settings，.imp 的文件，忽略所有后缀名为.ini 的文件。
<a name="ScJtF"></a>

# 如何把本地仓库的内容推向一个空的远程仓库？

首先确保本地仓库与远程之间是连同的。如果提交失败，则需要进行下面的命令进行连通：<br />git remote add origin XXXX<br />注意：XXXX 是你的远程仓库地址。<br />如果是第一次推送，则进行下面命令：<br />git push -u origin master<br />注意：-u 是指定 origin 为默认主分支<br />之后的提交，只需要下面的命令：<br />git push origin master
<a name="vd3gj"></a>

# 如果代码出现 bug,你们是如何解决的?

创建一个 bug 分支,然后进行 bug 处理,处理完毕后,合并到 review 分支,组长 review 成功后才能够合并到 master<br />合并完成之后删除 bug 分支<br />回到 dev 分支继续开发。
<a name="mlZC6"></a>

# git rebase 的作用?

场景：在公司开发忘记提交到 github 托管，在家里又继续开发新的功能，<br />然后到公司昨天的代码跟你的新功能合并的时候可以用 git fecth ---> git rebase<br />那么他的提交记录就不会出现分叉,保持了提交记录的整洁.
<a name="AbZEJ"></a>

# 如何做代码的 review？

创建 review 分支,然后再创建自己的个人分支,当你完成自己的业务逻辑的时候,<br />再合并到 review 分支.给组长做代码的 review

> [https://blog.csdn.net/xushiyu1996818/article/details/120166824](https://blog.csdn.net/xushiyu1996818/article/details/120166824?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-120166824-blog-120359395.235%5Ev38%5Epc_relevant_anti_t3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-120166824-blog-120359395.235%5Ev38%5Epc_relevant_anti_t3&utm_relevant_index=2)
