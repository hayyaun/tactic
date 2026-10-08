import Image from "next/image";
import { ContactButton } from "./interactions";
import { CapabilityTabs } from "./capability-tabs";
export function Capabilities() {
  return (
    <section
      className="abilities shell"
      id="capabilities"
      aria-labelledby="abilities-title"
    >
      <div className="ability-heading">
        <p className="ability-kicker">01 / What we do</p>
        <h2 id="abilities-title">
          A feeling.
          <br />
          <span>A whole new world.</span>
        </h2>
        <p className="ability-introduction">
          From the first idea to the last detail, we bring your brand into
          focus. Then into the world.
        </p>
      </div>

      <CapabilityTabs
        panels={[
          <div key="0">
            <div className="ability-panel-intro">
              <h3>Distinctive by design.</h3>
              <p>
                Strategy, naming, identity and art direction. One considered
                language, wherever your brand shows up.
              </p>
              <span className="ability-index">01 / 03</span>
            </div>
            <div
              className="ability-board ability-brand-board"
              aria-label="TACTIC identity concept board"
            >
              <div className="ability-tile ability-identity">
                <svg className="ability-identity-mark" aria-hidden="true">
                  <use href="#tactic-mark" />
                </svg>
                <div>
                  <strong>TACTIC</strong>
                  <p>Every move matters.</p>
                </div>
                <span className="ability-tile-label">Identity / 01</span>
              </div>
              <div className="ability-tile ability-brand-art">
                <Image
                  src="/studio/pathways.webp"
                  alt="TACTIC’s green and red forms become intersecting pathways."
                  width={1200}
                  height={1200}
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="ability-tile-label">
                  A matter of direction
                </span>
              </div>
              <div className="ability-tile ability-poster">
                <span className="ability-small-label">
                  TACTIC / Perspective series
                </span>
                <p>
                  Good things
                  <br />
                  start with
                  <br />
                  <em>a move.</em>
                </p>
                <svg aria-hidden="true">
                  <use href="#tactic-mark" />
                </svg>
                <span className="ability-small-label">
                  Independent thinking. Shared ambition.
                </span>
              </div>
              <div
                className="ability-tile ability-stationery"
                aria-label="TACTIC business card concept in soft green and black"
              >
                <div className="ability-card ability-card-back">
                  <span>
                    Independent
                    <br />
                    creative studio.
                  </span>
                  <svg aria-hidden="true">
                    <use href="#tactic-mark" />
                  </svg>
                </div>
                <div className="ability-card ability-card-front">
                  <svg aria-hidden="true">
                    <use href="#tactic-mark" />
                  </svg>
                  <strong>TACTIC</strong>
                  <span>Every move matters.</span>
                </div>
              </div>
              <div className="ability-tile ability-type">
                <span className="ability-small-label">Type / Geist</span>
                <strong>Aa</strong>
                <span className="ability-type-sample">
                  Clear. Considered. Human.
                </span>
              </div>
              <div
                className="ability-tile ability-palette"
                aria-label="Brand palette: chalk, charcoal, soft green and muted coral"
              >
                <div className="ability-swatch ability-swatch-chalk">
                  <span>Chalk</span>
                </div>
                <div className="ability-swatch ability-swatch-carbon">
                  <span>Carbon</span>
                </div>
                <div className="ability-swatch ability-swatch-green">
                  <span>Growth</span>
                </div>
                <div className="ability-swatch ability-swatch-red">
                  <span>Feeling</span>
                </div>
              </div>
            </div>
            <p className="ability-board-note">
              TACTIC identity exploration / Studio concept
            </p>
          </div>,
          <div key="1">
            <div className="ability-panel-intro">
              <h3>Beautiful to use.</h3>
              <p>
                Websites and apps, designed and developed together. Thoughtful
                experiences that make every interaction feel effortless.
              </p>
              <span className="ability-index">02 / 03</span>
            </div>
            <div
              className="ability-board ability-digital-board"
              aria-label="Original website and app interface concepts"
            >
              <div className="ability-tile ability-desktop">
                <div className="ability-browser">
                  <div className="ability-browser-bar">
                    <span className="ability-browser-dots" aria-hidden="true">
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <span>TACTIC / Digital experience</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <div className="ability-web-page">
                    <div className="ability-web-nav">
                      <strong>FORM.</strong>
                      <span>Objects   /   Our story</span>
                      <span>Bag (0)</span>
                    </div>
                    <div className="ability-web-content">
                      <div>
                        <span className="ability-small-label">
                          An everyday collection
                        </span>
                        <p>
                          Less noise.
                          <br />
                          <em>More living.</em>
                        </p>
                        <span className="ability-mock-button">
                          Explore the collection ↗
                        </span>
                      </div>
                      <div className="ability-object-scene" aria-hidden="true">
                        <div className="ability-object-shadow"></div>
                        <div className="ability-vase"></div>
                        <div className="ability-object-pedestal"></div>
                        <span>01 — The quiet vase</span>
                      </div>
                    </div>
                    <div className="ability-web-footer">
                      <span>Objects with intention.</span>
                      <span>Made for the everyday.</span>
                    </div>
                  </div>
                </div>
                <span className="ability-tile-label">
                  Web design + development
                </span>
              </div>
              <div
                className="ability-tile ability-mobile"
                aria-label="Mobile app concept for a calm daily planning experience"
              >
                <div className="ability-phone">
                  <div className="ability-phone-top">
                    <span>9:41</span>
                    <span aria-hidden="true">•••</span>
                  </div>
                  <div className="ability-phone-content">
                    <span className="ability-small-label">
                      A little room to breathe.
                    </span>
                    <strong>
                      Your day,
                      <br />
                      in balance.
                    </strong>
                    <div className="ability-app-orbit" aria-hidden="true">
                      <span>Today</span>
                      <b>04</b>
                      <small>things that matter</small>
                    </div>
                    <div className="ability-app-task">
                      <i></i>
                      <span>
                        A fresh perspective<small>Creative time · 10:00</small>
                      </span>
                      <b>↗</b>
                    </div>
                    <div className="ability-app-task">
                      <i></i>
                      <span>
                        Make room for you<small>Afternoon walk · 16:00</small>
                      </span>
                      <b>↗</b>
                    </div>
                    <div className="ability-app-nav" aria-hidden="true">
                      <span>◉</span>
                      <span>▦</span>
                      <span>☰</span>
                    </div>
                  </div>
                </div>
                <span className="ability-tile-label">
                  App design + development
                </span>
              </div>
              <div className="ability-tile ability-digital-note">
                <svg aria-hidden="true">
                  <use href="#tactic-mark" />
                </svg>
                <p>
                  Good design
                  <br />
                  feels <em>natural.</em>
                </p>
                <span>Considered on every screen.</span>
              </div>
              <div className="ability-tile ability-components">
                <span className="ability-small-label">
                  A consistent design language
                </span>
                <div className="ability-component-samples" aria-hidden="true">
                  <span className="ability-component-pill">Discover ↗</span>
                  <span className="ability-component-circle">+</span>
                  <span className="ability-component-toggle">
                    <i></i>
                  </span>
                </div>
                <div className="ability-component-lines" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span className="ability-component-caption">
                  Thoughtful systems. Seamless details.
                </span>
              </div>
            </div>
            <p className="ability-board-note">
              FORM website + daily planning app / Studio concepts
            </p>
          </div>,
          <div key="2">
            <div className="ability-panel-intro">
              <h3>A world in a few seconds.</h3>
              <p>
                AI advertising films shaped by creative direction. From the
                first storyboard to cinematic visuals, sound and the final cut.
              </p>
              <span className="ability-index">03 / 03</span>
            </div>
            <div
              className="ability-board ability-film-board"
              aria-label="Cinematic advertising storyboard concept"
            >
              <div className="ability-tile ability-film-scene">
                <div className="ability-film-meta">
                  <span>TACTIC / Motion studies</span>
                  <span>Ad direction / Concept still</span>
                </div>
                <Image
                  className="ability-film-image"
                  src="/studio/ai-campaign.png"
                  alt="Smoked glass perfume bottle on stone, lit by sage light and a muted coral sunset in an imagined landscape."
                  width={1672}
                  height={941}
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <div className="ability-film-title">
                  <span>01 / The reveal</span>
                  <strong>
                    A moment.
                    <br />
                    <em>An entire feeling.</em>
                  </strong>
                </div>
                <div className="ability-film-bottom">
                  <span>Creative direction × AI imagination</span>
                  <span aria-hidden="true">16:9</span>
                </div>
              </div>
              <div className="ability-tile ability-storyboard ability-storyboard-light">
                <Image
                  className="ability-film-detail-image"
                  src="/studio/ai-campaign.png"
                  alt="Close detail of the perfume bottle and softly lit vapor."
                  width={1672}
                  height={941}
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="ability-small-label">
                  02 / Light & texture
                </span>
                <p>Details you can feel.</p>
              </div>
              <div className="ability-tile ability-storyboard ability-storyboard-end">
                <Image
                  className="ability-film-atmosphere-image"
                  src="/studio/ai-campaign.png"
                  alt="Muted coral sunset reflected over an imagined rocky shoreline."
                  width={1672}
                  height={941}
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
                <span className="ability-small-label">03 / The last frame</span>
                <div>
                  <strong>STILL</strong>
                  <span>A new perspective.</span>
                </div>
                <p>Leave a little wonder.</p>
              </div>
              <div className="ability-tile ability-film-process">
                <span className="ability-small-label">
                  From a thought to a feeling.
                </span>
                <div>
                  <span>Story</span>
                  <i>→</i>
                  <span>World</span>
                  <i>→</i>
                  <span>Motion</span>
                  <i>→</i>
                  <span>Sound</span>
                </div>
                <p>Human direction. New possibilities.</p>
              </div>
            </div>
            <p className="ability-board-note">
              STILL advertising direction / AI-generated concept stills
            </p>
          </div>,
        ]}
      />
      <div className="ability-section-footer">
        <p>
          Something in mind?
          <br />
          <span>Let’s give it a world.</span>
        </p>
        <ContactButton className="ability-contact" type="button">
          Start a conversation
          <svg aria-hidden="true">
            <use href="#arrow-up-right" />
          </svg>
        </ContactButton>
      </div>
    </section>
  );
}
