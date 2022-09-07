import type { Socket } from "socket.io-client";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { version } from "/package.json";
import { ElNotification } from "element-plus";

export default (socket: Socket) => {
  const versionInt = parseInt(version.split(".").join(""));
  console.log("connected to info");
  console.log("current version is", versionInt);
  socket.on(
    "info-pb",
    function ({ type, data }: { type: string; data: string }) {
      console.log("infoChanel", type, data);
      switch (type) {
        case "version": {
          if (versionInt < parseInt(data.split(".").join(""))) {
            ElNotification({
              title:
                "Доступна более новая версия интерфейса! Нажмите для перезагрузки!",
              dangerouslyUseHTMLString: true,
              type: "info",
              customClass: "version-notification",
              duration: 0,
              onClick: () => {
                const refresh = window.location.href;
                window.location.href = refresh;
              },
            });
            setTimeout(() => {
              const notifEl = document.querySelector(
                ".version-notification"
              ) as HTMLElement;
              setTimeout(() => {
                notifEl.classList.add("sec-version-5");
              }, 10000);
              setTimeout(() => {
                function toggleVersion() {
                  notifEl.classList.toggle("sec-version-5");
                  if (notifEl.offsetHeight <= 600) {
                    notifEl.style.height = notifEl.offsetHeight + 1 + "px";
                  }
                  setTimeout(() => {
                    toggleVersion();
                  }, 500);
                }
                toggleVersion();
              }, 30000);
            });
          }
          break;
        }
      }
    }
  );
};

//в честной борьбе в топ 15 вообще ни попасть. я хз сколько мне войнов надо будет убить, чтобы удержаться в топе, аж плакать хочется от такого )
