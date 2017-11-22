var ChartCompareModel = function(params) {
	
	var self = this;
	
	self.containerId = params.view+"_compareChart";
	self.chartContainerId = params.view+"_compareChartsChart";

	self.colors = ko.observable().subscribeTo(params.view+"_colors");	
	self.timeScale = ko.observable().subscribeTo(params.view+"_timeScale", true);
	self.runTime = ko.observable().subscribeTo(params.view+"_runTime", true);
	
	self.chart = null;
	self.graphs = ko.observableArray();
	self.selectedGraph = ko.observable();
	
	self.selectedGraph.subscribe(function(selectedProduct) {
	    self.graphs().forEach(function(node){
	        var product = node.product;
	        if (selectedProduct == product) {
	            node.graphs.forEach(function(graph) {
	                graph.hidden = false;
	            })
	        } else {
	            node.graphs.forEach(function(graph) {
                    graph.hidden = true;
                })
	        }
	    });
        self.chart.initChart();
	});
	
	ko.postbox.subscribe(params.view+"_comparisonResult", function(comparisonResult) {
		self.loadData(comparisonResult.simulations, self.colors());
	});
	
	self.show = function() {
		$('#'+self.containerId).collapse('show');
	};
	
	self.mergeChartData = function(simulations) {
		
		var mergedData = [];
		var firstSerie = simulations[0][0].values;
		
		for (var i=0; i < firstSerie.length; i++) {
			
			var oneEntry = {};
			oneEntry.time = firstSerie[i].time;
			
			for (var k=0; k < simulations.length; k++) {
				var chartData = simulations[k];
				for (var j=0; j < chartData.length; j++) {
					oneEntry[k+":"+j] = chartData[j].values[i].product;
				}
				if (!(i % self.timeScale())) {
					oneEntry.bullet = "round";
				}
				mergedData.push(oneEntry);
			}
		}
		return mergedData;
	};
	
	self.createGraphs = function(simulations, colors) {
		
		var graphs = [];
		for (var k=0; k < simulations.length; k++) {
			var chartData = simulations[k];
			for (var i=0; i < chartData.length; i++) {		
				var product = chartData[i].product;
				graphs.push(self.createGraph(k+":"+i, product, colors[product]));
			}
		}
		return graphs;
	};
	
	self.createGraph = function(field, name, color) {
		var graph = new AmCharts.AmGraph();
		
		graph.type = "smoothedLine";
		graph.valueField = field;
		graph.title = name+" concentration";
		
		graph.bulletField = "bullet"; 
		graph.bulletBorderAlpha =  1;
		graph.bulletSize = 0;
		graph.bulletColor = "#FFFFFF";
		graph.bulletBorderThickness = 1;
		graph.useLineColorForBulletBorder = true;
		
		graph.lineColor = color;
		graph.lineThickness = 2;
		
		graph.product = name;
		graph.visibleInLegend = false;
		
		return graph;
	},
	
	self.createExportFileName = function() {
		var runTimeString = "[runTime-"+self.runTime()+"]";
		var timeScaleString = "[timeScale-"+self.timeScale()+"]";
		var names = ["nfs", "compare", "system", runTimeString, timeScaleString];
		return names.join("_");
	};
	
	self.getExportConfig = function(dataSource) {
		return {
		    menuTop: '53px',
		    menuLeft: 'auto',
		    menuRight: '9px',
		    menuBottom: 'auto',
		    backgroundColor: "#efefef",
		    menuItemStyle	: {
                backgroundColor			: '#ffffff',
                rollOverBackgroundColor	: '#DDDDDD'
            },
		    menuItems: [{
		        textAlign: 'center',
		        onclick: function(a) {
		            return false;
		        },
		        icon: 'webjars/amcharts/3.4.7/images/export.png',
		        iconTitle: 'Save chart',
		        items: [{
		            title: 'PNG',
		            format: 'png',
		            fileName: dataSource.createExportFileName()
		        }, {
		            title: 'SVG',
		            format: 'svg',
		            fileName: dataSource.createExportFileName()
		        },{
		            title: 'TXT',
		            format: 'txt',
		            fileName: dataSource.createExportFileName()
		        }]
		    }],
		    rawData: function() {return self.createOutputData(self.currentData);}
		};
	};
	
	self.createOutputData = function(chartData) {
		
		var result = "";
		for (var i=0; i < chartData.length; i++) {
			var data = chartData[i];
			result += data.product+" concentration: ";
			var output = [];
			for (var j=0, n=data.values.length;j < n; j++) {
				output[j] = data.values[j].product;
			}
			result += output.join(', ')+"\r\n\r\n";
		}
		return result;
	};
	
	self.mapGraphs = function(graphs) {
	    
	    var map = {};
	    for (var i=0; i < graphs.length; i++) {
	        var graph = graphs[i];
	        if (!map[graph.product]) {
	            map[graph.product] = [];
	        }
	        map[graph.product].push(graph);
	    }
	    self.graphs.removeAll();
	    for (var product in map) {
	        self.graphs.push({product: product, graphs: map[product]});
	    }
	};
	
	self.loadData = function(simulations, colors) {
		
		self.show();
		
		var mergedData = self.mergeChartData(simulations);
		var graphs = self.createGraphs(simulations, colors);
		self.mapGraphs(graphs);
		
		var legend = new AmCharts.AmLegend();
        legend.valueWidth = 100;
		
		self.chart = AmCharts.makeChart(self.chartContainerId, {
			type : "serial",
			theme : "none",
			marginLeft : 20,
			pathToImages : "webjars/amcharts/3.4.7/images/",
			autoMarginOffset : 5,
			marginTop : 0,
			marginRight : 10,
			zoomOutButton : {
				backgroundColor : '#000000',
				backgroundAlpha : 0.15
			},
			dataProvider : mergedData,
			categoryField : "time",
			// AXES	
			categoryAxis : {
				dashLength : 1,
				gridAlpha : 0.15,
				axisColor : "#DADADA",
				title : "time [step]"
			},
			// value                
			valueAxes : [{
				axisColor : "#DADADA",
				dashLength : 0,
				labelsEnabled : true,
				title : "concentration [molecules/volume]"
			}],
			// graphs
			graphs : graphs,
			// export
			exportConfig : self.getExportConfig(self),
			
			// legend
			legend : legend,
			
			// CURSOR
			chartCursor : {
				cursorPosition : "mouse"
			},
			// SCROLLBAR
			chartScrollbar : {}
		});

		MainModel.goToElement(self.chartContainerId);
	};
};

$(document).ready(function() {
	ko.components.register('chart-compare', {
	    template: {require: 'text!components/shared/chart-compare/template.html'},
	    viewModel: ChartCompareModel
	});
});