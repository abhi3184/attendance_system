import bcrypt

def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())

def verify_password(plain_password: str, hashed_password: str) -> bool:
    print(f"Plain: {plain_password}")
    print(f"DB Hash: {hashed_password}")
    print("Check Result:", bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8')))
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
