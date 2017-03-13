import hashlib
import os

from . import ModelMixin
from . import db


class User(db.Model, ModelMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)
    password = db.Column(db.Text)
    # 定义一个关系
    todos = db.relationship('Todo',
                            backref='todo',
                            foreign_keys='Todo.user_id',
                            lazy='dynamic')

    def __init__(self, form):
        self.username = form.get('username', '')
        self.password = form.get('password', '')

    @classmethod
    def update(cls, id, form):
        m = cls.query.get(id)
        m.username = form.get('username', m.username)
        m.password = form.get('password', m.password)
        m.save()

    def valid_username(self):
        return User.query.filter_by(username=self.username).first() == None

    # 验证注册用户的合法性
    def valid_register(self):
        valid_username = self.valid_username()
        valid_username_len = len(self.username) >= 1
        valid_password_len = len(self.password) >= 1
        msgs = []
        if not valid_username:
            message = '用户名已经存在'
            msgs.append(message)
        if not valid_username_len:
            message = '用户名长度必须大于等于 1'
            msgs.append(message)
        if not valid_password_len:
            message = '密码长度必须大于等于 1'
            msgs.append(message)
        status = valid_username and valid_username_len and valid_password_len
        return status, msgs

    def valid_login(self):
        u = User.query.filter_by(username=self.username).first()
        print(u)
        if u is not None:
            return u.password == self.password
        else:
            return False

