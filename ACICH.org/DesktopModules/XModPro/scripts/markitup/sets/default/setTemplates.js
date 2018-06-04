// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Html tags
// http://en.wikipedia.org/wiki/html
// ----------------------------------------------------------------------------
// Basic set. Feel free to add more tags
// ----------------------------------------------------------------------------
mySettings = {	
	onShiftEnter:  	{keepDefault:false, replaceWith:'<br />\n'},
	onCtrlEnter:  	{keepDefault:false, openWith:'\n<p>', closeWith:'</p>'},
	onTab:    		{keepDefault:false, replaceWith:'  '},
	markupSet:  [ 	
		{name:'Bold', key:'B', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)' },
		{name:'Italic', key:'I', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)'  },
		{name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
		{separator:'---------------' },
		{name:'Picture', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
		{name:'Link', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
		{name:'Table', openWith:'<table>\n  <tbody>\n    <tr>\n      <td>', closeWith:'\n      </td>\n    </tr>\n  </tbody>\n</table>'}, 
		{separator:'---------------' },
		{name:'Tokens', dropMenu:[
		    {name:'Data Parameter Values', dropMenu:[
		        {name:'From ListDataSource', replaceWith:'[[YourTemplateID_list@ParameterName]]'}, 
		        {name:'From DetailDataSource', replaceWith:'[[YourTemplateID_detail@ParameterName]]'}
		        ]},
		    {name:'Field', replaceWith:'[[[![Field Name:]!]]]'},
		    {name:'Join', replaceWith:'[[Join("text {0} {1}","Item1","Item2")]]'},
		    {name:'Module', openWith:'[[Module:', closeWith:']]', dropMenu:[
		        {name:'ID', replaceWith:'[[Module:ID]]'}, 
		        {name:'Tab ID', replaceWith:'[[Module:TabId]]'} 
		        ]},
		    {name:'Portal', openWith:'[[Portal:', closeWith:']]', dropMenu:[
		        {name:'Alias', replaceWith:'[[Portal:Alias]]'}, 
		        {name:'Description', replaceWith:'[[Portal:Description]]'}, 
		        {name:'Email', replaceWith:'[[Portal:Email]]'}, 
		        {name:'Expiry', replaceWith:'[[Portal:Expiry]]'}, 
		        {name:'Home Directory', replaceWith:'[[Portal:HomeDirectory]]'}, 
		        {name:'Home&nbsp;Directory&nbsp;(mapped)', replaceWith:'[[Portal:HomeDirectoryMapped]]'}, 
		        {name:'Home Tab ID', replaceWith:'[[Portal:HomeTabId]]'},
		        {name:'ID', replaceWith:'[[Portal:ID]]'}, 
		        {name:'Login Tab ID', replaceWith:'[[Portal:LoginTabId]]'}, 
		        {name:'Logo File', replaceWith:'[[Portal:LogoFile]]'}, 
		        {name:'Name', replaceWith:'[[Portal:Name]]'}, 
		        {name:'Time Zone Offset', replaceWith:'[[Portal:TimeZoneOffset]]'} 
		        ]},
		    {name:'Request', dropMenu:[
		        {name:'Agent', replaceWith:'[[Request:Agent]]'}, 
		        {name:'Browser', replaceWith:'[[Request:Browser]]'}, 
		        {name:'Host IP Address', replaceWith:'[[Request:HostAddress]]'}, 
		        {name:'Host Name', replaceWith:'[[Request:HostName]]'}, 
		        {name:'POST Parameter', replaceWith:'[[Form:parameterName]]'}, 
		        {name:'Referring URL', replaceWith:'[[Request:Referrer]]'}, 
		        {name:'URL', replaceWith:'[[Request:URL]]'}, 
		        {name:'URL Parameter', replaceWith:'[[Url:parameterName]]'} 
		        ]},
		    {name:'User', openWith:'[[User:', closeWith:']]', dropMenu:[
		        {name:'Display Name', replaceWith:'[[User:DisplayName]]'}, 
		        {name:'Email', replaceWith:'[[User:Email]]'}, 
		        {name:'First Name', replaceWith:'[[User:FirstName]]'}, 
		        {name:'ID', replaceWith:'[[User:ID]]'}, 
		        {name:'Last Name', replaceWith:'[[User:LastName]]'}, 
		        {name:'Username', replaceWith:'[[User:Username]]'}
		        ]}
		    ]},
		{name:'Tags', dropMenu:[
		    {name:'Buttons', dropMenu:[
		        {name:'Add', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:AddButton Text="Add" />'},
		            {name:'Image', replaceWith:'<xmod:AddImage AlternatText="Add" ImageUrl="" />'},
		            {name:'Link', replaceWith:'<xmod:AddLink Text="Add" />'} 
		        ]}, 
		        {name:'Command', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:CommandButton Text="Text">\n  <Command Target="templateID" Type="List|Detail">\n    <Parameter Name="name" Value="value"/>\n  </Command>\n</xmod:CommandButton>'},
		            {name:'Image', replaceWith:'<xmod:CommandImage AlternateText="Text" ImageUrl="">\n  <Command Target="templateID" Type="List|Detail">\n    <Parameter Name="name" Value="value"/>\n  </Command>\n</xmod:CommandImage>'}, 
		            {name:'Link', replaceWith:'<xmod:CommandLink Text="Text">\n  <Command Target="templateID" Type="List|Detail">\n    <Parameter Name="name" Value="value"/>\n  </Command>\n</xmod:CommandLink>'} 
		        ]},
		        {name:'Delete', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:DeleteButton Text="Delete">\n  <Parameter Name="name" Value="value"/>\n</xmod:DeleteButton>'}, 
		            {name:'Image', replaceWith:'<xmod:DeleteImage AlternateText="Delete" ImageUrl="">\n    <Parameter Name="name" Value="value"/>\n</xmod:DeleteImage>'}, 
		            {name:'Link', replaceWith:'<xmod:DeleteLink Text="Delete">\n  <Parameter Name="name" Value="value"/>\n</xmod:DeleteLink>'} 
		        ]},
		        {name:'Edit', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:EditButton Text="Edit">\n  <Parameter Name="name" Value="value"/>\n</xmod:EditButton>'}, 
		            {name:'Image', replaceWith:'<xmod:EditImage AlternateText="Edit" ImageUrl="">\n    <Parameter Name="name" Value="value"/>\n</xmod:EditImage>'}, 
		            {name:'Link', replaceWith:'<xmod:EditLink Text="Edit">\n  <Parameter Name="name" Value="value"/>\n</xmod:EditLink>'}  
		        ]},
		        {name:'Redirect', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:Redirect Display="Button" Text="Redirect" Method="Get|Post" Target="">\n  <Field Name="name" Value="value"/>\n</xmod:Redirect>'}, 
		            {name:'Image', replaceWith:'<xmod:Redirect Display="ImageButton" AlternateText="Redirect" ImageUrl="" Method="Get|Post" Target="">\n    <Field Name="name" Value="value"/>\n</xmod:Redirect>'}, 
		            {name:'Link', replaceWith:'<xmod:Redirect Display="LinkButton" Text="Redirect" Method="Get|Post" Target="">\n  <Field Name="name" Value="value"/>\n</xmod:Redirect>'} 
		        ]},
		        {name:'Return', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:ReturnButton Text="Return" />'}, 
		            {name:'Image', replaceWith:'<xmod:ReturnImage AlternatText="Return" ImageUrl="" />'}, 
		            {name:'Link', replaceWith:'<xmod:ReturnLink Text="Return" />'}  
		        ]},
		        {name:'Toggle', dropMenu:[
		            {name:'Button', replaceWith:'<xmod:ToggleButton Text="Toggle" Target="ElementClientId" />'}, 
		            {name:'Image', replaceWith:'<xmod:ToggleImage AlternatText="Toggle" ImageUrl="" Target="ElementClientId" />'}, 
		            {name:'Link', replaceWith:'<xmod:ToggleLink Text="Toggle" Target="ElementClientId" />'} 
		        ]},
		    ]},
		    {name:'Format', dropMenu:[
		        {name:'Numeric', replaceWith:'<xmod:Format Type="Numeric" Value="1" Pattern="#0" />'}, 
		        {name:'Float', replaceWith:'<xmod:Format Type="Float" Value="1.01" Pattern="c" />'}, 
		        {name:'Date', replaceWith:'<xmod:Format Type="Date" Value="12/31/2012" Pattern="ddd MMM dd yyyy" />'}, 
		        {name:'Text', replaceWith:'<xmod:Format Type="Text" Value="Value1:{0}, Value2:{1}" Replacement="123,George" />'}, 
		        {name:'Regular Expression', replaceWith:'<xmod:Format Type="RegEx" Value="123-456-7890" Pattern="(\d{3})-(\d{3})-(\d{4})" Replacement="$1.$2.$3" />'}, 
		        {name:'Cloak', replaceWith:'<xmod:Format Type="Cloak" Value="me@mysite.com" />'}, 
		        {name:'HtmlEncode', replaceWith:'<xmod:Format Type="HtmlEncode" Value="<h1>Headline</h1>" />'}, 
		        {name:'HtmlDecode', replaceWith:'<xmod:Format Type="HtmlDecode" Value="&lt;h1&gt;Headline&lt;/h1&gt;" />'}, 
		        {name:'UrlEncode', replaceWith:'<xmod:Format Type="UrlEncode" Value="John & Sons" />'}, 
		        {name:'UrlDecode', replaceWith:'<xmod:Format Type="UrlDecode" Value="John+%26+Sons" />'} 
		        ]},
		    {name:'MetaTags', replaceWith:'<xmod:MetaTags>\n  <Title Append="True">Title</Title>\n  <Keywords Append="True">Keywords</Keywords>\n  <Description Append="True">Description</Description>\n</xmod:MetaTags>'},
		    {name:'Register', replaceWith:'<xmod:Register TagPrefix="" Namespace="" Assembly="" />'},
		    {name:'ScriptBlock', dropMenu:[
		        {name:'Client Script', replaceWith:'<xmod:ScriptBlock BlockType="ClientScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</xmod:ScriptBlock>'}, 
		        {name:'Client Script Include', replaceWith:'<xmod:ScriptBlock BlockType="ClientScriptInclude" ScriptId="" RegisterOnce="True" Url="" />'}, 
		        {name:'Head Script', replaceWith:'<xmod:ScriptBlock BlockType="HeadScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</xmod:ScriptBlock>'}, 
		        {name:'Startup Script', replaceWith:'<xmod:ScriptBlock BlockType="StartupScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</xmod:ScriptBlock>'} 
		        ]},
		    {name:'Select', dropMenu:[
		        {name:'Select', replaceWith:'<xmod:Select>\n  \n</xmod:Select>'}, 
		        {name:'Case - Boolean', replaceWith:'<Case CompareType="Boolean" Value="0" Expression="False" Operator="<>|=">\n  \n</Case>'}, 
		        {name:'Case - Date', replaceWith:'<Case CompareType="Date" Value="12/31/2012" Expression="12/31/2012" Operator="<|>|<>|=|<=|>=">\n  \n</Case>'}, 
		        {name:'Case - Float', replaceWith:'<Case CompareType="Float" Value="999.99" Expression="999.99" Operator="<|>|<>|=|<=|>=">\n  \n</Case>'}, 
		        {name:'Case - Numeric', replaceWith:'<Case CompareType="Numeric" Value="999" Expression="999" Operator="<|>|<>|=|<=|>=">\n  \n</Case>'}, 
		        {name:'Case - Regular&nbsp;Expression', replaceWith:'<Case CompareType="Regex" Value="999.99" Expression="\d{3}\.\d{{2}" Operator="<>|=">\n  \n</Case>'}, 
		        {name:'Case - Role', replaceWith:'<Case CompareType="Role" Expression="Role1,Role2" Operator="<>|=">\n  \n</Case>'}, 
		        {name:'Case - Text', replaceWith:'<Case CompareType="Text" Value="value" Expression="test" Operator="<|>|<>|=|<=|>=" IgnoreCase="True|False">\n  \n</Case>'}, 
		        {name:'Else', replaceWith:'<Else>\n  \n</Else>'} 
		        ]},
		    {name:'Template', dropMenu:[
		        {name:'Template', replaceWith:'<xmod:Template>\n  \n</xmod:Template>'}, 
		        {name:'ListDataSource', replaceWith:'<ListDataSource CommandText="">\n  <Paramter Name="name" Value="value" />\n</ListDataSource>'}, 
		        {name:'DetailDataSource', replaceWith:'<DetailDataSource CommandText="">\n  <Paramter Name="name" Value="value" />\n</DetailDataSource>'}, 
		        {name:'DeleteCommand', replaceWith:'<DeleteCommand CommandText="">\n  <Paramter Name="name" Value="value" />\n</DeleteCommand>'}, 
		        {name:'Pager', replaceWith:'<Pager PageSize="10">\n  Page {PageNumber} of {PageCount} {Pager}\n</Pager>'}, 
		        {name:'Search/Sort', replaceWith:'<SearchSort FilterExpression="" SortFieldNames="Field1,Field2" SortFieldLabels="Field One,Field Two"/>'}, 
		        {name:'Header Template', replaceWith:'<HeaderTemplate>\n  </HeaderTemplate>'}, 
		        {name:'Item Template', replaceWith:'<ItemTemplate>\n  </ItemTemplate>'}, 
		        {name:'Alternating Item Template', replaceWith:'<AlternatingItemTemplate>\n  </AlternatingItemTemplate>'}, 
		        {name:'Separator Template', replaceWith:'<SeparatorTemplate>\n  </SeparatorTemplate>'}, 
		        {name:'Footer Template', replaceWith:'<FooterTemplate>\n  </FooterTemplate>'}, 
		        {name:'Detail Template', replaceWith:'<DetailTemplate>\n  </DetailTemplate>'}, 
		        {name:'No Items Template', replaceWith:'<NoItemsTemplate>\n  </NoItemsTemplate>'} 
		        ]}
		    ]}
	]
}