"use strict";

var q = require("q");
var fs = require("fs");

module.exports = {
	write : function(data) {
		return process.stdout.write(data);
	},
	writeLine : function(data) {
		return process.stdout.write(data + "\n");
	},
	writeError : function(type, file, line, message) {
		this.writeLine(type + " error: [" + file + ":" + line + "] " + message);
	},
	extractScripts : function(src) {
		var lines = [], isInScript = false;
		src.replace(/\r/g, "").split("\n").forEach(function(l) {
			// we're at the end of the script tag
			if (l.indexOf("</script") > -1) {
				lines[lines.length] = "";
				isInScript = false;
				return;
			}
			if (isInScript) {
				lines[lines.length] = l;
			} else {
				lines[lines.length] = "";
			}
			if (l.indexOf("<script") > -1 && (l.indexOf("text/ng-template") === -1 && l.indexOf("text/html") === -1)) {
				isInScript = true;
			}
		});
		return lines.join("\n").replace(/\{\$(\w+\.)*\w+\}/g, "{}");
	},
	read : function() {
		var defer = q.defer();
		// filename, src
		defer.resolve({
			filename : process.argv[2],
			src : fs.readFileSync(process.argv[3], {
				encoding : "utf-8"
			})
		});
		return defer.promise;
	},
	done : function(code) {
		setTimeout(function() {
			process.exit(code || 0);
		}, 4);
	}
};