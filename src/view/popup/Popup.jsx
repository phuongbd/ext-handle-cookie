import { useEffect, useState, useRef } from "react";
import { StyledPopupWrap } from "./styled";
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
  saveJSON,
} from "~/utils/helper";

const { Text } = Typography;

const Popup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [webUrl, setWebUrl] = useState("");
  const [currentTabId, setCurrentTabId] = useState("");
  const [isReload, setIsReload] = useState(true);
  const [isValidWebUrl, setIsValidWebUrl] = useState(true);
  const [password, setPassword] = useState("");
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
    setPassword(e.target.value);
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

  const handleExportCookies = async () => {
    setStatusLoading("export", true);
    const cookies = await handleGetDomainCookies();
    const dataJson = {
      url: webUrl?.origin,
      cookies,
    };
    const dateTime = formatDateTime(new Date());
    const webUrlFormat = replaceDotsWithUnderscores(webUrl?.hostname);
    const fileName = `${webUrlFormat}_${dateTime}`;
    saveJSON(dataJson, fileName);
    setStatusLoading("export", false);
  };

  const handleTriggerFile = () => {
    inputCookieFile.current.click();
  };

  const handleImportCookies = (e) => {
    try {
      setStatusLoading("import", true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async function (e) {
        const content = e.target.result;
        const contentParse = JSON.parse(content);
        if (contentParse?.cookies) {
          const add = contentParse.cookies.map((cookie) => {
            return chrome.cookies.set(cookie, function (c) {
              console.log("Cookie set:", c);
            });
          });
          await Promise.all(add);
        }
      };
      reader.readAsText(file);
      setStatusLoading("import", false);
      if (isReload) {
        chrome.tabs.reload(currentTabId);
      }
    } catch (error) {
      setStatusLoading("import", false);
      console.log("error", error);
    }
  };

  const handleClearCookies = async () => {
    const isConfirm = window.confirm(
      "Do you want to remove all cookies of this website?"
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
        <Text>Cookies for {webUrl?.hostname ? webUrl.hostname : "--"}</Text>
      </div>
      <div className="content">
        {!isValidWebUrl && (
          <Alert message="Please select a valid website!" type="warning" />
        )}

        <div className="password__title">
          <Text>Password :</Text>
          <Text type="warning">*Leave blank if no password required.</Text>
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
              accept=".json"
              ref={inputCookieFile}
              onChange={handleImportCookies}
            ></input>
          </Space.Compact>
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
          type="primary"
          disabled={!isValidWebUrl || loading.export}
          onClick={handleExportCookies}
        >
          Export
        </Button>
        <Button
          disabled={!isValidWebUrl || loading.import}
          onClick={handleTriggerFile}
        >
          Import
        </Button>
        <Button
          type="primary"
          disabled={!isValidWebUrl || loading.clear}
          danger
          onClick={handleClearCookies}
        >
          Clear cookies for this website
        </Button>
      </div>

      {contextHolder}
    </StyledPopupWrap>
  );
};

export default Popup;
