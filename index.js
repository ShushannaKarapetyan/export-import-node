require('dotenv').config();
const http = require("http");
const PORT = process.env.PORT;

http.createServer(function (req, res) {
    console.log("Server running.");
}).listen(PORT, function () {
    console.log(`Server start at port ${PORT}`);
});