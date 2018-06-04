<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<ul class="nav nav-pills" style="margin-bottom: 30px">
  <li id="Menu_Classifieds-Admin" role="presentation"><a href="/Admin/Classifieds-Admin">Dashboard</a></li>
  <li id="Menu_Ads" role="presentation"><a href="/Admin/Classifieds-Admin/Ads">Ads</a></li>
  <li id="Menu_Locations" role="presentation"><a href="/Admin/Classifieds-Admin/Locations">Locations</a></li>
  <li id="Menu_Levels" role="presentation"><a href="/Admin/Classifieds-Admin/Levels">Levels</a></li>
  <li id="Menu_Categories"role="presentation"><a href="/Admin/Classifieds-Admin/Categories">Categories</a></li>
  <li id="Menu_Sellers" role="presentation"><a href="/Admin/Classifieds-Admin/Sellers">Sellers</a></li>
</ul>

<xmod:jQueryReady runat="server">
	var currentPage = $(location).attr('href').split('/').pop(),
  		activeID = "#Menu_" + currentPage;
  
  $(activeID).addClass("active");
</xmod:jQueryReady></xmod:masterview>