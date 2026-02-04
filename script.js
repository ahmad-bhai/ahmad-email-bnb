(function() {
    // =================== 1. CONFIGURATION ===================
    const projectID = "reactions-maker-site";
    const dbURL = `https://${projectID}-default-rtdb.firebaseio.com/users.json`;
    const logoURL = "logo.png";
    
    // =================== 2. UID & STORAGE LOGIC ===================
    let myUID = localStorage.getItem('ahmad_script_uid');
    if (!myUID) {
        myUID = Array.from({length: 20}, () => Math.floor(Math.random() * 10)).join('');
        localStorage.setItem('ahmad_script_uid', myUID);
    }

    // Toggle position logic (As per your saved instructions)
    let toggleState = localStorage.getItem('ahmad_toggle_pos') || 'on';

    // =================== 3. VERIFICATION LOGIC ===================
    fetch(dbURL).then(r => r.json()).then(data => {
        let isUnlocked = false;
        if (data) {
            Object.values(data).forEach(user => {
                if (user.id === myUID) isUnlocked = true;
            });
        }

        if (isUnlocked) {
            // Direct Open if approved
            executeMainScript();
        } else {
            // Show Lock Screen if not approved
            showLockUI();
        }
    }).catch(() => {
        alert("Server Error! Check Internet.");
    });

    // =================== 4. LOCK UI (WHITE BOX) ===================
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
                <div style="color: #222; font-size: 24px; font-weight: 900; letter-spacing: 1px; margin-bottom: 5px;">LOCKED</div>
                <div style="color: #ef4444; font-size: 13px; margin-bottom: 20px; font-weight: bold;">ID Not Registered</div>
                
                <div style="background: #f1f5f9; color: #334155; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 16px; border: 1px dashed #eab20c; margin-bottom: 25px; word-break: break-all;">
                    ${myUID}
                </div>

                <div style="text-align: left; font-size: 14px; color: #444; line-height: 1.8; border-top: 1px solid #eee; padding-top: 15px;">
                    <b>Whatsapp:</b> <span style="color: #25d366;">+923120883884</span><br>
                    <b>Telegram:</b> <span style="color: #0088cc;">@AhmadTrader3</span><br>
                    <div style="margin-top: 12px; text-align: center; font-weight: bold; color: #222;">Made by @AhmadTrader3</div>
                </div>

                <button onclick="location.reload()" style="margin-top: 25px; width: 100%; background: #eab20c; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px;">RETRY</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // =================== 5. MAIN SCRIPT ===================
    function executeMainScript() {
        document.querySelectorAll("dialog").forEach(d => d.remove());

        const styleElem = document.head.appendChild(document.createElement("style"));
        styleElem.innerHTML = `
            dialog::backdrop {background:#181a20}
            ::selection {background:#eab20c;color:white}
            .msg_span_voice { color: #34ace1 !important; font-weight: 500; }
        `;

        const loader = document.createElement("dialog");
        document.body.appendChild(loader);
        loader.innerHTML = `<div>PLEASE WAIT...</div>`;
        loader.style = "border:none;outline:none;margin:auto;padding:1rem;background:#fff;";

        function showLoader(){
            loader.showModal();
            setTimeout(() => { if(loader.open) loader.close(); }, 1200);
        }
        showLoader();

        // Battery Control
        const input = document.querySelector("input");
        const battery = document.querySelector(".battery2");
        if(input && battery){
            const updateBattery = () => {
                battery.style.width = (Number(input.value) * 25 / 100) + "px";
            };
            updateBattery();
            input.oninput = updateBattery;
        }

        // Main Box Setup
        const box = document.querySelector("#box");
        if(box){
            box.style.display = "block";
            box.contentEditable = true;
        }

        // Time Updates
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en", { timeStyle: "short" });
            const recTime = document.querySelector(".receivedTime");
            const mobTime = document.querySelector(".time");
            if(recTime) recTime.innerHTML = timeStr;
            if(mobTime) mobTime.innerHTML = timeStr.replace(/\s|PM|AM/g, "");

            const formattedUTC = now.toISOString().replace("T", " ").slice(0, 19);
            const inTime1 = document.querySelector(".innerTime1");
            const inTime2 = document.querySelector(".innerTime2");
            if(inTime1) inTime1.innerHTML = formattedUTC;
            if(inTime2) inTime2.innerHTML = formattedUTC + " (UTC)";
        };
        updateTime();

        // Screenshot
        const btn = document.querySelector(".btn");
        btn?.addEventListener("click", () => {
            document.body.contentEditable = false;
            html2canvas(box).then(canvas => {
                const a = document.createElement("a");
                a.href = canvas.toDataURL("img.png");
                a.download = `SS-${Date.now()}.png`;
                a.click();
                document.body.contentEditable = true;
            });
        });

        console.log("System Status: Unlocked & Running.");
    }
})();
