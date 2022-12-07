const router = require('express').Router();
const fs = require('fs');
const getHtml = require('../public/crawling/instagram');

const dir  = process.cwd() + '/G-Star/public/img/main/sider-exhibitor';

router.get("/", async (req, res, next) => {
    getHtml();
    const img = fs.readdirSync(dir);
    res.render("main", {img});
});

module.exports = router;
