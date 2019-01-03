const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const { PythonShell } = require('python-shell')

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

        const pyshell = new PythonShell('./main.py')

        let results = []        
        pyshell.on('message', (message) => {
            results.push(message)
        })

        pyshell.end((err, code, signal) => {
            if (err) throw err
            io.emit("process done", {
                results
            })
          })

    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

http.listen(3000, () => {
    console.log("Listening on port 3000")
})