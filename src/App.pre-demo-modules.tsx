import {
  ArrowRight,
  AudioLines,
  Check,
  Code2,
  FileImage,
  Globe2,
  LockKeyhole,
  Menu,
  ScanFace,
  ShieldCheck,
  Video,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import PixelBlastBackdrop from './components/PixelBlastBackdrop';

const pixelPatterns = {
  scan: ['1100011', '1000001', '0011100', '0100010', '0100010', '1000001', '1100011'],
  shield: ['0011100', '0111110', '1101011', '1100011', '0110110', '0011100', '0001000'],
  wave: ['0010000', '0010100', '1010101', '1111111', '1010101', '0010100', '0010000'],
  node: ['0001000', '0011100', '0110110', '1100011', '0110110', '0011100', '0001000'],
} as const;

type PixelPattern = keyof typeof pixelPatterns;

function PixelGlyph({ pattern = 'node', label }: { pattern?: PixelPattern; label?: string }) {
  return (
    <span className="pixel-glyph" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {pixelPatterns[pattern].join('').split('').map((pixel, index) => (
        <i className={pixel === '1' ? 'lit' : ''} key={index} />
      ))}
    </span>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: '98.2%', label: 'Detection accuracy' },
  { value: '<4 sec', label: 'Forensic verdict' },
  { value: '3', label: 'Media types, one API' },
];

const stackFeatures = [
  {
    title: 'On-device',
    copy: 'Detect face swaps during live calls without recording or uploading the conversation.',
    icon: ScanFace,
  },
  {
    title: 'Detection API',
    copy: 'Inspect images, video, and audio with one integration and one consistent verdict.',
    icon: Code2,
  },
  {
    title: 'Eva intelligence',
    copy: 'Fast screening and forensic-grade analysis that evolves as generative models change.',
    icon: Zap,
  },
];

const solutions = [
  {
    title: 'Visual detection',
    tag: 'IMAGE · VIDEO',
    copy: 'Find face swaps, AI-generated imagery, lip sync, and manipulated video in seconds.',
    icon: FileImage,
  },
  {
    title: 'Voice & audio',
    tag: 'REAL-TIME AUDIO',
    copy: 'Identify voice clones and synthetic speech before they reach an agent or customer.',
    icon: AudioLines,
  },
  {
    title: 'Halo',
    tag: 'ON-DEVICE · QUALCOMM',
    copy: 'Bring private, real-time deepfake protection to Zoom, Teams, Meet, and the edge.',
    icon: ShieldCheck,
  },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Scam AI home">
      <span className="brand-mark" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <i key={index} style={{ transform: `rotate(${index * 30}deg)` }} />
        ))}
      </span>
      <span>scam.ai</span>
    </a>
  );
}

function Header() {
  return (
    <>
      <a className="announcement" href="#halo">
        Halo brings real-time deepfake detection on-device with Qualcomm
        <ArrowRight size={15} strokeWidth={1.7} />
      </a>
      <header className="site-header">
        <div className="nav-shell">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#platform">Platform</a>
            <a href="#solutions">Solutions</a>
            <a href="#developers">Developers</a>
            <a href="#trust">Trust</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-link" href="https://docu.scam.ai">
              Docs
            </a>
            <a className="button button-ghost button-small" href="https://cal.com/scamai/15min">
              Talk to an expert
            </a>
            <a className="button button-primary button-small" href="https://app.scam.ai">
              Start free
            </a>
          </div>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">
              <Menu size={24} />
            </summary>
            <nav>
              <a href="#platform">Platform</a>
              <a href="#solutions">Solutions</a>
              <a href="#developers">Developers</a>
              <a href="#trust">Trust</a>
              <a href="https://app.scam.ai">Start free</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const heroLines = [
    <>Verify what’s real,</>,
    <>across <em>every screen.</em></>,
    <>One unified platform.</>,
  ];

  return (
    <section className="hero" id="top">
      <ParticleCanvas />
      <div className="hero-fade" />
      <motion.div
        className="hero-scan"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ['-15%', '115%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="corner corner-top-left" />
      <div className="corner corner-top-right" />
      <div className="corner corner-bottom-left" />
      <div className="corner corner-bottom-right" />

      <div className="shell hero-layout">
        <div className="hero-copy">
          <motion.span
            className="eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <PixelGlyph pattern="scan" />
            AI trust infrastructure
          </motion.span>
          <h1>
            {heroLines.map((line, index) => (
              <motion.span
                className="hero-line"
                initial={reduceMotion ? false : { opacity: 0, y: 46 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.82, delay: 0.16 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                key={index}
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          className="hero-aside"
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>
            Deepfakes and voice clones now appear inside video calls, private messages, and every screen you trust.
            Scam AI detects them in real time—before imitation passes as identity.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="https://app.scam.ai">
              <ShieldCheck size={17} />
              Start detecting
            </a>
            <a className="button button-ghost" href="https://cal.com/scamai/15min">
              Talk to an AI engineer
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-status"
          aria-label="Live verification status"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: [0, -7, 0] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  opacity: { duration: 0.6, delay: 0.65 },
                  scale: { duration: 0.6, delay: 0.65 },
                  y: { duration: 6, delay: 1.3, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="status-head">
            <span className="status-live">
              <i />
              Live verification
            </span>
            <span>00:04</span>
          </div>
          <div className="status-person">
            <span className="status-avatar">
              <ScanFace size={22} />
            </span>
            <div>
              <strong>Identity signal</strong>
              <span>Face + voice analysis</span>
            </div>
            <span className="status-safe">Verified</span>
          </div>
          <div className="signal-bars" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, index) => (
              <motion.i
                animate={reduceMotion ? undefined : { scaleY: [0.55, 1, 0.72] }}
                transition={{ duration: 1.5 + (index % 4) * 0.22, repeat: Infinity, ease: 'easeInOut' }}
                key={index}
                style={{ height: `${18 + ((index * 17) % 31)}%`, transformOrigin: 'bottom' }}
              />
            ))}
          </div>
        </motion.div>

        <div className="hero-stats">
          {stats.map((stat, index) => (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.72 + index * 0.08 }}
              key={stat.label}
            >
              <PixelGlyph pattern={(['shield', 'wave', 'node'] as PixelPattern[])[index]} />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const logos = ['QUALCOMM', 'HP', 'LG U+', 'BERKELEY', 'TRULIOO', 'SBI'];

  return (
    <section className="trust-strip" aria-label="Trusted by teams from">
      <p>Trusted by teams from</p>
      <div className="logo-marquee">
        <div className="logo-track">
          {[...logos, ...logos].map((logo, index) => (
            <span key={`${logo}-${index}`}>
              <PixelGlyph pattern={index % 2 ? 'node' : 'scan'} />
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBreak() {
  return (
    <section className="editorial-break">
      <Reveal className="shell editorial-lines">
        <p>Deepfakes scale with compute.</p>
        <p>
          <em>Trust shouldn’t depend on guesswork.</em>
        </p>
        <p>Verify before identity becomes the attack surface.</p>
      </Reveal>
    </section>
  );
}

function Platform() {
  const reduceMotion = useReducedMotion();
  const cardMotion = (index: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 32 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] as const },
    whileHover: reduceMotion ? undefined : { y: -8 },
  });

  return (
    <section className="section shell" id="platform">
      <Reveal className="section-heading centered">
        <span className="eyebrow">
          <PixelGlyph pattern="node" />
          01 / Detection layer
        </span>
        <h2>
          <em className="display-serif">One trust signal.</em>
          <br />
          Every kind of synthetic media.
        </h2>
        <p>
          A unified verification layer for high-stakes identity, content, and communication—optimized from device
          to API.
        </p>
      </Reveal>

      <div className="platform-grid">
        <motion.article className="platform-card" {...cardMotion(0)}>
          <div>
            <span className="card-index">01 / ACCURACY</span>
            <h3>Forensic confidence, fast.</h3>
            <p>Eva-v1 returns an explainable verdict in under four seconds.</p>
          </div>
          <div className="accuracy-visual" aria-label="98.2 percent detection accuracy">
            <strong>98.2%</strong>
            <span>Detection accuracy</span>
            <svg viewBox="0 0 320 110" role="img" aria-label="Accuracy performance line">
              <path d="M0 88 C45 84 61 80 96 75 C143 68 154 68 189 52 C224 37 257 42 320 14" />
              <path className="chart-fill" d="M0 88 C45 84 61 80 96 75 C143 68 154 68 189 52 C224 37 257 42 320 14 L320 110 L0 110 Z" />
            </svg>
          </div>
        </motion.article>

        <motion.article className="platform-card" {...cardMotion(1)}>
          <div>
            <span className="card-index">02 / COVERAGE</span>
            <h3>Every medium. One API.</h3>
            <p>Detect generated and manipulated content without stitching tools together.</p>
          </div>
          <div className="media-visual" aria-label="Image, video, and audio detection">
            <span>
              <FileImage size={27} />
              Image
            </span>
            <span>
              <Video size={27} />
              Video
            </span>
            <span>
              <AudioLines size={27} />
              Audio
            </span>
            <i />
            <b>
              <PixelGlyph pattern="shield" label="Verified" />
            </b>
          </div>
        </motion.article>

        <motion.article className="platform-card" {...cardMotion(2)}>
          <div>
            <span className="card-index">03 / PRIVACY</span>
            <h3>Detection stays on-device.</h3>
            <p>Halo flags synthetic faces during the call. No recording. No upload.</p>
          </div>
          <div className="device-visual">
            <div>
              <span>LIVE CALL</span>
              <ScanFace size={62} />
              <strong>Verified locally</strong>
            </div>
      
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function UnifiedStack() {
  const reduceMotion = useReducedMotion();
  const stackPatterns: PixelPattern[] = ['scan', 'node', 'shield'];

  return (
    <section className="dark-section" id="halo">
      <PixelBlastBackdrop color="#03A9F4" pixelSize={6} speed={0.32} density={0.27} />
      <div className="shell">
        <span className="section-code">02 / Unified stack</span>
        <Reveal className="dark-intro">
          <h2>
            Built for the whole threat.
            <br />A unified detection stack giving you control.
          </h2>
          <div>
            <p>
              Most detection products solve one format in one place. That leaves gaps between the call, the file,
              and the decision.
            </p>
            <p>
              Scam AI connects on-device protection, multimodal detection, and forensic intelligence in one
              platform—from live conversations to API-scale review.
            </p>
          </div>
        </Reveal>

        <div className="stack-grid">
          <div className="stack-features">
            {stackFeatures.map((feature, index) => {
              return (
                <motion.article
                  className={index === 0 ? 'active' : ''}
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  whileHover={reduceMotion ? undefined : { x: 7 }}
                  transition={{ duration: 0.62, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  key={feature.title}
                >
                  <div>
                    <PixelGlyph pattern={stackPatterns[index]} />
                    <h3>{feature.title}</h3>
                    <span>0{index + 1}</span>
                  </div>
                  <p>{feature.copy}</p>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            className="stack-visual"
            aria-label="Scam AI unified detection stack"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stack-orbit orbit-one" />
            <div className="stack-orbit orbit-two" />
            <motion.div
              className="stack-layer stack-layer-top"
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>YOUR WORKFLOW</span>
              Calls · Uploads · API
            </motion.div>
            <motion.div
              className="stack-layer stack-layer-middle"
              animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>SCAM AI</span>
              Unified trust signal
            </motion.div>
            <motion.div
              className="stack-layer stack-layer-bottom"
              animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>EVA INTELLIGENCE</span>
              Fast + forensic models
            </motion.div>
            <div className="stack-badge">
              <PixelGlyph pattern="shield" label="Scam AI verified signal" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const reduceMotion = useReducedMotion();
  const solutionPatterns: PixelPattern[] = ['scan', 'wave', 'shield'];

  return (
    <section className="section shell" id="solutions">
      <Reveal className="section-heading split-heading">
        <div>
          <span className="eyebrow">
            <PixelGlyph pattern="scan" />
            03 / Detection solutions
          </span>
          <h2>Verify media wherever trust matters.</h2>
        </div>
        <p>
          Protect onboarding, communications, customer support, and content with the same detection infrastructure.
        </p>
      </Reveal>

      <div className="solution-grid">
        {solutions.map((solution, index) => {
          return (
            <motion.a
              className="solution-card"
              href="https://www.scam.ai/products/ai-detection"
              initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 26 : -26 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.68, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              key={solution.title}
            >
              <span className="solution-icon">
                <PixelGlyph pattern={solutionPatterns[index]} />
              </span>
              <span className="solution-name">
                <span className="solution-tag">{solution.tag}</span>
                <h3>{solution.title}</h3>
              </span>
              <p>{solution.copy}</p>
              <span className="learn-link">
                Learn more <ArrowRight size={16} />
              </span>
            </motion.a>
          );
        })}
      </div>

      {/* <Reveal className="industry-bar">
        <span>Built for your industry</span>
        <a href="https://www.scam.ai/solutions/fintech">Financial services</a>
        <a href="https://www.scam.ai/solutions/call-centers">Call centers</a>
        <a href="https://www.scam.ai/solutions/hr">Hiring</a>
        <a href="https://www.scam.ai/solutions/media">Media</a>
        <a href="https://www.scam.ai/solutions/kyc">KYC</a>
      </Reveal> */}
    </section>
  );
}

function Developers() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section shell developer-section" id="developers">
      <Reveal className="developer-copy">
        <span className="eyebrow">
          <PixelGlyph pattern="node" />
          04 / Built for developers
        </span>
        <h2>One request. A trusted verdict.</h2>
        <p>
          Add deepfake, synthetic media, and voice-clone detection without rebuilding your workflow. Start with 200
          free images every month.
        </p>
        <ul>
          <li>
            <Check size={17} /> Image, video, and audio
          </li>
          <li>
            <Check size={17} /> Confidence scores and analysis
          </li>
          <li>
            <Check size={17} /> Webhooks for asynchronous media
          </li>
        </ul>
        <div className="button-row">
          <a className="button button-primary" href="https://docu.scam.ai">
            Read the docs
          </a>
          <a className="button button-ghost" href="https://app.scam.ai">
            Get an API key
          </a>
        </div>
      </Reveal>

      <motion.div
        className="code-card"
        initial={reduceMotion ? false : { opacity: 0, rotateX: 5, y: 30 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { y: -5 }}
      >
        <div className="code-head">
          <span>
            <i />
            <i />
            <i />
          </span>
          <b>API request</b>
          <span>cURL</span>
        </div>
        <pre>
          <code>
            <span className="code-comment"># Detect synthetic media</span>
            {'\n'}
            <span className="code-purple">curl</span> --request POST \{'\n'}
            {'  '}--url https://api.scam.ai/v1/detect \{'\n'}
            {'  '}--header <span className="code-green">'Authorization: Bearer API_KEY'</span> \{'\n'}
            {'  '}-F <span className="code-green">'file=@suspect_image.jpg'</span>
            {'\n\n'}
            <span className="code-comment"># Response</span>
            {'\n'}
            {'{'}
            {'\n  '}
            <span className="code-blue">"verdict"</span>: <span className="code-green">"synthetic"</span>,{'\n  '}
            <span className="code-blue">"confidence"</span>: <span className="code-orange">0.982</span>,{'\n  '}
            <span className="code-blue">"processing_time"</span>: <span className="code-orange">1.2</span>
            {'\n}'}
          </code>
        </pre>
        <div className="code-result">
          <span>
            <ShieldCheck size={18} /> Analysis complete
          </span>
          <strong>98.2% synthetic</strong>
        </div>
      </motion.div>
    </section>
  );
}

function Trust() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section shell" id="trust">
      <div className="proof-grid">
        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">
            <PixelGlyph pattern="node" />
            05 / Transparent pricing
          </span>
          <h2>Use what you need. Pay for what you use.</h2>
          <p>Start with 200 free image analyses every month. Scale at $0.05 per image with no setup fee.</p>
          <a className="learn-link" href="https://www.scam.ai/pricing">
            See pricing <ArrowRight size={16} />
          </a>
          <div className="price-ticket">
            <span>Eva-v1 Fast</span>
            <strong>$0.05</strong>
            <small>per image after free usage</small>
          </div>
        </motion.article>

        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">
            <PixelGlyph pattern="shield" />
            06 / Global compliance
          </span>
          <h2>Deploy everywhere. Keep control of your data.</h2>
          <p>GDPR-aligned and SOC 2 Type II certified, with configurable retention for enterprise workflows.</p>
          <a className="learn-link" href="https://reality-inc.trust.site/">
            Visit our trust center <ArrowRight size={16} />
          </a>
          <div className="compliance-visual">
            <span>
              <Globe2 size={29} />
              GDPR
            </span>
            <span>
              <LockKeyhole size={29} />
              SOC 2
            </span>
            <span>
              <ShieldCheck size={29} />
              Private by default
            </span>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="cta-pixels" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
      <Reveal className="shell">
        <span className="eyebrow">
          <PixelGlyph pattern="scan" />
          07 / Start building trust
        </span>
        <h2>Know what’s real before it matters.</h2>
        <p>Run your first detection free, or design a deployment with an AI security engineer.</p>
        <div className="button-row">
          <a className="button button-light" href="https://app.scam.ai">
            Start free <ArrowRight size={16} />
          </a>
          <a className="button button-dark-ghost" href="https://cal.com/scamai/15min">
            Request a demo
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="shell footer-grid">
        <div>
          <Brand />
          <p>One trust signal for every kind of synthetic media.</p>
        </div>
        <div>
          <strong>Platform</strong>
          <a href="#platform">Detection</a>
          <a href="#halo">Halo</a>
          <a href="#developers">Developers</a>
        </div>
        <div>
          <strong>Solutions</strong>
          <a href="https://www.scam.ai/solutions/fintech">Financial services</a>
          <a href="https://www.scam.ai/solutions/call-centers">Call centers</a>
          <a href="https://www.scam.ai/solutions/kyc">KYC</a>
        </div>
        <div>
          <strong>Resources</strong>
          <a href="https://docu.scam.ai">Documentation</a>
          <a href="https://www.scam.ai/learn">Learn</a>
          <a href="https://reality-inc.trust.site/">Trust center</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Scam AI</span>
        <span>Real-time identity protection</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        {/* <EditorialBreak /> */}
        <Platform />
        <UnifiedStack />
        <Solutions />
        <Developers />
        <Trust />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
