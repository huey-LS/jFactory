(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jFactory = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function () {
  function Event() {
    _classCallCheck(this, Event);

    this._events = {};
  }

  Event.prototype.on = function on(name, callback) {
    var events = this._events[name] || (this._events[name] = []);
    events.push(callback);
    return this;
  };

  Event.prototype.off = function off(name, callback) {
    var _this = this;

    if (typeof name === 'string' && this._events[name]) {
      if (callback) {
        var events = this._events[name];
        if (events.indexOf(callback) !== -1) events.splice(events.indexOf(callback), 1);
      } else {
        this._events[name] = null;
      }
    } else if (typeof name === 'function') {
      callback = name;
      Object.keys(this._events).forEach(function (key) {
        var events = _this._events[key];
        if (events.indexOf(callback) !== -1) events.splice(events.indexOf(callback), 1);
      });
    }
    return this;
  };

  Event.prototype.trigger = function trigger(name) {
    var _this2 = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var events = this._events[name];
    if (events) {
      events.forEach(function (callback) {
        return callback.apply(_this2, args);
      });
    }
    return this;
  };

  Event.prototype.destroy = function destroy() {
    delete this._events;
  };

  return Event;
}();

var Task = function (_Event) {
  _inherits(Task, _Event);

  function Task(name, config, initData, options) {
    _classCallCheck(this, Task);

    var _this3 = _possibleConstructorReturn(this, _Event.call(this));

    _this3.name = name;
    _this3.data = initData;
    _this3.config = config;
    _this3.history = [];

    /*
     * nextTick, 保证.on('complete')可以被触发到
     * 使用setTimeout代替，兼容性更佳
    */
    //Promise.resolve().then(() => {this.next()});
    setTimeout(function () {
      _this3.next();
    }, 0);
    return _this3;
  }

  Task.prototype.update = function update(new_data) {
    var prev_data = this.data;
    if (typeof new_data !== 'undefined' && new_data !== prev_data) {
      this.data = new_data;
      this.trigger(this.constructor.EVENTS.DATA_UPDATE, prev_data, new_data);
    }
  };

  /**
   * 获取任务中的目标job，支持数字和字符串
   */


  Task.prototype.getJob = function getJob(targetStep) {
    var index, config;
    if (typeof targetStep === 'number') {
      index = targetStep;
    } else if (typeof targetStep === 'string') {
      index = this.config.findIndex(function (item) {
        return item === targetStep || item.name === targetStep;
      });
    } else if (typeof targetStep === 'function') {
      index = this.config.findIndex(function (item) {
        return targetStep(item);
      });
    }

    if (index >= 0) {
      return {
        config: this.config[index],
        index: index
      };
    }
  };

  /**
   * 进行job
   * @PARAM {Number} targetStep task中job的index
   * @PARAM {Object} options
   *    options现在支持的只有 notHistory，表示该job不被写入历史记录中
  */


  Task.prototype.go = function go(targetStep, options) {
    if (targetStep === undefined) return;
    var jobConfig = this.getJob(targetStep);
    var targetIndex = jobConfig.index;
    jobConfig = jobConfig.config;
    if (!jobConfig) {
      throw new Error('get job error: on ' + targetStep + '; no this target');
      return;
    }
    var jobOptions, jobAction;
    if (typeof jobConfig === 'function') {
      jobAction = jobConfig;
    } else if (typeof jobConfig.main === 'function') {
      jobAction = jobConfig.main;
    } else {
      throw new Error('get job error: on ' + targetStep + '; job or job.main must is function');
    }

    jobOptions = Object.assign({
      notHistory: false
    }, jobConfig.options, options);

    this.trigger(this.constructor.EVENTS.JOB_BEFORE_ACTION, this.data);

    //修改历史记录
    if (!jobOptions.notHistory) {
      this.history.splice(this.history.step, this.history.length - this.history.step, targetIndex);
      this.history.step = this.history.length;
    }

    this.step = targetIndex;
    var active = jobAction(this.data, this);
    this.trigger(this.constructor.EVENTS.JOB_ACTION, this.data);
    /*
     * 如果返回值是 function, 则可以通过({next}) => {next()}进入下一步，为异步流程控制设计
    */
    if (typeof active === 'function') {
      active(this);
    } else {
      this.next(active);
    }
  };

  /**
   * 跳转下一个job
  */


  Task.prototype.next = function next(new_item) {
    if (new_item) this.update(new_item);
    var targetStep;
    if (this.step === undefined) {
      targetStep = 0;
    } else if (this.step >= this.config.length - 1) {
      this.complete();
      return false;
    } else {
      targetStep = this.step + 1;
    }
    this.go(targetStep);
  };

  /**
   * 跳转上一个job
  */


  Task.prototype.previous = function previous(new_item) {
    if (new_item) this.update(new_item);
    var targetStep;
    if (this.step === undefined) {
      targetStep = 0;
    } else {
      targetStep = this.step - 1;
    }
    this.go(targetStep);
  };

  /**
   * 跳转至历史记录中的上一个job
   */


  Task.prototype.back = function back(new_item) {
    if (new_item) this.update(new_item);
    var targetStep;
    if (this.history.length && this.history.step > 0) {
      // 历史纪录里回退一步
      this.history.step--;
      targetStep = this.history[this.history.step - 1];
      this.go(targetStep, { notHistory: true });
    }
  };

  /**
   * 跳转至历史记录中的下一个job
   */


  Task.prototype.forward = function forward(new_item) {
    if (new_item) this.update(new_item);
    var targetStep;
    if (this.history.length && this.history.step < this.history.length) {
      // 历史纪录里回前进一步
      this.history.step++;
      targetStep = this.history[this.history.step + 1];
      this.go(targetStep, { notHistory: true });
    }
  };

  /**
   * 任务取消，触发EVENTS.CANCEL事件
   */


  Task.prototype.cancel = function cancel(new_item) {
    if (new_item) this.update(new_item);
    this.trigger(this.constructor.EVENTS.CANCEL, this.data);
    this.destroy();
  };

  /**
   * 任务完成，触发EVENTS.COMPLETE事件
   */


  Task.prototype.complete = function complete(new_item) {
    if (new_item) this.update(new_item);
    this.trigger(this.constructor.EVENTS.COMPLETE, this.data);
    this.destroy();
  };

  /**
   * EVENTS事件列表
   */


  Task.prototype.destroy = function destroy() {
    if (typeof this.constructor.destroy === 'function') {
      this.constructor.destroy();
    }
    delete this.options;
    delete this.data;
    delete this.config;
    delete this.history;
  };

  _createClass(Task, null, [{
    key: 'EVENTS',
    get: function get() {
      return {
        COMPLETE: 'complete',
        CANCEL: 'cancel',
        JOB_BEFORE_ACTION: 'beforeActive',
        JOB_ACTION: 'active',
        DATA_UPDATE: 'update'
      };
    }
  }]);

  return Task;
}(Event);

var Factory$1 = function () {
  function Factory$1(options) {
    _classCallCheck(this, Factory$1);

    this.reset(options);
  }

  Factory$1.prototype.reset = function reset(options) {
    options = Object.assign({}, options);
    this._tasks = Object.assign({}, options.tasks);
    this._jobs = Object.assign({}, options.jobs);
  };

  Factory$1.prototype.add = function add(options) {
    Object.assign(this._tasks, options.tasks);
    Object.assign(this._jobs, options.jobs);
  };

  Factory$1.prototype.addJobs = function addJobs(jobs) {
    this.add({ jobs: jobs });
  };

  Factory$1.prototype.addTasks = function addTasks(tasks) {
    this.add({ tasks: tasks });
  };

  Factory$1.prototype.createTaskArray = function createTaskArray(taskArray) {
    var _this4 = this;

    return taskArray.map(function (jobName) {
      if (typeof jobName === 'string' && _this4._jobs[jobName]) {
        return {
          name: jobName,
          main: _this4._jobs[jobName]
        };
      } else if (typeof jobName === 'function') {
        return jobName;
      } else if (jobName.main) {
        if (typeof jobName.main === 'string' && _this4._jobs[jobName.main]) {
          return Object.assign({}, jobName, { main: _this4._jobs[jobName.main] });
        } else if (typeof jobName.main === 'function') {
          return Object.assign({}, jobName);
        }
      }
    }).filter(function (value) {
      return value;
    });
  };

  Factory$1.prototype.createTask = function createTask(taskName, initData) {
    var _taskName, _taskArray, _taskOptions;
    if (!taskName) {
      throw new Error('taskName is necessary');
    }
    if (typeof taskName === 'string' && this._tasks[taskName]) {
      _taskName = taskName;
      _taskArray = this._tasks[taskName];
    } else if (typeof taskName.main === 'string' && this._tasks[taskName.main]) {
      _taskName = taskName.main;
      _taskArray = this._tasks[taskName];
      _taskOptions = taskName.options;
    } else if (Array.isArray(taskName)) {
      _taskArray = taskName;
    } else if (Array.isArray(taskName.main)) {
      _taskArray = taskName.main;
      _taskOptions = taskName.options;
    } else {
      throw new Error(taskName.toString() + ' is not set');
    }

    _taskArray = this.createTaskArray(_taskArray);

    return new Task(_taskName, _taskArray, initData, _taskOptions);
  };

  return Factory$1;
}();

var jFactory = Factory$1;

return jFactory;

})));
