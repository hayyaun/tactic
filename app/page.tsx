import Image from "next/image";
import Link from "next/link";
import { ContactButton, StudyButton } from "./components/interactions";
import { DialogProvider } from "./components/interactions";
import { Header } from "./components/header";
import { Capabilities } from "./components/capabilities";
import { HeroArt } from "./components/hero-art";
export default function Home() {
  return (
    <DialogProvider>
      <svg
        className="svg-definitions"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <symbol id="tactic-mark" viewBox="0 0 40 55">
          <path d="M1 9 8 0 24 13 31 4 40 11 26 29Z" fill="currentColor"></path>
          <path
            d="M1 43 15 26 40 46 33 55 17 42 10 51Z"
            fill="currentColor"
          ></path>
        </symbol>
        <symbol id="arrow-up-right" viewBox="0 0 24 24">
          <path
            d="M5 19 19 5M5 5h14v14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          ></path>
        </symbol>
      </svg>

      <Link className="skip-link" href="#main">
        Skip to content
      </Link>
      <Header />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-signature" aria-label="TACTIC creative studio">
            <span>TACTIC</span>
            <span>Independent minds. Shared direction.</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Strategy. Design. Technology.</p>
            <h1 id="hero-title">
              Make your next
              <br />
              <span className="last-word">
                move matter<span className="green-period">.</span>
              </span>
            </h1>
            <p className="hero-description">
              Distinctive brands. Thoughtful experiences.
              <br />A little imagination. A clear direction.
            </p>
            <Link className="hero-cta" href="#capabilities">
              Discover what we do <span>↗</span>
            </Link>
          </div>

          <HeroArt />
          <div className="hero-footer">
            <Link href="#capabilities" aria-label="Scroll to what we do">
              A little further <span>↓</span>
            </Link>
          </div>
        </section>

        <Capabilities />

        <section
          className="world shell section-space"
          id="world"
          aria-labelledby="world-title"
        >
          <div className="section-kicker">
            <span>02 / The TACTIC world</span>
            <span>Thinking, made visible.</span>
          </div>
          <div className="section-heading">
            <h2 id="world-title">
              A point of view.
              <br />
              <span className="muted">Made visible.</span>
            </h2>
            <p>
              A glimpse into how we see things.
              <br />
              Purposeful ideas. Unexpected perspectives.
              <br />
              Always a clear direction.
            </p>
          </div>
          <div className="studies-grid">
            <StudyButton
              className="study"
              aria-label="View A clearer direction brand study"
              study="pathways"
            >
              <div className="study-image">
                <Image
                  src="/studio/pathways.webp"
                  width={1200}
                  height={1200}
                  alt="TACTIC’s green and red marks become intersecting pathways with figures choosing a direction."
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="study-open">↗</span>
              </div>
              <div className="study-caption">
                <h3>A clearer direction</h3>
                <span>01 / Perspective</span>
              </div>
            </StudyButton>
            <StudyButton
              className="study"
              aria-label="View Thinking ahead brand study"
              study="strategy"
            >
              <div className="study-image">
                <Image
                  src="/studio/strategy.webp"
                  width={1200}
                  height={1200}
                  alt="A chess pawn sits within a green ring among other pieces and TACTIC brand symbols."
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="study-open">↗</span>
              </div>
              <div className="study-caption">
                <h3>Thinking ahead</h3>
                <span>02 / Strategy</span>
              </div>
            </StudyButton>
            <StudyButton
              className="study"
              aria-label="View Built to stand apart brand study"
              study="architecture"
            >
              <div className="study-image">
                <Image
                  src="/studio/architecture.webp"
                  width={900}
                  height={900}
                  alt="TACTIC’s opposing green and red marks form two architectural towers."
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="study-open">↗</span>
              </div>
              <div className="study-caption">
                <h3>Built to stand apart</h3>
                <span>03 / Identity</span>
              </div>
            </StudyButton>
          </div>
          <p className="world-note">
            <span className="signal-dot"></span> An exploration of our own
            identity. A reflection of our approach.
          </p>
        </section>

        <section
          className="studio section-space"
          id="studio"
          aria-labelledby="studio-title"
        >
          <div className="shell">
            <div className="section-kicker">
              <span>03 / The studio</span>
              <svg className="small-mark" aria-hidden="true">
                <use href="#tactic-mark" />
              </svg>
            </div>
            <div className="studio-grid">
              <h2 id="studio-title">
                Good instinct.
                <br />
                <span className="muted">Clear intent.</span>
              </h2>
              <div className="studio-copy">
                <p className="studio-lead">
                  We’re TACTIC. A creative studio for ambitious people with
                  somewhere to go.
                </p>
                <p>
                  We connect strategy, identity and digital design to help ideas
                  find their strongest form. Curious by nature and considered in
                  our craft, we ask better questions, look a little closer, and
                  make every detail count.
                </p>
                <Link className="text-link" href="#capabilities">
                  Meet our approach <span className="circle-arrow">↘</span>
                </Link>
              </div>
            </div>
            <div className="principles">
              <div>
                <span>01</span>
                <h3>Think clearly.</h3>
                <p>
                  Find what matters. Give the idea a purpose before giving it a
                  form.
                </p>
              </div>
              <div>
                <span>02</span>
                <h3>Make it distinct.</h3>
                <p>
                  Bring a fresh perspective. Build something that could only be
                  yours.
                </p>
              </div>
              <div>
                <span>03</span>
                <h3>Move together.</h3>
                <p>
                  Keep the conversation open. Turn shared ambition into a clear
                  next step.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="contact-section shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-kicker">
            <span>04 / Your next move</span>
            <span className="contact-status">
              <span className="signal-dot"></span> Let’s make something matter.
            </span>
          </div>
          <div className="contact-heading">
            <h2 id="contact-title">
              A good project starts
              <br />
              with a <span>conversation.</span>
            </h2>
            <ContactButton
              className="contact-orb"
              aria-label="Start a project enquiry"
            >
              <svg aria-hidden="true">
                <use href="#arrow-up-right" />
              </svg>
            </ContactButton>
          </div>
          <div className="contact-bottom">
            <p>
              Have a challenge, an idea, or a curious question?
              <br />
              We’d love to hear what’s on your mind.
            </p>
            <ContactButton className="text-link">
              Tell us what you’re building <span>↗</span>
            </ContactButton>
          </div>
        </section>
      </main>

      <footer className="site-footer shell">
        <Link
          className="footer-wordmark"
          href="#top"
          aria-label="TACTIC — back to top"
        >
          TACTIC
        </Link>
        <div className="footer-meta">
          <span>Independent minds. Collective ambition.</span>
          <span>
            © <span id="year">2026</span> TACTIC Studio
          </span>
          <Link href="#top">Back to top ↑</Link>
        </div>
      </footer>
    </DialogProvider>
  );
}
