sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function(Fragment, MessageToast, Controller) {
    "use strict";

    var _dialog;

    var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({
    });

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.Feedback", {
        handleRouteMatched: function(oEvent) {
            var oParams = {};

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {
                        path: "/" + this.sContext,
                        parameters: oParams
                    };
                    this.getView().bindObject(oPath);
                }
            }
        },

        wasteTime: function() {
            busyDialog.open();
        },

        runNext: function() {
            busyDialog.close();
        },

        toTitleCase: function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },

        onOpenDialog: function(oEvent) {
            // instantiate dialog
            if (!_dialog) {
                _dialog = sap.ui.xmlfragment("ClinicalTrials.ClinicalTrials.view.BusyDialog", this);
                this.getView().addDependent(_dialog);
            }

            // open dialog
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), _dialog);
            _dialog.open();
        },

        onDialogClosed: function(oEvent) {
            if (oEvent.getParameter("cancelPressed")) {
                window.sessionStorage.setItem("cancel", "Y");
                console.log("The operation has been cancelled");
            } else
                window.sessionStorage.setItem("cancel", "N");
        },

        _onSuggestCondition: function(oEvent) {
            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            var value = oEvent.getParameter("suggestValue").trim();
            var oInput = oEvent.getSource();

            var jModel = new sap.ui.model.json.JSONModel();
            jModel.attachRequestCompleted(function(event) {
                var jResponse = event.getSource().getData();

                if (JSON.stringify(jResponse) != "{}") {
                    this.setModel(jModel);
                }
            }.bind(this));

            if (value != '') {
                jModel.loadData(conn + "?q=3", {
                    "cond": value
                }, false);
            }
            oInput.suggest();
        },

        _onSuggestLocation: function(oEvent) {
            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            var value = oEvent.getParameter("suggestValue").trim();
            var oInput = oEvent.getSource();

            var jModel = new sap.ui.model.json.JSONModel();
            jModel.attachRequestCompleted(function(event) {
                var jResponse = event.getSource().getData();

                if (JSON.stringify(jResponse) != "{}") {
                    this.setModel(jModel);
                }
            }.bind(this));

            if (value != '') {
                jModel.loadData(conn + "?q=4", {
                    "input": value
                }, false);
            }
            oInput.suggest();
        },

        onInit: function() {
            window.sessionStorage.setItem("cancel", "N");

            var this_ = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            var oSelectConditionAS = this.getView().byId("selectConditionAS");
            oSelectConditionAS.attachSuggest("suggest", this._onSuggestCondition);

            var oSelectLocationAS = this.getView().byId("selectLocationAS");
            oSelectLocationAS.attachSuggest("suggest", this._onSuggestLocation);

            var oModelSponsor = this.getOwnerComponent().getModel("SponsorModel");
            this.getView().byId("selectSponsorAS").setModel(oModelSponsor);

            var oModelTrialStatus = this.getOwnerComponent().getModel("TrialStatusModel");
            this.getView().byId("selectTrialStatusAS").setModel(oModelTrialStatus);

            var oModelDistance = this.getOwnerComponent().getModel("DistanceModel");
            this.getView().byId("selectDistanceAS").setModel(oModelDistance);

            var oRootPath = jQuery.sap.getModulePath("ClinicalTrials.ClinicalTrials"); // your resource root
            var oImageModel = new sap.ui.model.json.JSONModel({
                path: oRootPath,
            });
            this.getView().setModel(oImageModel, "imageModel");
        },

        ConditionValueHelpRequest: function() {
            this.getView().byId("selectConditionAS").setValue();
        },

        TermsValueHelpRequest: function() {
            this.getView().byId("selectTermsAS").setValue();
        },

        LocationValueHelpRequest: function() {
            this.getView().byId("selectLocationAS").setValue();
        },

        onSelectSponsorChange: function(oEvent) {},

        onSelectTrialStatusChange: function(oEvent) {},

        _onRadioButtonGroupSelect: function() {},

        onNavButtonTo: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("list", true);
        },

        NavBack: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home", true);
        },

        onButtonPress: function(oEvent) {
            var this_ = this;
            var cond = this.getView().byId("selectConditionAS").getValue().trim();

            if (cond.length >= 3) {

                cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
                    if (enabled) {

                        var latlng = window.sessionStorage.getItem("latlng");

                        if (latlng == "" || latlng == null) {
                            this_.onOpenDialog();
                            navigator.geolocation.getCurrentPosition(this_.onGeoSuccess.bind(this_), this_.onGeoNoResult.bind(this_), {
                                //Android
                                enableHighAccuracy: true,
                                timeout: 2000,
                                maximumAge: 0
                                
                                //iOS
                                // enableHighAccuracy: true
                            });
                        } else {
                            var lat = latlng.split(';')[0];
                            var lng = latlng.split(';')[1];

                            this_.onCheckCert(function(returnValue) {
                                console.log(returnValue);
                                if (returnValue == 'success') {

                                    console.log(lat + '-' + lng);
                                    this_.onProcess(lat, lng);

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
                        }

                    } else {
                        window.sessionStorage.setItem("cancel", "N");
                        this_.onGeoNoResult();
                    }
                });

            } else {
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show(jQuery.sap.resources({
                    url: "i18n/i18n.properties"
                }).getText("VALID_KEYWORD"), {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: this.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                    actions: sap.m.MessageBox.Action.OK,
                    onClose: null,
                    //styleClass: ""                        
                });
            }
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

        onGeoSuccess: function(position) {
            _dialog.close();

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            window.sessionStorage.setItem("latlng", lat + ';' + lng);

            var this_ = this;

            this.onCheckCert(function(returnValue) {
                console.log(returnValue);
                if (returnValue == 'success') {

                    console.log(lat + '-' + lng);
                    this_.onProcess(lat, lng);

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


            //For testing only
            /*
			var lat = '';
            var lng = '';

            //var lat = position.coords.latitude;
            //var lng = position.coords.longitude;
            //var alt = position.coords.altitude;

            this.onProcess(lat, lng);
			*/
        },

        onGeoNoResult: function() {
            if (_dialog)
                _dialog.close();

            MessageToast.show("Can't get GPS signal...");

            var this_ = this;

            var lat = '';
            var lng = '';

            this_.onCheckCert(function(returnValue) {
                console.log(returnValue);
                if (returnValue == 'success') {

                    console.log(lat + '-' + lng);
                    this_.onProcess(lat, lng);

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

        onCancelButtonPress: function() {
            this.getView().byId("selectConditionAS").setValue();
            this.getView().byId("selectTermsAS").setValue();
            this.getView().byId("selectLocationAS").setValue();
            this.getView().byId("selectSponsorAS").setSelectedKey(0);
            this.getView().byId("selectGenderAS").setSelectedIndex(0);
            this.getView().byId("selectAgeAS").setSelectedIndex(0);
            this.getView().byId("selectTrialStatusAS").setSelectedKey(0);
            this.getView().byId("selectDistanceAS").setSelectedKey(0);
        },

        CheckLocation: function(location, callback) {
            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            var cntry = "";
            var cntryln = "";
            var state = "";
            var stateln = "";
            var city = "";
            var lat;
            var lng;

            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                dataType: "json",
                timeout: 600000,
                contentType: "application/json; charset=utf-8",
                url: conn + "?q=5&location=" + location,
                success: function(data) {

                    if (data.status == 'OK') {
                        for (var v = 0, len = data.results[0].address_components.length; v < len; v++) {
                            var type = data.results[0].address_components[v].types;
                            if (type.includes("locality"))
                                city = data.results[0].address_components[v].short_name;

                            if (type.includes("administrative_area_level_1")) {
                                state = data.results[0].address_components[v].short_name;
                                stateln = data.results[0].address_components[v].long_name;
                            }

                            if (type.includes("country")) {
                                cntry = data.results[0].address_components[v].short_name;
                                cntryln = data.results[0].address_components[v].long_name;
                            }
                        }

                        if (typeof state === "undefined")
                            state = "";
                        else {
                            if (cntry == "US" && state != "")
                                state = "US:" + state;

                            if (cntry != "US")
                                state = "";
                        }

                        if (typeof city === "undefined")
                            city = "";

                        lat = data.results[0].geometry.location.lat;
                        lng = data.results[0].geometry.location.lng;
                        callback(cntry + ';' + cntryln + ';' + state + ';' + city + ';' + lat + ';' + lng);

                    } else if (data.status == 'ZERO_RESULTS' || data.status == 'INVALID_REQUEST') {
                        callback('error');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    callback('error');
                }
            });
        },

        ReverseGeo: function(lat, lng, callback) {
            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            var cntry = "";
            var cntryln = "";
            var state = "";
            var stateln = "";
            var city = "";
            var latR;
            var lngR;

            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                dataType: "json",
                timeout: 600000,
                contentType: "application/json; charset=utf-8",
                url: conn + "?q=7&latlng=" + lat + "," + lng,
                success: function(data) {

                    if (data.status == 'OK') {
                        for (var v = 0, len = data.results[0].address_components.length; v < len; v++) {
                            var type = data.results[0].address_components[v].types;
                            if (type.includes("locality"))
                                city = data.results[0].address_components[v].long_name;

                            if (type.includes("administrative_area_level_1")) {
                                state = data.results[0].address_components[v].short_name;
                                stateln = data.results[0].address_components[v].long_name;
                            }
                            if (type.includes("country")) {
                                cntry = data.results[0].address_components[v].short_name;
                                cntryln = data.results[0].address_components[v].long_name;
                            }
                        }

                        if (typeof state === "undefined")
                            state = "";
                        else {
                            if (cntry == "US" && state != "")
                                state = "US:" + state;

                            if (cntry != "US")
                                state = "";
                        }

                        if (typeof city === "undefined")
                            city = "";

                        latR = data.results[0].geometry.location.lat;
                        lngR = data.results[0].geometry.location.lng;
                        callback(cntry + ';' + cntryln + ';' + state + ';' + city + ';' + latR + ';' + lngR);

                    } else if (data.status == 'ZERO_RESULTS' || data.status == 'INVALID_REQUEST') {
                        callback('error');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    callback('error');
                }
            });
        },

        Proceed: function(cond, term, cntry, cntryln, state, city, gndr, lead, recrs, age, dist, lat, lng) {
            console.log(cond + '|' + term + '|' + cntry + '|' + cntryln + '|' + state + '|' + city + '|' + gndr + '|' + lead + '|' + recrs + '|' + age + '|' + dist + '|' + lat + '|' + lng);

            var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            var this_ = this;

            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                dataType: "json",
                timeout: 600000,
                contentType: "application/json; charset=utf-8",
                url: conn + "?q=1&cond=" + cond + "&term=" + term + "&cntry=" + cntry + "&cntryln=" + cntryln + "&state=" + state + "&city=" + city + "&lead=" + lead + "&recrs=" + recrs + "&gndr=" + gndr + "&age=" + age + "&dist=" + dist + "&lat=" + lat + "&lng=" + lng,
                success: function(data) {
                    console.log(data);

                    if (JSON.stringify(data) != "{}") {
                        console.log(data.results.length);

                        if (data.results.length > 0) {
                            this_.runNext();

                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData({});

                            oModel.setData({
                                modelData: [data],
                                UserLoc: [lat + ';' + lng + ';' + dist + ';' + recrs],
                                cond: [this_.toTitleCase(cond)]
                            });
                            sap.ui.getCore().setModel(oModel, "listmodel");
                            this_.onNavButtonTo();
                        } else {
                            console.log('no record 2');
                            this_.runNext();
                            jQuery.sap.require("sap.m.MessageBox");
                            sap.m.MessageBox.show(jQuery.sap.resources({
                                url: "i18n/i18n.properties"
                            }).getText("NO_INFO"), {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                                actions: sap.m.MessageBox.Action.OK,
                                onClose: null,
                                //styleClass: ""                        
                            });
                        }
                    } else {
                        // No record {}
                        console.log('no record 1');
                        this_.runNext();
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(jQuery.sap.resources({
                            url: "i18n/i18n.properties"
                        }).getText("NO_INFO"), {
                            icon: sap.m.MessageBox.Icon.INFORMATION,
                            title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                            actions: sap.m.MessageBox.Action.OK,
                            onClose: null,
                            //styleClass: ""                        
                        });
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    this_.runNext();
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(jQuery.sap.resources({
                        url: "i18n/i18n.properties"
                    }).getText("ERROR_INFO"), {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });
        },

        onProcess: function(lat, lng) {

            if (window.sessionStorage.getItem("cancel") != "Y") {

                window.sessionStorage.setItem("cancel", "N");

                var cond = this.getView().byId("selectConditionAS").getValue().trim();
                var term = this.getView().byId("selectTermsAS").getValue().trim();
                var location = this.getView().byId("selectLocationAS").getValue().trim();
                var gndr = this.getView().byId("selectGenderAS").getSelectedIndex();
                var gndrAr = ['All', 'Male', 'Female'];
                gndr = gndrAr[gndr];
                var lead = this.getView().byId("selectSponsorAS").getSelectedKey().trim();
                var recrs = this.getView().byId("selectTrialStatusAS").getSelectedKey().trim();
                var age = this.getView().byId("selectAgeAS").getSelectedIndex();
                var ageAr = ['', '0', '1', '2'];
                age = ageAr[age];
                var dist = this.getView().byId("selectDistanceAS").getSelectedKey().trim();
                var cntry = "";
                var cntryln = "";
                var state = "";
                var city = "";

                this.wasteTime();
                var this_ = this;

                if (location != '') {
                    this.CheckLocation(location, function(returnValue) {
                        console.log(returnValue);
                        if (returnValue != 'error') {

                            //Location IS entered, then get the lat long from location field
                            cntry = returnValue.split(';')[0];
                            cntryln = returnValue.split(';')[1];
                            state = returnValue.split(';')[2];
                            city = returnValue.split(';')[3];
                            lat = returnValue.split(';')[4];
                            lng = returnValue.split(';')[5];

                            this_.Proceed(cond, term, cntry, cntryln, state, city, gndr, lead, recrs, age, dist, lat, lng);
                        } else {
                            this_.runNext();
                            jQuery.sap.require("sap.m.MessageBox");
                            sap.m.MessageBox.show(jQuery.sap.resources({
                                url: "i18n/i18n.properties"
                            }).getText("LOCATION_ERR"), {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                                actions: sap.m.MessageBox.Action.OK,
                                onClose: null,
                                //styleClass: ""                        
                            });
                        }
                    });
                } else {
                    //Location is NOT entered, then get the lat long from GPS (if it is on)

                    //convert GPS lat long to address
                    if (lat != '' && lng != '') {
                        this.ReverseGeo(lat, lng, function(returnValue) {

                            if (returnValue != 'error') {
                                cntry = returnValue.split(';')[0];
                                cntryln = returnValue.split(';')[1];
                                state = returnValue.split(';')[2];
                                city = returnValue.split(';')[3];
                                lat = returnValue.split(';')[4];
                                lng = returnValue.split(';')[5];

                                console.log(cntry + '|' + cntryln + '|' + state + '|' + city + '|' + lat + '|' + lng);
                                this_.Proceed(cond, term, cntry, cntryln, state, city, gndr, lead, recrs, age, dist, lat, lng);
                            } else {
                                console.log('Georeverse code error');
                                lat = '';
                                lng = '';
                                this_.Proceed(cond, term, cntry, cntryln, state, city, gndr, lead, recrs, age, dist, lat, lng);
                            }
                        });
                    } else {
                        //GPS is not active
                        this_.Proceed(cond, term, cntry, cntryln, state, city, gndr, lead, recrs, age, dist, lat, lng);
                    }

                }
            }
        }
    });
});
