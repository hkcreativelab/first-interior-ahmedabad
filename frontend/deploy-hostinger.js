#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ftp from 'basic-ftp';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASS = process.env.FTP_PASS;
const FTP_REMOTE_PATH = process.env.FTP_REMOTE_PATH || '/public_html';
const LOCAL_DIR = path.join(__dirname, 'dist-hostinger');

function exitWith(msg) {
  console.error(msg);
  process.exit(1);
}

if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
  exitWith('Please set FTP_HOST, FTP_USER and FTP_PASS in environment or .env file.');
}

if (!fs.existsSync(LOCAL_DIR)) {
  exitWith(`Local build directory not found: ${LOCAL_DIR}. Run 'npm run build:hostinger' first.`);
}

async function uploadDir(client, localDir, remoteDir) {
  await client.ensureDir(remoteDir);
  const items = fs.readdirSync(localDir, { withFileTypes: true });

  for (const it of items) {
    const localPath = path.join(localDir, it.name);
    const remotePath = `${remoteDir}/${it.name}`.replace(/\\/g, '/');

    if (it.isDirectory()) {
      await uploadDir(client, localPath, remotePath);
    } else if (it.isFile()) {
      await client.uploadFrom(localPath, remotePath);
      console.log(`Uploaded ${localPath} -> ${remotePath}`);
    }
  }
}

(async () => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    console.log(`Connecting to ${FTP_HOST}...`);
    await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false, port: 21 });
    console.log(`Uploading ${LOCAL_DIR} to ${FTP_HOST}:${FTP_REMOTE_PATH} ...`);
    await uploadDir(client, LOCAL_DIR, FTP_REMOTE_PATH);
    console.log('Upload complete.');
  } catch (err) {
    console.error('Upload failed:', err);
    process.exitCode = 1;
  } finally {
    client.close();
  }
})();
