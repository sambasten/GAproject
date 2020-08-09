import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import ObjectsToCsv from 'objects-to-csv';
import reviewsCrawler from 'amazon-reviews-crawler';

const app = express();
const port: number = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
  res.sendFile('./public/index.html' , { root : __dirname});
});

app.post('/submit' , (req, res) => {
  const url: string = req.body.url;
  //check non string values
  if (typeof(url) != 'string') {
      res.status(400).send('Please enter a valid youtube or amazon URL');
  }
  // check if url is youtube
  if (url.search('youtube') != -1) {
    if(url.search('v=') != -1) {
      let indexA = url.indexOf('v=');
      let indexB = url.indexOf('=', indexA);
      // slice url string to identify video id
      let videoId: string = url.substring(indexB + 1);
      const api_key: string = "AIzaSyAkroRDVlwL670EUn9UrCB2MvabGSJTwp0"
      // send videoid to youtube api request
      let youtubeApiUrl: string = "https://www.googleapis.com/youtube/v3/commentThreads/?part=snippet&key="+api_key+"&videoId="+videoId;

      // return the result of axios api call
      try{
        let result = axios.get(youtubeApiUrl).then((response) => {
          const items = response.data.items;
          let resultArray: any[] = [];
          items.forEach((item: any) => {
            if(!item || !item.snippet || !item.snippet.topLevelComment || !item.snippet.topLevelComment.snippet)
                return;
            const {authorDisplayName: username, publishedAt: date, viewerRating: starRating, textOriginal: comment} = item.snippet.topLevelComment.snippet;
            resultArray = [...resultArray, {username, date, starRating, comment, link: url}];
            // print to csv file and download
            printCsv(resultArray, videoId).then(downloaded => {
              if(downloaded.length > 0){
                res.status(200).download(downloaded);
              }
            }).catch(e => {
              console.error('printCsv error: ', e);
              res.status(404).send('Could not download file, please try again');
            });
          });
        }).catch(e => {
            console.error('axios error: ', e);
            res.status(404).send('Problem getting comments, please try again');
        });
      }catch(ex){
        console.error(ex);
      }
    }
    else{
        res.status(400).send('Invalid youtube URL, please try again');
    }
  }
  // elseif
  // check if url is amazon
  else if(url.search('amazon') != -1){
    // regex match url string to identify product ASIC id
    let asic: RegExpMatchArray | null = url.match("/([a-zA-Z0-9]{10})(?:[/?]|$)");
    if (asic) {
      let productId = asic[1];
      // send product id to amazon crawler
      try{
        let result = reviewsCrawler(productId).then((crawlerRes: any) => {
          const reviews = crawlerRes.reviews;
          let resultArray: any[] = [];
          reviews.forEach((review: any) => {
            if(!review) return;
            const {author: username, date: date, rating: starRating, text: productReview,link: link} = review;
            resultArray = [...resultArray, {username, date, starRating, productReview, link}];
            //print to csv file and download
            printCsv(resultArray, productId).then(downloaded => {
              if(downloaded.length > 0) {
                res.status(200).download(downloaded);
              }
            }).catch(() => {
              res.status(404).send('Could not download file, please try again');
            });
        }).catch(() => {
            res.status (404).send('Problem getting reviews, please try again');
        })
      });
      }catch(ex){
        console.error(ex);
      }
    }
    else { return res.status(400).send('Invalid Amazon URL, please try again')}
  }
  // else
  // invalid url error
  else {
    res.status(400).send('Invalid URL, please try again');
  }
});

async function printCsv(resultArray: any[], id: string) {
  const csv = new ObjectsToCsv(resultArray);
  const csvfile  = await csv.toDisk('./result' + id + '.csv');
  if (csvfile) {
    return './result' + id + '.csv';
  };
  return '';
};

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on port ${port}`);
});

export default app;