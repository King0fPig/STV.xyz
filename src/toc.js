load("config.js");

function chapUrl(host, bookId, chapId) {
    return BASE_URL + "/truyen/" + host + "/1/" + bookId + "/" + chapId + "/";
}

function execute(url) {
    var info = parseLink(url);
    if (!info) return Response.error("Link không hợp lệ");
    var list = [];

    // Cách 1: endpoint danh sách chương (suy đoán từ code trang, chưa kiểm chứng)
    try {
        var api = BASE_URL + "/index.php?sajax=getchapterlist&h=" + info.host + "&bookid=" + info.bookId;
        var res = fetch(api);
        if (res.ok) {
            var raw = res.text();
            try { var j = JSON.parse(raw); if (j && j.data) raw = j.data; } catch (e) {}
            if (raw.indexOf("-,-") >= 0) {
                var parts = raw.split("-///-");
                for (var i = 0; i < parts.length; i++) {
                    var kv = parts[i].split("-,-");
                    if (kv.length >= 2 && kv[0]) {
                        list.push({
                            name: stripHtml(kv[1]),
                            url: chapUrl(info.host, info.bookId, kv[0].trim()),
                            host: BASE_URL
                        });
                    }
                }
            }
        }
    } catch (e) {}
    if (list.length > 0) return Response.success(list);

    // Cách 2: mở trang bằng trình duyệt và quét các link chương
    var doc = openBrowser(BASE_URL + "/truyen/" + info.host + "/1/" + info.bookId + "/", 4000);
    var as = doc.select("a[href*=/truyen/" + info.host + "/1/" + info.bookId + "/]");
    var seen = {};
    for (var k = 0; k < as.size(); k++) {
        var a = as.get(k);
        var p = parseLink(a.attr("href"));
        if (!p || !p.chapId || seen[p.chapId]) continue;
        seen[p.chapId] = true;
        list.push({
            name: a.text().replace(/\s+/g, " ").trim(),
            url: chapUrl(p.host, p.bookId, p.chapId),
            host: BASE_URL
        });
    }
    if (list.length === 0) return Response.error("Không đọc được mục lục");
    return Response.success(list);
}
