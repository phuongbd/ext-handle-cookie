/**
 * Author by https://github.com/cptonypham
 * LIMIT SIZE: local: 5,242,880 (bytes), sync: 1,000,000 (bytes)
 * When using storage.sync, the stored data will automatically be synced
 *    to any Chrome browser that the user is logged into,
 *    provided the user has sync enabled.
 */

/**
 * import {} from "@src/utils/chrome/tabs"
 */

/**
 * @param object || {}
 */
export async function setStorage(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => resolve(true));
  });
}

/**
 * @param object || {}
 */
export async function setStorageSync(data) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, () => resolve(true));
  });
}

/**
 * @return object || {}
 */
export async function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result));
  });
}

/**
 * @return object || {}
 */
export async function getStorageSync(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => resolve(result));
  });
}

/**
 * @param array string
 */
export async function removeStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.remove([key], () => resolve(true));
  });
}

/**
 * @param array string
 */
export async function removeStorageSync(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove([key], () => resolve(true));
  });
}

export async function clearStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => resolve(true));
  });
}

export async function clearStorageSync() {
  return new Promise((resolve) => {
    chrome.storage.sync.clear(() => resolve(true));
  });
}

/**
 * @param function callback
 */
export async function onStorage(cb) {
  return new Promise(() => {
    chrome.storage.local.onChanged.addListener((data) => cb(data));
  });
}

/**
 * @param function callback
 */
export async function onStorageSync(cb) {
  return new Promise(() => {
    chrome.storage.sync.onChanged.addListener((data) => cb(data));
  });
}
