
class User:

    def __init__(self, username, password_hash, data_access):
        self.username = username
        self.hash = password_hash
        self.data_access = data_access

    def verify_password(self, password):
        hashed_password = None
        #self.data_access.add_user(username, hash_val)

    def login(self, username, hash):
        pass