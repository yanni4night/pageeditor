pageeditor
==========

通过模板和简单的输入创建模式化的重复页面。



usage
==========

启动(linux)：

    
    $PORT=10234 node bin/www

或者：

    $sh service.sh start

打开浏览器：http://localhost:10234/

新增模板：

    
    $touch views/tpl/xxx.hjs
    $touch config/xxx.json

注意 rsync 权限。

todo
==========

 - 日志
 - 权限

founder
==========
 - <yanni4night@gmail.com>