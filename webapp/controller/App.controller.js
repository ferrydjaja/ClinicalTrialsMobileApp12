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
                        title: "{i18n>WELCOME_TITLE}",
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
                        title: "{i18n>WELCOME_TITLE}",
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });

        },

        _makeRequest: function() {
            cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
            	
            	alert(enabled);
                if (!enabled) {

                    //cordova.plugins.locationAccuracy.canRequest(function(canRequest) {
                        //if (canRequest) {

                            cordova.plugins.locationAccuracy.request(function() {
                                    alert("Location accuracy request successful");
                                }, function(error) {
                                    alert("Error requesting location accuracy: " + JSON.stringify(error));
                                    if (error) {

                                        alert("error code=" + error.code + "; error message=" + error.message);
                                        
                                        if (error.code === cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                                            alert("YEEE");
                                        }

                                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {

											jQuery.sap.require("sap.m.MessageBox");
											sap.m.MessageBox.show(jQuery.sap.resources({
												url: "i18n/i18n.properties"
											}).getText("LOC_FAILED"), {
												icon: sap.m.MessageBox.Icon.INFORMATION,
												title: "Location Services is disabled",
												actions: ["No, Thanks", "Go to Settings"],
												onClose:  function(sAction) {
													alert("Action selected: " + sAction);
													
													if(sAction == "Go to Settings") {
														cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY;
														cordova.plugins.diagnostic.switchToLocationSettings();
													}
												},
												//styleClass: ""                        
											});

                                        }
                                    }
                                }//, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                            );

                        //} else {
                            // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
                            // On Android, this will occur if the app doesn't have authorization to use location.
                           // alert("Cannot request location accuracy");
                        //}
                    //});
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