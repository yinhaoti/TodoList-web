import hashlib
import os

from . import ModelMixin
from . import db


class User(db.Model, ModelMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)

    def __init__(self, form):
        self.username = form.get('username', '')

    @classmethod
    def update(cls, id, form):
        m = cls.query.get(id)
        m.username = form.get('username', m.username)
        m.save()

    def valid_username(self, username):
        return User.query.filter_by(username=self.username).first() == None

    # 验证注册用户的合法性
    def valid(self):
        valid_username = self.valid_username()
        valid_username_len = len(self.username) >= 6
        valid_password_len = len(self.password) >= 6
        msgs = []
        if not valid_username:
            message = '用户名已经存在'
            msgs.append(message)
        if not valid_username_len:
            message = '用户名长度必须大于等于 6'
            msgs.append(message)
        if not valid_password_len:
            message = '密码长度必须大于等于 6'
            msgs.append(message)
        status = valid_username and valid_username_len and valid_password_len
        return status, msgs
