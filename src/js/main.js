(function(){
    var dropbox;
    var fileMetaData;

    dropbox = document.getElementById("dragOnMe");
    console.log(dropbox)
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    function dragenter(e){
        e.stopPropagation()
        e.preventDefault()
        dropbox.style.backgroundColor = "rgb(19, 164, 208)";
    }
    function dragover(e){
        e.stopPropagation()
        e.preventDefault()
    }

    function drop(e){
        e.stopPropagation()
        e.preventDefault()

        var dataTransfer = e.dataTransfer;
        var files = dataTransfer.files;
        dropbox.style.backgroundColor = "#fff";
        handleUpload(files)
    }
    function handleUpload(files){
        var ourFile = files[0]

        var fileMeta = {
            name : ourFile.name,
            size : ourFile.size,
            type : ourFile.type
        }

        fileMetaData = fileMeta;

        var reader = new FileReader()
        reader.onload = function(file){
            //this is the string from the csv
            var binaryString = file.target.result;
            console.log(file.target.result)
            dropbox.parseCSV(binaryString)
        }

        reader.error = function () {
            console.log("Something went wrong")
        }

        reader.readAsBinaryString(files[0])

    }

    dropbox.parseCSV = function(binary){
        dropbox.showMetaData().clean();
        dropbox.parseCSVError().clean()
        //number of rows
        var collection = binary.split('\n');
        var entries = collection.length;
        fileMetaData['rows'] = entries;
        var valid = false;

        //deliminator
        var firstRow = collection[0];
        var secondRow = collection[1];

        var reg = /(,)/;
        var deliminator = firstRow.match(reg)
        //number of deliminators should be equal per row
        if(deliminator == null){
             return dropbox.parseCSVError()
        }
        //columns
        var columns = firstRow.split(',').length
        fileMetaData['columns'] = columns;

        var y =  entries - 1;
        var z = columns;

        for(var x = y; x >= 0; x--){
            //columns should be equal
            console.log(collection[x])
            var d = collection[x].split(',').length
            if (d !== z){
                return dropbox.parseCSVError("d").show()
            }
        }

        dropbox.showMetaData().show()
        var uploadButton = document.getElementById("uploadButton")
        uploadButton.style.display = "block";


    }


    dropbox.showMetaData = function(){
        var metabox = document.getElementById("fileData");
        return {
            show : function(){
                var mtd = fileMetaData;

                var metaDetails = "<p>File Name: " + mtd.name + "</p>" +
                    "<p>File Size: " + mtd.size + "KB</p>" +
                    "<p>File Type: " + mtd.type + "</p>" +
                    "<p>Number of payees : " + mtd.rows + "</p>"
                metabox.innerHTML = metaDetails
            },
            clean : function(){
                metabox.innerHTML = "";
            }
        }

    }

    dropbox.parseCSVError = function(){

        var uploadButton = document.getElementById("uploadButton")
        var fileError = document.getElementById("fileError")

        return {
            show : function(){
                uploadButton.style.display = "none";
                var errorText = "<h4>ERROR</h4>"+
                    "<p>Your file has errors in it</p>"
                fileError.innerHTML = errorText;
            },
            clean : function(){
                fileError.innerHTML = "";
            }
        }

    }


}());