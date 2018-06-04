<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="ControlPanel.ascx.vb" Inherits="KnowBetter.XModPro.ControlPanel" %>
<style type="text/css">
   #xmpToolbarCommands {
     list-style: none;
     border: 1px solid #fed22f;
     border-radius: 5px;
     background: #FFE45B;
     margin: 5px 0 15px 0;
     min-width: 900px;
   }
   #xmpToolbarCommands li {
     display: inline-block;
     margin-right: 15px;
     border-radius: 5px;
     padding: 5px 10px;
   }
   #xmpToolbarCommands li:hover {
     background: rgba(255,255,255,.75);
     cursor: pointer;
   }
   #xmpToolbarCommands li.xmp-active {
     background: rgba(255,255,255,.9);
   }
   .kbxm-is-loading {
     display: inline-block;
     width: 16px;
     height: 16px;
     margin-left: 5px;
     background: url(<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/ajax-loader.gif")%>) no-repeat;
   }
    div.xmpToolbar {margin-bottom: 10px; text-align: left; height: 30px; padding-top: 3px; padding-bottom: 10px; clear:both; width: 900px;}
    div.xmpToolbarCommands {padding-left:5px; display:inline; text-align: left;}
    div.xmpToolbarCommands div {padding-left: 10px; padding-top:3px; display: inline-block;}
    div.xmpToolbarCommands img {border:0px; vertical-align:middle; margin-left: -10px; height: 32px; width: 32px;}
    div.xmpToolbarCommands a.xmpToolbarText {font-size: 14px; font-family: Arial, helvetica, Sans-Serif; margin-right:15px; margin-left: -5px; white-space: nowrap;}
    div.xmpWorkArea {height:1200px;min-height:1200px;} 
    div.xmpWorkArea iframe {display:none;border-style:none;background-color:Transparent; width: 100%;}
    #xmpForms, #xmpTemplates, #xmpFeeds, #xmpXChange {height: 1200px; min-height:1000px;}
    #xmpDatabase {height: 700px; min-height:700px;}
</style>
<script type="text/javascript">
    var kbxmMngFormsLoaded = false;
    var kbxmMngTemplatesLoaded = false;
    var kbxmMngFeedsLoaded = false;
    var kbxmDBToolsLoaded = false;
    var kbxmFormBldrLoaded = false;
    var kbxmTemplateBldrLoaded = false;
    
    function kbxmShowProgress($el) {
      $el.append('<span class="kbxm-is-loading"></span>');
    }
    function kbxmHideProgress($el) {
      $el.find('span.kbxm-is-loading').remove();
    }
    function kbxmLoadPanel(pnlName){
        var ldr = document.getElementById(pnlName);
        
        switch (pnlName)
        {
        	case 'xmpForms':
                if (ldr.src == ''){
                    kbxmMngFormsLoaded = false;
                  kbxmShowProgress($('li[data-item=forms]'));
                    ldr.src = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/ManageForms.aspx?xdata=" & GetFormsData())%>';
                }
       		break;
        	case 'xmpTemplates': 
                if (ldr.src == ''){
                    kbxmMngTemplatesLoaded = false;
                    kbxmShowProgress($('li[data-item=templates]'));
                    ldr.src = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/ManageTemplates.aspx?xdata=" & GetTemplatesData())%>';
                }
        	    break;
        	  case 'xmpFeeds':
        	    if (ldr.src == '') {
        	      kbxmMngFeedsLoaded = false;
        	      kbxmShowProgress($('li[data-item=feeds]'));
        	      ldr.src = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/ManageFeeds.aspx?xdata=" & GetFeedsData())%>';
        	    }
        	    break;
        	  case 'xmpDatabase':
                if (ldr.src == ''){
                    kbxmDBToolsLoaded = false;
                    kbxmShowProgress($('li[data-item=database]'));
                    ldr.src = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/TableDesigner.aspx?xdata=" & GetDatabaseData())%>';
                }
                break;
            case 'xmpXChange':
                if (ldr.src == '') {
                    kbxmXChangeLoaded = false;
                    kbxmShowProgress($('li[data-item=xchange]'));
                    ldr.src = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/Exchange.aspx?xdata=" & GetExchangeData())%>';
                }
                break;
                 
        }
      $('#xmpForms,#xmpTemplates,#xmpFeeds,#xmpDatabase,#xmpXChange').hide();
      if (pnlName == 'xmpForms') $('#xmpForms').show() 
      if (pnlName == 'xmpTemplates') $('#xmpTemplates').show()
      if (pnlName == 'xmpFeeds') $('#xmpFeeds').show()
      if (pnlName == 'xmpDatabase') $('#xmpDatabase').show()
      if (pnlName == 'xmpXChange') $('#xmpXChange').show()
	    
	    
    }
    function kbxmPanelLoaded(pnl){
      $('#xmpToolbarCommands li').removeClass('xmp-active');
      var $item = $('li[data-item=' + pnl + ']');
      kbxmHideProgress($item);
      $item.addClass('xmp-active');
        
        switch (pnl)
        {
        	case 'forms':
        	    kbxmMngFormsLoaded = true;
        		break;
        	case 'templates':
        	    kbxmMngTemplatesLoaded = true;
        	    break;
      	  case 'feeds':
      	      kbxmMngTemplatesLoaded = true;
      	      break;
        	  case 'database':
        	    kbxmDBToolsLoaded = true;
        	    break;
        	case 'xchange':
        	    kbxmXChangeLoaded = true;
        	break;
      }        
        	    }
    $(document).ready(function() {
      $('#xmpToolbarCommands li').removeClass('xmp-active');
      $('#xmpToolbarCommands').on("click", 'li', function(e) {
        var $btn = $(this);
        switch ($btn.attr('data-item')) {
          case 'forms':
            kbxmLoadPanel('xmpForms');
        	    break;
          case 'templates':
            kbxmLoadPanel('xmpTemplates');
            break;
          case 'feeds':
            kbxmLoadPanel('xmpFeeds');
            break;
          case 'database':
            kbxmLoadPanel('xmpDatabase');
            break;
          case 'xchange':
            kbxmLoadPanel('xmpXChange');
            break;
          case 'exit':
            window.location = '<%=NavigateUrl()%>';
            break;
     }
      });
    });
</script>
      
<div id="divContainer" runat="server">
  <ul id="xmpToolbarCommands">
    <li data-item="forms">
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/forms.png")%>" />
      <asp:Label runat="server" resourcekey="ManageForms" Text="Manage Forms" />
    </li>
    <li data-item="templates">      
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/templates.png")%>" />
      <asp:Label runat="server" resourcekey="ManageTemplates" Text="Manage Templates" />
    </li>
    <li data-item="feeds">
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/rss-feed-icon32x32.png")%>" />
      <asp:Label runat="server" resourcekey="ManageFeeds" Text="Manage Feeds" />
    </li>
    <li data-item="database">
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/database.png")%>" />
      <asp:Label runat="server" resourcekey="DatabaseTools" Text="Database Tools" />
    </li>
    <li data-item="xchange">
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/exchange.png")%>" />
      <asp:Label runat="server" resourcekey="XChange" Text="Exchange" />
    </li>
    <li data-item="exit">
      <img src="<%=Page.ResolveUrl("~/DesktopModules/XModPro/images/exit.png")%>" />
      <asp:Label runat="server" resourcekey="Exit" Text="Exit" />
    </li>
  </ul>


    <div class="xmpWorkArea">
        <iframe id="xmpForms" onload="kbxmPanelLoaded('forms');" allowtransparency="true" frameborder="0"></iframe>
        <iframe id="xmpTemplates" onload="kbxmPanelLoaded('templates');" allowtransparency="true" frameborder="0"></iframe>
        <iframe id="xmpFeeds" onload="kbxmPanelLoaded('feeds');" allowtransparency="true" frameborder="0"></iframe>
        <iframe id="xmpDatabase" onload="kbxmPanelLoaded('database');" allowtransparency="true" frameborder="0"></iframe>
        <iframe id="xmpXChange" onload="kbxmPanelLoaded('xchange');" allowtransparency="true" frameborder="0"></iframe>
    </div>
</div>
<div style="text-align:center;"><%=GetXMPVersion()%></div>