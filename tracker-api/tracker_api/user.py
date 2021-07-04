from tracker_api.data_access.exc import DataAccessError

MIN_PASSWORD_LEN = 8
USERNAME_REQUIRED_ERR_MSG = "Username cannot be empty"
PASSWORD_REQUIRED_ERR_MSG = "Password cannot be empty"


class User:
    def __init__(self, username, data_access):
        self.username = username
        self.data_access = data_access

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        if not username:
            raise ValueError(USERNAME_REQUIRED_ERR_MSG)
        self._username = username

    def verify_password(self, password):
        hashed_password = None
        # self.data_access.add_user(username, hash_val)

    def login(self, hash):
        pass

    def save(self, password):
        """
        save user to persistent storage
        """

        if not password:
            raise ValueError(PASSWORD_REQUIRED_ERR_MSG)

        try:
            self.data_access.add_user(user=self, password_hash="secretpasswordhash")
            self.data_access.commit()
        except DataAccessError as e:
            self.data_access.rollback()
            raise ValueError(str(e))
