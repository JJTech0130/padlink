const axios = require("axios"); // API Requests
const cheerio = require("cheerio"); // HTML Parsing

const esprima = require("esprima"); // JS Parsing
const traverse = require("ast-traverse"); // AST Parsing 

const config = require("./config.json"); // Config File

let url = "https://padlet.com/mrepublic/general";

const info = async url => {
  let token = null;
  let wallid = null;
  try {
    // Load HTML
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Retrive desired JS
    let results = $('script');
    let result = results.get(11).children[0]['data'];

    // Parse JS
    let parsed = esprima.parse(result);
    traverse(parsed, {pre: function(node) {
      try {
        if (node.key.value == 'oauthToken') {
          //console.log("OAuth Token:")
          //console.log(node.value.value);
          token = node.value.value;
        }
        if (node.key.value == 'wall') {
          wallid = node.value.properties[0].value.value;
        }
      } catch {}
      
    }});
    
  } catch (error) {
    console.log(error);
  }
  //let t = await token;
  return {'token': token, 'wallid': wallid};
};

(async () => {
  let stuff = await info(url);
  const otoken = stuff['token'];
  const wallid = stuff['wallid'];
  console.log(stuff);
})();
