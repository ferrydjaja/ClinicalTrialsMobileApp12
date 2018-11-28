/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library"],function(l){"use strict";var T=l.ToolbarDesign;var P={};P.render=function(r,c){this.startPanel(r,c);this.renderHeader(r,c);this.renderContent(r,c);this.endPanel(r);};P.startPanel=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapMPanel");r.writeClasses();r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeStyles();r.writeAccessibilityState(c,{role:c.getAccessibleRole().toLowerCase(),labelledby:c._getLabellingElementId()});r.write(">");};P.renderHeader=function(r,c){var i=c.getExpandable(),I=c.getExpanded(),h=c.getHeaderToolbar(),H;if(i){r.write("<header");if(h){H="sapMPanelWrappingDivTb";}else{H="sapMPanelWrappingDiv";}r.addClass(H);if(I){r.addClass(H+"Expanded");}r.writeClasses();r.write(">");var o=c._getIcon();if(I){o.addStyleClass("sapMPanelExpandableIconExpanded");}else{o.removeStyleClass("sapMPanelExpandableIconExpanded");}r.renderControl(o);}var s=c.getHeaderText();if(h){h.setDesign(T.Transparent,true);h.addStyleClass("sapMPanelHeaderTB");r.renderControl(h);}else if(s||i){r.write("<h1");r.addClass("sapMPanelHdr");r.writeClasses();r.writeAttribute("id",c.getId()+"-header");r.write(">");r.writeEscaped(s);r.write("</h1>");}if(i){r.write("</header>");}var a=c.getInfoToolbar();if(a){if(i){a.addStyleClass("sapMPanelExpandablePart");}a.setDesign(T.Info,true);a.addStyleClass("sapMPanelInfoTB");r.renderControl(a);}};P.renderContent=function(r,c){this.startContent(r,c);this.renderChildren(r,c.getContent());this.endContent(r);};P.startContent=function(r,c){r.write("<div");r.addClass("sapMPanelContent");r.addClass("sapMPanelBG"+c.getBackgroundDesign());if(c.getExpandable()){r.addClass("sapMPanelExpandablePart");}r.writeClasses();if(sap.ui.Device.browser.firefox){r.writeAttribute('tabindex','-1');}r.write(">");};P.renderChildren=function(r,c){c.forEach(r.renderControl);};P.endContent=function(r){r.write("</div>");};P.endPanel=function(r){r.write("</div>");};return P;},true);
