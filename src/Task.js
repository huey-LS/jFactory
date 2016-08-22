import Event from './Event';

export default class Task extends Event {
  constructor(name, config, initData, options) {
    super();
    this.name = name;
    this.data = initData;
    this.config = config;
    this.history = [];

    /*
     * nextTick, 保证.on('complete')可以被触发到
    */
    Promise.resolve().then(() => {this.next()});
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
    this.trigger(this.constructor.EVENTS.JOB_ACTION, this.data);
    /*
     * 如果返回值是 function, 则可以通过({next}) => {next()}进入下一步，为异步流程控制设计
    */
    if(typeof active === 'function') {
      active(this);
    } else {
      this.next(active);
    }
  }

  /*
   * 进入下一步
  */
  next(new_item) {
    if(new_item) this.update(new_item);
    var targetStep;
    if(this.step === undefined){
      targetStep = 0;
    } else if(this.step >= this.config.length - 1){
      this.complete();
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
    this.trigger(this.constructor.EVENTS.CANCEL, this.data);
  }

  complete(new_item) {
    if(new_item) this.update(new_item);
    this.trigger(this.constructor.EVENTS.COMPLETE, this.data);
  }

  static get EVENTS() {
    return {
      COMPLETE: 'complete',
      CANCEL: 'cancel',
      JOB_ACTION: 'active'
    }
  }

  destroy() {
    delete this.options;
    delete this.data;
    delete this.config;
    delete this.history;
  };
}
