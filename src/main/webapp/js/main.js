var MainModel = {	
		
	displaySuccessAlert : function(text) {
		MainModel.clearErrorAlert();
        $('#mainSuccessAlertText').text(text);
        $('#mainSuccessAlert').show();
        $(document.body).scrollTop($('#mainSuccessAlert').offset().top-70);
    },
    
    clearSuccessAlert : function() {
        $('#mainSuccessAlertText').text('');
        $('#mainSuccessAlert').hide();
    },
    
    displayErrorAlert : function(text) {
    	MainModel.clearSuccessAlert();
        $('#mainErrorAlertText').text(text);
        $('#mainErrorAlert').show();
        $(document.body).scrollTop($('#mainErrorAlert').offset().top-70);
    },
    
    clearErrorAlert : function() {
        $('#mainErrorAlertText').text('');
        $('#mainErrorAlert').hide();
    },
    
    goToElement : function(id) {
    	$('html,body').animate(
			{scrollTop: $("#"+id).offset().top-116},
	       	'slow'
		);
    },
    
    showOverlay : function() {
    	$('#overlay').show();
    },
    
    hideOverlay : function() {
    	$('#overlay').hide();
    },
    
    init : function() {
    	$('#mainSuccessAlert').hide();
    	$('#mainErrorAlert').hide();
    	
    	ko.observable(300).publishOn("studio_runTime", false);
		ko.observable(10).publishOn("studio_timeScale", false);
    },
    
	selfUrl : function() {
		return "http://"+$.url("hostname")+":"+$.url("port")+$.url("path");
	}
};

var Application = {
	initializeBindings : function() {
		ko.applyBindings({}, document.getElementById("tabs"));
		ko.applyBindings({}, document.getElementById("initializer"));
	},
	
	configureCustomBindings : function() {
		ko.bindingHandlers.date = {
			    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			        var value = valueAccessor();
			        var valueUnwrapped = ko.utils.unwrapObservable(value);
			        var date = new Date(valueUnwrapped);
			        var hours = (date.getHours() < 10 ? "0"+date.getHours() : date.getHours());
			        var minutes = (date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes());
			        var dateString = (date.getDate() < 10 ? "0"+date.toLocaleDateString() : date.toLocaleDateString());
			        $(element).text(dateString+", "+hours+":"+minutes);
			    }
		};
		
		ko.virtualElements.allowedBindings.date = true;
	},
	
	configureAmd : function() {
		// configure templating engine
		infuser.defaults.templateUrl = 'templates'; 
		infuser.defaults.templateSuffix = '.tmpl.html';
		
		// configure require.js plugins
		requirejs.config({
		    paths: {
		        "text": "webjars/requirejs-text/2.0.14/text"
		    }
		});
	}
};

$(document).ready(function() {
	
	Application.configureAmd();
	Application.configureCustomBindings();
	Application.initializeBindings();
	
	// initialize view
	MainModel.init();
});