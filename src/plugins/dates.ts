export interface objectWithArrays {
  [key: string]: Array<string>;
}
export const formatDateJS = (t: number, m: string, lang = "ru") => {
  if (!m) m = "YYYY-MM-DD hh:mm:ss";
  const d: Date = new Date(t * 1000);
  const mmmm: objectWithArrays = {
    ru: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
    en: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };
  const w: objectWithArrays = {
    ru: [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ],
    en: [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ],
  };
  const ww: objectWithArrays = {
    ru: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };
  m = m.replace("YYYY", d.getUTCFullYear().toString());
  m = m.replace(
    "YY",
    (d.getUTCFullYear() % 100 > 9 ? "" : "0") + (d.getUTCFullYear() % 100)
  );
  m = m.replace("MMMM", mmmm[lang][d.getUTCMonth()]);
  m = m.replace(
    "MM",
    (d.getUTCMonth() + 1 > 9 ? "" : "0") + (d.getUTCMonth() + 1)
  );
  m = m.replace("DD", (d.getUTCDate() > 9 ? "" : "0") + d.getUTCDate());
  m = m.replace("hh", (d.getUTCHours() > 9 ? "" : "0") + d.getUTCHours());
  m = m.replace("mm", (d.getUTCMinutes() > 9 ? "" : "0") + d.getUTCMinutes());
  m = m.replace("ss", (d.getUTCSeconds() > 9 ? "" : "0") + d.getUTCSeconds());
  m = m.replace("W", ww[lang][d.getUTCDay()]);
  m = m.replace("w", w[lang][d.getUTCDay()]);
  return m;
};
export const getUnixTime = (date: string, form: string) => {
  let format: number | string = form ? form : "YYYY-MM-DD hh:mm:ss";
  let Y: number | string = date.substring(
    format.indexOf("Y"),
    format.lastIndexOf("Y") + 1
  );
  let M: number | string = date.substring(
    format.indexOf("M"),
    format.lastIndexOf("M") + 1
  );
  let D: number | string = date.substring(
    format.indexOf("D"),
    format.lastIndexOf("D") + 1
  );
  let h: number | string = date.substring(
    format.indexOf("h"),
    format.lastIndexOf("h") + 1
  );
  let m: number | string = date.substring(
    format.indexOf("m"),
    format.lastIndexOf("m") + 1
  );
  let s: number | string = date.substring(
    format.indexOf("s"),
    format.lastIndexOf("s") + 1
  );
  if (Y.length < 4) {
    Y = "200".substring(0, 4 - Y.length) + "" + Y;
  }
  if (
    Y.match(/^\d+$/) &&
    M.match(/^\d+$/) &&
    D.match(/^\d+$/) &&
    h.match(/^\d+$/) &&
    m.match(/^\d+$/) &&
    s.match(/^\d+$/)
  ) {
    Y = parseInt(Y);
    M = parseInt(M);
    D = parseInt(D);
    h = parseInt(h);
    m = parseInt(m);
    s = parseInt(s);
    if (
      s >= 0 &&
      s < 60 &&
      m >= 0 &&
      m < 60 &&
      h >= 0 &&
      h < 24 &&
      D > 0 &&
      D <= 31 &&
      M > 0 &&
      M <= 12
    ) {
      if (Y > 2100) Y = 2100;
      const feb = IsLeapYear(Y) ? 29 : 28;
      if (
        (M == 2 && D > feb) ||
        (D > 30 && (M == 4 || M == 6 || M == 9 || M == 11))
      )
        return false;
      format = Date.UTC(Y, M - 1, D, h, m, s) / 1000;
      return format;
    }
    return false;
  }
  return false;
};

function IsLeapYear(year: number): boolean {
  if (year % 4 == 0) {
    if (year % 100 == 0) {
      if (year % 400 == 0) {
        return true;
      } else return false;
    } else return true;
  }
  return false;
}

export const getDiffWeeks = (dt2: number, dt1: number): number => {
  let diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60 * 24 * 7;
  return Math.abs(Math.round(diff));
};
