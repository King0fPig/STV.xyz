load("config.js");

function execute(key, page) {
    var url = BASE_URL + "/?find=" + encodeURIComponent(key) + "&minc=0&tag=";
    var doc = openBrowser(url, 3000);
    return Response.success(parseBookList(doc));
}
