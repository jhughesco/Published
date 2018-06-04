<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="PreviewTemplate.aspx.vb" Inherits="KnowBetter.XModPro.PreviewTemplate" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Preview Template</title>
    
    <style type="text/css">
        .preview-panel {font-family: Trebuchet MS, Tahoma, Verdana, Arial, sans-serif; 
                        font-size: .8em;
                        padding: 5px;
        }
    </style>

</head>
<body>
    <form id="form1" runat="server">
        <div class="preview-panel" style="font-size: 1em; font-weight: bold;"><%=LocalizeDisplay("Preview")%></div>
        <div style="height: 400px; width: 745px; overflow: auto; margin: 5px; border: 1px solid #CCC; padding: 10px; background-color: #FFF;">
           <div id="divMessage" runat="server" visible="false" 
                style="border: 1px solid red; background-color:#FFFACD; 
                       width:95%; font-family: Verdana,Tahoma,Arial,Helvetica,sans-serif; 
                       color:Red; font-size: 10pt; padding:8px; margin-bottom:8px;">&nbsp;</div>
            <asp:PlaceHolder ID="phXModPro" runat="server" />
        </div>
    </form>
    
    <script type="text/javascript">
      if (typeof jQuery != 'undefined') {
        jQuery(document).ready( function(){
            jQuery('form').removeAttr('action');
            jQuery('form').removeAttr('onsubmit');
            jQuery('form').submit( function(){return false;});
        });
      }
    </script>    
</body>
</html>
