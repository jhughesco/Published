<%@ Control language="vb" AutoEventWireup="false" Explicit="True" Inherits="DotNetNuke.UI.Skins.Skin" %>
<%@ Register TagPrefix="dnn" TagName="LOGO" Src="~/Admin/Skins/Logo.ascx" %>
<%@ Register TagPrefix="dnn" TagName="SEARCH" Src="~/Admin/Skins/Search.ascx" %>
<%@ Register TagPrefix="dnn" TagName="USER" Src="~/Admin/Skins/User.ascx" %>
<%@ Register TagPrefix="dnn" TagName="LOGIN" Src="~/Admin/Skins/Login.ascx" %>
<%@ Register TagPrefix="dnn" TagName="PRIVACY" Src="~/Admin/Skins/Privacy.ascx" %>
<%@ Register TagPrefix="dnn" TagName="TERMS" Src="~/Admin/Skins/Terms.ascx" %>
<%@ Register TagPrefix="dnn" TagName="COPYRIGHT" Src="~/Admin/Skins/Copyright.ascx" %>
<%@ Register TagPrefix="dnn" TagName="JQUERY" Src="~/Admin/Skins/jQuery.ascx" %>
<%@ Register TagPrefix="dnn" TagName="META" Src="~/Admin/Skins/Meta.ascx" %>
<%@ Register TagPrefix="dnn" TagName="MENU" Src="~/DesktopModules/DDRMenu/Menu.ascx" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.Client.ClientResourceManagement" Assembly="DotNetNuke.Web.Client" %>

<dnn:META ID="ViewPort" runat="server" Name="viewport" Content="width=device-width, initial-scale=1" />

<dnn:JQUERY ID="jQuery" runat="server" jQueryHoverIntent="true" />
<dnn:DnnCssInclude ID="BootstrapCSS" runat="server" FilePath="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" Priority="20" />
<dnn:DnnCssInclude ID="CarouselCSS" runat="server" FilePath="css/carousel.css" PathNameAlias="SkinPath" Priority="25" />
<dnn:DnnCssInclude ID="FontAwesomeCSS" runat="server" FilePath="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" Priority="40" />
<dnn:DnnJsInclude ID="BootstrapJS" runat="server" FilePath="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js" />

<div class="navbar-wrapper">
    <div class="container">
        <div class="navbar navbar-inverse navbar-static-top" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    </button>
                    <dnn:LOGO runat="server" CssClass="navbar-brand" id="dnnLOGO" />
                </div>
                <div class="navbar-collapse collapse">
                    <dnn:MENU MenuStyle="ReflexNav" runat="server"></dnn:MENU>
                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <dnn:LOGIN ID="dnnLogin" CssClass="LoginLink" runat="server" LegacyMode="false" />
                        </li>
                        <li>
                            <dnn:USER ID="dnnUser" runat="server" LegacyMode="false" /> 
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
      
<div class="container marketing innerskin">
    <div class="row">
        <div class="col-lg-12">
            <div class="pull-right">
                <dnn:SEARCH ID="dnnSearch" runat="server" ShowSite="false" ShowWeb="false" EnableTheming="true" Submit="Go" CssClass="btn btn-primary" />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12" id="ContentPane" runat="server"></div>
    </div>
        
       
    <div class="row">
        <div id="LeftPane" runat="server" class="col-sm-3"></div>
        <div id="RightPane" runat="server" class="col-sm-9"></div>
    </div>
    
    <!-- Three columns of text below the carousel -->
    <div class="row">
        <div id="MarketingPane_Left" runat="server" class="col-lg-4"></div>
        <div id="MarketingPane_Middle" runat="server" class="col-lg-4"></div>
        <div id="MarketingPane_Right" runat="server" class="col-lg-4"></div>
    </div><!-- /.row -->

    <div class="row">
        <div class="col-lg-12" id="DividerPaneTop" runat="server"></div>
    </div>
    
    <div class="row featurette">
    <div id="FeaturePane_Left" runat="server" class="col-md-7"></div>
    <div id="FeaturePane_Right" runat="server" class="col-md-5"></div>
    </div>

    <div class="row">
        <div class="col-lg-12" id="DividerPaneMiddle" runat="server"></div>
    </div>

    <div class="row featurette">
    <div id="FeaturePane2_Left" runat="server" class="col-md-5"></div>
    <div id="FeaturePane2_Right" runat="server" class="col-md-7"></div>
    </div>

    <div class="row">
        <div class="col-lg-12" id="DividerPaneLower" runat="server"></div>
    </div>

    <div class="row featurette">
    <div id="FeaturePane3_Left" runat="server" class="col-md-7"></div>
    <div id="FeaturePane3_Right" runat="server" class="col-md-5"></div>
    </div>

    <div class="row">
        <div class="col-lg-12" id="DividerPaneBottom" runat="server"></div>
    </div>

    <footer>
        <p class="pull-right"><a href="#">Back to top</a></p>
        <p>
            <dnn:COPYRIGHT runat="server" />
            <dnn:TERMS runat="server" />
            <dnn:PRIVACY runat="server" />          
        </p>
    </footer>

</div><!-- /.container -->

<script>
    $(document).ready(function () {
        $('#dnn_dnnSearch_txtSearch').addClass('form-control');
    });
</script>

    

   

