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
      this.trigger(this.constructor.EVENTS.DATA_UPDATE, prev_data, new_data);
    }
  }

  /**
   * 进行job
   * @PARAM {Number} targetStep task中job的index
   * @PARAM {Object} options
   *    options现在支持的只有 notHistory，表示该job不被写入历史记录中
  */
  go(targetStep, options) {
    if(targetStep === undefined) return;
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
    }, jobConfig.options, options);

    this.trigger(this.constructor.EVENTS.JOB_BEFORE_ACTION, this.data);

    //修改历史记录
    if(!jobOptions.notHistory) {
      this.history.splice(this.history.step, this.history.length - this.history.step, targetStep);
      this.history.step = this.history.length;
    }

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

  /**
   * 跳转下一个job
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

  /**
   * 跳转上一个job
  */
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

  /**
   * 跳转至历史记录中的上一个job
   */
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

  /**
   * 跳转至历史记录中的下一个job
   */
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

  /**
   * 任务取消，触发EVENTS.CANCEL事件
   */
  cancel(new_item) {
    if(new_item) this.update(new_item);
    this.trigger(this.constructor.EVENTS.CANCEL, this.data);
    this.destroy();
  }

  /**
   * 任务完成，触发EVENTS.COMPLETE事件
   */
  complete(new_item) {
    if(new_item) this.update(new_item);
    this.trigger(this.constructor.EVENTS.COMPLETE, this.data);
    this.destroy();
  }

  /**
   * EVENTS事件列表
   */
  static get EVENTS() {
    return {
      COMPLETE: 'complete',
      CANCEL: 'cancel',
      JOB_BEFORE_ACTION: 'beforeActive',
      JOB_ACTION: 'active',
      DATA_UPDATE: 'update'
    }
  }

  destroy() {
    if(typeof this.constructor.destroy === 'function') {
      this.constructor.destroy();
    }
    delete this.options;
    delete this.data;
    delete this.config;
    delete this.history;
  };
}
