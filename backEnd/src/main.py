from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import auth  # auth router

app = FastAPI(title="User Auth System")

# CORS
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

# include router
app.include_router(auth.router)
