export default class Event {
  constructor() {
    this._events = {};
  }

  on(name, callback) {
    var events = this._events[name] || (this._events[name] = []);
    events.push(callback);
  }

  off(name, callback) {
    if(typeof name === 'string' && this._events[name]){
      if(callback){
        let events = this._events[name];
        if(events.indexOf(callback) !== -1) events.splice(events.indexOf(callback), 1);
      } else {
        this._events[name] = null;
      }
    } else if(typeof name === 'function') {
      callback = name;
      Object.keys(this._events).forEach((key) => {
        let events = this._events[key];
        if(events.indexOf(callback) !== -1) events.splice(events.indexOf(callback), 1);
      });
    }
  }

  trigger(name, ...args) {
    var events = this._events[name];
    if(!events) return false;
    event.forEach((callback) => callback.apply(this, args));
  }
}
