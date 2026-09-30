export const LANGS = ['en', 'ta', 'hi']

export const STR = {
  en: {
    app: 'JeevanMitra', sub: 'Bovine mastitis forecasting for Indian dairy farms',
    role: 'Sign in as', farmer: 'Farmer', vet: 'Veterinarian', gov: 'Government official',
    email: 'Email or phone', pass: 'Password', enter: 'Enter dashboard', out: 'Sign out', back: 'Back',
    overview: 'Overview', stats: 'Monthly statistics', appointments: 'Appointments', ambient: 'Ambient temperature',
    highByMonth: 'High-risk cows by month',
    govDash: 'Government Dashboard', govSubtitle: 'State Biosecurity Portal · All regions', active: 'Active',
    totalFarms: 'Total farms', totalCows: 'Total cows', activeAlerts: 'Active alerts', schemes: 'Government schemes',
    searchFarm: 'Search farm or owner name', allRegions: 'All regions',
    allTaluks: 'All taluks', taluk: 'Taluk', sortFarm: 'Sort farms', farmAZ: 'Farm name (A-Z)',
    mostAlerts: 'Most alerts', mostCows: 'Most cows', farmDirectory: 'Registered farms & biosecurity directory',
    owner: 'Owner', showing: 'Showing', of: 'of', farms: 'farms', noFarms: 'No farms match these filters.',
    high: 'High risk', atrisk: 'At risk (moderate+)', herd: 'Herd size', avg: 'Mean risk score',
    risk: 'Risk', r0: 'No risk', r1: 'Low', r2: 'Moderate', r3: 'High', score: 'Risk score',
    animal: 'Animal', farm: 'Farm', district: 'District', breed: 'Breed', age: 'Age', lact: 'Lactation', yrs: 'years',
    scc: 'SCC', prio: 'Needs attention: high-risk animals', allc: 'All animals', riskCows: 'At-risk animals', riskEmpty: 'No moderate- or high-risk animals right now.', none: 'No high-risk animals right now.',
    isolatedCows: 'Isolated cows', isolateColumn: 'Isolate', isolateCow: 'Isolate cow', releaseCow: 'Release cow',
    cancel: 'Cancel appointment', cancelled: 'Cancelled', cancelFailed: 'Could not cancel the appointment.', actions: 'Actions',
    cancelSlot: 'Cancel slot',
    detail: 'Animal detail', params: 'All monitored parameters',
    behaviour: 'Behaviour', thermal: 'Thermal', milk: 'Milk', deviation: 'Deviation from baseline', trend: 'Trend',
    ch1: 'Milk yield vs SCC (30 days)', ch2: 'Temperature trends (30 days)', infl: 'Inflection',
    alertT: 'Mastitis risk detected', alertH: 'High risk. Contact the vet now.', alertB: 'Risk is rising. Consider calling the vet.',
    call: 'Call vet', callf: 'Call farmer', rec: 'Recommended action',
    rConductivity: 'Check milking hygiene and run a CMT on the affected quarter.',
    rTemperature: 'Udder temperature is up; have a vet examine the udder.',
    rYield: 'Milk yield is falling; review feed and udder health.',
    rOk: 'No action needed now; keep monitoring.',
    param: 'Parameter', all: 'All farms', last: 'Latest', chg: '12-month change',
    live: 'Supabase live', demo: 'Demo data', signInFail: "Couldn't sign in. Check the email and password.",
    gn: 'Normal', gw: 'Watch', gh: 'High'
  },
  ta: {
    app: 'JeevanMitra', sub: 'இந்தியக் கறவை மாட்டுப் பண்ணைகளுக்கான மடிவீக்க முன்கணிப்பு',
    role: 'இவ்வாறு உள்நுழைக', farmer: 'விவசாயி', vet: 'கால்நடை மருத்துவர்', gov: 'அரசு அதிகாரி',
    email: 'மின்னஞ்சல் அல்லது தொலைபேசி', pass: 'கடவுச்சொல்', enter: 'டாஷ்போர்டுக்குச் செல்', out: 'வெளியேறு', back: 'பின்செல்',
    overview: 'கண்ணோட்டம்', stats: 'மாதாந்திர புள்ளிவிவரம்', appointments: 'சந்திப்புகள்', ambient: 'சுற்றுப்புற வெப்பநிலை',
    highByMonth: 'மாத வாரியாக அதிக ஆபத்துள்ள மாடுகள்',
    govDash: 'அரசு டாஷ்போர்டு', govSubtitle: 'மாநில உயிர்பாதுகாப்பு தளம் · அனைத்து பகுதிகள்', active: 'செயலில்',
    totalFarms: 'மொத்தப் பண்ணைகள்', totalCows: 'மொத்த மாடுகள்', activeAlerts: 'செயலில் உள்ள எச்சரிக்கைகள்', schemes: 'அரசுத் திட்டங்கள்',
    searchFarm: 'பண்ணை அல்லது உரிமையாளர் பெயரைத் தேடு', allRegions: 'அனைத்து பகுதிகள்',
    allTaluks: 'அனைத்து வட்டங்கள்', taluk: 'வட்டம்', sortFarm: 'பண்ணைகளை வரிசைப்படுத்து', farmAZ: 'பண்ணை பெயர் (A-Z)',
    mostAlerts: 'அதிக எச்சரிக்கைகள்', mostCows: 'அதிக மாடுகள்', farmDirectory: 'பதிவுசெய்யப்பட்ட பண்ணைகள் மற்றும் உயிர்பாதுகாப்பு பட்டியல்',
    owner: 'உரிமையாளர்', showing: 'காண்பிக்கப்படுகிறது', of: '/', farms: 'பண்ணைகள்', noFarms: 'இந்த வடிகட்டிகளுக்கு பண்ணைகள் இல்லை.',
    high: 'அதிக ஆபத்து', atrisk: 'ஆபத்தில் (மிதம்+)', herd: 'மந்தை அளவு', avg: 'சராசரி ஆபத்து மதிப்பெண்',
    risk: 'ஆபத்து', r0: 'ஆபத்தில்லை', r1: 'குறைவு', r2: 'மிதம்', r3: 'அதிகம்', score: 'ஆபத்து மதிப்பெண்',
    animal: 'மாடு', farm: 'பண்ணை', district: 'மாவட்டம்', breed: 'இனம்', age: 'வயது', lact: 'கறவை காலம்', yrs: 'ஆண்டுகள்',
    scc: 'SCC', prio: 'கவனம் தேவை: அதிக ஆபத்துள்ள மாடுகள்', allc: 'அனைத்து மாடுகள்', riskCows: 'ஆபத்துள்ள மாடுகள்', riskEmpty: 'தற்போது மிதமான அல்லது அதிக ஆபத்துள்ள மாடுகள் இல்லை.', none: 'தற்போது அதிக ஆபத்துள்ள மாடுகள் இல்லை.',
    isolatedCows: 'தனிமைப்படுத்தப்பட்ட மாடுகள்', isolateColumn: 'தனிமைப்படுத்து', isolateCow: 'மாட்டைத் தனிமைப்படுத்து', releaseCow: 'தனிமையிலிருந்து விடுவி',
    cancel: 'சந்திப்பை ரத்துசெய்', cancelled: 'ரத்துசெய்யப்பட்டது', cancelFailed: 'சந்திப்பை ரத்துசெய்ய முடியவில்லை.', actions: 'செயல்கள்', cancelSlot: 'நேரத்தை ரத்துசெய்',
    detail: 'மாட்டின் விவரம்', params: 'கண்காணிக்கப்படும் அனைத்து அளவுருக்கள்',
    behaviour: 'நடத்தை', thermal: 'வெப்பநிலை', milk: 'பால்', deviation: 'அடிப்படையிலிருந்து விலகல்', trend: 'போக்கு',
    ch1: 'பால் மகசூல் vs SCC (30 நாட்கள்)', ch2: 'வெப்பநிலை போக்கு (30 நாட்கள்)', infl: 'திருப்பம்',
    alertT: 'மடிவீக்க ஆபத்து கண்டறியப்பட்டது', alertH: 'அதிக ஆபத்து. உடனே மருத்துவரை அழைக்கவும்.', alertB: 'ஆபத்து அதிகரிக்கிறது. மருத்துவரை அழைப்பதைப் பரிசீலிக்கவும்.',
    call: 'மருத்துவரை அழை', callf: 'விவசாயியை அழை', rec: 'பரிந்துரைக்கப்படும் நடவடிக்கை',
    rConductivity: 'பால் கறக்கும் சுகாதாரத்தைச் சரிபார்த்து, பாதிக்கப்பட்ட மடிக்காம்பில் CMT சோதனை செய்யவும்.',
    rTemperature: 'மடி வெப்பநிலை உயர்ந்துள்ளது; கால்நடை மருத்துவரை அணுகி மடியை ஆய்வு செய்யவும்.',
    rYield: 'பால் அளவு குறைகிறது; தீவனம் மற்றும் மடி ஆரோக்கியத்தைச் சரிபார்க்கவும்.',
    rOk: 'தற்போது நடவடிக்கை தேவையில்லை; தொடர்ந்து கண்காணிக்கவும்.',
    param: 'அளவுரு', all: 'அனைத்துப் பண்ணைகள்', last: 'சமீபத்தியது', chg: '12 மாத மாற்றம்',
    live: 'Supabase நேரலை', demo: 'மாதிரி தரவு', signInFail: 'உள்நுழைய முடியவில்லை. மின்னஞ்சல் மற்றும் கடவுச்சொல்லைச் சரிபார்க்கவும்.',
    gn: 'இயல்பு', gw: 'கவனிக்க', gh: 'அதிகம்'
  },
  hi: {
    app: 'JeevanMitra', sub: 'भारतीय डेयरी फ़ार्मों के लिए थनैला रोग पूर्वानुमान',
    role: 'इस रूप में साइन इन करें', farmer: 'किसान', vet: 'पशु चिकित्सक', gov: 'सरकारी अधिकारी',
    email: 'ईमेल या फ़ोन', pass: 'पासवर्ड', enter: 'डैशबोर्ड खोलें', out: 'साइन आउट', back: 'वापस',
    overview: 'अवलोकन', stats: 'मासिक आँकड़े', appointments: 'अपॉइंटमेंट', ambient: 'परिवेश का तापमान',
    highByMonth: 'महीने के अनुसार उच्च जोखिम वाले पशु',
    govDash: 'सरकारी डैशबोर्ड', govSubtitle: 'राज्य जैव-सुरक्षा पोर्टल · सभी क्षेत्र', active: 'सक्रिय',
    totalFarms: 'कुल फ़ार्म', totalCows: 'कुल गायें', activeAlerts: 'सक्रिय अलर्ट', schemes: 'सरकारी योजनाएँ',
    searchFarm: 'फ़ार्म या मालिक का नाम खोजें', allRegions: 'सभी क्षेत्र',
    allTaluks: 'सभी तालुक', taluk: 'तालुक', sortFarm: 'फ़ार्म क्रमबद्ध करें', farmAZ: 'फ़ार्म नाम (A-Z)',
    mostAlerts: 'सबसे अधिक अलर्ट', mostCows: 'सबसे अधिक गायें', farmDirectory: 'पंजीकृत फ़ार्म और जैव-सुरक्षा निर्देशिका',
    owner: 'मालिक', showing: 'दिखाए जा रहे', of: '/', farms: 'फ़ार्म', noFarms: 'इन फ़िल्टर से कोई फ़ार्म नहीं मिला।',
    high: 'उच्च जोखिम', atrisk: 'जोखिम में (मध्यम+)', herd: 'झुंड का आकार', avg: 'औसत जोखिम स्कोर',
    risk: 'जोखिम', r0: 'कोई जोखिम नहीं', r1: 'कम', r2: 'मध्यम', r3: 'उच्च', score: 'जोखिम स्कोर',
    animal: 'पशु', farm: 'फ़ार्म', district: 'जिला', breed: 'नस्ल', age: 'आयु', lact: 'ब्यांत', yrs: 'वर्ष',
    scc: 'SCC', prio: 'ध्यान दें: उच्च जोखिम वाले पशु', allc: 'सभी पशु', riskCows: 'जोखिम वाले पशु', riskEmpty: 'अभी कोई मध्यम या उच्च जोखिम वाला पशु नहीं।', none: 'अभी कोई उच्च जोखिम वाला पशु नहीं।',
    isolatedCows: 'अलग रखी गई गायें', isolateColumn: 'अलग रखें', isolateCow: 'गाय को अलग रखें', releaseCow: 'गाय को अलगाव से हटाएँ',
    cancel: 'अपॉइंटमेंट रद्द करें', cancelled: 'रद्द', cancelFailed: 'अपॉइंटमेंट रद्द नहीं हो सका।', actions: 'कार्रवाई', cancelSlot: 'समय रद्द करें',
    detail: 'पशु विवरण', params: 'निगरानी के सभी पैरामीटर',
    behaviour: 'व्यवहार', thermal: 'तापीय', milk: 'दूध', deviation: 'आधार-रेखा से विचलन', trend: 'रुझान',
    ch1: 'दूध उत्पादन बनाम SCC (30 दिन)', ch2: 'तापमान रुझान (30 दिन)', infl: 'मोड़ बिंदु',
    alertT: 'थनैला जोखिम मिला', alertH: 'उच्च जोखिम। अभी पशु चिकित्सक को कॉल करें।', alertB: 'जोखिम बढ़ रहा है। पशु चिकित्सक को कॉल करने पर विचार करें।',
    call: 'चिकित्सक को कॉल करें', callf: 'किसान को कॉल करें', rec: 'अनुशंसित कार्रवाई',
    rConductivity: 'दुहाई की स्वच्छता जाँचें और प्रभावित थन पर CMT परीक्षण करें।',
    rTemperature: 'थन का तापमान बढ़ा है; पशु चिकित्सक से थन की जाँच कराएँ।',
    rYield: 'दूध उत्पादन घट रहा है; चारा और थन स्वास्थ्य जाँचें।',
    rOk: 'अभी कार्रवाई की आवश्यकता नहीं; निगरानी जारी रखें।',
    param: 'पैरामीटर', all: 'सभी फ़ार्म', last: 'नवीनतम', chg: '12 माह का बदलाव',
    live: 'Supabase लाइव', demo: 'डेमो डेटा', signInFail: 'साइन इन नहीं हो सका। ईमेल और पासवर्ड जाँचें।',
    gn: 'सामान्य', gw: 'निगरानी', gh: 'उच्च'
  }
}

// Parameter display names and short group labels, one string per language
// so components can do `PARAM_LABEL[key][lang]`.
export const PARAM_LABEL = {
  activity: ['Activity', 'செயல்பாடு', 'गतिविधि'],
  posture: ['Posture', 'தோரணை', 'मुद्रा'],
  rumination: ['Rumination', 'அசைபோடுதல்', 'जुगाली'],
  skin_temperature: ['Skin temperature', 'தோல் வெப்பநிலை', 'त्वचा तापमान'],
  udder_temperature: ['Udder temperature', 'மடி வெப்பநிலை', 'थन तापमान'],
  thermal_asymmetry: ['Thermal asymmetry', 'வெப்ப சமச்சீரின்மை', 'तापीय विषमता'],
  milk_yield: ['Milk yield', 'பால் மகசூல்', 'दूध उत्पादन'],
  milk_flow: ['Milk flow', 'பால் ஓட்டம்', 'दूध प्रवाह'],
  milk_conductivity: ['Milk conductivity', 'பால் கடத்துத்திறன்', 'दूध चालकता'],
  milk_temperature: ['Milk temperature', 'பால் வெப்பநிலை', 'दूध तापमान'],
  milk_ph: ['Milk pH', 'பால் pH', 'दूध pH'],
  activity_change: ['Activity change', 'செயல்பாட்டு மாற்றம்', 'गतिविधि परिवर्तन'],
  rumination_change: ['Rumination change', 'அசைபோடுதல் மாற்றம்', 'जुगाली परिवर्तन'],
  temperature_deviation: ['Temperature deviation', 'வெப்பநிலை விலகல்', 'तापमान विचलन'],
  yield_change: ['Yield change', 'மகசூல் மாற்றம்', 'उत्पादन परिवर्तन'],
  conductivity_change: ['Conductivity change', 'கடத்துத்திறன் மாற்றம்', 'चालकता परिवर्तन'],
  pH_deviation: ['pH deviation', 'pH விலகல்', 'pH विचलन'],
  historical_trend: ['Historical trend', 'வரலாற்றுப் போக்கு', 'ऐतिहासिक रुझान'],
  scc: ['SCC', 'SCC', 'SCC']
}

const LANG_INDEX = { en: 0, ta: 1, hi: 2 }

export function t(lang, key) {
  return (STR[lang] && STR[lang][key]) || STR.en[key] || key
}

export function paramLabel(lang, key) {
  const entry = PARAM_LABEL[key]
  return entry ? entry[LANG_INDEX[lang]] : key
}
