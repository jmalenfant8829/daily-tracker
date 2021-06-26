
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

    def record_work_time(self, work):
        self.data_access.record_work_time(work)

    def work_week(self, year, week):
        return self.data_access.work_week(year, week)


class Task:
    """
    A task user can log time on.
    May be active (currently on the user's timetable), or inactive (not currently on the timetable)
    """
    def __init__(self, name, active, user) -> None:
        self.name = name
        self.active = active
        self.user = user
