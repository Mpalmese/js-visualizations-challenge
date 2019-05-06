function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then(function(response){

    var meta = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    meta.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    
      
      Object.entries(response).forEach(function([key, value]) {
        console.log(key, value);
        var cell = meta.append("p");
        cell.text(`${key} : ${value}`);
      });
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response);

    var data = response;
  
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      type: "scatter",
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },  
      
      
      
    }

    data = [trace1];
  
    var layout = {
      title:"bubble"
    };
    
    Plotly.newPlot("bubble", data, layout);
  });
  

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(`/samples/${sample}`).then(function(response) {
      console.log(response);
      
      var sample_values = response.sample_values;
      var otu_ids = response.otu_ids;
      var otu_labels = response.otu_labels;

      var output = sample_values.map( (s, i) => ({'sample_value' : s, 'otu_id' : otu_ids[i], 'otu_label': otu_labels[i]}) );
      console.log(output);

      output = output.sort((a,b) => (a.sample_value < b.sample_value) ? 1 : -1);
      console.log(output);

      output = output.slice(0,10);

      console.log(output);
      
      sample_values = [];
      otu_ids = [];
      otu_labels = [];

      output.forEach(function(obj){
        sample_values.push(obj.sample_value);
        otu_ids.push(obj.otu_id);
        otu_labels.push(obj.otu_label);
      });

      console.log(sample_values);
      
      
      //var sample_values = response.sample_values.slice(0,10);
      
      //var otu_ids = response.otu_ids.slice(0, 10);
     
      //var otu_labels = response.otu_labels.slice(0, 10);

      var trace1 = {
        values: sample_values,
        labels: otu_ids,
        hovertext: otu_labels,
        type: "pie"
      };
      

      

      var data = [trace1];
    
      var layout = {
        title: "Pie"
      };
      Plotly.newPlot("pie", data, layout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
