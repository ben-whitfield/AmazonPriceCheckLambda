// simple web scraper
import { extractPrice, extractTitle, createMessageBody, sendMessage, getWishList, getProductPromises } from "./utilities";

const emailParams: {emailRecipient:string, emailService:string, userName:string, password:string} = {
  emailRecipient: process.env.emailRecipient,
  emailService: process.env.emailService,
  userName: process.env.username,
  password: process.env.password
};

let currentDateTime:any = new Date();

const wishList: { productUrl:string, desiredPrice:number, response?:any}[] = [];

export const handler = () => {
getWishList().then((response) => {
  const promises:any[] = getProductPromises(response.data);
    Promise.all(promises)
    .then((response:any) => {
      let detailsList:any[] = [];
      response.forEach(item => {
        let details: {title:string, price:number, desiredPrice:number};
        let retrievedPrice: number = extractPrice(item.response.data);
        let retrievedTitle: string = extractTitle(item.response.data);
        details = {
          "title" : retrievedTitle,
          "price" : retrievedPrice,
          "desiredPrice": item.desiredPrice
        };
        detailsList.push(details);
      });
      return detailsList;
    })

    .then((detailsList:any) => {
      sendMessage(createMessageBody(detailsList), emailParams, currentDateTime);
    })

    .catch((error) => {
      sendMessage(`There was an error: ${error}`, emailParams, currentDateTime);
    });
  });
};