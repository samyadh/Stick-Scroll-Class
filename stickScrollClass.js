/*!
 * stickScrollClass v1.0.0 (http://samyadh-jain.com)
 * Copyright 2016-2017 Samyadh Jain.
 * Licensed under the MIT license.
 * 21st June 2016, 9:45 pm IST.
 * This jQuery plug-in helps to add and remove a class element when particular scroll value you specify.
 * The plug-in also allows you to set triggers on multiple scroll values and use them with callbacks.
 *
 *
 * How to use?
 * Use it how you use any other jQuery plug-in's.
 * e.g. $("#yourElement").stickScrollClass(options);
 *
 * Options?
 * className		-	String value, Name of the class you want to add to element.
 * 						Mandatory, multiple class in same sting can be specified too.
 * start 			- 	Integer value of position where your specified class should be added.
 * 						Optional, When not specified uses element's current offset top position value.
 * end 				- 	Integer value of position where your specified class should be removed.
 * 						Optional, When not specified uses computed value of (document height - window height).
 * showDemo			- 	Boolean value when specified as true, shows the changes in a box at bottom of the page.
 * 						Optional, When not specified changes are not shown.
 * triggers			-	Array of Integer values containing positions where your callback function is triggered.
 * 						Optional, When not specified callback function is not triggered. 
 * 						Combined with triggerCallback (If 'triggers' are specified then 'triggerCallback' needs to be specified too).
 * triggerCallback	-	Function type which are called when any trigger is fired.
 *						Two parameters are added from plug-in to this method
 *							1. triggerIndex		-	Which is positive Integer value which specify the index of triggers.
 *							2. direction		-	Which is Integer value which is 1 or 0, 1 specify the direction downwards,
 *													0 specify the direction upwards.
 *						Both parameter names can be changed according to your choice but position of parameter will remain the same.
 *						Optional, When not specified function is not triggered.
 *						Combined with triggers (If 'triggerCallback' are specified then 'triggers' needs to be specified too).
 *
 * e.g.	$("#yourElement").stickScrollClass({
 *	 		className:"fixed",
 *	 		start:500,
 *	 		end:1500,
 *	 		showDemo:true,
 *	 		triggers:[300,600,900],
 *	 		triggerCallback:function(triggerIndex,direction){
 *	 			console.log("Triggered event for : "+triggerIndex+", direction : "+direction);
 *	 		}
 * 		});
 */
 
$.fn.stickScrollClass = function(options) {
	var el = this;
	var demoEle;
	var triggerCallbackFunction;
	var triggers;
	var currentScrollVal;
	var lastTriggerVal = 0;
	var callback;
	var isDemo;
	var classAdded = false;
	var classRemoved = false;
	var settings = $.extend({ 
		start:el.offset().top, 
		end: $(document).height() - $(window).height(),
		showDemo: false
		},options);
	
	var init = function(){
		isDemo = settings.showDemo;
		
		if(isDemo)
		{
			$('body').append('<div class="stickScrollDemo" style="position:fixed; bottom:30px; right:30px; padding:15px; background-color:#000000; color:#FFFFFF; z-index:9999">No effects yet!</div>');
			demoEle = $('.stickScrollDemo');
		}
		
		if(isTriggersEnabled)
		{
			triggers = settings.triggers;
			triggersCopy = settings.triggers;
			triggerCallbackFunction = function(triggerIndex, direction){
				callback = settings.triggerCallback;
				callback(triggerIndex, direction);
			};
		}
		
		$(window).scroll(function(){
			currentScrollVal = window.pageYOffset;
			startFix();
			if(isTriggersEnabled)
			{
				startTriggers();
			}
			endFix();
		});
	}
	
	var startFix = function(){
		if(currentScrollVal >= settings.start)
		{
			el.addClass(settings.className);
			
			if(isDemo && !classAdded){ $(demoEle).html('Specified class "'+settings.className+'" added.'); }
			classAdded = true;
			classRemoved = false;
		}
	}
	
	var isTriggersEnabled = function() {
		if(typeof(settings.triggers) !== "undefined" && typeof(settings.triggerCallback) !== "undefined")
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	var startTriggers = function(){
		$.each(triggers, function(index,value){
			if(currentScrollVal >= triggers[index] && lastTriggerVal <= triggers[index])
			{
				if(isDemo){	$(demoEle).html('Tiggered Event :'+(index+1)+' for downwards.'); }
				triggerCallbackFunction(index+1, 1);
				lastTriggerVal = currentScrollVal;
			}
			
			if(currentScrollVal <= triggers[index] && lastTriggerVal >= triggers[index])
			{
				if(isDemo){	$(demoEle).html('Tiggered Event :'+(index+1)+' for upwards.'); }
				triggerCallbackFunction(index+1, 0);
				lastTriggerVal = currentScrollVal;
			}
		});
	}
	
	var endFix = function(){
		if(currentScrollVal >= settings.end || currentScrollVal <= settings.start)
		{
			el.removeClass(settings.className);
			
			if(isDemo && !classRemoved){ $(demoEle).html('Specified class "'+settings.className+'" removed.'); flag = 0; }
			classRemoved = true;
			classAdded = false;
		}
	}
	
	init();
};