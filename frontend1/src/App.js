import React, { useState } from 'react';
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
  English: { selectLang:"Select Language", upload:"Upload Report (PDF or Image)", paste:"Or Paste Report Text", explainBtn:"Explain My Report", listenBtn:"Listen in", stopBtn:"Stop Speaking", downloadBtn:"Download PDF Report", shareFamily:"Share Family Mode", shareDoctor:"Share Doctor Mode", whatsappTitle:"Share Report on WhatsApp", summaryTitle:"Your Report Explained", askPlaceholder:"Ask in", disclaimer:"Disclaimer: MedSaathi provides AI-generated summaries for informational purposes only. It does not replace professional medical advice. Please consult a qualified doctor for diagnosis or treatment.", uploadSuccess:"File read successfully!", downloadSuccess:"Downloaded successfully!", sampleBtn:"Try Sample Report" },
  Hindi: { selectLang:"भाषा चुनें", upload:"रिपोर्ट अपलोड करें", paste:"या रिपोर्ट टेक्स्ट पेस्ट करें", explainBtn:"मेरी रिपोर्ट समझाएं", listenBtn:"सुनें", stopBtn:"बोलना बंद करें", downloadBtn:"PDF रिपोर्ट डाउनलोड करें", shareFamily:"फैमिली मोड शेयर", shareDoctor:"डॉक्टर मोड शेयर", whatsappTitle:"WhatsApp पर शेयर करें", summaryTitle:"आपकी रिपोर्ट", askPlaceholder:"पूछें", disclaimer:"डिस्क्लेमर: MedSaathi केवल सूचनात्मक उद्देश्य के लिए है। कृपया डॉक्टर से परामर्श करें।", uploadSuccess:"फाइल पढ़ी गई!", downloadSuccess:"डाउनलोड सफल!", sampleBtn:"सैंपल रिपोर्ट आज़माएं" },
  Tamil: { selectLang:"மொழி தேர்வு", upload:"அறிக்கை பதிவேற்றவும்", paste:"அல்லது உரை ஒட்டவும்", explainBtn:"என் அறிக்கை விளக்கு", listenBtn:"கேளுங்கள்", stopBtn:"நிறுத்து", downloadBtn:"PDF பதிவிறக்கு", shareFamily:"குடும்ப பகிர்வு", shareDoctor:"டாக்டர் பகிர்வு", whatsappTitle:"WhatsApp பகிர்வு", summaryTitle:"உங்கள் அறிக்கை", askPlaceholder:"கேளுங்கள்", disclaimer:"MedSaathi தகவல் நோக்கத்திற்காக மட்டுமே. மருத்துவரை அணுகவும்.", uploadSuccess:"கோப்பு படிக்கப்பட்டது!", downloadSuccess:"பதிவிறக்கம் வெற்றி!", sampleBtn:"மாதிரி அறிக்கை" },
  Kannada: { selectLang:"ಭಾಷೆ ಆಯ್ಕೆ", upload:"ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", paste:"ಅಥವಾ ಟೆಕ್ಸ್ಟ್ ಪೇಸ್ಟ್ ಮಾಡಿ", explainBtn:"ನನ್ನ ರಿಪೋರ್ಟ್ ವಿವರಿಸಿ", listenBtn:"ಕೇಳಿ", stopBtn:"ನಿಲ್ಲಿಸಿ", downloadBtn:"PDF ಡೌನ್‌ಲೋಡ್", shareFamily:"ಫ್ಯಾಮಿಲಿ ಶೇರ್", shareDoctor:"ಡಾಕ್ಟರ್ ಶೇರ್", whatsappTitle:"WhatsApp ಶೇರ್", summaryTitle:"ನಿಮ್ಮ ರಿಪೋರ್ಟ್", askPlaceholder:"ಕೇಳಿ", disclaimer:"MedSaathi ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.", uploadSuccess:"ಫೈಲ್ ಓದಲಾಗಿದೆ!", downloadSuccess:"ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿ!", sampleBtn:"ಮಾದರಿ ರಿಪೋರ್ಟ್" },
  Telugu: { selectLang:"భాష ఎంచుకోండి", upload:"రిపోర్ట్ అప్‌లోడ్ చేయండి", paste:"లేదా టెక్స్ట్ పేస్ట్ చేయండి", explainBtn:"నా రిపోర్ట్ వివరించండి", listenBtn:"వినండి", stopBtn:"ఆపండి", downloadBtn:"PDF డౌన్‌లోడ్", shareFamily:"ఫ్యామిలీ షేర్", shareDoctor:"డాక్టర్ షేర్", whatsappTitle:"WhatsApp షేర్", summaryTitle:"మీ రిపోర్ట్", askPlaceholder:"అడగండి", disclaimer:"MedSaathi సమాచారం కోసం మాత్రమే. దయచేసి డాక్టర్‌ని సంప్రదించండి.", uploadSuccess:"ఫైల్ చదవబడింది!", downloadSuccess:"డౌన్‌లోడ్ విజయవంతం!", sampleBtn:"నమూనా రిపోర్ట్" },
  Bengali: { selectLang:"ভাষা নির্বাচন", upload:"রিপোর্ট আপলোড করুন", paste:"অথবা টেক্সট পেস্ট করুন", explainBtn:"আমার রিপোর্ট ব্যাখ্যা করুন", listenBtn:"শুনুন", stopBtn:"থামুন", downloadBtn:"PDF ডাউনলোড", shareFamily:"ফ্যামিলি শেয়ার", shareDoctor:"ডাক্তার শেয়ার", whatsappTitle:"WhatsApp শেয়ার", summaryTitle:"আপনার রিপোর্ট", askPlaceholder:"জিজ্ঞাসা করুন", disclaimer:"MedSaathi শুধুমাত্র তথ্যের জন্য। দয়া করে ডাক্তারের সাথে পরামর্শ করুন।", uploadSuccess:"ফাইল পড়া হয়েছে!", downloadSuccess:"ডাউনলোড সফল!", sampleBtn:"নমুনা রিপোর্ট" }
};

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

  const currentLang = t[language] || t.English;

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
    const file = e.target.files[0];
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

  const downloadPDF = async () => {
    if (!summary) return showToast('Analyze report first', true);
    try {
      const res = await axios.post(
        `${API}/download-pdf`,
        { summary, language, english_summary: englishSummary },
        { responseType: 'blob', timeout: 20000 }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MedSaathi_Report_${language}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast(currentLang.downloadSuccess);
    } catch (e) {
      showToast('Download failed: ' + (e.response?.data?.error || e.message), true);
    }
  };

  const shareFamilyOnWhatsApp = () => {
    if (!familySummary) return showToast('Please analyze the report first', true);
    const message = `🏥 MedSaathi - Family Mode\n\nLanguage: ${language}\n\n${familySummary.substring(0, 700)}...\n\nGenerated by MedSaathi`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareDoctorOnWhatsApp = () => {
    if (!doctorSummary) return showToast('Please analyze the report first', true);
    const message = `🏥 MedSaathi - Doctor Mode\n\n${doctorSummary.substring(0, 700)}...\n\nGenerated by MedSaathi`;
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

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#1D9E75', color:'white', padding:'12px 24px', borderRadius:8, zIndex:9999, fontSize:14 }}>
          {toast}
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#dc2626', color:'white', padding:'12px 24px', borderRadius:8, zIndex:9999, fontSize:14, display:'flex', gap:12, alignItems:'center' }}>
          <span>{errorMsg}</span>
          <span onClick={() => setErrorMsg('')} style={{ cursor:'pointer', fontWeight:500 }}>x</span>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h1 style={{ color:'#1D9E75', fontSize:32, marginBottom:4 }}>MedSaathi</h1>
        <p style={{ color:'#666', fontSize:14 }}>Your Medical Report in Simple Language</p>
      </div>

      {/* Language */}
      <div style={{ background:'#f8f9fa', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #e9ecef' }}>
        <label style={{ display:'block', marginBottom:8, fontWeight:500, fontSize:14 }}>{currentLang.selectLang}</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}
          style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ccc', width:'100%', fontSize:14 }}>
          <option value="English">English</option>
          <option value="Hindi">हिंदी</option>
          <option value="Tamil">தமிழ்</option>
          <option value="Telugu">తెలుగు</option>
          <option value="Kannada">ಕನ್ನಡ</option>
          <option value="Bengali">বাংলা</option>
        </select>
      </div>

      {/* Upload */}
      <div style={{ background:'#f8f9fa', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #e9ecef' }}>
        <p style={{ fontWeight:500, marginBottom:10, fontSize:14 }}>{currentLang.upload}</p>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} style={{ fontSize:13 }} />
        {uploading && <p style={{ color:'#1D9E75', marginTop:8, fontSize:13 }}>Reading your report...</p>}
      </div>

      {/* Paste + Sample */}
      <div style={{ background:'#f8f9fa', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #e9ecef' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p style={{ fontWeight:500, fontSize:14, margin:0 }}>{currentLang.paste}</p>
          <button onClick={() => { setReportText(SAMPLE_REPORT); setErrorMsg(''); }}
            style={{ background:'#f0fdf4', color:'#166534', padding:'5px 12px', borderRadius:6,
              border:'0.5px solid #bbf7d0', cursor:'pointer', fontSize:12 }}>
            {currentLang.sampleBtn}
          </button>
        </div>
        <textarea rows={6} value={reportText} onChange={e => setReportText(e.target.value)}
          placeholder="Paste your medical report text here..."
          style={{ width:'100%', padding:12, borderRadius:8, border:'1px solid #ccc', fontSize:13, resize:'vertical', boxSizing:'border-box' }} />
        <button onClick={analyzeReport} disabled={loading}
          style={{ background: loading ? '#9ca3af' : '#1D9E75', color:'#fff', padding:'12px 28px',
            borderRadius:8, border:'none', width:'100%', marginTop:12, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Analyzing...' : currentLang.explainBtn}
        </button>
      </div>

      {/* Action Buttons */}
      {summary && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <button onClick={toggleVoice}
            style={{ background: speaking ? '#dc2626' : '#7F77DD', color:'#fff',
              padding:'12px', borderRadius:10, border:'none', cursor:'pointer', fontSize:14 }}>
            {speaking ? currentLang.stopBtn : `${currentLang.listenBtn} ${language}`}
          </button>
          <button onClick={downloadPDF}
            style={{ background:'#185FA5', color:'#fff', padding:'12px',
              borderRadius:10, border:'none', cursor:'pointer', fontSize:14 }}>
            {currentLang.downloadBtn}
          </button>
        </div>
      )}

      {/* Summary Tabs */}
      {(familySummary || doctorSummary) && (
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', gap:0, marginBottom:0 }}>
            <button onClick={() => { setActiveTab('family'); setSummary(familySummary); }}
              style={{ flex:1, padding:'10px', borderRadius:'10px 0 0 0', border:'1px solid #e9ecef',
                background: activeTab==='family' ? '#1D9E75' : '#f8f9fa',
                color: activeTab==='family' ? '#fff' : '#555', cursor:'pointer', fontSize:13, fontWeight:500 }}>
              Family Mode
            </button>
            <button onClick={() => { setActiveTab('doctor'); setSummary(doctorSummary); }}
              style={{ flex:1, padding:'10px', borderRadius:'0 10px 0 0', border:'1px solid #e9ecef',
                background: activeTab==='doctor' ? '#185FA5' : '#f8f9fa',
                color: activeTab==='doctor' ? '#fff' : '#555', cursor:'pointer', fontSize:13, fontWeight:500 }}>
              Doctor Mode
            </button>
          </div>
          <div style={{ background: activeTab==='family' ? '#f0fdf4' : '#eff6ff',
            border: `1px solid ${activeTab==='family' ? '#bbf7d0' : '#bfdbfe'}`,
            borderRadius:'0 0 12px 12px', padding:20 }}>
            <div style={{ fontWeight:500, color: activeTab==='family' ? '#166534' : '#1e3a5f', marginBottom:12, fontSize:15 }}>
              {activeTab==='family' ? currentLang.summaryTitle : 'Doctor Summary (English)'}
            </div>
            {displaySummary.split('\n').filter(l => l.trim()).map((line, i) => {
              const isNormal = line.toLowerCase().includes('normal') || line.includes('Normal');
              const isHigh = line.includes('[High]') || line.toLowerCase().includes('high');
              const isLow = line.includes('[Low]') || line.toLowerCase().includes('low');
              return (
                <div key={i} style={{
                  padding:'6px 10px', marginBottom:4, borderRadius:6, fontSize:13, lineHeight:1.8,
                  background: isHigh ? '#fff8e1' : isLow ? '#fff0f0' : 'transparent',
                  borderLeft: isHigh ? '3px solid #f59e0b' : isLow ? '3px solid #ef4444' : isNormal ? '3px solid #22c55e' : 'none',
                  paddingLeft: (isHigh || isLow || isNormal) ? '10px' : '6px'
                }}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk */}
      {risk && (
        <div style={{
          background: risk.color==='red' ? '#fff0f0' : risk.color==='orange' ? '#fff8e1' : '#f0fdf4',
          border: `1px solid ${risk.color==='red' ? '#ffcdd2' : risk.color==='orange' ? '#ffe082' : '#bbf7d0'}`,
          borderRadius:12, padding:16, marginBottom:16
        }}>
          <p style={{ fontWeight:500, fontSize:16, margin:'0 0 6px' }}>{risk.emoji} Risk Level: {risk.risk_level}</p>
          <p style={{ color:'#555', margin:'0 0 4px', fontSize:14 }}>{risk.advice}</p>
          <p style={{ fontSize:12, color:'#888', margin:0 }}>
            ML Confidence: {risk.confidence}% — Haemoglobin: {risk.extracted?.haemoglobin}, Blood Sugar: {risk.extracted?.blood_sugar}, BP: {risk.extracted?.systolic_bp}
          </p>
        </div>
      )}

       {/* Entities */}
      {entities && entities.tests && entities.tests.length > 0 && (
        <div style={{ background:'#f8f9fa', borderRadius:12, padding:14, marginBottom:16, border:'1px solid #e9ecef' }}>
          <p style={{ fontWeight:500, marginBottom:6, fontSize:14 }}>Tests Detected: {entities.tests.join(', ')}</p>
          {entities.diseases && entities.diseases.length > 0 &&
            <p style={{ color:'#dc2626', fontSize:13, margin:0 }}>Conditions: {entities.diseases.join(', ')}</p>}
        </div>
      )} 

       {/* WhatsApp Share */}
      {familySummary && (
        <div style={{ background:'#f8f9fa', padding:16, borderRadius:12, border:'1px solid #e9ecef', marginBottom:16 }}>
          <p style={{ fontWeight:500, textAlign:'center', marginBottom:12, fontSize:14 }}>{currentLang.whatsappTitle}</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <button onClick={shareFamilyOnWhatsApp}
              style={{ background:'#25D366', color:'white', padding:14, borderRadius:10, border:'none', cursor:'pointer', fontSize:13 }}>
              {currentLang.shareFamily}
            </button>
            <button onClick={shareDoctorOnWhatsApp}
              style={{ background:'#185FA5', color:'white', padding:14, borderRadius:10, border:'none', cursor:'pointer', fontSize:13 }}>
              {currentLang.shareDoctor}
            </button>
          </div>
        </div>
      )} 

    {/* Chatbot */}
      {summary && (
        <div style={{ background:'#f8f9fa', borderRadius:12, padding:16, border:'1px solid #e9ecef', marginBottom:16 }}>
          <p style={{ fontWeight:500, marginBottom:10, fontSize:14 }}>Ask MedSaathi about your report</p>
          <div style={{ maxHeight:280, overflowY:'auto', marginBottom:10 }}>
            {chatHistory.length === 0 && (
              <p style={{ color:'#999', textAlign:'center', padding:20, fontSize:13 }}>
                {`${currentLang.askPlaceholder} ${language}...`}
              </p>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent: msg.type==='user' ? 'flex-end' : 'flex-start', marginBottom:8 }}>
                <div style={{
                  background: msg.type==='user' ? '#1D9E75' : '#fff',
                  color: msg.type==='user' ? '#fff' : '#333',
                  padding:'10px 14px', fontSize:13, lineHeight:1.6,
                  borderRadius: msg.type==='user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  maxWidth:'80%', border: msg.type==='bot' ? '1px solid #e9ecef' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={question} onChange={e => setQuestion(e.target.value)}
              onKeyPress={e => e.key==='Enter' && askQuestion()}
              placeholder={`${currentLang.askPlaceholder} ${language}...`}
              style={{ flex:1, padding:10, borderRadius:8, border:'1px solid #ccc', fontSize:13 }} />
            <button onClick={askQuestion}
              style={{ background:'#185FA5', color:'#fff', padding:'10px 18px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13 }}>
              Send
            </button>
          </div>
        </div>
      )} 

      {/* Disclaimer */}
      <div style={{ marginTop:24, padding:14, background:'#fff3cd', borderRadius:8, fontSize:12, textAlign:'center', color:'#856404' }}>
        {currentLang.disclaimer}
      </div>

    </div>
  );
}
