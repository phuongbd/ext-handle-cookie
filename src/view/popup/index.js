import { createRoot } from "react-dom/client";
import Popup from "./Popup.jsx";

export default function initPopup() {
  const domNode = document.getElementById("popupRoot");
  const root = createRoot(domNode);
  root.render(<Popup />);
}
