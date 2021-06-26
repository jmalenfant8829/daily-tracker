from tracker_api import db

# sqlalchemy data models
class UserModel(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, nullable=False, unique=True)
    hash = db.Column(db.String(128), nullable=False)
    tasks = db.relationship('TaskModel', backref='user', lazy=True)

# a task the user works on
class TaskModel(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    __table_args__ = (
        db.UniqueConstraint('user_id', 'name'),
    )
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(64), index=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    task_times = db.relationship('DailyTaskTimeModel', backref='task', lazy=True)

# daily time spent working on a particular task
class DailyTaskTimeModel(db.Model):
    __tablename__ = 'daily_task_time'
    _table_args__ = (
        db.UniqueConstraint('task_id', 'day'),
    )

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    day = db.Column(db.Date, nullable=False)
    minutes_spent = db.Column(db.Integer, nullable=False, default=0)
    