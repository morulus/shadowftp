var Client = require('ftp');
var fs = require('fs');

module.exports = function() {
	// Get taskname
	var usertaskname = process.argv[2];
	// Get pack info
	var cwd = process.cwd();
	// Read config
	var pack = JSON.parse(fs.readFileSync(cwd+'/.shadowftprc', 'utf8'));
	if (pack) {

		var localPrefix = pack.localDir;
		var remotePrefix = pack.remoteDir;

		new (function() {
			var c = new Client();
			c.connect({
				host: pack.host,
				user: pack.user,
				password: pack.password
			});
			this.processes = 0;
			this.complited = function() {
				this.processes--;
				if (this.processes===0)
					this.completed();
			}
			this.completed  = function() {
				console.log('Complete'.green);
				c.end();
				process.exit(0);
			}

			var that = this;
			c.on('ready', function() {
				if ("object"!==typeof pack.tasks) {
					console.log('Pack '+taskpack+' has no tasks');
					return false;
				}
				
				for (var taskname in pack.tasks) {
					if (!usertaskname || usertaskname==='*' || taskname===usertaskname) {
						that.processes += pack.tasks[taskname].length;
						for (var prop in pack.tasks[taskname]) {
							if (pack.tasks[taskname].hasOwnProperty(prop)) {
								;(function(task) {

									//c.delete(remotePrefix+task[1], function() {
										c.put(localPrefix+task[0], remotePrefix+task[1], function(err) {

											if (err) {
												throw err;
									      		c.end();
									      	}
									      	else {
									      		console.log('overwrited'.green, localPrefix+task[0], '>>', remotePrefix+task[1]);
									      		that.complited();
									      	}
									    	
										});	
									//});
								})(pack.tasks[taskname][prop]);
								
							};
						};		
					};
				};
			});
		})();
		
	    
	} else {
		console.error('.shadowftprc not exists'.red);
	}
}