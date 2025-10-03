from requests import Session
from models.index import ipAddress
from fastapi import APIRouter, Depends, HTTPException, Body
from repository.index import employeeCheckInRepo


class employeeCheckInService:

    @staticmethod
    def checkAllowedIp(db: Session,ip):
        result = employeeCheckInRepo.getAllowedIp(db,ip)
        return result