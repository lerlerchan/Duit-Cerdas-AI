'use client';

import { useState } from 'react';
import { 
  Shield, 
  Sprout, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Bell,
  Lock,
  ArrowRight,
  Brain,
  Search
} from 'lucide-react';

type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

interface Profile {
  element: string;
  core_trait: string;
  primary_vulnerability: string;
  risk_level: RiskLevel;
  explanation: string;
  mental_firewall_tip: string;
}

interface Choice {
  id: string;
  action_text: string;
  feedback: string;
}

interface Quest {
  scenario_title: string;
  scammer_message: string;
  choices: Choice[];
}

const RISK_CONFIG: Record<RiskLevel, { cls: string; label: string; bg: string; text: string }> = {
  LOW:      { cls: 'soft-pill-low',      label: 'LOW RISK', bg: 'rgba(51, 130, 54, 0.12)', text: '#338236' },
  MODERATE: { cls: 'soft-pill-moderate', label: 'MODERATE RISK', bg: 'rgba(124, 104, 32, 0.10)', text: '#7c6820' },
  HIGH:     { cls: 'soft-pill-high',     label: 'HIGH RISK', bg: 'rgba(186, 26, 26, 0.10)', text: '#ba1a1a' },
};

const CHOICE_ICONS: Record<string, React.ReactNode> = {
  A: <XCircle className="w-5 h-5 shrink-0 text-error" />,
  B: <Shield className="w-5 h-5 shrink-0 text-primary" />,
  C: <HelpCircle className="w-5 h-5 shrink-0 text-secondary" />,
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState('');
  const [quest, setQuest] = useState<Quest | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [growthTokens, setGrowthTokens] = useState(0);
  const [tokenEarned, setTokenEarned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/bazi-profile', {
        method: 'POST',
        body: JSON.stringify({ dob }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      setUserId(data.userId);
      setStep(2);
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/simulate-quest', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuest(data);
      setTokenEarned(false);
      setFeedback(null);
      setStep(3);
    } catch (error) {
      console.error('Quest fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choice: Choice) => {
    setFeedback(choice.feedback);
    const res = await fetch('/api/agents/reward-token', {
      method: 'POST',
      body: JSON.stringify({ userId, choiceId: choice.id }),
    });
    const data = await res.json();
    if (data.rewarded) {
      setGrowthTokens(data.growth_tokens);
      setTokenEarned(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/agents/analyze-shield', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    if (profile) {
      setStep(2);
    } else {
      setStep(1);
    }
    setFeedback(null);
    setTokenEarned(false);
    setQuest(null);
    setAnalysis(null);
  };

  const riskInfo = profile ? (RISK_CONFIG[profile.risk_level] ?? RISK_CONFIG.MODERATE) : null;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      
      {/* ── Top App Bar ── */}
      <header className="bg-white/70 backdrop-blur-xl shadow-ambient fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center garden-gradient">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-on-surface">Duit-Cerdas AI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest text-secondary">
          <button onClick={() => profile ? setStep(2) : setStep(1)} className={step === 2 ? "text-primary border-b-2 border-primary" : ""}>Garden</button>
          <button onClick={() => setStep(1)} className={step === 1 ? "text-primary border-b-2 border-primary" : ""}>Profiler</button>
          <button onClick={() => setStep(3)} className={step === 3 ? "text-primary border-b-2 border-primary" : ""}>Quest</button>
          <button onClick={() => setStep(4)} className={step === 4 ? "text-primary border-b-2 border-primary" : ""}>Scanner</button>
        </nav>

        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-secondary cursor-pointer" />
          <Lock className="w-5 h-5 text-secondary cursor-pointer" />
          {growthTokens > 0 && (
            <div className="growth-token-chip">
              <Sprout className="w-3 h-3" />
              {growthTokens}
            </div>
          )}
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* ── Step 1: BaZi Risk Profiler Input ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h1 className="display-md">BaZi Risk Profiler</h1>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Unlock the ancient wisdom of your celestial footprint. We harmonize your birth data with market volatility to visualize your financial sanctuary's resilience.
                </p>
              </div>

              <section className="glass-panel p-8 shadow-ambient rounded-md">
                <div className="flex items-center gap-2 mb-8">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                  <h2 className="text-xl font-bold tracking-tight uppercase label-md">Celestial Coordinates</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="label-md">Date of Birth</label>
                    <input
                      type="date"
                      className="arboretum-input"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <button
                    disabled={!dob || loading}
                    onClick={getProfile}
                    className="btn-primary w-full flex items-center justify-center gap-2 shadow-glow"
                  >
                    {loading ? 'Consulting the Stars…' : 'Analyze My Risk'}
                    {!loading && <span className="material-symbols-outlined text-sm">auto_awesome</span>}
                  </button>
                </div>
              </section>

              <div className="bg-surface-container-low rounded-md p-6 flex items-start gap-4">
                <Shield className="w-5 h-5 text-primary-container shrink-0" />
                <p className="text-sm text-on-surface-variant font-medium leading-snug">
                  Your data is protected. We only use this for BaZi chart generation to identify your psychological "Scam Shield" type.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 relative rounded-md overflow-hidden aspect-[16/10] shadow-ambient">
               <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMJV2YupBpSua9LDZJDN9qLRt7Oj8w31qGtfP5hjxJigPGnmdcqOg1OfqxNPggmDhftXKuNKqkqP-_7XYJtqRiRPPE4kCs-WeYEelJExq-EXCYCP67G4-ATmHu_RQ3oFWcqqdZ5PEJVHFDWzZ4nzDptBVgc9GuOg09B0XhWToLT-zGqm3O_Sd6Tg0NdSQXvsM4i_D_250zIVEYI90JpASvLpLeeLPPbpdo3H3k-h0huQXSyroH__3t8ln0NBbHvMzZmEpamiSs"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Zen Garden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 to-transparent flex items-center p-12">
                <div className="max-w-xs space-y-4">
                  <span className="label-md text-primary-fixed">The Digital Arboretum</span>
                  <h3 className="text-3xl font-bold text-white tracking-tighter">Cultivate your future.</h3>
                  <p className="text-white/80 text-sm">Discover how your personality elements map to modern cybersecurity defense.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Garden Vitality Dashboard ── */}
        {step === 2 && profile && riskInfo && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Hero: Garden Visualization */}
              <div className="lg:col-span-8 bg-surface-container-low rounded-md p-8 relative overflow-hidden flex flex-col justify-between min-h-[440px] shadow-ambient">
                <div className="relative z-10">
                  <span className="label-md block mb-2">Current State</span>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">Garden Vitality</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-tertiary-container/20 px-3 py-1 rounded-pill flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                      <span className="text-xs font-bold text-tertiary uppercase">FLOURISHING</span>
                    </div>
                    <span className="text-sm text-on-surface-variant font-medium">Element: {profile.element}</span>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 top-0 w-full lg:w-3/5 pointer-events-none opacity-40 lg:opacity-100 flex items-end justify-end p-4">
                  <img 
                    alt="Wealth Tree" 
                    className="max-h-full object-contain" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEc4BdFGNHaMyZyuwe5Rd69umcXF2iEgV00rgTEiF8QqxIOGfMUD-bR8gZQR9S1WOjMhlFNn0kDR7or8efeF1mwpXQAg336Y2gQ2GRq4E_6NR-mGk9vTB0EwUeGBQxGODs2xyE0X-U0DAai-L6XZI8vWQKbTaVupgT1N_3mIrsZZJfhPoXBW1WH2YaXI7OUtNIvtJXXlSaroXldaPgEPZajzVOVoTxEIEUonJSZWSyBgK0NiTG-kCVsV2iXyKtiJaok1ERAj3s" 
                  />
                </div>

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg">
                  <div className="glass-panel p-4">
                    <span className="label-md block mb-1">Risk Level</span>
                    <div className="text-2xl font-bold" style={{ color: riskInfo.text }}>{profile.risk_level}</div>
                    <span className="text-[10px] text-secondary font-semibold uppercase">Celestial Baseline</span>
                  </div>
                  <div className="glass-panel p-4">
                    <span className="label-md block mb-1">Growth</span>
                    <div className="text-2xl font-bold text-primary">+{growthTokens * 1.5}%</div>
                    <span className="text-[10px] text-tertiary font-semibold uppercase">↑ Season High</span>
                  </div>
                  <div className="glass-panel p-4 hidden md:block">
                    <span className="label-md block mb-1">Tokens</span>
                    <div className="text-2xl font-bold text-on-surface">{growthTokens}</div>
                    <span className="text-[10px] text-secondary font-semibold uppercase">Nurtured Assets</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Metrics */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-on-surface text-white rounded-md p-8 flex flex-col justify-between h-full shadow-ambient relative overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <Shield className="w-10 h-10 text-primary-fixed" />
                    <div className="text-right">
                      <span className="label-md text-secondary-fixed-dim">Vulnerability</span>
                      <div className="text-4xl font-extrabold text-primary-fixed tracking-tight">{profile.element}</div>
                    </div>
                  </div>
                  <div className="mt-8 relative z-10">
                    <p className="text-sm text-secondary-fixed-dim leading-relaxed mb-6">
                      {profile.explanation}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={startQuest}
                        className="py-4 bg-primary-container text-white rounded-pill font-bold text-[10px] tracking-widest uppercase shadow-glow active:scale-95 transition-transform"
                      >
                        Start Quest
                      </button>
                      <button 
                        onClick={() => setStep(4)}
                        className="py-4 bg-white/10 border border-white/20 text-white rounded-pill font-bold text-[10px] tracking-widest uppercase active:scale-95 transition-transform"
                      >
                        Deep Scan
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-surface-container-low rounded-md p-6 border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-on-surface tracking-tight uppercase label-md">Mental Firewall</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed italic">
                    "{profile.mental_firewall_tip}"
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── Step 3: AI Scam Quest ── */}
        {step === 3 && quest && (
          <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="mb-10 text-center space-y-2">
              <h2 className="display-md text-3xl">AI Quest Simulation</h2>
              <p className="label-md">Test your elements against real-world threats</p>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10 bg-error px-3 py-1 rounded-pill shadow-glow">
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Incoming Alert
                  </span>
                </div>
                <div className="arboretum-card pt-10 border-t-2 border-error/20">
                  <p className="label-md mb-4 text-error">{quest.scenario_title}</p>
                  <div className="bg-surface-container rounded-md p-6 font-mono text-sm leading-relaxed border-l-4 border-error">
                    {quest.scammer_message}
                  </div>
                </div>
              </div>

              {!feedback ? (
                <div className="space-y-3">
                  <p className="label-md ml-1">Your Defense Response</p>
                  {quest.choices.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleChoice(c)}
                      className="w-full text-left p-5 bg-white shadow-ambient rounded-md flex items-start gap-4 transition-all hover:translate-x-1 hover:shadow-glow group"
                    >
                      <div className="mt-0.5 group-hover:scale-110 transition-transform">
                        {CHOICE_ICONS[c.id.toUpperCase()] ?? null}
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Option {c.id}</span>
                        <p className="text-sm font-medium text-on-surface">{c.action_text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="arboretum-card space-y-6 border-t-2 border-tertiary/20">
                  {tokenEarned && (
                    <div className="flex items-center gap-3 p-4 rounded-md bg-tertiary-container/10 border-l-4 border-tertiary">
                      <CheckCircle className="w-5 h-5 text-tertiary" />
                      <div>
                        <p className="text-sm font-bold text-tertiary">+1 Growth Token Earned</p>
                        <p className="text-xs text-on-surface-variant">Your garden vitality has increased.</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="label-md text-primary flex items-center gap-1">
                      <Search className="w-3 h-3" /> Scam Analysis
                    </p>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      {feedback}
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-surface-container-high">
                    <button onClick={startQuest} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {loading ? 'Consulting...' : 'Next Quest'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={restart} className="btn-secondary flex-1">
                      Back to Garden
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Scam Scanner (Vision) ── */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="mb-10 text-center space-y-2">
              <h2 className="display-md text-3xl">Scam Scanner</h2>
              <p className="label-md text-primary font-bold">Real-Time Screenshot Analysis</p>
            </div>
            <div className="space-y-8">
              {!analysis ? (
                <section className="glass-panel p-12 text-center space-y-6 border-2 border-dashed border-primary-container/30">
                  <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Upload suspicious message</h3>
                    <p className="text-sm text-on-surface-variant">We'll analyze the text, links, and intent for Malaysian scam indicators.</p>
                  </div>
                  <label className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    {loading ? 'Analyzing Shield...' : 'Select Screenshot'}
                    {!loading && <Search className="w-4 h-4" />}
                  </label>
                </section>
              ) : (
                <div className="arboretum-card space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="label-md">Fraud Probability</p>
                      <div className="text-4xl font-extrabold text-on-surface">{analysis.fraud_probability_score}%</div>
                    </div>
                    <span className={`px-4 py-2 rounded-pill font-bold text-xs uppercase tracking-widest ${
                      analysis.risk_level === 'HIGH' ? 'bg-error text-white' : 
                      analysis.risk_level === 'MEDIUM' ? 'bg-secondary-container text-on-secondary-fixed' : 
                      'bg-tertiary-container text-white'
                    }`}>
                      {analysis.risk_level} RISK
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-md p-6 border-l-4 border-primary">
                    <p className="label-md mb-2">Guru's Verdict</p>
                    <p className="text-sm leading-relaxed text-on-surface-variant italic">"{analysis.explanation}"</p>
                  </div>
                  <div className="space-y-4">
                    <p className="label-md text-error flex items-center gap-1"><Bell className="w-3 h-3" /> Red Flags Identified</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.red_flags_identified?.map((flag: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container rounded-md px-3 py-2">
                          <XCircle className="w-3 h-3 text-error" /> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-surface-container flex gap-4">
                    <button onClick={() => setAnalysis(null)} className="btn-primary flex-1">Scan Another</button>
                    <button onClick={restart} className="btn-secondary flex-1">Back to Garden</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Nav Bar (Mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-2 bg-white/80 backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.04)] rounded-t-3xl border-t border-surface-container">
        <button onClick={() => profile ? setStep(2) : setStep(1)} className={`flex flex-col items-center gap-1 p-2 ${step === 2 ? 'text-primary' : 'text-secondary'}`}>
          <Sprout className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Garden</span>
        </button>
        <button onClick={() => setStep(1)} className={`flex flex-col items-center gap-1 p-2 ${step === 1 ? 'text-primary' : 'text-secondary'}`}>
          <Brain className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Profiler</span>
        </button>
        <button onClick={() => setStep(4)} className={`flex flex-col items-center gap-1 p-2 ${step === 4 ? 'text-primary' : 'text-secondary'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Scanner</span>
        </button>
      </nav>

      <footer className="py-12 px-6 text-center border-t border-surface-container bg-surface-container-lowest">
        <p className="label-md mb-2">Not Financial Advice · Protect Your Wealth</p>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">© 2026 Duit-Cerdas AI · Built for Malaysia 2030</p>
      </footer>

      <style jsx global>{`
        .garden-gradient { background: linear-gradient(135deg, #008080 0%, #006565 100%); }
        .shadow-glow { box-shadow: 0 0 20px rgba(0, 101, 101, 0.15); }
        .arboretum-card { background-color: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 12px 40px rgba(26, 28, 29, 0.06); }
      `}</style>
    </div>
  );
}
