const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

module.exports = async function getHtml () {
  try {

    await axios.get("https://www.instagram.com/p/ClplGhcAtn4/")
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.group_nav ul").children("li.nav_item");

        $bodyList.each(function(i, elem) {
              ulList[i] = {
                  title: $(this).find('a.nav').text(),
                  url: $(this).find('a.nav').attr('href'),
                  // image_url: $(this).find('figure.img-con a img').attr('src'),
                  // image_alt: $(this).find('figure.img-con a img').attr('alt'),
                  // summary: $(this).find('p.lead').text().slice(0, -11),
                  // date: $(this).find('span.txt-time').text()
              };
            });
        const data = ulList.filter(n => n.title);
        console.log(data);
        return;
    })
    // await axios.get("https://www.yna.co.kr/sports/all")
    // .then(html => {
    //   let ulList = [];
    //   const $ = cheerio.load(html.data);
    //   const $bodyList = $("div.list-type038 list").children("li");
  
    //   $bodyList.each(function(i, elem) {
    //     ulList[i] = {
    //         title: $(this).find('strong.tit-news').text(),
    //         url: $(this).find('div.news-con a').attr('href'),
    //         image_url: $(this).find('figure.img-con a img').attr('src'),
    //         image_alt: $(this).find('figure.img-con a img').attr('alt'),
    //         summary: $(this).find('p.lead').text().slice(0, -11),
    //         date: $(this).find('span.txt-time').text()
    //     };
    //   });
  
    //   const data = ulList.filter(n => n.title);
    //   console.log(data);
    //   return data;
    // })
    // .then(res => log(res));
  } catch (err) {
    console.error(err);
  }
}

// }

// const getHtml = async () => {
//   try {
//     return 
//   } catch (error) {
//     console.error(error);
//   }
// };

// getHtml()
//   .then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.headline-list ul").children("li.section02");

//     $bodyList.each(function(i, elem) {
//       ulList[i] = {
//           title: $(this).find('strong.news-tl a').text(),
//           url: $(this).find('strong.news-tl a').attr('href'),
//           image_url: $(this).find('p.poto a img').attr('src'),
//           image_alt: $(this).find('p.poto a img').attr('alt'),
//           summary: $(this).find('p.lead').text().slice(0, -11),
//           date: $(this).find('span.p-time').text()
//       };
//     });

//     const data = ulList.filter(n => n.title);
//     return data;
//   })
//   .then(res => log(res));

