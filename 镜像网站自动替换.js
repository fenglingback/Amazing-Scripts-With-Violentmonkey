// ==UserScript==
// @name        Better alternatives to websites
// @description:zh-CN   网站的更好替代
// @match       *://raw.githubusercontent.com/*
// @match       *://www.quora.com/*
// @match       *://www.reddit.com/*
// @exclude-match *://www.quora.com/
// @run-at      document-start
// @grant       none
// ==/UserScript==


var newURL = "";
const best_gh_raw = "https://g.3344550.xyz/";
const best_quora = "https://quetre.iket.me";
const best_reddit = "https://l.opnxng.com";

switch (location.host) {
    case "raw.githubusercontent.com":
        newURL = best_gh_raw + location.protocol + "//" + location.host + location.pathname + location.search + location.hash;
        break;
    case "www.quora.com":
        newURL = best_quora + location.pathname + location.search + location.hash;
        break;
    case "www.reddit.com":
        newURL = best_reddit + location.pathname + location.search + location.hash;
        break;
    default:
        break;
}

console.log("Redirecting to " + newURL);
location.replace(newURL);
