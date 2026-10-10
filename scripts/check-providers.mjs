import nextEnv from "@next/env";
import { randomUUID } from "node:crypto";
nextEnv.loadEnvConfig(process.cwd());
const mode = process.argv[2];
const timeout = () => AbortSignal.timeout(15_000);

async function checkRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token)
    throw new Error("Missing Redis REST URL or writable token");
  const key = `tactic:setup-check:${randomUUID()}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 60) end; return n",
      "1",
      key,
    ]),
    signal: timeout(),
  });
  const body = await response.json();
  console.log(
    JSON.stringify({
      provider: "Redis",
      httpStatus: response.status,
      writableCounterVerified: response.ok && body.result === 1,
      expiresInSeconds: 60,
    }),
  );
  if (!response.ok || body.result !== 1) process.exitCode = 1;
}

async function sendTestEmail() {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `tactic-setup/${randomUUID()}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: ["hayyanhami@outlook.com"],
      subject: "TACTIC — Resend setup test",
      html: "<p>Congrats on sending your <strong>first email</strong>! TACTIC’s Resend API connection is working.</p>",
    }),
    signal: timeout(),
  });
  const body = await response.json();
  console.log(
    JSON.stringify({
      provider: "Resend",
      httpStatus: response.status,
      accepted: response.ok && typeof body.id === "string",
      errorType: response.ok ? undefined : body.name,
    }),
  );
  if (!response.ok) process.exitCode = 1;
}

async function checkSentry() {
  const org = process.env.SENTRY_ORG;
  const project = process.env.SENTRY_PROJECT;
  if (!org || !project || !process.env.SENTRY_AUTH_TOKEN)
    throw new Error("Missing Sentry configuration");
  const response = await fetch(
    `https://sentry.io/api/0/projects/${encodeURIComponent(org)}/${encodeURIComponent(project)}/`,
    {
      headers: { Authorization: `Bearer ${process.env.SENTRY_AUTH_TOKEN}` },
      signal: timeout(),
    },
  );
  const body = await response.json();
  console.log(
    JSON.stringify({
      provider: "Sentry",
      httpStatus: response.status,
      projectMatches: response.ok && body.slug === project,
      note:
        response.status === 403
          ? "Build tokens may lack project-read scope; this does not prove SDK reporting is broken."
          : undefined,
    }),
  );
}

async function checkSentryIngestion() {
  const dsn = new URL(process.env.NEXT_PUBLIC_SENTRY_DSN);
  const projectId = dsn.pathname.split("/").filter(Boolean).pop();
  const eventId = randomUUID().replaceAll("-", "");
  const event = {
    event_id: eventId,
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: "error",
    environment: "setup-verification",
    exception: {
      values: [
        {
          type: "TacticSetupVerification",
          value: "Setup check — contains no enquiry or visitor data",
        },
      ],
    },
  };
  const envelope = [
    JSON.stringify({ event_id: eventId, dsn: dsn.href }),
    JSON.stringify({ type: "event" }),
    JSON.stringify(event),
  ].join("\n");
  const response = await fetch(
    `${dsn.protocol}//${dsn.host}/api/${projectId}/envelope/?sentry_key=${encodeURIComponent(dsn.username)}&sentry_version=7`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: envelope,
      signal: timeout(),
    },
  );
  console.log(
    JSON.stringify({
      provider: "Sentry",
      httpStatus: response.status,
      testEventAccepted: response.ok,
      environment: "setup-verification",
    }),
  );
  if (!response.ok) process.exitCode = 1;
}

try {
  if (mode === "--check-redis") await checkRedis();
  else if (mode === "--send-email") await sendTestEmail();
  else if (mode === "--check-sentry") await checkSentry();
  else if (mode === "--check-sentry-ingestion") await checkSentryIngestion();
  else throw new Error("Use --check-redis, --send-email, or --check-sentry");
} catch (error) {
  console.log(
    JSON.stringify({
      mode,
      error:
        error instanceof Error && error.message.startsWith("Missing")
          ? error.message
          : "Provider request failed or timed out",
    }),
  );
  process.exitCode = 1;
}
