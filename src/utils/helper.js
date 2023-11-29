export function addScriptToDom(script_file, request, sendResponse) {
  // Them trackingId cho trang AE
  try {
    const { tabId } = request;

    function addScript(file_name) {
      const nullthrows = (v) => {
        if (v == null) throw new Error("it's a null");
        return v;
      };

      function injectCode(src) {
        const script = document.createElement("script");
        // This is why it works!
        script.src = src;
        script.onload = function () {
          console.log("script loaded", file_name);
        };

        // This script runs before the <head> element is created,
        // so we add the script to <html> instead.
        nullthrows(document.head || document.documentElement).appendChild(
          script
        );
      }
      injectCode(chrome.runtime.getURL(`/assets/${file_name}`));
    }

    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: addScript,
        args: [script_file],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("Error", chrome.runtime.lastError.message);
        }
      }
    );
    sendResponse(true);
  } catch (error) {
    console.log("Error addScriptToDom", error);
  }
}
