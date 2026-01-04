import bcrypt
from passlib.context import CryptContext

# Keep passlib for backward compatibility but add bcrypt fallback
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    @staticmethod
    def encrypt(password: str):
        # Use bcrypt directly for consistent behavior
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify(plain: str, hashed: str):
        # Use bcrypt directly to avoid passlib version detection issues
        try:
            return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
        except Exception as e:
            # Fallback to passlib for old hashes
            return pwd_context.verify(plain, hashed)
