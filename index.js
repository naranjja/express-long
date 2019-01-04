const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const { PythonShell } = require('python-shell')

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
    
    let pyshell = null

    socket.on("stop all previous", () => {
        if (pyshell) {
            pyshell.terminate()
        }
    })
    socket.on("process this", (data) => {
                
        let results = []
        pyshell = new PythonShell('./main.py', { args: data })
        pyshell.on('message', (message) => {
            console.log(message)
            if (results.length === 0) {
                io.emit("ok got it", message)
            } else {
                results.push(message)
            }
        })
        pyshell.end((err) => {
            if (err) console.error(err)
            io.emit("process done", { results })
        })

    })
})

http.listen(3000, () => {
    console.log("Listening on port 3000")
})