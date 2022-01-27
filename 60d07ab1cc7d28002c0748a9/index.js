export async function userDashboardDuels(req, res) {
    console.log(req.query.filter);

    return {
        title: "pie title",
        options: { legend: { display: true }, responsive: true },
        label: [["piedata", "Sales"], ["In", "Store", "Sales"], "Mail Sales"],
        data: [300, 500, 100],
        legend: true,
        filters: [
            { key: "begin", type: "date", value: "2000-01-01T00:00:00.000Z" },
            { key: "end", type: "date", value: "2001-01-01T00:00:00.000Z" }
        ]
    };
}
