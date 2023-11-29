import styled from "styled-components";

export const StyledPopupWrap = styled.div`
  min-width: 500px;
  margin: auto;

  .header {
    background-color: #7dbcea;
    padding: 16px;
    border-radius: 4px 4px 0 0;

    span {
      color: #fff;
    }
  }

  .content {
    border: 1px solid #d9d9d9;
    padding: 16px;

    .ant-alert {
      margin-bottom: 16px;
    }

    .password__title {
      margin-top: 0;
      margin-bottom: 8px;
      span {
        width: 100%;
        display: block;
      }
    }
    .password__input {
      width: 100%;
      margin-bottom: 8px;

      input[type="file"] {
        display: none;
      }
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
