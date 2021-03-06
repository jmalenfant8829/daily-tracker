import datetime
from tracker_api.data_access.exc import DataAccessError


class Timetable:
    """
    Represents a work log that users can record time on for various custom tasks
    """

    def __init__(self, user, data_access) -> None:
        self.user = user
        self.data_access = data_access

    def add_task(self, name):
        task = Task(name=name, active=True, user=self.user)
        self.data_access.add_task(task)
        self.data_access.commit()

    def record_work_time(self, work):
        """
        Records time spent on tasks as long as input is valid
        """
        # before saving, validate work dict is in correct format (tasks -> date, time spent)
        try:
            for task_name, task_times in work.items():
                for task_time in task_times:
                    if task_time["minutes_spent"] < 0:
                        raise ValueError("Minutes spent cannot be negative")
                    date = task_time["date"]
        except (KeyError, TypeError, AttributeError):
            raise ValueError("Work time input is not formatted properly")

        self.data_access.record_work_time(user=self.user, work=work)
        self.data_access.commit()

    def work_week(self, day):
        """retrieves time entries for a week of work, starting from the given day"""
        return self.data_access.work_week(user=self.user, start=day)

    def tasks(self):
        """retrieves all tasks that belong to the timetable's user"""
        return self.data_access.tasks(user=self.user)

    def modify_task(self, task):
        """modifies a task"""
        try:
            self.data_access.modify_task(task=task)
        except DataAccessError as e:
            raise ValueError(str(e))

        self.data_access.commit()


class Task:
    """
    A task user can log time on.
    May be active (appears on the user's timetable), or inactive (not currently on the timetable)
    """

    def __init__(self, name, active, user) -> None:
        self.name = name
        self.active = active
        self.user = user

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, name):
        if not name:
            raise ValueError("Task name cannot be empty")
        self._name = name
