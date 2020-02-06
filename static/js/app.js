function init() {
    // Selecting dropdown options
    var dropdown = d3.select("#selDataset");
    // Reading in data
    d3.json("../samples.json").then((data) => {
        console.log(data);
        // For each function for dropdown options
        data.names.forEach(function (id) {
            dropdown.append("option").text(id).property("value");
        });
        // Call functions for table and charts
        demographicsTable(data.names[0]);
        barGraph(data.names[0]);
        bubbleChart(data.names[0]);
    });
}

init();


// Function for demographics table
function demographicsTable(id) {

    var tbody = d3.select("tbody")
    var thead = d3.select("thead")
    var row = tbody.append("tr");
    var head = thead.append("tr")

    d3.json("../samples.json").then((data) => {
        // Loop variables
        var metadata = data.metadata;
        var metadataFiltered = metadata.filter(mt => mt.id.toString() === id)[0];

        // For each function to populate table
        Object.entries(metadataFiltered).forEach((value) => {
            head.append("th").text(value[0]);
            row.append("td").text(value[1]);
        });

    });
}


// Bar graph
function barGraph(id) {
    d3.json("../samples.json").then((data) => {

        var samples = data.samples.filter(smp => smp.id.toString() === id)[0];
        var barValues = samples.sample_values.slice(0, 10).reverse();
        var ids = (samples.otu_ids.slice(0, 10)).reverse();
        var barLabels = ids.map(value => `OTU ${value}`)
        var barHover = samples.otu_labels.slice(0, 10);

        var trace1 = {
            x: barValues,
            y: barLabels,
            text: barHover,
            type: "bar",
            orientation: "h",
        };

        var data1 = [trace1];
        var layout1 = {
            title: "Top 10 OTUs for Individual",
        };

        Plotly.newPlot("bar", data1, layout1);

    })
};



// Bubble chart
function bubbleChart(id) {
    d3.json("../samples.json").then((data) => {

        var samples = data.samples.filter(smp => smp.id.toString() === id)[0];
        var bubbleRange = samples.otu_ids;
        var bubbleDomain = samples.sample_values;
        var bubbleHover = samples.otu_labels;

        var trace2 = {
            x: bubbleRange,
            y: bubbleDomain,
            text: bubbleHover,
            mode: "markers",
            marker: {
                size: bubbleY,
                color: bubbleId,
            }
        };

        var data2 = [trace2];
        var layout2 = {
            xaxis: { title: "OTU ID" },
        };

        Plotly.newPlot("bubble", data2, layout2);

    })
};


// Function for when different data is selected
function optionChanged(id) {

    //Clear table
    var tbody = d3.select("tbody")
    var thead = d3.select("thead")
    tbody.html("");
    thead.html("");

    // Update table
    demBox(id);
    barChart(id);
    bubbleChart(id);
}