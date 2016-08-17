(function(global, factory){
  // Set up egeui appropriately for the environment.
  if (typeof define === 'function' && define.cmd) {
    define(function(require, exports, module) {
      module.exports = factory();
    });
  } else {
    global.task = factory();
  }
}(this, function(){
var isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};
var extend = function(obj) {
  if (!isObject(obj)) return obj;
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
};

var assign = Object.assign || extend;

var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

/**
* 多任务集合 - 适用通过几个共同的jobs，创建多任务
* @param {Object} 多任务配置
*/
var TaskFactory = function(options){
  this.reset(options);
};
TaskFactory.prototype.reset = function(options){
  this.tasks = extend({}, options.tasks);
  this.jobs = extend({}, options.jobs);
};
TaskFactory.prototype.add = function(options){
  this.tasks = extend(this.tasks, options.tasks);
  this.jobs = extend(this.jobs, options.jobs);
};
TaskFactory.prototype.createTask = function(taskName, data, options){
  if(isArray(taskName)){
    // 直接传入数组，作为临时任务
    return new Task(, taskName, this.jobs, data, options);
  } else if(typeof taskName === 'string' && this.tasks[taskName]){
    return new Task(taskName, this.tasks[taskName], this.jobs, data, options);
  } else {
    throw new Error(taskName + ' is not set');
  }
};
/**
 * 单个任务构造函数
 * @param {String} taskName
 * @param {Object} config : 任务的配置
 * @param {Object} jobs : 所用到的活动列表
 * @param {Object} data : 任务的公共数据
 * @param {Object} options : 任务的自定义设置
 */
var Task = function(taskName, config, jobs, data, options){
  this.name = taskName;
  this.options = extend({}, options);
  this.data = data;
  this.jobs = jobs;
  this.config = config;
  this.callback = this.options.callback;
  this.history = [];
};
Task.prototype.go = function(targetStep, data, options){
  if(targetStep === undefined) return;
  var ActiveJob = this.config[targetStep];
  var jobOptions;
  if(typeof ActiveJob === 'string'){
    ActiveJob = this.jobs[ActiveJob];
  }
  if(isArray(ActiveJob)){
    jobOptions = ActiveJob[1];
    ActiveJob = ActiveJob[0];
  }
  if(!ActiveJob) return;
  options = extend({}, options);
  if(!options.silent && (!jobOptions || !jobOptions.notHistory)){
    this.history.splice(this.history.step, this.history.length - this.history.step, targetStep);
    this.history.step = this.history.length;
  }
  if(this.active && this.active.destroy) this.active.destroy();
  this.step = targetStep;
  this.active = new ActiveJob(data, this.options, this);
  if(this.callback && this.callback.afterShow) this.callback.afterShow.call(this, data);
};
Task.prototype.next = function(data){
  if(this.callback && this.callback.beforeNext) this.callback.beforeNext.call(this, data);
  var targetStep;
  if(this.step === undefined){
    targetStep = 0;
  } else if(this.step >= this.config.length - 1){
    this.finish(data);
    return false;
  } else {
    targetStep = this.step + 1;
  }
  this.go(targetStep, data);
};
Task.prototype.previous = function(data){
  if(this.callback && this.callback.beforePrevious) this.callback.beforePrevious.call(this, data);
  var targetStep;
  if(this.step === undefined){
    targetStep = 0;
  } else {
    targetStep = this.step - 1;
  }
  this.go(targetStep, data);
};
Task.prototype.back = function(data){
  var targetStep;
  if(this.callback && this.callback.beforeBack) this.callback.beforeBack.call(this, data);

  if(this.history.length && this.history.step > 0){
    // 历史纪录里回退一步
    this.history.step --;
    targetStep = this.history[this.history.step - 1];
    this.go(targetStep, data, {silent: true});
  }
};
Task.prototype.forward = function(data){
  var targetStep;
  if(this.callback && this.callback.beforeBack) this.callback.beforeBack.call(this, data);

  if(this.history.length && this.history.step < this.history.length){
    // 历史纪录里回前进一步
    this.history.step ++;
    targetStep = this.history[this.history.step + 1];
    this.go(targetStep, data, {silent: true});
  }
};
Task.prototype.cancel = function(data){
  if(this.callback && this.callback.cancel) this.callback.cancel.call(this, data);
  if(this.active && this.active.destroy) this.active.destroy();
};
Task.prototype.finish = function(data){
  if(this.callback && this.callback.finish) this.callback.finish.call(this, data);
  if(this.active && this.active.destroy) this.active.destroy();
};
Task.prototype.update = function(data, reset){
  var newData;
  if(this.callback && this.callback.update) {
    newData = this.callback.update.call(this, data);
  }
  if(newData === undefined){
    newData = data;
  }
  if(reset || !isObject(this.data)){
    this.data = newData;
  } else {
    extend(this.data, newData);
  }
};
Task.prototype.destroy = function(){
  delete this.options;
  delete this.data;
  delete this.jobs;
  delete this.config;
  delete this.callback;
  delete this.history;
};

return TaskFactory;
}));
