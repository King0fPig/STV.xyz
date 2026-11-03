load("config.js");

var HEADINGS = {
    update: "mới cập nhật",
    like: "được nhiều like",
    viewweek: "xem nhiều trong tuần",
    hot: "truyện hot tuần",
    random: "ngẫu nhiên"
};

function execute(input, page) {
    var res = fetch(BASE_URL + "/");
    if (!res.ok) return Response.error("Không tải được trang chủ (" + res.status + ")");
    var doc = res.html();
    var want = HEADINGS[input];
    var secs = doc.select(".tmc-home-section");
    var list = [];

    for (var i = 0; i < secs.size(); i++) {
        var sec = secs.get(i);
        var head = sec.select("div").first();
        if (!head) continue;
        if (head.text().toLowerCase().indexOf(want) < 0) continue;

        // Dạng danh sách (Mới cập nhật)
        var rows = sec.select(".book-list-item");
        for (var r = 0; r < rows.size(); r++) {
            var row = rows.get(r);
            var a = row.select("a.cap").first();
            if (!a) continue;
            var img = row.select("img").first();
            var au = row.select("span.cap").first();
            list.push(bookItem(a.text(), a.attr("href"),
                img ? img.attr("src") : "", au ? au.text() : ""));
        }
        // Dạng lưới (Like / Xem nhiều / Hot / Ngẫu nhiên)
        var cells = sec.select(".book-grid a.cap");
        for (var c = 0; c < cells.size(); c++) {
            var cell = cells.get(c);
            var im = cell.select("img").first();
            list.push(bookItem(cell.select("b").text(), cell.attr("href"),
                im ? im.attr("src") : "", ""));
        }
        break;
    }
    return Response.success(list);
}
