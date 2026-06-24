// 1. مصفوفة قاموس المصطلحات اللسانية والبيئية التونسية لولاية القصرين والبادية
const linguisticDictionary = {
    "شقطمة": "الشوفطيم (جمع شوفط وتعني القضاة بالبونية الكنعانية) - تحور لغوي بفعل التصحيف البصري وتنقيط الفاء والقاف قديماً ونطق الـ G البدوية.",
    "سبيطلة": "سبط لاوي (مركز الشريعة والقضاء الشرعي السامي لحفظ هوية المهاجرين الأوائل).",
    "الشعانبي": "جبل أشعياء (جبل الرؤيا والنبوءة الحامي المحيط بالمنطقة تبركاً بنبوءات الخلاص الشامية).",
    "زرسط": "إحكام ربط الحبال بقوة شديدة على خشب القتب الموضوع على ظهر الجمل لحمل الأثقال (تعبير بدوي عن اشتداد الأزمات).",
    "مراح": "رمز الأمان الاقتصادي والاستقرار الاجتماعي والسيادة والبركة في الرزق الحلال البدوّي الموروث.",
    "فوسانة": "فوستانا (البستان والجنة الخضراء التي غُذيت تاريخياً بأكبر معاصر الزيتون بهنشير البقر)."
};

// 2. تفعيل خوارزمية الاستماع وتحويل الصوت إلى نص (Web Speech API) لمتصفح كروم
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.lang = 'ar-TN'; // ضبط ميكروفون الاستماع على الدارجة واللسان التونسي

    recognition.onresult = function(event) {
        const currentResultIndex = event.resultIndex;
        const spokenText = event.results[currentResultIndex].transcript.trim();
        
        console.log("الكلمة الملتقطة من الفيديو: ", spokenText);

        // 3. خوارزمية فحص ومطابقة الكلمات المسموعة مع القاموس
        for (let word in linguisticDictionary) {
            if (spokenText.includes(word)) {
                // أ: العثور على مشغل الفيديو في يوتيوب أو تيكتوك وإيقافه فوراً تلقائياً
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    videoElement.pause(); 
                }

                // ب: حقن وإظهار القاموس اللغوي على جانب الشاشة تلقائياً للمستخدم
                showLinguisticPanel(word, linguisticDictionary[word]);
                break;
            }
        }
    };

    recognition.start();
}

// 4. دالة بناء الواجهة الجانبية للقاموس على الشاشة (UI Sidebar Panel)
function showLinguisticPanel(word, explanation) {
    // إزالة أي نافذة قديمة لمنع تداخل واجهات العرض
    const oldPanel = document.getElementById('nlp-sidebar-panel');
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'nlp-sidebar-panel';
    panel.innerHTML = `
        <div style="position: fixed; right: 25px; top: 90px; width: 340px; background: #1a1b26; color: #a9b1d6; border: 2px solid #7aa2f7; border-radius: 12px; padding: 22px; z-index: 999999; font-family: sans-serif; box-shadow: 0px 8px 24px rgba(0,0,0,0.6); direction: rtl; text-align: right;">
            <h3 style="color: #ff9e64; margin-top: 0; font-size: 18px; border-bottom: 1px solid #3b4261; padding-bottom: 10px;">🎯 شفرة لسانية مكتشفة: ${word}</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #c0caf5; margin: 15px 0;">${explanation}</p>
            <hr style="border: 0; border-top: 1px solid #3b4261; margin: 15px 0;">
            <button id="resume-video-btn" style="width: 100%; background: #9ece6a; color: #1a1b26; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; margin-bottom: 10px; transition: 0.2s;">▶️ واصل تشغيل الفيديو</button>
            <button id="ask-query-btn" style="width: 100%; background: #7aa2f7; color: #1a1b26; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.2s;">❓ طلب استفسار إضافي عن المعنى</button>
        </div>
    `;

    document.body.appendChild(panel);

    // برمجة زر مواصلة تشغيل فيديو يوتيوب أو تيكتوك وإغلاق اللوحة الجانبية
    document.getElementById('resume-video-btn').addEventListener('click', () => {
        const videoElement = document.querySelector('video');
        if (videoElement) videoElement.play();
        panel.remove(); 
    });

    // برمجة زر طلب الاستفسار وإرسال إشعار التحديث
    document.getElementById('ask-query-btn').addEventListener('click', () => {
        alert(`تم تسجيل طلب الاستفسار والمحاورة الميدانية عن كلمة "${word}" بنجاح، وجاري تحويلها لقاعدة البيانات لتأصيل المعنى!`);
    });
}
