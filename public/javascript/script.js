/*jslint devel: true, debug: true, browser: true, sloppy: true */
/*global angular, Dropbox */

//https://github.com/heelhook/chardin.js

var UOSModelBuilder = angular.module("UOSModelBuilder", [], function UOSModelBuilderInit() {
    console.log("Initialising UOS Model Builder App.");
    
    //Encoded dropbox Key: nIUyFyNYXxA=|qdbN1ZZ5vovxz7pNkooONZNrcIDqNTL4zpwny2KAVg==
    var baseDir = "/Units Of Sound/Development/Models/";
    var client = new Dropbox.Client({
        key: "nIUyFyNYXxA=|qdbN1ZZ5vovxz7pNkooONZNrcIDqNTL4zpwny2KAVg==",
        sandbox: false
    });
    
    client.authDriver(new Dropbox.Drivers.Redirect());
    client.authenticate(function (error, client) {
        if (error) {
            alert("Dropbox connection did not work \n\n You need to connect dropbox to use this app.");
            return;
        }
        
    });
    
    client.mkdir(baseDir, function createDirIfNeeded(err, res) {
        if (err) {
            if (err.status === 403) {
                //dont care about this err
                return;
            }
            alert("Problem with connecting to dropbox.");
        }
    });
    
    UOSModelBuilder.saveModel =  function saveModelToDropbox(model) {
        var fileName = "p" + model.page + "ReadinBlock.json";
        client.writeFile(baseDir + fileName, JSON.stringify(model), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };
});


function NavigationController($scope) {
    $scope.setPage = function (newPage) {
        console.log("Change page to" + newPage);
    };
}

/* Word class def */
function Word() {
    return {
        text: "",
        sound: "",
        clip: "",
        sylabuls: []
    };
}

/* Block class def */
function Block() {
    return {
        words: [new Word(), new Word(), new Word(), new Word(), new Word(), new Word()]
    };
}

/* controller for the activity type ReadinBlock */
function ReadingBlockSetController($scope) {
    $scope.addBlock = function addBlockToModel() {
        $scope.setModel.blocks.push(new Block());
    };
  
    $scope.removeBlock = function removeBlockFromModel() {
        $scope.setModel.blocks.pop();
    };

    $scope.setModel = {
        page: "",
        action: "",
        blocks: [new Block(), new Block()]
    };
    
    $scope.saveModel = function () {
        UOSModelBuilder.save($scope.setModel);
    };
}

function BlockController($scope) {
    $scope.addWord = function addWordToBlock() {
        this.$parent.block.words.push(new Word());
    };
    
    $scope.removeWord = function removeWordFromBlock() {
        this.$parent.block.words.pop();
    };
}