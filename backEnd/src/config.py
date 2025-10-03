from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .schemas.mail_config import MailConfig

# Update with your MySQL credentials
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:3184@localhost:3306/authentication"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create tables
def init_db():
    import src.models.user  # import all models
    Base.metadata.create_all(bind=engine)


from fastapi_mail import ConnectionConfig


MAIL_CONFIG = MailConfig(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USERNAME="your_email@gmail.com",
    MAIL_PASSWORD="your_app_password",
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False
)