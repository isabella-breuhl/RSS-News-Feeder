/* Request feeds from server */
const xml = new XMLHttpRequest();
xml.open('GET', 'http://138.49.184.106:3000/api/v1/feeds');
xml.responseType = 'json';
let data;

/* Variables for chosen feed source */
let sid, feedname = "";
let feedindex;

/* Variables for structure of chosen feed source */
let title, contentSnippet, link, pubDate = "";

xml.onload = () => {
    if (xml.status === 200) {
        data = xml.response;
        const dropdown = document.querySelector(".bar");

        /* Pull feed source names into dropdown bar */
        /* I got the map() format from : https://v1.scrimba.com/articles/react-list-array-with-map-function/ */
        dropdown.innerHTML = data.feeds.map((item, index) => `
            <div> <option value=${index + item.name}>${item.name}</option> </div>
        `).join('');
       
        sid = data.sid;
        updateChosenSource();
        loadNewsFeeds();
    }
};

function loadNewsFeeds() {
    updateChosenSource();

    /* Make link for news items from specific feedname */
    let url = "http://138.49.184.106:3000/api/v1/feeds/" + sid + "/" + feedname;

    /* Request feeds from server part 2 */
    const xml2 = new XMLHttpRequest();
    xml2.open('GET', url);
    xml2.responseType = 'json';

    xml2.onload = () => {
        /* Update the chosen source on every reload */
        updateChosenSource();

        /* Structure of news item objects */
        title = data.feeds[feedindex].mapping.title;
        contentSnippet = data.feeds[feedindex].mapping.contentSnippet;
        link = data.feeds[feedindex].mapping.link;
        pubDate = data.feeds[feedindex].mapping.pubDate;

        if (xml2.status === 200) {
            const data2 = xml2.response;
            const newsdiv = document.querySelector(".feed");

            /* Clear previous news divs */
            newsdiv.innerHTML = "";

            /* I got the append() and createElement() formats from : https://developer.mozilla.org/en-US/docs/Web/API/Element/append */
            for(let i = 0; i < data2.items.length; i++) {
                let titlediv = document.createElement("div");
                titlediv.className = "feedtitle";
                titlediv.textContent = data2.items[i][title];
                newsdiv.append(titlediv);

                let timediv = document.createElement("div");
                timediv.className = "feedtime";
                timediv.textContent = data2.items[i][pubDate];
                newsdiv.append(timediv);

                let contentdiv = document.createElement("div");
                contentdiv.className = "feedinfo";
                contentdiv.textContent = data2.items[i][contentSnippet];
                newsdiv.append(contentdiv);
            }
        }
    };
    xml2.send();
}

function updateChosenSource() {
    /* Search for the index in value */
    feedindex = document.querySelector(".bar").value.match(/\d+/);

    /* Search for the name in value */
    feedname = document.querySelector(".bar").value.match(/[a-zA-Z]+/);
}

xml.send();