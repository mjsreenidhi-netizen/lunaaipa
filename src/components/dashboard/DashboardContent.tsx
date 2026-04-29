"use client";

import React, { useState } from "react";
import type { UserRow } from "@/types/database";

export function DashboardContent({ profile }: { profile: UserRow }) {
  const [realm, setRealm] = useState<"personal" | "work">("personal");
  const [activeTab, setActiveTab] = useState<"quests" | "journey">("quests");
  const [journalTab, setJournalTab] = useState<"new" | "memories">("new");
  
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=b6e3f4&style=circle&top=longHair";

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/dashboard.css" />
      
      <div id="app">
        <div className="stars-bg"></div>
        <div className="gradient-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
        </div>

        <header className="glass-panel fade-in">
            <div className="logo" style={{ cursor: "pointer" }} title="Back to Dashboard">
                <i className="fa-solid fa-moon"></i>
                LunaRhythm
            </div>
            
            <div className="realm-switcher" data-realm={realm} onClick={() => setRealm(realm === "personal" ? "work" : "personal")}>
                <div className="realm-slider"></div>
                <div className={`realm-option ${realm === "personal" ? "active" : ""}`}>Personal</div>
                <div className={`realm-option ${realm === "work" ? "active" : ""}`}>Work Realm</div>
            </div>
            
            <div className="profile-menu">
                <button className="btn-primary" style={{ background: "transparent", border: "1px solid var(--accent-gold)", color: "var(--accent-gold)", padding: "0.5rem 1rem", borderRadius: "var(--border-radius-pill)" }}>
                    <i className="fa-solid fa-notes-medical"></i> Your Health
                </button>
                <img src={avatarUrl} className="avatar" title="Profile" alt="Profile" style={{ marginLeft: "1rem" }} />
                <button className="btn-icon" title="Logout" style={{ marginLeft: "0.5rem" }} onClick={() => {
                  window.location.href = "/login";
                }}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        </header>

        <main className="dashboard-grid fade-in">
            <aside className="left-sidebar">
                <div className="glass-panel luna-companion text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" className="luna-orb" alt="Luna AI" style={{width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", margin: "0 auto", display: "block", marginBottom: "1rem", boxShadow: "0 0 25px var(--accent-magic-glow)"}} />
                    <h3 className="realm-title" style={{textAlign: "center"}}>LUNA AI</h3>
                    <p className="companion-dialogue text-muted text-sm" style={{textAlign: "center", fontStyle: "italic", marginTop: "1rem", lineHeight: "1.6"}}>
                        Your energy rises like the tides being tugged by the full moon. A perfect time to begin new quests and forge ahead on your journey.
                    </p>
                </div>
                
                <div className="glass-panel cycle-widget text-center" style={{marginTop: "1.5rem"}}>
                    <h4 className="text-gold mb-2" style={{color: "var(--accent-gold)", marginBottom: "1rem", fontFamily: "var(--font-heading)"}}>CYCLE PHASE TRACKER</h4>
                    
                    <div className="mini-calendar">
                        <div className="cal-header" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
                            <button className="btn-icon" style={{fontSize: "0.8rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer"}}><i className="fa-solid fa-chevron-left"></i></button>
                            <span style={{fontFamily: "var(--font-heading)", color: "var(--text-secondary)"}}>MARCH 2026</span>
                            <button className="btn-icon" style={{fontSize: "0.8rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer"}}><i className="fa-solid fa-chevron-right"></i></button>
                        </div>
                        <div className="cal-grid" style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", fontSize: "0.8rem", marginBottom: "0.5rem"}}>
                            <div className="cal-day-header">S</div><div className="cal-day-header">M</div><div className="cal-day-header">T</div><div className="cal-day-header">W</div><div className="cal-day-header">T</div><div className="cal-day-header">F</div><div className="cal-day-header">S</div>
                            <div className="cal-day empty"></div><div className="cal-day empty"></div><div className="cal-day empty"></div>
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(d => (
                                <div key={d} className={`cal-day interactive ${d >= 10 && d <= 14 ? 'cal-period' : d >= 15 && d <= 21 ? 'cal-follicular' : d === 22 ? 'cal-ovulation' : d > 22 ? 'cal-luteal' : 'cal-predicted'}`} style={{padding: "0.25rem 0", borderRadius: "4px", textAlign: "center"}}>{d}</div>
                            ))}
                        </div>
                        <div style={{display: "flex", justifyContent: "space-around", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.25rem", marginTop: "1rem"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}><div style={{width: "8px", height: "8px", background: "#ff4a68", borderRadius: "50%"}}></div> Period</div>
                            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}><div style={{width: "8px", height: "8px", background: "#50C878", borderRadius: "50%"}}></div> Follicular</div>
                            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}><div style={{width: "8px", height: "8px", background: "#f472b6", borderRadius: "50%"}}></div> Ovulation</div>
                            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}><div style={{width: "8px", height: "8px", background: "#fbbf24", borderRadius: "50%"}}></div> Luteal</div>
                        </div>
                    </div>
                </div>
            </aside>

            <section className="main-content">
                <div className="glass-panel quests-section">
                    <div className="section-header" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
                        <div className="tabs" style={{display: "flex", gap: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", flex: 1}}>
                            <h3 className={activeTab === 'quests' ? 'active-tab' : 'inactive-tab'} onClick={() => setActiveTab('quests')} style={{cursor: "pointer", paddingBottom: "0.5rem", borderBottom: activeTab === 'quests' ? "2px solid var(--accent-gold)" : "none", color: activeTab === 'quests' ? "var(--accent-gold)" : "var(--text-muted)"}}>ACTIVE QUESTS</h3>
                            <h3 className={activeTab === 'journey' ? 'active-tab' : 'inactive-tab'} onClick={() => setActiveTab('journey')} style={{cursor: "pointer", paddingBottom: "0.5rem", borderBottom: activeTab === 'journey' ? "2px solid var(--accent-gold)" : "none", color: activeTab === 'journey' ? "var(--text-secondary)" : "var(--text-muted)"}}>JOURNEY SO FAR</h3>
                        </div>
                        <button className="btn-icon" style={{background: "rgba(0,0,0,0.2)", width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", cursor: "pointer"}} title="Add Quest"><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div className="quests-filter-row" style={{display: "flex", gap: "1rem", fontSize: "0.85rem", marginBottom: "1.5rem"}}>
                        <span style={{cursor: "pointer", color: "var(--accent-gold)"}}>Daily</span>
                        <span style={{cursor: "pointer", color: "var(--text-muted)"}}>Weekly</span>
                        <span style={{cursor: "pointer", color: "var(--text-muted)"}}>Monthly</span>
                        <span style={{cursor: "pointer", color: "var(--text-muted)"}}>Yearly</span>
                    </div>
                    <div className="quest-list text-muted" style={{fontSize: "0.95rem"}}>
                        No quests remain in this realm. Rest easy, Daughter of the Moon.
                    </div>
                </div>

                <div className="glass-panel journal-section" style={{marginTop: "1.5rem"}}>
                    <div className="section-header" style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem"}}>
                        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                            <h3 style={{fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--text-primary)"}}>CHRONICLE (JOURNAL)</h3>
                            <span className="text-muted text-sm"><i className="fa-solid fa-lock"></i> Encrypted</span>
                        </div>
                        <div className="tabs" style={{display: "flex", gap: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", width: "100%"}}>
                            <h3 style={{fontSize: "0.9rem", cursor: "pointer", paddingBottom: "0.5rem", borderBottom: journalTab === 'new' ? "2px solid var(--accent-gold)" : "none", color: journalTab === 'new' ? "var(--accent-gold)" : "var(--text-muted)"}} onClick={() => setJournalTab('new')}>NEW ENTRY</h3>
                            <h3 style={{fontSize: "0.9rem", cursor: "pointer", paddingBottom: "0.5rem", borderBottom: journalTab === 'memories' ? "2px solid var(--accent-gold)" : "none", color: journalTab === 'memories' ? "var(--text-secondary)" : "var(--text-muted)"}} onClick={() => setJournalTab('memories')}>MEMORIES</h3>
                        </div>
                    </div>
                    
                    {journalTab === 'new' ? (
                        <>
                            <div className="mood-energy-sliders fade-in" style={{display: "flex", gap: "2rem", marginBottom: "1.5rem"}}>
                                <div className="slider-group" style={{flex: 1}}>
                                    <label style={{display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)"}}><span>Mood</span> <span className="text-gold" style={{color: "var(--accent-gold)"}}><i className="fa-solid fa-face-smile"></i></span></label>
                                    <input type="range" min="1" max="10" defaultValue="7" style={{width: "100%", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", appearance: "none"}} />
                                </div>
                                <div className="slider-group" style={{flex: 1}}>
                                    <label style={{display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)"}}><span>Energy</span> <span className="text-magic" style={{color: "var(--accent-magic)"}}><i className="fa-solid fa-bolt"></i></span></label>
                                    <input type="range" min="1" max="10" defaultValue="8" style={{width: "100%", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", appearance: "none"}} />
                                </div>
                            </div>
                            <textarea className="journal-input fade-in" placeholder="Record your thoughts, moon goddess..." style={{width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--border-radius-sm)", padding: "1rem", color: "var(--text-primary)", minHeight: "100px", marginBottom: "1rem", fontSize: "0.9rem", fontFamily: "var(--font-body)", resize: "vertical"}}></textarea>
                            <div style={{textAlign: "right"}} className="fade-in">
                                <button className="btn-primary" style={{background: "var(--accent-magic)", border: "none", color: "var(--bg-dark)", padding: "0.6rem 1.5rem", borderRadius: "var(--border-radius-pill)", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem"}}><i className="fa-solid fa-leaf"></i> SCRIBE</button>
                            </div>
                        </>
                    ) : (
                        <div className="memories-list fade-in">
                            <p className="text-muted text-center py-4" style={{margin: 0}}>Your vault is empty. Scribe your first thought.</p>
                        </div>
                    )}
                </div>
            </section>

            <aside className="right-sidebar">
                <div className="glass-panel daily-inspiration" style={{padding: "1.5rem", background: "linear-gradient(to bottom right, var(--bg-panel), rgba(181, 124, 255, 0.05))"}}>
                    <h4 className="text-gold" style={{color: "var(--accent-gold)", fontFamily: "var(--font-heading)", fontSize: "1rem", marginBottom: "1rem"}}><i className="fa-solid fa-star"></i> DAILY INSPIRATION</h4>
                    <p className="quote-content" style={{fontFamily: "var(--font-heading)", fontSize: "1rem", margin: "1rem 0", lineHeight: "1.8", color: "var(--text-primary)"}}>
                        "THERE IS NO LIMIT TO WHAT WE, AS WOMEN, CAN ACCOMPLISH."
                    </p>
                    <p className="quote-author" style={{fontSize: "0.9rem", color: "var(--accent-gold)", textAlign: "right"}}>- Michelle Obama</p>
                </div>
                
                <div className="glass-panel moons-call-chat" style={{marginTop: "1.5rem", display: "flex", flexDirection: "column", height: "320px", padding: "1.5rem"}}>
                    <h4 className="text-gold mb-2" style={{color: "var(--accent-gold)", fontFamily: "var(--font-heading)", fontSize: "1rem", marginBottom: "1rem"}}><i className="fa-solid fa-moon"></i> THE MOON'S CALL</h4>
                    <div style={{flex: 1, overflowY: "auto", paddingRight: "0.5rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <div style={{alignSelf: "flex-start", background: "rgba(181, 124, 255, 0.05)", border: "1px solid rgba(181, 124, 255, 0.1)", borderRadius: "var(--border-radius-sm)", padding: "0.8rem 1rem", maxWidth: "95%", fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: "1.6"}}>
                            <span className="text-muted mb-1" style={{display: "block", fontSize: "0.75rem"}}>quiet stillness.</span>
                            I am here, always, a steadfast companion in your sky. You don't have to carry every celestial body on your own shoulders. Tell me, if you wish, what constellations are pressing down on you? Or perhaps, simply rest here in my silent presence, knowing that I see you, I hear you, and I hold space for every single particle of what you're feeling.
                        </div>
                    </div>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                        <input type="text" className="auth-input" placeholder="Commune with Luna..." style={{flex: 1, padding: "0.6rem 1rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--border-radius-sm)", color: "white", fontSize: "0.85rem"}} />
                        <button className="btn-icon" style={{background: "var(--accent-gold)", color: "var(--bg-dark)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer"}}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>

                <div className="glass-panel" style={{marginTop: "1.5rem", padding: "1.5rem"}}>
                    <h4 className="text-gold" style={{color: "var(--text-primary)", fontFamily: "var(--font-heading)", fontSize: "1rem", marginBottom: "1rem"}}>LUNA'S LEGACY</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem"}}>
                        <div style={{background: "rgba(0,0,0,0.2)", padding: "1.5rem 1rem", borderRadius: "var(--border-radius-sm)", textAlign: "center"}}>
                            <div style={{fontSize: "1.8rem", fontFamily: "var(--font-heading)", color: "var(--accent-gold)", marginBottom: "0.25rem"}}>0</div>
                            <div style={{fontSize: "0.75rem", color: "var(--text-muted)"}}>Day Streak <i className="fa-solid fa-fire" style={{color: "#f97316"}}></i></div>
                        </div>
                        <div style={{background: "rgba(0,0,0,0.2)", padding: "1.5rem 1rem", borderRadius: "var(--border-radius-sm)", textAlign: "center"}}>
                            <div style={{fontSize: "1.8rem", fontFamily: "var(--font-heading)", color: "var(--accent-gold)", marginBottom: "0.25rem"}}>2</div>
                            <div style={{fontSize: "0.75rem", color: "var(--text-muted)"}}>Quests<br/>Conquered</div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
      </div>
    </>
  );
}
