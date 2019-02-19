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
    },
    
    tabs: {
        init: function (tabsContainer) {
            var tabsNumber = document.querySelectorAll(tabsContainer + ' .tab').length;
            
            for (let i = 1; i <= tabsNumber; i++) {
                document.querySelector(tabsContainer + ' [data-tab="' + i + '"]').addEventListener('click', function() { 
                    document.querySelector(tabsContainer + ' .tab-content.active').classList.remove('active');
                    document.querySelector(tabsContainer + ' .tab.active').classList.remove('active');
                    document.querySelector(tabsContainer + ' .tab-content[data-tab-content="' + i + '"]').classList.add('active');
                    document.querySelector(tabsContainer + ' .tab[data-tab="' + i + '"]').classList.add('active');
                });
            }
        }
    }

};
