"use strict";

var _tjs = {

    ajax: {
        get: function (htmlresponse, url) {
            var responseHTML = document.querySelector(htmlresponse);
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    responseHTML.innerHTML = request.responseText;
                }
            }

            request.open('GET', url, true);
            request.send(null);
        }
    }

};
