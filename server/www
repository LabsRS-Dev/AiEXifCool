#!/usr/bin/env node

var arguments = process.argv.splice(2);
var http_port = 8888;
if(arguments.length > 0){
    try{
        http_port = parseInt(arguments[0]);
    }catch(e){
        console.log(e);
    }
}

// 启动服务器
require('./server')({
    port:process.env.PORT || http_port
});