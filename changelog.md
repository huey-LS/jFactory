# ChangeLog
## version 0.9.2
- [x] task 支持名字啦，可以直接go('name')，不用再写第几步了
- [x] 支持打包成loose版本，可以支持ie8
- [x] 添加打包成.min的压缩文件

## version 0.9.1
- [x] finish用 events代替promise
  1. 考虑任务可重复执行
  2. 任务不总是需要catch cancel的状态
- [x] Event bug修复，及链式调用支持，可以.on(xxx).on(xxx)了
- [x] dist输出支持
