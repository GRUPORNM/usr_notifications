sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	/**
	 * @class
	 * @author João Mota @ 
	 * @since  May 2023
	 * @name   initial.sapui5.formatter
	 */
	var Formatter = {

		/**
		 * Date formatter
		 * @param {Date} oValue - The date value to be formatted
		 * @public
		 */
		onReaded: function (oValue) {
			if (!oValue) {
				return "sap-icon://show"
			}
			else {
				return "sap-icon://hide"
			}
		},


		onReadedState: function (oValue) {
			if (!oValue) {
				return "Indication06"
			}
			else {
				return "None"
			}
		},

		onPriority: function (oValue) {
			switch (oValue) {
				case "1":
					return this.getResourceBundle().getText("High");
					break;
				case "2":
					return this.getResourceBundle().getText("Medium");
					break;
				case "3":
					return this.getResourceBundle().getText("Low");
					break;
				default:
					break;
			}
		},

		onPriorityState: function (oValue) {
			switch (oValue) {
				case "1":
					return "Indication02";
					break;
				case "2":
					return "Indication03";
					break;
				case "3":
					return "Indication05";
					break;
				default:
					break;
			}
		},


		formatDate: function (sDate) {
			if (sDate) {
				var oDate = new Date(sDate);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MMM dd, yyyy"
				});
				return oDateFormat.format(oDate);
			}
			return "";
		},

		onHours: function (oValue) {
			if (oValue) {
				var hours = Math.floor(oValue.ms / (60 * 60 * 1000));
				var mins = Math.floor((oValue.ms - (hours * 60 * 60 * 1000)) / (60 * 1000));
				var secs = Math.floor((oValue.ms - (hours * 60 * 60 * 1000) - (mins * 60 * 1000)) / 1000);

				var formattedTime = hours + ":" + (mins < 10 ? '0' + mins : mins) + ":" + (secs < 10 ? '0' + secs : secs);

				return formattedTime;
			}
			else
				return "";
		}

	};


	return Formatter;
});