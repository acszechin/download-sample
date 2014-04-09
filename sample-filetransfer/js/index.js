document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var that = this,
	App = new downloadApp(),
	fileName = "phonegap-book.pdf",
    uri = encodeURI("http://192.168.1.7/xampp/downloads/phonegap-book.pdf")
    //uri = encodeURI("https://s3.amazonaws.com/Liferay-S3-File-Storage/oikos/html5_architecture.pdf"),
    //uri = "https://poc-oikos-download-2014-04-08.s3-us-west-2.amazonaws.com/arquivoGrandePocS3?Expires=1397002958&AWSAccessKeyId=ASIAJZ4FGH3BU4VGY4SQ&x-amz-security-token=AQoDYXdzELH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEa8AF19nGE7Izx7C1EVDuHUzMXxi9dT3IZC3Z6Gu6xd1aik8sY2fK5Q0R3I0d4HtKkvVc0lYUnAM8aI2cqyf1ehLA2g2BtJi80z5Wqx9ma1tOke2ZYhxcTW%2Fplv7KCUmbgk9dOcY1tsrOBDzIz7cjVXmKLKInSV%2BtH2VCv9AIMH89YvoSYQ%2B%2FC7Zip3%2FQW5xO97YkPvg6Ii1kLd9Zxjq9y3H1cVG%2FsMIzDa5AOJA3jqYiQLiQAhjHoNRou%2FVmaS95dmZe4wjH7Of4%2BzE2HWGBKBbVNyi5XoT2NX7C0qSR%2Fza0%2F3wfRSc8myXPmmYbsnFdpC6sgvomSmgU%3D&Signature=pm5iZ%2BLLvntJ3RZ5A%2FVhBG0Wz%2FE%3D";    
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
            alert("download");
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
                            alert("folder.fullPath: " + folder.fullPath);                            
							filePath = folder.fullPath + "\/" + fileName;
							that.transferFile(uri, filePath, fileSystem);
						}, function() {
							//alert("Erro ao obter pasta para salvar arquivo");
						});
					}
					else {
						filePath = fileSystem.root.fullPath + "\/" + fileName;
                        alert(filePath);
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
        alert("folderName: " + folderName);
        alert("fileSystem: " + fileSystem.name)
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
                    alert("sucess: " + entry.fullPath);
                    that.getFileSystem(fileSystem);                
    				document.getElementById("result").innerHTML = "Arquivo salvo em: " + entry.fullPath;
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

    window.plugins.CDVPDFViewer.showPDF('www/opcao-de-compra ');
}

function openPdf2(){
    var ref = window.open("file:///var/mobile/Applications/A9B49266-1E00-480A-A7E7-D40CE502B921/Documents/phonegap-book.pdf");
    ref.show();    
}