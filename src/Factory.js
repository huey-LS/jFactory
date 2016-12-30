import Task from './Task';

export default class Factory {
  constructor(options) {
    this.reset(options);
  }

  reset(options) {
    options = Object.assign({}, options);
    this._tasks = Object.assign({}, options.tasks);
    this._jobs = Object.assign({}, options.jobs);
  }

  add(options) {
    Object.assign(this._tasks, options.tasks);
    Object.assign(this._jobs, options.jobs);
  }

  addJobs(jobs) {
    this.add({jobs: jobs});
  }
  addTasks(tasks) {
    this.add({tasks: tasks});
  }

  createTaskArray(taskArray) {
    return taskArray.map((jobName) => {
      if(typeof jobName === 'string' && this._jobs[jobName]) {
        return {
          name: jobName,
          main: this._jobs[jobName]
        };
      } else if(typeof jobName === 'function'){
        return jobName;
      } else if(jobName.main){
        if(typeof jobName.main === 'string' && this._jobs[jobName.main]){
          return Object.assign({}, jobName, {main: this._jobs[jobName.main]});
        } else if(typeof jobName.main === 'function'){
          return Object.assign({}, jobName);
        }
      }
    }).filter(value => value);
  }

  createTask(taskName, initData) {
    var _taskName, _taskArray, _taskOptions;
    if(!taskName){
      throw new Error('taskName is necessary');
    }
    if(typeof taskName === 'string' && this._tasks[taskName]){
      _taskName = taskName;
      _taskArray = this._tasks[taskName];
    } else if(typeof taskName.main === 'string' &&  this._tasks[taskName.main]) {
      _taskName = taskName.main;
      _taskArray = this._tasks[taskName];
      _taskOptions = taskName.options;
    } else if(Array.isArray(taskName)) {
      _taskArray = taskName;
    } else if(Array.isArray(taskName.main)) {
      _taskArray = taskName.main;
      _taskOptions = taskName.options;
    } else {
      throw new Error(taskName.toString() + ' is not set');
    }

    _taskArray = this.createTaskArray(_taskArray);

    return new Task(_taskName, _taskArray, initData, _taskOptions);
  }
}
