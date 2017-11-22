var StudioModel = function(params){
	
	var self = this;
	
	self.containerId = params.view+"_studio";
	
	self.show = function()  {
		$('#'+self.containerId).collapse('show');
	};
		
	self.initialized = false;
	
	ko.postbox.subscribe(params.view+"_system", function(system){
		self.systemSubmitted();
	});
	
	self.systemSubmitted = function() {
		
		if (!self.initialized) {
			self.initialized = true;
			self.show();
		}
	};
};

$(document).ready(function() {
	ko.components.register('studio', {
	    template: {require: 'text!components/anonymous/studio/template.html'},
	    viewModel: StudioModel
	});
});