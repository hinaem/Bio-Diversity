function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log("sampleNames")
    console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
      // 3. Create a variable that holds the samples array. 
      var allSamples = data.samples;

      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = allSamples.filter(sampleObj => sampleObj.id == sample);

      var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

      //  5. Create a variable that holds the first sample in the array.
      var sampleOne = sampleArray[0];
      console.log(sampleOne)

      var metadata = metadataArray[0];

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuId = sampleOne.otu_ids;
      var otuLabel = sampleOne.otu_labels;
      var sampleValues = sampleOne.sample_values;

      var washFreq = parseFloat(metadata.wfreq);
      console.log(washFreq);

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 

      var yticks = otuId.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

      console.log(yticks);
      console.log(sampleValues);

      // 8. Create the trace for the bar chart. 
      var barData = [
        {
          y: yticks,
          x: sampleValues.slice(0, 10).reverse(),
          text: otuLabel.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
        }
      ];
      // 9. Create the layout for the bar chart. 

      var barLayout = {
        title: `Top Ten OTU IDS ${sample}`,
        margin: { t: 30, l: 150 }
        //xaxis: { title:"Sample Values"},
        //yaxis: {title: "OTU IDS"}
      };

      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
 
// 1. Create the trace for the bubble chart.
  var bubbleData = [{
        x: otuId,
        y: sampleValues,
        mode: 'markers',
        text: otuLabel,
        marker: {
          size: sampleValues,
          color: otuId,
          colorscale: "Earth"
        }
    }];
    console.log(bubbleData);

// 2. Create the layout for the bubble chart.
  var bubbleLayout = {
      title: 'Bacteria Culture Per Sample',
      showlegend: false,
      xaxis: { title: "OTU ID", automargin: true},
      yaxis: { automargin: true},
      hovermode: "closest"
  };
console.log(bubbleLayout);

// 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});


// 4. Create the trace for the gauge chart.
  var gaugeData = [
    {
      domain: { x: [0,1], y:[0,1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number+delta",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        bgcolor: "white",
        steps: [
          { range: [0, 2], color: "pink" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "black" },
          { range: [8, 10], color: "navy" },
        ],
      }
    }
  ];

  // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
      width: 500,
      height: 425,
      margin: {t: 0, b: gaugeLayout}
  };

    // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });

}