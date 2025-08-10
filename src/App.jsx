import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useScroll,
  MotionConfig,
} from "framer-motion";
import {
  Check,
  Sparkles,
  Camera,
  MessageCircle,
  CreditCard,
  ArrowRight,
  Download,
  Apple,
  MonitorSmartphone,
  Globe,
} from "lucide-react";

// ====== Brand / Logo config ======
// ضع رابط Cloudflare Images في متغير البيئة VITE_LOGO_URL
// مثال: https://imagedelivery.net/ACCOUNT_HASH/IMAGE_ID/public
const LOGO_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_LOGO_URL)
  ? import.meta.env.VITE_LOGO_URL
  : "https://imagedelivery.net/ACCOUNT_HASH/IMAGE_ID/public";

function Logo({ className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="LEADGRESS logo"
      className={`h-8 w-auto ${className}`}
      loading="eager"
    />
  );
}

// Single-file React + Framer Motion landing page (RTL, Arabic)
// Inspired by wisprflow-style smooth UI animations (no 3D):
// - Smooth scroll reveals (Word-by-word text reveal)
// - Micro-interactions (magnetic buttons, hover shadows)
// - Voice demo mockup (waveform + typing transcript)
// - Parallax on hero content
// Global spring is tuned via <MotionConfig> to feel buttery-smooth.

export default function FitnessTrainerFramerLanding() {
  return (
    <MotionConfig transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}>
      <div dir="rtl" className="min-h-screen bg-[#0a0f16] text-slate-100 selection:bg-cyan-300/30 scroll-smooth">
        <ScrollProgress />
        <NeonBackdrop />
        <CursorGlow />
        <HeaderMinimal />
        <main className="relative">
          <HeroInspired />
          <HooksBar />
          <PlatformBadges />
          <VoiceDemoMockup />
          <HowItWorks />
          <UseCasesRail />
          <SocialProof />
          <CTARepeat />
          <MinimalFeatures />
          <PricingInspired />
          <FAQAccordion />
          <LeadForm />
          <StickyCTA />
          <SmokeTests />
        </main>
        <FooterMinimal />
      </div>
    </MotionConfig>
  );
}

/* -------------------------- Top scroll progress bar ---------------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-cyan-400 to-indigo-500"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

/* ------------------------- Visual Backdrop (soft gradients) -------------- */
function NeonBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <div className="absolute -top-24 -right-24 h-[55vh] w-[55vh] rounded-full bg-cyan-500/14 blur-3xl" />
      <div className="absolute bottom-0 left-[-10%] h-[60vh] w-[60vh] rounded-full bg-indigo-500/18 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-10%,rgba(59,130,246,.12),transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}

/* --------------------------- Cursor glow follower ------------------------- */
function CursorGlow() {
  const x = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 });
  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -z-10 h-80 w-80 rounded-full"
      style={{
        x: useTransform(x, (v) => v - 160),
        y: useTransform(y, (v) => v - 160),
        background: "radial-gradient(closest-side, rgba(34,211,238,.30), transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ------------------------------- Utilities -------------------------------- */
function MagneticButton({ className = "", children, as: Comp = "a", ...props }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 250, damping: 20, mass: 0.4 });
  function onMove(e) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    mx.set(Math.max(-12, Math.min(12, dx * 0.15)));
    my.set(Math.max(-12, Math.min(12, dy * 0.15)));
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }
  const style = { x: sx, y: sy, willChange: "transform" };
  return (
    <motion.span className="inline-block" style={{ perspective: 600 }}>
      <motion.span style={{ rotateX: sy, rotateY: sx }}>
        <Comp
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={className}
          style={{ transform: "translateZ(0)" }}
          {...props}
        >
          <motion.span style={style} className="inline-flex items-center gap-2">
            {children}
          </motion.span>
        </Comp>
      </motion.span>
    </motion.span>
  );
}

/* ------------------------------- Header ---------------------------------- */
function HeaderMinimal() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo className="h-10" />
          <div>
            <div className="font-extrabold tracking-wide">LEADGRESS</div>
            <div className="text-xs text-slate-400">منصة تدريب وإدارة العملاء</div>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <a href="#how" className="hover:text-white">كيف يعمل؟</a>
          <a href="#features" className="hover:text-white">المميزات</a>
          <a href="#pricing" className="hover:text-white">الأسعار</a>
        </nav>
        <MagneticButton
          as="a"
          href="#lead"
          className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10 border border-white/10"
        >
          انضم مبكراً <ArrowRight className="h-4 w-4" />
        </MagneticButton>
      </div>
    </header>
  );
}

/* ---------------------- Text reveal (word-by-word) ----------------------- */
function WordReveal({ text, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: "1em", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
          transition={{ delay: delay + i * 0.03, duration: 0.5 }}
          className="inline-block"
        >
          {w}{" "}
        </motion.span>
      ))}
    </span>
  );
}

/* ---------------------------------- Hero --------------------------------- */
function HeroInspired() {
  const { scrollYProgress } = useScroll({ offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div style={{ y: y1 }} className="text-center md:text-right">
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              <WordReveal text="لا تُضِع وقتك في الإدارة —" />
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                <WordReveal text="درّب فقط" delay={0.3} />
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              <WordReveal text="منصة موحّدة لإدارة العملاء، البرامج، والمدفوعات — بسرعة وأناقة." delay={0.5} />
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <MagneticButton
                as="a"
                href="#lead"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 font-extrabold text-slate-900 shadow-[0_14px_32px_rgba(34,211,238,.28)]"
              >
                جرّب مجانًا <Download className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton as="a" href="#pricing" className="rounded-xl border border-white/10 px-5 py-3 text-slate-100 hover:bg-white/5">
                الخطط والأسعار
              </MagneticButton>
            </div>
          </motion.div>

          {/* Minimal mock cards */}
          <motion.div style={{ y: y2 }} className="relative space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-xs text-slate-400">الرصيد</div>
              <div className="text-2xl font-black">$92,250</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "70%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-xs text-slate-400">آخر 30 يوم</div>
              <TinySparkline />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TinySparkline() {
  return (
    <svg viewBox="0 0 100 30" className="mt-2 h-16 w-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        d="M0,20 C10,10 20,25 30,18 C40,8 50,22 60,14 C70,9 85,18 100,12"
        stroke="url(#g)"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

/* --------------------------- Voice demo mockup ---------------------------- */
function VoiceDemoMockup() {
  const samples = [
    "صباح الخير كوتش، أبغى برنامج قوة علشان أزيد عضل وأحافظ على الوزن.",
    "غيّر الجدول لثلاثة أيام تمارين وركّز على السكوات والدِدلفت.",
    "ذكّرني بتمارين الكارديو يومين بالأسبوع وارسل الخطة على واتساب.",
  ];
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let idx = 0;
    const text = samples[i];
    const id = setInterval(() => {
      idx++;
      setTyped(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(id);
        setTimeout(() => setI((s) => (s + 1) % samples.length), 1200);
      }
    }, 28);
    return () => clearInterval(id);
  }, [i]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            {/* Browser chrome mock */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <div className="mx-2 h-6 flex-1 rounded bg-slate-900/40" />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {/* Voice waveform */}
              <div className="col-span-2">
                <div className="grid h-40 grid-cols-12 items-end gap-1 rounded-lg border border-white/10 bg-slate-900/40 p-2">
                  {Array.from({ length: 12 }).map((_, k) => (
                    <motion.div
                      key={k}
                      initial={{ height: 6 }}
                      animate={{ height: [8, 28 + (k % 4) * 6, 12] }}
                      transition={{ duration: 1 + (k % 5) * 0.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                      className="w-full rounded bg-gradient-to-b from-cyan-400 to-indigo-500"
                    />
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-400">تحويل الصوت إلى نص — مباشر</div>
              </div>

              {/* Transcript typing */}
              <div className="col-span-3">
                <div className="h-40 overflow-hidden rounded-lg border border-white/10 bg-slate-900/40 p-3 text-sm leading-7 text-slate-200">
                  <span className="text-cyan-300">You:</span> {typed}
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-cyan-300/80 align-middle" />
                  <div className="mt-2 text-xs text-slate-400">ASR → فهم سياقي → اقتراحات</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {["تحليل AI", "برنامج أسبوعي", "مشاركة واتساب"].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="self-center text-center md:text-right"
          >
            <h3 className="text-2xl font-extrabold">
              <WordReveal text="اعرض ميزتك بصريًا — بدون كلام كثير" />
            </h3>
            <p className="mt-2 text-slate-300">
              <WordReveal text="موك أب بسيط يوضّح التحويل من صوت إلى نص، مع حركة مستمرة وتفاعل صغير." delay={0.2} />
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <MagneticButton as="a" href="#lead" className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 font-extrabold text-slate-900">
                انضم للتسجيل المبكر
              </MagneticButton>
              <MagneticButton as="a" href="#pricing" className="rounded-xl border border-white/10 px-5 py-3 text-slate-100 hover:bg-white/5">
                شاهد الخطط
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- How it works (explain) --------------------- */
function SectionHeading({ kicker, title, sub }) {
  return (
    <div className="mx-auto max-w-3xl text-center mb-8">
      {kicker && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" /> {kicker}
        </div>
      )}
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {sub && <p className="mt-2 text-slate-300">{sub}</p>}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Camera, title: "ارفع البيانات", desc: "سجّل العملاء، القياسات، وصور التقدم بسهولة." },
    { icon: Sparkles, title: "تحليل ذكي", desc: "Gemini AI يقترح خطط تدريب وغذاء مخصصة." },
    { icon: MessageCircle, title: "تواصل تلقائي", desc: "تذكيرات وتجديدات عبر WhatsApp دون تعب." },
    { icon: CreditCard, title: "قبول المدفوعات", desc: "Moyasar لمدى و Apple Pay مع فواتير منظمة." },
  ];
  return (
    <section id="how" className="py-16">
      <SectionHeading kicker="كيف يعمل النظام" title="من التسجيل إلى النتائج في أربع خطوات" sub="سير عمل مبسّط يركز على النتيجة وتوفير الوقت." />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1 text-sm">
              <s.icon className="h-4 w-4 text-cyan-300" />
              <span className="font-bold">{s.title}</span>
            </div>
            <p className="text-sm text-slate-300">{s.desc}</p>
            <div className="absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-900 font-black">{i + 1}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Hooks bar -------------------------------- */
function HooksBar() {
  const hooks = [
    "وفّر وقتك الإداري 8+ ساعات/أسبوع",
    "ارفع الاحتفاظ بالعملاء بـالتذكيرات الذكية",
    "قبول مدفوعات آمنة خلال ثوانٍ",
    "تقارير قبل/بعد تلقائية تزيد ثقة العميل",
    "قوالب جاهزة للبرامج الغذائية والتدريبية",
  ];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/5">
      <motion.div
        className="flex min-w-max gap-6 py-3 text-sm text-slate-200"
        animate={{ x: [0, -600] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {[...hooks, ...hooks].map((t, i) => (
          <span key={i} className="shrink-0 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1">{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------ Social proof ------------------------------ */
function Counter({ to = 100, duration = 1.4, formatter = (n) => n.toString() }) {
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    const controls = animate(mv, to, { duration, ease: "easeOut" });
    const unsub = mv.on("change", (val) => setV(val));
    return () => { controls.stop(); unsub(); };
  }, [to, duration]);
  return <span>{formatter(Math.round(v))}</span>;
}

function SocialProof() {
  return (
    <section className="py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 md:grid-cols-3">
        {[
          { label: "مدرب على قائمة الانتظار", to: 1200 },
          { label: "صورة تقدّم محلّلة", to: 34000 },
          { label: "نسبة رضا", to: 96, formatter: (n) => n + "%" },
        ].map((it) => (
          <div key={it.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-3xl font-black text-white"><Counter to={it.to} duration={1.8} formatter={it.formatter || ((n)=>n)} /></div>
            <div className="mt-1 text-sm text-slate-300">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */
function FAQAccordion() {
  const items = [
    { q: "هل فيه نسخة للعميل؟", a: "نعم ضمن خارطة الطريق—تطبيق عميل مع تتبع تقدّم وإشعارات." },
    { q: "هل تدعمون الضرائب والفواتير؟", a: "نصدر فواتير مع ضريبة 15% ورمز QR وسجل مدفوعات." },
    { q: "طرق الدفع؟", a: "Moyasar: مدى و Apple Pay مع تشفير كامل." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-12">
      <SectionHeading kicker="أسئلة متكررة" title="كل شيء واضح من البداية" />
      <div className="mx-auto max-w-3xl px-6">
        {items.map((it, i) => (
          <motion.div key={i} className="border-b border-white/10 py-4">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between text-right">
              <span className="text-slate-100">{it.q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-cyan-300">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2 text-sm text-slate-300">
                  {it.a}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Sticky CTA bar ---------------------------- */
function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const lead = document.getElementById("lead");
      const inLead = lead ? lead.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      setShow(y > 500 && !inLead);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-slate-900/80 p-3 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="text-sm text-slate-200">جاهز تبدأ؟ سجّل للحصول على خصم المؤسسين.</div>
            <div className="flex gap-2">
              <MagneticButton as="a" href="#pricing" className="rounded-lg border border-white/10 px-4 py-2">شاهد الأسعار</MagneticButton>
              <MagneticButton as="a" href="#lead" className="rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 font-extrabold text-slate-900">سجّل الآن</MagneticButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------- Platform Badges row ------------------------- */
function PlatformBadges() {
  const items = [
    { icon: Globe, label: "ويب (PWA)" },
    { icon: MonitorSmartphone, label: "لوحة المدرب" },
    { icon: Apple, label: "iOS قريبًا" },
  ];
  return (
    <div className="border-y border-white/10 bg-white/5">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-6 px-4 py-3 text-slate-300/90">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-sm">
            <it.icon className="h-4 w-4 text-cyan-300" /> {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Use-cases rail ---------------------------- */
function UseCasesRail() {
  const cases = [
    { icon: Camera, title: "صور تقدّم + AI", desc: "قارن قبل/بعد واقتراحات تلقائية." },
    { icon: MessageCircle, title: "تذكيرات واتساب", desc: "مواعيد، تجديدات، رسائل تحفيز." },
    { icon: CreditCard, title: "فوترة Moyasar", desc: "مدى + Apple Pay بفواتير إلكترونية." },
  ];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, rotate: -0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 will-change-transform"
            >
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1 text-sm">
                <c.icon className="h-4 w-4 text-cyan-300" />
                <span className="font-bold">{c.title}</span>
              </div>
              <p className="text-slate-300">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CTA repeat ------------------------------- */
function CTARepeat() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
        >
          <Sparkles className="h-4 w-4 text-cyan-300" /> جاهز تبدأ؟ سجّل مجانًا وخلك من التعقيد.
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ Minimal features -------------------------- */
function MinimalFeatures() {
  const feats = [
    { title: "إدارة العملاء", items: ["سجل شامل", "أهداف", "قياسات"] },
    { title: "البرامج التدريبية", items: ["مجموعات/تكرارات", "جدولة", "قوالب"] },
    { title: "الوجبات", items: ["سعرات", "مغذيات كبرى", "بدائل"] },
  ];
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-6 text-2xl font-extrabold">كل شيء في مكان واحد</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {feats.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-slate-200">{f.title}</div>
              <ul className="mt-2 space-y-1 text-slate-300">
                {f.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Pricing -------------------------------- */
function PricingInspired() {
  const [yearly, setYearly] = useState(false);
  const priceMv = useMotionValue(199);
  const [price, setPrice] = useState(199);
  useEffect(() => {
    const controls = animate(priceMv, yearly ? 1999 : 199, { duration: 0.6, ease: "easeInOut" });
    const unsub = priceMv.on("change", (v) => setPrice(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [yearly]);

  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-5 flex items-center justify-center gap-2 text-sm">
          <span className={!yearly ? "font-extrabold" : "text-slate-300"}>شهري</span>
          <button onClick={() => setYearly((s) => !s)} className="relative h-8 w-16 rounded-full border border-white/10 bg-slate-900/60">
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`absolute top-1 h-6 w-6 rounded-full bg-white ${yearly ? "left-1" : "right-1"}`}
            />
          </button>
          <span className={yearly ? "font-extrabold" : "text-slate-300"}>سنوي</span>
          <span className="text-xs text-cyan-300">خصم المؤسسين</span>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          <PriceCard
            title="Basic"
            price={yearly ? "999 ر.س/سنة" : "99 ر.س/شهر"}
            list={["حتى 25 عميل", "لوحة أساسية", "فوترة", "دعم بريد"]}
            subtle
          />

          <motion.div
            whileHover={{ y: -8, scale: 1.005 }}
            className="relative rounded-2xl border border-cyan-300/30 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,229,255,.12)]"
          >
            <div className="absolute -top-3 left-4 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-2 py-1 text-xs font-bold text-slate-900">
              الأكثر طلبًا
            </div>
            <div className="text-sm text-slate-300">Growth</div>
            <div className="mt-1 text-3xl font-black">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={yearly ? "y" : "m"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {yearly ? "1999 ر.س/سنة" : "199 ر.س/شهر"}
                </motion.span>
              </AnimatePresence>
            </div>
            <ul className="mt-3 space-y-2 text-slate-300">
              {["حتى 100 عميل", "تحليل صور AI", "تكامل WhatsApp", "PWA"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" /> {t}
                </li>
              ))}
            </ul>
            <MagneticButton
              as="a"
              href="#lead"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 font-extrabold text-slate-900"
            >
              ابدأ الآن <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <PriceCard title="Pro" price={yearly ? "3999 ر.س/سنة" : "399 ر.س/شهر"} list={["غير محدود", "تحليلات AI متقدمة", "تطبيق مخصص", "دعم 24/7"]} />
        </div>
        <div className="mt-2 text-center text-xs text-slate-400">
          * الأسعار تمهيدية وقد تتغيّر عند الإطلاق الرسمي.
        </div>
      </div>
    </section>
  );
}

function PriceCard({ title, price, list, subtle }) {
  return (
    <motion.div whileHover={{ y: -6 }} className={`rounded-2xl border ${subtle ? "border-white/10" : "border-white/10"} bg-white/5 p-5`}>
      <div className="text-sm text-slate-300">{title}</div>
      <div className="mt-1 text-3xl font-black">{price}</div>
      <ul className="mt-3 space-y-2 text-slate-300">
        {list.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-cyan-300" /> {t}
          </li>
        ))}
      </ul>
      <MagneticButton as="a" href="#lead" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2">
        جرّبه الآن
      </MagneticButton>
    </motion.div>
  );
}

/* -------------------------------- Lead form ------------------------------ */
function LeadForm() {
  const [ok, setOk] = useState(false);
  function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const valid =
      data.name &&
      typeof data.email === "string" &&
      data.email.includes("@") &&
      data.email.includes(".") &&
      data.email.length > 5;
    if (!valid) return alert("فضلاً أدخل اسمًا وبريدًا صحيحين");
    const leads = JSON.parse(localStorage.getItem("ftm_leads") || "[]");
    leads.push({ ...data, createdAt: new Date().toISOString(), view: "waitlist", product: "FitnessTrainerMVP" });
    localStorage.setItem("ftm_leads", JSON.stringify(leads));
    setOk(true);
    e.currentTarget.reset();
  }
  return (
    <section id="lead" className="py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-extrabold">سجّل لتجربة مبكرة</h2>
        <form onSubmit={onSubmit} className="mx-auto grid max-w-xl grid-cols-1 gap-3">
          <Input name="name" placeholder="الاسم الكامل" />
          <Input name="email" placeholder="you@example.com" type="email" />
          <Input name="phone" placeholder="05xxxxxxxx" />
          <button className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 font-extrabold text-slate-900">انضم الآن</button>
        </form>
        <AnimatePresence>
          {ok && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-cyan-200"
            >
              تم الاستلام — بنوافيك بالتجربة 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
    />
  );
}

/* --------------------------------- Footer -------------------------------- */
function FooterMinimal() {
  return (
    <footer className="border-t border-white/10 bg-white/5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center md:flex-row md:justify-between md:text-right">
        <div>
          <div className="font-extrabold">FitnessTrainerMVP</div>
          <div className="text-xs text-slate-400">© {new Date().getFullYear()} جميع الحقوق محفوظة.</div>
        </div>
        <div className="text-sm text-slate-300">مستوحى بصريًا من بساطة الصفحات ذات التركيز العالي على القيمة والـCTA.</div>
      </div>
    </footer>
  );
}

/* ------------------------------- Smoke tests ------------------------------ */
function SmokeTests() {
  useEffect(() => {
    try {
      // core components exist
      console.assert(typeof MotionConfig === "function", "MotionConfig should be imported");
      console.assert(typeof motion !== "undefined", "framer-motion 'motion' should be available");
      console.assert(typeof NeonBackdrop === "function", "NeonBackdrop should be a function");
      console.assert(typeof CursorGlow === "function", "CursorGlow should be a function");
      console.assert(typeof HeaderMinimal === "function", "HeaderMinimal should be a function");
      console.assert(typeof VoiceDemoMockup === "function", "VoiceDemoMockup should be a function");
      console.assert(typeof HowItWorks === "function", "HowItWorks should be a function");
      console.assert(typeof HooksBar === "function", "HooksBar should be a function");
      console.assert(typeof SocialProof === "function", "SocialProof should be a function");
      console.assert(typeof FAQAccordion === "function", "FAQAccordion should be a function");
      console.assert(typeof StickyCTA === "function", "StickyCTA should be a function");
      console.assert(typeof PricingInspired === "function", "PricingInspired should be a function");
      console.assert(typeof PriceCard === "function", "PriceCard should be a function");
      console.assert(typeof LeadForm === "function", "LeadForm should be a function");
      // WordReveal basic test
      const wr = WordReveal({ text: "اختبار بسيط" });
      console.assert(!!wr, "WordReveal should return JSX");
      console.log("Smoke tests passed ✅");
    } catch (e) {
      console.error("Smoke tests failed:", e);
    }
  }, []);
  return null;
}
