<%@ Page Language="vb" AutoEventWireup="false" Debug="true" CodeBehind="PreviewForm.aspx.vb" Inherits="KnowBetter.XModPro.PreviewForm" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Preview Form</title>
    <link title="xmp-theme" rel="stylesheet" type="text/css" href="styles/notheme.css" />
    
    <style type="text/css">
        .preview-panel {font-family: Trebuchet MS, Tahoma, Verdana, Arial, sans-serif; 
                        font-size: .8em;
                        padding: 5px;
        }
    </style>
    
    <!-- needed by the preview form -->
    <script type="text/javascript" src="scripts/jquery.min.js"></script>
    
</head>
<body style="background-color:Transparent;">
    <form id="form1" runat="server">
        <div id="divStyleswitcher" class="preview-panel" runat="server">
            <div>
                <asp:label ID="lblThemes" AssociatedControlID="ddlStyles" runat="server"><%=LocalizeDisplay("SelectATheme")%> </asp:label>
                <asp:DropDownList ID="ddlStyles" runat="server"></asp:DropDownList> 
                <span id="spnCorners" style="display:none;">
                    <input type="checkbox" id="chkUseRoundedCorners" /> 
                    <label for="chkUseRoundedCorners"><%=LocalizeDisplay("UseRoundedCorners")%></label>
                </span>
            </div>
        </div>
        <div class="preview-panel" style="font-size: 1em; font-weight: bold;"><%=LocalizeDisplay("Preview")%></div>
        <div style="height: 400px; width: 745px; overflow: auto; margin: 5px; border: 1px solid #CCC; padding: 10px; background-color: #FFF;">
            <asp:PlaceHolder ID="phForm" runat="server" />
        </div>
    </form>
    <script type="text/javascript">
        jQuery(document).ready( function(){
            jQuery('form').removeAttr('action');
            jQuery('form').removeAttr('onsubmit');
            jQuery('form').submit( function(){return false;});
            if ('<%=GetStyleCtrlId%>' != ''){
                jQuery('#ddlStyles').change( function(){
                    switchThemes(jQuery(this).val());
                });
                jQuery('#chkUseRoundedCorners').click( function(){
                    switchThemes(jQuery('#ddlStyles').val());
                });
            }
        });
        
        function switchThemes(newTheme){
            switch (newTheme)
            {
            	case 'none':
                    jQuery('.xmp-form').removeClass('ui-widget ui-widget-content');
				    jQuery('.xmp-validation-summary, .xmp-validation').removeClass('NormalRed ui-state-error ui-corner-all');		
		            jQuery('.xmp-form').removeClass('ui-corner-all');
		            jQuery('.xmp-form-label').removeClass('NormalBold');
		            jQuery('.xmp-button').removeClass('CommandButton');
		            jQuery("input[type='text'],textarea,select").removeClass("NormalTextBox");
		            jQuery('#spnCorners').hide()
            		break;
            	case 'dnn':
                    jQuery('.xmp-form').removeClass('ui-widget ui-widget-content');
				    jQuery('.xmp-validation-summary, .xmp-validation').addClass('NormalRed').removeClass('ui-state-error ui-corner-all');		
		            jQuery('.xmp-form').removeClass('ui-corner-all');
		            jQuery('.xmp-form-label').addClass('NormalBold');
		            jQuery('.xmp-button').addClass('CommandButton');
		            jQuery("input[type='text'],textarea,select").removeClass("NormalTextBox");
		            jQuery('#spnCorners').hide()
            	    break;
            	default:
                    jQuery('.xmp-form').addClass('ui-widget ui-widget-content');
				    jQuery('.xmp-validation-summary, .xmp-validation').addClass('ui-state-error').removeClass('NormalRed');		
		            jQuery('.xmp-form-label').removeClass('NormalBold');
		            jQuery('.xmp-button').removeClass('CommandButton');
		            jQuery("input[type='text'],textarea,select").removeClass("NormalTextBox");
                    jQuery("link[title='xmp-theme']").get(0).href= newTheme;
		            jQuery('#spnCorners').show();
		            if (jQuery('#chkUseRoundedCorners').get(0).checked) {
    				    jQuery('.xmp-validation-summary, .xmp-validation').addClass('ui-corner-all');		
    		            jQuery('.xmp-form').addClass('ui-corner-all');
		            }
		            else {
    				    jQuery('.xmp-validation-summary, .xmp-validation').removeClass('ui-corner-all');		
    		            jQuery('.xmp-form').removeClass('ui-corner-all');
		            }
           }
           jQuery('#hidStyle').val(newTheme);
        }
    </script>
    <input type="hidden" id="hidStyle" />
</body>
</html>
