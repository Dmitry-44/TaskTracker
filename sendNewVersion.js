const req = { "https:": require("https"), "http:": require("http") };
req[new URL(process.argv[2]).protocol]
  .get(
    `${process.argv[2]}/checker/version_pb/${
      JSON.parse(require("fs").readFileSync("package.json", "utf8")).version
    }`,
    (resp) => {
      resp.on("end", () => {
        process.exit();
      });
    }
  )
  .on("error", (err) => {
    console.log("Error: " + err.message);
    process.exit(1);
  });
