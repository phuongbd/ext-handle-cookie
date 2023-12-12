export async function setCookies(content, tabId, sendResponse) {
  if (content?.cookies) {
    const add = content.cookies.map((cookie) => {
      // eslint-disable-next-line no-unused-vars
      const { hostOnly, session, ...rest } = cookie;
      const cookieSet = { ...rest, url: content?.url };
      return chrome.cookies.set(cookieSet, function (c) {
        console.log("Cookie set:", c);
      });
    });
    await Promise.all(add);
    sendResponse(true);
    chrome.tabs.reload(tabId);
  }
}
