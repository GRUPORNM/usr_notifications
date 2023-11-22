sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (Controller, History, formatter) {
    "use strict";

    var TQAModel;

    return Controller.extend("usrnotifications.controller.BaseController", {

        formatter: formatter,

        getModelTQA: function () {
            return TQAModel;
        },

        setModelTQA: function (token) {
            // ... (seu código anterior)

            var userLanguage = sessionStorage.getItem("oLangu");
            if (!userLanguage) {
                userLanguage = "EN"; // Neste caso, estou definindo a língua diretamente para "FR" como no seu exemplo
            }
            var serviceUrlWithLanguage = this.getModel().sServiceUrl + (this.getModel().sServiceUrl.includes("?") ? "&" : "?") + "sap-language=" + userLanguage;

            TQAModel = new sap.ui.model.odata.v2.ODataModel({
                serviceUrl: serviceUrlWithLanguage,
                annotationURI: "/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName='%2FTQA%2FOD_USR_NOTIFICATIO_ANNO_MDL',Version='0001')/$value/",
                headers: {
                    "authorization": token,
                    "applicationName": "USR_NOTIF"
                }
            });
            //Variants
            var vModel = new sap.ui.model.odata.v2.ODataModel({
                serviceUrl: "/sap/opu/odata/TQA/OD_VARIANTS_MANAGEMENT_SRV",
                headers: {
                    "authorization": token,
                    "applicationName": "USR_NOTIF"
                }
            });
            this.setModel(vModel, "vModel");
            this.setModel(TQAModel);
        },

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onNavBack: function () {
            sessionStorage.setItem("goToLaunchpad", "X");
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                history.go(-1);
            } else {
                this.getRouter().navTo("TargetMain", {}, true); 1
            }
        },

        getUserAuthentication: function (type) {

            var that = this;
            var urlParams = new URLSearchParams(window.location.search);
            var token = urlParams.get('token');

            if (token != null) {
                var headers = new Headers();
                headers.append("X-authorization", token);

                var requestOptions = {
                    method: 'GET',
                    headers: headers,
                    redirect: 'follow'
                };

                fetch("/sap/opu/odata/TQA/AUTHENTICATOR_SRV/USER_AUTHENTICATION", requestOptions)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Ocorreu um erro ao ler a entidade.");
                        }
                        return response.text();
                    })
                    .then(function (xml) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(xml, "text/xml");

                        // Na vegar até o elemento <d:SuccessResponse>
                        var successResponseElement = xmlDoc.getElementsByTagName("d:SuccessResponse")[0];

                        // Obter o valor do elemento
                        var response = successResponseElement.textContent;

                        if (response != 'X') {
                            that.getRouter().navTo("NotFound");
                        }
                        else {
                            that.getModel("appView").setProperty("/token", token);
                        }
                    })
                    .catch(function (error) {
                        // Ocorreu um erro ao ler a entidade
                        console.error(error);
                    });
            } else {
                that.getRouter().navTo("NotFound");
                return;
            }
        }
    });

});