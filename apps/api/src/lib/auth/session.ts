"use server";

import { Admin, db } from "@repo/db";
import { randomUUID } from "crypto";

const SESSION_DURATION = 1000 * 60 * 60; // 1 hour

export async function createSession(
  adminId: number,
): Promise<{ id: string; expiresAt: Date }> {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.session.create({
    data: {
      id,
      adminId,
      expiresAt,
    },
  });

  return { id, expiresAt };
}

export async function validateSession(
  sessionId: string,
): Promise<Admin | null> {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { admin: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.admin;
}

export async function clearExpiredSessions() {
  await db.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
