from models.todo import Todo
from models.user import User
from routes import *
from flask import jsonify

main = Blueprint('ajax_todo', __name__)

Model = Todo

def current_user():
    username = session.get('username', '')
    if (username != ''):
        currentUser = User.query.filter_by(username=username).first()
        print('loginUseris', currentUser)
        return currentUser
    else:
        print('not login,use userID=1')
        # print(User.query.filter_by(id=1).first())
        if(User.query.filter_by(id=1).first()==None):
            return None
        return User.query.filter_by(id=1).first()

def getDoneNumber(todo_list):
    doneNum = 0
    notDoneNum = 0
    for todo in todo_list:
        print('in for', todo)
        if(todo.done == 'True'):
            doneNum += 1
            print(doneNum)
        else:
            notDoneNum += 1
            print(notDoneNum)
    return doneNum, notDoneNum



@main.route('/')
def index():
    todo_list = Model.query.all()
    todo_finished_num = Model.sizeof('done')
    todo_unfinished_num = Model.sizeof('notdone')
    print('ALLTODO', todo_list, type(todo_list))

    currentUser = current_user()
    if(currentUser==None):
        return redirect(url_for('user.register'))
    filter_todo_list = Todo.query.filter_by(user_id=currentUser.id).all()
    #user_todo_finished_num = filter_todo_list.sizeof('done')
    #user_todo_unfinished_num = filter_todo_list.sizeof('notdone')
    doneNum, notDoneNum = getDoneNumber(filter_todo_list)
    print('filterTODO', filter_todo_list, type(filter_todo_list))
    print(doneNum, notDoneNum)
    return render_template('todo/ajax_index.html', todo_list=filter_todo_list, finished_num = doneNum, unfinished_num = notDoneNum)


# 处理数据返回重定向
@main.route('/edit/<id>')
def edit(id):
    m = Model.query.get(id)
    return render_template('todo/edit.html', todo=m)


@main.route('/add', methods=['POST'])
def ajax_add():
    form = request.form
    print(form)
    currentUser = current_user()
    newTodo = Todo.new(form, currentUser.id)
    data = {
        "data": [
            {
                "id": newTodo.id,
                "task": newTodo.task,
                "created_time": newTodo.created_time
            }
        ],
        "status": {
            "code": 200,
            "message": "ajax post success."
        }
    }

    return jsonify(data)

@main.route('/update/<id>', methods=['POST'])
def update(id):
    form = request.form
    Model.update(id, form)
    return redirect(url_for('.index'))


@main.route('/delete/<int:id>')
def delete(id):
    Model.delete_by_ID(id)
    return redirect(url_for('.index'))

@main.route('/complete/<int:id>')
def complete(id):
    Model.complete(id)
    return redirect(url_for('.index'))

@main.route('/uncomplete/<int:id>')
def undo_complete(id):
    Model.undo_complete(id)
    return redirect(url_for('.index'))