import Event from './Event';

export default class Task extends Event {
  constructor(name, config, initData, options) {
    super();
    this.name = name;
    this.data = initData;
    this.config = config;
    this.history = [];

    this._promise = new Promise((resolve, reject) => {
      this._promise_resolve = resolve;
      this._promise_reject = reject;
    });

    this.next();
  }

  update(new_data) {
    var prev_data = this.data;
    if(typeof new_data !== 'undefined' && new_data !== prev_data){
      this.data = new_data;
      this.trigger('change', prev_data, new_data);
    }
  }

  go(targetStep, options) {
    if(targetStep === undefined) return;
    options = Object({
      silent: false
    }, options);
    var jobConfig = this.config[targetStep];
    var jobOptions, jobAction;
    if(typeof jobConfig === 'function') {
      jobAction = jobConfig;
    } else if(typeof jobConfig.main === 'function') {
      jobAction = jobConfig.main;
    } else {
      throw new Error('job or job.main must is function');
    }

    jobOptions = Object.assign({
      notHistory: false
    }, jobConfig.options);

    if(!options.silent && !jobOptions.notHistory) {
      this.history.splice(this.history.step, this.history.length - this.history.step, targetStep);
      this.history.step = this.history.length;
    }

    this.trigger('beforeActive', this.data);

    this.step = targetStep;
    var active = jobAction(this.data, this);
    if(typeof active === 'function') {
      active(this);
      this.trigger('active', this.data);
    } else {
      this.trigger('active', this.data);
      this.update(active);
      this.next();
    }
  }

  next(new_item) {
    if(new_item) this.update(new_item);
    var targetStep;
    if(this.step === undefined){
      targetStep = 0;
    } else if(this.step >= this.config.length - 1){
      this.finish();
      return false;
    } else {
      targetStep = this.step + 1;
    }
    this.go(targetStep);
  }

  previous(new_item) {
    if(new_item) this.update(new_item);
    var targetStep;
    if(this.step === undefined){
      targetStep = 0;
    } else {
      targetStep = this.step - 1;
    }
    this.go(targetStep);
  }

  back(new_item) {
    if(new_item) this.update(new_item);
    var targetStep;
    if(this.history.length && this.history.step > 0){
      // 历史纪录里回退一步
      this.history.step --;
      targetStep = this.history[this.history.step - 1];
      this.go(targetStep, {silent: true});
    }
  }

  forward(new_item) {
    if(new_item) this.update(new_item);
    var targetStep;
    if(this.history.length && this.history.step < this.history.length){
      // 历史纪录里回前进一步
      this.history.step ++;
      targetStep = this.history[this.history.step + 1];
      this.go(targetStep, {silent: true});
    }
  }

  cancel(new_item) {
    if(new_item) this.update(new_item);
    this._promise_reject(this.data);
  }

  finish(new_item) {
    if(new_item) this.update(new_item);
    this._promise_resolve(this.data);
  }

  then(...args) {
    return this._promise.then(...args);
  }
  catch(...args) {
    return this._promise.catch(...args);
  }

  destroy() {
    delete this.options;
    delete this.data;
    delete this.config;
    delete this.history;
  };
}
