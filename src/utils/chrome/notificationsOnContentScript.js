/**
 * Author by https://github.com/cptonypham
 * script work on: background, popup
 * Setup theo từng step notifications.js
 */

import { CONSTANT_NOTIFICATIONS } from "./notifications";

/**
 * @param {string} title
 * @param {string} message
 */
export function createNotifications(options) {
  const request = { type: CONSTANT_NOTIFICATIONS.CREATE, options };
  return response(request);
}

export function clearNotifications() {
  const request = { type: CONSTANT_NOTIFICATIONS.CLEAR };
  return response(request);
}

async function response(request) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(request, async (response) => {
      resolve(response);
    });
  });
}
