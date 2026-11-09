"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BotHeadLogo from "./BotHeadLogo";

/** Services mega-menu data — copied from the approved static build. */
const SERVICES = [
  {
    icon: "chip",
    name: "Machine Learning",
    desc: "Custom models that learn from your data and automate decisions.",
  },
  {
    icon: "nodes",
    name: "AI Technology",
    desc: "Neural networks, NLP and computer vision built for production.",
  },
  {
    icon: "bot",
    name: "AI Solutions",
    desc: "End-to-end AI products, from first prototype to deployment.",
  },
  {
    icon: "arm",
    name: "Robotic Solutions",
    desc: "Smart robots and automation for industry and service teams.",
  },
  {
    icon: "gear",
    name: "Tech Solutions",
    desc: "Cloud, IoT and software engineering for connected systems.",
  },
  {
    icon: "chart",
    name: "Data Analytics",
    desc: "Dashboards and pipelines that turn raw data into insight.",
  },
] as const;

type IconKey = (typeof SERVICES)[number]["icon"];

const ICONS: Record<IconKey | "search" | "burger" | "close" | "chev", string> = {
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.6-4.6"/></svg>',
  burger:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style="width:100%;height:100%"><path d="m5 9 7 7 7-7"/></svg>',
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="7" y="7" width="10" height="10" rx="2"/><circle cx="12" cy="12" r="2.2"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/></svg>',
  nodes:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="5.5" cy="12" r="2.3"/><circle cx="18.5" cy="5.5" r="2.3"/><circle cx="18.5" cy="18.5" r="2.3"/><path d="M7.6 10.8 16.4 6.8M7.6 13.2l8.8 4"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="4" y="8" width="16" height="11" rx="3.5"/><path d="M12 8V4.5"/><circle cx="12" cy="3.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="9" cy="13.2" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="13.2" r="1.15" fill="currentColor" stroke="none"/><path d="M9.5 16.6h5"/></svg>',
  arm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h7"/><circle cx="6" cy="16.5" r="2.2"/><path d="M7.8 15 13 9.8"/><circle cx="14.6" cy="8.2" r="2"/><path d="m16 6.6 3.4-2.4M17.2 8.4l3.8.4M15.4 5.2 14.6 2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/></svg>',
  chart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 4v16h16"/><path d="M8.5 16v-5M12.5 16V8M16.5 16v-8.5"/></svg>',
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span
      style={{ display: "inline-flex", lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

const PAGES = [
  { name: "Home", hint: "Main page" },
  { name: "About Us", hint: "Our story & team" },
  { name: "Services", hint: "All six services" },
  ...SERVICES.map((s) => ({ name: s.name, hint: "Service" })),
  { name: "Projects", hint: "Case studies" },
  { name: "Blog", hint: "Articles & news" },
  { name: "Contact", hint: "Talk to us" },
  { name: "Get a Quote", hint: "Free project quote" },
];

const SOON = "এটা ডেমো — এই পেজটা এখনো বানানো হয়নি।";

/**
 * FINAL Navbar — design 3, Minimal + Mega Menu.
 * Sticky bar, Bot Head logo, centred links, teal search circle,
 * divider, always-visible hamburger. Mobile: logo + hamburger only.
 * Side panel keeps the Get a Quote button in its footer (as approved).
 */
export default function Navbar() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelPrep, setPanelPrep] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subOpen, setSubOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const openPanel = () => {
    setPanelPrep(true);
    requestAnimationFrame(() => {
      document.body.classList.add("ui-open", "show-panel");
      setPanelOpen(true);
      setPanelPrep(false);
    });
  };

  const closeAll = () => {
    const wasPanel =
      panelOpen || document.body.classList.contains("show-panel");
    document.body.classList.remove("ui-open", "show-panel", "show-search");
    setPanelOpen(false);
    setSearchOpen(false);
    if (wasPanel) {
      setPanelPrep(true);
      setTimeout(() => setPanelPrep(false), 420);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  // GSAP entrance for the search overlay box.
  useEffect(() => {
    if (searchOpen && searchBoxRef.current) {
      gsap.fromTo(
        searchBoxRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      );
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  const hits = PAGES.filter(
    (p) => !query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const soon = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAll();
    showToast(SOON);
  };

  return (
    <>
      <header className="nav-min">
        <div className="bar">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); closeAll(); }}>
            <span className="brand-icon">
              <BotHeadLogo size={34} uid="nav" />
            </span>
            <span className="brand-word">
              VEXON<small>AI &amp; ROBOTICS</small>
            </span>
          </a>
          <ul className="nav-links">
            <li>
              <a className="nl on" href="#" onClick={(e) => { e.preventDefault(); closeAll(); }}>
                Home
              </a>
            </li>
            <li>
              <a className="nl" href="#" onClick={soon}>
                About
              </a>
            </li>
            <li
              className={`has-mega${megaOpen ? " open" : ""}`}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <a
                className="nl"
                href="#"
                aria-haspopup="true"
                onClick={(e) => {
                  e.preventDefault();
                  setMegaOpen(true);
                  setTimeout(() => setMegaOpen(false), 1600);
                }}
              >
                Services <span className="chev"><Icon name="chev" /></span>
              </a>
              <div className="mega" role="menu">
                <div className="mega-grid">
                  {SERVICES.map((s) => (
                    <a key={s.name} href="#" onClick={soon}>
                      <span className="mi"><Icon name={s.icon} /></span>
                      <span>
                        <b>{s.name}</b>
                        <span>{s.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
                <div className="mega-foot">
                  <span>Not sure what fits your project? Talk to our engineers first.</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      closeAll();
                      showToast("ডেমো: Quote-এর আসল ফর্ম পরে Contact সেকশনে বানানো হবে।");
                    }}
                  >
                    Get a Free Consultation →
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="nl" href="#projects" onClick={soon}>
                Projects
              </a>
            </li>
            <li>
              <a className="nl" href="#" onClick={soon}>
                Blog
              </a>
            </li>
            <li>
              <a className="nl" href="#" onClick={soon}>
                Contact
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <button
              className="icon-btn search-circle"
              type="button"
              aria-label="Search"
              onClick={() => {
                setSearchOpen(true);
                document.body.classList.add("show-search");
                setQuery("");
              }}
            >
              <Icon name="search" />
            </button>
            <span className="nav-div" aria-hidden="true" />
            <button
              className="icon-btn burger"
              type="button"
              aria-label="Open menu"
              onClick={openPanel}
            >
              <Icon name="burger" />
            </button>
          </div>
        </div>
      </header>

      <div className="scrim" onClick={closeAll} />

      <aside className={`m-panel${panelPrep ? " prep" : ""}`} aria-label="Menu">
        <div className="p-head">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); closeAll(); }}>
            <span className="brand-icon">
              <BotHeadLogo size={34} uid="panel" />
            </span>
            <span className="brand-word" style={{ fontSize: 18 }}>
              VEXON<small>AI &amp; ROBOTICS</small>
            </span>
          </a>
          <button className="icon-btn" type="button" aria-label="Close menu" onClick={closeAll}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          <a href="#" onClick={(e) => { e.preventDefault(); closeAll(); }}>Home</a>
          <a href="#" onClick={soon}>About</a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSubOpen((v) => !v);
            }}
          >
            Services <Icon name="chev" />
          </a>
          <div className={`p-sub${subOpen ? " open" : ""}`}>
            {SERVICES.map((s) => (
              <a key={s.name} href="#" onClick={soon}>
                {s.name}
              </a>
            ))}
          </div>
          <a href="#projects" onClick={soon}>Projects</a>
          <a href="#" onClick={soon}>Blog</a>
          <a href="#" onClick={soon}>Contact</a>
        </nav>
        <div className="p-foot">
          <button
            className="btn-quote"
            type="button"
            onClick={() => {
              closeAll();
              showToast("ডেমো: Quote-এর আসল ফর্ম পরে Contact সেকশনে বানানো হবে।");
            }}
          >
            Get a Quote
          </button>
          <p className="p-meta">
            hello@vexon.tech
            <br />
            Dhaka, Bangladesh
          </p>
        </div>
      </aside>

      <div className="search-ui" role="dialog" aria-label="Search">
        <button className="icon-btn s-close" type="button" aria-label="Close search" onClick={closeAll}>
          <Icon name="close" />
        </button>
        <div className="search-box" ref={searchBoxRef}>
          <label htmlFor="searchInput">SEARCH VEXON</label>
          <div className="s-bar">
            <span><Icon name="search" /></span>
            <input
              id="searchInput"
              ref={searchInputRef}
              type="text"
              placeholder="Search services, pages…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && hits.length > 0) {
                  closeAll();
                  showToast(SOON);
                }
              }}
            />
            <button
              className="s-go"
              type="button"
              onClick={() => {
                closeAll();
                showToast(SOON);
              }}
            >
              Search
            </button>
          </div>
          <div className="s-results">
            {hits.length === 0 ? (
              <p className="s-empty">
                “{query}” নামে কিছু পাওয়া যায়নি — “robot” বা “service” লিখে দেখো।
              </p>
            ) : (
              hits.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    closeAll();
                    showToast(SOON);
                  }}
                >
                  {p.name}
                  <span>{p.hint}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`} role="status">
        {toast}
      </div>
    </>
  );
}
