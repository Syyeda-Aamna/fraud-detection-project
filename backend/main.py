from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fraud_detector import detect_transaction
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transaction")
def check_transaction(data: dict):

    result = detect_transaction(data)

    return {"status": result}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)  