<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="HelpHost.aspx.vb" Inherits="KnowBetter.XModPro.HelpHost" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head" runat="server">
    <title>XMod Pro - Help</title>
    
    <link rel="stylesheet" type="text/css" media="screen" href="styles/ui-lightness/ui-lightness.css" />

    <style type="text/css">
        body {background-color: Transparent; border:none;}
        #xmp-help-source-list li {margin-bottom: 8px;}
        .xmp-help-list li {overflow: hidden; padding-left: 15px;}
        .xmp-help-list img {float:left;}
    </style>

    <script  src="scripts/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/jquery-ui.min.js" type="text/javascript"></script>
</head>
<body style="height: 600px;" class="ui-widget">
    <p>Help for XMod Pro is available from a variety of sources:</p>
    <ul id="xmp-help-source-list">
        <li><strong>Documentation:</strong> Your version of XMod Pro came with a compiled help file (CHM) and Acrobat (PDF) version 
        of the help file. You'll find it in the Documentation folder in your original zip file. You can also download the 
        latest versions from our <a href="http://dnndev.com/Clients/Downloads.aspx">website</a></li>
        <li><strong>Online Help:</strong> When using the text editors for editing forms and templates, you'll see a drop-down list of available tags. 
        Selecting an item will pop-up its associated help topic, complete with syntax, usage notes, and a usage example.</li>
        <li><strong>Video Tutorials:</strong> We're creating a growing collection of videos to help you work effectively with XMod Pro. You'll find the 
        list of them <a href="#xmp-help-container">below</a> (internet access required). As the collection grows, the list will be updated, so check back regularly.</li>
        <li><strong>Get Answers:</strong> If you haven't found an answer to your question, try our Answers page. There you'll find a friendly community of 
        XMod Pro users who probably have an answer for you. While you're there, please answer any questions you can and help the community grow. 
        <a href="http://dnndev.com/Learn/Answers.aspx">Visit the Answers Page</a></li>
        <li><strong>Training/Consulting:</strong> We also offer one-on-one, online training for a fee. It's a great way to get up and running quickly or to get 
        help with an upcoming project. <a href="http://dnndev.com/Products/Training.aspx">Learn More</a></li>
    </ul>
    
    <div id="xmp-help-container" class="ui-widget-content ui-corner-all" style="overflow:auto; max-height:800px"><%= GetVideoFeed()%></div>
    
    <script type="text/javascript">
        jQuery(document).ready(function () {
            var hlpFrame = jQuery('#xmp-help-container');
            //hlpFrame.load('<%=GetHelpFeedUrl()%>');
        });
    </script>
</body>
</html>
