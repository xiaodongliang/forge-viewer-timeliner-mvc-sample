//Copyright (c) Autodesk, Inc. All rights reserved
//Autodesk Developer Network (ADN)
//Written by Xiaodong Liang
//Permission to use, copy, modify, and distribute this software 
//in object code form for any purpose and without fee is hereby granted,
//provided that the above copyright notice appears in all copies and that
//both that copyright notice and the limited warranty and restricted rights
//notice below appear in all supporting documentation.
//AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS. AUTODESK SPECIFICALLY 
//DISCLAIMS ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE. AUTODESK, INC. 
//DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE UNINTERRUPTED OR ERROR FREE.

/////////varibles///////////
//style for specific UI controls
var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';

//viewer manager
var adnViewerMng = null;

//handle of the viewer 
var viewer3D;

//id of current selected node
var curDbId;

//name of current selected node
var curModelItemName; 

//current node that is shown up
var playCurNode = null;

//current urn
var _currentURN = "";


var NodesIDCollection = [];
var NodesNameCollection = [];


var playCurrentKeyIndex = 0;
var playTotalKeyCount = 0;
var timeHandle = null;
var globalPlayDic = null;

var totolStr ='';
//make specific model item isolate
function seeModelItem(modelId) {

    if (modelId > 0) {
        viewer3D.isolateById(modelId); 
    }
}

////////help functions//////////////
//show specific model item
function showOneNode(dbId) {
    if (dbId > 0) {
         
        viewer3D.show(dbId);
     }
}  

//show all model items
function resetIsolate() {
    viewer3D.showAll();
}

//sort the nodes of the timeliner according to the sequence of time.
function sortOnKeys(dict) {

    var sorted = [];
    for (var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for (var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}

//generate tree in new version of LMV
function generateTree(instanceTree){

    //clear tree control
    var nd = [];
   for (var i in w2ui['divModelTree'].nodes)
        nd.push(w2ui['divModelTree'].nodes[i].id);
   w2ui['divModelTree'].remove.apply(w2ui['divModelTree'], nd);


    //to simplify, add the first level objects only
   var rootId = instanceTree.getRootId();
   var rootName = instanceTree.getNodeName(rootId);

    //this is to dump a demo data of time liner
    //var childCount = 0;
     
   NodesIDCollection = [];
   NodesNameCollection = [];

    instanceTree.enumNodeChildren(rootId, function (childId) {

        var childName = instanceTree.getNodeName(childId); 

        NodesIDCollection.push(childId);    
        NodesNameCollection.push(childName);

        //add the a tree node to the tree
        var itotolStrdStr = "id" + (w2ui['divModelTree'].nodes.length + 1).toString();
        w2ui['divModelTree'].add([{ id: w2ui['divModelTree'].nodes.length + 1, text: childName, img: 'icon-page' }]);

        //this is to dump a demo data of time liner
        //*****************
        // randomMoth = Math.floor((Math.random() * 10) + 1);
        //var randomDate = Math.floor((Math.random() * 20) + 1);

        //totolStr += 'newT' + childCount + ',' +
        //            randomDate + '/' + randomMoth + '/' + '2014' + ',' +
        //            'cosntruct' + ',' +
        //            childId + ',' +
        //            childName + '\n';

        //newT0,06/01/2014,06/01/2014,cosntruct,23,A393_SERVICE_PIT_E30
        //childCount++;
        //******************
    });
}


////get model tree in old version of LMV
//function getObjectTreeCB(result) {

//    //clear tree control
//    var nd = [];
//    for (var i in w2ui['divModelTree'].nodes)
//        nd.push(w2ui['divModelTree'].nodes[i].id);
//    w2ui['divModelTree'].remove.apply(w2ui['divModelTree'], nd);


//    //to simplify, add the first level objects only
//    geometryItems_children = result.root.children;
//    currNodes = [];
//    for (i = 0; i < geometryItems_children.length; i++) {

//        currNodes.push(geometryItems_children[i]);

//        var idStr = "id" + (w2ui['divModelTree'].nodes.length + 1).toString();
//        w2ui['divModelTree'].add([{ id: w2ui['divModelTree'].nodes.length + 1, text: geometryItems_children[i].name, img: 'icon-page' }]);
//    }
//}
 

/////end help function/////////////

(function (window) { 

    //refresh model tree
    $('#divModelButtons').w2toolbar({
        name: 'divModelButtons',
        items: [
            { type: 'button', id: 'btnRefresh', caption: 'Refresh', img: 'icon-reload' },
            { type: 'button', id: 'btnShowAll', caption: 'Show All', img: 'icon-save' }
        ],
        onClick: function (event) {
            console.log('item ' + event.target + ' is clicked.');
            if (event.target == 'btnRefresh') {
                if (viewer3D != null) { 

                    var instanceTree = viewer3D.model.getData().instanceTree;
                    generateTree(instanceTree);
                }
            }
            else if (event.target == 'btnShowAll') {
                 
                viewer3D.showAll();
            }
           
        }
    });

    $('#divModelTree').w2sidebar({
        name: 'divModelTree',
        img: null,
        
        onClick: function (event) {
            console.log(event.target);
            var index = parseInt(event.target);
            if (index > -1) {
                 viewer3D.isolateById(NodesIDCollection[index]);
                
            }
        },
        onContextMenu: function (event) {
    
            viewer3D.showAll();
            var taskIndex = w2ui['divTBContainer'].getSelection();
            if (taskIndex > 0) {
                console.log(event.target);
                var modelIndex = parseInt(event.target);
                if (modelIndex > -1) {
                    var triggerStr = "<a href=\"javascript:void(0);\" onmousedown=\"seeModelItem(" + NodesIDCollection[modelIndex - 1] + ");\" onmouseup=\"resetIsolate();\">" + NodesNameCollection[modelIndex - 1] + "</a>";
                    w2ui.divTBContainer.records[taskIndex - 1].gridmodel = triggerStr;
                    w2ui.divTBContainer.refresh();
                }
            }
            else {
                alert("no task is selected!");
            }

           
        },
        onDblClick: function (event) {
            console.log(event);
            resetIsolate();
        }

    });

    $('#divModelPanel').w2layout({
        name: 'divModelPanel',
        panels: [
            { type: 'top', size: 30, resizable: false, style: pstyle, content: 'top' },
            { type: 'main', style: pstyle, content: 'main' }
        ]
    });

    w2ui['divModelPanel'].content('top', w2ui['divModelButtons']);
    w2ui['divModelPanel'].content('main', w2ui['divModelTree']);

    //task table grid
    var _taskType = [
        { id: 1, text: 'Construct' },
        { id: 2, text: 'Demolish' },
    ];


    $('#divTBContainer').w2grid({
        name: 'divTBContainer',
        header: 'List of Tasks',
        show: {           
            header: true
        },
        columns: [
            { field: 'gridtaskid', caption: 'Id', size: '5%', resizable: false },
            { field: 'gridtaskname', caption: 'Name', size: '19%', resizable: true, changed: true, editable: { type: 'text' } },
            { field: 'gridstadate', caption: 'Start Date', size: '19%', resizable: true, changed: true, render: 'date', editable: { type: 'date' } },
            { field: 'gridenddate', caption: 'End Date', size: '19%', resizable: true, changed:true, render: 'date', editable: { type: 'date' } },
            {
                field: 'gridtasktype', caption: 'Type', size: '19%', changed: true, editable: { type: 'select', items: _taskType },
                render: function (record, index, col_index) {
                    var html = '';
                    for (var p in _taskType) {
                        if (_taskType[p].id == this.getCellValue(index, col_index))
                            html = _taskType[p].text;
                    }
                    return html;
                }
            },
            { field: 'gridmodel', caption: 'Model', size: '19%', resizable: true, changed: true}
        ],
        records: [
            { recid: 1, gridtaskid: "1", gridtaskname: "Peter", gridstadate: "1/16/2014", gridenddate: "1/16/2014", gridtasktype: 1, gridmodel: 'attach a model' }
        ]
    });


    var keysArray;
    function getTableData() {
        w2ui.divTBContainer.save();
        var playDic = new Array();
        keysArray = [];
        for (var index = 0 ; index < w2ui['divTBContainer'].records.length;index++) {
            var this_enddate = w2ui['divTBContainer'].records[index].gridenddate;
            var this_dbid = w2ui['divTBContainer'].records[index].gridmodel;           
            var tempIndex = this_dbid.indexOf("seeModelItem(");
            if (tempIndex < 0)
                continue;
            var tempIndex1 = this_dbid.indexOf(")", tempIndex + 12);

            this_dbid = this_dbid.substr(tempIndex + 13, tempIndex1 - tempIndex - 13);

            if (this_enddate != "N/A" && this_dbid > 0) {
                var date = parseInt(Date.parse(this_enddate.replace(/-/g, "/")));
                if (date in playDic) {
                    playDic[date].push(parseInt(this_dbid));
                }
                else {
                    var ids = [];
                    ids.push(parseInt(this_dbid));
                    playDic[date] = ids;
                    keysArray.push(date);
                }
            }
        }           

        playDic = sortOnKeys(playDic);

        return playDic;
    }

    function importTasks(filecontent) {
        var data = $.csv.toArrays(filecontent);
        for (i = 0; i < data.length; i++) {

            var data_row = data[i];
            var len = w2ui.divTBContainer.records.length;

            var taskType = 1;
            if (data_row[3] == "cosntruct") {
                taskType = 1;
            }
            else {
                taskType = 2;
            }
            var triggerStr = "<a href=\"javascript:void(0);\" onmousedown=\"seeModelItem(" + data_row[4] + ")\" onmouseup=\"resetIsolate();\">" + data_row[5] + "</a>";

            w2ui['divTBContainer'].add({
                recid: len + 1, gridtaskid: len + 1,
                gridtaskname: data_row[0], gridstadate: data_row[1], gridenddate: data_row[2], gridtasktype: taskType, gridmodel: triggerStr
            });

        }
    }

    $("#myInputTask").change(function (evt) {
        var files = evt.target.files; // FileList object
        var f = files[0];

        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var contents = e.target.result;
                importTasks(contents);
              
            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    });


////upload, register and view a new model
///////////////////////////////
    $("#myInputModel").change(function (evt) {
        var files = evt.target.files; // FileList object
        var f = files[0];

        var bucket = document.getElementById('myBucket').value;;
        uploadFiles(bucket, files);
      
    });

    ///////////////////////////////////////////////////////////////////////////
    // 
    //
    ///////////////////////////////////////////////////////////////////////////
    function uploadFiles(bucket, files) {

       
        var parentdiv = $('<div></div>');
        parentdiv.attr('id', 'taskdiv');
        parentdiv.html("");

        $(document.body).append(parentdiv);
        $("#taskdiv")[0].style.position = "absolute";
        $("#taskdiv")[0].style.left = "20px";
        $("#taskdiv")[0].style.top = "60px";
        $("#taskdiv")[0].style.zIndex = 10000  
 


        adnViewerMng.closeDocument();

        var token = document.getElementById('AccessToken').value;;
        viewDataClient = new Autodesk.ADN.Toolkit.ViewData.AdnViewDataClient(
          'https://developer.api.autodesk.com',
          token);

        //for (var i = 0; i < files.length; ++i) {

            var file = files[0];


            $("#taskdiv")[0].innerHTML = '<h3>Uploading file: ' + file.name + ' ...</h3>';
            console.log('Uploading file: ' + file.name + ' ...');
             
            viewDataClient.uploadFileAsync(

                file,
                bucket,
                file.name,

                //onSuccess
                function (response) {

                    $("#taskdiv")[0].innerHTML = '<h3>File upload successful:</h3>';
                    console.log('File upload successful:');
                    console.log(response);

                    //v2 the response param is objectId
                    var fileId = response.objectId;

                    var registerResponse =
                        viewDataClient.register(fileId);

                    if (registerResponse.Result === "Success" ||
                        registerResponse.Result === "Created") {

                        $("#taskdiv")[0].innerHTML = "<h3>Registration result: " +
                            registerResponse.Result +"</h3>";

                        console.log("Registration result: " +
                            registerResponse.Result);

                        $("#taskdiv")[0].innerHTML = '<h3>Starting translation: ' + "</h3>";
                        console.log('Starting translation: ' +
                            fileId);

                        checkTranslationStatus(
                            fileId,
                            1000 * 60 * 5, //5 mins timeout

                            //onSuccess
                            function (viewable) {

                                //_currentURN = fileId;
                                console.log("Translation successful: " +
                                    response.file.name);

                                $("#taskdiv")[0].innerHTML = "<h3>Translation successful: " +
                                    response.file.name + "</h3>";

                                console.log("Viewable: ");
                                console.log(viewable);
                                _currentURN = viewable.urn;

                                adnViewerMng.loadDocument(viewable.urn); 

                                //clear model tree.
                                var nd = [];
                                for (var i in w2ui['divModelTree'].nodes)
                                    nd.push(w2ui['divModelTree'].nodes[i].id);
                                w2ui['divModelTree'].remove.apply(w2ui['divModelTree'], nd);


                                var obj = $("#taskdiv");
                                obj.remove();

                            });
                    }
                },

                //onError
                function (error) {

                    console.log('File upload failed:');
                    console.log(error);
                });
        //}
    }

    ///////////////////////////////////////////////////////////////////////////
    // 
    //
    ///////////////////////////////////////////////////////////////////////////
    function checkTranslationStatus(fileId, timeout, onSuccess) {

        var startTime = new Date().getTime();

        var timer = setInterval(function () {

            var dt = (new Date().getTime() - startTime) / timeout;

            if (dt >= 1.0) {

                clearInterval(timer);
            }
            else {

                viewDataClient.getViewableAsync(
                    fileId,
                    function (response) {

                        console.log(
                            'Translation Progess ' +
                            fileId + ': '
                            + response.progress);

                        if (response.progress === 'complete') {

                            clearInterval(timer);
                            onSuccess(response);
                        }
                    },
                    function (error) {

                    });
            }
        }, 2000);
    };

 ///////////////////////////////


    function myTimer() { 
        
        var ids = globalPlayDic[keysArray[playCurrentKeyIndex]];

        var currentTime = keysArray[playCurrentKeyIndex];
       
        var myDate = new Date(currentTime);

        var month = myDate.getMonth() + 1;
        //prepare the div content
        var divStr = "<h3>Current Time: </h3>\n<h4>" +
             myDate.getFullYear() + "," + month + "," + myDate.getDate() +
             "</h4>\n<h3>Object Names: </h3>\n";
        
         for (idindex = 0; idindex < ids.length; idindex++) {
                var id = ids[idindex];
                for (i = 0; i < NodesIDCollection.length; i++) {
                    var nodeid = NodesIDCollection[i];
                    //if (node.dbId == parseInt(id)) {
                    if (nodeid == parseInt(id)) {
                        showOneNode(nodeid);
                        divStr += "<h4>" + NodesNameCollection[i] + "</h4>\n";
                    }
                }
         }

         $("#taskdiv")[0].innerHTML = divStr;

            playCurrentKeyIndex++;
            if (playCurrentKeyIndex == playTotalKeyCount) {
                clearInterval(timeHandle);
                //viewer3D.propertygrid.openOnSelect = true;
                w2ui['divTButtons'].enable("btnplay");
                w2ui['divTButtons'].disable("btnpause");
                w2ui['divTButtons'].disable("btnend");

               
                var obj = $("#taskdiv");
                obj.remove();

                playCurrentKeyIndex = 0;
                playTotalKeyCount = 0;
             
            }
    }


    //div: buttons for timeliner table
    $('#divTButtons').w2toolbar({
        name: 'divTButtons',
        items: [
            // add a task
            { type: 'button', id: 'btnadd', caption: 'add', img: 'icon-add' },
            //delete a task
            { type: 'button', id: 'btndelete', caption: 'delete', img: 'icon-delete' },
            //delete all tasks
            { type: 'button', id: 'btndeleteall', caption: 'delete all', img: 'icon-delete' },
            //break
            { type: 'break', id: 'break1' },
            //browser to select a local tasks file
            { type: 'button', id: 'btnchoosefile', caption: 'choose task data', img: 'icon-folder' },
            //break
            { type: 'break', id: 'break2' },
            //play timeliner
            { type: 'button', id: 'btnplay', caption: 'play', img: 'icon-save' },
            //pause timeliner
            { type: 'button', id: 'btnpause', caption: 'pause', img: 'icon-save', disabled: true },
            //end timeliner
            { type: 'button', id: 'btnend', caption: 'end', img: 'icon-delete', disabled: true },
            //break
            { type: 'break', id: 'break3' },
            //load a new model
             { type: 'button', id: 'btnloadmodel', caption: 'New Model', img: 'icon-folder' },
             { type: 'spacer' },
             //load an existing file of task
            { type: 'button', id: 'btnexistingfile', caption: 'demo task', img: 'icon-save' }

        ],
        onClick: function (event) {
            console.log('item ' + event.target + ' is clicked.');

            if (event.target == 'btnadd') {
                //add a new task row
                var len = w2ui.divTBContainer.records.length;
                w2ui['divTBContainer'].add({ recid: len + 1, gridtaskid: len + 1, gridtaskname: 'New Task', gridstadate: "1/16/2014", gridenddate: "1/16/2014", gridtasktype: 1, gridmodel: 'attach model item' });
            }
            if (event.target == 'btndeleteall') {
                //delete all task rows
                w2ui.divTBContainer.selectAll();
                w2ui.divTBContainer.delete(true);
            }
            if (event.target == 'btndelete') {
                //delete selected task row
                w2ui.divTBContainer.delete(true); 

            }
            if (event.target == 'btnchoosefile') {
               
                //browser to select a local tasks file
                w2ui.divTBContainer.selectAll();
                w2ui.divTBContainer.delete(true);
                 $('#myInput').click();               
            }

            if (event.target == 'btnexistingfile') {
               
                //load an existing file of task
                var defaultUrn = document.getElementById('defaultURN').value;

                //compare if the current model is the default model. 
                // because the existing file of task is for the default model only
                if (_currentURN == defaultUrn) {
                    var demotaskscontent = document.getElementById('ExistingTasks').value;
                    var re = new RegExp('<br>', 'g');

                    demotaskscontent = demotaskscontent.replace(re,"\r\n");
                    importTasks(demotaskscontent);
                    console.log("btnexistingfile");
                }
                else {
                    alert("The demo task file is not for this model!: " + _currentURN.toString());
                }
            }

            if (event.target == 'btnloadmodel') {
                //load a new model
                $('#myInputModel').click();
                console.log("btnloadmodel");
            }

            if (event.target == 'btnpause') {
                //pause timeliner
                w2ui['divTButtons'].enable("btnplay");
                w2ui['divTButtons'].disable("btnpause");
                clearInterval(timeHandle);
            }

            if (event.target == 'btnplay') {
                //start to play timeliner
                if (w2ui.divTBContainer.records.length > 0) {

                    
                    //display a temp div showing timeliner data
                    var parentdiv = $('<div></div>');         
                    parentdiv.attr('id', 'taskdiv');
                    parentdiv.html("");

                    $(document.body).append(parentdiv);
                    $("#taskdiv")[0].style.position = "absolute";
                    $("#taskdiv")[0].style.left = "20px";
                    $("#taskdiv")[0].style.top = "60px";
                    $("#taskdiv")[0].style.zIndex = 10000; 

                    //enable/disable relevant buttons
                    w2ui['divTButtons'].disable('btnplay');
                    w2ui['divTButtons'].enable('btnpause');
                    w2ui['divTButtons'].enable('btnend');
 
                    if (playTotalKeyCount > 0) {
                        //continue playing
                        timeHandle = setInterval(function () { myTimer() }, 500);
                    }
                    else {
                         
                        globalPlayDic = getTableData();

                        //isolate all
                        for (i = 0; i < NodesIDCollection.length; i++) {
                            var nodeid = NodesIDCollection[i];
                            viewer3D.isolateById(nodeid);
                        }

                        playCurrentKeyIndex = 0;

                        //start the first task
                        playTotalKeyCount = keysArray.length;
                        timeHandle = setInterval(function () { myTimer() }, 1000);
                    } 

                }
                else {
                    alert("no task!");
                }
            }

            if (event.target == 'btnpause') {
                //pause the timeliner
                w2ui['divTButtons'].enable("btnplay");
                w2ui['divTButtons'].disable("btnpause");
                clearInterval(timeHandle);
            }

            if (event.target == 'btnend') {
                
                //end the timeliner
                clearInterval(timeHandle);

                 playCurrentKeyIndex = 0;
                 playTotalKeyCount = 0;
                 timeHandle = null;
                 globalPlayDic = [];
                 keysArray = [];

                // viewer3D.propertygrid.openOnSelect = true;

                w2ui['divTButtons'].enable("btnplay");
                w2ui['divTButtons'].disable("btnpause");
                w2ui['divTButtons'].disable("btnend");

                //remove the temp div
                var obj = $("#taskdiv");
                obj.remove();


                viewer3D.showAll();

            }

        }
    });

    //div: timeliner table 
    $('#divTBPanel').w2layout({
        name: 'divTBPanel',
        panels: [
            { type: 'top', size: 30, resizable: false, style: pstyle, content: 'top' },
            { type: 'main', style: pstyle, content: 'main' }
        ]
    });


    w2ui['divTBPanel'].content('top', w2ui['divTButtons']);
    w2ui['divTBPanel'].content('main', w2ui['divTBContainer']);

    var pstyleTitle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px; font-size:xx-large';


    //div layout
    $('#divLayout').w2layout({
        name: 'divLayout',
        panels: [
            { type: 'top', size: 50, resizable: false, style: pstyleTitle, content: '<img src="forge.png"/>                   Forge Timeliner Sample' },
            { type: 'main', style: pstyle, content: 'main' },             
            { type: 'right', size: 200, resizable: true, style: pstyle },
            { type: 'bottom', size: 250, resizable: true, style: pstyle }
        ]
    });

    //main div
    w2ui['divLayout'].content('main', '<div id="divViewer" style="height:100%;height:100%"></div>');
    //right div 
    w2ui['divLayout'].content('right', w2ui['divModelPanel']);
    //bittom div 
    w2ui['divLayout'].content('bottom', w2ui['divTBPanel']);
 

    //functions for Viewer 
    //load the default model
    {
        _currentURN = document.getElementById('defaultURN').value;;
        var thistoken = document.getElementById('AccessToken').value;

        adnViewerMng = new Autodesk.ADN.Toolkit.Viewer.AdnViewerManager(
                                      viewer3D,
                                     thistoken,                               
                                      document.getElementById('divViewer'));

        
        
        adnViewerMng.loadDocument(_currentURN);
    }

}(this));