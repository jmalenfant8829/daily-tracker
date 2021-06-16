
class Timetable:
    """
    
    """
    def __init__(self, user, data_access):
        self.user = user
        self.data_access = data_access

    def add_task(self, name):
        self.data_access.add_task(name)

    def record_work_time(self, work):
        self.data_access.record_work_time(work)

    def work_week(self, year, week):
        return self.data_access.work_week(year, week)
