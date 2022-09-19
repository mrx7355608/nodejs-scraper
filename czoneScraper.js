const rp = require('request-promise');
const cheerio = require('cheerio');
const fsPromises = require("fs/promises")

const urls = [
  "https://www.czone.com.pk/graphic-cards-pakistan-ppt.154.aspx",
  "https://www.czone.com.pk/graphic-cards-pakistan-ppt.154.aspx?page=2",
  "https://www.czone.com.pk/graphic-cards-pakistan-ppt.154.aspx?page=3"
]


const parseHtml = html => {
  const $ = cheerio.load(html);

  const image = $(".image > a > img").attr("src");
  const title = $("h4").text();
  const desc = $("div.description").text().trim();
  const stock = $("div.product-stock > span.product-data").text();
  const price = $("div.price").text().trim();
  const ratings = $("div.rating > span.product-rating").text() || 0;
  const totalReviews = $("span.first").text() || 0;
  const link = $("h4 > a").attr("href")
  const featuresList = $("ul.description.highlights.text-left").children().toArray();
  const features = featuresList.map((elem) => $(elem).text())

  return {
    image,
    title,
    desc,
    price,
    stock,
    ratings,
    totalReviews,
    tag: "czone",
    link,
    features,
  }
}

const scrapeData = async (url) => {
  const html = await rp(url)
  const $ = cheerio.load(html)
  const itemsList = $('div.product').toArray();
  const data = itemsList.map(item => parseHtml(item));
  await writeJsonFile(JSON.stringify(data, null, 4))
}

async function writeJsonFile(content) {
  await fsPromises.appendFile("./czone-graphic-cards.json", content);
  console.log("Data has been saved!")
}

urls.forEach(url => scrapeData(url))
