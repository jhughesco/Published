<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FeedBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Feed runat="server" ContentType="text/html">

<ListDataSource CommandText="SELECT COUNT(*) AS TotalCount FROM Users WHERE Email = @Email">
  <Parameter Name="Email" Value='<%#FormData("x")%>' DataType="String" />
</ListDataSource>

<ItemTemplate><%#Eval("Values")("TotalCount")%></ItemTemplate>

</xmod:Feed></xmod:masterview>