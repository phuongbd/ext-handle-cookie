export const isValidUrl = (urlString) => {
  let urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export function saveAsJsonOrText(data, fileName, type) {
  const fileType =
    type === "json" ? "application/json" : "text/plain;charset=utf-8";
  const stringified = type === "json" ? JSON.stringify(data, null, 2) : data;
  const blob = new Blob([stringified], { type: fileType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const fileExtensions = type === "json" ? ".json" : ".txt";
  a.download = fileName + fileExtensions;
  a.href = url;
  a.id = fileName;
  document.body.appendChild(a);
  a.click();
  document.querySelector("#" + a.id).remove();
}

export function formatDateTime(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date";
  }

  const addLeadingZero = (number) => (number < 10 ? "0" + number : number);

  const day = addLeadingZero(date.getDate());
  const month = addLeadingZero(date.getMonth() + 1); // Months are zero-based
  const year = addLeadingZero(date.getFullYear() % 100);
  const hours = addLeadingZero(date.getHours());
  const minutes = addLeadingZero(date.getMinutes());

  const formattedDateTime = `${day}_${month}_${year}_${hours}_${minutes}`;

  return formattedDateTime;
}

export function replaceDotsWithUnderscores(input) {
  const output = input.replace(/\./g, "_");
  return output;
}

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
