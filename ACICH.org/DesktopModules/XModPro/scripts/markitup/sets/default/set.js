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
		{name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
		{name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
		{name:'Table', openWith:'<table>\n  <tbody>\n    <tr>\n      <td>', closeWith:'\n      </td>\n    </tr>\n  </tbody>\n</table>'}, 
		{separator:'---------------' },
		{name:'Tokens', key:'T', dropMenu:[
		    {name:'Field', key:'F', replaceWith:'[[[![Field Name:]!]]]'},
		    {name:'Portal', key:'P', openWith:'[[Portal:', closeWith:']]', dropMenu:[
		        {name:'ID', replaceWith:'[[Portal:ID]]'}, 
		        {name:'Name', replaceWith:'[[Portal:Name]]'}, 
		        {name:'Email', replaceWith:'[[Portal:Email]]'}, 
		        {name:'Logo', replaceWith:'[[Portal:LogoFile]]'}, 
		        {name:'Home Directory', replaceWith:'[[Portal:HomeDirectory]]'}, 
		        {name:'Home&nbsp;Directory&nbsp;(mapped)', replaceWith:'[[Portal:HomeDirectoryMapped]]'}, 
		        {name:'Home Tab ID', replaceWith:'[[Portal:HomeTabId]]'}
		        ]},
		    {name:'User', openWith:'[[User:', closeWith:']]', dropMenu:[
		        {name:'ID', replaceWith:'[[User:ID]]'}, 
		        {name:'First Name', replaceWith:'[[User:FirstName]]'}, 
		        {name:'Last Name', replaceWith:'[[User:LastName]]'}, 
		        {name:'Display Name', replaceWith:'[[User:DisplayName]]'}, 
		        {name:'Username', replaceWith:'[[User:Username]]'}
		        ]},
		    ]},
		{name:'Tags', key:'G', dropMenu:[
		    {name:'Buttons', dropMenu:[
		        {name:'AddButton', replaceWith:'<AddButton Text="Add" />'}, 
		        {name:'AddImage', replaceWith:'<AddImage AlternatText="Add" ImageUrl="" />'}, 
		        {name:'AddLink', replaceWith:'<AddLink Text="AddLink" />'}, 
		        {name:'CalendarButton', replaceWith:'<CalendarButton Text="Select Date" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'CalendarImage', replaceWith:'<CalendarImage AlternateText="Select Date" ImageUrl="" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'CalendarLink', replaceWith:'<CalendarLink Text="Select Date" Target="" Format="yyyy-MM-dd" />'}, 
		        {name:'CancelButton', replaceWith:'<CancelButton Text="Cancel" />'}, 
		        {name:'CancelImage', replaceWith:'<CancelImage AlternatText="Cancel" ImageUrl="" />'}, 
		        {name:'CancelLink', replaceWith:'<CancelLink Text="CancelLink" />'}, 
		        {name:'UpdateButton', replaceWith:'<UpdateButton Text="Update" />'}, 
		        {name:'UpdateImage', replaceWith:'<UpdateImage AlternatText="Update" ImageUrl="" />'}, 
		        {name:'UpdateLink', replaceWith:'<UpdateLink Text="UpdateLink" />'} 
		        ]},
		    {name:'List Controls', dropMenu:[
		        {name:'CheckBoxList', replaceWith:'<CheckBoxList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</CheckBoxList>'}, 
		        {name:'DropDownList', replaceWith:'<DropDownList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</DropDownList>'}, 
		        {name:'ListBox', replaceWith:'<ListBox ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</ListBox>'}, 
		        {name:'RadioButtonList', replaceWith:'<RadioButtonList ID="" DataField="" DataType="string">\n  <ListItem Value="">Item One</ListItem>\n  <ListItem Value="">Item Two</ListItem>\n</RadioButtonList>'} 
		        ]},
		    ]},
		{separator:'---------------' },
		{name:'Clean', className:'clean', replaceWith:function(markitup) { return markitup.selection.replace(/<(.*?)>/g, "") } },		
		{name:'Preview', className:'preview',  call:'preview'}
	]
}