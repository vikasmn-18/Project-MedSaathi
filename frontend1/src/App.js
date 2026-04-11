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
    appName: 'MedSaathi',
    upload: 'Upload Report (PDF or Image)',
    paste: 'Or Paste Report Text',
    explainBtn: 'Explain My Report',
    listenBtn: 'Listen in',
    stopBtn: 'Stop Speaking',
    downloadBtn: 'Download Report',
    shareFamily: 'Share — Family Mode',
    shareDoctor: 'Share — Doctor Mode',
    whatsappTitle: 'Share on WhatsApp',
    summaryTitle: 'Your Report Explained',
    doctorSummaryTitle: 'Doctor Summary',
    askPlaceholder: 'Ask in',
    askLabel: 'Ask MedSaathi',
    disclaimer: 'MedSaathi provides AI-generated summaries for informational purposes only. It does not replace professional medical advice. Please consult a qualified doctor for diagnosis or treatment.',
    disclaimerLabel: 'Disclaimer',
    uploadSuccess: 'File read successfully!',
    downloadSuccess: 'Downloaded!',
    sampleBtn: 'Try Sample Report',
    tryNow: 'Try Now',
    tagline: 'Built for India',
    heroTitle1: 'Your medical report,',
    heroTitle2: 'explained simply.',
    heroSubtitle: 'Paste or upload any lab report. MedSaathi explains every value in plain words — in your language — in under 30 seconds.',
    heroCta1: 'Explain my report →',
    heroCta2: 'Try sample report',
    secure: 'Secure',
    under30: 'Under 30 seconds',
    featuresTag: 'What MedSaathi does',
    featuresTitle: 'Everything you need to understand your health',
    appSectionTag: 'Try it now · Free · No account needed',
    appSectionTitle: 'Upload or paste your report',
    appSectionSub: 'Results in under 30 seconds.',
    analyzeLoading: 'Analyzing your report...',
    uploadLoading: 'Reading your report...',
    dropTitle: 'Drop PDF or image here',
    dropSub: 'or click to browse · PDF, JPG, PNG',
    riskLevel: 'Risk Level',
    familyMode: '👨‍👩‍👧 Family Mode',
    doctorMode: '🩺 Doctor Mode',
    sendBtn: 'Send',
    footer: '© 2025 MedSaathi · Free · Secure · Not a substitute for medical advice',
    pasteFirst: 'Please paste or upload a report first.',
    typeQuestion: 'Type a question first.',
    analyzeFirst: 'Analyze a report first.',
    downloadFail: 'Download failed. Check if backend is running.',
    uploadFail: 'Upload failed: ',
    analyzeError: 'Error analyzing report: ',
    voiceError: 'Voice error. Try English or use Chrome.',
    chromeTip: 'Use Chrome for voice support.',
    features: [
      {
        icon: '🧬',
        tag: 'Pattern Analysis',
        title: 'Reads your full report — not just one value',
        desc: 'High sugar + low haemoglobin + high creatinine together tells a completely different story. MedSaathi connects the dots across your entire report.',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'Dual Mode',
        title: 'Two summaries — one for family, one for your doctor',
        desc: 'Family Mode explains in plain words. Doctor Mode gives the technical summary your physician needs.',
      },
      {
        icon: '🌐',
        tag: '6 Indian Languages',
        title: 'Your language, not just English',
        desc: 'Hindi, Tamil, Telugu, Kannada, Bengali, English. Because clarity in your mother tongue makes all the difference.',
      },
      {
        icon: '🔊',
        tag: 'Voice Readout',
        title: 'Listen to your report — don\'t just read it',
        desc: 'MedSaathi reads your summary out loud in your language. Built for elderly patients who struggle with small text.',
      },
      {
        icon: '⚠️',
        tag: 'Risk Assessment',
        title: 'Know if it\'s serious — instantly',
        desc: 'Green means okay. Orange means watch out. Red means see a doctor today. Honest, immediate clarity.',
      },
      {
        icon: '📲',
        tag: 'WhatsApp Share',
        title: 'Share on WhatsApp in one tap',
        desc: 'Send the family-friendly or doctor summary directly. No copy-paste, no screenshots.',
      },
    ],
  },
  Hindi: {
    appName: 'मेडसाथी',
    upload: 'रिपोर्ट अपलोड करें (PDF या इमेज)',
    paste: 'या रिपोर्ट टेक्स्ट पेस्ट करें',
    explainBtn: 'मेरी रिपोर्ट समझाएं',
    listenBtn: 'सुनें',
    stopBtn: 'बंद करें',
    downloadBtn: 'रिपोर्ट डाउनलोड करें',
    shareFamily: 'फैमिली मोड शेयर',
    shareDoctor: 'डॉक्टर मोड शेयर',
    whatsappTitle: 'WhatsApp पर शेयर करें',
    summaryTitle: 'आपकी रिपोर्ट',
    doctorSummaryTitle: 'डॉक्टर सारांश',
    askPlaceholder: 'पूछें',
    askLabel: 'मेडसाथी से पूछें',
    disclaimer: 'मेडसाथी केवल सूचनात्मक उद्देश्य के लिए AI-जनित सारांश प्रदान करता है। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। कृपया निदान या उपचार के लिए एक योग्य डॉक्टर से परामर्श करें।',
    disclaimerLabel: 'अस्वीकरण',
    uploadSuccess: 'फाइल पढ़ी गई!',
    downloadSuccess: 'डाउनलोड सफल!',
    sampleBtn: 'सैंपल रिपोर्ट आज़माएं',
    tryNow: 'अभी आज़माएं',
    tagline: 'भारत के लिए बना',
    heroTitle1: 'आपकी मेडिकल रिपोर्ट,',
    heroTitle2: 'आसानी से समझाई।',
    heroSubtitle: 'कोई भी लैब रिपोर्ट पेस्ट या अपलोड करें। मेडसाथी हर मान को सरल शब्दों में समझाता है — आपकी भाषा में — 30 सेकंड में।',
    heroCta1: 'मेरी रिपोर्ट समझाएं →',
    heroCta2: 'सैंपल रिपोर्ट आज़माएं',
    secure: 'सुरक्षित',
    under30: '30 सेकंड में',
    featuresTag: 'मेडसाथी क्या करता है',
    featuresTitle: 'आपके स्वास्थ्य को समझने के लिए सब कुछ',
    appSectionTag: 'अभी आज़माएं · मुफ्त · कोई खाता नहीं',
    appSectionTitle: 'रिपोर्ट अपलोड या पेस्ट करें',
    appSectionSub: '30 सेकंड में परिणाम।',
    analyzeLoading: 'आपकी रिपोर्ट विश्लेषण हो रही है...',
    uploadLoading: 'आपकी रिपोर्ट पढ़ी जा रही है...',
    dropTitle: 'यहाँ PDF या इमेज छोड़ें',
    dropSub: 'या ब्राउज़ करने के लिए क्लिक करें · PDF, JPG, PNG',
    riskLevel: 'जोखिम स्तर',
    familyMode: '👨‍👩‍👧 फैमिली मोड',
    doctorMode: '🩺 डॉक्टर मोड',
    sendBtn: 'भेजें',
    footer: '© 2025 मेडसाथी · मुफ्त · सुरक्षित · चिकित्सा सलाह का विकल्प नहीं',
    pasteFirst: 'कृपया पहले रिपोर्ट पेस्ट या अपलोड करें।',
    typeQuestion: 'पहले एक सवाल टाइप करें।',
    analyzeFirst: 'पहले एक रिपोर्ट विश्लेषण करें।',
    downloadFail: 'डाउनलोड विफल। जांचें कि बैकएंड चल रहा है।',
    uploadFail: 'अपलोड विफल: ',
    analyzeError: 'रिपोर्ट विश्लेषण में त्रुटि: ',
    voiceError: 'वॉयस त्रुटि। English या Chrome आज़माएं।',
    chromeTip: 'वॉयस के लिए Chrome उपयोग करें।',
    features: [
      {
        icon: '🧬',
        tag: 'पैटर्न विश्लेषण',
        title: 'पूरी रिपोर्ट पढ़ता है — सिर्फ एक मान नहीं',
        desc: 'उच्च शुगर + कम हीमोग्लोबिन + उच्च क्रिएटिनिन मिलकर एक अलग कहानी बताते हैं। मेडसाथी पूरी रिपोर्ट के बिंदुओं को जोड़ता है।',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'दोहरा मोड',
        title: 'दो सारांश — परिवार के लिए और डॉक्टर के लिए',
        desc: 'फैमिली मोड सरल शब्दों में समझाता है। डॉक्टर मोड तकनीकी सारांश देता है।',
      },
      {
        icon: '🌐',
        tag: '6 भारतीय भाषाएं',
        title: 'आपकी भाषा, सिर्फ English नहीं',
        desc: 'हिंदी, तमिल, तेलुगू, कन्नड़, बंगाली, English। अपनी मातृभाषा में स्पष्टता सब कुछ बदल देती है।',
      },
      {
        icon: '🔊',
        tag: 'वॉयस रीडआउट',
        title: 'रिपोर्ट सुनें — सिर्फ पढ़ें नहीं',
        desc: 'मेडसाथी आपकी भाषा में सारांश जोर से पढ़ता है। बुजुर्ग मरीजों के लिए बनाया गया।',
      },
      {
        icon: '⚠️',
        tag: 'जोखिम आकलन',
        title: 'तुरंत जानें — गंभीर है या नहीं',
        desc: 'हरा मतलब ठीक है। नारंगी मतलब सावधान। लाल मतलब आज डॉक्टर के पास जाएं।',
      },
      {
        icon: '📲',
        tag: 'WhatsApp शेयर',
        title: 'एक टैप में WhatsApp पर शेयर करें',
        desc: 'परिवार या डॉक्टर को सीधे सारांश भेजें। कोई कॉपी-पेस्ट नहीं।',
      },
    ],
  },
  Tamil: {
    appName: 'மெட்சாத்தி',
    upload: 'அறிக்கை பதிவேற்றவும் (PDF அல்லது படம்)',
    paste: 'அல்லது அறிக்கை உரையை ஒட்டவும்',
    explainBtn: 'என் அறிக்கையை விளக்கு',
    listenBtn: 'கேளுங்கள்',
    stopBtn: 'நிறுத்து',
    downloadBtn: 'அறிக்கையை பதிவிறக்கு',
    shareFamily: 'குடும்ப மோட் பகிர்வு',
    shareDoctor: 'டாக்டர் மோட் பகிர்வு',
    whatsappTitle: 'WhatsApp-ல் பகிர்வு',
    summaryTitle: 'உங்கள் அறிக்கை விளக்கம்',
    doctorSummaryTitle: 'டாக்டர் சுருக்கம்',
    askPlaceholder: 'கேளுங்கள்',
    askLabel: 'மெட்சாத்தியிடம் கேளுங்கள்',
    disclaimer: 'மெட்சாத்தி தகவல் நோக்கத்திற்காக மட்டுமே AI-உருவாக்கிய சுருக்கங்களை வழங்குகிறது. இது தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாகாது. நோயறிதல் அல்லது சிகிச்சைக்கு தகுதிவாய்ந்த மருத்துவரை அணுகவும்.',
    disclaimerLabel: 'மறுப்பு',
    uploadSuccess: 'கோப்பு படிக்கப்பட்டது!',
    downloadSuccess: 'பதிவிறக்கம் வெற்றி!',
    sampleBtn: 'மாதிரி அறிக்கை',
    tryNow: 'இப்போது முயற்சிக்கவும்',
    tagline: 'இந்தியாவிற்காக உருவாக்கப்பட்டது',
    heroTitle1: 'உங்கள் மருத்துவ அறிக்கை,',
    heroTitle2: 'எளிதாக விளக்கப்பட்டது.',
    heroSubtitle: 'எந்த ஒரு ஆய்வக அறிக்கையையும் ஒட்டவும் அல்லது பதிவேற்றவும். மெட்சாத்தி ஒவ்வொரு மதிப்பையும் உங்கள் மொழியில் 30 வினாடிகளில் எளிய வார்த்தைகளில் விளக்குகிறது.',
    heroCta1: 'என் அறிக்கையை விளக்கு →',
    heroCta2: 'மாதிரி அறிக்கையை முயற்சிக்கவும்',
    secure: 'பாதுகாப்பானது',
    under30: '30 வினாடிகளில்',
    featuresTag: 'மெட்சாத்தி என்ன செய்கிறது',
    featuresTitle: 'உங்கள் ஆரோக்கியத்தை புரிந்துகொள்ள தேவையான அனைத்தும்',
    appSectionTag: 'இப்போது முயற்சிக்கவும் · இலவசம் · கணக்கு தேவையில்லை',
    appSectionTitle: 'அறிக்கையை பதிவேற்றவும் அல்லது ஒட்டவும்',
    appSectionSub: '30 வினாடிகளில் முடிவுகள்.',
    analyzeLoading: 'உங்கள் அறிக்கை பகுப்பாய்வு செய்யப்படுகிறது...',
    uploadLoading: 'உங்கள் அறிக்கை படிக்கப்படுகிறது...',
    dropTitle: 'இங்கே PDF அல்லது படத்தை இழுக்கவும்',
    dropSub: 'அல்லது உலாவ கிளிக் செய்யவும் · PDF, JPG, PNG',
    riskLevel: 'அபாய நிலை',
    familyMode: '👨‍👩‍👧 குடும்ப மோட்',
    doctorMode: '🩺 டாக்டர் மோட்',
    sendBtn: 'அனுப்பு',
    footer: '© 2025 மெட்சாத்தி · இலவசம் · பாதுகாப்பானது · மருத்துவ ஆலோசனைக்கு மாற்றல்ல',
    pasteFirst: 'முதலில் அறிக்கையை ஒட்டவும் அல்லது பதிவேற்றவும்.',
    typeQuestion: 'முதலில் ஒரு கேள்வி தட்டச்சு செய்யவும்.',
    analyzeFirst: 'முதலில் ஒரு அறிக்கையை பகுப்பாய்வு செய்யவும்.',
    downloadFail: 'பதிவிறக்கம் தோல்வி. பின்தளம் இயங்குகிறதா என சரிபார்க்கவும்.',
    uploadFail: 'பதிவேற்றம் தோல்வி: ',
    analyzeError: 'அறிக்கை பகுப்பாய்வில் பிழை: ',
    voiceError: 'குரல் பிழை. English அல்லது Chrome முயற்சிக்கவும்.',
    chromeTip: 'குரல் ஆதரவிற்கு Chrome பயன்படுத்தவும்.',
    features: [
      {
        icon: '🧬',
        tag: 'வடிவ பகுப்பாய்வு',
        title: 'முழு அறிக்கையை படிக்கிறது — ஒரு மதிப்பு மட்டுமல்ல',
        desc: 'அதிக சர்க்கரை + குறைந்த ஹீமோகுளோபின் + அதிக கிரியேட்டினின் சேர்ந்து வேறு கதை சொல்கின்றன. மெட்சாத்தி அனைத்தையும் இணைக்கிறது.',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'இரட்டை மோட்',
        title: 'இரண்டு சுருக்கங்கள் — குடும்பத்திற்கும் டாக்டருக்கும்',
        desc: 'குடும்ப மோட் எளிய வார்த்தைகளில் விளக்குகிறது. டாக்டர் மோட் தொழில்நுட்ப சுருக்கம் தருகிறது.',
      },
      {
        icon: '🌐',
        tag: '6 இந்திய மொழிகள்',
        title: 'உங்கள் மொழி, ஆங்கிலம் மட்டுமல்ல',
        desc: 'இந்தி, தமிழ், தெலுங்கு, கன்னடம், வங்காளம், ஆங்கிலம். தாய்மொழியில் தெளிவு எல்லாவற்றையும் மாற்றும்.',
      },
      {
        icon: '🔊',
        tag: 'குரல் வாசிப்பு',
        title: 'அறிக்கையை கேளுங்கள் — படிக்க மட்டுமல்ல',
        desc: 'மெட்சாத்தி உங்கள் மொழியில் சுருக்கத்தை உரக்க படிக்கிறது. வயதான நோயாளிகளுக்காக கட்டமைக்கப்பட்டது.',
      },
      {
        icon: '⚠️',
        tag: 'அபாய மதிப்பீடு',
        title: 'தீவிரமா என்று உடனே தெரியும்',
        desc: 'பச்சை = சரி. ஆரஞ்சு = கவனமாக இருங்கள். சிவப்பு = இன்று டாக்டரிடம் செல்லுங்கள்.',
      },
      {
        icon: '📲',
        tag: 'WhatsApp பகிர்வு',
        title: 'ஒரே தட்டுதலில் WhatsApp-ல் பகிர்வு',
        desc: 'குடும்பத்திற்கோ அல்லது டாக்டருக்கோ நேரடியாக அனுப்புங்கள். நகல் ஒட்டு தேவையில்லை.',
      },
    ],
  },
  Kannada: {
    appName: 'ಮೆಡ್‌ಸಾಥಿ',
    upload: 'ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (PDF ಅಥವಾ ಚಿತ್ರ)',
    paste: 'ಅಥವಾ ರಿಪೋರ್ಟ್ ಟೆಕ್ಸ್ಟ್ ಪೇಸ್ಟ್ ಮಾಡಿ',
    explainBtn: 'ನನ್ನ ರಿಪೋರ್ಟ್ ವಿವರಿಸಿ',
    listenBtn: 'ಕೇಳಿ',
    stopBtn: 'ನಿಲ್ಲಿಸಿ',
    downloadBtn: 'ರಿಪೋರ್ಟ್ ಡೌನ್‌ಲೋಡ್',
    shareFamily: 'ಫ್ಯಾಮಿಲಿ ಮೋಡ್ ಶೇರ್',
    shareDoctor: 'ಡಾಕ್ಟರ್ ಮೋಡ್ ಶೇರ್',
    whatsappTitle: 'WhatsApp ನಲ್ಲಿ ಶೇರ್ ಮಾಡಿ',
    summaryTitle: 'ನಿಮ್ಮ ರಿಪೋರ್ಟ್ ವಿವರಣೆ',
    doctorSummaryTitle: 'ಡಾಕ್ಟರ್ ಸಾರಾಂಶ',
    askPlaceholder: 'ಕೇಳಿ',
    askLabel: 'ಮೆಡ್‌ಸಾಥಿ ಗೆ ಕೇಳಿ',
    disclaimer: 'ಮೆಡ್‌ಸಾಥಿ ಕೇವಲ ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ AI-ಉತ್ಪಾದಿತ ಸಾರಾಂಶಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಇದು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ರೋಗ ನಿರ್ಣಯ ಅಥವಾ ಚಿಕಿತ್ಸೆಗಾಗಿ ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    disclaimerLabel: 'ಹಕ್ಕುತ್ಯಾಗ',
    uploadSuccess: 'ಫೈಲ್ ಓದಲಾಗಿದೆ!',
    downloadSuccess: 'ಡೌನ್‌ಲೋಡ್ ಯಶಸ್ವಿ!',
    sampleBtn: 'ಮಾದರಿ ರಿಪೋರ್ಟ್',
    tryNow: 'ಈಗ ಪ್ರಯತ್ನಿಸಿ',
    tagline: 'ಭಾರತಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    heroTitle1: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ರಿಪೋರ್ಟ್,',
    heroTitle2: 'ಸರಳವಾಗಿ ವಿವರಿಸಲಾಗಿದೆ.',
    heroSubtitle: 'ಯಾವುದೇ ಲ್ಯಾಬ್ ರಿಪೋರ್ಟ್ ಪೇಸ್ಟ್ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಮೆಡ್‌ಸಾಥಿ ಪ್ರತಿ ಮೌಲ್ಯವನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ 30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಸರಳ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ.',
    heroCta1: 'ನನ್ನ ರಿಪೋರ್ಟ್ ವಿವರಿಸಿ →',
    heroCta2: 'ಮಾದರಿ ರಿಪೋರ್ಟ್ ಪ್ರಯತ್ನಿಸಿ',
    secure: 'ಸುರಕ್ಷಿತ',
    under30: '30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ',
    featuresTag: 'ಮೆಡ್‌ಸಾಥಿ ಏನು ಮಾಡುತ್ತದೆ',
    featuresTitle: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಅಗತ್ಯವಿರುವ ಎಲ್ಲವೂ',
    appSectionTag: 'ಈಗ ಪ್ರಯತ್ನಿಸಿ · ಉಚಿತ · ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ',
    appSectionTitle: 'ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಅಥವಾ ಪೇಸ್ಟ್ ಮಾಡಿ',
    appSectionSub: '30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಫಲಿತಾಂಶ.',
    analyzeLoading: 'ನಿಮ್ಮ ರಿಪೋರ್ಟ್ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    uploadLoading: 'ನಿಮ್ಮ ರಿಪೋರ್ಟ್ ಓದಲಾಗುತ್ತಿದೆ...',
    dropTitle: 'ಇಲ್ಲಿ PDF ಅಥವಾ ಚಿತ್ರ ಇಳಿಸಿ',
    dropSub: 'ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ · PDF, JPG, PNG',
    riskLevel: 'ಅಪಾಯದ ಮಟ್ಟ',
    familyMode: '👨‍👩‍👧 ಫ್ಯಾಮಿಲಿ ಮೋಡ್',
    doctorMode: '🩺 ಡಾಕ್ಟರ್ ಮೋಡ್',
    sendBtn: 'ಕಳುಹಿಸಿ',
    footer: '© 2025 ಮೆಡ್‌ಸಾಥಿ · ಉಚಿತ · ಸುರಕ್ಷಿತ · ವೈದ್ಯಕೀಯ ಸಲಹೆಯ ಬದಲಿ ಅಲ್ಲ',
    pasteFirst: 'ದಯವಿಟ್ಟು ಮೊದಲು ರಿಪೋರ್ಟ್ ಪೇಸ್ಟ್ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    typeQuestion: 'ಮೊದಲು ಒಂದು ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ.',
    analyzeFirst: 'ಮೊದಲು ಒಂದು ರಿಪೋರ್ಟ್ ವಿಶ್ಲೇಷಿಸಿ.',
    downloadFail: 'ಡೌನ್‌ಲೋಡ್ ವಿಫಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.',
    uploadFail: 'ಅಪ್‌ಲೋಡ್ ವಿಫಲ: ',
    analyzeError: 'ರಿಪೋರ್ಟ್ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ದೋಷ: ',
    voiceError: 'ಧ್ವನಿ ದೋಷ. English ಅಥವಾ Chrome ಪ್ರಯತ್ನಿಸಿ.',
    chromeTip: 'ಧ್ವನಿ ಬೆಂಬಲಕ್ಕಾಗಿ Chrome ಬಳಸಿ.',
    features: [
      {
        icon: '🧬',
        tag: 'ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ',
        title: 'ಸಂಪೂರ್ಣ ರಿಪೋರ್ಟ್ ಓದುತ್ತದೆ — ಕೇವಲ ಒಂದು ಮೌಲ್ಯ ಅಲ್ಲ',
        desc: 'ಅಧಿಕ ಸಕ್ಕರೆ + ಕಡಿಮೆ ಹಿಮೋಗ್ಲೋಬಿನ್ + ಅಧಿಕ ಕ್ರಿಯೇಟಿನಿನ್ ಒಟ್ಟಿಗೆ ಬೇರೆ ಕಥೆ ಹೇಳುತ್ತದೆ. ಮೆಡ್‌ಸಾಥಿ ಎಲ್ಲವನ್ನೂ ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'ದ್ವಿ ಮೋಡ್',
        title: 'ಎರಡು ಸಾರಾಂಶ — ಕುಟುಂಬಕ್ಕೆ ಮತ್ತು ಡಾಕ್ಟರಿಗೆ',
        desc: 'ಫ್ಯಾಮಿಲಿ ಮೋಡ್ ಸರಳ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ. ಡಾಕ್ಟರ್ ಮೋಡ್ ತಾಂತ್ರಿಕ ಸಾರಾಂಶ ನೀಡುತ್ತದೆ.',
      },
      {
        icon: '🌐',
        tag: '6 ಭಾರತೀಯ ಭಾಷೆಗಳು',
        title: 'ನಿಮ್ಮ ಭಾಷೆ, ಕೇವಲ English ಅಲ್ಲ',
        desc: 'ಹಿಂದಿ, ತಮಿಳು, ತೆಲುಗು, ಕನ್ನಡ, ಬಂಗಾಳಿ, English. ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಸ್ಪಷ್ಟತೆ ಎಲ್ಲವನ್ನೂ ಬದಲಾಯಿಸುತ್ತದೆ.',
      },
      {
        icon: '🔊',
        tag: 'ಧ್ವನಿ ಓದುವಿಕೆ',
        title: 'ರಿಪೋರ್ಟ್ ಕೇಳಿ — ಕೇವಲ ಓದಬೇಡಿ',
        desc: 'ಮೆಡ್‌ಸಾಥಿ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸಾರಾಂಶ ಜೋರಾಗಿ ಓದುತ್ತದೆ. ವಯಸ್ಸಾದ ರೋಗಿಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
      },
      {
        icon: '⚠️',
        tag: 'ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ',
        title: 'ತಕ್ಷಣ ತಿಳಿಯಿರಿ — ಗಂಭೀರವಾ?',
        desc: 'ಹಸಿರು = ಸರಿ. ಕಿತ್ತಳೆ = ಎಚ್ಚರಿಕೆ. ಕೆಂಪು = ಇಂದೇ ಡಾಕ್ಟರ್ ಬಳಿ ಹೋಗಿ.',
      },
      {
        icon: '📲',
        tag: 'WhatsApp ಶೇರ್',
        title: 'ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ WhatsApp ನಲ್ಲಿ ಶೇರ್ ಮಾಡಿ',
        desc: 'ಕುಟುಂಬಕ್ಕೆ ಅಥವಾ ಡಾಕ್ಟರಿಗೆ ನೇರವಾಗಿ ಕಳುಹಿಸಿ. ಕಾಪಿ-ಪೇಸ್ಟ್ ಬೇಡ.',
      },
    ],
  },
  Telugu: {
    appName: 'మెడ్‌సాథి',
    upload: 'రిపోర్ట్ అప్‌లోడ్ చేయండి (PDF లేదా చిత్రం)',
    paste: 'లేదా రిపోర్ట్ టెక్స్ట్ పేస్ట్ చేయండి',
    explainBtn: 'నా రిపోర్ట్ వివరించండి',
    listenBtn: 'వినండి',
    stopBtn: 'ఆపండి',
    downloadBtn: 'రిపోర్ట్ డౌన్‌లోడ్',
    shareFamily: 'ఫ్యామిలీ మోడ్ షేర్',
    shareDoctor: 'డాక్టర్ మోడ్ షేర్',
    whatsappTitle: 'WhatsApp లో షేర్ చేయండి',
    summaryTitle: 'మీ రిపోర్ట్ వివరణ',
    doctorSummaryTitle: 'డాక్టర్ సారాంశం',
    askPlaceholder: 'అడగండి',
    askLabel: 'మెడ్‌సాథిని అడగండి',
    disclaimer: 'మెడ్‌సాథి కేవలం సమాచార ప్రయోజనాల కోసం AI-రూపొందించిన సారాంశాలను అందిస్తుంది. ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. దయచేసి రోగ నిర్ధారణ లేదా చికిత్స కోసం అర్హులైన డాక్టర్‌ని సంప్రదించండి.',
    disclaimerLabel: 'నిరాకరణ',
    uploadSuccess: 'ఫైల్ చదవబడింది!',
    downloadSuccess: 'డౌన్‌లోడ్ విజయవంతం!',
    sampleBtn: 'నమూనా రిపోర్ట్',
    tryNow: 'ఇప్పుడే ప్రయత్నించండి',
    tagline: 'భారతదేశం కోసం నిర్మించబడింది',
    heroTitle1: 'మీ వైద్య రిపోర్ట్,',
    heroTitle2: 'సులభంగా వివరించబడింది.',
    heroSubtitle: 'ఏదైనా ల్యాబ్ రిపోర్ట్ పేస్ట్ చేయండి లేదా అప్‌లోడ్ చేయండి. మెడ్‌సాథి ప్రతి విలువను మీ భాషలో 30 సెకన్లలో సరళమైన మాటలలో వివరిస్తుంది.',
    heroCta1: 'నా రిపోర్ట్ వివరించండి →',
    heroCta2: 'నమూనా రిపోర్ట్ ప్రయత్నించండి',
    secure: 'సురక్షితం',
    under30: '30 సెకన్లలో',
    featuresTag: 'మెడ్‌సాథి ఏమి చేస్తుంది',
    featuresTitle: 'మీ ఆరోగ్యాన్ని అర్థం చేసుకోవడానికి అవసరమైన అన్నీ',
    appSectionTag: 'ఇప్పుడే ప్రయత్నించండి · ఉచితం · ఖాతా అవసరం లేదు',
    appSectionTitle: 'రిపోర్ట్ అప్‌లోడ్ చేయండి లేదా పేస్ట్ చేయండి',
    appSectionSub: '30 సెకన్లలో ఫలితాలు.',
    analyzeLoading: 'మీ రిపోర్ట్ విశ్లేషించబడుతోంది...',
    uploadLoading: 'మీ రిపోర్ట్ చదవబడుతోంది...',
    dropTitle: 'ఇక్కడ PDF లేదా చిత్రాన్ని వేయండి',
    dropSub: 'లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి · PDF, JPG, PNG',
    riskLevel: 'ప్రమాద స్థాయి',
    familyMode: '👨‍👩‍👧 ఫ్యామిలీ మోడ్',
    doctorMode: '🩺 డాక్టర్ మోడ్',
    sendBtn: 'పంపు',
    footer: '© 2025 మెడ్‌సాథి · ఉచితం · సురక్షితం · వైద్య సలహాకు ప్రత్యామ్నాయం కాదు',
    pasteFirst: 'దయచేసి ముందు రిపోర్ట్ పేస్ట్ చేయండి లేదా అప్‌లోడ్ చేయండి.',
    typeQuestion: 'ముందు ఒక ప్రశ్న టైప్ చేయండి.',
    analyzeFirst: 'ముందు ఒక రిపోర్ట్ విశ్లేషించండి.',
    downloadFail: 'డౌన్‌లోడ్ విఫలం. బ్యాకెండ్ నడుస్తుందో లేదో తనిఖీ చేయండి.',
    uploadFail: 'అప్‌లోడ్ విఫలం: ',
    analyzeError: 'రిపోర్ట్ విశ్లేషణలో లోపం: ',
    voiceError: 'వాయిస్ లోపం. English లేదా Chrome ప్రయత్నించండి.',
    chromeTip: 'వాయిస్ మద్దతు కోసం Chrome ఉపయోగించండి.',
    features: [
      {
        icon: '🧬',
        tag: 'నమూనా విశ్లేషణ',
        title: 'మొత్తం రిపోర్ట్ చదువుతుంది — ఒక విలువ మాత్రమే కాదు',
        desc: 'అధిక చక్కెర + తక్కువ హీమోగ్లోబిన్ + అధిక క్రియేటినిన్ కలిసి వేరే కథ చెప్తాయి. మెడ్‌సాథి అన్నింటినీ అనుసంధానిస్తుంది.',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'ద్వంద్వ మోడ్',
        title: 'రెండు సారాంశాలు — కుటుంబానికి మరియు డాక్టర్‌కు',
        desc: 'ఫ్యామిలీ మోడ్ సరళమైన మాటలలో వివరిస్తుంది. డాక్టర్ మోడ్ సాంకేతిక సారాంశం ఇస్తుంది.',
      },
      {
        icon: '🌐',
        tag: '6 భారతీయ భాషలు',
        title: 'మీ భాష, ఆంగ్లం మాత్రమే కాదు',
        desc: 'హిందీ, తమిళం, తెలుగు, కన్నడ, బెంగాలీ, ఆంగ్లం. మాతృభాషలో స్పష్టత అన్నీ మారుస్తుంది.',
      },
      {
        icon: '🔊',
        tag: 'వాయిస్ రీడ్‌అవుట్',
        title: 'రిపోర్ట్ వినండి — చదవడం మాత్రమే కాదు',
        desc: 'మెడ్‌సాథి మీ భాషలో సారాంశాన్ని బిగ్గరగా చదువుతుంది. వృద్ధ రోగులకోసం నిర్మించబడింది.',
      },
      {
        icon: '⚠️',
        tag: 'ప్రమాద అంచనా',
        title: 'తక్షణం తెలుసుకోండి — తీవ్రమైనదా?',
        desc: 'ఆకుపచ్చ = సరే. నారింజ = జాగ్రత్త. ఎరుపు = ఈ రోజే డాక్టర్ దగ్గరకు వెళ్ళండి.',
      },
      {
        icon: '📲',
        tag: 'WhatsApp షేర్',
        title: 'ఒక్క ట్యాప్‌లో WhatsApp లో షేర్ చేయండి',
        desc: 'కుటుంబానికి లేదా డాక్టర్‌కు నేరుగా పంపండి. కాపీ-పేస్ట్ అవసరం లేదు.',
      },
    ],
  },
  Bengali: {
    appName: 'মেডসাথী',
    upload: 'রিপোর্ট আপলোড করুন (PDF বা ছবি)',
    paste: 'অথবা রিপোর্ট টেক্সট পেস্ট করুন',
    explainBtn: 'আমার রিপোর্ট ব্যাখ্যা করুন',
    listenBtn: 'শুনুন',
    stopBtn: 'থামুন',
    downloadBtn: 'রিপোর্ট ডাউনলোড',
    shareFamily: 'ফ্যামিলি মোড শেয়ার',
    shareDoctor: 'ডাক্তার মোড শেয়ার',
    whatsappTitle: 'WhatsApp এ শেয়ার করুন',
    summaryTitle: 'আপনার রিপোর্ট ব্যাখ্যা',
    doctorSummaryTitle: 'ডাক্তার সারসংক্ষেপ',
    askPlaceholder: 'জিজ্ঞাসা করুন',
    askLabel: 'মেডসাথীকে জিজ্ঞাসা করুন',
    disclaimer: 'মেডসাথী শুধুমাত্র তথ্যমূলক উদ্দেশ্যে AI-উত্পন্ন সারসংক্ষেপ প্রদান করে। এটি পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। দয়া করে রোগ নির্ণয় বা চিকিৎসার জন্য একজন যোগ্য ডাক্তারের সাথে পরামর্শ করুন।',
    disclaimerLabel: 'দায়বর্জন',
    uploadSuccess: 'ফাইল পড়া হয়েছে!',
    downloadSuccess: 'ডাউনলোড সফল!',
    sampleBtn: 'নমুনা রিপোর্ট',
    tryNow: 'এখনই চেষ্টা করুন',
    tagline: 'ভারতের জন্য তৈরি',
    heroTitle1: 'আপনার মেডিক্যাল রিপোর্ট,',
    heroTitle2: 'সহজভাবে ব্যাখ্যা করা হয়েছে।',
    heroSubtitle: 'যেকোনো ল্যাব রিপোর্ট পেস্ট বা আপলোড করুন। মেডসাথী প্রতিটি মান আপনার ভাষায় ৩০ সেকেন্ডে সহজ ভাষায় ব্যাখ্যা করে।',
    heroCta1: 'আমার রিপোর্ট ব্যাখ্যা করুন →',
    heroCta2: 'নমুনা রিপোর্ট চেষ্টা করুন',
    secure: 'সুরক্ষিত',
    under30: '৩০ সেকেন্ডে',
    featuresTag: 'মেডসাথী কী করে',
    featuresTitle: 'আপনার স্বাস্থ্য বুঝতে যা দরকার সবকিছু',
    appSectionTag: 'এখনই চেষ্টা করুন · বিনামূল্যে · কোনো অ্যাকাউন্ট নেই',
    appSectionTitle: 'রিপোর্ট আপলোড বা পেস্ট করুন',
    appSectionSub: '৩০ সেকেন্ডে ফলাফল।',
    analyzeLoading: 'আপনার রিপোর্ট বিশ্লেষণ করা হচ্ছে...',
    uploadLoading: 'আপনার রিপোর্ট পড়া হচ্ছে...',
    dropTitle: 'এখানে PDF বা ছবি ফেলুন',
    dropSub: 'অথবা ব্রাউজ করতে ক্লিক করুন · PDF, JPG, PNG',
    riskLevel: 'ঝুঁকির মাত্রা',
    familyMode: '👨‍👩‍👧 ফ্যামিলি মোড',
    doctorMode: '🩺 ডাক্তার মোড',
    sendBtn: 'পাঠান',
    footer: '© 2025 মেডসাথী · বিনামূল্যে · সুরক্ষিত · চিকিৎসা পরামর্শের বিকল্প নয়',
    pasteFirst: 'দয়া করে প্রথমে রিপোর্ট পেস্ট বা আপলোড করুন।',
    typeQuestion: 'প্রথমে একটি প্রশ্ন টাইপ করুন।',
    analyzeFirst: 'প্রথমে একটি রিপোর্ট বিশ্লেষণ করুন।',
    downloadFail: 'ডাউনলোড ব্যর্থ। ব্যাকএন্ড চলছে কিনা পরীক্ষা করুন।',
    uploadFail: 'আপলোড ব্যর্থ: ',
    analyzeError: 'রিপোর্ট বিশ্লেষণে ত্রুটি: ',
    voiceError: 'ভয়েস ত্রুটি। English বা Chrome চেষ্টা করুন।',
    chromeTip: 'ভয়েস সাপোর্টের জন্য Chrome ব্যবহার করুন।',
    features: [
      {
        icon: '🧬',
        tag: 'প্যাটার্ন বিশ্লেষণ',
        title: 'সম্পূর্ণ রিপোর্ট পড়ে — শুধু একটি মান নয়',
        desc: 'উচ্চ চিনি + কম হিমোগ্লোবিন + উচ্চ ক্রিয়েটিনিন একসাথে আলাদা গল্প বলে। মেডসাথী সব বিন্দু সংযুক্ত করে।',
      },
      {
        icon: '👨‍👩‍👧',
        tag: 'দ্বৈত মোড',
        title: 'দুটি সারসংক্ষেপ — পরিবারের জন্য এবং ডাক্তারের জন্য',
        desc: 'ফ্যামিলি মোড সহজ ভাষায় ব্যাখ্যা করে। ডাক্তার মোড প্রযুক্তিগত সারসংক্ষেপ দেয়।',
      },
      {
        icon: '🌐',
        tag: '৬টি ভারতীয় ভাষা',
        title: 'আপনার ভাষা, শুধু ইংরেজি নয়',
        desc: 'হিন্দি, তামিল, তেলুগু, কন্নড়, বাংলা, ইংরেজি। মাতৃভাষায় স্পষ্টতা সব পরিবর্তন করে।',
      },
      {
        icon: '🔊',
        tag: 'ভয়েস রিডআউট',
        title: 'রিপোর্ট শুনুন — শুধু পড়বেন না',
        desc: 'মেডসাথী আপনার ভাষায় সারসংক্ষেপ জোরে পড়ে। বয়স্ক রোগীদের জন্য তৈরি।',
      },
      {
        icon: '⚠️',
        tag: 'ঝুঁকি মূল্যায়ন',
        title: 'সঙ্গে সঙ্গে জানুন — গুরুতর কিনা',
        desc: 'সবুজ = ঠিক আছে। কমলা = সতর্ক থাকুন। লাল = আজই ডাক্তারের কাছে যান।',
      },
      {
        icon: '📲',
        tag: 'WhatsApp শেয়ার',
        title: 'এক ট্যাপে WhatsApp এ শেয়ার করুন',
        desc: 'পরিবার বা ডাক্তারকে সরাসরি পাঠান। কপি-পেস্ট দরকার নেই।',
      },
    ],
  },
};

const LANG_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Kannada', label: 'ಕನ್ನಡ' },
  { value: 'Bengali', label: 'বাংলা' },
];
function useReveal(threshold = 0.13) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [threshold]);  // ✅ FIX HERE

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
        display: 'flex', alignItems: 'center', gap: 32,
        padding: '28px 0',
        borderBottom: `1px solid ${C.border}`,
        flexDirection: even ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : (even ? 'translateX(-40px)' : 'translateX(40px)'),
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <div style={{ flex: '0 0 auto', width: 68, height: 68, borderRadius: 16, background: C.greenLight, border: `1px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
        {feat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green, marginBottom: 5, display: 'block' }}>
          {feat.tag}
        </span>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: '0 0 6px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
          {feat.title}
        </h3>
        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.65, margin: 0 }}>
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
  const [isListening, setIsListening] = useState(false);
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
    shadow: dark ? '0 2px 16px rgba(0,0,0,0.35)' : '0 2px 16px rgba(0,0,0,0.06)',
    navBg: dark ? 'rgba(15,17,23,0.95)' : 'rgba(255,255,255,0.95)',
  };

  const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3200); };
  const scrollToApp = () => appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const analyzeReport = async () => {
    if (!reportText.trim()) return showToast(L.pasteFirst, 'error');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze`, { report_text: reportText, language });
      setFamilySummary(res.data.family_summary || '');
      setDoctorSummary(res.data.doctor_summary || '');
      setSummary(res.data.family_summary || '');
      setRisk(res.data.risk);
      setActiveTab('family');
    } catch (e) {
      showToast(L.analyzeError + (e.response?.data?.error || e.message), 'error');
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
    } catch (e) { showToast(L.uploadFail + (e.response?.data?.error || e.message), 'error'); }
    finally { setUploading(false); }
  };

  const handleFileUpload = (e) => handleFileDrop(e.target.files[0]);

  const askQuestion = async () => {
    if (!question.trim()) return showToast(L.typeQuestion, 'error');
    if (!reportText.trim()) return showToast(L.analyzeFirst, 'error');
    const userQ = question.trim(); setQuestion('');
    setChatHistory(prev => [...prev, { type: 'user', text: userQ }]);
    try {
      const res = await axios.post(`${API}/ask`, { question: userQ, report_context: reportText, language });
      setChatHistory(prev => [...prev, { type: 'bot', text: res.data.answer || "Sorry, I couldn't answer that." }]);
    } catch { setChatHistory(prev => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]); }
  };

  const downloadReport = async () => {
    if (!summary) return showToast(L.analyzeFirst, 'error');
    try {
      const res = await axios.post(`${API}/download-pdf`, { summary, language }, { responseType: 'blob', timeout: 10000 });
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `MedSaathi_Report_${language}.txt`;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url); showToast(L.downloadSuccess);
    } catch { showToast(L.downloadFail, 'error'); }
  };

  const shareFamilyOnWhatsApp = () => {
    if (!familySummary) return showToast(L.analyzeFirst, 'error');
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🏥 ${L.appName} — ${L.familyMode}\n\nLanguage: ${language}\n\n${familySummary.substring(0, 700)}...\n\nGenerated by ${L.appName}`)}`, '_blank');
  };

  const shareDoctorOnWhatsApp = () => {
    if (!doctorSummary) return showToast(L.analyzeFirst, 'error');
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🏥 ${L.appName} — ${L.doctorMode}\n\n${doctorSummary.substring(0, 700)}...\n\nGenerated by ${L.appName}`)}`, '_blank');
  };

  const toggleVoice = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    if (!summary) return showToast(L.analyzeFirst, 'error');
    if (!('speechSynthesis' in window)) return showToast(L.chromeTip, 'error');
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(summary);
    const langMap = { Hindi: 'hi-IN', Tamil: 'ta-IN', Telugu: 'te-IN', Kannada: 'kn-IN', Bengali: 'bn-IN', English: 'en-IN' };
    utt.lang = langMap[language] || 'en-IN'; utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1.0;
    utt.onstart = () => setSpeaking(true); utt.onend = () => setSpeaking(false);
    utt.onerror = () => { setSpeaking(false); showToast(L.voiceError, 'error'); };
    window.speechSynthesis.speak(utt);
  };
const startVoiceInput = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast(L.chromeTip, 'error');
    return;
  }
  if (isListening) {
    setIsListening(false);
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  const langMap = {
    Hindi: 'hi-IN', Tamil: 'ta-IN', Telugu: 'te-IN',
    Kannada: 'kn-IN', Bengali: 'bn-IN', English: 'en-IN'
  };
  recognition.lang = langMap[language] || 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => setIsListening(true);
  recognition.onend = () => setIsListening(false);
  recognition.onerror = () => { setIsListening(false); showToast(L.voiceError, 'error'); };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setQuestion(transcript);
    // Auto-send after short delay so user can see what was captured
    setTimeout(() => {
      if (transcript.trim()) {
        const userQ = transcript.trim();
        setQuestion('');
        setChatHistory(prev => [...prev, { type: 'user', text: `🎤 ${userQ}` }]);
        axios.post(`${API}/ask`, { question: userQ, report_context: reportText, language })
          .then(res => setChatHistory(prev => [...prev, { type: 'bot', text: res.data.answer || "Sorry, I couldn't answer that." }]))
          .catch(() => setChatHistory(prev => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]));
      }
    }, 600);
  };
  recognition.start();
};
  const displaySummary = activeTab === 'family' ? familySummary : doctorSummary;
  const hasResult = familySummary || doctorSummary;
  const riskColors = {
    red: { bg: C.red, border: C.redBorder, badge: '#ef4444' },
    orange: { bg: C.amber, border: C.amberBorder, badge: '#f59e0b' },
    green: { bg: C.greenLight, border: C.greenBorder, badge: C.green },
  };

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
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.green }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: '-0.4px' }}>{L.appName}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 6, padding: '2px 7px', marginLeft: 2 }}>AI</span>
        </div>

        {/* Right side: language dropdown + Try Now + dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {LANG_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button onClick={scrollToApp} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {L.tryNow}
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
          {L.tagline}
        </div>

        <h1 className="anim-2" style={{ fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-1.5px', margin: '0 0 22px', color: C.text }}>
          {L.heroTitle1}<br />
          <span style={{ color: C.green }}>{L.heroTitle2}</span>
        </h1>

        <p className="anim-3" style={{ fontSize: 18, color: C.textSub, lineHeight: 1.75, maxWidth: 540, margin: '0 auto 36px' }}>
          {L.heroSubtitle}
        </p>

        <div className="anim-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <button onClick={scrollToApp} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.2px' }}>
            {L.heroCta1}
          </button>
          <button onClick={() => { setReportText(SAMPLE_REPORT); scrollToApp(); }} style={{ background: 'transparent', color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {L.heroCta2}
          </button>
        </div>

        {/* Trust pills */}
        <div className="anim-5" style={{ display: 'inline-flex', alignItems: 'center', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, padding: '10px 6px', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
          {[{ icon: '🔒', key: 'secure' }, { icon: '⚡', key: 'under30' }].map((item, i) => (
            <React.Fragment key={item.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px' }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>{L[item.key]}</span>
              </div>
              {i === 0 && <div style={{ width: 1, height: 16, background: C.border }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '16px 28px 60px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green }}>{L.featuresTag}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, color: C.text, margin: '10px 0 0', letterSpacing: '-0.5px' }}>
              {L.featuresTitle}
            </h2>
          </div>
        </Reveal>

        {L.features.map((feat, i) => (
          <FeatureRow key={i} feat={feat} idx={i} C={C} />
        ))}
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: C.border, maxWidth: 840, margin: '0 auto 64px' }} />

      {/* ── APP ── */}
      <div ref={appRef} style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 100px' }}>

        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green }}>{L.appSectionTag}</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '10px 0 6px', letterSpacing: '-0.5px' }}>{L.appSectionTitle}</h2>
            <p style={{ fontSize: 14, color: C.textSub, margin: 0 }}>{L.appSectionSub}</p>
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
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>{uploading ? L.uploadLoading : L.dropTitle}</p>
              <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{L.dropSub}</p>
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
              {loading ? L.analyzeLoading : L.explainBtn}
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
                    <span style={{ fontSize: 11, fontWeight: 700, color: rc.badge, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{L.riskLevel}</span>
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
                <button onClick={() => { setActiveTab('family'); setSummary(familySummary); }} style={btnOutline(activeTab === 'family')}>{L.familyMode}</button>
                <button onClick={() => { setActiveTab('doctor'); setSummary(doctorSummary); }} style={btnOutline(activeTab === 'doctor')}>{L.doctorMode}</button>
              </div>
              <div style={{ background: activeTab === 'family' ? C.greenLight : C.blueLight, border: `1px solid ${activeTab === 'family' ? C.greenBorder : C.blueBorder}`, borderRadius: 12, padding: '18px 20px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: activeTab === 'family' ? C.green : C.blue, margin: '0 0 12px', textTransform: 'uppercase' }}>
                  {activeTab === 'family' ? L.summaryTitle : L.doctorSummaryTitle}
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
              <p style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{L.askLabel}</p>
              <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 10, paddingRight: 4 }}>
                {chatHistory.length === 0 && (
                  <p style={{ color: C.textMuted, textAlign: 'center', padding: '20px 0', fontSize: 13 }}>{L.askPlaceholder} {language}...</p>
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
  <button
    onClick={startVoiceInput}
    title={isListening ? 'Listening...' : 'Speak your question'}
    style={{
      background: isListening ? '#ef4444' : C.greenLight,
      border: `1px solid ${isListening ? '#ef4444' : C.greenBorder}`,
      color: isListening ? '#fff' : C.green,
      borderRadius: 10,
      padding: '10px 14px',
      cursor: 'pointer',
      fontSize: 16,
      flexShrink: 0,
      transition: 'all 0.2s',
    }}
  >
    {isListening ? '⏹' : '🎤'}
  </button>
  <input
    value={question}
    onChange={e => setQuestion(e.target.value)}
    onKeyPress={e => e.key === 'Enter' && askQuestion()}
    placeholder={`${L.askPlaceholder} ${language}...`}
    style={{
      flex: 1, padding: '10px 14px', borderRadius: 10,
      border: `1px solid ${C.borderAccent}`, background: C.surface,
      color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit'
    }}
  />
  <button
    onClick={askQuestion}
    style={{
      background: C.blue, color: '#fff', padding: '10px 18px',
      borderRadius: 10, border: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 600
    }}
  >
    {L.sendBtn}
  </button>
</div>
            </div>
          </Reveal>
        )}

        {/* Disclaimer — always visible at bottom, fully translated */}
        <Reveal>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px', fontSize: 12, color: C.textSub, lineHeight: 1.75, marginTop: 8 }}>
            <span style={{ fontWeight: 700, color: C.textSub }}>{L.disclaimerLabel}: </span>{L.disclaimer}
          </div>
        </Reveal>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
          {L.footer}
        </p>
      </footer>

    </div>
  );
}