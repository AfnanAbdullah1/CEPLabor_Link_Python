from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    @staticmethod
    def encrypt(password: str):
        return pwd_context.hash(password)

    @staticmethod
    def verify(plain, hashed):
        return pwd_context.verify(plain, hashed)
