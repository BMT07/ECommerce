const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('Authorization')
    if (!token) {
        res.status(401).json({ msg: "no token authorization denied" })
    }
    try {
        const decoded = jwt.verify(token, "mysecrettoken")
        req.utilisateur = decoded.utilisateur
        next()
    } catch (error) {
        res.status(401).json({ msg: "token is not valid" })
    }
}