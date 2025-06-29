// bootstrap.ts
import path from "node:path";
import fs from "fs-extra";

async function initSecretKey() {
  const secretKeyFile = path.join(process.cwd(), "runtime", "secret.env");

  if (!fs.existsSync(secretKeyFile)) {
    const secretKey = crypto.randomUUID();
    fs.ensureFileSync(secretKeyFile);
    fs.writeFileSync(secretKeyFile, `SESSION_SECRET=${secretKey}`);
    console.log("Secret key is created and saved to runtime/secret.env");
  }
}

async function seedDatabase() {}

async function main() {
  await initSecretKey();
  await seedDatabase();
}

main();
