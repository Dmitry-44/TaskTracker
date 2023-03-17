import { ElMessage } from "element-plus";
import router from "@/router";
export const errVueHandler = (res: number | boolean | string, errText = "") => {
  if (res === true) {
    return true;
  }
  if (res === -1) {
    router.push("/");
  } else if (res === 403) {
    ElMessage({
      message: "Недостаточно прав для действия",
      type: "error",
      center: true,
      duration: 0,
      showClose: true,
    });
  } else {
    ElMessage({
      message: errText
        ? errText
        : (res === "" || res === false ? "Неизвестная ошибка" : res).toString(),
      type: "error",
      center: true,
      duration: 0,
      showClose: true,
    });
  }
  return false;
};

export const errRequestHandler = (err: any) => {
  if (process.env['NODE_ENV'] !== "production") {
    console.error(err);
  }
  if (Object.prototype.hasOwnProperty.call(err, "response") && err.response) {
    if ([400, 404].includes(err.response?.status)) {
      let text =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errors ||
        (err.response?.status === 404
          ? "404 не найдено"
          : "Неизвестная ошибка");
      if (Array.isArray(text)) {
        text = text?.map((el) => el.message).join("\n");
      }
      if (err?.response?.data?.statusCode) {
        if (Array.isArray(err.response?.data?.message)) {
          text = err.response?.data?.message.join("\n");
        } else {
          text = err.response?.data?.message;
        }
      }
      return text;
    } else if (err.response?.status === 401) {
      return -1;
    } else if (err.response?.status === 403) {
      return 403;
    }
  } else {
    return err.message;
  }
  return false;
};
