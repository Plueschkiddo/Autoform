cordova.define("cordova-plugin-pdfcreate.PDFCreatePlugin", function(require, exports, module) { window.makepdf = function() {
	var options = {};
	options.op1 = "some unused options";
	options.op2 = "more unused options";
	console.log("I really try to do something");
    cordova.exec(function(){
		console.log("Success!");
	}, function(err) {
		console.log(err);
    }, "PDFCreate", "createpdf", [options]);
};
});
