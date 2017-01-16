using System.Web;
using System.Web.Mvc;

namespace Adsk_Viewer_Timeliner_ASP_MVC_Sample
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}