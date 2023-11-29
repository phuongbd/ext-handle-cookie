/**
 * Author by https://github.com/cptonypham
 * script work on: background, popup
 */

export const CONSTANT = {
  GET_TABS: "GET_TABS",
  SENDER_FROM_TAB: "SENDER_FROM_TAB",
  UPDATE_TAB: "UPDATE_TAB"
};

/**
 * add initListenerTab vào backgroundScript
 */
export function initListenerTab() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    listenTabs(request, sender, sendResponse);
  });
}

function listenTabs(request, sender, sendResponse) {
  try {
    const { type = "", tabId = null, options = {} } = request;

    switch (type) {
      case CONSTANT.GET_TABS:
        getTabs(options, sendResponse);
        break;
      case CONSTANT.SENDER_FROM_TAB:
        sendResponse(sender.tab);
        break;
      case CONSTANT.UPDATE_TAB:
        updateTab(tabId, options, sendResponse);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

export function getTabs(options = {}, sendResponse = null) {
  return new Promise((resolve) =>
    chrome.tabs.query(options, (tabs) => {
      sendResponse ? sendResponse(tabs) : resolve(tabs);
    })
  );
}

export function updateTab(tabId, options = {}, sendResponse = null) {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, options, (tabs) => {
      sendResponse ? sendResponse(tabs) : resolve(tabs);
    });
  });
}

export function sendMessageBackgroundToContentScript(message) {
  chrome.tabs.query({url: ["https://admin.shopify.com/*", "https://*.myshopify.com/admin/*", "https://*.ngrok-free.app/*", "https://*.alireviews.dev/*"]}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, message);
    });
  });
}