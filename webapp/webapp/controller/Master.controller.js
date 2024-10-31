sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("usrnotifications.controller.Master", {
		onInit: function () {
			// Create and set the JSON model
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "Master");

			// Your onInit code here
		},


		onMarkAllReadPress: function(){
			var that = this;
			var oModel = this.getModel();
			oModel.read("/xTQAxUSR_NOTIF_DD", {
				headers: {
					"makallasread": "true"
				},
				success: function(oData){
					that.getModel().refresh(true);
				},
				error: function(oError){
					var sError = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.alert(sError, {
						icon: "ERROR",
						onClose: null,
						styleClass: '',
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}
			})

		},

		onListItemPress: function(oEvent) {
			var oSplitApp = this.getView().getParent().getParent();
			var oDetailView = oSplitApp.getDetailPages()[0];
			var oDetailController = oDetailView.getController();
			var sPath = oEvent.getSource().getBindingContext().getPath();
			oDetailController.bindElementToView(sPath);
		},

		onClearFiltersPress: function () {
			var oList = this.byId("NotificationList");
			var oBinding = oList.getBinding("items");
			oBinding.filter([]); // Removendo todos os filtros
			this.byId("filterComboBox").setSelectedKey(null); // Resetando o ComboBox
		},

		onFilterButtonPress: function () {
			var oList = this.byId("NotificationList");
			var oBinding = oList.getBinding("items");
			var sSelectedKey = this.byId("filterComboBox").getSelectedKey();
			var aFilters = [];

			// Definindo o critério de filtragem com base na chave selecionada.
			if (sSelectedKey) {
				aFilters.push(new sap.ui.model.Filter("priority", sap.ui.model.FilterOperator.EQ, sSelectedKey));
			}
			oBinding.filter(aFilters);
		},

		getGroupHeader: function (oGroup) {
			var oGroupTitle;

			if (oGroup.key)
				oGroupTitle = this.getView().getModel("i18n").getResourceBundle().getText("Readed");
			else
				oGroupTitle = this.getView().getModel("i18n").getResourceBundle().getText("New");

			return new sap.m.GroupHeaderListItem({
				title: oGroupTitle,
				upperCase: true
			});
		},

		_getPriority: function (value) {
			switch (value) {
				case "1":
					return "High";
					break;
				case "2":
					return "Medium";
					break;
				case "3":
					return "Low";
					break;
				default:
					break;
			}
		},

		// Other controller methods here
	});
});
