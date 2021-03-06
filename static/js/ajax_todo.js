var test;
var doneNum;
var notDoneNum;
var doneTodos = [];
var notDoneTodos = [];
var logOpen = true;


var log = function(){
  if(logOpen){
    console.log(arguments);
  }
};


String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    　　　　　　　　　　　　
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}


var getTodoInfo = function() {
    //ajax 发送请求
    var request = {
        url: '/ajax_todo/getInfo',
        type: 'post',
        //async : false,
        dataType: 'json',  // 注意：这里是指希望服务端返回json格式的数据
        success: function(data, status){
            //log('success', status);
            doneNum = data.doneNum;
            notDoneNum = data.notDoneNum;

            notDoneTodos = refreshNotDoneTodo(data.notDoneTodos, notDoneNum);
            doneTodos = refreshDoneTodo(data.doneTodos, doneNum)

            return doneNum, notDoneNum, doneTodos, notDoneTodos;
            //log('sortedTodos', sortedTodos);
            //log(doneNum,notDoneNum,doneTodos, notDoneTodos);
        },
        error: function(err) {
          log('error', err);
    }
  };
  $.ajax(request);
}

// id大的在array后面
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}



function refreshDoneTodo(todos, DoneNum) {
    $('#completed').empty();
    //改变badge的值
    finished_badge = DoneNum;
    $('#finished_badge').text(finished_badge);
    sortedTodos = sortTodo(todos);
    for(var i=0; i<sortedTodos.length;i++){
        var todo_id = sortedTodos[i].id;
        var todo_task = sortedTodos[i].task;
        var todo_created_time = sortedTodos[i].created_time;

        // log(todo_id, todo_task, todo_created_time)

        var multis = `<div class="panel panel-default row">
                    <div class="panel-body task_content" id="task_${todo_id}">
                        <form method="post" onsubmit="return updateTodo(this, '/ajax_todo/update/${todo_id}', ${todo_id} )">
                            <input class="form-control" style="background:transparent;border:0;box-shadow:0 0 0 0;"
                            type="text" name="task" value="${todo_task}" class='todo_update_input'>
                        </form>
                        <div class="delete">
                            <a href="javascript:void(0);" onclick="deleteTodo( this, '/ajax_todo/delete/${todo_id}', ${todo_id} )">
                                <button class="close delete_todo_button" type="button">
                                    <span class="glyphicon glyphicon-remove"></span>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="panel-footer small task_footer">
                        ${todo_created_time}
                         <div class="complete">
                                <a href="javascript:void(0);" onclick="uncompleteTodo(this, '/ajax_todo/uncomplete/${todo_id}', ${todo_id})">
                                <button class="btn btn-sm active" type="button" style="background:transparent;border:0;box-shadow:0 0 0 0;">
                                    <code>.unfinished</code>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
        `
        $('#completed').append(multis);
        //log('sortedTodos inside', sortedTodos[i]);
    }

    return sortedTodos;
}


function refreshNotDoneTodo(todos, notDoneNum) {
    $('#processing').empty();
    //改变badge的值
    processing_badge = notDoneNum;
    $('#processing_badge').text(processing_badge);
    sortedTodos = sortTodo(todos);
    sortedTodos.reverse();
    for(var i=0; i<sortedTodos.length;i++){
        var todo_id = sortedTodos[i].id;
        var todo_task = sortedTodos[i].task;
        var todo_created_time = sortedTodos[i].created_time;

        // log(todo_id, todo_task, todo_created_time)

        var multis = `<div class="panel panel-default row">
                    <div class="panel-body task_content" id="task_${todo_id}">
                        <form method="post" onsubmit="return updateTodo(this, '/ajax_todo/update/${todo_id}', ${todo_id} )">
                            <input class="form-control" style="background:transparent;border:0;box-shadow:0 0 0 0;"
                            type="text" name="task" value="${todo_task}" class='todo_update_input'>
                        </form>
                        <div class="delete">
                            <a href="javascript:void(0);" onclick="deleteTodo( this, '/ajax_todo/delete/${todo_id}', ${todo_id} )">
                                <button class="close delete_todo_button" type="button">
                                    <span class="glyphicon glyphicon-remove"></span>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="panel-footer small task_footer">
                        ${todo_created_time}
                        <!--
                    <div id="edit"><a href="/ajax_todo/edit/${todo_id}">修改</a></div>
                     -->
                        <div class="complete">
                                <a href="javascript:void(0);" onclick="completeTodo(this, '/ajax_todo/complete/${todo_id}', ${todo_id})">
                                <button class="btn btn-sm active" type="button" style="background:transparent;border:0;box-shadow:0 0 0 0;">
                                    <code>.finished</code>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
        `
        $('#processing').append(multis);
        //log('sortedTodos inside', sortedTodos[i]);
    }

    return sortedTodos;
}

function sortTodo(todos){
    todos.sort(compare('id'));
    return todos;
}

function ajaxAddTodo(todo_id, todo_task, todo_created_time, todo_done) {
    //改变badge的值
    processing_badge = $('#processing_badge').text();
    processing_badge++;
    $('#processing_badge').text(processing_badge);
    // 改变全局变量的值
    notDoneNum = processing_badge;
    temp = {
        'id': todo_id,
        'task': todo_task,
        'created_time': todo_created_time,
        'done': todo_done
    }
    // 加入到全局变量
    notDoneTodos.unshift(temp);
    log('ajaxAddTodo', notDoneTodos);

    //ajax添加todo
    var multis = `<div class="panel panel-default row">
                    <div class="panel-body task_content" id="task_${todo_id}">
                        <form method="post" onsubmit="return updateTodo(this, '/ajax_todo/update/${todo_id}', ${todo_id} )">
                            <input class="form-control" style="background:transparent;border:0;box-shadow:0 0 0 0;"
                            type="text" name="task" value="${todo_task}" class='todo_update_input'>
                        </form>
                        <div class="delete">
                            <a href="javascript:void(0);" onclick="deleteTodo( this, '/ajax_todo/delete/${todo_id}', ${todo_id} )">
                                <button class="close delete_todo_button" type="button">
                                    <span class="glyphicon glyphicon-remove"></span>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="panel-footer small task_footer">
                        ${todo_created_time}
                        <!--
                    <div id="edit"><a href="/ajax_todo/edit/${todo_id}">修改</a></div>
                     -->
                        <div class="complete">
                                <a href="javascript:void(0);" onclick="completeTodo(this, '/ajax_todo/complete/${todo_id}', ${todo_id})">
                                <button class="btn btn-sm active" type="button" style="background:transparent;border:0;box-shadow:0 0 0 0;">
                                    <code>.finished</code>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
        `
    $('#processing').prepend(multis);
    //强制失去焦点
    $('#ajax_form_button').blur()
    //清空输入框内容
    $('#inputTodo').val('')

    //console.log(multis)
}


function updateTodo(obj, url_todo_id, todo_id){
    var test = obj;
    // var content = obj.val();
    var content = obj.firstElementChild.value;
    // log($(obj).serialize());

    // 如果内容为空，则无法提交
    if(content==""){
        return false;
    }

    var request = {
            url: url_todo_id,
            type: 'POST',
            dataType: 'json', //  注意：这里是指希望服务端返回json格式的数据
            data: $(obj).serialize(),
            success: function(data) { // 这里的data就是json格式的数据
                  log(JSON.stringify(data));
//                s = JSON.stringify(data);
//                if (s.length > 0) {
//                    s = JSON.stringify(data);
//                    log('data',s);
//                    todo_id = data['data'][0].id;
//                    todo_task = data['data'][0].task;
//                    todo_created_time = data['data'][0].created_time;
//                    todo_done = data['data'][0].done;
//                    //alert(data['data'][0].
//                    ajaxAddTodo(todo_id, todo_task, todo_created_time,todo_done);
//                }
            },
            error: function(err) {
              log('error', err);
            }
        };
    $.ajax(request);
    // 让input失去焦点表示提交成功
    $(obj.firstElementChild).blur()
    //不提交表单
    return false;
}

//ajax删除TODO
function deleteTodo(obj, url_todo_id, todo_id){

//    console.log(todo_id);
    att_id = '#'+'task_'+ todo_id;
    theTodoDiv = $(att_id).parent();
    //找到最近的badge的span
    badgeSpan = theTodoDiv.parent().prev().children();
    var options = {
            //获得点击的delete的父级的a的href链接
            url: url_todo_id,
            type: 'GET',
            dataType: 'json', //  注意：这里是指希望服务端返回json格式的数据
            success: function(data, status) { // 这里的data就是json格式的数据
                console.log(data);
                console.log(status);
                if (data['status'].success){
                    //改变badge的值
                    processing_badge = badgeSpan.text();
                    processing_badge--;
                    badgeSpan.text(processing_badge);
                    console.log('ajax delete sucess');
                    theTodoDiv.remove();
                }
            }
        };
    $.ajax(options);
}



//ajax完成Todo
function completeTodo(obj, url_todo_id, todo_id){
    log('completeTodo',todo_id);
    //ajax 发送请求
    var request = {
        url: url_todo_id,
        type: 'get',
        //async : false,
        dataType: 'json',  // 注意：这里是指希望服务端返回json格式的数据
        success: function(data, status){
            for(var i=0;i<notDoneTodos.length;i++){
                if(notDoneTodos[i].id == todo_id){
                    finished_todo = notDoneTodos[i];
                    //log('finished_todo', finished_todo);
                    doneTodos.push(finished_todo);
                    // doneTodos = sortTodo(doneTodos); 不用sort，refresh里面已经sort了
                    notDoneTodos.splice(i,1);
                    doneNum++;
                    notDoneNum--;
                    refreshNotDoneTodo(notDoneTodos, notDoneNum);
                    refreshDoneTodo(doneTodos, doneNum);
                    break;
                }
            }
        },
        error: function(err) {
          log('error', err);
    }
  };
  $.ajax(request);
}


//ajax取消完成Todo
function uncompleteTodo(obj, url_todo_id, todo_id){
    //ajax 发送请求
    var request = {
        url: url_todo_id,
        type: 'get',
        //async : false,
        dataType: 'json',  // 注意：这里是指希望服务端返回json格式的数据
        success: function(data, status){
            for(var i=0;i<doneTodos.length;i++){
                if(doneTodos[i].id == todo_id){
                    unfinished_todo = doneTodos[i];
                    //log('finished_todo', finished_todo);
                    notDoneTodos.push(unfinished_todo);
                    // doneTodos = sortTodo(doneTodos); 不用sort，refresh里面已经sort了
                    doneTodos.splice(i,1);
                    doneNum--;
                    notDoneNum++;
                    refreshNotDoneTodo(notDoneTodos, notDoneNum);
                    refreshDoneTodo(doneTodos, doneNum);
                    break;
                }
            }
        },
        error: function(err) {
          log('error', err);
    }
  };
  $.ajax(request);
}



var bindActions = function(){
    //ajax添加todo
    $("#ajax_form_button").click(function(e) {
        //alert($("#ajax_form").serialize());
        e.preventDefault();
        var content = $('#inputTodo').val();
        log('content: ',content);

        // 如果内容为空，则无法提交
        if(content==""){
            return false;
        }

        var request = {
            url: '/ajax_todo/add',
            type: 'POST',
            dataType: 'json', //  注意：这里是指希望服务端返回json格式的数据
            data: $("#ajax_form").serialize(),
            success: function(data) { // 这里的data就是json格式的数据
                s = JSON.stringify(data);
                if (s.length > 0) {
                    s = JSON.stringify(data);
                    log('data',s);
                    todo_id = data['data'][0].id;
                    todo_task = data['data'][0].task;
                    todo_created_time = data['data'][0].created_time;
                    todo_done = data['data'][0].done;
                    //alert(data['data'][0].
                    ajaxAddTodo(todo_id, todo_task, todo_created_time,todo_done);
                }
            },
            error: function(err) {
              log('error', err);
            }
        };
        $.ajax(request);
    });


    /*
    $('.delete_todo_button').click(function() {
        //alert($("#ajax_form").serialize());
        var _this = $(this);
        var aHref =  _this.parent().attr("href");
        newTodoDiv = $(this).parent().parent().parent().parent();
        var options = {
            //获得点击的delete的父级的a的href链接
            url: aHref,
            type: 'GET',
            dataType: 'json', //  注意：这里是指希望服务端返回json格式的数据
            success: function(data, status) { // 这里的data就是json格式的数据
                console.log(data);
                console.log(status);
                if (data['status'].success){
                    //改变badge的值
                    processing_badge = $('#processing_badge').text();
                    processing_badge--;
                    $('#processing_badge').text(processing_badge);
                    console.log('ajax delete sucess');
                    newTodoDiv.remove();
                }

            }
        };
        $.ajax(options);
        return false;
    });
    */


}


var __main = function(){
  // 得到todo的所有信息
  doneNum, notDoneNum, doneTodos, notDoneTodos = getTodoInfo();
  // 给按钮绑定事件
  bindActions();

  // 默认用户可以直接输入
  $('#inputTodo').focus();
};


$(document).ready(function(){
  __main();
});