"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Globe2, Mail, Menu, Send, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: new (options: Record<string, unknown>, elementId: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

const nav = [
  ["/sunshotaiprelaunch/about", "About SunShot"], ["/sunshotaiprelaunch/features", "Features"], ["/sunshotaiprelaunch/vision", "Vision"],
  ["/sunshotaiprelaunch/launch", "Launch"], ["/sunshotaiprelaunch/contact", "Contact"],
] as const;

const languages = [
  ["en", "English"], ["bn", "বাংলা"], ["hi", "हिन्दी"], ["ur", "اردو"],
  ["ar", "العربية"], ["zh-CN", "中文"], ["es", "Español"], ["fr", "Français"],
  ["de", "Deutsch"], ["it", "Italiano"], ["pt", "Português"], ["ru", "Русский"],
  ["ja", "日本語"], ["ko", "한국어"], ["tr", "Türkçe"], ["nl", "Nederlands"],
  ["pl", "Polski"], ["id", "Bahasa Indonesia"], ["ms", "Bahasa Melayu"], ["ta", "தமிழ்"],
  ["te", "తెలుగు"], ["pa", "ਪੰਜਾਬੀ"], ["fa", "فارسی"], ["ne", "नेपाली"],
] as const;

function Brand() {
  return <a href="/sunshotaiprelaunch" className="brand notranslate" translate="no" aria-label="Sunshot AI home"><span><img src="/sunshotaiprelaunch/sunshot-logo.jpg" alt="" /></span><strong>Sunshot<span>AI</span></strong></a>;
}

function LanguageSelector({ language, onChange }: { language: string; onChange: (value: string) => void }) {
  return <div className="language-select notranslate" translate="no"><Globe2 aria-hidden="true" /><Select value={language} onValueChange={onChange}><SelectTrigger aria-label="Choose website language"><SelectValue /></SelectTrigger><SelectContent position="popper" className="language-menu">{languages.map(([code, label]) => <SelectItem value={code} key={code}>{label}</SelectItem>)}</SelectContent></Select></div>;
}

export function WaitlistForm({ compact = false, source = "website" }: { compact?: boolean; source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault(); setState("loading"); setMessage("");
    try {
      const response = await fetch("/sunshotaiprelaunch/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source }) });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to join right now.");
      setState("success"); setMessage(data.message || "You’re on the waitlist."); setEmail("");
    } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "Please try again."); }
  }

  return <div className={`waitlist ${compact ? "compact" : ""}`}><form onSubmit={submit}><Mail aria-hidden="true" /><label className="sr-only" htmlFor={`waitlist-${source}`}>Email address</label><input id={`waitlist-${source}`} type="email" required autoComplete="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button disabled={state === "loading"}>{state === "loading" ? "Joining…" : "Join Waitlist"}<ArrowRight /></button></form>{message && <p className={state}><Check />{message}</p>}</div>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-grid"><div><Brand /><p>ENGINEERED IN BANGLADESH.<br />BUILT FOR THE FUTURE.</p></div><div className="footer-links"><strong>Quick Links</strong>{nav.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div><div className="footer-links"><strong>Follow Us</strong><a href="https://www.linkedin.com/in/nafiul-al-nahid" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://www.facebook.com/lexglobalbd/" target="_blank" rel="noreferrer">Facebook</a><a href="mailto:nafiulalnahid@gmail.com">Email</a></div><div><strong>Be the First to Know</strong><p>Get updates on our launch, features and more.</p><WaitlistForm compact source="footer" /></div></div><div className="footer-base"><span>© 2026–2030 @ LexGlobal BD</span><span>ENGINEERED IN BANGLADESH · BUILT FOR THE FUTURE.</span></div></footer>;
}

function Assistant({ language }: { language: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([{ role: "assistant", text: "Ask me about Sunshot AI, its architecture, benchmarks, features, vision, team or launch." }]);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  async function ask(event: FormEvent) {
    event.preventDefault(); const question = input.trim(); if (!question || loading) return;
    setMessages((items) => [...items, { role: "user", text: question }]); setInput(""); setLoading(true);
    try {
      const response = await fetch("/sunshotaiprelaunch/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: question, language }) });
      const data = await response.json() as { answer?: string; error?: string };
      setMessages((items) => [...items, { role: "assistant", text: data.answer || data.error || "Please try again." }]);
    } catch { setMessages((items) => [...items, { role: "assistant", text: "I am temporarily unavailable. Please try again." }]); }
    finally { setLoading(false); }
  }

  return <div className={`assistant ${open ? "open" : ""}`}>{open && <section className="assistant-panel"><header><Brand /><button onClick={() => setOpen(false)} aria-label="Close AI assistant"><X /></button></header><div className="assistant-body">{messages.map((message, index) => <p className={message.role} key={index}>{message.text}</p>)}{loading && <p className="assistant loading">•••</p>}<div ref={bottom} /></div><form onSubmit={ask}><input aria-label="Ask Sunshot AI" placeholder="Ask about Sunshot AI…" value={input} onChange={(event) => setInput(event.target.value)} /><button aria-label="Send question" disabled={loading}><Send /></button></form><small>This is a trial of Sunshot. Full version available soon.</small></section>}<button className="assistant-button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close Sunshot AI assistant" : "Open Sunshot AI assistant"}><img src="/sunshotaiprelaunch/sunshot-logo.jpg" alt="" /></button></div>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("sunshot-language") || "en";
    setLanguage(stored);
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: languages.map(([code]) => code).join(","), autoDisplay: false }, "google_translate_element");
        if (stored !== "en") setTimeout(() => applyLanguage(stored), 500);
      }
    };
    if (!document.querySelector('script[data-sunshot-translate]')) {
      const script = document.createElement("script"); script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"; script.async = true; script.dataset.sunshotTranslate = "true"; document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) { window.googleTranslateElementInit(); }
  }, []);

  function applyLanguage(value: string) {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) { combo.value = value; combo.dispatchEvent(new Event("change", { bubbles: true })); }
  }

  function changeLanguage(value: string) {
    setLanguage(value); localStorage.setItem("sunshot-language", value); document.documentElement.lang = value;
    applyLanguage(value); setTimeout(() => applyLanguage(value), 600);
  }

  return <><div id="google_translate_element" aria-hidden="true" /><header className="site-header"><div className="nav-inner"><Brand /><nav className="desktop-nav">{nav.map(([href, label]) => <a className={pathname === href ? "active" : ""} href={href} key={href}>{label}</a>)}</nav><LanguageSelector language={language} onChange={changeLanguage} /><a className="header-cta" href="/sunshotaiprelaunch/launch#waitlist">Join Waitlist <ArrowRight /></a><button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav className="mobile-nav">{nav.map(([href, label]) => <a href={href} key={href}>{label}<ArrowUpRight /></a>)}</nav>}</header><main>{children}</main><Footer /><Assistant language={language} /></>;
}
