var BASE_URL = "https://sangtacviet.xyz";

function absUrl(u) {
    if (!u) return "";
    if (u.indexOf("//") === 0) return "https:" + u;
    if (u.indexOf("http") === 0) return u;
    if (u.charAt(0) !== "/") u = "/" + u;
    return BASE_URL + u;
}

// /truyen/{host}/1/{bookid}/  hoặc  /truyen/{host}/1/{bookid}/{chapid}/
function parseLink(u) {
    var m = /\/truyen\/([^\/]+)\/\d+\/([^\/?#]+)(?:\/([^\/?#]+))?/.exec(u || "");
    if (!m) return null;
    return { host: m[1], bookId: m[2], chapId: m[3] || null };
}

function bookItem(name, link, cover, desc) {
    return {
        name: (name || "").replace(/\s+/g, " ").trim(),
        link: absUrl(link),
        cover: absUrl(cover),
        description: (desc || "").replace(/\s+/g, " ").trim(),
        host: BASE_URL
    };
}

function openBrowser(url, wait) {
    var b = Engine.newBrowser();
    b.launch(url, 10000);
    sleep(wait || 2000);
    var d = b.html();
    b.close();
    return d;
}

function firstText(doc, sels) {
    for (var i = 0; i < sels.length; i++) {
        var e = doc.select(sels[i]).first();
        if (e) {
            var t = e.text();
            if (t && t.trim()) return t.trim();
        }
    }
    return "";
}

// Dọn thẻ <i> bọc từ dịch, ký tự \ufffe, v.v. (theo code của trang)
function cleanStv(s) {
    return (s || "")
        .replace(/<\/?i(\s[^>]*)?>/gi, "")
        .replace(/\ufffe/g, "");
}

function stripHtml(s) {
    return cleanStv(s)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

// Quét mọi liên kết /truyen/host/1/id/ (không có chương) trong trang
function parseBookList(doc) {
    var anchors = doc.select("a[href*=/truyen/]");
    var map = {};
    var order = [];
    for (var i = 0; i < anchors.size(); i++) {
        var a = anchors.get(i);
        var href = a.attr("href");
        var info = parseLink(href);
        if (!info || info.chapId) continue;
        var key = info.host + "/" + info.bookId;
        var name = a.select("b").text() || a.text();
        name = (name || "").replace(/\s+/g, " ").trim();
        var img = a.select("img").first();
        if (!img && a.parent()) img = a.parent().select("img").first();
        var cover = img ? (img.attr("src") || img.attr("data-src")) : "";
        if (!map[key]) {
            map[key] = { name: "", link: href, cover: "" };
            order.push(key);
        }
        if (name.length > map[key].name.length) map[key].name = name;
        if (cover && !map[key].cover) map[key].cover = cover;
    }
    var list = [];
    for (var j = 0; j < order.length; j++) {
        var it = map[order[j]];
        if (it.name) list.push(bookItem(it.name, it.link, it.cover, ""));
    }
    return list;
}
