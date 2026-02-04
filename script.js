(function() {
    // =================== 1. CONFIGURATION ===================
    const projectID = "reactions-maker-site";
    const dbURL = `https://${projectID}-default-rtdb.firebaseio.com/users.json`;
    const logoURL = "https://feiugum-codes.netlify.app/imgs/bnb.png";
    
    // =================== 2. UID & STORAGE LOGIC ===================
    let myUID = localStorage.getItem('ahmad_script_uid');
    if (!myUID) {
        myUID = Array.from({length: 20}, () => Math.floor(Math.random() * 10)).join('');
        localStorage.setItem('ahmad_script_uid', myUID);
    }

    // =================== 3. VERIFICATION LOGIC ===================
    fetch(dbURL).then(r => r.json()).then(data => {
        let isUnlocked = false;
        if (data) {
            Object.values(data).forEach(user => {
                if (user.id === myUID) isUnlocked = true;
            });
        }
        if (isUnlocked) { executeMainScript(); } 
        else { showLockUI(); }
    }).catch(() => { alert("Server Error! Check Internet."); });

    // =================== 4. LOCK UI ===================
    function showLockUI() {
        const overlay = document.createElement('div');
        overlay.id = "ahmad-lock-screen";
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            background: '#0e121a', zIndex: '2147483647', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'
        });
        overlay.innerHTML = `
            <div style="background: white; width: 320px; padding: 35px; border-radius: 25px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.5);">
                <img src="${logoURL}" style="width: 70px; margin-bottom: 15px;">
                <div style="color: #222; font-size: 24px; font-weight: 900; margin-bottom: 5px;">LOCKED</div>
                <div style="background: #f1f5f9; color: #334155; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 15px; border: 1px dashed #eab20c; margin-bottom: 20px;">${myUID}</div>
                <button onclick="location.reload()" style="width: 100%; background: #eab20c; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer;">RETRY</button>
            </div>`;
        document.body.appendChild(overlay);
    }

    // =================== 5. MAIN SCRIPT ===================
    function executeMainScript() {
        // Clear previous dialogs
        document.querySelectorAll("dialog").forEach(d => d.remove());

        // Dynamic CSS for Background and UI
        const styleElem = document.head.appendChild(document.createElement("style"));
        styleElem.innerHTML = `
            #box { 
                background-image: url('img.png'); 
                background-size: cover; 
                background-position: center;
                position: relative;
            }
            dialog::backdrop { background:#181a20; }
            .msg_span_voice { color: #34ace1 !important; font-weight: 500; }
        `;

        const box = document.querySelector("#box");
        if(box){
            box.style.display = "block";
            box.contentEditable = true;
        }

        // --- TIME UPDATE LOGIC ---
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en", { timeStyle: "short" });
            const recTime = document.querySelector(".receivedTime");
            const mobTime = document.querySelector(".time");
            if(recTime) recTime.innerHTML = timeStr;
            if(mobTime) mobTime.innerHTML = timeStr.replace(/\s|PM|AM/g, "");
        };
        updateTime();

        // --- IPHONE STYLE DOWNLOAD SYSTEM ---
        const btn = document.querySelector(".btn");
        if(btn){
            btn.addEventListener("click", () => {
                // UI Clean for Screenshot
                btn.style.opacity = "0"; 
                document.body.contentEditable = false;

                html2canvas(box, {
                    useCORS: true, // Image loading fix
                    scale: 3,      // High Quality
                    backgroundColor: null
                }).then(canvas => {
                    const link = document.createElement("a");
                    link.download = `iPhone_Feedback_${Date.now()}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();

                    // Restore UI
                    btn.style.opacity = "1";
                    document.body.contentEditable = true;
                });
            });
        }

        // Battery Logic
        const input = document.querySelector("input");
        const battery = document.querySelector(".battery2");
        if(input && battery){
            input.oninput = () => { battery.style.width = (Number(input.value) * 25 / 100) + "px"; };
        }
    }
})();
