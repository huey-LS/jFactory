var jFactory =
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Factory = __webpack_require__(1);

	var _Factory2 = _interopRequireDefault(_Factory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Factory2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Task = __webpack_require__(2);

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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event2 = __webpack_require__(3);

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

	    Promise.resolve().then(function () {
	      _this.next();
	    });
	    return _this;
	  }

	  _createClass(Task, [{
	    key: 'update',
	    value: function update(new_data) {
	      var prev_data = this.data;
	      if (typeof new_data !== 'undefined' && new_data !== prev_data) {
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
	      this.trigger(this.constructor.EVENTS.JOB_ACTION, this.data);
	      if (typeof active === 'function') {
	        active(this);
	      } else {
	        this.next(active);
	      }
	    }
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
	  }, {
	    key: 'cancel',
	    value: function cancel(new_item) {
	      if (new_item) this.update(new_item);
	      this.trigger(this.constructor.EVENTS.CANCEL, this.data);
	    }
	  }, {
	    key: 'complete',
	    value: function complete(new_item) {
	      if (new_item) this.update(new_item);
	      this.trigger(this.constructor.EVENTS.COMPLETE, this.data);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
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
	        JOB_ACTION: 'active'
	      };
	    }
	  }]);

	  return Task;
	}(_Event3.default);

	exports.default = Task;

/***/ },
/* 3 */
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
	  }]);

	  return Event;
	}();

	exports.default = Event;

/***/ }
/******/ ]);