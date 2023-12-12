import { useEffect, useState, useRef } from "react";
import { StyledPopupWrap } from "./styled";
import CryptoJS from "crypto-js";
import {
  Button,
  Input,
  Space,
  Checkbox,
  Typography,
  Alert,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  formatDateTime,
  isValidUrl,
  replaceDotsWithUnderscores,
  saveAsJsonOrText,
} from "~/utils/helper";
import { queryType } from "~/constants";

const { Text, Title } = Typography;

const Popup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [webUrl, setWebUrl] = useState("");
  const [currentTabId, setCurrentTabId] = useState("");
  const [isReload, setIsReload] = useState(true);
  const [isValidWebUrl, setIsValidWebUrl] = useState(true);
  const [password, setPassword] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState({
    export: false,
    import: false,
    clear: false,
  });
  const inputCookieFile = useRef(null);

  const setStatusLoading = (type, status) => {
    setLoading((prev) => ({ ...prev, [type]: status }));
  };

  const handleReload = (e) => {
    setIsReload(e.target.checked);
  };

  const handleChangePassword = (e) => {
    const pass = e.target.value.trim();
    if (pass.length > 0) {
      setIsRequired(false);
      setPassword(pass);
    }
  };

  const handleWebUrl = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
      const checkUrl = isValidUrl(tab.url);
      setIsValidWebUrl(checkUrl);
      setCurrentTabId(tab.id);
      if (checkUrl) {
        let url = new URL(tab.url);
        setWebUrl(url);
      }
    }
  };

  const handleGetDomainCookies = async () => {
    try {
      return await chrome.cookies.getAll({ domain: webUrl?.hostname });
    } catch (error) {
      return `Unexpected error: ${error.message}`;
    }
  };

  const encryptText = (string, pass) => {
    return CryptoJS.AES.encrypt(string, pass).toString();
  };

  const decryptText = (text, pass) => {
    const bytes = CryptoJS.AES.decrypt(text, pass);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };

  const handleTriggerFile = () => {
    if (password.length === 0) {
      setIsRequired(true);
      return;
    }
    inputCookieFile.current.click();
  };

  const handleExportCookies = async () => {
    if (password.length === 0) {
      setIsRequired(true);
      return;
    }
    setStatusLoading("export", true);
    const dateTime = formatDateTime(new Date());
    const webUrlFormat = replaceDotsWithUnderscores(webUrl?.hostname);
    const fileName = `${webUrlFormat}_${dateTime}`;
    const cookies = await handleGetDomainCookies();
    const dataJson = {
      url: webUrl?.origin,
      cookies,
    };
    const dataEncrypt = encryptText(JSON.stringify(dataJson), password);
    saveAsJsonOrText(dataEncrypt, fileName, "text");
    setStatusLoading("export", false);
  };

  const handleImportCookies = (e) => {
    if (password.length === 0) {
      setIsRequired(true);
      return;
    }
    try {
      setStatusLoading("import", true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async function (e) {
        let content = e.target.result;
        inputCookieFile.current.value = null;
        const decode = decryptText(content, password);
        const contentParse = decode && JSON.parse(decode);

        chrome.runtime.sendMessage({
          contentScriptQuery: queryType.SET_COOKIES,
          values: {
            tabId: currentTabId,
            content: contentParse,
          },
        });
      };
      reader.readAsText(file);
      setStatusLoading("import", false);
    } catch (error) {
      setStatusLoading("import", false);
      console.log("error", error);
    }
  };

  const handleClearCookies = async () => {
    const isConfirm = window.confirm(
      `Do you want to remove all cookies of ${webUrl.hostname}?`
    );
    if (!isConfirm) return;
    setStatusLoading("clear", true);
    try {
      const cookies = await handleGetDomainCookies();

      if (cookies.length === 0) {
        setStatusLoading("clear", false);
        messageApi.open({
          type: "warning",
          content: "No cookies found",
        });
        return;
      }

      let pending = cookies.map((cookie) => {
        const protocol = cookie.secure ? "https:" : "http:";
        const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

        return chrome.cookies.remove({
          url: cookieUrl,
          name: cookie.name,
          storeId: cookie.storeId,
        });
      });
      await Promise.all(pending);
    } catch (error) {
      setStatusLoading("clear", false);
      messageApi.open({
        type: "error",
        content: `Unexpected error: ${error.message}`,
      });
      return;
    }
    setStatusLoading("clear", false);
    messageApi.open({
      type: "success",
      content: "All cookies deleted!",
    });
    chrome.tabs.reload(currentTabId);
  };

  useEffect(() => {
    handleWebUrl();
  }, []);

  return (
    <StyledPopupWrap>
      <div className="header">
        <Title level={5}>
          Cookies for: {webUrl?.hostname ? webUrl.hostname : "--"}
        </Title>
        <Button type="text" danger onClick={handleClearCookies}>
          Clear cookies
        </Button>
      </div>
      <div className="content">
        {!isValidWebUrl && (
          <Alert message="Please select a valid website!" type="warning" />
        )}

        <div className="password__title">
          <Text>Password</Text> <label className="label-required">*</label>
        </div>

        <div className="password__input-wrap">
          <Space.Compact className="password__input">
            <Input.Password
              placeholder="Password to encrypt/decrypt cookies"
              value={password}
              disabled={!isValidWebUrl}
              onChange={handleChangePassword}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />

            <input
              type="file"
              accept=".json, .txt"
              ref={inputCookieFile}
              onChange={handleImportCookies}
            ></input>
          </Space.Compact>
          {isRequired && <Text type="danger">This field is required.</Text>}

          <Checkbox
            disabled={!isValidWebUrl}
            checked={isReload}
            className="password__checkbox"
            onChange={handleReload}
          >
            Reload web-page after imported
          </Checkbox>
        </div>
      </div>
      <div className="footer">
        <Button
          disabled={!isValidWebUrl || loading.import}
          onClick={handleTriggerFile}
        >
          Import
        </Button>
        <Button
          type="primary"
          disabled={!isValidWebUrl || loading.export}
          onClick={handleExportCookies}
        >
          Export
        </Button>
      </div>

      {contextHolder}
    </StyledPopupWrap>
  );
};

export default Popup;
