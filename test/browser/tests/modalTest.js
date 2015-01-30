"use strict";

module.exports = {


	'Step 1: Open page at 800 x 800': function(browser){
		browser
			.url("http://build.origami.ft.com/files/o-overlay@1.3.1/demos/modal.html")
			.waitForElementVisible("button.o-overlay-trigger",5000)
			.windowSize('current',800,800);
	},

	'Step 2: Test modal overlay loads' : function (browser) {
		browser
			.click("button.o-overlay-trigger")
			.waitForElementVisible(".o-overlay--modal",5000)
			.assert.elementPresent(".o-overlay-shadow","No overlay shadow detected. This doesn't appear to be a modal window")
			.assert.cssProperty(".o-overlay-shadow","background-color","rgba(0, 0, 0, 0.2)")
			.assert.cssProperty(".o-overlay__heading","background-color","rgba(116, 115, 108, 1)")
			.assert.containsText(".o-overlay__content","Overlay content.")
			.isVisible(".o-overlay__content",function(result){
				this.assert.equal(result.value,true,"Overlay content is visible");
			})
			.isVisible(".o-overlay__close",function(result){
				this.assert.equal(result.value,true,"Overlay close button is visble");
			});
			
	},

	'Step 3: Test text can be entered into input fields': function(browser){
		browser
			.setValue(".o-overlay__content>input#username","username")
			.setValue(".o-overlay__content>input#password","password")
	},

	// Module should render in the middle of the page.  Since we know this browser is set
	// to 800 px wide, we're only testing that it appears within the boundaries of the 
	// middle third of the page.
	'Step 4: Check overlay placement' : function (browser) {
		var window_width = 800;
		var window_height;
		var window_first_third = window_width/3;
		var window_second_third = window_first_third*2;
		var overlay_left;
		var overlay_right;

		browser
			.getLocation(".o-overlay--modal", function(location){
				overlay_left = location.value.x;
			})
			.getElementSize(".o-overlay--modal", function(size){
				overlay_right = overlay_left + size.value.width;
				browser.assert.ok(overlay_left>window_first_third, "Left side of overlay appears centered on the page");
				browser.assert.ok(overlay_right<window_second_third, "Right side of overlay appears centered on the page")
			});	
	},

	'Step 5: Verify scrollbars appear when page is shortened' : function (browser) {
		var scrollHeight;
		var clientHeight;
		browser
			.windowSize('current', 800,400, function(){
				browser.waitForElementVisible("button.o-overlay-trigger",5000)
				browser.execute(function(){
					return document.getElementsByClassName("o-overlay--modal")[0].scrollHeight;
				},[],function(result){
					scrollHeight = result.value;
				})
				browser.execute(function(){
					return document.getElementsByClassName("o-overlay--modal")[0].clientHeight;
				},[],function(result){
					clientHeight = result.value;
					browser.assert.equal(scrollHeight,clientHeight,"The scroll bar appeared when the window became smaller than the overlay");
				})	
			})	
	},

	'Step 6: Close the overlay': function(browser){
		browser
			.click(".o-overlay__close")
			.assert.elementNotPresent("o-overlay--modal","Overlay closed, as expected")
			.end();
	}
};