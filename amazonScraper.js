// HOW TO USE THIS SCRIPT:
// 1) First search for the products you want to scrape
// 2) Run this script in the chrome devtool's ``console``

const products = Array.from(document.querySelectorAll("div.s-card-container"))

const data = []

function scrape(product) {
  const content = product.innerText.split("\n");

  const regex = /sponsored/i;
  if (regex.test(content[0])) content.shift()

  const title = content[0];
  const ratings = content[1];
  const totalReviews = content[2];
  const price = content[3];
  const desc = "";
  const shippingToPakistan = content[9]
  const stock = content[10] || "";
  const features = []
  const tag = "amazon"
  let image = product.querySelector("img.s-image");
  let link = product.querySelector("h2 > a");

  if (image) {
    image = image.getAttribute("src");
  } else {
    image = ""
  }

  if (link) {
    link = link.getAttribute("href");
  } else {
    link = ""
  }
  data.push({
    title, desc, ratings, totalReviews, price, shippingToPakistan,
    stock, image, link, features, tag
  })
}

products.forEach(product => scrape(product));