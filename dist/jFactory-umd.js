(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jFactory = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Event = function () {
  function Event() {
    classCallCheck(this, Event);

    this._events = {};
  }

  createClass(Event, [{
    key: 'on',
    value: function on(name, callback) {
      var events = this._events[name] || (this._events[name] = []);
      events.push(callback);
      return this;
    }
  }, {
    key: 'off',
    value: function off(name, callback) {
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
    }
  }, {
    key: 'trigger',
    value: function trigger(name) {
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
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      delete this._events;
    }
  }]);
  return Event;
}();

var Task = function (_Event) {
  inherits(Task, _Event);

  function Task(name, config, initData, options) {
    classCallCheck(this, Task);

    var _this = possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this));

    _this.name = name;
    _this.data = initData;
    _this.config = config;
    _this.history = [];

    /*
     * nextTick, 保证.on('complete')可以被触发到
    */
    Promise.resolve().then(function () {
      _this.next();
    });
    return _this;
  }

  createClass(Task, [{
    key: 'update',
    value: function update(new_data) {
      var prev_data = this.data;
      if (typeof new_data !== 'undefined' && new_data !== prev_data) {
        this.data = new_data;
        this.trigger(this.constructor.EVENTS.DATA_UPDATE, prev_data, new_data);
      }
    }

    /**
     * 进行job
     * @PARAM {Number} targetStep task中job的index
     * @PARAM {Object} options
     *    options现在支持的只有 notHistory，表示该job不被写入历史记录中
    */

  }, {
    key: 'go',
    value: function go(targetStep, options) {
      if (targetStep === undefined) return;
      var jobConfig = this.config[targetStep];
      var jobOptions, jobAction;
      if (typeof jobConfig === 'function') {
        jobAction = jobConfig;
      } else if (typeof jobConfig.main === 'function') {
        jobAction = jobConfig.main;
      } else {
        throw new Error('job or job.main must is function');
      }

      jobOptions = Object.assign({
        notHistory: false
      }, jobConfig.options, options);

      this.trigger(this.constructor.EVENTS.JOB_BEFORE_ACTION, this.data);

      //修改历史记录
      if (!jobOptions.notHistory) {
        this.history.splice(this.history.step, this.history.length - this.history.step, targetStep);
        this.history.step = this.history.length;
      }

      this.step = targetStep;
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
    }

    /**
     * 跳转下一个job
    */

  }, {
    key: 'next',
    value: function next(new_item) {
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
    }

    /**
     * 跳转上一个job
    */

  }, {
    key: 'previous',
    value: function previous(new_item) {
      if (new_item) this.update(new_item);
      var targetStep;
      if (this.step === undefined) {
        targetStep = 0;
      } else {
        targetStep = this.step - 1;
      }
      this.go(targetStep);
    }

    /**
     * 跳转至历史记录中的上一个job
     */

  }, {
    key: 'back',
    value: function back(new_item) {
      if (new_item) this.update(new_item);
      var targetStep;
      if (this.history.length && this.history.step > 0) {
        // 历史纪录里回退一步
        this.history.step--;
        targetStep = this.history[this.history.step - 1];
        this.go(targetStep, { silent: true });
      }
    }

    /**
     * 跳转至历史记录中的下一个job
     */

  }, {
    key: 'forward',
    value: function forward(new_item) {
      if (new_item) this.update(new_item);
      var targetStep;
      if (this.history.length && this.history.step < this.history.length) {
        // 历史纪录里回前进一步
        this.history.step++;
        targetStep = this.history[this.history.step + 1];
        this.go(targetStep, { silent: true });
      }
    }

    /**
     * 任务取消，触发EVENTS.CANCEL事件
     */

  }, {
    key: 'cancel',
    value: function cancel(new_item) {
      if (new_item) this.update(new_item);
      this.trigger(this.constructor.EVENTS.CANCEL, this.data);
      this.destroy();
    }

    /**
     * 任务完成，触发EVENTS.COMPLETE事件
     */

  }, {
    key: 'complete',
    value: function complete(new_item) {
      if (new_item) this.update(new_item);
      this.trigger(this.constructor.EVENTS.COMPLETE, this.data);
      this.destroy();
    }

    /**
     * EVENTS事件列表
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (typeof this.constructor.destroy === 'function') {
        this.constructor.destroy();
      }
      delete this.options;
      delete this.data;
      delete this.config;
      delete this.history;
    }
  }], [{
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
  function Factory(options) {
    classCallCheck(this, Factory);

    this.reset(options);
  }

  createClass(Factory, [{
    key: 'reset',
    value: function reset(options) {
      options = Object.assign({}, options);
      this._tasks = Object.assign({}, options.tasks);
      this._jobs = Object.assign({}, options.jobs);
    }
  }, {
    key: 'add',
    value: function add(options) {
      Object.assign(this._tasks, options.tasks);
      Object.assign(this._jobs, options.jobs);
    }
  }, {
    key: 'addJobs',
    value: function addJobs(jobs) {
      this.add({ jobs: jobs });
    }
  }, {
    key: 'addTasks',
    value: function addTasks(tasks) {
      this.add({ tasks: tasks });
    }
  }, {
    key: 'createTaskArray',
    value: function createTaskArray(taskArray) {
      var _this = this;

      return taskArray.map(function (jobName) {
        if (typeof jobName === 'string' && _this._jobs[jobName]) {
          return _this._jobs[jobName];
        } else if (typeof jobName === 'function') {
          return jobName;
        } else if (jobName.main) {
          if (typeof jobName.main === 'string' && _this._jobs[jobName.main]) {
            return Object.assign({}, jobName, { main: _this._jobs[jobName.main] });
          } else if (typeof jobName.main === 'function') {
            return Object.assign({}, jobName);
          }
        }
      }).filter(function (value) {
        return value;
      });
    }
  }, {
    key: 'createTask',
    value: function createTask(taskName, initData) {
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
    }
  }]);
  return Factory;
}();

return Factory$1;

})));
