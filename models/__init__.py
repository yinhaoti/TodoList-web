from flask_sqlalchemy import SQLAlchemy
import time


db = SQLAlchemy()


def timestamp():
    return int(time.time())


class ModelMixin(object):
    def __repr__(self):
        """print function"""
        class_name = self.__class__.__name__
        properties = ('{0} = {1}'.format(k, v) for k, v in self.__dict__.items())
        return '<{0}: \n  {1}\n>'.format(class_name, '\n  '.join(properties))


    @classmethod
    def new(cls, form):
        m = cls(form)
        m.save()
        return m

    @classmethod
    def delete_by_ID(cls, model_id):
        m = cls.query.get(model_id)
        m.delete()

    @classmethod
    def find_by_ID(cls, model_id):
        """
        :param model_id:
        :return: cls
        """
        return cls.query.get(model_id)

    @classmethod
    def update(cls, id, form):
        m = cls.query.get(id)
        m.username = form.get('username', m.username)
        m.save()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        # self.deleted = True
        # self.save()

