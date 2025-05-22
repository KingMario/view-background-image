// ==UserScript==
// @name         Prevent Bing IOTD URL Modification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent MediaContents ImageContent.Image.Url from being modified
// @author       Your name
// @match        https://*.bing.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Directly modify the fetchIOTD function
  const originalFetchIOTD = window.fetchIOTD;
  if (originalFetchIOTD) {
    window.fetchIOTD = async function (n) {
      // Directly return the original object without any modification
      return {
        ssd: n.Ssd,
        imageContent: n.ImageContent,
        imageBlob: null, // Do not return blob
        fullDateString: n.FullDateString,
      };
    };
  }

  // Modify the displayIOTD function
  const originalDisplayIOTD = window.displayIOTD;
  if (originalDisplayIOTD) {
    window.displayIOTD = function (n, t, i) {
      // Use the original URL to display the image
      const originalUrl = n.imageContent.Image.Url;
      if (originalUrl) {
        const imgCont = document.getElementById("img_cont");
        const hpTopCover = document.getElementById("hp_top_cover");
        const headline = document.getElementById("headline");

        // Decide whether to use picture/img or background-image based on _model.IOTDImg
        if (_model?.IOTDImg) {
          [imgCont, hpTopCover].forEach((el) => {
            const picture = el.querySelector("picture");
            const img = picture?.querySelector("img");
            if (img) {
              img.src = originalUrl;
            }
          });
        } else {
          [imgCont, hpTopCover].forEach((el) => {
            el.style.backgroundImage = `url(${originalUrl})`;
          });
        }

        // Update the headline
        if (headline) {
          headline.innerHTML = n.imageContent.Headline;
        }

        // Update the cache
        _model.CachedIOTD = {
          ImageContent: n.imageContent,
          Ssd: n.ssd,
          FullDateString: n.fullDateString,
        };
        _model.MediaContents[0] = _model.CachedIOTD;
      }
    };
  }

  console.log("Bing IOTD URL protection script loaded");
})();
