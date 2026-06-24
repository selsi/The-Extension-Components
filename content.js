// 1. إنشاء واجهة المستخدم لإدخال الكلمات والمعاني يدوياً (Input Form)
function createCustomNLPInput() {
    if (document.getElementById('custom-nlp-input-panel')) return;

    const inputPanel = document.createElement('div');
    inputPanel.id = 'custom-nlp-input-panel';
    inputPanel.innerHTML = `
        <div style="position: fixed; left: 20px; top: 100px; width: 300px; background: #1e1e2e; color: #cdd6f4; border: 2px solid #f5e0dc; border-radius: 12px; padding: 15px; z-index: 99999; font-family: sans-serif; box-shadow: 0px 4px 15px rgba(0,0,0,0.5); direction: rtl; text-align: right;">
            <h4 style="margin-top:0; color:#f5e0dc; border-bottom:1px solid #45475a; padding-bottom:5px;">📝 أداة التحكم الذكي بالفيديو</h4>
            <label style="font-size:12px; display:block; margin-bottom:5px;">الكلمة المراد إيقاف الفيديو عندها:</label>
            <input type="text" id="user-target-word" placeholder="اكتب الكلمة هنا..." style="width:90%; padding:8px; border-radius:6px; border:1px solid #45475a; background:#313244; color:#cdd6f4; margin-bottom:10px;">
            
            <label style="font-size:12px; display:block; margin-bottom:5px;">المعنى أو التفسير الذي سيظهر على الجانب:</label>
            <textarea id="user-word-meaning" placeholder="اكتب التفسير هنا..." style="width:90%; height:60px; padding:8px; border-radius:6px; border:1px solid #45475a; background:#313244; color:#cdd6f4; margin-bottom:10px; resize:none;"></textarea>
            
            <button id="activate-nlp-btn" style="width:100%; background:#a6e3a1; color:#11111b; border:none; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold;">⚡ تفعيل وضع الاستماع والإيقاف</button>
        </div>
    `;
    document.body.appendChild(inputPanel);

    // برمجة زر التفعيل وبدء الاستماع الصوتي للفيديو
    document.getElementById('activate-nlp-btn').addEventListener('click', () => {
        const targetWord = document.getElementById('user-target-word').value.trim();
        const wordMeaning = document.getElementById('user-word-meaning').value.trim();

        if (!targetWord || !wordMeaning) {
            alert("الرجاء إدخال الكلمة وتفسيرها أولاً!");
            return;
        }

        alert(`تم تفعيل الأداة! سيتم إيقاف الفيديو تلقائياً فور نطق كلمة: "${targetWord}"`);
        startVoiceMonitoring(targetWord, wordMeaning);
    });
}

// 2. محرك الاستماع الصوتي والمطابقة مع كلمة المستخدم (Web Speech API)
function startVoiceMonitoring(targetWord, wordMeaning) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
        alert("متصفحك لا يدعم خاصية التعرف على الصوت!");
        return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.lang = 'ar-TN'; // لسان المتحدث العام

    recognition.onresult = function(event) {
        const currentResultIndex = event.resultIndex;
        const spokenText = event.results[currentResultIndex].transcript.trim();
        
        console.log("النص الملتقط حالياً من الفيديو: ", spokenText);

        // إذا نطق الفيديو الكلمة التي حددها المستخدم يدوياً
        if (spokenText.includes(targetWord)) {
            // إيقاف مشغل الفيديو تلقائياً في يوتيوب أو تيكتوك
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.pause();
            }

            // إظهار لوحة المعجم الجانبية المخصصة
            showCustomDisplayPanel(targetWord, wordMeaning);
        }
    };

    recognition.start();
}

// 3. لوحة العرض الجانبية للمفاهيم المكتوبة من المستخدم
function showCustomDisplayPanel(word, meaning) {
    const oldPanel = document.getElementById('custom-display-panel');
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'custom-display-panel';
    panel.innerHTML = `
        <div style="position: fixed; right: 20px; top: 100px; width: 320px; background: #1e1e2e; color: #cdd6f4; border: 2px solid #89b4fa; border-radius: 12px; padding: 20px; z-index: 99999; font-family: sans-serif; box-shadow: 0px 4px 15px rgba(0,0,0,0.5); direction: rtl; text-align: right;">
            <h3 style="color: #89b4fa; margin-top: 0;">🔍 مصطلح مسموع: ${word}</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #a6adc8;">${meaning}</p>
            <hr style="border: 0; border-top: 1px solid #45475a; margin: 15px 0;">
            <button id="resume-custom-video-btn" style="width: 100%; background: #a6e3a1; color: #11111b; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 10px;">▶️ مواصلة تشغيل الفيديو</button>
            <button id="ask-custom-query-btn" style="width: 100%; background: #f38ba8; color: #11111b; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">❓ طلب استفسار عن الكلمة</button>
        </div>
    `;
    document.body.appendChild(panel);

    // زر مواصلة الفيديو وإزالة لوحة العرض
    document.getElementById('resume-custom-video-btn').addEventListener('click', () => {
        const videoElement = document.querySelector('video');
        if (videoElement) videoElement.play();
        panel.remove();
    });

    // زر طلب الاستفسار
    document.getElementById('ask-custom-query-btn').addEventListener('click', () => {
        alert(`تم إرسال طلب استفسار بخصوص كلمة "${word}" بنجاح!`);
    });
}

// تشغيل واجهة الإدخال تلقائياً بمجرد فتح يوتيوب أو تيكتوك
createCustomNLPInput();
