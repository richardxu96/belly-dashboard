function buildMetadata(sample) {
	d3.json(`/metadata/${sample}`).then(function (data) {
		console.log(data)
		// });
		var PANEL = d3.select("#sample-metadata");

		// Use `.html("") to clear any existing metadata
		PANEL.html("");
		// Use `Object.entries` to add each key and value pair to the panel
		// Hint: Inside the loop, you will need to use d3 to append new
		// tags for each key-value in the metadata.
		// Object.entries(data).forEach(([key, value]) => {
		//   PANEL.append('h2').text(`${key}`);
		// });
		Object.entries(data).forEach(([key, value]) => {
			PANEL.append("h6").text(`${key}: ${value}`);
		});
		// @TODO: Complete the following function that builds the metadata panel

		// Use `d3.json` to fetch the metadata for a sample
		// Use d3 to select the panel with id of `#sample-metadata`

		// BONUS: Build the Gauge Chart
		// buildGauge(data.WFREQ);
	})
}

function bubble(plot) {
	var bubbleDiv = document.getElementById("bubble");
	var url = '/samples/' + plot;
	d3.json(url).then(function (data) {
		console.log(data)

		var traceA = {
			type: "scatter",
			mode: "markers",
			x: data.otu_ids,
			y: data.sample_values,
			marker: {
				size: data.sample_values,
				color: data.otu_ids

			}
		};

		var data = [traceA];

		var layout = {
			title: "Bubble Chart"
		};

		Plotly.newPlot(bubbleDiv, data, layout);

	});
}

function pie(plot) {
	var pieDiv = document.getElementById("pie");
	var url = '/samples/' + plot;
	d3.json(url).then(function (data) {
		console.log(data)

		var slicevalues = data.sample_values.slice(0, 10);
		var slicelabels = data.otu_ids.slice(0, 10);

		var traceA = {
			type: "pie",
			values: slicevalues,
			labels: slicelabels
		};

		var data = [traceA];

		var layout = {
			title: "Top 10 Belly Button"
		};

		Plotly.newPlot(pieDiv, data, layout)
	});
}

function buildCharts(sample) {
	// d3.select(`samples/${sample}`).then(function(data){
	// console.log(data.otu_ids);
	// });
	// @TODO: Use `d3.json` to fetch the sample data for the plots

	// @TODO: Build a Bubble Chart using the sample data


	// Plotly.plot("bubble",bubbleData);
	// @TODO: Build a Pie Chart
	// HINT: You will need to use slice() to grab the top 10 sample_values,
	// otu_ids, and labels (10 each).
	pie(sample);
	bubble(sample);
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
// pie();
// bubble();