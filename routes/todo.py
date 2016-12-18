from models.todo import Todo
from routes import *


main = Blueprint('todo', __name__)

Model = Todo

@main.route('/')
def index():
    ms = Model.query.all()
    return render_template('todo/index.html', todo_list=ms)


# 处理数据返回重定向
@main.route('/edit/<id>')
def edit(id):
    m = Model.query.get(id)
    return render_template('todo/edit.html', todo=m)


@main.route('/add', methods=['POST'])
def add():
    form = request.form
    Model.new(form)
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
