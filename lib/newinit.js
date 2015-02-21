var prompt = require('prompt');
var fs = require('fs');
var extend = require('extend');

require('colors');
module.exports = {
	init: function(dir) {
		return new (function(dir) {
			this.dir = dir;

			var that = this;
			prompt.start();
			prompt.get(
				{
					properties: {
						host: {
							default: "localhost"
						},
						user: {
							default: "@anonymous"
						},
						password: {
							default: ""
						},
						localDir: {
							default: ""
						},
						remoteDir: {
							default: ""
						}
					}
				},
				function(err, results) {
					var tasks = extend({
						tasks: {
							main: []
						}
					},results);
					
					fs.writeFile(new String(that.dir+'/.shadowftprc').split('\\').join('/'), JSON.stringify(tasks, null, 4), 'utf-8', function(err) {
						if (err) { return console.log(err); }
						else {
							console.log('.shadowftprc just created;'.green);
							process.exit(0);
						}
  						
					});
					
					
				}
			)
		})(dir);
	}
}