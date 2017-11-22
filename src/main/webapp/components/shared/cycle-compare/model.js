var CycleCompareModel = function(params){
	
	var self = this;

	self.containerId = params.view+"_compareCycle";
	self.chartContainerId = params.view+"_compareCycleChart";
	self.timeScale = ko.observable().subscribeTo(params.view+"_timeScale", true);
	self.runTime = ko.observable().subscribeTo(params.view+"_runTime", true);
	
	ko.postbox.subscribe(params.view+"_comparisonResult", function(comparisonResult) {
		self.loadData(comparisonResult.cycles);
	});
	
	self.createExportFileName = function() {
		var runTimeString = "[runTime-"+self.runTime()+"]";
		var timeScaleString = "[timeScale-"+self.timeScale()+"]";
		var names = ["nfs", "compare", "system", runTimeString, timeScaleString];
		return names.join("_");
	};
	
	self.getExportConfig = function(cycles) {
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
		            fileName: self.createExportFileName()
		        }, {
		            title: 'SVG',
		            format: 'svg',
		            fileName: self.createExportFileName()
		        },{
		            title: 'TXT',
		            format: 'txt',
		            fileName: self.createExportFileName()
		        }]
		    }],
		    rawData: function() {return self.createOutputData(cycles);}
		};
	};
	
   self.createOutputDataForConcentrations = function(chartData) {
        
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
    
   self.createOutputData = function(cycles) {
        
        var result = "";
        for (var i=0; i < cycles.length; i++) {
            var cycle = cycles[i];
            result += i+" cycle: \n";
            self.createOutputDataForConcentrations(cycle.concentrations);
        }
        return result;
    };
	
	self.createChartData = function(cycles) {
		var mergedData = [];

		for (var i=0; i < cycles.length; i++) {
			
			var maximum = 0;
			var cycle = cycles[i];
			for (var j=0, n=cycle.concentrations.length; j < n; j++) {
				var jMax = self.getMax(cycle.concentrations[j]);
				if (jMax > maximum) {
					maximum = jMax;
				}
			} 
			var length = (cycles[i].concentrations.length > 0 ? cycles[i].concentrations[0].values.length : 0);
			
			var zeroes = 0;
			for (var j=0, n=cycle.concentrations.length; j < n; j++) {
				var jMax = self.getMax(cycle.concentrations[j]);
				if (jMax < 0.1) {
					zeroes +=1;
				}
			}
			
			var oneEntry = {};
			oneEntry.bullet = "round";
			oneEntry.systemIndex = i;
			oneEntry.length = (length/self.timeScale()).toFixed(2);
			oneEntry.maximum = maximum.toFixed(0);
			oneEntry.zeroes = zeroes;
			
			mergedData.push(oneEntry);
		}
		return mergedData;
	};
	
	self.getMax = function(concentrations) {
		var max = 0;
		for (var i=0, n=concentrations.values.length; i < n; i++) {
			if (concentrations.values[i].product > max) {
				max = concentrations.values[i].product;
			}
		}
		return max;
	};
	
	self.createGraphs = function() {
		
		var graphs = [];
		graphs.push(self.createGraph("length", "cycle length", "#BB0000"));
		graphs.push(self.createGraph("maximum", "cycle maximum", "#0000BB"));
		graphs.push(self.createGraph("zeroes", "number of zeroed products", "#00BB00"));
		return graphs;
	};
	
	self.createGraph = function(field, name, color) {
			var graph = {};
			
			graph.type = "column";
			graph.valueField = field;
			graph.title = name;
			
			graph.bulletField = "bullet";
			graph.bulletBorderAlpha =  1;
			graph.bulletSize = 0;
			graph.bulletColor = "#FFFFFF";
			graph.bulletBorderThickness = 1;
			graph.useLineColorForBulletBorder = true;
			
			graph.lineColor = color;
			graph.lineThickness = 2;
			graph.fillAlphas = 0.6;
			
			return graph;
	};
	
	self.show = function() {
        $('#'+self.containerId).collapse('show');
    };
	
	self.loadData = function(cycles) {
		
		if ((cycles.length == 0) || (cycles[0].concentrations.length == 0)) {
			MainModel.displayErrorAlert("No cycles were found.");
			return ;
		}
		
		self.show();
		
		var mergedData = self.createChartData(cycles);
		var graphs = self.createGraphs();
		var legend = new AmCharts.AmLegend();
		legend.valueWidth = 100;
		
		AmCharts.makeChart(self.chartContainerId, {
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
			categoryField : "systemIndex",
			// AXES	
			categoryAxis : {
				dashLength : 1,
				gridAlpha : 0.15,
				axisColor : "#DADADA",
				title : "system [index]"
			},
			// value                
			valueAxes : [{
				axisColor : "#DADADA",
				dashLength : 0,
				labelsEnabled : true,
				title : "value"
			}],
			// graphs
			graphs : graphs,
			// export
			exportConfig : self.getExportConfig(cycles),
			
			// legend
			legend : legend,
			
			// CURSOR
			chartCursor : {
				cursorPosition : "mouse"
			},
			// SCROLLBAR
			chartScrollbar : {}
		});
		self.currentData = cycles;
		MainModel.goToElement(self.chartContainerId);
	};
};

$(document).ready(function() {
	ko.components.register('cycle-compare', {
	    template: {require: 'text!components/shared/cycle-compare/template.html'},
	    viewModel: CycleCompareModel
	});
});
