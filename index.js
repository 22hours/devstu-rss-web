var express = require("express");
var app = express();
const DOMAIN = "https://devstu.fdsafdsa.shop/";
const FIND_RSS_QUESTIONS = "main/question/find/rss";
const FIND_ALL_DEVL_LOGS = "main/devlog/find/all";
const GET = async (method, url, data) => {
    const axios = require("axios").default;
    var authorization = "guest";
    return axios({
        method,
        url: DOMAIN + url,
        data,
        headers: { Authorization: authorization },
    })
        .then((result) => result.data)
        .catch((result) => {
            console.log(result);
            return null;
        });
};
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const doAsync = (fn) => async (req, res, next) => await fn(req, res, next).catch(next);

async function err() {
    throw new Error("에러 발생");
}

//라우팅 핸들러
app.get(
    "/rss",
    doAsync(async (req, res) => {
        var item = null;
        var data = await GET("get", FIND_RSS_QUESTIONS);
        var data2 = await GET("post", FIND_ALL_DEVL_LOGS, {
            param: "date",
            pageNum: "1",
            requiredCount: "10",
        });
        if (data && data2) {
            item = data.map((it) => {
                return {
                    title: it.title,
                    id: `https://devstu.co.kr/howto/question/${it._id}`,
                    url: `https://devstu.co.kr/howto/question/${it._id}`,
                    date_published: it.date,
                };
            });
            item2 = data2.map((it) => {
                return {
                    title: it.title,
                    id: `https://devstu.co.kr/devlog/logs/${it._id}`,
                    url: `https://devstu.co.kr/devlog/logs/${it._id}`,
                    date_published: it.date,
                };
            });
            const jsonfeedToRSS = require("jsonfeed-to-rss");
            total = item2.concat(item);
            var lastBuildDate = new Date();
            var testJSON = {
                version: "https://jsonfeed.org/version/1",
                title: "DEVSTU",
                home_page_url: "https://devstu.co.kr",
                feed_url: "https://jsonfeed-to-rss.netlify.com/snapshots/readme-feed.json",
                description: "검색해도 도저히 모르겠다면, DESVTU",
                next_url: "https://jsonfeed-to-rss.netlify.com/snapshots/2017.json",
                icon: "https://jsonfeed-to-rss.netlify.com/icon-512x512.png",
                items: total,
            };
            const rssFeed = jsonfeedToRSS(testJSON);

            res.set("Content-Type", "text/xml");
            res.send(rssFeed);
        } else {
            res.render("hello", { name: req.query.nameQuery });
        }
    })
);

var port = 3000;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
});
