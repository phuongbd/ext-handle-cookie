import { createRoot } from "react-dom/client";
import PopupInApp from "./Popup.jsx";

export default function initPopupInApp() {
  document.body.insertAdjacentHTML(
    "beforeend",
    "<div id='extCookieSharing'></div>"
  );

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    p { color: red;}
    div#ext-cookie-sharing-popup-root {
      position: fixed;
      top: 50px;
      right: 20px;
      z-index: 999999;
    }
  `);

  const host = document.querySelector("#extCookieSharing");
  const shadow = host.attachShadow({ mode: "open" });
  shadow.adoptedStyleSheets = [sheet];
  const divPopupRoot = document.createElement("div");
  divPopupRoot.id = "ext-cookie-sharing-popup-root";
  shadow.appendChild(divPopupRoot);

  const divPopupRootEle = host.shadowRoot.querySelector(
    "#ext-cookie-sharing-popup-root"
  );

  const root = createRoot(divPopupRootEle);
  root.render(<PopupInApp />);
}
