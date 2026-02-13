import http from "http";

http
  .createServer((req, res) => {
    const { method, url } = req;
    console.log(method, url);
    res.end("OK");
  })
  .listen(8888, () => {
    console.log("server is running at http://127.0.0.1:8888");
  });
