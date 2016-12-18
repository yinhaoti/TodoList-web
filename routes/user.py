from models.user import User
from routes import *


main = Blueprint('user', __name__)

Model = User

xfrs_dict = {
}

def random_string():
    import uuid
    return str(uuid.uuid4())

@main.route('/')
def index():
    ms = Model.query.all()
    xfrs = random_string()
    xfrs_dict[xfrs] = 0
    return render_template('user/index.html',xfrs=xfrs, user_list=ms)



@main.route('/edit/<id>')
def edit(id):
    m = Model.query.get(id)
    return render_template('user/edit.html', user=m)

# 处理数据返回重定向
@main.route('/add', methods=['POST'])
def add():
    form = request.form
    xfrs = form.get('xfrs')

    if xfrs in xfrs_dict:
        xfrs_dict.pop(xfrs)
        Model.new(form)
        return redirect(url_for('.index'))
    else:
        return 'ERROR 非法链接'


@main.route('/update/<id>', methods=['POST'])
def update(id):
    form = request.form
    Model.update(id, form)
    return redirect(url_for('.index'))


@main.route('/delete/<int:id>')
def delete(id):
    r = request.args
    xfrs = r.get('code')
    if xfrs in xfrs_dict:
        xfrs_dict.pop(xfrs)
        Model.delete_by_ID(id)
        return redirect(url_for('.index'))
    else:
        return 'ERROR 非法链接'
