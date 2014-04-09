document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var that = this,
	App = new downloadApp(),
	fileName = "FR6XFd22123",
    //uri = encodeURI("http://192.168.1.7/xampp/downloads/phonegap-book.pdf")
    //uri = encodeURI("https://s3.amazonaws.com/Liferay-S3-File-Storage/oikos/html5_architecture.pdf"),
    uri = "https://poc-oikos-download-2014-04-08.s3-us-west-2.amazonaws.com/id_device/livro_protegido_id?Expires=1397013650&AWSAccessKeyId=ASIAI36QSSGJNXLAGUAA&x-amz-security-token=AQoDYXdzELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEa8AHjG7m%2FNOk9JyC5qpNkNXKqOcqvtDv0gajNTsWyZhGF7HKPIwTfp3LTD3j%2BtbZr9lJRpvvwhy%2BkYl2v%2Bl1QiFIwImKjsRzicwDgrWM9CO9GBS4N4VaLxgck7ngojBvYyeRg4qThbTxdy4zA3YOcMB4E2Vvm9APC%2BKBHGe5%2BlP1V8PNcagnrQL0eH%2F%2FaGjpZvw4zvkyTKmmPUeJ35uf%2FFCuDXOJPEOLfNF03cZ2W4IpaERtJcn4N1QDygf9y4%2FjaPUDqtZepDWZjdqA3v7V6cLfh9tF3zRedVxiAJVDieZOTUr2QqNbaZu0Kdv7H0OenowMg%2F9ySmgU%3D&Signature=7y%2F2Zn1WDGT8GIuAay0uoW9YNhM%3D";    
	folderName = "test";
    
	navigator.splashscreen.hide();
	App.run(uri, fileName, folderName);
}

function openPDF(){
    console.log("open PDF...");
}

var downloadApp = function() {
}

downloadApp.prototype = {
	run: function(uri, fileName, folderName) {
		var that = this,
		filePath = "";
        
		document.getElementById("download").addEventListener("click", function() {
            //alert("download");
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
                            //alert("folder.fullPath: " + folder.fullPath);                            
							filePath = folder.fullPath + "\/" + fileName;
							that.transferFile(uri, filePath, fileSystem);
						}, function() {
							//alert("Erro ao obter pasta para salvar arquivo");
						});
					}
					else {
						filePath = fileSystem.root.fullPath + "\/" + fileName;
                        //alert(filePath);
						that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("Erro ao obter fileSystem");
				}
				);
		});
        
	},
    

    
	getFilesystem : function (success, fail) {
        //check whether we're in Simulator
		if (device.uuid == "e0101010d38bde8e6740011221af335301010333" || device.uuid == "e0908060g38bde8e6740011221af335301010333") {
			console.log("Não é suportado no simulador.");
		}
		else {
			window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
		}
	},

	getFolder: function (fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
        //alert("folderName: " + folderName);
        //alert("fileSystem: " + fileSystem.name)
	},
    
    getFile: function (fileSystem, success, fail) {
        fileSystem.root.getFile(
            fileName,
            null,
            function (fileEntry) {
                that.removeFile(fileEntry);                            
            },
            function (error) {
                console.log("Erro, não foi possivel encontrar o arquivo: " + error.message);                
            }
        );    
    },
    
    removeFile: function (fileEntry, success, fail) {
        fileEntry.remove(
            function (entry) {
                console.log("Arquivo removido com sucesso!!!");                
            },
            function (error) {
                console.log("erro ao remover arquivo: " + error.message);                                  
            }
        );        
    },

	transferFile: function (uri, filePath, fileSystem) {
		var transfer = new FileTransfer();       
        //alert("uri: " + uri);
        alert("filePath: " + filePath);
        //for(var x = 0; x < 5; x++){           
    		transfer.download(
    			uri,
    			filePath,
    			function(entry) {				
                    //alert("sucess: " + entry.fullPath);
                    //that.getFileSystem(fileSystem) ;                
    				document.getElementById("result").innerHTML = "Arquivo salvo em: " + entry.fullPath;
                    window.fullpath = entry.fullPath;
    			},
    			function(error) {
                    document.getElementById("result").innerHTML = "An error has occurred: Code = " + error.code;
    				//alert("download error source " + error.source);
    				//alert("download error target " + error.target);
    				//alert("upload error code" + error.code);
    			}
    		);
		//}            
	}
}

function openPdf(){
    console.log("inicio openPdf...");

    window.plugins.CDVPDFViewer.showPDF(window.fullpath, 'knl@123');
}

function openPdf2(){
    var ref = window.open("file:///var/mobile/Applications/A9B49266-1E00-480A-A7E7-D40CE502B921/Documents/phonegap-book.pdf");
    ref.show();    
}