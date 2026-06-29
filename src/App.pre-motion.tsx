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
import ParticleCanvas from './components/ParticleCanvas';

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
  return (
    <section className="hero" id="top">
      <ParticleCanvas />
      <div className="hero-fade" />
      <div className="corner corner-top-left" />
      <div className="corner corner-top-right" />
      <div className="corner corner-bottom-left" />
      <div className="corner corner-bottom-right" />

      <div className="shell hero-layout">
        <div className="hero-copy">
          <span className="eyebrow">AI trust infrastructure</span>
          <h1>
            Verify what’s real,
            <br />
            across <em>every screen.</em>
            <br />
            One unified platform.
          </h1>
        </div>

        <div className="hero-aside">
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
        </div>

        <div className="hero-status" aria-label="Live verification status">
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
              <i key={index} style={{ height: `${18 + ((index * 17) % 31)}%` }} />
            ))}
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trusted by teams from">
      <p>Trusted by teams from</p>
      <div>
        <span>QUALCOMM</span>
        <span>HP</span>
        <span>LG U+</span>
        <span>BERKELEY</span>
        <span>TRULIOO</span>
        <span>SBI</span>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section className="section shell" id="platform">
      <div className="section-heading centered">
        <span className="eyebrow">The Scam AI platform</span>
        <h2>One signal for every kind of synthetic media.</h2>
        <p>
          A unified verification layer for high-stakes identity, content, and communication—optimized from device
          to API.
        </p>
      </div>

      <div className="platform-grid">
        <article className="platform-card">
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
        </article>

        <article className="platform-card">
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
              <ShieldCheck size={30} />
            </b>
          </div>
        </article>

        <article className="platform-card">
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
            <p>
              <LockKeyhole size={14} />
              100% on your device
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function UnifiedStack() {
  return (
    <section className="dark-section" id="halo">
      <div className="shell">
        <div className="dark-intro">
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
        </div>

        <div className="stack-grid">
          <div className="stack-features">
            {stackFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article className={index === 0 ? 'active' : ''} key={feature.title}>
                  <div>
                    <Icon size={19} />
                    <h3>{feature.title}</h3>
                    <span>0{index + 1}</span>
                  </div>
                  <p>{feature.copy}</p>
                </article>
              );
            })}
          </div>

          <div className="stack-visual" aria-label="Scam AI unified detection stack">
            <div className="stack-orbit orbit-one" />
            <div className="stack-orbit orbit-two" />
            <div className="stack-layer stack-layer-top">
              <span>YOUR WORKFLOW</span>
              Calls · Uploads · API
            </div>
            <div className="stack-layer stack-layer-middle">
              <span>SCAM AI</span>
              Unified trust signal
            </div>
            <div className="stack-layer stack-layer-bottom">
              <span>EVA INTELLIGENCE</span>
              Fast + forensic models
            </div>
            <div className="stack-badge">
              <ShieldCheck size={30} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section className="section shell" id="solutions">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">Detection solutions</span>
          <h2>Verify media wherever trust matters.</h2>
        </div>
        <p>
          Protect onboarding, communications, customer support, and content with the same detection infrastructure.
        </p>
      </div>

      <div className="solution-grid">
        {solutions.map((solution) => {
          const Icon = solution.icon;
          return (
            <a className="solution-card" href="https://www.scam.ai/products/ai-detection" key={solution.title}>
              <span className="solution-icon">
                <Icon size={25} />
              </span>
              <span className="solution-tag">{solution.tag}</span>
              <h3>{solution.title}</h3>
              <p>{solution.copy}</p>
              <span className="learn-link">
                Learn more <ArrowRight size={16} />
              </span>
            </a>
          );
        })}
      </div>

      <div className="industry-bar">
        <span>Built for your industry</span>
        <a href="https://www.scam.ai/solutions/fintech">Financial services</a>
        <a href="https://www.scam.ai/solutions/call-centers">Call centers</a>
        <a href="https://www.scam.ai/solutions/hr">Hiring</a>
        <a href="https://www.scam.ai/solutions/media">Media</a>
        <a href="https://www.scam.ai/solutions/kyc">KYC</a>
      </div>
    </section>
  );
}

function Developers() {
  return (
    <section className="section shell developer-section" id="developers">
      <div className="developer-copy">
        <span className="eyebrow">Built for developers</span>
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
      </div>

      <div className="code-card">
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
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="section shell" id="trust">
      <div className="proof-grid">
        <article>
          <span className="eyebrow">Transparent pricing</span>
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
        </article>

        <article>
          <span className="eyebrow">Global compliance</span>
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
        </article>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="shell">
        <span className="eyebrow">Start building trust</span>
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
      </div>
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
