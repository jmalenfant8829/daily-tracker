from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, nullable=False, unique=True)
    email = db.Column(db.String(120), index=True, nullable=False, unique=True)
    hash = db.Column(db.String(128), nullable=False)
    default_daily_target_min = db.Column(db.Integer, nullable=False, default=350)
    tasks = db.relationship('Task', backref='user', lazy=True)

    def __repr__(self):
        return self.username

# a task the user works on
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(64), index=True, nullable=False)
    db.UniqueConstraint('user_id', 'name')

# daily time spent working on a particular task
class DailyTaskTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    daily_target_minutes = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Date, nullable=False)
    minutes_spent = db.Column(db.Integer, nullable=False, default=0)
    db.UniqueConstraint('task_id', 'day')