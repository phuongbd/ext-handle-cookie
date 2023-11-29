/**
 * Author by https://github.com/cptonypham
 * script work on: background, popup
 */

export const CONSTANT_NOTIFICATIONS = {
  CREATE: "CREATE",
  CLEAR: "CLEAR"
};

export const opts = {
  type: "basic", // <basic: default | list>
  iconUrl: "icons/icon128.png"
};

/**
 * add initListenerTab vào backgroundScript
 */
export function initListenerNotifications() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    listenNotifications(request, sender, sendResponse);
  });
}

/**
 * # Step 1
 * Add vào chrome.runtime.onMessage.addListener
 * on backgroundScript
 */
function listenNotifications(request, sender, sendResponse) {
  try {
    const { type = "", options = {} } = request;

    switch (type) {
      case CONSTANT_NOTIFICATIONS.CREATE:
        createNotifications(options, sendResponse);
        break;
      case CONSTANT_NOTIFICATIONS.CLEAR:
        clearNotifications(sendResponse);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * # Step 2
 * Add vào on backgroundScript
 */
export function listenOnClickNotifications() {
  chrome.notifications.onClicked.addListener(function(notifId) {
    console.log("notifId", notifId);
  });
}

/**
 * @param {string} title
 * @param {string} message
 */
export async function createNotifications(options, sendResponse = null) {
  return new Promise((resolve) => {
    chrome.notifications.create({ ...opts, ...options }, () => {
      sendResponse ? sendResponse(true) : resolve(true);
    });
  });
}

export async function clearNotifications(sendResponse = null) {
  return new Promise(async (resolve) => {
    const ids = await getAllNotifications();
    [...ids].forEach((id) => {
      chrome.notifications.clear(id);
    });

    sendResponse ? sendResponse(true) : resolve(true);
  });
}

async function getAllNotifications() {
  return new Promise((resolve) => {
    chrome.notifications.getAll((obj) => resolve(Object.keys(obj)));
  });
}
