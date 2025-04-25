import jwt from "jsonwebtoken";
import * as sodium from "libsodium-wrappers";

export function signJwt(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });
}

export function verifyJwt(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}

export async function generateKeyPair() {
  await sodium.ready;
  return sodium.crypto_sign_keypair();
}

export async function signCommand(message: Uint8Array, secretKey: Uint8Array): Promise<Uint8Array> {
  await sodium.ready;
  return sodium.crypto_sign_detached(message, secretKey);
}

export async function verifyCommand(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
  await sodium.ready;
  return sodium.crypto_sign_verify_detached(signature, message, publicKey);
} 