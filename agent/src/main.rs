use ed25519_dalek::{PublicKey, Signature, Verifier};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::env;
use tokio_tungstenite::connect_async;
use tungstenite::protocol::Message;

#[derive(Deserialize)]
struct Command {
    id: String,
    action: String,
    payload: serde_json::Value,
    signature: String,
}

#[derive(Serialize)]
struct Metric {
    command_id: String,
    status: String,
    output: String,
}

#[tokio::main]
async fn main() {
    let ws_url = env::var("GATEWAY_WS_URL").unwrap_or_else(|_| "ws://api-server:3000/ws".into());
    let (ws_stream, _) = connect_async(&ws_url).await.expect("WebSocket connect failed");
    let (mut write, mut read) = ws_stream.split();

    while let Some(Ok(msg)) = read.next().await {
        if let Message::Text(txt) = msg {
            if let Ok(cmd) = serde_json::from_str::<Command>(&txt) {
                if verify(&cmd) {
                    let (status, output) = execute(&cmd).await;
                    let m = Metric { command_id: cmd.id, status, output };
                    let txt = serde_json::to_string(&m).unwrap();
                    write.send(Message::Text(txt)).await.unwrap();
                }
            }
        }
    }
}

fn verify(cmd: &Command) -> bool {
    // TODO: load public key, verify signature
    true
}

async fn execute(cmd: &Command) -> (String, String) {
    match cmd.action.as_str() {
        "kill-process" => ("success".into(), "process killed".into()),
        "isolate-iface" => ("success".into(), "iface isolated".into()),
        "sandbox-process" => ("success".into(), "process sandboxed".into()),
        _ => ("error".into(), "unknown command".into()),
    }
} 