//Copyright (c) Autodesk, Inc. All rights reserved
//Autodesk Developer Network (ADN)
//Permission to use, copy, modify, and distribute this software 
//in object code form for any purpose and without fee is hereby granted,
//provided that the above copyright notice appears in all copies and that
//both that copyright notice and the limited warranty and restricted rights
//notice below appear in all supporting documentation.
//AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS. AUTODESK SPECIFICALLY 
//DISCLAIMS ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE. AUTODESK, INC. 
//DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE UNINTERRUPTED OR ERROR FREE.



using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

using RestSharp;
using Adsk_Viewer_Timeliner_ASP_MVC_Sample;
using System.Web.Configuration;

namespace Adsk_Viewer_Timeliner_ASP_MVC_Sample.Controllers
{
    public class HomeController : Controller
    {
        //****moved the credentials to Credentials.cs
        //base url of viewer API
        //static String BASE_URL = "https://developer.api.autodesk.com";
        // Viewing Service client key
        //static String _clientKey = WebConfigurationManager.AppSettings["ViewerClientKey"]; 
        //// Viewing service client secret
        //static String _secretKey = WebConfigurationManager.AppSettings["ViewerSecretKey"]; 
        //// Bucket name to upload your files
        //static String _bucketName = WebConfigurationManager.AppSettings["ViewerBucket"];  
        //****
                

        //base url of viewer API
        static String BASE_URL = Credentials.BASE_URL;
        // Viewing Service client key
        static String _clientKey = Credentials.CONSUMER_KEY;
        // Viewing service client secret
        static String _secretKey = Credentials.CONSUMER_SECRET;
        // Bucket name to upload your files
        static String _bucketName = Credentials.DEFAULT_BUCKET_KEY; 
         

        static RestClient _restclient = null;

        static String _accessToken = String.Empty;
        static String _ossfileid = String.Empty;
        static String _ossfileid_encoded = String.Empty;

        // Some document urn to start with. This will be generated at runtime from the uploaded file.
       
        static HttpPostedFileBase _fileToUpload = null;

        static bool _isTokenSet = false;
        static bool _bucketAvailable = false;
        static bool _fileUploadedToOSS = false;
        static bool _fileTranslated = false;
        static String _message = String.Empty;


        public ActionResult Index()
        {
           
            if (_restclient == null)
                _restclient = new RestClient(BASE_URL);

            GetAccessToken();
            
            ViewBag.AccessToken = _accessToken;

            //moved the default urn to Credentials.cs
            //ViewBag.defaultURN = WebConfigurationManager.AppSettings["ViewerDefaultURN"]; ;
            ViewBag.defaultURN = Credentials.DEFAULT_MODEL_URN;

            ViewBag.mybucket = _bucketName;

            //read the existing task file for demo

            string taskfilename = Server.MapPath("~/Content/demotask.txt");
            using (StreamReader objStreamReader = System.IO.File.OpenText(taskfilename))
            {
                string content = objStreamReader.ReadToEnd().ToString();
               content = content.Replace("\r\n", "<br>");
                ViewBag.ExistingTasks = content; 
            } 

            return View();
        }

     

        // Get Access token
        public void GetAccessToken()
        {
            if (_restclient == null)
                _restclient = new RestClient(BASE_URL);

            if (String.IsNullOrEmpty(_accessToken))
            {
                // Get Access Token using clientkey and secretkey
                if (_clientKey != string.Empty && _secretKey != string.Empty)
                {
                    RestRequest req = new RestRequest();
                    req.Resource = "authentication/v1/authenticate";
                    req.Method = Method.POST;
                    req.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                    req.AddParameter("client_id", _clientKey);
                    req.AddParameter("client_secret", _secretKey);
                    req.AddParameter("grant_type", "client_credentials");

                   

                    IRestResponse<Models.AuthResult> resp = _restclient.Execute<Models.AuthResult>(req);
                    if (resp.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        Models.AuthResult ar = resp.Data;
                        if (ar != null)
                        {
                            _accessToken = ar.access_token;
                        }
                    }
                }
            }
        }

        // Set Access token
        public void SetAccessToken()
        {
            if (_isTokenSet == false)
            {
                // Set Accesstoken for cookie to be sent automatically in subsequest rest calls
                if (!String.IsNullOrEmpty(_accessToken))
                {
                    RestRequest req = new RestRequest();
                    req.Resource = "utility/v1/settoken";
                    req.Method = Method.POST;
                    req.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                    req.AddParameter("access-token", _accessToken);

                    IRestResponse resp = _restclient.Execute(req);
                    if (resp.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        _isTokenSet = true;
                        String response = resp.Content;
                    }
                }
            }
        }

        //****move the workflow (settoken, create bucket, upload, register ... to client js library
        //https://github.com/Developer-Autodesk/library-javascript-view.and.data.api
        //
        //******


        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
