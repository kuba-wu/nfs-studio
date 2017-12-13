var SimulationPickerModel = function(params){
	
	var self = this;
	
	self.containerId = params.view+"_studio";
	
	self.system = ko.observable().subscribeTo(params.view+"_system");
	self.task = ko.observable().subscribeTo(params.view+"_task", false);
    
	self.systems = ko.observableArray();
	
	self.systemWithParams = ko.observable().publishOn(params.view+"_system", true);
	self.comparisonResult = ko.observable().publishOn(params.view+"_comparisonResult", true, function(newValue, oldValue) {return false;});
	
	self.timeScale = ko.observable().subscribeTo(params.view+"_timeScale", true);
	self.runTime = ko.observable().subscribeTo(params.view+"_runTime", true);
	    
    self.load = function(system) {
        self.systemWithParams(system.system);
    }; 
    
    self.remove = function(system) {
    	self.systems.remove(system);
    };
    
    self.compare = function() {
    	var environment = {
    			"runTime" : self.runTime(),
    			"timeScale" : self.timeScale()
    		};
    		
    		var systems = [];
    		for (var i=0, n=self.systems().length; i < n; i++) {
    			systems.push(JSON.parse(self.systems()[i].system));
    		}
    		
    		var systemComparison = {
    			environment : environment,
    			systems : systems
    		};
    		self.loadData(JSON.stringify(systemComparison));
    };
    
    self.loadData = function(systemComparison) {
		
		var url = "api/system/compare";
		$.ajax(url, {
			data : systemComparison,
			success : function(comparisonResult) {
				self.comparisonResult(comparisonResult);
			},
			contentType : 'application/json',
			type : 'POST'
		}).fail(function(xhr) {
			MainModel.displayErrorAlert(xhr.responseText);
		});
	};
    
    self.addToList = function() {
    	var system = {
                system: self.system().system,
                name: self.task().name,
                timestamp: new Date()
        };
        self.systems.push(system);
    };
};

$(document).ready(function() {
	ko.components.register('simulation-picker', {
	    template: {require: 'text!components/shared/simulation-picker/template.html'},
	    viewModel: SimulationPickerModel
	});
});