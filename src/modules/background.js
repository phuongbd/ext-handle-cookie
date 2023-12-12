import { queryType } from "~/constants";
import { setCookies } from "~/utils/chrome/cookies";
import { initListenerTab } from "~/utils/chrome/tabs";
import {
  requestAPI,
  requestFollowAPI,
  requestAPIResponseText,
  requestFollowAPIResponseText,
  requestAPINotOptionsResponseText,
  putAPI,
  post,
} from "~/utils/fetch";
import { addScriptToDom } from "~/utils/helper";

initListenerTab();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.contentScriptQuery) {
    case queryType.REQUEST:
      requestAPI(request.values.url, request.values.options).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.REQUEST_FOLLOW:
      requestFollowAPI(request.values.url).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.REQUEST_RESPONSE_TEXT:
      requestAPIResponseText(request.values.url, request.values.options).then(
        (res) => {
          sendResponse(res);
        }
      );
      break;
    case queryType.REQUEST_FOLLOW_RESPONSE_TEXT:
      requestFollowAPIResponseText(request.values.url).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.REQUEST_NOT_OPTIONS_RESPONSE_TEXT:
      requestAPINotOptionsResponseText(request.values.url).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.PUT:
      putAPI(request.values.url, request.values.data).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.POST:
      post(request.values.url, request.values.data).then((res) => {
        sendResponse(res);
      });
      break;
    case queryType.ADD_CUSTOM_SCRIPT_TO_DOM:
      addScriptToDom("customScript.js", request.values, sendResponse);
      break;
    case queryType.SET_COOKIES:
      setCookies(request.values.content, request.values.tabId, sendResponse);
      break;
  }
  // Will respond asynchronously.
  return true;
});
