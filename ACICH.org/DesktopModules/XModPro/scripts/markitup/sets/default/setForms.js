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
		    {name:'Module', key:'P', openWith:'[[Module:', closeWith:']]', dropMenu:[
		        {name:'ID', replaceWith:'[[Module:ID]]'}, 
		        {name:'Tab ID', replaceWith:'[[Module:TabId]]'} 
		        ]},
		    {name:'Portal', key:'P', openWith:'[[Portal:', closeWith:']]', dropMenu:[
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
		        ]},
		    {name:'Field', replaceWith:'[[[![Field Name:]!]]]'},
		    {name:'Join', replaceWith:'[[Join("text {0} {1}","Item1","Item2")]]'}
		    ]},
		{name:'Tags', dropMenu:[
		    {name:'Add Form', replaceWith:'<AddForm>\n  </AddForm>'},
		    {name:'Buttons', dropMenu:[
		        {name:'Add Button', replaceWith:'<xmod:AddButton Text="Add" />'}, 
		        {name:'Add Image', replaceWith:'<AddImage AlternatText="Add" ImageUrl="" />'}, 
		        {name:'Add Link', replaceWith:'<AddLink Text="AddLink" />'}, 
		        {name:'Calendar Button', replaceWith:'<CalendarButton Text="Select Date" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'Calendar Image', replaceWith:'<CalendarImage AlternateText="Select Date" ImageUrl="" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'Calendar Link', replaceWith:'<CalendarLink Text="Select Date" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'Cancel Button', replaceWith:'<CancelButton Text="Cancel" />'}, 
		        {name:'Cancel Image', replaceWith:'<CancelImage AlternateText="Cancel" ImageUrl="" />'}, 
		        {name:'Cancel Link', replaceWith:'<CancelLink Text="CancelLink" />'}, 
		        {name:'Update Button', replaceWith:'<UpdateButton Text="Update" />'}, 
		        {name:'Update Image', replaceWith:'<UpdateImage AlternateText="Update" ImageUrl="" />'}, 
		        {name:'Update Link', replaceWith:'<UpdateLink Text="UpdateLink" />'} 
		        ]},
		    {name:'CheckBox', replaceWith:'<CheckBox ID="" DataField="" DataType="Boolean" Text="" Checked="False"/>'},
		    {name:'Container Controls', dropMenu:[
		        {name:'Tabstrip', replaceWith:'<Tabstrip>\n  <Tab Text="">\n    \n  </Tab>\n</Tabstrip>'},
    		    {name:'Panel', openWith:'<Panel>', closeWith:'</Panel>'},
		    ]},
		    {name:'Data Controls', dropMenu:[
    		    {name:'ControlDataSource', replaceWith:'<ControlDataSource ID="" CommandText="">\n  <Parameter Name="" Value="" />\n</ControlDataSource>'},
    		    { name: 'Select Command', replaceWith: '<SelectCommand CommandText="">\n  <Parameter Name="" Value="" />\n</SelectCommand>' },
    		    { name: 'Submit Command', replaceWith: '<SubmitCommand CommandText="">\n  <Parameter Name="" Value="" />\n</SubmitCommand>' },
    		    { name: 'Variable', replaceWith: '<Variable Name="" Value="" DataType="String" />' }	    
		    ]},
		    {name:'Edit Form', replaceWith:'<EditForm>\n  </EditForm>'},
		    {name:'Email', replaceWith:'<Email To="" From="" Subject="" Format="Text|Html">\n  \n</Email>'},
		    {name:'File Upload', replaceWith:'<FileUpload ID="" DataField="" DataType="String" Extensions="" Path="" />'},
		    {name:'Input Controls', dropMenu:[
    		    {name:'Date Input', replaceWith:'<DateInput ID="" DataField="" DataType="DateTime" DateOnly="True" />'},
    		    {name:'Html Input', replaceWith:'<HtmlInput ID="" DataField="" DataType="String" />'},
    		    {name:'Password', replaceWith:'<Password ID="" DataField="" DataType="String" />'},
		        {name:'Textarea', replaceWith:'<Textarea ID="" DataField="" DataType="String" />'},
		        {name:'TextBox', replaceWith:'<TextBox ID="" DataField="" DataType="String" />'}
		    ]},
		    {name:'Label', replaceWith:'<Label ID="" For="ControlId" Text="" />'},
		    {name:'List Controls', dropMenu:[
		        {name:'CheckBox List', replaceWith:'<CheckBoxList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</CheckBoxList>'}, 
		        {name:'DropDown List', replaceWith:'<DropDownList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</DropDownList>'}, 
		        {name:'List Box', replaceWith:'<ListBox ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</ListBox>'}, 
		        {name:'Radio Button List', replaceWith:'<RadioButtonList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</RadioButtonList>'} 
		        ]},
		    {name:'Radio Button', replaceWith:'<RadioButton ID="" DataField="" DataType="Boolean" Text="" Checked="False"/>'},
		    {name:'Register', replaceWith:'<Register TagPrefix="" Namespace="" Assembly="Boolean" />'},
		    {name:'Script Block', dropMenu:[
		        {name:'Client Script', replaceWith:'<ScriptBlock BlockType="ClientScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</ScriptBlock>'}, 
		        {name:'Client Script Include', replaceWith:'<ScriptBlock BlockType="ClientScriptInclude" ScriptId="" RegisterOnce="True" Url="" />'}, 
		        {name:'Head Script', replaceWith:'<ScriptBlock BlockType="ClientScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</ScriptBlock>'}, 
		        {name:'Startup Script', replaceWith:'<ScriptBlock BlockType="StartupScript" ScriptId="" RegisterOnce="True">\n  <script type="text/javascript">\n    \n  </script>\n</ScriptBlock>'} 
		        ]},
		    {name:'Success Templates', dropMenu:[
		        {name:'Add Success Template', replaceWith:'<AddSuccessTemplate>\n  <ItemTemplate>\n    \n  </ItemTemplate>\n</AddSuccessTemplate>'},
		        {name:'Continue Button', replaceWith:'<xmod:ContinueButton Text="Continue" />'}, 
		        {name:'Continue Image', replaceWith:'<xmod:ContinueImage AlternateText="Continue" ImageUrl="" />'}, 
		        {name:'Continue Link', replaceWith:'<xmod:ContinueLink Text="Continue" />'},
		        { name: 'Edit Success Template', replaceWith: '<EditSuccessTemplate>\n  <ItemTemplate>\n    \n  </ItemTemplate>\n</EditSuccessTemplate>' } 
		        ]},
		    {name:'Text', replaceWith:'<Text DataField="" />'}
		    ]},
	    {name:'Validation', dropMenu:[
	        { name: 'CAPTCHA', replaceWith: '<Captcha CaptchaLength="5" />'},
	        { name: 'Checkbox', replaceWith: '<Validate Type="Checkbox" Target="ControlId" MustBeChecked="True" Text="**" Message="Box Must Be Checked" />'},
	        { name: 'Compare', replaceWith: '<Validate Type="Compare" Target="ControlId" CompareValue="" DataType="" Text="**" Message="" Operator="Equal|NotEqual|GreaterThan|GreaterThanEqual|LessThan|LessThanEqual|DataTypeCheck" />' },
	        { name: 'Email', replaceWith: '<Validate Type="Email" Text="**" Target="ControlId" Message="" />' },
	        { name: 'Range', replaceWith: '<Validate Type="Range" Target="ControlId" MinimumValue="" MaximumValue="" DataType="" Text="**" Message="" />' },
	        { name: 'Regular Expression', replaceWith: '<Validate Type="RegEx" Target="ControlId" ValidationExpression="" Text="**" Message="" />' },
	        { name: 'Required', replaceWith: '<Validate Type="Required" Target="ControlId" Text="**" Message="" />' },
	        { name: 'Validation Summary', replaceWith: '<ValidationSummary DisplayMode="List|BulletList|SingleParagraph" HeaderText="" />'},
	        { name: 'XML', replaceWith: '<Validate Type="Xml" Target="ControlId" Text="**" Message="" />' }
	    ]}
	]
}