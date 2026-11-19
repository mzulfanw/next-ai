"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../actions";

const initial: SubscribeState = { status: "idle", message: "" };

export function SubscribeForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(subscribe, initial);

  return (
    <form action={action} className="w-full max-w-md" noValidate>
      <label htmlFor={id} className="hand mb-2 block text-base">
        your email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="you@example.com"
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={`${id}-msg`}
          className="sketch min-h-12 flex-1 bg-paper px-4 text-base outline-none placeholder:text-ink/40 focus-visible:border-pen"
        />
        <button
          type="submit"
          disabled={pending}
          className="sketch-alt press min-h-12 bg-marker px-5 font-bold disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Get the forecast"}
        </button>
      </div>
      <p
        id={`${id}-msg`}
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${state.status === "error" ? "font-semibold text-redpen" : "text-ink/65"}`}
      >
        {state.message || "Free. One email each morning. Unsubscribe in one click."}
      </p>
    </form>
  );
}
