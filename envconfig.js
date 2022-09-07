window.envConfig = (() => {
  let envstring = "__STRING__";
  envstring = envstring.split(";");
  const result = {
    AUTH_URL: "http://auth.dev.lan",
    API_URL: "http://eclipse.dev.lan:3002/",
    WS_URL: "http://vlad.dev.lan:9001/",
  };
  for (let i = 0; i < envstring.length; i++) {
    if (envstring[i].indexOf("=") + 1) {
      const splitted = envstring[i].split("=");
      result[splitted[0].split("VUE_")[1]] = splitted[1];
    }
  }
  result.PRODUCTION =
    String(result.PRODUCTION || false).toLowerCase() == "true";
  result.CLIENT_COOKIE = result.PRODUCTION
    ? "https://monitor.ttrace.ru"
    : "http://frontend.dev.lan";
  return result;
})();
