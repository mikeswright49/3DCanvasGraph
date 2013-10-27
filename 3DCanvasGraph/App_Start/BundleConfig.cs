using System.Web;
using System.Web.Optimization;

namespace _3DCanvasGraph
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/graphing").Include("~/Scripts/canvas3DGraph.js", "~/Scripts/graphing.js"));
            bundles.Add(new StyleBundle("~/css/bundles").Include("~/content/graphing.css", "~/content/Site.css"));

        }
    }
}