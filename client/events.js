Template.S3.events({
	'change input[type=file]': function (e,helper) {
		var context = null, //this;
        callback = null,
        sessionKey = null;

		if(helper.data && _.has(helper.data,"callback")){
			callback = helper.data.callback;
		} else {
			console.log("S3 Error: Helper Block needs a callback function to run");
			return
		}

    if(helper.data && helper.data.sessionKey){
      sessionKey = helper.data.sessionKey;
    }

    
    if( sessionKey ){
      Session.set(sessionKey + ":upload-progress", "started");
    }

		var files = e.currentTarget.files;
		_.each(files,function(file){
			var reader = new FileReader;
			var fileData = {
				name:file.name,
				size:file.size,
				type:file.type
			};

			reader.onload = function () {
				fileData.data = new Uint8Array(reader.result);

        Session.set(sessionKey + ":upload-progress", "uploading");

				Meteor.call("S3upload",fileData,context,callback, function(err, url){
          if( sessionKey ){
            Session.set(sessionKey + ":upload-progress", "done");
            Session.set(sessionKey + ":url", url);
          }
        });
			};

			reader.readAsArrayBuffer(file);

		});
	}
});
