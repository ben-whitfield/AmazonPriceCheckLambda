import { extractPrice, extractTitle, createMessageBody, sendMessage, getWishList, getProductPromises } from "../lib/utilities";
import axios from "axios";

let data:string;

describe("testing the utilities function suite", () => {
    const fakeHtml:string = "<html><head></head><body><h1>Some heading</h1><div class=\"test\"><span class=\"price\">£14.99</span></div></body</html>";
    const fakeProductList:any[] = [
        {"title": "foo", "price": 10, "desiredPrice": 12},
        {"title": "bar", "price": 10, "desiredPrice": 8},
        {"title": "foobar", "price": 10, "desiredPrice": 10},
        {"title": "NoProduct", "price": 0, "desiredPrice": 10}
    ];
    const stubProduct:string = "https://www.amazon.co.uk/Withings-Body-Composition-Digital-smartphone/dp/B071XW4C5Q/ref=sr_1_1?hvadid=80676698206609&hvbmt=be&hvdev=c&hvqmt=e&keywords=withings+body+scale&qid=1566113515&s=gateway&sr=8-1";
    const instance = axios.create({
        headers: {
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        }
    });

    beforeAll(() => instance.get(stubProduct)
        .then((response) => {
            data = response.data;
        })
    );

    test("using the price regex finds a price", () => {
        const price:number = extractPrice(data);
        expect(price).not.toBe(0);
        expect(price).toBeGreaterThan(50);
        expect(price).toBeLessThan(100);
        expect(price).not.toBeNaN;
    });

    test("using the price regex should return 0 when there is no price found", () => {
        const price:number = extractPrice(fakeHtml);
        expect(price).toBe(0);
        expect(price).not.toBeNaN;
    });

    test("using the title regex should return a valid title", () => {
        const title:string = extractTitle(data);
        expect(title).toBe("Withings Body+ - Smart Body Composition Wi-Fi Digital Scale with smartphone app");
        expect.stringContaining("Withings Body+ - Smart Body Composition Wi-Fi Digital Scale with smartphone app");
    });

    test("using the title regex should return default title when none is found", () => {
        const title:string = extractTitle(fakeHtml);
        expect(title).toBe("No product found");
        expect.stringContaining("No product found");
    });

    test("that the list of product is retreived", () => {
        const productsList = getWishList();
        expect(productsList).resolves.toBeTruthy();
    });

    test("that the message body is created", () => {
        const messageBody:string = createMessageBody(fakeProductList);
        expect(messageBody).toMatch(/Current Pricing Details on the wishlist/);
        expect(messageBody).toMatch(/Current price: <span style="color:#090">£10/);
        expect(messageBody).toMatch(/Target price: £10/);
    });

    test("that products which are lower than target price display as green", () => {
        const lowerProductList:{}[] = fakeProductList.splice(0,1);
        const messageBody:string = createMessageBody(lowerProductList);
        expect(messageBody).toMatch(/Current price: <span style="color:#090">/);
    });

    test("that products which are higher than target price display as red", () => {
        const higherProductList:{}[] = fakeProductList.filter(product => {
            return product.price > product.desiredPrice;
        });
        const messageBody:string = createMessageBody(higherProductList);
        expect(messageBody).toMatch(/Current price: <span style="color:#900">/);
    });

    test("that products which are equal to the target price display as green", () => {
        const equalProductList:{}[] = fakeProductList.filter(product => {
            return product.price === product.desiredPrice;
        });
        const messageBody:string = createMessageBody(equalProductList);
        expect(messageBody).toMatch(/Current price: <span style="color:#090">/);
    });

    // tODO: Write a test for null price handling
});