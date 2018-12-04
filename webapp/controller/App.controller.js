sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.App", {

        onInit: function() {
            document.addEventListener("deviceready", this._makeRequest.bind(this), false);
            document.addEventListener("resume", this._makeRequest.bind(this), false);
            document.addEventListener("online", this.appOnline.bind(this), false);

            var oModelPath = this.getOwnerComponent().getModel("ScrModel");
            sap.ui.getCore().setModel(oModelPath, "scrmodel");
        },

        appOnline: function() {
            var this_ = this;

            this.onCheckCert(function(returnValue) {
                console.log(returnValue);
                if (returnValue == 'success') {
                    this_.checkGPS();
                } else if (returnValue == 'notsecure') {
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(jQuery.sap.resources({
                        url: "i18n/i18n.properties"
                    }).getText("NOT_SECURE"), {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                } else if (returnValue == 'confailed') {
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(jQuery.sap.resources({
                        url: "i18n/i18n.properties"
                    }).getText("CONN_FAILED"), {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });

        },

		_makeRequest: function() {

            cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
                if (!enabled) { //if location service is not enabled, then opn the Location Setting

                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(jQuery.sap.resources({
                        url: "i18n/i18n.properties"
                    }).getText("LOC_FAILED"), {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: "Location Services is disabled",
                        actions: ["No, Thanks", "Go to Settings"],
                        onClose: function(sAction) {
                            console.log("Action selected: " + sAction);

                            if (sAction == "Go to Settings") {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        },
                        //styleClass: ""                        
                    });
                } else {
					//location service is enabled, request for high accuracy
					cordova.plugins.locationAccuracy.canRequest(function(canRequest){
						//On iOS, this will return true if Location Services is currently OFF and request is not currently in progress. 
						//On Android, this will return true if the app has authorization to use location.
						if(canRequest){
							cordova.plugins.locationAccuracy.request(function (success){
								console.log("Successfully requested accuracy: "+success.message);
							}, function (error){
							   console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
							   if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
								   if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
									   cordova.plugins.diagnostic.switchToLocationSettings();
								   }
							   } else {
									//this_.onProcess('', '');
							   }
							}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
						}else{
							// request location permission and try again
						}
					});
				}
            });
        },

        onCheckCert: function(callback) {
            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var connfp = CryptoJS.AES.decrypt(oModelPath.oData[0].connfp, "pfect");
            connfp = connfp.toString(CryptoJS.enc.Utf8);
            var fp = CryptoJS.AES.decrypt(oModelPath.oData[0].fp, "pfect");
            fp = fp.toString(CryptoJS.enc.Utf8);

            var server = connfp;
            var fingerprint = fp;


            window.plugins.sslCertificateChecker.check(
                successCallback,
                errorCallback,
                server,
                fingerprint
            );

            function successCallback(message) {
                callback("success");
                // Message is always: CONNECTION_SECURE.
                // Now do something with the trusted server.
            };

            function errorCallback(message) {
                if (message === "CONNECTION_NOT_SECURE") {
                    callback("notsecure");
                    // There is likely a man in the middle attack going on, be careful!
                } else if (message.indexOf("CONNECTION_FAILED") > -1) {
                    callback("confailed");
                    // There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
                }
            };

            //callback('success');

        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onInit: function() {
        //
        //	},

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onExit: function() {
        //
        //	}

    });

});
