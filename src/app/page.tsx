'use client';

import { useState } from 'react';
import { Shield, Sprout, Gamepad2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [quest, setQuest] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
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
    setStep(3);
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto min-h-screen p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Sprout className="text-green-600" /> Duit-Cerdas AI
        </h1>
        <p className="text-gray-500 italic mt-1">Cultivating Your Wealth Garden</p>
      </header>

      {step === 1 && (
        <section className="garden-card animate-in fade-in duration-500">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Blessings of the Elements</h2>
          <p className="text-gray-600 mb-6 text-sm">To start your prosperity path, share your date of birth for your psychological wealth profile.</p>
          <input 
            type="date" 
            className="w-full p-3 border border-green-200 rounded-xl mb-4 outline-green-400"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button 
            disabled={!dob || loading}
            onClick={getProfile}
            className="w-full primary-btn disabled:opacity-50"
          >
            {loading ? 'Consulting Stars...' : 'Discover My Profile'}
          </button>
        </section>
      )}

      {step === 2 && profile && (
        <section className="garden-card animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Sprout className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">You are a {profile.element} Element</h2>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                RISK: {profile.risk_level}
              </span>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p><strong>Trait:</strong> {profile.core_trait}</p>
            <p className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400 italic">
              "{profile.explanation}"
            </p>
            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
              <Shield className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="font-bold text-blue-800">Your Mental Firewall:</p>
                <p className="text-xs">{profile.mental_firewall_tip}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={startQuest}
            disabled={loading}
            className="w-full mt-6 primary-btn flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            {loading ? 'Preparing Quest...' : 'Enter AI Quest'}
          </button>
        </section>
      )}

      {step === 3 && quest && (
        <section className="space-y-4 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
             <div className="absolute -top-3 left-6 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
               New Message
             </div>
             <p className="text-sm font-mono text-gray-800 pt-2">{quest.scammer_message}</p>
          </div>

          {!feedback ? (
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-400 ml-2">Choose Your Action:</p>
              {quest.choices.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setFeedback(c.feedback)}
                  className="w-full bg-white border-2 border-green-100 hover:border-green-400 p-4 rounded-2xl text-left text-sm transition-all group active:scale-[0.98]"
                >
                  <span className="font-bold text-green-600 group-hover:bg-green-500 group-hover:text-white w-6 h-6 inline-flex items-center justify-center rounded-full border border-green-200 mr-2 transition-colors">
                    {c.id}
                  </span>
                  {c.action_text}
                </button>
              ))}
            </div>
          ) : (
            <div className="garden-card bg-green-50 border-green-200">
               <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                 <AlertTriangle className="w-5 h-5" /> Guru's Advice:
               </h3>
               <p className="text-sm leading-relaxed mb-6">{feedback}</p>
               <button 
                onClick={() => {setStep(1); setFeedback(null);}}
                className="w-full border-2 border-green-600 text-green-600 p-3 rounded-full font-bold hover:bg-green-50 transition-colors"
               >
                 Restart Journey
               </button>
            </div>
          )}
        </section>
      )}

      <footer className="mt-12 text-center text-[10px] text-gray-400">
        <p>⚠️ NOT financial advice. Always verify with official BNM / SC channels.</p>
        <p className="mt-2">© 2026 Duit-Cerdas AI • Project 2030 Hackathon</p>
      </footer>
    </main>
  );
}
