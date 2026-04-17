'use client';

import { useState } from 'react';
import { Shield, Sprout, Gamepad2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

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

const RISK_PILL: Record<RiskLevel, { cls: string; label: string }> = {
  LOW:      { cls: 'soft-pill soft-pill-low',      label: 'LOW RISK' },
  MODERATE: { cls: 'soft-pill soft-pill-moderate', label: 'MODERATE RISK' },
  HIGH:     { cls: 'soft-pill soft-pill-high',     label: 'HIGH RISK' },
};

const CHOICE_ICONS: Record<string, React.ReactNode> = {
  A: <XCircle className="w-4 h-4 shrink-0 text-error" />,
  B: <Shield className="w-4 h-4 shrink-0 text-primary" />,
  C: <HelpCircle className="w-4 h-4 shrink-0 text-tertiary" />,
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

  const getProfile = async () => {
    setLoading(true);
    const res = await fetch('/api/agents/bazi-profile', {
      method: 'POST',
      body: JSON.stringify({ dob }),
    });
    const data = await res.json();
    setProfile(data.profile);
    setUserId(data.userId);
    setStep(2);
    setLoading(false);
  };

  const startQuest = async () => {
    setLoading(true);
    const res = await fetch('/api/agents/simulate-quest', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setQuest(data);
    setTokenEarned(false);
    setFeedback(null);
    setStep(3);
    setLoading(false);
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

  const restart = () => {
    setStep(1);
    setFeedback(null);
    setTokenEarned(false);
    setQuest(null);
    setProfile(null);
    setDob('');
  };

  const riskPill = profile ? (RISK_PILL[profile.risk_level] ?? RISK_PILL.MODERATE) : null;

  return (
    <main className="max-w-md mx-auto min-h-screen p-6" style={{ background: '#f9f9fb' }}>

      {/* Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #006565, #008080)' }}>
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
            Duit-Cerdas AI
          </h1>
        </div>
        <p className="label-md">The Digital Arboretum · Prosperity Path</p>

        {growthTokens > 0 && (
          <div className="mt-3 flex justify-center">
            <span className="growth-token-chip">
              <Sprout className="w-3 h-3" />
              {growthTokens} Growth {growthTokens === 1 ? 'Token' : 'Tokens'}
            </span>
          </div>
        )}
      </header>

      {/* ── Step 1: DOB Input ── */}
      {step === 1 && (
        <section className="arboretum-card space-y-6">
          <div>
            <p className="headline-sm mb-1">Blessings of the Elements</p>
            <p className="text-sm leading-relaxed" style={{ color: '#44475a' }}>
              Share your date of birth to receive your psychological wealth &amp; scam vulnerability profile.
            </p>
          </div>

          <div>
            <label className="label-md block mb-2">Date of Birth</label>
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
            className="btn-primary w-full"
          >
            {loading ? 'Consulting the Stars…' : 'Discover My Profile'}
          </button>
        </section>
      )}

      {/* ── Step 2: Profile Reveal ── */}
      {step === 2 && profile && riskPill && (
        <section className="space-y-4">
          {/* Element hero */}
          <div className="arboretum-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="label-md mb-1">Your Element</p>
                <h2 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                  {profile.element}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#5d5c74' }}>{profile.core_trait}</p>
              </div>
              <span className={riskPill.cls}>{riskPill.label}</span>
            </div>

            <blockquote className="text-sm leading-relaxed italic px-4 py-3 rounded-md"
                        style={{ background: '#f3f3f5', color: '#44475a', borderLeft: '3px solid #008080' }}>
              {profile.explanation}
            </blockquote>
          </div>

          {/* Mental Firewall */}
          <div className="arboretum-section">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                   style={{ background: 'rgba(0, 101, 101, 0.08)' }}>
                <Shield className="w-4 h-4" style={{ color: '#006565' }} />
              </div>
              <div>
                <p className="label-md mb-1">Your Mental Firewall</p>
                <p className="text-sm leading-relaxed" style={{ color: '#44475a' }}>
                  {profile.mental_firewall_tip}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={startQuest}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            {loading ? 'Preparing Quest…' : 'Enter AI Quest'}
          </button>
        </section>
      )}

      {/* ── Step 3: Quest ── */}
      {step === 3 && quest && (
        <section className="space-y-4">
          {/* Scammer message card */}
          <div className="relative">
            <span className="absolute -top-2.5 left-4 label-md px-2 py-0.5 rounded-pill text-white"
                  style={{ background: '#ba1a1a', fontSize: '9px' }}>
              INCOMING MESSAGE
            </span>
            <div className="arboretum-card pt-6">
              <p className="label-md mb-2">{quest.scenario_title}</p>
              <p className="text-sm font-mono leading-relaxed" style={{ color: '#1a1a2e' }}>
                {quest.scammer_message}
              </p>
            </div>
          </div>

          {!feedback ? (
            <div className="space-y-2">
              <p className="label-md ml-1">Choose Your Action</p>
              {quest.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChoice(c)}
                  className="w-full text-left p-4 rounded-md flex items-start gap-3 transition-opacity"
                  style={{ background: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,29,0.06)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {CHOICE_ICONS[c.id.toUpperCase()] ?? null}
                  <span className="text-sm" style={{ color: '#1a1a2e' }}>
                    <span className="font-semibold">{c.id}.</span> {c.action_text}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="arboretum-card space-y-4">
              {tokenEarned && (
                <div className="flex items-center gap-2 p-3 rounded-md"
                     style={{ background: 'rgba(21,104,32,0.08)' }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#156820' }} />
                  <span className="text-sm font-semibold" style={{ color: '#156820' }}>
                    +1 Growth Token earned
                  </span>
                  <span className="growth-token-chip ml-auto">
                    <Sprout className="w-3 h-3" /> {growthTokens}
                  </span>
                </div>
              )}

              <div>
                <p className="label-md mb-2">Guru's Advice</p>
                <p className="text-sm leading-relaxed" style={{ color: '#44475a' }}>
                  {feedback}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={startQuest}
                  disabled={loading}
                  className="btn-secondary flex-1 text-sm"
                >
                  {loading ? 'Loading…' : 'Next Quest'}
                </button>
                <button
                  onClick={restart}
                  className="flex-1 text-sm px-4 py-3 rounded-pill font-semibold transition-opacity"
                  style={{ color: '#5d5c74', background: '#f3f3f5' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Restart
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="mt-16 text-center space-y-1">
        <p className="label-md" style={{ fontSize: '9px' }}>
          Not financial advice · Verify with official BNM / SC channels
        </p>
        <p className="label-md" style={{ fontSize: '9px', color: '#bdc9c8' }}>
          © 2026 Duit-Cerdas AI · Project 2030 Hackathon
        </p>
      </footer>
    </main>
  );
}
