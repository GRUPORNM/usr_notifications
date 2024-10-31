sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, formatter) {
        "use strict";

        return BaseController.extend("usrnotifications.controller.Main", {
            formatter: formatter,
            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: false,
                    delay: 0
                });
                sessionStorage.setItem("goToLaunchpad", "X");
                this.setModel(oViewModel, "Main");

                this.getRouter().attachRouteMatched(this.getUserAuthentication, this);
            },

            onAfterRendering: function () {
                sessionStorage.setItem("goToLaunchpad", "X");
                var oSplitApp = this.byId("showMaster");
                oSplitApp.showMaster();

                if (sessionStorage.getItem("selectedTheme").indexOf("dark") !== -1) {
                    jQuery(".sapUiBlockLayer, .sapUiLocalBusyIndicator").css("background-color", "rgba(28,34,40,0.99)");
                } else {
                    jQuery(".sapUiBlockLayer, .sapUiLocalBusyIndicator").css("background-color", "rgba(255, 255, 255, 0.99)");
                }
            },


        });
    });
