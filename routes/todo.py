from models.todo import Todo
from models.user import User
from routes import *
from flask import jsonify
import routes.user

main = Blueprint('todo', __name__)

Model = Todo


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
    #print('ALLTODO', todo_list, type(todo_list))

    currentUser = routes.user.current_user()
    # if(currentUser==None):
    #     return redirect(url_for('user.register'))
    filter_todo_list = Todo.query.filter_by(user_id=currentUser.id).all()
    doneNum, notDoneNum = getDoneNumber(filter_todo_list)
    #先加Todo的放在最前面
    filter_todo_list.reverse()
    return render_template('todo/index.html', todo_list=filter_todo_list, finished_num = doneNum, unfinished_num = notDoneNum, cuurent_user= currentUser)


# 处理数据返回重定向
@main.route('/edit/<id>')
def edit(id):
    m = Model.query.get(id)
    return render_template('todo/edit.html', todo=m)


@main.route('/add', methods=['POST'])
def add():
    form = request.form
    print(form)
    currentUser = routes.user.current_user()
    Todo.new(form, currentUser.id)
    return redirect(url_for('.index'))


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