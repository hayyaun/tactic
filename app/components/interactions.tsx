"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";

const studies = {
  pathways: {
    title: "A clearer direction",
    alt: "TACTIC’s green and red marks become intersecting pathways with figures choosing a direction.",
    description:
      "Every decision opens a path. Our paired marks represent two perspectives: the possibility ahead and the lessons that help us get there. A visual exploration of clarity, choice, and moving with intent.",
  },
  strategy: {
    title: "Thinking ahead",
    alt: "A chess pawn sits within a green ring among other pieces and TACTIC brand symbols.",
    description:
      "Creativity starts with a good question. This brand exploration brings the TACTIC perspective to the chessboard: see the bigger picture, understand the possibilities, and make the next move a considered one.",
  },
  architecture: {
    title: "Built to stand apart",
    alt: "TACTIC’s opposing green and red marks form two architectural towers.",
    description:
      "An identity with substance. Our opposing forms become a small architectural world, turning a simple mark into a place for possibility. Distinctive from a distance. Considered up close.",
  },
};
type Study = keyof typeof studies;
const DialogContext = createContext<(kind: "contact" | Study) => void>(
  () => {},
);
export function ContactButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const open = useContext(DialogContext);
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      onClick={() => open("contact")}
    />
  );
}
export function StudyButton({
  study,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { study: Study }) {
  const open = useContext(DialogContext);
  return <button {...props} type="button" onClick={() => open(study)} />;
}
export function DialogProvider({ children }: { children: ReactNode }) {
  const contact = useRef<HTMLDialogElement>(null);
  const studyDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const preview = useRef<HTMLPreElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const [study, setStudy] = useState<Study>("pathways");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  useEffect(
    () => () => {
      document.body.classList.remove("modal-open");
    },
    [],
  );
  useEffect(() => {
    if (brief) copyButton.current?.focus();
  }, [brief]);
  function open(kind: "contact" | Study) {
    const active = document.activeElement;
    opener.current = active instanceof HTMLElement ? active : null;
    if (opener.current?.closest("#mobile-menu"))
      opener.current =
        document.querySelector<HTMLButtonElement>(".menu-toggle");
    if (kind !== "contact") setStudy(kind);
    (kind === "contact" ? contact : studyDialog).current?.showModal();
    document.body.classList.add("modal-open");
  }
  function closed() {
    document.body.classList.remove("modal-open");
    opener.current?.focus({ preventScroll: true });
    opener.current = null;
  }
  const dialogEvents = {
    onClose: closed,
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        event.currentTarget.close();
    },
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Project brief copied. Nothing has been sent.");
    } catch {
      if (preview.current) {
        const range = document.createRange();
        range.selectNodeContents(preview.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("Brief selected. Press Ctrl+C (or ⌘C) to copy.");
    }
  }
  return (
    <DialogContext.Provider value={open}>
      {children}
      <dialog
        ref={contact}
        className="contact-dialog"
        aria-labelledby="contact-dialog-title"
        {...dialogEvents}
      >
        <div className="dialog-heading">
          <span className="eyebrow">Your next move starts here</span>
          <button
            className="dialog-close"
            aria-label="Close project enquiry"
            onClick={() => contact.current?.close()}
          >
            ×
          </button>
        </div>
        <h2 id="contact-dialog-title">
          Let’s make
          <br />
          something <span>matter.</span>
        </h2>
        <p className="dialog-intro">
          Tell us a little about you and what you have in mind.
        </p>
        <form
          ref={form}
          id="contact-form"
          hidden={!!brief}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const field = (name: string) => String(data.get(name) ?? "").trim();
            setBrief(
              [
                "TACTIC — Project enquiry",
                "",
                `Name: ${field("name")}`,
                `Email: ${field("email")}`,
                `Interested in: ${field("service")}`,
                "",
                "About the project:",
                field("message"),
              ].join("\n"),
            );
            setStatus("");
          }}
        >
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                placeholder="Alex Morgan"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="alex@yourstudio.com"
                required
              />
            </label>
          </div>
          <label>
            What are you thinking about?
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Select a starting point
              </option>
              <option>Brand & design</option>
              <option>Web & apps</option>
              <option>AI ad films</option>
              <option>A little of everything</option>
            </select>
          </label>
          <label>
            A little about your project
            <textarea
              name="message"
              rows={3}
              placeholder="The idea, the challenge, the ambition…"
              required
            />
          </label>
          <p className="form-note">
            Prepare a project brief below. Nothing is sent.
          </p>
          <button className="submit-button" type="submit">
            Prepare project brief <span>↗</span>
          </button>
        </form>
        <div className="brief-result" id="brief-result" hidden={!brief}>
          <p className="eyebrow">
            <span className="signal-dot" /> Your starting point
          </p>
          <h3>
            A clear brief.
            <br />A good first move.
          </h3>
          <p>
            This brief is ready to copy. The studio’s contact details will be
            connected when the website goes live.
          </p>
          <pre ref={preview} id="brief-preview">
            {brief}
          </pre>
          <button
            ref={copyButton}
            className="submit-button"
            id="copy-brief"
            onClick={copy}
          >
            Copy project brief <span>↗</span>
          </button>
          <button
            className="edit-brief"
            id="edit-brief"
            onClick={() => {
              setBrief("");
              requestAnimationFrame(() =>
                form.current?.querySelector<HTMLInputElement>("input")?.focus(),
              );
            }}
          >
            Edit your brief
          </button>
          <p className="copy-status" id="copy-status" role="status">
            {status}
          </p>
        </div>
      </dialog>
      <dialog
        ref={studyDialog}
        className="study-dialog"
        aria-labelledby="study-dialog-title"
        {...dialogEvents}
      >
        <div className="study-dialog-top">
          <div>
            <p className="eyebrow">The TACTIC world / Brand exploration</p>
            <h2 id="study-dialog-title">{studies[study].title}</h2>
          </div>
          <button
            className="dialog-close"
            aria-label="Close brand study"
            onClick={() => studyDialog.current?.close()}
          >
            ×
          </button>
        </div>
        <Image
          id="study-dialog-image"
          src={`/studio/${study}.webp`}
          alt={studies[study].alt}
          width={1200}
          height={1200}
          sizes="(max-width: 700px) 100vw, 80vw"
        />
        <p id="study-dialog-description">{studies[study].description}</p>
      </dialog>
    </DialogContext.Provider>
  );
}
