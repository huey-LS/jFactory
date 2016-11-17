import Factory from '../../index';

var factory = new Factory();

factory.addJobs({
  'double': function(item){
    var _item = Object.assign({}, item);
    _item.n *= 2;
    return _item;
  },
  'plus': function(item){
    var _item = Object.assign({}, item);
    _item.n ++;
    return _item;
  },
  'asyncPlus': function(item){
    var _item = Object.assign({}, item);
    return function(task){
      setTimeout(function(){
        _item.n ++;
        if(_item.async_count) _item.async_count ++;
        else _item.async_count = 1;
        task.update(_item);
        task.next(_item);
      }, 100);
    }
  },
  'checkMoreThan10': function(item){
    var _item = Object.assign({}, item);
    return function(task){
      if(item.n > 10){
        task.cancel();
      } else {
        task.next();
      }
    }
  },
  'upTo10': function(item){
    return function(task){
      if(item.n < 10){
        task.previous();
      } else {
        task.next();
      }
    }
  }
});

factory.addTasks({
  'plus-double': ['plus', 'double'],
  'double-plus': ['double', 'plus'],
  'double-check-plus': ['double', 'checkMoreThan10', 'plus'],
  'asyncPlus-double': ['asyncPlus', 'double'],
  'plus-upTo10-notHistory': ['plus', {
    main: 'upTo10',
    options: {notHistory: 1}
  }],
  'plus-upTo10': ['plus', 'upTo10'],
});

var task1 = factory.createTask('plus-double', {n: 2});
task1.on('complete', function(data){
  console.log(data.n, 'task1', 'is 6 ?');
  // data.n === 6
});
// 对比以前 double(plus({n:2}))

var task2 = factory.createTask('double-plus', {n: 2});
task2.on('complete', function(data){
  console.log(data.n, 'task2', 'is 5 ?');
  // data.n === 5
})
// 对比以前 plus(double({n:2}))

var task3 = factory.createTask('double-check-plus', {n: 6});
task3.on('complete', function(data){
  console.log(data.n, 'task3-success');
  // 不会有
}).on('cancel', function(data){
  console.log(data.n, 'task3-error', 'is 12 ?');
  // data.n === 12
});

var task4 = factory.createTask('double-check-plus', {n: 4});
task4.on('complete', function(data){
  console.log(data.n, 'task4-success', 'is 9 ?');
  // data.n === 9
}).on('cancel', function(data){
  console.log(data.n, 'task4-error');
  // data.n === 9
})
// 对比以前
//  check(dobule({n: 2}))({
//    next: function(data){return plus(data)},
//    cancel: function(data){...}
//  });

var task5 = factory.createTask('asyncPlus-double', {n: 1});
task5.on('complete', function(data){
  console.log(data, 'task5', 'is {n: 4, async_count: 1} ?');
  // data is {n: 4, async_count: 1}
})
/* 对比以前
  asyncPlus({n: 1})({
    next: function(data){return plus(data)}
  })
*/
var task6 = factory.createTask('plus-upTo10', {n: 1});
task6.on('complete', function(data){
  console.log(data, 'task6', 'is up to 10 ?', task6.history);
  // data is {n: 4, async_count: 1}
})
/* 对比以前
  asyncPlus({n: 1})({
    next: function(data){return plus(data)}
  })
*/
var task7 = factory.createTask('plus-upTo10-notHistory', {n: 1});
task7.on('complete', function(data){
  console.log(data, 'task7', 'is up to 10 ?', task7.history);
  // data is {n: 4, async_count: 1}
})
