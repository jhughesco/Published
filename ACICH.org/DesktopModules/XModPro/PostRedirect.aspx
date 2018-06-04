<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="PostRedirect.aspx.vb" Inherits="KnowBetter.XModPro.PostRedirect" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>PostRedirect</title>

	<script type="text/javascript" language="javascript">
	function submitForm() {
		var theForm = document.getElementById('frmMain');
		var redir = document.getElementById('targeturl');
		theForm.action = redir.value;
		document.forms[0].submit();
	}
	</script>
</head>
<body onload="submitForm();">
		<form id="frmMain" action="" method="post">
			<asp:placeholder id="phForm" runat="server" />
			<noscript>
				<input type="submit" value="Click to Continue">
			</noscript>
		</form>
</body>
</html>
