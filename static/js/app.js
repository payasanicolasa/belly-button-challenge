// 1. Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url).then(createCharts);

let subjectID = null
let data = null

function optionChanged() {
    let dropdownMenu = d3.select(("#selDataset"))
    subjectId = dropdownMenu.property("value")
    console.log(subjectId)
    createCharts()
}

function updateDemoBox(metadata) {
    let box = d3.select(("#sample-metadata"))  // id, ethnicity, gender, age, location, bbtype, wfreq
    box.html("")
    for (const prop in metadata) {
      box.append('div').text(prop + ": " + metadata[prop])
    }
}

// This function will be called once the json file has finished being fetched
function createCharts(rawData) {
    if (data == null) { // The first time we save save the read data
        data = rawData
        subjectId = data['samples'][0]['id']
        let dropdownMenu = d3.select(("#selDataset")) // Populate the dropdown with subject ids
        data['samples'].forEach((subject, i) => {
          dropdownMenu.append('option').text(subject.id)
        })
    }

    // Get array index from subjectId
    let sampleIdx = data['samples'].findIndex((item) => {return item.id == subjectId})

    // 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    let trace1 = [{
        x: data['samples'][sampleIdx]['sample_values'].slice(0, 10).reverse(), // 2a. Use sample_values as the values for the bar chart.
        y: data['samples'][sampleIdx]['otu_ids'].slice(0, 10).map((item) => {return 'OTU ' + item}).reverse(), // 2b. Use otu_ids as the labels for the bar chart.
        type: 'bar',
        orientation: 'h',
        text: data['samples'][sampleIdx]['otu_labels']/// 2c. Use otu_labels as the hovertext for the chart.
    }];

    var layout = {title: 'Hover over the points to see the text'};
    Plotly.newPlot('bar', trace1, layout);

    // 3. Create a bubble chart that displays each sample.
    let trace2 = [{
        x: data['samples'][sampleIdx]['otu_ids'], // 3a. Use otu_ids for the x values.
        y: data['samples'][sampleIdx]['sample_values'], // 3b. Use sample_values for the y values.
        mode:'markers',
        text: data['samples'][sampleIdx]['otu_labels'], // 3e. Use otu_labels for the text values.
        marker: {
            size: data['samples'][sampleIdx]['sample_values'], // 3c. Use sample_values for the marker size.
            color: data['samples'][sampleIdx]['otu_ids'] // 3d. Use otu_ids for the marker colors.
        }
    }];

    let layout2 = {
        xaxis: {title: 'OTU ID'},
        showlegend: false,
        height: 500,
        width: 1000
        };
        
    Plotly.newPlot('bubble', trace2, layout2);

    // 4. Display the sample metadata, i.e., an individual's demographic information. / Display each key-value pair from the metadata JSON object somewhere on the page.
    metadataIdx = data['metadata'].findIndex((item) => {return item.id == subjectId})
    updateDemoBox(data['metadata'][metadataIdx]) // 6. Update all the plots when a new sample is selected. Create any layout that you would like for your dashboard.
}