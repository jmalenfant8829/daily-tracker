from werkzeug.security import generate_password_hash, check_password_hash
from tracker_api.data_access.exc import DataAccessError
import jwt
from datetime import datetime, timedelta

MIN_PASSWORD_LEN = 8
USERNAME_REQUIRED_ERR_MSG = "Username cannot be empty"
PASSWORD_REQUIRED_ERR_MSG = "Password cannot be empty"
PASSWORD_SHORT_ERR_MSG = (
    "Password must be at least " + str(MIN_PASSWORD_LEN) + " characters long"
)
JWT_ALGORITHM = "HS256"


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

    def password_correct(self, password):
        hashed_password = self.data_access.hashed_password(user=self)
        if not hashed_password:
            return False

        return check_password_hash(hashed_password, password)

    def generate_auth_token(self, secret_key, expiration=1200):
        """generate an authentication token. default expiry is 20 minutes"""
        token = jwt.encode(
            {
                "username": self.username,
                "exp": datetime.utcnow() + timedelta(seconds=expiration),
            },
            secret_key,
            algorithm=JWT_ALGORITHM,
        )
        return token

    @staticmethod
    def verify_auth_token(token, secret_key):
        """verify authentication token. None if invalid, username of user if valid"""
        try:
            payload = jwt.decode(token, secret_key, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            # expired token
            return None
        except jwt.InvalidTokenError as e:
            # invalid token
            return None
        return payload["username"]

    def save(self, password):
        """
        save user to persistent storage
        """

        if not password:
            raise ValueError(PASSWORD_REQUIRED_ERR_MSG)

        if len(password) < MIN_PASSWORD_LEN:
            raise ValueError(PASSWORD_SHORT_ERR_MSG)

        try:
            password_hash = generate_password_hash(password)
            self.data_access.add_user(user=self, password_hash=password_hash)
            self.data_access.commit()
        except DataAccessError as e:
            self.data_access.rollback()
            raise ValueError(str(e))
