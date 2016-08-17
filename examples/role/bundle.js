/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var factory = new _index2.default();

	factory.addJobs({
	  'double': function double(item) {
	    var _item = Object.assign({}, item);
	    _item.n *= 2;
	    return _item;
	  },
	  'plus': function plus(item) {
	    var _item = Object.assign({}, item);
	    _item.n++;
	    return _item;
	  },
	  'asyncPlus': function asyncPlus(item) {
	    var _item = Object.assign({}, item);
	    return function (task) {
	      setTimeout(function () {
	        _item.n++;
	        if (_item.async_count) _item.async_count++;else _item.async_count = 1;
	        task.update(_item);
	        task.next(_item);
	      }, 100);
	    };
	  },
	  'checkMoreThan10': function checkMoreThan10(item) {
	    var _item = Object.assign({}, item);
	    return function (task) {
	      if (item.n > 10) {
	        task.cancel();
	      } else {
	        task.next();
	      }
	    };
	  },
	  'upTo10': function upTo10(item) {
	    return function (task) {
	      if (item.n < 10) {
	        task.previous();
	      } else {
	        task.next();
	      }
	    };
	  }
	});

	factory.addTasks({
	  'plus-double': ['plus', 'double'],
	  'double-plus': ['double', 'plus'],
	  'double-check-plus': ['double', 'checkMoreThan10', 'plus'],
	  'asyncPlus-double': ['asyncPlus', 'double'],
	  'plus-upTo10-notHistory': ['plus', {
	    main: 'upTo10',
	    options: { notHistory: 1 }
	  }],
	  'plus-upTo10': ['plus', 'upTo10']
	});

	var task1 = factory.createTask('plus-double', { n: 2 });
	task1.then(function (data) {
	  console.log(data.n, 'task1', 'is 6 ?');
	  // data.n === 6
	});
	// 对比以前 double(plus({n:2}))

	var task2 = factory.createTask('double-plus', { n: 2 });
	task2.then(function (data) {
	  console.log(data.n, 'task2', 'is 5 ?');
	  // data.n === 5
	});
	// 对比以前 plus(double({n:2}))

	var task3 = factory.createTask('double-check-plus', { n: 6 });
	task3.then(function (data) {
	  console.log(data.n, 'task3-success');
	  // 不会有
	}).catch(function (data) {
	  console.log(data.n, 'task3-error', 'is 12 ?');
	  // data.n === 12
	});

	var task4 = factory.createTask('double-check-plus', { n: 4 });
	task4.then(function (data) {
	  console.log(data.n, 'task4-success', 'is 9 ?');
	  // data.n === 9
	}).catch(function (data) {
	  console.log(data.n, 'task4-error');
	  // data.n === 9
	});
	// 对比以前
	//  check(dobule({n: 2}))({
	//    next: function(data){return plus(data)},
	//    cancel: function(data){...}
	//  });

	var task5 = factory.createTask('asyncPlus-double', { n: 1 });
	task5.then(function (data) {
	  console.log(data, 'task5', 'is {n: 4, async_count: 1} ?');
	  // data is {n: 4, async_count: 1}
	});
	/* 对比以前
	  asyncPlus({n: 1})({
	    next: function(data){return plus(data)}
	  })
	*/
	var task6 = factory.createTask('plus-upTo10', { n: 1 });
	task6.then(function (data) {
	  console.log(data, 'task6', 'is up to 10 ?', task6.history);
	  // data is {n: 4, async_count: 1}
	});
	/* 对比以前
	  asyncPlus({n: 1})({
	    next: function(data){return plus(data)}
	  })
	*/
	var task7 = factory.createTask('plus-upTo10-notHistory', { n: 1 });
	task7.then(function (data) {
	  console.log(data, 'task7', 'is up to 10 ?', task7.history);
	  // data is {n: 4, async_count: 1}
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Factory = __webpack_require__(3);

	var _Factory2 = _interopRequireDefault(_Factory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Factory2.default;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Task = __webpack_require__(4);

	var _Task2 = _interopRequireDefault(_Task);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Factory = function () {
	  function Factory(options) {
	    _classCallCheck(this, Factory);

	    this.reset(options);
	  }

	  _createClass(Factory, [{
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

	      return new _Task2.default(_taskName, _taskArray, initData, _taskOptions);
	    }
	  }]);

	  return Factory;
	}();

	exports.default = Factory;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event2 = __webpack_require__(5);

	var _Event3 = _interopRequireDefault(_Event2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Task = function (_Event) {
	  _inherits(Task, _Event);

	  function Task(name, config, initData, options) {
	    _classCallCheck(this, Task);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Task).call(this));

	    _this.name = name;
	    _this.data = initData;
	    _this.config = config;
	    _this.history = [];

	    _this._promise = new Promise(function (resolve, reject) {
	      _this._promise_resolve = resolve;
	      _this._promise_reject = reject;
	    });

	    _this.next();
	    return _this;
	  }

	  _createClass(Task, [{
	    key: 'update',
	    value: function update(new_data) {
	      var prev_data = this.data;
	      if (new_data !== prev_data) {
	        this.data = new_data;
	        this.trigger('change', prev_data, new_data);
	      }
	    }
	  }, {
	    key: 'go',
	    value: function go(targetStep, options) {
	      if (targetStep === undefined) return;
	      options = Object({
	        silent: false
	      }, options);
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
	      }, jobConfig.options);

	      if (!options.silent && !jobOptions.notHistory) {
	        this.history.splice(this.history.step, this.history.length - this.history.step, targetStep);
	        this.history.step = this.history.length;
	      }

	      this.trigger('beforeActive', this.data);

	      this.step = targetStep;
	      var active = jobAction(this.data, this);
	      if (typeof active === 'function') {
	        active(this);
	        this.trigger('active', this.data);
	      } else {
	        this.trigger('active', this.data);
	        this.update(active);
	        this.next();
	      }
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      var targetStep;
	      if (this.step === undefined) {
	        targetStep = 0;
	      } else if (this.step >= this.config.length - 1) {
	        this.finish();
	        return false;
	      } else {
	        targetStep = this.step + 1;
	      }
	      this.go(targetStep);
	    }
	  }, {
	    key: 'previous',
	    value: function previous() {
	      var targetStep;
	      if (this.step === undefined) {
	        targetStep = 0;
	      } else {
	        targetStep = this.step - 1;
	      }
	      this.go(targetStep);
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      var targetStep;
	      if (this.history.length && this.history.step > 0) {
	        // 历史纪录里回退一步
	        this.history.step--;
	        targetStep = this.history[this.history.step - 1];
	        this.go(targetStep, { silent: true });
	      }
	    }
	  }, {
	    key: 'forward',
	    value: function forward() {
	      var targetStep;

	      if (this.history.length && this.history.step < this.history.length) {
	        // 历史纪录里回前进一步
	        this.history.step++;
	        targetStep = this.history[this.history.step + 1];
	        this.go(targetStep, { silent: true });
	      }
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this._promise_reject(this.data);
	    }
	  }, {
	    key: 'finish',
	    value: function finish() {
	      this._promise_resolve(this.data);
	    }
	  }, {
	    key: 'then',
	    value: function then() {
	      var _promise;

	      return (_promise = this._promise).then.apply(_promise, arguments);
	    }
	  }, {
	    key: 'catch',
	    value: function _catch() {
	      var _promise2;

	      return (_promise2 = this._promise).catch.apply(_promise2, arguments);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      delete this.options;
	      delete this.data;
	      delete this.config;
	      delete this.history;
	    }
	  }]);

	  return Task;
	}(_Event3.default);

	exports.default = Task;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function () {
	  function Event() {
	    _classCallCheck(this, Event);

	    this._events = {};
	  }

	  _createClass(Event, [{
	    key: 'on',
	    value: function on(name, callback) {
	      var events = this._events[name] || (this._events[name] = []);
	      events.push(callback);
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
	    }
	  }, {
	    key: 'trigger',
	    value: function trigger(name) {
	      var _this2 = this;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var events = this._events[name];
	      if (!events) return false;
	      event.forEach(function (callback) {
	        return callback.apply(_this2, args);
	      });
	    }
	  }]);

	  return Event;
	}();

	exports.default = Event;

/***/ }
/******/ ]);