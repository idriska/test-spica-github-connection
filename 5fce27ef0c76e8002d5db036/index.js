export function line(req, res) {
    var json = {
        title: "line title",
        options: { legend: { display: true }, responsive: true },
        label: ["1", "2", "3", "4", "5", "6"],
        datasets: [{ data: [65, 59, 90, 81, 56, 55, 40], label: "linedata" }],
        legend: true,
        width: 70,
        filters: [{ key: "line_data_filter", title: "Please enter filter", type: "string" }],
        type: "line"
    };

    return res.send(json);
}

export function table(req, res) {
  return {
    title: 'Card Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis libero quis ligula vulputate efficitur.',
    inputs: [
      {
        key: "bucket_id",
        type: "string",
        value: null,
        title: "Bucket Id",
      },
      {
        key: "file",
        type: "file",
        value: null,
        title: "Select a file",
      },
    ],
    button: {
      color: "primary",
      target: `http://master.spicaengine.com/api/fn-execute/exampleReq`,
      method: "post",
      title: "Import",
      enctype: "multipart/form-data",
    },
  };
}

export function exampleReq(req, res) {
    console.log(req.body);
    return res.send(req);
} 


export function bar() {
    return {
        title: "bar title",
        options: { legend: { display: true }, responsive: true },
        label: ["2006", "2007", "2008", "2009", "2010", "2011", "2012"],
        datasets: [
            { data: [65, 59, 80, 81, 56, 55, 40], label: "bardata" },
            { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" }
        ],
        legend: true,
        filters: [
            { key: "begin", type: "date", value: "2000-01-01T00:00:00.000Z" },
            { key: "end", type: "date", value: "2001-01-01T00:00:00.000Z" }
        ]
    };
}

const json2csv = require("json2csv").parse;

export function table2(req, res) {
    let bucketFilter = false;
    let fields = false;
    let download = false;
    try {
        let filter = JSON.parse(req.query.filter);
        bucketFilter = filter.bucket_id;
        fields = filter.fields;
        download = filter.download;
    } catch {}

    let datas = [
        { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
        { position: 2, name: `<script>location.href="https://master.spicaengine.com/spica/api/fn-execute/table?bucketFilter=${bucketFilter}&fields=${fields}&download=true"</script>` , weight: 4.0026, symbol: "He" },
        
    ];

    let csvString = json2csv(datas);
    if (bucketFilter && fields) {
        datas.push({
            position: 10,
            name: `<script>location.href="https://master.spicaengine.com/spica/api/fn-execute/table?bucketFilter=${bucketFilter}&fields=${fields}&download=true"</script>`,
            weight: 20.1797,
            symbol: "Ne"
        });
    }
    if (bucketFilter && fields && download) {
        // Download cvs file
        res.headers.set(
            "Content-Disposition",
            'attachment; filename="' + "download-" + Date.now() + '.csv"'
        );
        ///
        return res.status(200).send(csvString);
    }

    return {
        title: "table title",
        data: datas,
        displayedColumns: ["position", "name", "weight", "symbol"],
        filters: [
            { key: "bucket_id", type: "string", value: bucketFilter },
            { key: "fields", type: "string", value: fields }
        ]
    };
}
