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

const t = {
  English: { selectLang:"Select Language", upload:"Upload Report (PDF or Image)", paste:"Or Paste Report Text", explainBtn:"Explain My Report", listenBtn:"Listen in", stopBtn:"Stop Speaking", downloadBtn:"Download Report", shareFamily:"Share Family Mode", shareDoctor:"Share Doctor Mode", whatsappTitle:"Share Report on WhatsApp", summaryTitle:"Your Report Explained", askPlaceholder:"Ask in", disclaimer:"Disclaimer: MedSaathi provides AI-generated summaries for informational purposes only. It does not replace professional medical advice. Please consult a qualified doctor for diagnosis or treatment.", uploadSuccess:"File read successfully!", downloadSuccess:"Downloaded successfully!", sampleBtn:"Try Sample Report" },
  Hindi: { selectLang:"भाषा चुनें", upload:"रिपोर्ट अपलोड करें", paste:"या रिपोर्ट टेक्स्ट पेस्ट करें", explainBtn:"मेरी रिपोर्ट समझाएं", listenBtn:"सुनें", stopBtn:"बोलना बंद करें", downloadBtn:" रिपोर्ट डाउनलोड करें", shareFamily:"फैमिली मोड शेयर", shareDoctor:"डॉक्टर मोड शेयर", whatsappTitle:"WhatsApp पर शेयर करें", summaryTitle:"आपकी रिपोर्ट", askPlaceholder:"पूछें", disclaimer:"डिस्क्लेमर: MedSaathi केवल सूचनात्मक उद्देश्य के लिए है। कृपया डॉक्टर से परामर्श करें।", uploadSuccess:"फाइल पढ़ी गई!", downloadSuccess:"डाउनलोड सफल!", sampleBtn:"सैंपल रिपोर्ट आज़माएं" },
  Tamil: { selectLang:"மொழி தேர்வு", upload:"அறிக்கை பதிவேற்றவும்", paste:"அல்லது உரை ஒட்டவும்", explainBtn:"என் அறிக்கை விளக்கு", listenBtn:"கேளுங்கள்", stopBtn:"நிறுத்து", downloadBtn:" பதிவிறக்கு", shareFamily:"குடும்ப பகிர்வு", shareDoctor:"டாக்டர் பகிர்வு", whatsappTitle:"WhatsApp பகிர்வு", summaryTitle:"உங்கள் அறிக்கை", askPlaceholder:"கேளுங்கள்", disclaimer:"MedSaathi தகவல் நோக்கத்திற்காக மட்டுமே. மருத்துவரை அணுகவும்.", uploadSuccess:"கோப்பு படிக்கப்பட்டது!", downloadSuccess:"பதிவிறக்கம் வெற்றி!", sampleBtn:"மாதிரி அறிக்கை" },
  Kannada: { selectLang:"ಭಾಷೆ ಆಯ್ಕೆ", upload:"ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", paste:"ಅಥವಾ ಟೆಕ್ಸ್ಟ್ ಪೇಸ್ಟ್ ಮಾಡಿ", explainBtn:"ನನ್ನ ರಿಪೋರ್ಟ್ ವಿವರಿಸಿ", listenBtn:"ಕೇಳಿ", stopBtn:"ನಿಲ್ಲಿಸಿ", downloadBtn:" ಡೌನ್‌ಲೋಡ್", shareFamily:"ಫ್ಯಾಮಿಲಿ ಶೇರ್", shareDoctor:"ಡಾಕ್ಟರ್ ಶೇರ್", whatsappTitle:"WhatsApp ಶೇರ್", summaryTitle:"ನಿಮ್ಮ ರಿಪೋರ್ಟ್", askPlaceholder:"ಕೇಳಿ", disclaimer:"MedSaathi ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.", uploadSuccess:"ಫೈಲ್ ಓದಲಾಗಿದೆ!", downloadSuccess:"ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿ!", sampleBtn:"ಮಾದರಿ ರಿಪೋರ್ಟ್" },
  Telugu: { selectLang:"భాష ఎంచుకోండి", upload:"రిపోర్ట్ అప్‌లోడ్ చేయండి", paste:"లేదా టెక్స్ట్ పేస్ట్ చేయండి", explainBtn:"నా రిపోర్ట్ వివరించండి", listenBtn:"వినండి", stopBtn:"ఆపండి", downloadBtn:" డౌన్‌లోడ్", shareFamily:"ఫ్యామిలీ షేర్", shareDoctor:"డాక్టర్ షేర్", whatsappTitle:"WhatsApp షేర్", summaryTitle:"మీ రిపోర్ట్", askPlaceholder:"అడగండి", disclaimer:"MedSaathi సమాచారం కోసం మాత్రమే. దయచేసి డాక్టర్‌ని సంప్రదించండి.", uploadSuccess:"ఫైల్ చదవబడింది!", downloadSuccess:"డౌన్‌లోడ్ విజయవంతం!", sampleBtn:"నమూనా రిపోర్ట్" },
  Bengali: { selectLang:"ভাষা নির্বাচন", upload:"রিপোর্ট আপলোড করুন", paste:"অথবা টেক্সট পেস্ট করুন", explainBtn:"আমার রিপোর্ট ব্যাখ্যা করুন", listenBtn:"শুনুন", stopBtn:"থামুন", downloadBtn:" ডাউনলোড", shareFamily:"ফ্যামিলি শেয়ার", shareDoctor:"ডাক্তার শেয়ার", whatsappTitle:"WhatsApp শেয়ার", summaryTitle:"আপনার রিপোর্ট", askPlaceholder:"জিজ্ঞাসা করুন", disclaimer:"MedSaathi শুধুমাত্র তথ্যের জন্য। দয়া করে ডাক্তারের সাথে পরামর্শ করুন।", uploadSuccess:"ফাইল পড়া হয়েছে!", downloadSuccess:"ডাউনলোড সফল!", sampleBtn:"নমুনা রিপোর্ট" }
};

// Icons as SVG components
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
  </svg>
);

const HeartPulseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const StethoscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
  </svg>
);

export default function App() {
  const [familySummary, setFamilySummary] = useState('');
  const [doctorSummary, setDoctorSummary] = useState('');
  const [englishSummary, setEnglishSummary] = useState('');
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [risk, setRisk] = useState(null);
  const [entities, setEntities] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('family');
  const [darkMode, setDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const currentLang = t[language] || t.English;

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const showToast = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setToast(msg);
    setTimeout(() => { setToast(''); setErrorMsg(''); }, 3000);
  };

  const analyzeReport = async () => {
    if (!reportText.trim()) return showToast('Please paste a report first or upload a file', true);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze`, { report_text: reportText, language });
      setFamilySummary(res.data.family_summary || '');
      setDoctorSummary(res.data.doctor_summary || '');
      setSummary(res.data.family_summary || '');
      setRisk(res.data.risk);
      setEntities(res.data.entities);

      if (language !== 'English') {
        try {
          const engRes = await axios.post(`${API}/analyze`, { report_text: reportText, language: 'English' });
          setEnglishSummary(engRes.data.family_summary || '');
        } catch { setEnglishSummary(''); }
      } else {
        setEnglishSummary(res.data.family_summary || '');
      }
    } catch (e) {
      showToast('Error analyzing report: ' + (e.response?.data?.error || e.message), true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success && res.data.text) {
        setReportText(res.data.text);
        showToast(currentLang.uploadSuccess);
        setTimeout(() => analyzeReport(), 800);
      }
    } catch (e) {
      showToast('Upload failed: ' + (e.response?.data?.error || e.message), true);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e);
  };

  const askQuestion = async () => {
    if (!question.trim()) return showToast('Type a question first', true);
    if (!reportText.trim()) return showToast('Analyze report first', true);
    const userQ = question.trim();
    setQuestion('');
    setChatHistory(prev => [...prev, { type: 'user', text: userQ }]);
    try {
      const res = await axios.post(`${API}/ask`, { question: userQ, report_context: reportText, language });
      setChatHistory(prev => [...prev, { type: 'bot', text: res.data.answer || "Sorry, I couldn't answer that." }]);
    } catch {
      setChatHistory(prev => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  const downloadReport = async () => {
    if (!summary) return alert('Analyze report first');
    try {
      const res = await axios.post(
        `${API}/download-pdf`,
        { summary, language },
        { responseType: 'blob', timeout: 10000 }
      );
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MedSaathi_Report_${language}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast(currentLang.downloadSuccess);
    } catch (e) {
      console.error(e);
      showToast('Download failed. Please check if backend is running.', true);
    }
  };

  const shareFamilyOnWhatsApp = () => {
    if (!familySummary) return showToast('Please analyze the report first', true);
    const message = `MedSaathi - Family Mode\n\nLanguage: ${language}\n\n${familySummary.substring(0, 700)}...\n\nGenerated by MedSaathi`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareDoctorOnWhatsApp = () => {
    if (!doctorSummary) return showToast('Please analyze the report first', true);
    const message = `MedSaathi - Doctor Mode\n\n${doctorSummary.substring(0, 700)}...\n\nGenerated by MedSaathi`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleVoice = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!summary) return showToast('Analyze report first', true);
    if (!('speechSynthesis' in window)) return showToast('Your browser does not support voice. Use Chrome.', true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    const langMap = { Hindi:'hi-IN', Tamil:'ta-IN', Telugu:'te-IN', Kannada:'kn-IN', Bengali:'bn-IN', English:'en-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); showToast('Voice error. Try English or use Chrome.', true); };
    window.speechSynthesis.speak(utterance);
  };

  const displaySummary = activeTab === 'family' ? familySummary : doctorSummary;

  // Theme colors
  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    cardBorder: darkMode ? '#334155' : '#e2e8f0',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    secondary: '#3b82f6',
    secondaryHover: '#2563eb',
    secondaryLight: darkMode ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
    danger: '#ef4444',
    dangerLight: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
    warning: '#f59e0b',
    warningLight: darkMode ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
    inputBg: darkMode ? '#0f172a' : '#f8fafc',
    inputBorder: darkMode ? '#475569' : '#cbd5e1',
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      color: theme.text,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      transition: 'all 0.3s ease'
    }}>
      {/* Toast Notifications */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: theme.primary, color: 'white', padding: '14px 28px', borderRadius: 12,
          zIndex: 9999, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircleIcon /> {toast}
        </div>
      )}

      {errorMsg && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: theme.danger, color: 'white', padding: '14px 28px', borderRadius: 12,
          zIndex: 9999, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)', cursor: 'pointer'
        }} onClick={() => setErrorMsg('')}>
          <XCircleIcon /> {errorMsg}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: theme.cardBg,
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: theme.primary }}>
              <HeartPulseIcon />
            </div>
            <div>
              <h1 style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                margin: 0,
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                MedSaathi
              </h1>
              <p style={{ fontSize: 12, color: theme.textSecondary, margin: 0 }}>
                AI-Powered Medical Report Analysis
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GlobeIcon />
              <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: `1px solid ${theme.inputBorder}`,
                  background: theme.inputBg,
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              aria-label="Toggle theme"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          padding: '40px 20px'
        }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 16,
            lineHeight: 1.3
          }}>
            Understand Your Lab Reports{' '}
            <span style={{ color: theme.primary }}>Instantly</span>
          </h2>
          <p style={{
            fontSize: 18,
            color: theme.textSecondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Upload your medical report and get AI-powered analysis in simple language. 
            Available in multiple Indian languages.
          </p>
        </div>

        {/* Upload Section */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 20,
          border: `1px solid ${theme.cardBorder}`,
          padding: 32,
          marginBottom: 32,
          boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              padding: 10,
              borderRadius: 10,
              background: theme.primaryLight,
              color: theme.primary
            }}>
              <FileTextIcon />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{currentLang.upload}</h3>
              <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>PDF, JPG, or PNG format</p>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? theme.primary : theme.inputBorder}`,
              borderRadius: 16,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isDragging ? theme.primaryLight : 'transparent'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{ color: isDragging ? theme.primary : theme.textSecondary, marginBottom: 16 }}>
              <UploadIcon />
            </div>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {uploading ? 'Processing your report...' : 'Drag and drop your report here'}
            </p>
            <p style={{ fontSize: 14, color: theme.textSecondary }}>
              or click to browse files
            </p>
          </div>

          {/* OR Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }}></div>
            <span style={{ color: theme.textSecondary, fontSize: 14 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }}></div>
          </div>

          {/* Text Input */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>{currentLang.paste}</label>
              <button
                onClick={() => { setReportText(SAMPLE_REPORT); setErrorMsg(''); }}
                style={{
                  background: theme.primaryLight,
                  color: theme.primary,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {currentLang.sampleBtn}
              </button>
            </div>
            <textarea
              rows={6}
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              placeholder="Paste your medical report text here..."
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.6,
                outline: 'none'
              }}
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeReport}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '16px 32px',
              borderRadius: 12,
              border: 'none',
              background: loading ? theme.textSecondary : `linear-gradient(135deg, ${theme.primary}, #0d9488)`,
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(16, 185, 129, 0.3)'
            }}
          >
            {loading ? 'Analyzing your report...' : currentLang.explainBtn}
          </button>
        </div>

        {/* Results Section */}
        {(familySummary || doctorSummary) && (
          <div style={{
            background: theme.cardBg,
            borderRadius: 20,
            border: `1px solid ${theme.cardBorder}`,
            marginBottom: 32,
            overflow: 'hidden',
            boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            {/* Action Bar */}
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <button
                onClick={toggleVoice}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: speaking ? theme.danger : theme.secondary,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <MicIcon />
                {speaking ? currentLang.stopBtn : `${currentLang.listenBtn} ${language}`}
              </button>

              <button
                onClick={downloadReport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: `1px solid ${theme.inputBorder}`,
                  background: 'transparent',
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <DownloadIcon />
                {currentLang.downloadBtn}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <button
                onClick={() => { setActiveTab('family'); setSummary(familySummary); }}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  background: activeTab === 'family' ? theme.primaryLight : 'transparent',
                  color: activeTab === 'family' ? theme.primary : theme.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderBottom: activeTab === 'family' ? `2px solid ${theme.primary}` : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <UsersIcon />
                Family Mode
              </button>
              <button
                onClick={() => { setActiveTab('doctor'); setSummary(doctorSummary); }}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  background: activeTab === 'doctor' ? theme.secondaryLight : 'transparent',
                  color: activeTab === 'doctor' ? theme.secondary : theme.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderBottom: activeTab === 'doctor' ? `2px solid ${theme.secondary}` : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <StethoscopeIcon />
                Doctor Mode
              </button>
            </div>

            {/* Summary Content */}
            <div style={{ padding: 24 }}>
              <h4 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                color: activeTab === 'family' ? theme.primary : theme.secondary
              }}>
                {activeTab === 'family' ? currentLang.summaryTitle : 'Doctor Summary (English)'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {displaySummary.split('\n').filter(l => l.trim()).map((line, i) => {
                  const isNormal = line.toLowerCase().includes('normal') || line.includes('Normal');
                  const isHigh = line.includes('[High]') || line.toLowerCase().includes('high');
                  const isLow = line.includes('[Low]') || line.toLowerCase().includes('low');
                  
                  let bgColor = 'transparent';
                  let borderColor = 'transparent';
                  if (isHigh) { bgColor = theme.warningLight; borderColor = theme.warning; }
                  else if (isLow) { bgColor = theme.dangerLight; borderColor = theme.danger; }
                  else if (isNormal) { bgColor = theme.primaryLight; borderColor = theme.primary; }

                  return (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 14,
                      lineHeight: 1.7,
                      background: bgColor,
                      borderLeft: (isHigh || isLow || isNormal) ? `3px solid ${borderColor}` : 'none'
                    }}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {risk && (
          <div style={{
            background: risk.color === 'red' ? theme.dangerLight : 
                       risk.color === 'orange' ? theme.warningLight : theme.primaryLight,
            borderRadius: 20,
            padding: 24,
            marginBottom: 32,
            border: `1px solid ${risk.color === 'red' ? theme.danger : 
                                 risk.color === 'orange' ? theme.warning : theme.primary}`
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                padding: 12,
                borderRadius: 12,
                background: risk.color === 'red' ? theme.danger : 
                           risk.color === 'orange' ? theme.warning : theme.primary,
                color: 'white'
              }}>
                <AlertIcon />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                  {risk.emoji} Risk Level: {risk.risk_level}
                </h4>
                <p style={{ fontSize: 14, marginBottom: 12, color: theme.textSecondary }}>
                  {risk.advice}
                </p>
                <div style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  padding: '8px 12px',
                  background: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                  borderRadius: 8,
                  display: 'inline-block'
                }}>
                  ML Confidence: {risk.confidence}% | Haemoglobin: {risk.extracted?.haemoglobin} | 
                  Blood Sugar: {risk.extracted?.blood_sugar} | BP: {risk.extracted?.systolic_bp}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Share */}
        {familySummary && (
          <div style={{
            background: theme.cardBg,
            borderRadius: 20,
            border: `1px solid ${theme.cardBorder}`,
            padding: 24,
            marginBottom: 32,
            boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                padding: 10,
                borderRadius: 10,
                background: '#dcfce7',
                color: '#16a34a'
              }}>
                <ShareIcon />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{currentLang.whatsappTitle}</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>
                  Share your analysis with family or doctors
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <button
                onClick={shareFamilyOnWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#25D366',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <UsersIcon />
                {currentLang.shareFamily}
              </button>
              <button
                onClick={shareDoctorOnWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: theme.secondary,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <StethoscopeIcon />
                {currentLang.shareDoctor}
              </button>
            </div>
          </div>
        )}

        {/* Chat Section */}
        {summary && (
          <div style={{
            background: theme.cardBg,
            borderRadius: 20,
            border: `1px solid ${theme.cardBorder}`,
            marginBottom: 32,
            overflow: 'hidden',
            boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                padding: 10,
                borderRadius: 10,
                background: theme.secondaryLight,
                color: theme.secondary
              }}>
                <MessageCircleIcon />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Ask MedSaathi</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>
                  Ask questions about your report in {language}
                </p>
              </div>
            </div>

            <div style={{
              height: 320,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {chatHistory.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: 40,
                  color: theme.textSecondary
                }}>
                  <MessageCircleIcon />
                  <p style={{ marginTop: 12 }}>{`${currentLang.askPlaceholder} ${language}...`}</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.type === 'user' ? theme.primary : (darkMode ? '#334155' : '#f1f5f9'),
                    color: msg.type === 'user' ? 'white' : theme.text,
                    fontSize: 14,
                    lineHeight: 1.6
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{
              padding: 16,
              borderTop: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              gap: 12
            }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && askQuestion()}
                placeholder={`${currentLang.askPlaceholder} ${language}...`}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `1px solid ${theme.inputBorder}`,
                  background: theme.inputBg,
                  color: theme.text,
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <button
                onClick={askQuestion}
                style={{
                  padding: '14px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: theme.secondary,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                <SendIcon />
                Send
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: theme.warningLight,
          border: `1px solid ${theme.warning}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12
        }}>
          <AlertIcon style={{ color: theme.warning, flexShrink: 0 }} />
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: darkMode ? theme.text : '#92400e' }}>
            {currentLang.disclaimer}
          </p>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '32px 0 16px',
          color: theme.textSecondary,
          fontSize: 13
        }}>
          <p style={{ margin: 0 }}>
            Made with care by MedSaathi Team
          </p>
        </footer>
      </main>
    </div>
  );
}
