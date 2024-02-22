import styled from "styled-components";

export const StyledPopupWrap = styled.div`
  min-width: 450px;
  margin: auto;

  .header {
    border: 1px solid #d9d9d9;
    border-bottom: none;
    padding: 12px;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h5 {
      margin: 0;
    }
  }

  .content {
    border: 1px solid #d9d9d9;
    padding: 16px;

    .ant-alert {
      margin-bottom: 8px;
    }

    .password__title {
      margin-top: 0;
      margin-bottom: 2px;
      label {
        color: #ff4d4f;
      }
    }
    .password__input {
      width: 100%;
      margin-bottom: 2px;

      input[type="file"] {
        display: none;
      }
    }

    .ant-typography-danger {
      display: block;
    }

    .ant-checkbox-wrapper {
      margin-top: 4px;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    border-radius: 0 0 4px 4px;
    border: 1px solid #d9d9d9;
    border-top: none;

    button {
      margin-left: 8px;
    }
  }
`;
