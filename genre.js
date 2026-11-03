load("config.js");

function execute() {
    var q = "&minc=0&tag=";
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/?find=&minc=0&sort=update&tag=", script: "list.js" },
        { title: "Được nhiều Like", input: BASE_URL + "/?find=&minc=0&sort=upvote&tag=", script: "list.js" },
        { title: "Xem nhiều trong tuần", input: BASE_URL + "/?find=&minc=0&sort=viewweek&tag=", script: "list.js" },
        { title: "Hot", input: BASE_URL + "/?find=&minc=0&sort=star&tag=", script: "list.js" }
    ]);
}
