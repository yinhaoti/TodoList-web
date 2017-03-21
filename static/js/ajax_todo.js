var test;

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




function ajaxAddTodo(todo_id, todo_task, todo_created_time) {
    //改变badge的值
    processing_badge = $('#processing_badge').text();
    processing_badge++;
    $('#processing_badge').text(processing_badge);

    //ajax添加todo
    var multis = `<div class="panel panel-default row">
                    <div class="panel-body task_content" id="task_${todo_id}">
                        <form action="/ajax_todo/update/${todo_id}" method="post">
                            <input class="form-control" style="background:transparent;border:0;box-shadow:0 0 0 0;" type="text" name="task" value="${todo_task}">
                        </form>
                        <div class="delete">
                            <a href="jacascript:;" onclick="deleteTodo( this, '/ajax_todo/delete/${todo_id}', ${todo_id} )">
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
                            <a href="/ajax_todo/complete/${todo_id}">
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




$(document).ready(function() {
//ajax添加todo
    $("#ajax_form_button").click(function() {
        //alert($("#ajax_form").serialize());
        var options = {
            url: '/ajax_todo/add',
            type: 'POST',
            dataType: 'json', //  注意：这里是指希望服务端返回json格式的数据
            data: $("#ajax_form").serialize(),
            success: function(data) { // 这里的data就是json格式的数据
                s = JSON.stringify(data);
                if (s.length > 0) {
                    s = JSON.stringify(data);
                    todo_id = data['data'][0].id;
                    todo_task = data['data'][0].task;
                    todo_created_time = data['data'][0].created_time;
                    //alert(data['data'][0].
                    ajaxAddTodo(todo_id, todo_task, todo_created_time);
                }
            }
        };
        $.ajax(options);
        return false;
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
});