using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Adsk_Viewer_Timeliner_ASP_MVC_Sample.Controllers
{
    public class Credentials
    {
        public static readonly string BASE_URL = "https://developer.api.autodesk.com";

        //get your consumer key and the secret key from http://developer.autodesk.com 
        public static readonly string CONSUMER_KEY = "your consumer key";
        public static readonly string CONSUMER_SECRET = "your secret key";

        public static readonly string DEFAULT_BUCKET_KEY = "your_bucket_name";
        public static readonly string DEFAULT_MODEL_URN = "your_default_model_urn";

    }
}