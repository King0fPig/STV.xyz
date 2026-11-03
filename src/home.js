function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "update", script: "gen.js" },
        { title: "Được nhiều Like", input: "like", script: "gen.js" },
        { title: "Xem nhiều trong tuần", input: "viewweek", script: "gen.js" },
        { title: "Hot tuần", input: "hot", script: "gen.js" },
        { title: "Ngẫu nhiên", input: "random", script: "gen.js" }
    ]);
}
