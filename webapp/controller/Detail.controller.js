sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

	return Controller.extend("ClinicalTrials.ClinicalTrials.controller.Detail", {

		onInit: function () {
			var oView = this.getView();

			this.getView().addEventDelegate({
				onBeforeShow: function (evt) {

					var oModel = new sap.ui.model.json.JSONModel();
					//oModel.setData({});
					//oModel.refresh();
					//oView.setModel(oModel);

					oModel = sap.ui.getCore().getModel("DModel");
					console.log(oModel);
					//oModel.refresh();		

					var Circle = oModel.getData().modelData1[0].Circle;
					var OLoc = oModel.getData().modelData1[0].OLoc
					var Spots = oModel.getData().modelData1[0].Spots;
					var brief_summary = oModel.getData().modelData1[0].brief_summary;
					var centerposition = oModel.getData().modelData1[0].centerposition;
					var condition = oModel.getData().modelData1[0].condition;
					var condition_browse = oModel.getData().modelData1[0].condition_browse;
					var eligibility = oModel.getData().modelData1[0].eligibility;
					var exclusioncriteria = oModel.getData().modelData1[0].exclusioncriteria;
					var id_info = oModel.getData().modelData1[0].id_info;
					var inclusioncriteria = oModel.getData().modelData1[0].inclusioncriteria;
					var intervention = oModel.getData().modelData1[0].intervention;
					var location = oModel.getData().modelData1[0].location;
					var location_countries = oModel.getData().modelData1[0].location_countries;
					var official_title = oModel.getData().modelData1[0].official_title;
					var overall_contact = oModel.getData().modelData1[0].overall_contact;
					var overall_status = oModel.getData().modelData1[0].overall_status;
					var phase = oModel.getData().modelData1[0].phase;
					var sponsors = oModel.getData().modelData1[0].sponsors;
					var url = oModel.getData().modelData1[0].url;

					var SpotsAr = [];
					var OLocAr = [];
					var country = '';
					var state = '';
					var city = '';
					var zip = '';
					var name;
					var status;
					var key = '';
					var pos = '';
					var tooltip = '';
					var type = '';
					var spotsidx = 0;
					var filteredcountry = [];

					for (var n = 0, len = OLoc.length; n < len; n++) {

						if(oModel.getData().modelData1[0].OLoc[n].hasOwnProperty("facility")) {
							if(oModel.getData().modelData1[0].OLoc[n].facility.hasOwnProperty("address")) {

								if(typeof oModel.getData().modelData1[0].OLoc[n].facility.address.country == 'undefined' ||  oModel.getData().modelData1[0].OLoc[n].facility.address.country == '') 
									country = '';
								else
									country = oModel.getData().modelData1[0].OLoc[n].facility.address.country;

								if(typeof oModel.getData().modelData1[0].OLoc[n].facility.address.state == 'undefined' ||  oModel.getData().modelData1[0].OLoc[n].facility.address.state == '') 
									state = '';
								else
									state = oModel.getData().modelData1[0].OLoc[n].facility.address.state;

								if(typeof oModel.getData().modelData1[0].OLoc[n].facility.address.city == 'undefined' ||  oModel.getData().modelData1[0].OLoc[n].facility.address.city == '') 
									city = '';
								else
									city = oModel.getData().modelData1[0].OLoc[n].facility.address.city;

								if(typeof oModel.getData().modelData1[0].OLoc[n].facility.address.zip == 'undefined' ||  oModel.getData().modelData1[0].OLoc[n].facility.address.zip == '') 
									zip = '';
								else 
									zip = oModel.getData().modelData1[0].OLoc[n].facility.address.zip;

								var state = state + ' ' + city + ' ' + zip;
								state = state.trim();
							}

							if(oModel.getData().modelData1[0].OLoc[n].facility.hasOwnProperty("name")) 
								name = oModel.getData().modelData1[0].OLoc[n].facility.name;
							else 
								name = '';
						}

						if(oModel.getData().modelData1[0].OLoc[n].hasOwnProperty("status")) 
							status = oModel.getData().modelData1[0].OLoc[n].status;
						else 
							status = '';

						let found = Spots.findIndex(r => r.key === n);
						if(found != -1) {
							key = Spots[spotsidx].key;
							pos = Spots[spotsidx].pos;
							tooltip = Spots[spotsidx].tooltip;

							SpotsAr.push({
								key: key,
								pos: pos,
								tooltip: tooltip,
								type: 'Success',
								name: name,
								status: status,							
								country: country,
								address: state
							});			
							spotsidx++;
							
							filteredcountry.push(country);
						}

						OLocAr.push({
							name: name,
							status: status,							
							country: country,
							address: state
						});								
					}

					let jsonO = {
						"Circle": Circle,
						"OLoc": OLocAr,
						"Spots": SpotsAr,
						"brief_summary": brief_summary,
						"centerposition": centerposition,
						"condition": condition,
						"condition_browse": condition_browse,
						"eligibility": eligibility,
						"exclusioncriteria": exclusioncriteria,
						"id_info": id_info,
						"inclusioncriteria": inclusioncriteria,
						"intervention": intervention,
						"location": location,
						"location_countries": location_countries,
						"official_title": official_title,
						"overall_contact": overall_contact,
						"overall_status": overall_status,
						"phase": phase,
						"sponsors": sponsors,
						"url": url
					}

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setSizeLimit(99999);
					oModel.setData({
						modelData1: [jsonO]
					});

					console.log(oModel);
					//oView.byId("vbitable").setModel(oModel);
					//oView.byId("vbi").setModel(oModel);

					oView.setModel(oModel);

					var vGroup = function (oContext) {
						var name = oContext.getProperty("country");
						return {
							key: name,
							text: name
						};
					};

					var oSorter1 = new sap.ui.model.Sorter("tooltip", false);
					var oSorter = new sap.ui.model.Sorter("country", false, vGroup);
					var aSorters = [];
					aSorters.push(oSorter);
					aSorters.push(oSorter1);
					var oTable = oView.byId("vbitable");
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);

					//Map in Nearby Location tab
					oView.byId("vbi").setModel(oModel);
					oView.setModel(oModel);
					oView.bindElement("/modelData1/0");

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
					this.oVBI.setCenterPosition(oModel.oData.modelData1[0].centerposition);
					
					//To filter country with "Recruiting" status in "Recruiting Locations" Tab
					var filters = new Array();
					var Filter1 = [];
					for (var n = 0, len = filteredcountry.length; n < len; n++) {
						Filter1.push(new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.EQ, filteredcountry[n]));
					}					
					var oCombined1 = new sap.ui.model.Filter(Filter1);

					var Filter2 = [];
					Filter2.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, 'Recruiting'));
					var oCombined2 = new sap.ui.model.Filter(Filter2);

					filters.push(new sap.ui.model.Filter([oCombined1, oCombined2], true));
					this.oList = oView.byId("olocation");
					var len = this.oList.getBinding("items").filter(filters); 

					var olenm = new sap.ui.model.json.JSONModel();
                    olenm.setData({
						len: len
                    });
					sap.ui.getCore().setModel(olenm, "lenrecrloc");
				}
			});
		},

		SearchLocationA: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;

			var filters = new Array();
            var filter1 = new sap.ui.model.Filter("tooltip", sap.ui.model.FilterOperator.Contains, searchValue);
			var filter2 = new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter3 = new sap.ui.model.Filter("address", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter4 = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, searchValue);

 		    var oCombinedOr = new sap.ui.model.Filter([filter1, filter2, filter3, filter4]);
			filters.push(oCombinedOr);

            this.oList = this.getView().byId("vbitable");
            this.oList.getBinding("items").filter(filters);
        },

		SearchLocationB: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;
            var filters = new Array();
            var filter1 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter2 = new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter3 = new sap.ui.model.Filter("address", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter4 = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, searchValue);

            var oCombinedOr = new sap.ui.model.Filter([filter1, filter2, filter3, filter4]);
            filters.push(oCombinedOr);

            this.oList = this.getView().byId("olocation");
            this.oList.getBinding("items").filter(filters);
        },

		doNavBack: function () {
			jQuery.sap.history.back();
		},

		doNavHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);
		},

		onSelectionChanged: function (e) {
			this.oVBI = this.getView().byId("vbi");
			var oModel = this.getView().getModel();
			var spots = oModel.getData().modelData1[0].Spots;

			var lons = [];
			var lats = [];
			for (var nJ = 0; nJ < spots.length; ++nJ) {
				if (spots[nJ].select) {
					var pos = spots[nJ].pos.split(";");
					lons.push(pos[0]);
					lats.push(pos[1]);
				}
			}

			if (lons.length && lats.length) {
				if (lons.length == 1 && lats.length == 1) {
					this.oVBI.zoomToGeoPosition(lons, lats, 6);
				} else {
					this.oVBI.zoomToGeoPosition(lons, lats);
				}
			}
		},
		
		onSelectChanged: function(oEvent) {
            var key = oEvent.getParameters().key;
			var oModel = this.getView().getModel();

			if(key == '1') { //Nearby Location tab				
				var spots = oModel.getData().modelData1[0].Spots;
				if(spots.length == 0) {					
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_NEARBY_REC"));
				}
            } else if(key == '2') {//Recuriting Location tab				
				var lenrecrloc = sap.ui.getCore().getModel('lenrecrloc');
				console.log(lenrecrloc.oData.len.iLength);
				if(lenrecrloc.oData.len.iLength == 0) {					
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_REC_REC"));
				}
            };
        }
	});
});
