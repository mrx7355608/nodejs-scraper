const fs = require("fs/promises");
const pup = require("puppeteer");
// const downloadImage = require("./downloadImage");

// function getData(html) {

// }
async function scrape() {
    try {
        const browser = await pup.launch();
        const page = await browser.newPage();
        await page.goto(
            "https://www.amazon.com/s?k=nvidia+graphic+cards&i=electronics&rh=n%3A172282&dc&ds=v1%3Ai%2B0Pn2%2FJK8doa3g6aa%2BEfk%2Fc0BAPBxwjUvRpJC0%2BpdA&crid=H4AIUKOGUJKP&qid=1663877780&sprefix=nvidiagraphic+cards%2Caps%2C282&ref=sr_ex_p_89_0"
        );

        const data = await page.$$eval("div.s-card-container", (arr) => {
            arr = arr.slice(0, 27);
            return arr.map((prod) => ({
                title: document.querySelector(
                    "a.a-link-normal > span.a-size-medium"
                ).innerText,
                ratings:
                    document
                        .querySelector("div.a-row.a-size-small")
                        .innerText.split("\n")[0] || "No info avaiable",
                desc: "",
                totalReviews:
                    document
                        .querySelector("div.a-row.a-size-small")
                        .innerText.split("\n")[1] || "No reviews found",
                price:
                    document
                        .querySelector("span[data-a-size='xl']")
                        .innerText.split("\n")[0] || "No price found",
                shippingToPakistan:
                    document.querySelector(
                        "div.a-row.a-size-base.a-color-secondary.s-align-children-center > span"
                    ).innerText || "No info available",
                stock:
                    document.querySelector("span.a-size-base.a-color-price")
                        .innerText || "No info available",
                features: [],
                tag: "amazon",
                link: prod.querySelector("h2 > a").href || "",
                image: prod.querySelector("img.s-image").src || "",
            }));
        });
        await fs.writeFile("./data.json", JSON.stringify(data, null, 4));
        await browser.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

scrape();
