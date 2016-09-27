chrome.tabs.query({
  'active': true,
  'windowId': chrome.windows.WINDOW_ID_CURRENT
  }, function (tabs) {
    var currentUrl = new URL(tabs[0].url), url_to_cache;

    if (currentUrl.hostname === "cdn.ampproject.org") {
      url_to_cache = currentUrl.pathname.replace(/.*\/c\/s\//, '');
    } else if (currentUrl.hostname === "www.google.com" && currentUrl.pathname.startsWith("/amp/")) {
      url_to_cache = currentUrl.pathname.replace(/\/amp\//, '');
    } else {
      url_to_cache = currentUrl.hostname + currentUrl.pathname;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if(this.status == 204) {
          document.getElementById("status").src = "images/checky.png";
        } else {
          document.getElementById("status").src = "images/error.png";
        }
      }
    };
    xhttp.open("GET", "https://cdn.ampproject.org/update-ping/c/s/" + url_to_cache, true);
    xhttp.send();
  }
);
