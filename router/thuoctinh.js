const express = require('express');
const thuoctinhRouter = express.Router();
const {createReview,updateReview,DeleteReview,listreview} = require("../controller/thuoctinh-controller")

thuoctinhRouter.get('/listReview', async function (req, res) {
    return listreview(req, res);
})

thuoctinhRouter.post('/createReview', async function (req, res) {
    return createReview(req, res);
})

thuoctinhRouter.put('/updateReview', async function (req, res) {
    return updateReview(req, res);
})
thuoctinhRouter.delete('/deleteReview', async function (req, res) {
    return DeleteReview(req, res);
})




module.exports = thuoctinhRouter;