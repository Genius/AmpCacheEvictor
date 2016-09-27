chrome.tabs.query(
  {
    active: true,
    currentWindow: true
  }, function (tabs) {
      var tab = tabs[0];
    var currentUrl = new URL(tab.url), url_to_cache;

    if (currentUrl.hostname === "cdn.ampproject.org") {
      url_to_cache = currentUrl.pathname.replace(/.*\/c\/s\//, '');
    } else if (currentUrl.hostname === "www.google.com" && currentUrl.pathname.startsWith("/amp/")) {
      url_to_cache = currentUrl.pathname.replace(/\/amp\//, '');
    } else {
      url_to_cache = currentUrl.hostname + currentUrl.pathname;
    }

    fetch("https://cdn.ampproject.org/update-ping/c/s/" + url_to_cache).then(function(response) {
      if(response.status == 204) {
        document.getElementById("status").src = "images/checky.png";
        chrome.tabs.update(tab.id, {url: "https://www.google.com/amp/"+url_to_cache});
      } else {
        throw response;
      }
    }).catch(function() {
      document.getElementById("status").src = "images/error.png";
    });
  }
);
