from fastapi import FastAPI
from routes.index import registration
from routes.index import authentication
from routes.index import attendance
from routes.index import leave
from routes.index import holidays

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication, prefix="/auth", tags=["Authentication"])
app.include_router(attendance, prefix="/checkIn", tags=["Attendance"])
app.include_router(registration, prefix="/registration", tags=["Registration"])
app.include_router(leave, prefix="/leave", tags=["Leave"])
app.include_router(holidays, prefix="/holidays", tags=["Holiday"])
# app.include_router(employee, prefix="/employee", tags=["Employee"])
# app.include_router(forgotPass, prefix="/forgot-password", tags=["Forgot Password"])
# app.include_router(checkIn, prefix="/checkin", tags=["CheckIn"])
