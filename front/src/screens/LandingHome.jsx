import React from "react";
import "./style.css";
import {
  UtensilsCrossed, LogIn, UserPlus, Sparkles, CalendarCheck2, Bookmark, Search,          
} from "lucide-react";

export default function LandingHome() {
  const go = (path) => (window.location.hash = path);

  const Icon = ({ as: As, size = 20, ...rest }) => (
    <As size={size} aria-hidden {...rest} />
  );

  return (
    <div className="lp-wrap">
      {/* Top bar */}
      <header className="lp-topbar">
        <div className="lp-brand" role="img" aria-label="Meal Masters">
          <Icon as={UtensilsCrossed} size={20} className="lp-logo" />
          <span className="lp-name">Meal Masters</span>
        </div>

        <nav className="lp-actions" aria-label="Primary">
          <button className="lp-link" onClick={() => go("/login")}>
            <Icon as={LogIn} size={18} style={{ marginRight: 8 }} />
            Log in
          </button>
          <button className="lp-cta" onClick={() => go("/signup")}>
            <Icon as={UserPlus} size={18} style={{ marginRight: 8 }} />
            Create account
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <h1 className="lp-h1">Plan smart. Cook happy.</h1>
        <p className="lp-sub">
          Build a week of meals in minutes. Tell us how you like to eat, pick dishes you’ll love,
          and keep everything organised in one simple planner. No spreadsheets, no guesswork —
          just dinner done.
        </p>
        <div className="lp-cta-row">
          <button className="lp-cta" onClick={() => go("/signup")}>
            <Icon as={UserPlus} size={18} style={{ marginRight: 8 }} />
            Start free
          </button>
          <button className="lp-ghost" onClick={() => go("/")}>
            Preview the feed
          </button>
        </div>
      </section>

      {}
      <section className="lp-tiles" aria-label="Why Meal Masters">
        <article className="lp-tile">
          <div className="lp-emoji" aria-hidden>
            <Icon as={Sparkles} size={22} />
          </div>
          <h3 className="lp-t">Personalised picks</h3>
          <p className="lp-d">
            Filter by diet and intolerances to see recipes that match your goals and pantry.
          </p>
        </article>

        <article className="lp-tile">
          <div className="lp-emoji" aria-hidden>
            <Icon as={CalendarCheck2} size={22} />
          </div>
          <h3 className="lp-t">Simple weekly planner</h3>
          <p className="lp-d">
            A clear 7-day layout for breakfast, lunch, and dinner. Edit anytime — your plan, your pace.
          </p>
        </article>

        <article className="lp-tile">
          <div className="lp-emoji" aria-hidden>
            <Icon as={Bookmark} size={22} />
          </div>
          <h3 className="lp-t">Save favourites</h3>
          <p className="lp-d">
            Keep go-to recipes handy and reuse them in future weeks with one tap.
          </p>
        </article>
      </section>

      {/* Search teaser */}
      <section className="lp-searchHero" aria-label="Search preview">
        <div className="lp-searchHero-inner">
          <div className="lp-searchBar" aria-hidden>
            <input
              className="lp-searchBar-input"
              placeholder="Search recipe or ingredient"
              readOnly
            />
            <button
              className="lp-searchBar-icon"
              aria-label="Search (sign in required)"
              disabled
              title="Sign in to search"
            >
              <Icon as={Search} size={18} />
            </button>
          </div>

          <div className="lp-or">OR</div>

          <div className="lp-pills" aria-hidden>
            <button className="lp-pill" disabled>
              Browse by <b>diet</b>, <b>course</b>, <b>ingredients</b> ▾
            </button>
            <button className="lp-pill" disabled>
              Add a recipe from the <b>web</b> ▾
            </button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="lp-explain">
        <h3>Built to answer “what’s for dinner?” — every day.</h3>
        <p>
          Plan a week in a clean 7-day view and save your favourites for next time. Works on laptop,
          tablet, and phone — so you can plan anywhere.
        </p>
      </section>

      {}
      <section className="lp-proof" aria-label="Highlights">
        <span>Loved by students, busy families, and meal-prep fans.</span>
        <span className="lp-dot" aria-hidden>•</span>
        <span>Fast on any device.</span>
      </section>

      {/* ===== Site Footer ===== */}
      <footer className="mm-footer">
        <div className="mm-foot-wrap">
          {/* Brand + blurb */}
          <div className="mm-foot-brand">
            <div className="mm-foot-logo" aria-hidden>
              <Icon as={UtensilsCrossed} size={20} />
            </div>
            <div>
              <div className="mm-foot-title">Meal Masters</div>
              <p className="mm-foot-blurb">
                Plan weeks in minutes. Balanced, flexible, and built for busy schedules.
              </p>
            </div>
          </div>

          {}
          <nav className="mm-foot-cols" aria-label="Footer">
            <div className="mm-foot-col">
              <div className="mm-foot-head">Product</div>
              <button className="mm-foot-link" onClick={() => go("/")}>Recipe Feed</button>
              <button className="mm-foot-link" onClick={() => go("/")}>Meal Planner</button>
              <button className="mm-foot-link" onClick={() => go("/")}>My Plan</button>
              <button className="mm-foot-link" onClick={() => go("/")}>Profile Setup</button>
            </div>

            <div className="mm-foot-col">
              <div className="mm-foot-head">Company</div>
              <button className="mm-foot-link" onClick={() => go("/about")}>About</button>
              <button className="mm-foot-link" onClick={() => go("/contact")}>Contact</button>
              <button className="mm-foot-link" onClick={() => go("/faq")}>FAQ</button>
            </div>

            <div className="mm-foot-col">
              <div className="mm-foot-head">Legal</div>
              <button className="mm-foot-link" onClick={() => go("/privacy")}>Privacy</button>
              <button className="mm-foot-link" onClick={() => go("/terms")}>Terms</button>
              <button className="mm-foot-link" onClick={() => go("/cookies")}>Cookies</button>
            </div>

            {/* Newsletter */}
            <div className="mm-foot-col mm-foot-news">
              <div className="mm-foot-head">Stay in the loop</div>
              <p className="mm-foot-note">Weekly tips & quick recipes. No spam.</p>
              <form
                className="mm-foot-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! You’re on the list.");
                }}
              >
                <input className="mm-foot-input" type="email" required placeholder="you@email.com" />
                <button className="mm-foot-btn" type="submit">Subscribe</button>
              </form>
            </div>
          </nav>
        </div>

        <hr className="mm-foot-divider" />

        {/* Bottom bar */}
        <div className="mm-foot-bottom">
          <span>© {new Date().getFullYear()} Meal Masters Pty Ltd</span>
          <div className="mm-foot-mini">
            <span>Made for students & families</span>
            <span className="mm-foot-dot" aria-hidden>•</span>
            <span>Fast on any device</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
