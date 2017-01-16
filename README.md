# forge-viewer-timeliner-mvc-sample

 
#Viewer Timeliner MVC Sample - Windows app

[![Viewer](https://img.shields.io/badge/Forge%20Viewer-V2.7-green.svg)](http://developer-autodesk.github.io/)
[![Platforms](https://img.shields.io/badge/platform-Windows-orange.svg)](https://www.microsoft.com/en-us/windows)
[![Visual Studio 2012](https://img.shields.io/badge/Visual%20Studio-2012-yellow.svg)](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

##Description

A sample simulates Navisworks timeline with [Viewer](https://developer.autodesk.com/en/docs/viewer/v2/overview/). This is the [demo video](http://autode.sk/1WCO9ah). 

##Dependencies

* The ["Demo task"](https://github.com/Developer-Autodesk/view.and.data-timeliner-mvc-sample/blob/master/Timeliner/Content/demotask.txt) of this sample depends on the sample model. The model is available at  [gatehouse.nwd](https://github.com/Developer-Autodesk/client-timeliner-view.and.data.api/blob/master/gatehouse.nwd)  
* The MVC project would need to update the packages by [NuGet](https://www.nuget.org/). The simplest way is right click of the project>>"Manage NuGet Packages for Solution" >> "Restore" (top right of dialog)
* The demo is tested with Visual Studio 2012. It should work with higher versions, but has not yet been tested.


##Setup/Usage Instructions

* Get your consumer key and secret key at [Forge Platform](https://developer.autodesk.com/)
* With this key pair, use other workflow samples, for example, [this winform workflow sample](https://github.com/Developer-Autodesk/workflow-dotnet-winform-view.and.data.api) to create bucket, upload demo model and get the models URN for latter usage.
* Open the solution in Visual Studio 2012, replace the place holder in Credentials.cs with your own consumer key and secret key, bucket name and URN which are the ones you created in step 2. The URN string should start with "urn:". 
* Build and run the project, browse to the website with latest version of Chrome or Firefox. You may need to clean up cache of browser before running. The default model will be loaded. object tree is generated.  
* Click any model item to isolate the corresponding object in viewer. click [Show All] to restore.
* In task table:

      * [add] : add a new task. Edit the start date, end date, task type. Select one task item, right click a model item in the model tree, a hyperlink will be generated for the column 
      * [delete] : delete one selected task
      * [delete all] : delete all tasks
      * [choose task data] : load an existing task file on client (currently csv, or txt)
      * [New Model]: load a new model. it allows the user to choose a local model and upload it to view service, and the web page can display the new model. The user can work with Timeliner with the new model
      * [demo task] : load an existing task file on server. In this case, it is [demotask.txt](https://github.com/Developer-Autodesk/view.and.data-timeliner-mvc-sample/blob/master/Timeliner/Content/demotask.txt). It can only be useful for the demo model [gatehouse.nwd](https://github.com/Developer-Autodesk/client-timeliner-view.and.data.api/blob/master/gatehouse.nwd). If current model is different, the code will pop out an error message. 
      * [play] : starts a simulation process. Currently, only 'construction' of task type is implemented
      * [Pause]: pause a simulation process
      * [End]:   stop a simulation process

* Simulation uses 'end date' only   
* Simulation implements 'Construct' type only
 

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

##Written by 

Xiaodong Liang (Forge Partner Development)


