# Factory
javascript 工厂模式，工厂构造类  
轻松创建一个工厂类，便于解耦
提供了历史记录回退方法，能更方便的实现各种需求

# Usage
## Factory说明
### 初始化一个工厂
```
var f = new Factory();
```
### 添加一个新的job函数
```
f.addJobs({
  'job1': (data) => {},
  //异步job
  'job2': (data) => ({next}) => {
    ....
    next(new_data);
  }
})
```
### 添加一个新的工厂任务task
```
f.addTasks({
  'task1': ['job1', 'job2']
})
```
### 进行一个任务
```
var task = f.createTask('task1', initData);
var task2 = f.createTask({
  main: 'task2',
  options: {...}
});
```

## task说明
### Attribute
- `history`
- `config`
- `name`
- `data`

### Methods
- `go` 任务启动
- `next` 跳转到下一个job
- `previous` 跳转到上一个job
- `back` 跳转到上一个历史记录中的job
- `forward` 跳转到下一个历史记录中的job
- `cancel` 取消任务
- `complete` 完成任务
- `update` 更新被加工data

### Events
```
task.on('event_name', function(data){});
```
- `complete` 整个流程完成，正常完成了最后一个job，或者调用了个task.complete
- `cancel` 任务被取消，调用了task.cancel
- `action` job被调用
- `beforeAction` job被调用前
- `update` 任务加工的item被更新

## job说明
job是一个函数
```
var job = (data) => ({next}) => {
  ....
  next(new_data);
}
```
