load("config.js");

function execute(url) {
    var doc = openBrowser(url, 3000);
    var content = null;
    var sels = ["#content-container", ".contentbox", "#chapter-content", "#chaptercontent", ".chapter-content"];
    for (var i = 0; i < sels.length && !content; i++) {
        var e = doc.select(sels[i]).first();
        if (e && e.text().length > 100) content = e;
    }

    // Dự phòng: div có nhiều chữ nhất mà không chứa thanh điều hướng
    if (!content) {
        var divs = doc.select("div");
        var best = 0;
        for (var d = 0; d < divs.size(); d++) {
            var dv = divs.get(d);
            var t = dv.text();
            if (t.indexOf("Chương trước") >= 0 || t.indexOf("Mục lục") >= 0 || t.indexOf("Đăng nhập") >= 0) continue;
            if (t.length > best) { best = t.length; content = dv; }
        }
    }
    if (!content || content.text().length < 50) return Response.error("Không lấy được nội dung chương");

    var html = cleanStv(content.html())
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/@Bạn đang đọc bản lưu trong hệ thống/g, "");
    return Response.success(html);
}
