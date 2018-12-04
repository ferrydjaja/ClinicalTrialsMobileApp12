sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "./Formatter"], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.List", {
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

        onInit: function() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            var oView = this.getView();

            this.getView().addEventDelegate({
                onBeforeShow: function(evt) {

					var oModel = new sap.ui.model.json.JSONModel();
				    oModel.setData({});
					oModel.refresh();
					oView.setModel(oModel);

                    oModel = sap.ui.getCore().getModel('listmodel');
                    console.log(oModel);
					oModel.refresh();
                    oView.setModel(oModel);
					oView.bindElement("/modelData/0");

                    this.oVBI = oView.byId("vbi");

                    var oMapConfig = {
                        "MapProvider": [{
                            "type": "",
                            "name": "BING",
                            "description": "Bing",
                            "tileX": "256",
                            "tileY": "256",
                            "minLOD": "0",
                            "maxLOD": "19",
                            "copyright": "Microsoft Corp.",
                            "Source": [{
                                "id": "1",
                                "url": "https://ecn.t0.tiles.virtualearth.net/tiles/r{QUAD}?g=685&&shading=hill"
                            }]
                        }],
                        "MapLayerStacks": [{
                            "name": "Default",
                            "MapLayer": [{
                                "name": "layer1",
                                "refMapProvider": "BING",
                                "opacity": "1.0",
                                "colBkgnd": "RGB(255,255,255)"
                            }]
                        }]
                    };

                    this.oVBI.setMapConfiguration(oMapConfig);
                    this.oVBI.setCenterPosition(oModel.oData.modelData[0].CenterPosition);
                    
                    var oSorter = new sap.ui.model.Sorter("tooltip", false);
					var oTable = oView.byId("vbitable");					
					var oBinding = oTable.getBinding("items");
					oBinding.sort(oSorter);
                }
            });
        },

        Search: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;

            var filters = new Array();
            var filter1 = new sap.ui.model.Filter("brief_title", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter2 = new sap.ui.model.Filter("id_info/nct_id", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter3 = new sap.ui.model.Filter("study_first_posted/_", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter4 = new sap.ui.model.Filter("overall_status", sap.ui.model.FilterOperator.EQ, searchValue);
            var filter5 = new sap.ui.model.Filter("eligibility/gender", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter6 = new sap.ui.model.Filter("eligibility/minimum_age", sap.ui.model.FilterOperator.Contains, searchValue);

            var oCombinedOr = new sap.ui.model.Filter([filter1, filter2, filter3, filter4, filter5, filter6]);
            filters.push(oCombinedOr);

            //get list created in view
            this.oList = this.getView().byId("polist");
            this.oList.getBinding("items").filter(filters);
        },


        doNavBack: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("feedback", true);
        },

		onNavButtonTo: function (evt) {
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", true);
		},
	
		doNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home", true);
        },

		doNavFavorite: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("favorite", true);
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
				} else if (message.indexOf("CONNECTION_FAILED") >- 1) {
					callback("confailed");
				// There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
				}
			};
		
			//callback('success');
		},

		handleOnPress: function(oEvent) {
			var this_ = this;
			
			var data = {};
            data.context = oEvent.getSource().getBindingContext();
            var selectedIndex = data.context.sPath.split("/")[4];
            var nct_id = data.context.oModel.oData.modelData[0].results[selectedIndex].id_info.nct_id;
			
			this.onCheckCert(function(returnValue) {
				console.log(returnValue);
				if(returnValue == 'success') {
					this_.onProcess(oEvent, nct_id);

				} else if(returnValue == 'notsecure') {
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
				} else if(returnValue == 'confailed') {
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
			//this_.onProcess(oEvent);

		},

        onProcess: function(oEvent, nct_id) {
            var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({
            });

            function wasteTime() {
                busyDialog.open();
            }

            function runNext() {
                busyDialog.close();
            }

            function genCriteria(str) {
                var indices = [];
                var inclusionstr_final = '';
                var exclusionstr_final = '';
                var ic_s = str.search(/inclusion criteria:/i);
                var ic_e = str.search(/exclusion criteria:/i);

                //console.log(ic_s + ' ' + ic_e);

                if (ic_s != -1) {
                    //******* INCLUSION ***********************************
                    //Inclusion Criteria: 19 chars.

                    var inclusionstr = '';
                    if (ic_e == -1)
                        inclusionstr = str.substring(ic_s, str.length).trim();
                    else
                        inclusionstr = str.substring(ic_s, ic_e).trim();

                    if (!inclusionstr.startsWith("-")) {
                        inclusionstr = "- " + inclusionstr;
                    }
                    //console.log("Inclusionnstr: " + inclusionstr);

                    var indices = [];
                    var period = false;
                    for (var v = 0, len = inclusionstr.length; v < len; v++) {
                        if (inclusionstr[v] == "-" && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] == " ") {
                            indices.push(v + 1);
                            period = false;
                        } else if (inclusionstr[v] == "." && inclusionstr[v + 1] == " " && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] != "e" && inclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        } else if (inclusionstr[v] == ")" && inclusionstr[v - 2] == " " && inclusionstr[v + 1] == " " && inclusionstr[v + 2] != "-" && inclusionstr[v - 1] != "e" && inclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        }
                    }

                    var st = 0;
                    var et = 0;
                    for (var i = 0, len = indices.length; i < len; i++) {
                        st = indices[i];
                        et = indices[i + 1];

                        if (typeof et === 'undefined')
                            et = inclusionstr.length;
                        else {
                            if (period) {
                                et = et - 3;
                            } else
                                et = et - 2;
                        }

                        if (inclusionstr.substring(st, et) != '')
                            inclusionstr_final += '• ' + inclusionstr.substring(st, et) + '\n\n';
                    }
                    //console.log(inclusionstr_final);
                } else
                    inclusionstr_final = 'N/A';

                if (ic_e != -1) {
                    //******* EXCLUSION ***********************************
                    var exclusionstr = str.substring(ic_e, str.length);
                    //console.log("Exclusionstr: " + exclusionstr);


                    indices = [];
                    period = false;
                    for (var v = 0, len = exclusionstr.length; v < len; v++) {
                        if (exclusionstr[v] == "-" && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] == " ") {
                            indices.push(v + 1);
                            period = false;
                        } else if (exclusionstr[v] == "." && exclusionstr[v + 1] == " " && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] != "e" && exclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        } else if (exclusionstr[v] == ")" && exclusionstr[v - 2] == " " && exclusionstr[v + 1] == " " && exclusionstr[v + 2] != "-" && exclusionstr[v - 1] != "e" && exclusionstr[v - 1] != "g") {
                            indices.push(v + 2);
                            period = true;
                        }
                    }

                    var st = 0;
                    et = 0;
                    for (var i = 0, len = indices.length; i < len; i++) {
                        st = indices[i];
                        et = indices[i + 1];

                        if (typeof et === 'undefined')
                            et = exclusionstr.length;
                        else {
                            if (period) {
                                et = et - 3;
                            } else
                                et = et - 1;
                        }

                        if (exclusionstr.substring(st, et) != '')
                            exclusionstr_final += '• ' + exclusionstr.substring(st, et) + '\n\n';
                    }
                    //console.log(exclusionstr_final);
                } else
                    exclusionstr_final = 'N/A';

                indices = [];
                indices.push(inclusionstr_final);
                indices.push(exclusionstr_final);

                return indices;
            }


            /*
            var data = {};
            data.context = oEvent.getSource().getBindingContext();
            var selectedIndex = data.context.sPath.split("/")[4];
            var nct_id = data.context.oModel.oData.modelData[0].results[selectedIndex].id_info.nct_id;
            */
            
            wasteTime();

            var position = '';

            var oModel = new sap.ui.model.json.JSONModel();

            var oGModel = sap.ui.getCore().getModel('listmodel');
            var lat = oGModel.oData.UserLoc[0].split(";")[0];
            var lng = oGModel.oData.UserLoc[0].split(";")[1];
            var dist = oGModel.oData.UserLoc[0].split(";")[2];
            var recrs = oGModel.oData.UserLoc[0].split(";")[3];

			var this_ = this;

			var oModelPath = sap.ui.getCore().getModel('scrmodel');
            var conn = CryptoJS.AES.decrypt(oModelPath.oData[0].conn, "pfect");
            conn = conn.toString(CryptoJS.enc.Utf8);

            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                url: conn + "?q=2&nctid=" + nct_id + "&lat=" + lat + "&lng=" + lng + "&dist=" + dist + "&recrs=" + recrs,
                timeout: 600000, 
                dataType: "json",
                contentType: "application/json; charset=utf-8",

                success: function(data) {
                    if (data.results.length > 0) {
                        runNext();
                        console.log(data);
				
						var id_info = data.results[0].id_info;
                        var url = data.results[0].url;
                        var brief_title = data.results[0].brief_title;
                        var official_title = data.results[0].official_title;
                        var brief_summary = data.results[0].brief_summary;
						var sponsors = data.results[0].sponsors;
                        var location_countries = data.results[0].location_countries;

                        var overall_contact = data.results[0].overall_contact;

                        var eligibility = data.results[0].eligibility;
                        var criteria = genCriteria(data.results[0].eligibility.criteria.textblock);
                        var inclusioncriteria = criteria[0];
                        var exclusioncriteria = criteria[1];
                        //console.log(inclusioncriteria);
                        //console.log(exclusioncriteria);				
						
						var intervention = data.results[0].intervention;
						if(!Array.isArray(intervention)) {
							var interventionarray = [];
							interventionarray.push(intervention);
							intervention = interventionarray;
						}

						var condition = data.results[0].condition;
						if(!Array.isArray(condition)) {
							var conditionarray = [];
							conditionarray.push(condition);
							condition = conditionarray;
						}
						
						var phase = data.results[0].phase;
						var overall_status = data.results[0].overall_status;

						var condition_browse = data.results[0].condition_browse;
						if(!Array.isArray(condition_browse)) {
							var condition_browsearray = [];
							condition_browsearray.push(condition_browse);
							condition_browse = condition_browsearray;
						}

						var location = data.results[0].location;
						var Spots = data.Spots;
                        var centerposition = data.results[0].centerposition;
						var Circle = data.Circle;
						var OLoc = data.OLoc;

                    	var obj = [{
                            id_info: id_info,
							url: url,
							brief_title: brief_title,
							official_title: official_title,
							sponsors: sponsors,
							brief_summary: brief_summary,
							location_countries: location_countries,
							overall_contact: overall_contact,
							eligibility: eligibility,
							inclusioncriteria: inclusioncriteria,
							exclusioncriteria: exclusioncriteria,
							intervention: intervention,
							condition: condition,
							phase: phase,
							overall_status: overall_status,
							condition_browse: condition_browse,
							location: location,
							Spots: Spots,
							centerposition: centerposition,
							Circle: Circle,
							OLoc: OLoc
                        }];
                        console.log(obj);

                        oModel.setData({
                            modelData1: obj
                        });

						sap.ui.getCore().setModel(oModel, "DModel");
                        this_.onNavButtonTo();

                    } else {
						runNext();
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
                    runNext();
                    if (errorThrown == '')
                        errorThrown = 'Cannot connect to the backend';
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(errorThrown, {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: this_.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });
        },

		saveNCTOnPress: function(oEvent) {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

			this.oList = this.getView().byId("polist");
			var items = this.oList.getSelectedItems();

			var msg1 = true;

			for (var i = 0; i < items.length; i++) {
				var item = items[i];			 
				var context = item.getBindingContext();
				var obj = context.getProperty("id_info");
				var nctid = obj.nct_id;
				
				console.log(nctid);

				var storage = oStorage.get('NCTID');
				if(storage == null) 
					storage = "";

				var n = storage.includes(nctid);
				console.log(n);
				if(!n) {
					if(storage == "") 
						storage = nctid;
					else 
						storage = storage + "," + nctid;
					
					var storagelen = 0;
					if(oStorage.get('NCTID') != null) {
						storagelen = oStorage.get('NCTID').split(",").length;
					} 

					if(storagelen < 20) {
						oStorage.put('NCTID', storage);

						if(msg1) {
							msg1 = false;
							jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(jQuery.sap.resources({
									url: "i18n/i18n.properties"
									}).getText("SAVE_SUCC"), {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: this.getView().getModel("i18n").getResourceBundle().getText("WELCOME_TITLE"),
								actions: sap.m.MessageBox.Action.OK,
								onClose: null,
								//styleClass: ""                        
							});
						}
					}				
				}
			}
		},

		clearNCTOnPress: function(oEvent) {
			this.getView().byId("polist").removeSelections();
		},
		
		onSelectionChanged: function(e) {
			this.oVBI = this.getView().byId("vbi");
			var oModel = this.getView().getModel();
			var spotsc = oModel.getData().modelData[0].SpotsC;
			var lons = [];
			var lats = [];
			for (var nJ = 0; nJ < spotsc.length; ++nJ) {
				if (spotsc[nJ].select) {
					var pos = spotsc[nJ].pos.split(";");
					lons.push(pos[0]);
					lats.push(pos[1]);
				}
			}
			if (lons.length && lats.length) {
				if (lons.length == 1 && lats.length == 1) {
					this.oVBI.zoomToGeoPosition(lons, lats, 5);
				} else {
					this.oVBI.zoomToGeoPosition(lons, lats);
				}
			}
		},

		SearchLocation: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;

			var filters = new Array();
            var filter1 = new sap.ui.model.Filter("tooltip", sap.ui.model.FilterOperator.Contains, searchValue);

 		    var oCombinedOr = new sap.ui.model.Filter([filter1]);
			filters.push(oCombinedOr);

            this.oList = this.getView().byId("vbitable");
            this.oList.getBinding("items").filter(filters);
        },
        
        onSelectChanged: function(oEvent) {
            var key = oEvent.getParameters().key;

			if(key == '1') { //Map tab				
				var oModel = this.getView().getModel();
				var spots = oModel.getData().modelData[0].Spots;
				if(spots.length == 0) {					
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_REC"));
				}
            } 
        }
    });
});
