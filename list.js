load("config.js");

function execute(input, page) {
    var doc = openBrowser(input, 3000);
    return Response.success(parseBookList(doc));
}
