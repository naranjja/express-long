const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
    console.log("a user connected")
    socket.on("process this", (data) => {

        // TODO: estimate

        io.emit("ok got it", {
            estimation: 10
        })

        // TODO: process data for 10 seconds
        setTimeout(() => {
            io.emit("process done", {
                these: "are",
                the: "results"
            })
        }, 10000)

    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

http.listen(3000, () => {
    console.log("listening on *:3000")
})