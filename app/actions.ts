"use server";

export type SubscribeState = { status: "idle" | "ok" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL.test(email)) {
    return { status: "error", message: "That email address looks incomplete. Check it and try again." };
  }

  // TODO: persist to your mailing list provider (Resend, Loops, etc.)

  return {
    status: "ok",
    message: "You’re on the list. Your first forecast arrives tomorrow at 07:00 UTC.",
  };
}
