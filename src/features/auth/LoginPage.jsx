// src/features/auth/LoginPage.jsx
import React, { useState, useEffect, useRef } from "react";
import useHabitStore from "../../store/habitStore";
import AuthView from "./AuthForms";
import {
  HEADLINE_WORDS,
  FEATURES,
  STEPS,
  ALL_TESTIMONIALS,
  PRICING_PLANS,
  FAQ_ITEMS,
} from "./landingData";

function ParticleField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth,
      H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const NUM = Math.min(120, Math.floor((W * H) / 12000));
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      color:
        Math.random() > 0.7
          ? [52, 211, 153]
          : Math.random() > 0.5
            ? [99, 102, 241]
            : [148, 163, 184],
    }));
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x,
        my = mouseRef.current.y;
      particles.forEach((p) => {
        const dx = p.x - mx,
          dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(52,211,153,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}

function CinematicHeadline({ delay = 0 }) {
  const [visibleWords, setVisibleWords] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleWords((n) => {
          if (n >= HEADLINE_WORDS.length) {
            clearInterval(interval);
            return n;
          }
          return n + 1;
        });
      }, 90);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <h1
      style={{
        fontSize: "clamp(38px,4.5vw,64px)",
        fontWeight: 900,
        lineHeight: 1.06,
        letterSpacing: "-0.04em",
        margin: "0 0 22px",
        color: "#f1f5f9",
      }}
    >
      {HEADLINE_WORDS.map((word, i) => {
        const isAccent = i >= 5;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              opacity: i < visibleWords ? 1 : 0,
              transform: i < visibleWords ? "none" : "translateY(18px)",
              transition:
                "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              ...(isAccent
                ? {
                    background:
                      "linear-gradient(135deg, #34d399 0%, #06b6d4 50%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : { color: "#f1f5f9" }),
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
}

function AppMockup({ activeFeature }) {
  const [displayed, setDisplayed] = useState(activeFeature);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => {
      setDisplayed(activeFeature);
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [activeFeature]);
  const feat = FEATURES[displayed];
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          background: "linear-gradient(145deg, #1e293b, #0f172a)",
          borderRadius: "16px 16px 0 0",
          padding: "14px 14px 0",
          border: "1px solid rgba(51,65,85,0.8)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "10px",
            paddingLeft: "4px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff5f57",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#febc2e",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#28c840",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              margin: "0 8px",
              padding: "3px 10px",
              borderRadius: "5px",
              background: "rgba(15,23,42,0.8)",
              fontSize: "9px",
              color: "#475569",
              fontWeight: 500,
              border: "1px solid rgba(51,65,85,0.5)",
              textAlign: "center",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            habit-builder-kit.vercel.app
          </div>
        </div>
        <div
          style={{
            borderRadius: "6px 6px 0 0",
            overflow: "hidden",
            position: "relative",
            background: "#0b0f19",
            lineHeight: 0,
          }}
        >
          <img
            src={feat.img}
            alt={feat.label}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              maxHeight: "320px",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: fading ? 0 : 1,
              transform: fading ? "scale(1.015)" : "scale(1)",
              transition: "opacity 0.18s ease, transform 0.18s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "12px",
              padding: "4px 10px",
              borderRadius: "99px",
              background: "rgba(8,13,24,0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(52,211,153,0.25)",
              fontSize: "10px",
              fontWeight: 700,
              color: "#34d399",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.18s ease",
            }}
          >
            {feat.icon} {feat.label}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50px",
              background: "linear-gradient(transparent, rgba(8,13,24,0.5))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: "14px",
          background: "linear-gradient(180deg, #1e293b, #0f172a)",
          borderRadius: "0 0 20px 20px",
          border: "1px solid rgba(51,65,85,0.6)",
          borderTop: "none",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "10%",
          right: "10%",
          height: "30px",
          background:
            "radial-gradient(ellipse, rgba(52,211,153,0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}

function TestimonialsMarquee({ visible, isMobile }) {
  const doubled = [...ALL_TESTIMONIALS, ...ALL_TESTIMONIALS];
  return (
    <div
      style={{
        borderTop: "1px solid rgba(51,65,85,0.25)",
        padding: isMobile ? "48px 0" : "72px 0",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#475569",
          marginBottom: "32px",
        }}
      >
        ✦ What builders say
      </p>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 100,
            background: "linear-gradient(90deg, #080d18, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 100,
            background: "linear-gradient(-90deg, #080d18, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div className="lp-marquee-track">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="lp-tcard"
              style={{
                flexShrink: 0,
                width: 300,
                padding: "20px 22px",
                borderRadius: "16px",
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(51,65,85,0.35)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{ display: "flex", gap: "3px", marginBottom: "10px" }}
              >
                {"★★★★★".split("").map((s, j) => (
                  <span key={j} style={{ color: "#f59e0b", fontSize: "12px" }}>
                    {s}
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "#94a3b8",
                  margin: "0 0 16px",
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "22px" }}>{t.avatar}</span>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#e2e8f0",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingSection({ visible, isMobile, onGetStarted }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div
      id="pricing"
      style={{
        borderTop: "1px solid rgba(51,65,85,0.25)",
        padding: isMobile ? "60px 24px" : "80px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#475569",
              marginBottom: "12px",
            }}
          >
            ✦ Simple pricing
          </p>
          <h2
            style={{
              fontSize: isMobile ? "26px" : "34px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              margin: "0 0 10px",
            }}
          >
            Start free. Go Pro for ₹99.
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            One-time payment. No subscriptions. No dark patterns.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "16px",
            alignItems: "start",
          }}
        >
          {PRICING_PLANS.map((plan) => {
            const isHov = hovered === plan.id;
            const isPop = plan.popular;
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHovered(plan.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  padding: "28px 24px",
                  borderRadius: "20px",
                  background: isPop
                    ? "linear-gradient(160deg, rgba(20,15,40,0.95) 0%, rgba(15,10,30,0.98) 100%)"
                    : "rgba(15,23,42,0.6)",
                  border: isPop
                    ? "1.5px solid rgba(52,211,153,0.45)"
                    : isHov
                      ? "1px solid rgba(51,65,85,0.7)"
                      : "1px solid rgba(51,65,85,0.35)",
                  boxShadow: isPop
                    ? "0 0 40px rgba(52,211,153,0.12), inset 0 1px 0 rgba(52,211,153,0.08)"
                    : "none",
                  backdropFilter: "blur(12px)",
                  transform: isHov ? "translateY(-4px)" : "none",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {isPop && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #34d399, #10b981)",
                      borderRadius: "99px",
                      padding: "4px 14px",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#032212",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ⭐ Most Popular
                  </div>
                )}
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: isPop ? "#34d399" : "#64748b",
                    marginBottom: "14px",
                  }}
                >
                  {plan.label}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "40px",
                      fontWeight: 900,
                      color: "#f1f5f9",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#475569",
                    marginBottom: "24px",
                  }}
                >
                  {plan.period}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    marginBottom: "24px",
                  }}
                >
                  {plan.features.map((f) => (
                    <div
                      key={f.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        fontSize: "13px",
                        color: f.ok ? "#cbd5e1" : "#334155",
                      }}
                    >
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: 800,
                          background: f.ok
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(51,65,85,0.2)",
                          border: `1px solid ${f.ok ? "rgba(52,211,153,0.25)" : "rgba(51,65,85,0.3)"}`,
                          color: f.ok ? "#34d399" : "#334155",
                        }}
                      >
                        {f.ok ? "✓" : "—"}
                      </span>
                      {f.text}
                    </div>
                  ))}
                </div>
                <button
                  onClick={onGetStarted}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 800,
                    cursor: "pointer",
                    border: isPop ? "none" : "1px solid rgba(51,65,85,0.5)",
                    background: isPop
                      ? "linear-gradient(135deg, #34d399, #10b981)"
                      : "rgba(30,41,59,0.6)",
                    color: isPop ? "#032212" : "#94a3b8",
                    boxShadow: isPop
                      ? "0 0 20px rgba(52,211,153,0.25)"
                      : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "12px",
            color: "#334155",
          }}
        >
          🔒 Secure payment via Razorpay · UPI, cards & net banking supported
        </p>
      </div>
    </div>
  );
}

function FAQSection({ visible, isMobile }) {
  const [open, setOpen] = useState(null);
  return (
    <div
      style={{
        borderTop: "1px solid rgba(51,65,85,0.25)",
        padding: isMobile ? "60px 24px" : "80px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#475569",
              marginBottom: "12px",
            }}
          >
            ✦ FAQ
          </p>
          <h2
            style={{
              fontSize: isMobile ? "26px" : "32px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Questions? Answers.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`lp-faq-item${isOpen ? " lp-open" : ""}`}>
                <button
                  className="lp-faq-btn"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span style={{ lineHeight: 1.45 }}>{item.q}</span>
                  <span
                    className="lp-faq-icon"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "none",
                      background: isOpen
                        ? "rgba(52,211,153,0.12)"
                        : "rgba(30,41,59,0.6)",
                      color: isOpen ? "#34d399" : "#64748b",
                    }}
                  >
                    +
                  </span>
                </button>
                <div className={`lp-faq-answer${isOpen ? " lp-open" : ""}`}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OnboardView({ onDone }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  useEffect(() => {
    const t = setTimeout(() => setStep((n) => (n + 1) % STEPS.length), 3200);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div
      style={{
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#475569",
          marginBottom: "10px",
        }}
      >
        Step {step + 1} of {STEPS.length}
      </div>
      <div
        style={{
          padding: "40px 32px",
          borderRadius: "24px",
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(51,65,85,0.5)",
          backdropFilter: "blur(20px)",
          marginBottom: "24px",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ fontSize: "54px", marginBottom: "20px" }}>{s.icon}</div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#f1f5f9",
            marginBottom: "12px",
            letterSpacing: "-0.03em",
          }}
        >
          {s.title}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {s.desc}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            onClick={() => setStep(i)}
            style={{
              height: "4px",
              borderRadius: "99px",
              cursor: "pointer",
              width: i === step ? "24px" : "6px",
              background: i === step ? "#34d399" : "rgba(51,65,85,0.7)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onDone}
          style={{
            flex: 1,
            padding: "13px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#64748b",
            background: "rgba(30,41,59,0.5)",
            border: "1px solid rgba(51,65,85,0.4)",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((n) => n + 1)}
            style={{
              flex: 2,
              padding: "13px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 900,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#032212",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(52,211,153,0.3)",
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onDone}
            style={{
              flex: 2,
              padding: "13px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 900,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#032212",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(52,211,153,0.3)",
            }}
          >
            Let's go! 🚀
          </button>
        )}
      </div>
    </div>
  );
}

function LandingView({ onGetStarted, onSignIn, onGuestMode }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const t = setTimeout(() => setVisible(true), 60);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", check);
    };
  }, []);
  useEffect(() => {
    if (!paused) {
      const t = setInterval(
        () => setActiveFeature((p) => (p + 1) % FEATURES.length),
        3000,
      );
      return () => clearInterval(t);
    }
    const resume = setTimeout(() => setPaused(false), 5000);
    return () => clearTimeout(resume);
  }, [paused]);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "16px 20px" : "18px 48px",
          borderBottom: "1px solid rgba(51,65,85,0.25)",
          backdropFilter: "blur(20px)",
          background: "rgba(8,13,24,0.8)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🎯</span>
          {!isMobile && (
            <span
              style={{ fontWeight: 900, fontSize: "15px", color: "#f1f5f9" }}
            >
              Habit Builder Kit
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {!isMobile && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "99px",
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#34d399",
              }}
            >
              ✨ Free forever
            </div>
          )}
          <button
            onClick={onSignIn}
            style={{
              padding: isMobile ? "8px 14px" : "8px 18px",
              borderRadius: "99px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#94a3b8",
              background: "none",
              border: "1px solid rgba(51,65,85,0.5)",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            style={{
              padding: isMobile ? "8px 14px" : "9px 20px",
              borderRadius: "99px",
              fontSize: "13px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #34d399, #10b981)",
              color: "#032212",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(52,211,153,0.3)",
            }}
          >
            {isMobile ? "Start →" : "Get Started →"}
          </button>
        </div>
      </nav>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "48px 24px" : "80px 64px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            paddingRight: isMobile ? 0 : "64px",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
            order: isMobile ? 2 : 1,
            marginTop: isMobile ? "40px" : 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "99px",
              marginBottom: "24px",
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.18)",
              fontSize: "12px",
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                animation: "pulse 2s infinite",
                boxShadow: "0 0 6px #34d399",
              }}
            />
            The habit tracker that shows you WHY you fail
          </div>
          <CinematicHeadline delay={300} />
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: "#64748b",
              lineHeight: 1.75,
              margin: "0 0 40px",
              maxWidth: "480px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease 0.5s",
            }}
          >
            Track streaks, log your mood, earn XP, and unlock insights you
            didn't know you needed. The only app that makes habit science feel
            like a game.
          </p>
          <div
            style={{
              marginBottom: "16px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease 0.6s",
            }}
          >
            <button
              onClick={onGetStarted}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: isMobile ? "100%" : "auto",
                padding: "17px 40px",
                borderRadius: "16px",
                fontSize: "17px",
                fontWeight: 900,
                background:
                  "linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%)",
                color: "#032212",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 40px rgba(52,211,153,0.35)",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              🚀 Start for Free
            </button>
          </div>
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease 0.65s",
              marginBottom: "44px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button
              onClick={onSignIn}
              style={{
                fontSize: "13px",
                color: "#475569",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Already have an account? Sign in →
            </button>
            <button
              onClick={onGuestMode}
              style={{
                fontSize: "13px",
                color: "#64748b",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(51,65,85,0.4)",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "9px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "15px" }}>👁️</span>Preview as Guest
            </button>
          </div>
          <div
            style={{
              display: "flex",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease 0.75s",
            }}
          >
            {[
              { value: "196+", label: "Habits logged", color: "#34d399" },
              { value: "50", label: "XP levels", color: "#f59e0b" },
              { value: "∞", label: "Streaks", color: "#38bdf8" },
            ].map(({ value, label, color }, i) => (
              <div
                key={label}
                style={{
                  paddingRight: i < 2 ? "28px" : 0,
                  marginRight: i < 2 ? "28px" : 0,
                  borderRight: i < 2 ? "1px solid rgba(51,65,85,0.4)" : "none",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: 900, color }}>
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    marginTop: "2px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            order: isMobile ? 1 : 2,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          <AppMockup activeFeature={activeFeature} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "6px",
              marginTop: "16px",
            }}
          >
            {FEATURES.map((f, i) => (
              <button
                key={f.label}
                onClick={() => {
                  setActiveFeature(i);
                  setPaused(true);
                }}
                style={{
                  padding: "10px 8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background:
                    activeFeature === i
                      ? "rgba(52,211,153,0.12)"
                      : "rgba(15,23,42,0.5)",
                  border:
                    activeFeature === i
                      ? "1.5px solid rgba(52,211,153,0.45)"
                      : "1.5px solid rgba(51,65,85,0.35)",
                  textAlign: "center",
                  outline: "none",
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "3px" }}>
                  {f.icon}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: activeFeature === i ? "#34d399" : "#64748b",
                  }}
                >
                  {f.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TestimonialsMarquee visible={visible} isMobile={isMobile} />
      <PricingSection
        visible={visible}
        isMobile={isMobile}
        onGetStarted={onGetStarted}
      />
      <FAQSection visible={visible} isMobile={isMobile} />
      <div
        style={{
          borderTop: "1px solid rgba(51,65,85,0.25)",
          padding: isMobile ? "60px 24px" : "80px 64px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
          textAlign: "center",
        }}
      >
        <button
          onClick={onGetStarted}
          style={{
            padding: "14px 36px",
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: 900,
            background: "linear-gradient(135deg, #34d399, #10b981)",
            color: "#032212",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 30px rgba(52,211,153,0.3)",
          }}
        >
          🎯 Build your first habit today
        </button>
        <p style={{ marginTop: "12px", fontSize: "12px", color: "#475569" }}>
          Free forever · No credit card required
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const enterGuestMode = useHabitStore((s) => s.enterGuestMode);
  const [view, setView] = useState("landing");
  const isAuth = view === "signin" || view === "signup" || view === "forgot";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d18",
        color: "#e2e8f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: "relative",
        ...(isAuth ? {} : { overflow: "hidden auto" }),
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 6px #34d399; } 50% { opacity:0.4; box-shadow:0 0 2px #34d399; } } @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } } * { box-sizing: border-box; margin: 0; padding: 0; } input, button, textarea { font-family: inherit; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(51,65,85,0.5); border-radius: 99px; } ::selection { background: rgba(52,211,153,0.25); } .lp-faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), padding 0.3s ease; padding: 0 20px; } .lp-faq-answer.lp-open { max-height: 160px; padding: 0 20px 16px; } .lp-faq-item { border: 1px solid rgba(51,65,85,0.35); border-radius: 14px; overflow: hidden; transition: border-color 0.2s; } .lp-faq-item.lp-open { border-color: rgba(52,211,153,0.3); } .lp-faq-btn { width: 100%; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: transparent; border: none; color: #e2e8f0; cursor: pointer; text-align: left; font-size: 14px; font-weight: 600; transition: color 0.15s; } .lp-faq-icon { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; } @keyframes lp-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .lp-marquee-track { display: flex; gap: 16px; width: max-content; animation: lp-marquee 32s linear infinite; } .lp-marquee-track:hover { animation-play-state: paused; } .lp-tcard { transition: border-color 0.2s, transform 0.2s; } .lp-tcard:hover { border-color: rgba(52,211,153,0.3) !important; transform: translateY(-3px); }`}</style>
      <ParticleField />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.055) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {view === "landing" && (
          <LandingView
            onGetStarted={() => setView("onboard")}
            onSignIn={() => setView("signin")}
            onGuestMode={enterGuestMode}
          />
        )}
        {view === "onboard" && (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setView("landing")}
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(30,41,59,0.6)",
                border: "1px solid rgba(51,65,85,0.5)",
                borderRadius: "99px",
                padding: "6px 14px 6px 10px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#94a3b8",
                zIndex: 10,
              }}
            >
              Back
            </button>
            <OnboardView onDone={() => setView("signup")} />
          </div>
        )}
        {isAuth && <AuthView view={view} setView={setView} />}
      </div>
    </div>
  );
}
