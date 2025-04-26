import os
import json
import asyncio
import httpx # type: ignore
from fluvio import Fluvio, FluvioConfig # type: ignore
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
    try:
        # Create explicit configuration for Fluvio
        config = FluvioConfig.new()
        config.set_socket(FLUVIO_ADDR)
        
        # Connect with explicit configuration
        fluvio = await Fluvio.connect_with_config(config)
        
        consumer = await fluvio.partition_consumer("raw-logs", 0)
        producer = await fluvio.topic_producer("alerts")
        print(f"Connected to Fluvio at {FLUVIO_ADDR}")
        
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
    except Exception as e:
        print(f"Error in process_stream: {str(e)}")
        # Wait and retry after a delay
        await asyncio.sleep(5)
        asyncio.create_task(process_stream())  # Recreate the task to retry

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(process_stream())

@app.get("/health")
async def health():
    return {"status": "ok"} 