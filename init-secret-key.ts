import path from "node:path";
import fs from "fs-extra";
import md5 from "md5";

const secretKeyFile = path.join(process.cwd(), "runtime", "secret.env");

if (!fs.existsSync(secretKeyFile)) {
  const secretKey = md5(Math.random().toString());
  fs.ensureFileSync(secretKeyFile);
  fs.writeFileSync(secretKeyFile, `SESSION_SECRET=${secretKey}`);
  console.log("Initialized secret key: created");
} else {
  console.log("Initialized secret key: skipped");
}
