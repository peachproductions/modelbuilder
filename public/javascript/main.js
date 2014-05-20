/*jslint devel: true, debug: true, browser: true, sloppy: true */
/*global angular, Dropbox, ReadingBlockSetController, SentencePageController */

//https://github.com/heelhook/chardin.js

var UOSModelBuilder = angular.module("UOSModelBuilder", []);

UOSModelBuilder.service('Dropbox', function () {
    var client = {};
    client.isAuth = false;
    setTimeout(function() {
        client.isAuth = true;
    }, 2000);
    return  client;
});

UOSModelBuilder.controller('AppCtrl', function ($scope){
    //Encoded dropbox Key: nIUyFyNYXxA=|qdbN1ZZ5vovxz7pNkooONZNrcIDqNTL4zpwny2KAVg==
    $scope.baseDir = "/Units Of Sound/Development/ModelsUS/";
    $scope.client = new Dropbox.Client({key: "il8usrqw2s5xuo1"});

//    $scope.client.authDriver(new Dropbox.AuthDriver.Redirect({rememberUser: false}));
    $scope.client.authenticate(function (error, client) {
        if (error) {
            alert("Dropbox connection did not work \n\n You need to connect dropbox to use this app.");
            return;
        }
        $scope.client.mkdir($scope.baseDir, function createDirIfNeeded(err, res) {
            if (err) {
                if (err.status === 403) {
                    //dont care about this err
                    return;
                }
                alert("Problem with connecting to dropbox.");
            }
        });
    });

    $scope.pageModel = {};
});

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

function Sentence() {
    return {
        clip: "",
        text: "",
        interogationWords: []
    }
}

function Paragraph() {
    return {
        clip: "",
        text: "",
        interogationWords: []
    }
}

/* controller for the activity type ReadinBlock */
UOSModelBuilder.controller('ReadingBlockSetController', function ($scope) {

    $scope.addBlock = function addBlockToModel() {
        $scope.setModel.blocks.push(new Block());
    };

    $scope.removeBlock = function removeBlockFromModel() {
        $scope.setModel.blocks.pop();
    };

    $scope.setModel = {
        page: "",
        stage: "",
        filename: "",
        blocks: [new Block(), new Block()]
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('setModel.stage', function(newValue, oldValue) {
       $scope.setModel.filename = "stage" + newValue + "page" + $scope.setModel.page + "ReadingBlock.json";
    });

    $scope.$watch('setModel.page', function(newValue, oldValue) {
       $scope.setModel.filename = "stage" + $scope.setModel.stage + "page" + newValue + "ReadingBlock.json";
    });


    $scope.saveModel = function saveModelToDropbox() {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.setModel.filename, JSON.stringify($scope.setModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.setModel.filename, function (err, data) {
            if(err){ return; }
            $scope.setModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});

UOSModelBuilder.controller('BlockController', function ($scope) {
    $scope.addWord = function addWordToBlock() {
        this.$parent.block.words.push(new Word());
    };

    $scope.removeWord = function removeWordFromBlock() {
        this.$parent.block.words.pop();
    };
});

UOSModelBuilder.controller('SentencePageController', function($scope, $route, $routeParams, $log) {
    $log.log($routeParams);
    $scope.pageModel = {
        page: "",
        stage: "",
        filename: "",
        sentences: [new Sentence(), new Sentence(), new Sentence(), new Sentence()]
    };

    $scope.addSentence = function () {
        $scope.pageModel.sentences.push(new Sentence());
    };

    $scope.removeSentence = function () {
        $scope.pageModel.sentences.pop();
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('pageModel.stage', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + newValue + "page" + $scope.pageModel.page + "Sentence.json";
    });

    $scope.$watch('pageModel.page', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + $scope.pageModel.stage + "page" + newValue + "Sentence.json";
    });

    $scope.saveModel = function () {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.pageModel.filename, JSON.stringify($scope.pageModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.pageModel.filename, function (err, data) {
            if(err){ return; }
            $scope.pageModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});

UOSModelBuilder.controller('ParagraphPageController', function($scope, $route, $routeParams, $log) {
    $log.log($routeParams);
    $scope.pageModel = {
        page: "",
        stage: "",
        filename: "",
        paragraphs: [new Paragraph(), new Paragraph(), new Paragraph(), new Paragraph()]
    };

    $scope.addParagraph = function () {
        $scope.pageModel.paragraphs.push(new Paragraph());
    };

    $scope.removeParagraph = function () {
        $scope.pageModel.paragraphs.pop();
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('pageModel.stage', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + newValue + "page" + $scope.pageModel.page + "Paragraph.json";
    });

    $scope.$watch('pageModel.page', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + $scope.pageModel.stage + "page" + newValue + "Paragraph.json";
    });

    $scope.saveModel = function () {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.pageModel.filename, JSON.stringify($scope.pageModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.pageModel.filename, function (err, data) {
            if(err){ return; }
            $scope.pageModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});

UOSModelBuilder.controller('QAPageController', function($scope) {

    var QuestionAndAnswer = function () {
        return {
            questions:[{text:""},{text:""}],
            answers:[{text:""},{text:""}]
        }
    }

    $scope.pageModel = {
        page: "",
        stage: "",
        filename: "",
        questionAnswers: [new QuestionAndAnswer(), new QuestionAndAnswer(), new QuestionAndAnswer()]
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('pageModel.stage', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + newValue + "page" + $scope.pageModel.page + "QuestionAnswer.json";
    });

    $scope.$watch('pageModel.page', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + $scope.pageModel.stage + "page" + newValue + "QuestionAnswer.json";
    });

    $scope.addQA = function () {
        $scope.pageModel.questionAnswers.push(new QuestionAndAnswer());
    };

    $scope.removeQA = function () {
        $scope.pageModel.questionAnswers.pop();
    };

    $scope.saveModel = function () {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.pageModel.filename, JSON.stringify($scope.pageModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.pageModel.filename, function (err, data) {
            if(err){ return; }
            $scope.pageModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});


function CheckSoundWord() {
    return {
            text: "",
            clip: "",
            clue: ""
        };
}



UOSModelBuilder.controller('CheckSoundPageController', function ($scope) {

    function CheckSoundBlock() {
        return {
        words: [new CheckSoundWord(), new CheckSoundWord(), new CheckSoundWord(), new CheckSoundWord(), new CheckSoundWord(), new CheckSoundWord()]
        };
    }

    $scope.addBlock = function addBlockToModel() {
        $scope.pageModel.blocks.push(new CheckSoundBlock());
    };

    $scope.removeBlock = function removeBlockFromModel() {
        $scope.pageModel.blocks.pop();
    };

    $scope.pageModel = {
        page: "",
        stage: "",
        filename: "",
        blocks: [new CheckSoundBlock(), new CheckSoundBlock(), new CheckSoundBlock()]
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('pageModel.stage', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + newValue + "page" + $scope.pageModel.page + "CheckSounds.json";
    });

    $scope.$watch('pageModel.page', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + $scope.pageModel.stage + "page" + newValue + "CheckSounds.json";
    });


    $scope.saveModel = function saveModelToDropbox() {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.pageModel.filename, JSON.stringify($scope.pageModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.pageModel.filename, function (err, data) {
            if(err){ return; }
            $scope.pageModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});

UOSModelBuilder.controller('CheckSoundBlockController', function ($scope) {
    $scope.addWord = function addWordToBlock() {
        this.$parent.block.words.push(new CheckSoundWord());
    };

    $scope.removeWord = function removeWordFromBlock() {
        this.$parent.block.words.pop();
    };
});


UOSModelBuilder.controller('CheckWordPageController', function ($scope) {

    $scope.addBlock = function addBlockToModel() {
        $scope.pageModel.blocks.push(new Block());
    };

    $scope.removeBlock = function removeBlockFromModel() {
        $scope.pageModel.blocks.pop();
    };

    $scope.pageModel = {
        page: "",
        stage: "",
        filename: "",
        blocks: [new Block(), new Block()]
    };

    /**
     * Not very DRY but will fix later
     */
    $scope.$watch('pageModel.stage', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + newValue + "page" + $scope.pageModel.page + "CheckWord.json";
    });

    $scope.$watch('pageModel.page', function(newValue, oldValue) {
       $scope.pageModel.filename = "stage" + $scope.pageModel.stage + "page" + newValue + "CheckWord.json";
    });


    $scope.saveModel = function saveModelToDropbox() {
        $scope.$parent.client.writeFile($scope.baseDir + $scope.pageModel.filename, JSON.stringify($scope.pageModel), function saveCallback(err, res) {
            if (err) {
                alert("Problem saving Model to dropbox");
            }
        });
    };

    $scope.loadModel = function loadModelFromDropbox(){
        $scope.$parent.client.readFile($scope.baseDir + $scope.pageModel.filename, function (err, data) {
            if(err){ return; }
            $scope.pageModel = JSON.parse(data);
            $scope.$apply();
        });
    };
});










