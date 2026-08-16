(function () {
  const Z = 99999;

  function createWidget() {
    const styles = document.createElement("style");
    styles.textContent = `
      #aris-launcher {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: ${Z};
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #167FDB, #2E57B3);
        border: 2px solid rgba(22, 127, 219, 0.5);
        box-shadow: 0 0 20px rgba(22, 127, 219, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      #aris-launcher:hover { transform: scale(1.08); box-shadow: 0 0 30px rgba(46, 87, 179, 0.5); }
      #aris-launcher .aris-pulse {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid rgba(22, 127, 219, 0.6);
        animation: arisPulse 2s infinite;
      }
      @keyframes arisPulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.8); opacity: 0; }
      }
      #aris-panel {
        position: fixed;
        right: 20px;
        bottom: 92px;
        z-index: ${Z};
        width: 360px;
        max-width: calc(100vw - 40px);
        height: 520px;
        max-height: calc(100vh - 120px);
        background: #0c1220;
        border: 1px solid rgba(22, 127, 219, 0.35);
        border-radius: 18px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        box-shadow: 0 0 40px rgba(22, 127, 219, 0.25);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #aris-panel.open { display: flex; }
      #aris-header {
        background: linear-gradient(135deg, rgba(22, 127, 219, 0.15), rgba(46, 87, 179, 0.15));
        border-bottom: 1px solid rgba(22, 127, 219, 0.25);
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      #aris-header .aris-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: linear-gradient(135deg, #167FDB, #2E57B3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        flex-shrink: 0;
      }
      #aris-header .aris-title { flex: 1; }
      #aris-header .aris-name { color: #fff; font-weight: 700; font-size: 15px; }
      #aris-header .aris-status { color: #4ade80; font-size: 11px; margin-top: 2px; display: flex; align-items: center; gap: 5px; }
      #aris-header .aris-status::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #4ade80; }
      #aris-close {
        background: transparent;
        border: none;
        color: #9ca3af;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
      }
      #aris-close:hover { color: #fff; }
      #aris-messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(22, 127, 219, 0.4) transparent;
      }
      #aris-messages::-webkit-scrollbar { width: 5px; }
      #aris-messages::-webkit-scrollbar-thumb { background: rgba(22, 127, 219, 0.4); border-radius: 5px; }
      .aris-msg { max-width: 82%; padding: 10px 13px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
      .aris-msg.bot { align-self: flex-start; background: rgba(22, 127, 219, 0.12); border: 1px solid rgba(22, 127, 219, 0.2); color: #e5e7eb; border-bottom-left-radius: 4px; }
      .aris-msg.user { align-self: flex-end; background: #167FDB; color: #fff; font-weight: 500; border-bottom-right-radius: 4px; }
      .aris-msg.typing { display: flex; gap: 4px; align-items: center; }
      .aris-msg.typing span { width: 6px; height: 6px; border-radius: 50%; background: #167FDB; animation: arisBlink 1.2s infinite; }
      .aris-msg.typing span:nth-child(2) { animation-delay: 0.2s; }
      .aris-msg.typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes arisBlink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
      #aris-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
      .aris-chip {
        background: rgba(46, 87, 179, 0.15);
        border: 1px solid rgba(46, 87, 179, 0.3);
        color: #93C5FD;
        font-size: 11.5px;
        padding: 5px 11px;
        border-radius: 20px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .aris-chip:hover { background: rgba(46, 87, 179, 0.3); }
      #aris-input-row { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid rgba(22, 127, 219, 0.2); background: rgba(0, 0, 0, 0.3); }
      #aris-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(22, 127, 219, 0.25);
        border-radius: 22px;
        color: #fff;
        padding: 9px 15px;
        font-size: 13px;
        outline: none;
      }
      #aris-input:focus { border-color: rgba(22, 127, 219, 0.7); }
      #aris-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: #167FDB;
        color: #fff;
        cursor: pointer;
        font-size: 15px;
        flex-shrink: 0;
        transition: transform 0.2s;
      }
      #aris-send:hover { transform: scale(1.1); }
      @media (max-width: 480px) {
        #aris-panel { right: 10px; bottom: 82px; width: calc(100vw - 20px); }
        #aris-launcher { right: 12px; bottom: 12px; }
      }
    `;
    document.head.appendChild(styles);

    const launcher = document.createElement("div");
    launcher.id = "aris-launcher";
    launcher.innerHTML = `<div class="aris-pulse"></div><i class="fas fa-robot" style="font-size:24px"></i>`;
    launcher.title = "Chat with Mr Aris";

    const panel = document.createElement("div");
    panel.id = "aris-panel";
    panel.innerHTML = `
      <div id="aris-header">
        <div class="aris-avatar"><i class="fas fa-robot"></i></div>
        <div class="aris-title">
          <div class="aris-name">Mr Aris</div>
          <div class="aris-status">Online — AI Assistant</div>
        </div>
        <button id="aris-close" title="Close">&times;</button>
      </div>
      <div id="aris-messages"></div>
      <div id="aris-chips"></div>
      <div id="aris-input-row">
        <input id="aris-input" type="text" placeholder="Ask me anything..." autocomplete="off" />
        <button id="aris-send" title="Send"><i class="fas fa-paper-plane"></i></button>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const messagesEl = document.getElementById("aris-messages");
    const chipsEl = document.getElementById("aris-chips");
    const inputEl = document.getElementById("aris-input");
    const sendBtn = document.getElementById("aris-send");
    const closeBtn = document.getElementById("aris-close");

    let open = false;
    let greeted = false;

    function scrollBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

    function addMessage(text, type) {
      const div = document.createElement("div");
      div.className = "aris-msg " + type;
      div.innerHTML = text;
      messagesEl.appendChild(div);
      scrollBottom();
    }

    function addTyping() {
      const div = document.createElement("div");
      div.className = "aris-msg bot typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      scrollBottom();
      return div;
    }

    function botReply(text, after) {
      const typing = addTyping();
      setTimeout(function () {
        typing.remove();
        addMessage(text, "bot");
        if (after) after();
      }, 800 + Math.random() * 700);
    }

    const KNOWLEDGE = [
      { match: /(hello|hi|hii|hlo|hey|namaste|good (morning|afternoon|evening))/i, reply: "Hello! I'm <b>Mr Aris</b>, the AI assistant of Quantaris Group. Ask me anything about our services, pricing, careers, or the team!" },
      { match: /(who are you|what are you|your name|tum kaun|name kya)/i, reply: "I'm <b>Mr Aris</b> — your AI assistant here to help with everything about Quantaris Group. How can I help you today?" },
      { match: /(services|service|kya karte|offer|solutions)/i, reply: "We offer: <b>AI Digital Marketing</b> (Google Ads, Meta, PPC &amp; more), <b>Web Development</b>, <b>App Development</b>, <b>IT Consulting</b>, <b>SaaS/Product Development</b>, <b>AI Solutions</b>, <b>Business Strategy</b>, and <b>UX/UI Design</b>. Visit our <a href='/pages/services.html' style='color:#7FB3FF'>Services page</a> for details!" },
      { match: /(ux|ui|design|wireframe|prototype|user experience|interface)/i, reply: "We craft human-centred <b>UX/UI Design</b> — research, wireframes, prototypes, high-fidelity interfaces, and design systems that convert. See our <a href='/pages/services.html#ux-ui' style='color:#7FB3FF'>UX/UI Design service</a>!" },
      { match: /(price|pricing|cost|charge|fees|rate|kitna|costing)/i, reply: "Pricing depends on your project scope. For a free consultation, reach us at <b>info@quantaris.com</b> or call <b>+91 87911 90999</b> — we'll share a tailored quote!" },
      { match: /(website|web development|web design|site)/i, reply: "We build fast, modern, and SEO-friendly websites — corporate sites, e-commerce, and web apps. Check our <a href='/pages/services.html' style='color:#7FB3FF'>Services page</a>!" },
      { match: /(app|mobile|android|ios|application)/i, reply: "We build native (iOS/Android) and cross-platform apps with Flutter & React Native. Want one? Email <b>info@quantaris.com</b>!" },
      { match: /(ai|artificial|chatbot|machine learning)/i, reply: "We create AI-powered solutions — chatbots, automation, and data tools — to make your business smarter. Tell me about your idea!" },
      { match: /(marketing|social media|seo|ads|instagram|facebook)/i, reply: "Our AI Digital Marketing suite covers Google Ads, Meta, PPC, SEO, and social media — one engine for all your paid &amp; organic growth. See our <a href='/pages/services.html#ai-digital-marketing' style='color:#7FB3FF'>AI Digital Marketing service</a>!" },
      { match: /(contact|phone|number|call|email|mail|reach)/i, reply: "You can reach us at:<br>&#9993; <b>info@quantaris.com</b><br>&#9742; <b>+91 87911 90999</b><br>Careers: <b>hr@quantarisgroup.com</b><br>Legal: <b>legal@quantarisgroup.com</b><br>Visit the <a href='/pages/contact.html' style='color:#7FB3FF'>Contact page</a>!" },
      { match: /(address|location|office|where|visit|khahan)/i, reply: "Our office: <b>A Radha Vihar, Kamla Nagar, Agra, UP 282005</b>. Feel free to visit or message us!" },
      { match: /(team|member|founder|yash|sachin|gaurav|bhagwan|who works)/i, reply: "Our leaders: <b>Yash Raj Singh</b> (Founder &amp; President), <b>Sachin Arora</b> (Co-Founder &amp; Software Developer), <b>Gaurav</b> (Managing Partner), and <b>Bhagwan Singh</b> (Co-Founder). Meet them on the <a href='/pages/about.html' style='color:#7FB3FF'>About page</a>!" },
      { match: /(job|career|vacancy|hiring|intern|apply|role|position|opening)/i, reply: "We're hiring! Open roles: <b>SEO Specialist</b>, <b>HR Intern</b>, <b>Project Coordinator</b>, <b>Business Development Manager</b> &amp; <b>Executive</b>. Check the <a href='/pages/career.html' style='color:#7FB3FF'>Career page</a>!" },
      { match: /(about|company|quantaris|group)/i, reply: "Quantaris Group is an IT consultancy delivering AI solutions, web & app development, digital marketing, and business strategy. Learn more on the <a href='/pages/about.html' style='color:#7FB3FF'>About page</a>!" },
      { match: /(blog|article|post|news)/i, reply: "Check our latest insights on the <a href='/pages/blog.html' style='color:#7FB3FF'>Blog page</a> — trends on IT, development, and AI!" },
      { match: /(thank|thanks|dhanyavad|shukriya)/i, reply: "You're welcome! Happy to help. Anything else you'd like to know? 😊" },
      { match: /(bye|goodbye|ta-ta)/i, reply: "Goodbye! Feel free to chat with me anytime. Have a great day! 👋" }
    ];

    const FALLBACKS = [
      "Good question! For that, I'd suggest reaching out to our team at <b>info@quantaris.com</b> or <b>+91 87911 90999</b> — they'll give you a perfect answer!",
      "Hmm, I'm not 100% sure about that. Let me connect you with our team — email <b>info@quantaris.com</b> and we'll respond quickly!",
      "I don't have that info handy, but our team at Quantaris Group can help! Email <b>info@quantaris.com</b> or visit our <a href='/pages/contact.html' style='color:#7FB3FF'>Contact page</a>."
    ];

    function getReply(text) {
      for (let i = 0; i < KNOWLEDGE.length; i++) {
        if (KNOWLEDGE[i].match.test(text)) return KNOWLEDGE[i].reply;
      }
      return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    }

    const CHIPS = ["Our services", "Pricing", "Hiring / Careers", "Contact us", "Team & Founders", "Office address"];

    function renderChips() {
      chipsEl.innerHTML = "";
      CHIPS.forEach(function (chip) {
        const b = document.createElement("button");
        b.className = "aris-chip";
        b.textContent = chip;
        b.addEventListener("click", function () { sendMessage(chip); });
        chipsEl.appendChild(b);
      });
    }

    function sendMessage(text) {
      const value = (text != null ? text : inputEl.value).trim();
      if (!value) return;
      inputEl.value = "";
      addMessage(escapeHtml(value), "user");
      botReply(getReply(value));
    }

    function escapeHtml(str) {
      const d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }

    function toggle(force) {
      open = force != null ? force : !open;
      if (open) {
        panel.classList.add("open");
        renderChips();
        if (!greeted) {
          greeted = true;
          botReply("Hi there! 👋 I'm <b>Mr Aris</b> from Quantaris Group. Ask me anything — services, careers, pricing, or our team!", function () { inputEl.focus(); });
        } else {
          inputEl.focus();
        }
      } else {
        panel.classList.remove("open");
      }
    }

    launcher.addEventListener("click", function () { toggle(); });
    closeBtn.addEventListener("click", function () { toggle(false); });
    sendBtn.addEventListener("click", function () { sendMessage(); });
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
