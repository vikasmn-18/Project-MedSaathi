import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:5000';

const SAMPLE_REPORT = `Patient: Ramesh Kumar, Age 62
Haemoglobin: 9.5 g/dL (Normal: 13.5-17.5)
Blood Sugar Fasting: 198 mg/dL (Normal: 70-100)
Blood Pressure: 145/90 mmHg
TSH: 6.2 mIU/L (Normal: 0.4-4.0)
Creatinine: 1.8 mg/dL (Normal: 0.7-1.2)
HBsAg: NON REACTIVE
Micro Filaria: NOT SEEN`;

const LANGS = {
  English: {
    selectLang: 'Select Language', upload: 'Upload Report (PDF or Image)',
    paste: 'Or Paste Report Text', explainBtn: 'Explain My Report',
    listenBtn: 'Listen in', stopBtn: 'Stop Speaking', downloadBtn: 'Download Report',
    shareFamily: 'Share — Family Mode', shareDoctor: 'Share — Doctor Mode',
    whatsappTitle: 'Share on WhatsApp', summaryTitle: 'Your Report Explained',
    askPlaceholder: 'Ask in', disclaimer: 'MedSaathi provides AI-generated summaries for informational purposes only. It does not replace professional medical advice. Please consult a qualified doctor for diagnosis or treatment.',
    uploadSuccess: 'File read successfully!', downloadSuccess: 'Downloaded!', sampleBtn: 'Try Sample Report',
  },
  Hindi: {
    selectLang: 'भाषा चुनें', upload: 'रिपोर्ट अपलोड करें', paste: 'या रिपोर्ट टेक्स्ट पेस्ट करें',
    explainBtn: 'मेरी रिपोर्ट समझाएं', listenBtn: 'सुनें', stopBtn: 'बंद करें',
    downloadBtn: 'रिपोर्ट डाउनलोड करें', shareFamily: 'फैमिली मोड', shareDoctor: 'डॉक्टर मोड',
    whatsappTitle: 'WhatsApp पर शेयर करें', summaryTitle: 'आपकी रिपोर्ट',
    askPlaceholder: 'पूछें', disclaimer: 'MedSaathi केवल सूचनात्मक उद्देश्य के लिए है। कृपया डॉक्टर से परामर्श करें।',
    uploadSuccess: 'फाइल पढ़ी गई!', downloadSuccess: 'डाउनलोड सफल!', sampleBtn: 'सैंपल रिपोर्ट आज़माएं',
  },
  Tamil: {
    selectLang: 'மொழி தேர்வு', upload: 'அறிக்கை பதிவேற்றவும்', paste: 'அல்லது உரை ஒட்டவும்',
    explainBtn: 'என் அறிக்கை விளக்கு', listenBtn: 'கேளுங்கள்', stopBtn: 'நிறுத்து',
    downloadBtn: 'பதிவிறக்கு', shareFamily: 'குடும்ப பகிர்வு', shareDoctor: 'டாக்டர் பகிர்வு',
    whatsappTitle: 'WhatsApp பகிர்வு', summaryTitle: 'உங்கள் அறிக்கை',
    askPlaceholder: 'கேளுங்கள்', disclaimer: 'MedSaathi தகவல் நோக்கத்திற்காக மட்டுமே. மருத்துவரை அணுகவும்.',
    uploadSuccess: 'கோப்பு படிக்கப்பட்டது!', downloadSuccess: 'பதிவிறக்கம் வெற்றி!', sampleBtn: 'மாதிரி அறிக்கை',
  },
  Kannada: {
    selectLang: 'ಭಾಷೆ ಆಯ್ಕೆ', upload: 'ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', paste: 'ಅಥವಾ ಟೆಕ್ಸ್ಟ್ ಪೇಸ್ಟ್ ಮಾಡಿ',
    explainBtn: 'ನನ್ನ ರಿಪೋರ್ಟ್ ವಿವರಿಸಿ', listenBtn: 'ಕೇಳಿ', stopBtn: 'ನಿಲ್ಲಿಸಿ',
    downloadBtn: 'ಡೌನ್‌ಲೋಡ್', shareFamily: 'ಫ್ಯಾಮಿಲಿ ಶೇರ್', shareDoctor: 'ಡಾಕ್ಟರ್ ಶೇರ್',
    whatsappTitle: 'WhatsApp ಶೇರ್', summaryTitle: 'ನಿಮ್ಮ ರಿಪೋರ್ಟ್',
    askPlaceholder: 'ಕೇಳಿ', disclaimer: 'MedSaathi ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    uploadSuccess: 'ಫೈಲ್ ಓದಲಾಗಿದೆ!', downloadSuccess: 'ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿ!', sampleBtn: 'ಮಾದರಿ ರಿಪೋರ್ಟ್',
  },
  Telugu: {
    selectLang: 'భాష ఎంచుకోండి', upload: 'రిపోర్ట్ అప్‌లోడ్ చేయండి', paste: 'లేదా టెక్స్ట్ పేస్ట్ చేయండి',
    explainBtn: 'నా రిపోర్ట్ వివరించండి', listenBtn: 'వినండి', stopBtn: 'ఆపండి',
    downloadBtn: 'డౌన్‌లోడ్', shareFamily: 'ఫ్యామిలీ షేర్', shareDoctor: 'డాక్టర్ షేర్',
    whatsappTitle: 'WhatsApp షేర్', summaryTitle: 'మీ రిపోర్ట్',
    askPlaceholder: 'అడగండి', disclaimer: 'MedSaathi సమాచారం కోసం మాత్రమే. దయచేసి డాక్టర్‌ని సంప్రదించండి.',
    uploadSuccess: 'ఫైల్ చదవబడింది!', downloadSuccess: 'డౌన్‌లోడ్ విజయవంతం!', sampleBtn: 'నమూనా రిపోర్ట్',
  },
  Bengali: {
    selectLang: 'ভাষা নির্বাচন', upload: 'রিপোর্ট আপলোড করুন', paste: 'অথবা টেক্সট পেস্ট করুন',
    explainBtn: 'আমার রিপোর্ট ব্যাখ্যা করুন', listenBtn: 'শুনুন', stopBtn: 'থামুন',
    downloadBtn: 'ডাউনলোড', shareFamily: 'ফ্যামিলি শেয়ার', shareDoctor: 'ডাক্তার শেয়ার',
    whatsappTitle: 'WhatsApp শেয়ার', summaryTitle: 'আপনার রিপোর্ট',
    askPlaceholder: 'জিজ্ঞাসা করুন', disclaimer: 'MedSaathi শুধুমাত্র তথ্যের জন্য। দয়া করে ডাক্তারের সাথে পরামর্শ করুন।',
    uploadSuccess: 'ফাইল পড়া হয়েছে!', downloadSuccess: 'ডাউনলোড সফল!', sampleBtn: 'নমুনা রিপোর্ট',
  },
};

const FEATURES = [
  {
    icon: '🧬',
    tag: 'Pattern Analysis',
    title: 'Reads your full report — not just one value',
    desc: 'High sugar + low haemoglobin + high creatinine together tells a completely different story than each value alone. MedSaathi connects the dots across your entire report, the way a doctor would.',
  },
  {
    icon: '👨‍👩‍👧',
    tag: 'Dual Mode',
    title: 'Two summaries — one for family, one for your doctor',
    desc: 'Family Mode explains everything in plain words your grandmother understands. Doctor Mode gives the technical summary your physician needs. One report, two audiences, one click.',
  },
  {
    icon: '🌐',
    tag: '6 Indian Languages',
    title: 'Your language, not just English',
    desc: 'Hindi, Tamil, Telugu, Kannada, Bengali, English. Because anxiety in your mother tongue hits differently — and so does clarity.',
  },
  {
    icon: '🔊',
    tag: 'Voice Readout',
    title: 'Listen to your report — don\'t just read it',
    desc: 'Hit play. MedSaathi reads your entire summary out loud in your language. Built for elderly patients who struggle with small text or long medical words.',
  },
  {
    icon: '⚠️',
    tag: 'Risk Assessment',
    title: 'Know if it\'s serious — instantly',
    desc: 'Green means you\'re okay. Orange means watch out. Red means see a doctor today. No guessing. No unnecessary panic. Just honest, immediate clarity.',
  },
  {
    icon: '📲',
    tag: 'WhatsApp Share',
    title: 'Share on WhatsApp in one tap',
    desc: 'Send the family-friendly summary to relatives or the doctor summary to your physician directly. No copy-paste, no screenshots, no confusion.',
  },
];

const TRUST_ITEMS = [
  
  { icon: '🔒', label: 'Secure' },
  { icon: '⚡', label: 'Under 30 seconds' },
  
];

function useReveal(threshold = 0.13) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, from = 'bottom' }) {
  const [ref, visible] = useReveal();
  const startTransform = from === 'left' ? 'translateX(-36px)' : from === 'right' ? 'translateX(36px)' : 'translateY(28px)';
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : startTransform, transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function FeatureRow({ feat, idx, C }) {
  const [ref, visible] = useReveal(0.1);
  const even = idx % 2 === 0;
  return (
    <div
      ref={ref}
      style={{
        display: 'flex', alignItems: 'center', gap: 48,
        padding: '44px 0',
        borderBottom: `1px solid ${C.border}`,
        flexDirection: even ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : (even ? 'translateX(-40px)' : 'translateX(40px)'),
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <div style={{ flex: '0 0 auto', width: 92, height: 92, borderRadius: 22, background: C.greenLight, border: `1px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, transition: 'transform 0.2s' }}>
        {feat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green, marginBottom: 8, display: 'block' }}>
          {feat.tag}
        </span>
        <h3 style={{ fontSize: 21, fontWeight: 800, color: C.text, margin: '0 0 10px', lineHeight: 1.25, letterSpacing: '-0.4px' }}>
          {feat.title}
        </h3>
        <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.75, margin: 0 }}>
          {feat.desc}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [familySummary, setFamilySummary] = useState('');
  const [doctorSummary, setDoctorSummary] = useState('');
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [risk, setRisk] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activeTab, setActiveTab] = useState('family');
  const [dragOver, setDragOver] = useState(false);
  const appRef = useRef(null);

  const L = LANGS[language] || LANGS.English;

  const C = {
    bg: dark ? '#0f1117' : '#ffffff',
    surface: dark ? '#1a1d27' : '#f8f9fb',
    card: dark ? '#20242f' : '#ffffff',
    border: dark ? '#2e3347' : '#e8eaed',
    borderAccent: dark ? '#3d4260' : '#d0d5dd',
    text: dark ? '#f0f2f8' : '#111827',
    textSub: dark ? '#8b92ad' : '#6b7280',
    textMuted: dark ? '#555c75' : '#9ca3af',
    green: '#1D9E75',
    greenLight: dark ? '#0d3329' : '#ecfdf5',
    greenBorder: dark ? '#1a4a3a' : '#a7f3d0',
    blue: '#185FA5',
    blueLight: dark ? '#0a1f3a' : '#eff6ff',
    blueBorder: dark ? '#1a3060' : '#bfdbfe',
    amber: dark ? '#1f1800' : '#fffbeb',
    amberBorder: dark ? '#3d3000' : '#fde68a',
    red: dark ? '#1f0a0a' : '#fff5f5',
    redBorder: dark ? '#3d1010' : '#fecaca',
    pill: dark ? '#1e2235' : '#f0f2f8',
    pillText: dark ? '#9ba4c4' : '#4b5563',
    shadow: dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 2px 16px rgba(0,0,0,0.06)',
    navBg: dark ? 'rgba(15,17,23,0.95)' : 'rgba(255,255,255,0.95)',
  };

  const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3200); };
  const scrollToApp = () => appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const analyzeReport = async () => {
    if (!reportText.trim()) return showToast('Please paste or upload a report first.', 'error');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze`, { report_text: reportText, language });
      setFamilySummary(res.data.family_summary || '');
      setDoctorSummary(res.data.doctor_summary || '');
      setSummary(res.data.family_summary || '');
      setRisk(res.data.risk);
      setActiveTab('family');
    } catch (e) {
      showToast('Error analyzing report: ' + (e.response?.data?.error || e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleFileDrop = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success && res.data.text) { setReportText(res.data.text); showToast(L.uploadSuccess); setTimeout(() => analyzeReport(), 800); }
    } catch (e) { showToast('Upload failed: ' + (e.response?.data?.error || e.message), 'error'); }
    finally { setUploading(false); }
  };

  const handleFileUpload = (e) => handleFileDrop(e.target.files[0]);

  const askQuestion = async () => {
    if (!question.trim()) return showToast('Type a question first.', 'error');
    if (!reportText.trim()) return showToast('Analyze a report first.', 'error');
    const userQ = question.trim(); setQuestion('');
    setChatHistory(prev => [...prev, { type: 'user', text: userQ }]);
    try {
      const res = await axios.post(`${API}/ask`, { question: userQ, report_context: reportText, language });
      setChatHistory(prev => [...prev, { type: 'bot', text: res.data.answer || "Sorry, I couldn't answer that." }]);
    } catch { setChatHistory(prev => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]); }
  };

  const downloadReport = async () => {
    if (!summary) return showToast('Analyze a report first.', 'error');
    try {
      const res = await axios.post(`${API}/download-pdf`, { summary, language }, { responseType: 'blob', timeout: 10000 });
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `MedSaathi_Report_${language}.txt`;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url); showToast(L.downloadSuccess);
    } catch { showToast('Download failed. Check if backend is running.', 'error'); }
  };

  const shareFamilyOnWhatsApp = () => {
    if (!familySummary) return showToast('Analyze the report first.', 'error');
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🏥 MedSaathi — Family Mode\n\nLanguage: ${language}\n\n${familySummary.substring(0, 700)}...\n\nGenerated by MedSaathi`)}`, '_blank');
  };

  const shareDoctorOnWhatsApp = () => {
    if (!doctorSummary) return showToast('Analyze the report first.', 'error');
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🏥 MedSaathi — Doctor Mode\n\n${doctorSummary.substring(0, 700)}...\n\nGenerated by MedSaathi`)}`, '_blank');
  };

  const toggleVoice = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    if (!summary) return showToast('Analyze a report first.', 'error');
    if (!('speechSynthesis' in window)) return showToast('Use Chrome for voice support.', 'error');
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(summary);
    const langMap = { Hindi: 'hi-IN', Tamil: 'ta-IN', Telugu: 'te-IN', Kannada: 'kn-IN', Bengali: 'bn-IN', English: 'en-IN' };
    utt.lang = langMap[language] || 'en-IN'; utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1.0;
    utt.onstart = () => setSpeaking(true); utt.onend = () => setSpeaking(false);
    utt.onerror = () => { setSpeaking(false); showToast('Voice error. Try English or use Chrome.', 'error'); };
    window.speechSynthesis.speak(utt);
  };

  const displaySummary = activeTab === 'family' ? familySummary : doctorSummary;
  const hasResult = familySummary || doctorSummary;
  const riskColors = { red: { bg: C.red, border: C.redBorder, badge: '#ef4444' }, orange: { bg: C.amber, border: C.amberBorder, badge: '#f59e0b' }, green: { bg: C.greenLight, border: C.greenBorder, badge: C.green } };

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16, boxShadow: C.shadow };
  const btnAction = (color) => ({ background: color, color: '#fff', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, width: '100%' });
  const btnOutline = (active) => ({ background: active ? C.green : 'transparent', color: active ? '#fff' : C.textSub, padding: '10px 16px', borderRadius: 10, border: `1px solid ${active ? C.green : C.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', flex: 1 });

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: C.text, transition: 'background 0.3s, color 0.3s' }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:none; } }
        .anim-1 { animation: fadeDown 0.55s ease both; }
        .anim-2 { animation: fadeUp 0.55s ease 0.1s both; }
        .anim-3 { animation: fadeUp 0.55s ease 0.2s both; }
        .anim-4 { animation: fadeUp 0.55s ease 0.3s both; }
        .anim-5 { animation: fadeUp 0.55s ease 0.45s both; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: toastType === 'error' ? '#ef4444' : C.green, color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{toastType === 'error' ? '✕' : '✓'}</span><span>{toast}</span>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: C.navBg, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.border}`, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.green }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: '-0.4px' }}>MedSaathi</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 6, padding: '2px 7px', marginLeft: 2 }}></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}></span>
          <button onClick={scrollToApp} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Try Now
          </button>
          <button onClick={() => setDark(d => !d)} style={{ background: C.pill, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 14, color: C.textSub }}>
            {dark ? '☀' : '⏾'}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '96px 24px 72px', maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
        <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 28, letterSpacing: '0.03em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
          Built for India 
        </div>

        <h1 className="anim-2" style={{ fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-1.5px', margin: '0 0 22px', color: C.text }}>
          Your medical report,<br />
          <span style={{ color: C.green }}>explained simply.</span>
        </h1>

        <p className="anim-3" style={{ fontSize: 18, color: C.textSub, lineHeight: 1.75, maxWidth: 540, margin: '0 auto 36px' }}>
          Paste or upload any lab report. MedSaathi explains every value in plain words — in your language — in under 30 seconds.
        </p>

        <div className="anim-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <button onClick={scrollToApp} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.2px' }}>
            Explain my report →
          </button>
          <button onClick={() => { setReportText(SAMPLE_REPORT); scrollToApp(); }} style={{ background: 'transparent', color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Try sample report
          </button>
        </div>

        {/* Free · Secure · Under 30 seconds · Made with doctors */}
        <div className="anim-5" style={{ display: 'inline-flex', alignItems: 'center', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, padding: '10px 6px', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
          {TRUST_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px' }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>{item.label}</span>
              </div>
              {i < TRUST_ITEMS.length - 1 && <div style={{ width: 1, height: 16, background: C.border }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── FEATURES (scroll reveal, reportwize style) ── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '16px 28px 80px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green }}>What MedSaathi does</span>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: C.text, margin: '10px 0 0', letterSpacing: '-0.5px' }}>
              Everything you need to understand your health
            </h2>
          </div>
        </Reveal>

        {FEATURES.map((feat, i) => (
          <FeatureRow key={feat.title} feat={feat} idx={i} C={C} />
        ))}
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: C.border, maxWidth: 840, margin: '0 auto 64px' }} />

      {/* ── APP ── */}
      <div ref={appRef} style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 100px' }}>

        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green }}>Try it now · Free · No account needed</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '10px 0 6px', letterSpacing: '-0.5px' }}>Upload or paste your report</h2>
            <p style={{ fontSize: 14, color: C.textSub, margin: 0 }}>Results in under 30 seconds.</p>
          </div>
        </Reveal>

        {/* Language */}
        <Reveal delay={40}>
          <div style={card}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textSub, marginBottom: 8, display: 'block' }}>{L.selectLang}</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.borderAccent}`, background: C.surface, color: C.text, fontSize: 14, cursor: 'pointer', outline: 'none' }}>
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
              <option value="Tamil">தமிழ்</option>
              <option value="Telugu">తెలుగు</option>
              <option value="Kannada">ಕನ್ನಡ</option>
              <option value="Bengali">বাংলা</option>
            </select>
          </div>
        </Reveal>

        {/* Upload */}
        <Reveal delay={80}>
          <div style={card}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textSub, marginBottom: 10, display: 'block' }}>{L.upload}</label>
            <div
              style={{ border: `2px dashed ${dragOver ? C.green : C.borderAccent}`, borderRadius: 12, padding: '32px 20px', textAlign: 'center', background: dragOver ? C.greenLight : C.surface, transition: 'all 0.2s', cursor: 'pointer' }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFileDrop(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>{uploading ? 'Reading your report...' : 'Drop PDF or image here'}</p>
              <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>or click to browse · PDF, JPG, PNG</p>
              <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} style={{ display: 'none' }} />
            </div>
          </div>
        </Reveal>

        {/* Paste + Analyze */}
        <Reveal delay={120}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.textSub, margin: 0 }}>{L.paste}</label>
              <button onClick={() => setReportText(SAMPLE_REPORT)} style={{ background: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}`, padding: '5px 13px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{L.sampleBtn}</button>
            </div>
            <textarea rows={6} value={reportText} onChange={e => setReportText(e.target.value)} placeholder="Paste your medical report text here..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.borderAccent}`, background: C.surface, color: C.text, fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, fontFamily: 'inherit' }} />
            <button onClick={analyzeReport} disabled={loading} style={{ background: loading ? C.textMuted : C.green, color: '#fff', padding: '13px 28px', borderRadius: 10, border: 'none', width: '100%', marginTop: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Analyzing your report...' : L.explainBtn}
            </button>
          </div>
        </Reveal>

        {/* Voice + Download */}
        {summary && (
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <button onClick={toggleVoice} style={btnAction(speaking ? '#ef4444' : '#7F77DD')}>
                {speaking ? `⏹ ${L.stopBtn}` : `▶ ${L.listenBtn} ${language}`}
              </button>
              <button onClick={downloadReport} style={btnAction(C.blue)}>↓ {L.downloadBtn}</button>
            </div>
          </Reveal>
        )}

        {/* Risk */}
        {risk && (() => {
          const rc = riskColors[risk.color] || riskColors.green;
          return (
            <Reveal>
              <div style={{ background: rc.bg, border: `1px solid ${rc.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{risk.emoji}</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rc.badge, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Risk Level</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: C.text, marginLeft: 8 }}>{risk.risk_level}</span>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: C.textMuted, fontWeight: 600 }}>ML {risk.confidence}% confidence</span>
                </div>
                <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 10px', lineHeight: 1.6 }}>{risk.advice}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[['Hb', risk.extracted?.haemoglobin], ['Blood Sugar', risk.extracted?.blood_sugar], ['BP', risk.extracted?.systolic_bp]].map(([k, v]) => v && (
                    <span key={k} style={{ fontSize: 11, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 10px', color: C.textSub, fontWeight: 600 }}>{k}: {v}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })()}

        {/* Summary tabs */}
        {hasResult && (
          <Reveal>
            <div style={card}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => { setActiveTab('family'); setSummary(familySummary); }} style={btnOutline(activeTab === 'family')}>👨‍👩‍👧 Family Mode</button>
                <button onClick={() => { setActiveTab('doctor'); setSummary(doctorSummary); }} style={btnOutline(activeTab === 'doctor')}>🩺 Doctor Mode</button>
              </div>
              <div style={{ background: activeTab === 'family' ? C.greenLight : C.blueLight, border: `1px solid ${activeTab === 'family' ? C.greenBorder : C.blueBorder}`, borderRadius: 12, padding: '18px 20px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: activeTab === 'family' ? C.green : C.blue, margin: '0 0 12px', textTransform: 'uppercase' }}>
                  {activeTab === 'family' ? L.summaryTitle : 'Doctor Summary'}
                </p>
                {displaySummary.split('\n').filter(l => l.trim()).map((line, i) => {
                  const isNormal = line.toLowerCase().includes('normal');
                  const isHigh = line.includes('[High]') || line.toLowerCase().includes('high');
                  const isLow = line.includes('[Low]') || line.toLowerCase().includes('low');
                  return (
                    <div key={i} style={{ padding: '6px 10px', marginBottom: 4, borderRadius: 8, fontSize: 13, lineHeight: 1.8, background: isHigh ? C.amber : isLow ? C.red : 'transparent', borderLeft: isHigh ? '3px solid #f59e0b' : isLow ? '3px solid #ef4444' : isNormal ? `3px solid ${C.green}` : 'none' }}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* WhatsApp Share */}
        {hasResult && (
          <Reveal>
            <div style={card}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{L.whatsappTitle}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button onClick={shareFamilyOnWhatsApp} style={btnAction('#25D366')}>📲 {L.shareFamily}</button>
                <button onClick={shareDoctorOnWhatsApp} style={btnAction(C.blue)}>🩺 {L.shareDoctor}</button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Chatbot */}
        {summary && (
          <Reveal>
            <div style={card}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ask MedSaathi</p>
              <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 10, paddingRight: 4 }}>
                {chatHistory.length === 0 && (
                  <p style={{ color: C.textMuted, textAlign: 'center', padding: '20px 0', fontSize: 13 }}>Ask anything about your report in {language}...</p>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    <div style={{ background: msg.type === 'user' ? C.green : C.surface, color: msg.type === 'user' ? '#fff' : C.text, padding: '10px 14px', fontSize: 13, lineHeight: 1.6, borderRadius: msg.type === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', maxWidth: '80%', border: msg.type === 'bot' ? `1px solid ${C.border}` : 'none', fontFamily: 'inherit' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={question} onChange={e => setQuestion(e.target.value)} onKeyPress={e => e.key === 'Enter' && askQuestion()} placeholder={`${L.askPlaceholder} ${language}...`} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.borderAccent}`, background: C.surface, color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={askQuestion} style={{ background: C.blue, color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Send</button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Disclaimer */}
        <Reveal>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', fontSize: 12, color: C.textSub, lineHeight: 1.7, marginTop: 8 }}>
            <span style={{ fontWeight: 700, color: C.textSub }}>Disclaimer: </span>{L.disclaimer}
          </div>
        </Reveal>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
          © 2025 MedSaathi · Free · Secure · Made with doctors · Not a substitute for medical advice
        </p>
      </footer>

    </div>
  );
}