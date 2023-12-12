import { queryType } from "~/constants";
import {
  requestAPI,
  requestFollowAPI,
  requestAPIResponseText,
  requestFollowAPIResponseText,
  requestAPINotOptionsResponseText,
  putAPI,
  post,
} from "./fetch";

export async function fetchDataBackground(contentScriptQuery, values = {}) {
  return new Promise(async (resolve, reject) => {
    const isBackgroundScript =
      (chrome.runtime &&
        chrome.runtime.restart &&
        chrome.runtime.restartAfterDelay &&
        true) ||
      false;
    let res = null;
    if (isBackgroundScript) {
      switch (contentScriptQuery) {
        case queryType.REQUEST:
          res = await requestAPI(values.url, values.options);
          break;
        case queryType.REQUEST_FOLLOW:
          res = await requestFollowAPI(values.url);
          break;
        case queryType.REQUEST_RESPONSE_TEXT:
          res = await requestAPIResponseText(values.url, values.options);
          break;
        case queryType.REQUEST_FOLLOW_RESPONSE_TEXT:
          res = await requestFollowAPIResponseText(values.url);
          break;
        case queryType.REQUEST_NOT_OPTIONS_RESPONSE_TEXT:
          res = await requestAPINotOptionsResponseText(values.url);
          break;
        case queryType.PUT:
          res = await putAPI(values.url, values.data);
          break;
        case queryType.POST:
          res = await post(values.url, values.data);
          break;
      }
      resolve(res);
    } else {
      chrome.runtime.sendMessage(
        {
          contentScriptQuery: contentScriptQuery,
          values: values,
        },
        function (response) {
          resolve(response);
        }
      );
    }
  });
}

export default async function request(url, options = {}) {
  return await fetchDataBackground("request", { url, options });
}

export async function request_follow(url) {
  return await fetchDataBackground("request_follow", { url });
}

export async function request_response_text(url, options = {}) {
  return await fetchDataBackground("request_response_text", { url, options });
}

export async function request_follow_response_text(url) {
  return await fetchDataBackground("request_follow_response_text", { url });
}

export async function request_not_options_response_text(url) {
  return await fetchDataBackground("request_not_options_response_text", {
    url,
  });
}

export async function put(url, data) {
  return await fetchDataBackground("put", { url, data });
}

export async function post_data(url, data) {
  return await fetchDataBackground("post", { url, data });
}
