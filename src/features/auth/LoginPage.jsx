// src/features/auth/LoginPage.jsx
import React, { useState, useEffect, useRef } from "react";
import useHabitStore from "../../store/habitStore";
import AuthView from "./AuthForms";
import AppFooter from "../../components/AppFooter";
import {
  BRAND_NAME,
  HEADLINE_WORDS,
  HERO_SUBTITLE,
  VALUE_PROP,
  PAIN_POINTS,
  PILLARS,
  DIFFERENCES,
  AUDIENCE,
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
        fontSize: "clamp(38px,5vw,64px)",
        fontWeight: 900,
        lineHeight: 1.08,
        letterSpacing: "-0.05em",
        margin: "0 0 18px",
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

function AppMockup({ activeFeature, isMobile }) {
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
              height: isMobile ? "280px" : "340px",
              display: "block",
              objectFit: "contain",
              objectPosition: "center",
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(8px) scale(0.98)" : "none",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              background: "#0b0f19",
            }}
          />
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
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
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
              fontSize: isMobile ? "26px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: "0 0 12px",
            }}
          >
            Start free. Go Pro for ₹99.
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Choose between a 1-week trial or one-time lifetime access. No subscriptions.
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
                    ? "linear-gradient(160deg, rgba(20,15,40,0.98) 0%, rgba(15,10,30,0.99) 100%)"
                    : "rgba(15,23,42,0.65)",
                  border: isPop
                    ? "1.5px solid rgba(52,211,153,0.5)"
                    : isHov
                      ? "1px solid rgba(51,65,85,0.8)"
                      : "1px solid rgba(51,65,85,0.4)",
                  boxShadow: isPop
                    ? "0 0 50px rgba(52,211,153,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : isHov
                      ? "0 10px 30px rgba(0,0,0,0.3)"
                      : "none",
                  backdropFilter: "blur(16px)",
                  transform: isHov ? "translateY(-6px)" : "none",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
              fontSize: isMobile ? "26px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Questions? Answers.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`lp-faq-item${isOpen ? " lp-open" : ""}`}
                style={{
                  background: isOpen ? "rgba(255,255,255,0.02)" : "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                <button
                  className="lp-faq-btn"
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    padding: isOpen ? "20px 24px 14px" : "18px 24px",
                  }}
                >
                  <span
                    style={{
                      lineHeight: 1.5,
                      fontWeight: 700,
                      fontSize: "15px",
                      color: isOpen ? "#f1f5f9" : "#cbd5e1",
                    }}
                  >
                    {item.q}
                  </span>
                  <div
                    className="lp-faq-icon"
                    style={{
                      transform: isOpen ? "rotate(135deg)" : "none",
                      background: isOpen
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(51,65,85,0.3)",
                      color: isOpen ? "#34d399" : "#94a3b8",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    +
                  </div>
                </button>
                <div className={`lp-faq-answer${isOpen ? " lp-open" : ""}`}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      lineHeight: 1.75,
                      margin: 0,
                      padding: "0 4px 6px 0",
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

function PillarsSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "60px 24px" : "80px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.3s",
        background: "rgba(10,10,18,0.3)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
            ✦ Why {BRAND_NAME}?
          </p>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Master your day, one tile at a time.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.title}
              style={{
                padding: "32px",
                borderRadius: "24px",
                background: "rgba(15,23,42,0.4)",
                border: "1px solid rgba(51,65,85,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "20px" }}>
                {p.icon}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  marginBottom: "12px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DifferenceSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "60px 24px" : "80px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
        borderTop: "1px solid rgba(51,65,85,0.15)",
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
            ✦ The Difference
          </p>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            What Makes Us Different?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          {DIFFERENCES.map((d) => (
            <div
              key={d.feature}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                gap: isMobile ? "8px" : "20px",
                alignItems: "center",
                padding: "20px 24px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(51,65,85,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{d.icon}</span>
                <span
                  style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9" }}
                >
                  {d.feature}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                {d.experience}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AudienceSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "60px 24px" : "80px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.5s",
        background:
          "linear-gradient(to bottom, transparent, rgba(52,211,153,0.02))",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
            ✦ For You
          </p>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Is This For You?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {AUDIENCE.map((a) => (
            <div
              key={a.title}
              style={{
                textAlign: "center",
                padding: "32px 24px",
                borderRadius: "24px",
                background: "rgba(10,10,18,0.4)",
                border: "1.5px solid rgba(51,65,85,0.4)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                {a.icon}
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: "#f1f5f9",
                  marginBottom: "8px",
                }}
              >
                {a.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                }}
              >
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValuePropSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "80px 24px" : "110px 64px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "#080d18",
      }}
    >
      {/* Premium Noise Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Geometric Accents */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "120px",
            height: "1px",
            background: "linear-gradient(90deg, #34d399, transparent)",
            transform: "rotate(-35deg)",
            opacity: visible ? 0.4 : 0,
            transition: "all 1.5s ease 0.5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            right: "10%",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            opacity: visible ? 0.3 : 0,
            transform: visible ? "scale(1)" : "scale(0.5)",
            transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "10%",
            width: "40px",
            height: "40px",
            background: "rgba(99, 102, 241, 0.15)",
            borderRadius: "8px",
            transform: visible ? "rotate(45deg)" : "rotate(0deg)",
            opacity: visible ? 0.4 : 0,
            transition: "all 1s ease 1s",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "99px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "24px",
            opacity: visible ? 1 : 0,
            transition: "all 0.8s ease 0.2s",
          }}
        >
          <span style={{ fontSize: "16px" }}>⚡</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#f1f5f9",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Built for Breakthroughs
          </span>
        </div>

        <h2
          style={{
            fontSize: isMobile ? "30px" : "42px",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
            margin: 0,
            color: "#f1f5f9",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}
        >
          The only habit tracker designed to help you build{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            momentum
          </span>{" "}
          without the{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            burnout.
          </span>
          <br />
          <span style={{ opacity: 0.85 }}>Focus on </span>
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            what matters,
          </span>{" "}
          one tile at a time.
        </h2>
      </div>
    </div>
  );
}

function PainPointsSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "60px 24px" : "100px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.2s",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
            ✦ Problem Solved
          </p>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Why Habit Builder Kit?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {PAIN_POINTS.map((p) => (
            <div
              key={p.problem}
              style={{
                padding: "28px",
                borderRadius: "20px",
                background: "rgba(15,23,42,0.4)",
                border: "1px solid rgba(51,65,85,0.3)",
                display: "flex",
                gap: "20px",
              }}
            >
              <div style={{ fontSize: "32px", marginTop: "4px" }}>{p.icon}</div>
              <div>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "#f1f5f9",
                    marginBottom: "8px",
                  }}
                >
                  {p.problem}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {p.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FullFeaturesSection({ visible, isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? "60px 24px" : "100px 64px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.3s",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
            ✦ All Features
          </p>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 900,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Tools Built for Consistency
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.label}
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(51,65,85,0.2)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  marginBottom: "4px",
                }}
              >
                {f.label}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
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
  const [infoFading, setInfoFading] = useState(false);

  useEffect(() => {
    setInfoFading(true);
    const t = setTimeout(() => setInfoFading(false), 200);
    return () => clearTimeout(t);
  }, [activeFeature]);
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
          padding: isMobile ? "0 24px" : "0 64px",
          height: isMobile ? "64px" : "72px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          background: "rgba(8,13,24,0.7)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          opacity: visible ? 1 : 0,
          transition: "all 0.5s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🎯</span>
          {!isMobile && (
            <span
              style={{ fontWeight: 900, fontSize: "15px", color: "#f1f5f9" }}
            >
              {BRAND_NAME}
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
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "48px 24px" : "20px 48px",
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
            order: 1,
            marginTop: isMobile ? "20px" : 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "99px",
              marginBottom: "16px",
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
              fontSize: isMobile ? "15px" : "16px",
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 0 20px",
              maxWidth: "480px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease 0.5s",
            }}
          >
            {HERO_SUBTITLE}
          </p>
          <div
            style={{
              marginBottom: "12px",
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
              marginBottom: "32px",
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
                color: "#94a3b8",
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
                <div style={{ fontSize: "20px", fontWeight: 900, color }}>
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
            order: 2,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Feature Highlight Text */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "16px",
              background: "rgba(52,211,153,0.03)",
              borderLeft: "4px solid #34d399",
              opacity: infoFading ? 0 : 1,
              transform: infoFading ? "translateY(5px)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "20px" }}>{FEATURES[activeFeature].icon}</span>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  margin: 0,
                }}
              >
                {FEATURES[activeFeature].label}
              </h3>
            </div>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              {FEATURES[activeFeature].desc}
            </p>
          </div>

          <AppMockup activeFeature={activeFeature} isMobile={isMobile} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            {FEATURES.map((f, i) => {
              const isActive = activeFeature === i;
              return (
                <button
                  key={f.label}
                  onClick={() => {
                    setActiveFeature(i);
                    setPaused(true);
                  }}
                  style={{
                    padding: "12px 8px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.08))"
                      : "rgba(15,23,42,0.45)",
                    border: isActive
                      ? "1.5px solid rgba(52,211,153,0.45)"
                      : "1.5px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                    outline: "none",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isActive ? "scale(1.02)" : "none",
                    boxShadow: isActive ? "0 4px 12px rgba(52,211,153,0.1)" : "none",
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                    {f.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: isActive ? "#34d399" : "#64748b",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {f.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <ValuePropSection visible={visible} isMobile={isMobile} />
      <PainPointsSection visible={visible} isMobile={isMobile} />
      <FullFeaturesSection visible={visible} isMobile={isMobile} />
      <AudienceSection visible={visible} isMobile={isMobile} />
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
      <AppFooter />
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
