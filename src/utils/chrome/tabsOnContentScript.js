/**
 * Author by https://github.com/cptonypham
 * script work on: contentScript
 * Setup theo từng step tabs.js
 */

import { CONSTANT } from "./tabs";

export async function getTabs(options = {}) {
  const request = { type: CONSTANT.GET_TABS, options };
  return await response(request);
}

export async function getCurrentTab() {
  const request = { type: CONSTANT.SENDER_FROM_TAB };
  return await response(request);
}

export async function updateTab(tabId = null, options = {}) {
  const request = { type: CONSTANT.UPDATE_TAB, tabId, options };
  return await response(request);
}

async function response(request) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(request, async (response) => {
      resolve(response);
    });
  });
}
