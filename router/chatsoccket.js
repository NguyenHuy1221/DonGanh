const express = require('express');
const chatsocketRouter = express.Router();
const {
    Createconversation,
} = require("../controller/chatsocket-controller")
chatsocketRouter.post('/Createconversation', async function (req, res) {
    return Createconversation(req, res);
    })


module.exports = chatsocketRouter;