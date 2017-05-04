from models.todo import Todo
from models.user import User
from routes import *
from flask import jsonify
import routes.user

main = Blueprint('ajax_todo', __name__)

Model = Todo

def getDoneTodo(todo_list):
    doneNum = 0
    notDoneNum = 0
    doneTodo = []
    notDoneTodo = []
    for todo in todo_list:
        #print('in for', todo)
        dict_todo = {
            'done': todo.done,
            'task': todo.task,
            'created_time': todo.created_time,
            'id': todo.id
        }
        if(todo.done == 'True'):
            doneNum += 1
            #print(doneNum)
            doneTodo.append(dict_todo)
        else:
            notDoneNum += 1
            notDoneTodo.append(dict_todo)
            #print(notDoneNum)
    return doneNum, notDoneNum, doneTodo, notDoneTodo



@main.route('/')
def index():
    #print(url_for('ajax_todo.ajax_add'))

    todo_list = Model.query.all()
    todo_finished_num = Model.sizeof('done')
    todo_unfinished_num = Model.sizeof('notdone')
    # print('ALLTODO', todo_list, type(todo_list))

    currentUser = routes.user.current_user()
    if(currentUser==None):
        return redirect(url_for('user.register'))
    filter_todo_list = Todo.query.filter_by(user_id=currentUser.id).all()
    #user_todo_finished_num = filter_todo_list.sizeof('done')
    #user_todo_unfinished_num = filter_todo_list.sizeof('notdone')
    doneNum, notDoneNum, doneTodo, notDoneTodo = getDoneTodo(filter_todo_list)
    filter_todo_list.reverse()
    print('filterTODO', filter_todo_list, type(filter_todo_list))
    #print(doneNum, notDoneNum)
    return render_template('todo/ajax_index.html', todo_list=filter_todo_list, finished_num = doneNum, unfinished_num = notDoneNum, cuurent_user= currentUser)



@main.route('/getInfo', methods=['POST'])
def getInfo():

    currentUser = routes.user.current_user()
    if(currentUser==None):
        return redirect(url_for('user.register'))
    filter_todo_list = Todo.query.filter_by(user_id=currentUser.id).all()

    doneNum, notDoneNum, doneTodos, notDoneTodos = getDoneTodo(filter_todo_list)

    print(doneTodos)

    todo = {
        'doneNum': doneNum,
        'notDoneNum': notDoneNum,
        'doneTodos': doneTodos,
        'notDoneTodos': notDoneTodos
    }

    # filter_todo_list.reverse()
    # print('filterTODO', filter_todo_list, type(filter_todo_list))

    return jsonify(todo)


# 处理数据返回重定向
@main.route('/edit/<id>', methods=['POST'])
def edit(id):
    m = Model.query.get(id)
    return render_template('todo/edit.html', todo=m)


@main.route('/add', methods=['POST'])
def add():
    form = request.form
    print(form)
    currentUser = routes.user.current_user()
    newTodo = Todo.new(form, currentUser.id)
    data = {
        "data": [
            {
                "id": newTodo.id,
                "task": newTodo.task,
                "created_time": newTodo.created_time,
                "done": newTodo.done
            }
        ],
        "status": {
            "success": True,
            "code": 200,
            "message": "ajax post success."
        }
    }

    return jsonify(data)

@main.route('/update/<id>', methods=['POST'])
def update(id):
    form = request.form
    # print('update', form.get('task'))
    Model.update(id, form)
    data = {
        "status":
            {
                "success": True,
                "code": 200,
                "message": "ajax update success."
            }
    }
    return jsonify(data)


@main.route('/delete/<int:id>')
def delete(id):
    Model.delete_by_ID(id)
    data = {
        "status":
            {
            "success": True,
            "code": 200,
            "message": "ajax delete success."
        }
    }

    return jsonify(data)

@main.route('/complete/<int:id>')
def complete(id):
    Model.complete(id)
    data = {
        "status":
            {
                "success": True,
                "code": 200,
                "message": "ajax complete(id:{}) success.".format(id)
            }
    }

    return jsonify(data)

@main.route('/uncomplete/<int:id>')
def undo_complete(id):
    Model.undo_complete(id)
    data = {
        "status":
            {
                "success": True,
                "code": 200,
                "message": "ajax uncomplete(id:{}) success.".format(id)
            }
    }
    return jsonify(data)