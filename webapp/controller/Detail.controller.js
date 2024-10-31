sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("usrnotifications.controller.Detail", {
		formatter: formatter,

		onInit: function () {
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "Detail");

			var oModel = new JSONModel({
				sPath: ""
			});
			this.getView().setModel(oModel, "mainDetail");

			var oRouter = this.getRouter();
			oRouter.attachRouteMatched(this.getUserAuthentication, this);
		},

		onReport: function (text) {
			sap.m.MessageBox.show("Report sent!", {
				title: "Success",
				icon: sap.m.MessageBox.Icon.SUCCESS,
				onClose: null,
				styleClass: '',
				initialFocus: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		},

		onReportProblem: function () {
			var that = this;

			if (!this._oDialog) {
				var oLabel = new sap.m.Label({
					text: this.getView().getModel("i18n").getResourceBundle().getText("ReportProblemLabel")
				});

				var oTextArea = new sap.m.TextArea({
					placeholder: "...",
					width: "100%",
					rows: 5
				});

				var oSendButton = new sap.m.Button({
					text: this.getView().getModel("i18n").getResourceBundle().getText("Send"),
					press: function () {
						that.onReport(oTextArea.getValue());
						that._oDialog.close();
					}
				});

				var oCancelButton = new sap.m.Button({
					text: this.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
					press: function () {
						that._oDialog.close();
					}
				});

				var oVBox = new sap.m.VBox({
					items: [oLabel, oTextArea],
					fitContainer: true,
					layoutData: new sap.m.FlexItemData({ growFactor: 1, baseSize: 'auto' })
				}).addStyleClass("sapUiTinyMargin");

				this._oDialog = new sap.m.Dialog({
					title: this.getView().getModel("i18n").getResourceBundle().getText("ReportProblem"),
					contentWidth: "500px",
					contentHeight: "auto",
					content: [oVBox],
					buttons: [oSendButton, oCancelButton],
					afterClose: function () {
						that._oDialog.destroy();
						that._oDialog = null;
					}
				});
			}

			this._oDialog.open();
		},

		onDeleteNotif: function () {
			var that = this,
				oModel = this.getModel(),
				sPath = this.getModel("mainDetail").getProperty("/sPath");

			oModel.remove(sPath, {
				success: function (oData) {

				},
				error: function (oError) {
					var sError = JSON.parse(oError.responseText).error.message.value;
					sap.m.MessageBox.alert(sError, {
						icon: "ERROR",
						onClose: null,
						styleClass: '',
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}
			});
		},

		onMarkRead: function () {
			var that = this,
				oDetailModel = this.getModel("Detail"),
				sPath = this.getModel("mainDetail").getProperty("/sPath"),
				oReaded = oDetailModel.getProperty("/readed"),
				oModel = this.getModel(),
				oEntry = {};

			oEntry.readed = oReaded ? false : true;
			oDetailModel.setProperty("/readed", oEntry.readed);

			oModel.update(sPath, oEntry, {
				success: function (oResponse) {
					var oResourceBundle = that.getView().getModel("i18n").getResourceBundle(),
						sMarkReadText = oResourceBundle.getText("MarkRead"),
						sMarkUnreadText = oResourceBundle.getText("markUnread"),
						oButton = that.byId("btMarkRead");

					if (that.getModel("Detail").getProperty("/readed")) {
						oButton.setText(sMarkUnreadText);
					} else {
						oButton.setText(sMarkReadText);
					}

				},
				error: function (oError) {
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

		onNavToApplication: function () {
			var oModel = this.getModel("Detail"),
				sPath = oModel.getProperty("/target_path"),
				sAppId = oModel.getProperty("/target_app"),
				message = {
					action: "navTo",

					bHistory: true,

					pathToOpen: sPath,

					appIdToBack: '026',

					appIdToOpen: sAppId,

					create: false
				}
			window.parent.postMessage(message, "*");
		},

		bindElementToView: function (sPath) {
			this._bindView(sPath);
		},

		_bindView: function (sObjectPath) {
			var that = this,
				thatObjectPath = sObjectPath;

			this.getModel("mainDetail").setProperty("/sPath", thatObjectPath);

			var oViewModel = this.getModel("Detail"),
				oModel = this.getModel();

			oModel.read(sObjectPath, {
				success: function (oData) {
					oViewModel.setData(oData);

					that.getView().setModel(oViewModel, "Detail");

					var oResourceBundle = that.getView().getModel("i18n").getResourceBundle(),
						sMarkReadText = oResourceBundle.getText("MarkRead"),
						sMarkUnreadText = oResourceBundle.getText("markUnread"),
						oButton = that.byId("btMarkRead");

					if (that.getModel("Detail").getProperty("/readed")) {
						oButton.setText(sMarkUnreadText);
					} else {
						oButton.setText(sMarkReadText);
					}

					that.byId("mainPage").setProperty("visible", true);
				},
				error: function (oError) {
					console.log(oError);
				},
			});
		}
	});
});
