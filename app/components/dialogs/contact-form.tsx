import { enquiryLimits, enquiryServices } from "../../lib/enquiry";
import { DialogActionButton } from "../dialog-controls";
import type { EnquiryFlow } from "./use-enquiry-flow";

export function ContactForm({ flow }: { flow: EnquiryFlow }) {
  const { form, brief, pending, formError, prepare } = flow;
  return (
    <form
      ref={form}
      id="contact-form"
      hidden={!!brief}
      onInput={(event) => {
        const input = event.target;
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLTextAreaElement ||
          input instanceof HTMLSelectElement
        )
          input.setCustomValidity("");
      }}
      aria-busy={pending}
      onSubmit={prepare}
    >
      <div className="grid gap-0 min-[600px]:grid-cols-[1fr_1fr] min-[600px]:gap-4.5">
        <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
          Your name
          <input
            name="name"
            disabled={pending}
            autoComplete="name"
            placeholder="Alex Morgan"
            required
            maxLength={enquiryLimits.name}
          />
        </label>
        <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
          Email address
          <input
            type="email"
            disabled={pending}
            name="email"
            autoComplete="email"
            placeholder="alex@yourstudio.com"
            required
            maxLength={enquiryLimits.email}
          />
        </label>
      </div>
      <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
        What are you thinking about?
        <select name="service" required defaultValue="" disabled={pending}>
          <option value="" disabled>
            Select a starting point
          </option>
          {enquiryServices.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </label>
      <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
        A little about your project
        <textarea
          name="message"
          disabled={pending}
          rows={3}
          placeholder="The idea, the challenge, the ambition…"
          required
          maxLength={enquiryLimits.message}
        />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {formError && (
        <p role="alert" className="mb-4 text-sm leading-relaxed text-coral">
          {formError}
        </p>
      )}
      <p className="mb-4.25 text-xs leading-relaxed text-muted">
        Prepare a project brief below. Nothing is sent.
      </p>
      <DialogActionButton type="submit" disabled={pending}>
        {pending
          ? "Preparing your brief…"
          : formError
            ? "Try preparing again"
            : "Prepare project brief"}
      </DialogActionButton>
    </form>
  );
}
