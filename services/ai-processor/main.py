import os
import json
import asyncio
import httpx # type: ignore
from fluvio import Fluvio # type: ignore
from fastapi import FastAPI # type: ignore

app = FastAPI()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
FLUVIO_ADDR = os.getenv("FLUVIO_ADDR", "localhost:9003")

async def classify_log(log_line: str):
    prompt = (
        f"Given the log entry:\n```\n{log_line}\n```\n"
        "Return a JSON object with keys summary, severity (low/medium/high), and suggested_playbook."
    )
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    async with httpx.AsyncClient() as client:
        resp = await client.post("https://api.groq.dev/v1/query", json={"prompt": prompt}, headers=headers)
        data = resp.json()
    return data.get("summary"), data.get("severity"), data.get("suggested_playbook")

async def process_stream():
    fluvio = await Fluvio.connect(address=FLUVIO_ADDR)
    consumer = await fluvio.partition_consumer("raw-logs", 0)
    producer = await fluvio.topic_producer("alerts")
    async for record in consumer.stream():
        line = record.value.decode()
        summary, severity, playbook = await classify_log(line)
        alert = {
            "type": "ai_alert",
            "payload": {
                "summary": summary,
                "severity": severity,
                "suggested_playbook": playbook,
                "timestamp": record.timestamp
            }
        }
        await producer.send(0, json.dumps(alert).encode())
        print(f"Produced alert: {alert}")

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(process_stream())

@app.get("/health")
async def health():
    return {"status": "ok"} 