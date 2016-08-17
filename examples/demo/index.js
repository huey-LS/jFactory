import Factory from '../../index';

var welcome = function(item){
    alert('welcome');
    return item || {};
}

var tallMeName = function(item){
  var name;
  if(item.name){
    name = prompt('你的名字是：' + item.name + '吗？不对请重新输入');
  } else {
    name = prompt('告诉我你的名字');
  }
  if(name){
    return Object.assign({}, item, {name});
  } else if(item.name && name === "") {
    return item;
  } else {
    return function(task) {
      task.cancel();
    }
  }
}

var tallMePhone = function(item){
  var phone;
  if(item.phone){
    phone = prompt('你的电话是：' + item.phone + '吗？不对请重新输入');
  } else {
    phone = prompt('告诉我你的电话');
  }

  if(phone){
    return Object.assign({}, item, {phone});
  } else if(item.phone && phone === ""){
    return item;
  } else {
    return function (task) {
      task.cancel;
    }
  }
}

var select = function(item){
  var select = confirm('确认告诉我手机，取消告诉我名字。');
  var type;
  if(select){
    type = 'phone';
  } else {
    type = 'name';
  }
  return Object.assign({}, item, {type});
}

var success = function(item){
  var is_success;
  if(item.name){
    is_success = confirm('name is ' + item.name + '; 确认完成，取消返回上一部');
  } else if(item.phone){
    is_success = confirm('phone is' + item.phone + '; 确认完成，取消返回上一部');
  }
  return function(task){
    if(is_success){
      task.next();
    } else {
      task.back();
    }
  }
}


var myFactory = new Factory({
  tasks: {
    'tallMeName': ['welcome', 'tallMeName', 'success'],
    'tallMePhone': ['welcome', 'tallMePhone', 'success'],
    'tallMe': [
      'welcome',
      'select',
      {
        main: (item) => (task) =>{
          if(item.type === 'phone'){
            task.next();
          } else {
            task.go(5);
          }
        },
        options: {
          notHistory: 1
        }
      },
      'tallMePhone',
      {
        main: (item) => (task) => {
          task.go(7);
        },
        options: {
          notHistory: 1
        }
      },
      'tallMeName',
      {
        main: (item) => (task) => {
          task.go(7);
        },
        options: {
          notHistory: 1
        }
      },
      'success'
    ],
  },
  jobs: {
    'welcome': welcome,
    'select': select,
    'tallMeName': tallMeName,
    'tallMePhone': tallMePhone,
    'success': success
  }
})

document.getElementById('task1').onclick = function(){
  myFactory.createTask('tallMeName');
}
document.getElementById('task2').onclick = function(){
  myFactory.createTask('tallMePhone');
}
document.getElementById('task3').onclick = function(){
  myFactory.createTask('tallMe');
}
