import time

from . import ModelMixin
from . import db


class Message(db.Model, ModelMixin):
    __tablename__ = 'msgs'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    username = db.Column(db.Text)
    created_time = db.Column(db.Integer)

    # 这是一个外键
    # user_id = db.Column(db.Integer, db.ForeignKey('stb_users.id'))
    # # relationship
    # reviews = db.relationship('Review', backref='chest')

    @classmethod
    def update(cls, id, form):
        m = cls.query.get(id)
        m.content = form.get('content', m.content)
        m.save()

    def __init__(self, form):
        print('chest init', form)
        self.content = form.get('content', '')
        self.username = form.get('username', '')
        self.created_time = int(time.time())

    def __repr__(self):
        return u'<Msg {} from {}>'.format(self.content, self.username)



