import time

from . import ModelMixin
from . import db


class Todo(db.Model, ModelMixin):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.Text)
    created_time = db.Column(db.Integer)
    updated_time = db.Column(db.Integer)
    finished = db.Column(db.Text)

    # 这是一个外键
    # user_id = db.Column(db.Integer, db.ForeignKey('stb_users.id'))
    # # relationship
    # reviews = db.relationship('Review', backref='chest')

    def __init__(self, form):
        print('chest init', form)
        self.task = form.get('task', '')
        self.created_time = int(time.time())
        self.finished = "False"


    @classmethod
    def complete(cls, id):
        m = cls.find_by_ID(id)
        m.finished = "True"
        m.save()

    @classmethod
    def undo_complete(cls, id):
        m = cls.find_by_ID(id)
        m.finished = "False"
        m.save()

    @classmethod
    def update(cls, id, form):
        m = cls.query.get(id)
        m.task = form.get('task', m.task)
        m.save()

    @classmethod
    def sizeof(cls, filter):
        ms = cls.query.all()
        counter = 0

        if filter == 'unfinished':
            filter = 'False'
        else:
            filter = 'True'

        for item in ms:
            # print(item.finished, filter)
            if item.finished == filter:
                counter += 1
        return counter


