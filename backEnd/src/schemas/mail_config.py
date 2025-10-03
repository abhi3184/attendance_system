from pydantic import BaseModel, EmailStr
from pydantic.config import ConfigDict

class MailConfig(BaseModel):
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USERNAME: EmailStr
    MAIL_PASSWORD: str
    MAIL_USE_TLS: bool = True
    MAIL_USE_SSL: bool = False

    model_config = ConfigDict(extra="ignore")  # अनावश्यक fields ignore करेल
