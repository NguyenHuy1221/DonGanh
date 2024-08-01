const express = require('express');
const sanphamRouter = express.Router();
const {createReview,updateReview,DeleteReview,listreview} = require("../controller/sanpham-controller")

sanphamRouter.get('/listReview', async function (req, res) {
    return listreview(req, res);
})

sanphamRouter.post('/createReview', async function (req, res) {
    return createReview(req, res);
})

sanphamRouter.put('/updateReview', async function (req, res) {
    return updateReview(req, res);
})
sanphamRouter.delete('/deleteReview', async function (req, res) {
    return DeleteReview(req, res);
})




module.exports = sanphamRouter;