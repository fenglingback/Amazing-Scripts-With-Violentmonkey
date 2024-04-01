// ==UserScript==
// @name        镜像网站自动替换
// @match       *://raw.githubusercontent.com/*
// @run-at      document-start
// @grant       none
// ==/UserScript==

var newDomain   = "raw.gitmirror.com";
var newURL      = location.protocol + "//"
                + newDomain
                + location.pathname
                + location.search
                + location.hash;

location.replace(newURL);
