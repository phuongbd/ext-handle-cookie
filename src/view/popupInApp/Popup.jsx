const PopupInApp = () => {
  return (
    <>
      <style>
        {`
          p{
            color: red;
          }
          div#ext-cookie-sharing-popup-root {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 999999;
          }
        `}
      </style>
      <p
        onClick={() => {
          console.log("222222");
        }}
      >
        2222
      </p>
    </>
  );
};

export default PopupInApp;
