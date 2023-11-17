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

                this.setModel(oViewModel, "Main");

                this.getRouter().attachRouteMatched(this.getUserAuthentication, this);
            },

            onAfterRendering: function () {
                var oSplitApp = this.byId("showMaster");
                oSplitApp.showMaster();
            },


        });
    });
