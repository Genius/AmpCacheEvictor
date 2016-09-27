var AMP_CDN_HOST = 'cdn.ampproject.org', GOOGLE_HOSTNAME = 'www.google.com';
var AMP_PATH_CONTENTS_BEFORE_CACHE_URL = /.*\/c\/s\//, GOOGLE_AMP_PATH_CONTENTS_BEFORE_CACHE_URL = '/amp/';
var AMP_CACHE_EVICTION_URL = 'https://cdn.ampproject.org/update-ping/c/s/';
var REDIRECT_TO_URL_PREFIX = 'https://cdn.ampproject.org/c/s/';
var SUCCESS_IMAGE_PATH = 'images/checky.png';
var ERROR_IMAGE_PATH = 'images/checky.png';


chrome.tabs.query(
  {
    active: true,
    currentWindow: true
  }, tabs => {
    var tab = tabs[0];
    var currentUrl = new URL(tab.url), urlToCache;

    if (currentUrl.hostname === AMP_CDN_HOST) {
      urlToCache = currentUrl.pathname.replace(AMP_PATH_CONTENTS_BEFORE_CACHE_URL, '');
    } else if (currentUrl.hostname === GOOGLE_HOSTNAME && currentUrl.pathname.startsWith(GOOGLE_AMP_PATH_CONTENTS_BEFORE_CACHE_URL)) {
      urlToCache = currentUrl.pathname.replace(GOOGLE_AMP_PATH_CONTENTS_BEFORE_CACHE_URL, '');
    } else {
      urlToCache = currentUrl.hostname + currentUrl.pathname;
    }

    fetch(AMP_CACHE_EVICTION_URL + urlToCache).then(function(response) {
      if(response.status === 204) {
        document.getElementById('status').src = SUCCESS_IMAGE_PATH;
        chrome.tabs.update(tab.id, {url: REDIRECT_TO_URL_PREFIX + urlToCache});
      } else {
        return Promise.reject(response);
      }
    }).catch(function() {
      document.getElementById('status').src = ERROR_IMAGE_PATH;
    });
  }
);
