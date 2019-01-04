const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const { PythonShell } = require("python-shell")

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

        pyshell = new PythonShell("./main.py", {
            pythonPath: "C:/ProgramData/Anaconda3/python.exe",
            pythonOptions: ["-u"], 
            args: data 
        })

        pyshell.on("message", (message) => {
            if (results.length === 0) {
                io.emit("ok got it", message)
            }
            results.push(message)
        })

        pyshell.end((err) => {
            if (err) console.error(err)
            io.emit("process done", { results: results.splice(0,1) })
        })

    })
})

http.listen(3000, () => {
    console.log("Listening on port 3000")
})