
if [ "x$1" == 'xstart' ];then
        forever start bin/www
elif [ "x$1" == 'xdebug' ];then
        forever start -c 'supervisor' bin/www
elif [ "x$1" == 'xstop' ];then
        forever stop bin/www
fi
