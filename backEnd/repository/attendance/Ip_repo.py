from sqlalchemy.orm import Session
from models.index import IPAddress

class IPRepo:
    def __init__(self, db: Session):
        self.db = db

    def is_ip_allowed(self, ip_address: str) -> bool:
        return (
            self.db.query(IPAddress)
            .filter(IPAddress.address == ip_address)
            .first()
            is not None
        )
