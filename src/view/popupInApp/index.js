import { createRoot } from "react-dom/client";
import PopupInApp from "./Popup.jsx";

export default function initPopupInApp() {
  document.body.insertAdjacentHTML(
    "beforeend",
    "<div id='extCookieSharing'></div>"
  );

  const host = document.querySelector("#extCookieSharing");
  const shadow = host.attachShadow({ mode: "open" });
  const divPopupRoot = document.createElement("div");
  divPopupRoot.id = "ext-cookie-sharing-popup-root";
  shadow.appendChild(divPopupRoot);

  const divPopupRootEle = host.shadowRoot.querySelector(
    "#ext-cookie-sharing-popup-root"
  );

  const root = createRoot(divPopupRootEle);
  root.render(<PopupInApp />);
}
