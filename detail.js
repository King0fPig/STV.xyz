load("config.js");

function execute(url) {
    var info = parseLink(url);
    if (!info) return Response.error("Link không hợp lệ");
    var link = BASE_URL + "/truyen/" + info.host + "/1/" + info.bookId + "/";
    var doc = openBrowser(link, 2500);
    var html = doc.html();
    var text = doc.text();

    var name = firstText(doc, ["#book_name2", "h1", ".title"]);
    if (!name) name = (doc.select("title").text() || "").split(" - ")[0];

    var author = "";
    var m = /Tác giả:\s*(.+?)\s*Thể loại:/.exec(text);
    if (m) author = m[1];
    if (!author) author = firstText(doc, [".fa-user + *", "#author"]);

    var hanviet = "";
    m = /Hán việt:\s*(.+?)\s*Tác giả:/.exec(text);
    if (m) hanviet = m[1];

    var genres = "";
    m = /Thể loại:\s*(.+?)\s*Nguồn truyện:/.exec(text);
    if (m) genres = m[1];

    var desc = "";
    m = /Tóm tắt truyện[\s\S]*?<\/(?:div|h\d|span)>([\s\S]*?)(?:Thông tin)/.exec(html);
    if (m) desc = stripHtml(m[1]);

    var cover = "";
    var sels = ["#thumb img", ".bookthumb img", "img[src*=bookcover]", "img[src^=http]"];
    for (var i = 0; i < sels.length && !cover; i++) {
        var e = doc.select(sels[i]).first();
        if (e) cover = e.attr("src") || e.attr("data-src");
        if (cover && /favicon|logo|nothumb/.test(cover)) cover = "";
    }

    var ongoing = text.indexOf("Hoàn thành") < 0;
    var detail = [];
    if (hanviet) detail.push("Hán việt: " + hanviet);
    if (genres) detail.push("Thể loại: " + genres);
    detail.push("Nguồn: " + info.host);

    return Response.success({
        name: name,
        cover: absUrl(cover),
        author: author,
        description: desc,
        detail: detail.join("\n"),
        ongoing: ongoing,
        host: BASE_URL
    });
}
