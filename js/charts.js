function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
   d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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
    // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    // 5. Create a variable that holds the first sample in the array.
        var firstSamples  = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSamples.otu_ids;
    var otuLabels = firstSamples.otu_labels.slice(0,10);
    var sampleValues = firstSamples.sample_values.slice(0,10);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0,10).map((id) => "OTU " + id);
   

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      hoverinfo: otuLabels,
      type: "bar",
      orientation: "h",
      backgroundColor: "rgb(192, 189, 189)"
    };
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "<b>Top 10 Bacteria Cultures Found</b>",
        y: 0.95
      },
      margin: {
        l: 100,
        r: 35,
        b: 50,
        t: 75,
        pad: 4
      },
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);




// Deliverable # 2: Create a Bubble Chart //
 // 1. Create the trace for the bubble chart.
 var bubbleData = {
  x: otuID,
  y: sampleValues,
  type: "bubble",
  text: otuLabels,
  hoverinfo: "x+y+text",
  mode: "markers",
  marker: {size: sampleValues, color: otuID, colorscale: "Earth"}
};
     
// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: {
    text: "<b>Bacteria Cultures Per Sample</b>",
    
  },
  xaxis: {title: "OTU ID"},
  margin: {
    l: 70,
    r: 55,
    b: 62,
    t: 68,
    pad: 12
  },
  hovermode: "closest"
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", [bubbleData], bubbleLayout);


// Deliverable # 3: Create a Gauge Chart //

   // 1. Create a variable that filters the metadata array for the object with the desired sample number.
   var metadata = data.metadata;
   var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);  

   // 2. Create a variable that holds the first sample in the metadata array.
   var gaugeResult = gaugeArray[0];

   // 3. Create a variable that holds the washing frequency.
   var wfreqs = parseFloat(gaugeResult.wfreq);
   
   // 4. Create the trace for the gauge chart.
   var gaugeData = {
    type: "indicator",
    value: wfreqs,
    mode: "gauge+number",
    gauge: {
      axis: {range: [0,10], dtick: 2},
      bar: {color: "black"},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "yellowgreen"},
        {range: [8,10], color: "green"}
      ],
    }
  };   

   // 5. Create the layout for the gauge chart.
   var gaugeLayout = { 
    title: {
      text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      y: 0.75,
    },
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 50,
      pad: 50
    },
  };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}