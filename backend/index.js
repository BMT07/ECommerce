const express = require("express")
const connect = require('./db')
const cors = require('cors')
const app = express()


app.use(cors())


connect()


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`app running on port:${port}`))