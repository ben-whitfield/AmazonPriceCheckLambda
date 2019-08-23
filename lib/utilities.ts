import axios, { ResponseType, AxiosResponse } from "axios";
const nodemailer = require("nodemailer");

export function extractPrice(data:string) {
let pricePattern:any = new RegExp(/<span id="priceblock_ourprice" class="a-size-medium a-color-price priceBlockBuyingPriceString">((.|\n)*?)<\/span>/);
let retrievedPrice: string[] = pricePattern.exec(data);
if (retrievedPrice) {
    let productPrice:string = retrievedPrice[1].trim();
    let finalPrice:number = parseFloat(productPrice.substr(1));
    return finalPrice;
}
return 0;
}

export function extractTitle(data:string) {
let titlePattern:any = new RegExp(/<span id="productTitle" class="a-size-large">((.|\n)*?)<\/span>/);
let retrievedTitle: string[] = titlePattern.exec(data);
if(retrievedTitle) {
    let productTitle:string = retrievedTitle[1].trim();
    return productTitle;
}
return "No product found";
}

export function createMessageBody(productList:any[]) {
let finalMessage:string = "<b>Current Pricing Details on the wishlist</b>";
productList.forEach(product => {
    finalMessage += `
    <br><br><br>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td height="1" style="border-top:1px solid #555; font-size:1px; height:1px; line-height:1px">&nbsp;</td>
</tr>
</table>
    <br>
    ${product.title}
    <br>`.trim();

    if (product.price <= product.desiredPrice ) {
        finalMessage += `Current price: <span style="color:#090">£${product.price}</span>`;
    } else {
        finalMessage += `Current price: <span style="color:#900">£${product.price}</span>`;
    }
    finalMessage += `
    <br>
    Target price: £${product.desiredPrice}
    `.trim();
});
return finalMessage;
}

export function sendMessage(finalMessage:string, emailParams:{emailRecipient:string, emailService:string, userName:string, password:string}, currentDateTime:Date) {
var transport:any = nodemailer.createTransport({
    service: emailParams.emailService,
    auth: {
    user: emailParams.userName,
    pass: emailParams.password
    }
});


var mailOptions:{} = {
    from: emailParams.userName,
    to: `${emailParams.emailRecipient}`,
    subject: `Amazon Price Checks - ${currentDateTime}`,
    text: `${finalMessage}`,
    html: `${finalMessage}`
};


transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
});
}

export function getWishList() {
return axios.get("products.json");
}

export function getProductPromises(data) {
const instance = axios.create({
    headers: {
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
    }
});
    return data.map((element)=>
    instance.get(element.productUrl)
    .then((response) => {
        element.response = response;
        return element;
    })
    );
}