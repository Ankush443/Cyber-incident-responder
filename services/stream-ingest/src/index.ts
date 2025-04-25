import Fluvio from "@fluvio/client";

async function main() {
  const fluvio = await Fluvio.connect();
  const producer = await fluvio.topicProducer("raw-logs");
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    await producer.sendRecord(chunk.trim(), 0);
    console.log(`> Produced raw-log: ${chunk.trim()}`);
  }
}

main().catch((e) => {
  console.error("Error in stream-ingest:", e);
  process.exit(1);
}); 