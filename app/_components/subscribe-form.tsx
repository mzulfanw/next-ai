"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../actions";

const initial: SubscribeState = { status: "idle", message: "" };

export function SubscribeForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(subscribe, initial);

  return (
    <form action={action} className="w-full max-w-md" noValidate>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg/70">
        Email address
      </label>
      <div className="flex flex-col gap-2 rounded-xl border border-isobar/20 bg-night/60 p-1.5 transition-colors focus-within:border-ice/60 sm:flex-row">
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
          className="min-h-11 flex-1 rounded-lg bg-transparent px-3 text-base text-fg outline-none placeholder:text-fg/35 focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-lg bg-ice px-5 font-semibold text-night transition-[background-color,box-shadow] hover:bg-white hover:shadow-[0_0_24px_rgb(111_224_255/0.5)] disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Get the forecast"}
        </button>
      </div>
      <p
        id={`${id}-msg`}
        aria-live="polite"
        className={`mt-2 min-h-5 text-sm ${state.status === "error" ? "text-plasma" : "text-fg/55"}`}
      >
        {state.message || "Free. One email each morning. Unsubscribe in one click."}
      </p>
    </form>
  );
}
