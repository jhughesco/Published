/*
Filename: xmod-hint.js
Author: Frederick King
XMod Pro code completion using codemirror lib
	
http://codemirror.net/
http://codemirror.net/demo/complete.html
http://codemirror.net/lib/util/simple-hint.js
http://codemirror.net/lib/util/javascript-hint.js
	 
TODOS
**************************************************
- Activate a pop-up list of choices on CTRL+SPACE 
- If activated outside an XMP tag or other tag (like HTML tag), pop-up a list of XMP template tags when used for editing templates. 
- If activated outside an XMP tag or other tag (like HTML tag), pop-up a list of XMP form tags when used for editing forms. 
- Pop-up a list of tag-specific properties for each XMP tag. 
- Selected item should be inserted intot the editor where the cursor currently is 
- If activated following "[[", pop-up a list of XMP tokens 
- If activated following "[[Portal:", pop up a list of possible items 
- SUGAR - Engine should be able to tell its context
- SUGAR - Engine should be able to pop-up a list of property values if those values are enumerated 
	
URGENT
***************************************************
1)      On templates  inside the <DetailTemplate> tag is the only place you can use <xmod:ReturnButton>, <xmod:ReturnImage>, and <xmod:ReturnLink>. How do I specify that in the xmod-hint.js file so that the return button tags only show up when the user is inside the <DetailTemplate> tag? The answer will be useful not only for this specific item but to determine what tags are allowed inside the <HeaderTemplate> vs. the <ItemTemplate> tags.
		
--Looks like the first item was an issue with the logic in the script. It seems like i might have been trying to get around casing issues but I cant remember exactly what I had in mind.  Anyway it doesnt seem like there is a consistent way to that right now so I've backed out of that. Ive updated the script to fix the issue by removing the parts where the script is forcing asome strings to be lowercased. The tags have to be case sensitive. 

2)      How should I approach implementing Form tags?  Right now if I add them to xmod-hint.js, the form tags and template tags are mixed together.  My first guess is to create an xmod-hint-form.js file that duplicates xmod-hint but has just the form tags. But I wanted to see if you had intended I implement form tags in a different manner.

-- There does'nt seem to be a  reason for creating 2 separate files with the same functionality. I think it just needed a little more organization. I've created two vars ( xmpTemplateDefs, xmpFormDefs )  to hold all the tags. I also pulled them to the top of the file  so they wouldnt just be mixed in with functions.  Next, I've added a global var in the index file ( window.xmpCCDefinition ) as a way to specify if you want to use the form definitions vs the templates.  So if you're initializing the editor for a form you can set the var to form.   

3)      <xmod:CommandButton>  This should contain <Command> and only <Command>. In turn, the <Command> tag should only allow <Parameter> tags.  What I find happening is that when I m inside the <xmod:CommandButton> tag and activate the auto-complete, I get <Command> plus an empty line plus a line that contains <xmod:AddButton> <xmod:AddImage>   and many more
	
-- I've removed the part of the code that just blindly added the context free tags to the end of a list.  They can just be specified in template tag context. 
	
	
	
UPDATES
***************************************************
	
2/3/2012
*********
- Removed the tolowercase function.  This was originally intended to help with casing issues but they logic is flawed. There isnt an obvious consitent solution that i can  come up with to fix the casing issues. 
- Created vars to hold definitions
- Moved definitiion vars to top of the file. 
- Added config value to give the ability to specify which definition set to use (templates vs forms)
- Removed .split(' ') from definition vars.  Moved this functionality  so it doesn't need to be added so many times.  
- Added more enumerated properties...And then realized that thats not implemented yet :(
- Added DetailTemplate and xmod:CommandButton to context tags for testing 
	
2/15/2012
***********
- Moved some of the context checking pieces into functions. Mainly this was to be able to call a the context tag chunk recursively.  
- Update the order of the if statements in the getCompletions function

2/20/2012
***********
- Updated checkState function to make sure that if multiple tokens in the same string get the last one and also ignore complete tags. 
- Commented out console.log function in token tests
	
*/
;(function () {
    "use strict"
    /* *
    * Template Definition Var
    * */
    var imageProps = 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Style Width';
    var buttonProps = 'CssClass Height OnClientClick Style Text Width';
    var loadFeedButtonProps = 'FeedName Height IDSelector InfinitePaging InsertMode LoadingCssClass LoadingImageUrl Target Width';
    var ajaxButtonProps = 'CssClass Height LoadingCssClass LoadingImageUrl OnError OnSuccess Style Target Url Width';
    var templateTags = 'xmod:AddButton xmod:AddImage xmod:AddLink ' + 
        'xmod:AjaxButton xmod:AjaxImage xmod:AjaxLink ' + 
        'xmod:CommandButton xmod:CommandImage xmod:CommandLink ' + 
        'xmod:DeleteButton xmod:DeleteImage xmod:DeleteLink xmod:DetailButton xmod:DetailImage ' + 
        'xmod:DetailLink xmod:EditButton xmod:EditImage xmod:EditLink xmod:Format ' + 
        'xmod:IfEmpty xmod:IfNotEmpty ' + 
        'xmod:LoadFeed xmod:LoadFeedButton xmod:LoadFeedImage xmod:LoadFeedLink xmod:MetaTags ' + 
        'xmod:Redirect xmod:Register xmod:ScriptBlock xmod:Select xmod:ToggleButton ' + 
        'xmod:ToggleImage xmod:ToggleLink';
    var xmpTemplateDefs = {
        xmpTopTags: 'xmod:AddButton xmod:AddImage xmod:AddLink xmod:AjaxButton xmod:AjaxImage ' + 
            'xmod:AjaxLink xmod:jQueryReady xmod:DataList ' + 
            'xmod:IfEmpty xmod:IfNotEmpty ' + 
            'xmod:LoadFeed xmod:LoadFeedButton xmod:LoadFeedImage xmod:LoadFeedLink ' + 
            'xmod:MetaTags xmod:ScriptBlock xmod:Slideshow xmod:Template',
        /* Tag Context Dependencies */
        xmpContextTags: {
            'xmod:Template': 'ListDataSource DetailDataSource DeleteCommand CustomCommands Pager SearchSort HeaderTemplate ItemTemplate AlternatingItemTemplate SeparatorTemplate FooterTemplate DetailTemplate NoItemsTemplate',
            'CustomCommands': 'DataCommand ',
            'DataCommand': 'Parameter ',
            'DeleteCommand': 'Parameter ',
            'DetailDataSource': 'Parameter ',
            'ListDataSource': 'Parameter ',
            'ItemTemplate': templateTags,
            'xmod:AddButton': 'Parameter ',
            'xmod:AddImage': 'Parameter ',
            'xmod:AddLink': 'Parameter ',
            'xmod:AjaxButton': 'Field ',
            'xmod:AjaxImage': 'Field ', 
            'xmod:AjaxLink': 'Field ',
            'xmod:CommandButton': 'Command ',
            'Command': 'Parameter ',
            'xmod:CommandImage': 'Command ',
            'xmod:CommandLink': 'Command ',
            'xmod:DeleteButton': 'Parameter ',
            'xmod:DeleteImage': 'Parameter ',
            'xmod:DeleteLink': 'Parameter ',
            'xmod:DetailButton': 'Parameter ',
            'xmod:DetailImage': 'Parameter ',
            'xmod:DetailLink': 'Parameter ',
            'xmod:EditButton': 'Parameter ',
            'xmod:EditImage': 'Parameter ',
            'xmod:EditLink': 'Parameter ',
            'xmod:LoadFeed': 'Field ',
            'xmod:LoadFeedButton': 'Field ',
            'xmod:LoadFeedImage': 'Field ',
            'xmod:LoadFeedLink': 'Field ',
            'xmod:MetaTags': 'Title Keywords Description',
            'xmod:Redirect': 'Field ',
            'xmod:Select': 'Case Else',
            'AlternatingItemTemplate': templateTags,
            'DetailTemplate': 'xmod:AddButton xmod:AddImage xmod:AddLink xmod:CommandButton xmod:CommandImage xmod:CommandLink ' + 
                              'xmod:DeleteButton xmod:DeleteImage xmod:DeleteLink xmod:EditButton xmod:EditImage xmod:EditLink xmod:Format ' + 
                              'xmod:IfEmpty xmod:IfNotEmpty xmod:MetaTags xmod:Redirect xmod:Register xmod:ReturnButton xmod:ReturnImage xmod:ReturnLink ' + 
                              'xmod:ScriptBlock xmod:Select xmod:ToggleButton xmod:ToggleImage xmod:ToggleLink',
            'xmod:Slideshow': 'ListDataSource ',
            'xmod:DataList': 'ListDataSource DetailDataSource DeleteCommand Pager SearchSort HeaderTemplate ItemTemplate AlternatingItemTemplate SeparatorTemplate FooterTemplate DetailTemplate NoItemsTemplate'
        },
        /* Tag properties */
        xmpTagProps: {
            'xmod:Template': 'AddRoles Ajax ConnectionString DeleteRoles DetailRoles EditRoles UsePaging',
            'ListDataSource': 'CommandText ConnectionString',
            'DetailDataSource': 'CommandText ConnectionString',
            'DeleteCommand': 'CommandText ',
            'DataCommand': 'CommandName CommandText ConnectionString',
            'Parameter': 'Name Value',
            'Pager': 'FirstLastCssClass FirstPageCaption LastPageCaption MaxPageNumButtons NextPageCaption PageNumCssClass PageSize PrevNextCssClass PrevPageCaption ScrollToTop ShowBottomPager ShowFirstLast ShowTopPager',
            'SearchSort': 'FilterExpression Height ReverseSortCssClass ReverseSortText SearchBoxCssClass SearchButtonCssClass SearchButtonText SearchLabelCssClass SearchLabelText SortButtonCssClass SortButtonText SortFieldLabels SortFieldListCssClass SortFieldNames SortLabelCssClass SortLabelText Width',
            'xmod:AddButton': buttonProps,
            'xmod:AddImage': imageProps,
            'xmod:AddLink': buttonProps,
            'xmod:AjaxButton': ajaxButtonProps + ' Text',
            'xmod:AjaxLink': ajaxButtonProps + ' Text',
            'xmod:AjaxImage': ajaxButtonProps + ' AlternateText ImageUrl',
            'xmod:CommandButton': buttonProps,
            'Command': 'Name Target Type',
            'xmod:CommandImage': imageProps,
            'xmod:CommandLink': buttonProps,
            'xmod:DeleteButton': buttonProps,
            'xmod:DeleteImage': imageProps,
            'xmod:DeleteLink': buttonProps,
            'xmod:DetailButton': buttonProps,
            'xmod:DetailImage': imageProps,
            'xmod:DetailLink': buttonProps,
            'xmod:EditButton': buttonProps,
            'xmod:EditImage': imageProps,
            'xmod:EditLink': buttonProps,
            'xmod:Format': 'Type Value Pattern Replacement MaxLength InputCulture OutputCulture',
            'xmod:IfEmpty': 'Value', 
            'xmod:IfNotEmpty': 'Value',
            'xmod:LoadFeed': 'FeedName LoadingCssClass LoadingImageUrl Target', 
            'xmod:LoadFeedButton': loadFeedButtonProps + ' Text',
            'xmod:LoadFeedLink': loadFeedButtonProps + ' Text', 
            'xmod:LoadFeedImage': loadFeedButtonProps + ' AlternateText ImageUrl',
            'Title': 'Append ',
            'Keywords': 'Append ',
            'Description': 'Append ',
            'xmod:Redirect': 'Display Method ImageUrl ImageAlign OnClientClick Style Target Text Width',
            'Field': 'Name Value',
            'xmod:Register': 'TagPrefix Namespace Assembly',
            'xmod:ScriptBlock': 'ScriptId BlockType RegisterOnce Url',
            'xmod:Select': 'Mode ',
            'Case': 'CompareType Value Expression Operator IgnoreCase Culture',
            'xmod:ToggleButton': buttonProps + ' Speed Target',
            'xmod:ToggleImage': imageProps + ' Speed Target',
            'xmod:ToggleLink': buttonProps + ' Speed Target',
            'xmod:Slideshow': 'BasePath ConnectionString Height ID ImageField ResizeImages Timeout Width',
            'xmod:DataList': 'AddRoles Ajax ConnectionString DeleteRoles DetailRoles EditRoles ID RepeatColumns RepeatDirection RepeatLayout UsePaging'
        },
        enumeratedProps: {
            /* Template Tag */
            'Ajax': 'True False',
            'AddRoles': 'DNNRoleName',
            'ConnectionString': 'string',
            'DeleteRoles': 'DNNRoleName',
            'DetailRoles': 'DNNRoleName',
            'EditRoles': 'DNNRoleName',
            'UsePaging': 'True False',
            /* ListDataSource/DetailDataSource/DeleteCommand */
            'CommandText': 'string',
            'CommandName': 'string',
            /* Parameter */
            'name': 'string',
            'value': 'string',
            /* Script Block */
            'ScriptId': 'string',
            'BlockType': 'HeadScript ClientScript StartupScript ClientScriptInclude',
            'RegisterOnce': 'True False',
            'Url': 'url'
        },
        /* Tokens */
        xmpTokens: 'Portal Url User Request',
        /* Token Properties */
        xmpTokenProps: {
            'Portal': 'Alias Description Email Expiry HomeDirectory HomeDirectoryMapped HomeTabId ID LoginTabId LogoFile Name TimeZoneOffset',
            'Request': 'Referrer URL HostName HostAddress Agent Browser Locale PageName',
            'User': 'ID FirstName LastName DisplayName Username Email', 
            'Url': 'parameterName'
        }
    };
    var xmpFeedDefs = {
        xmpTopTags: 'xmod:Feed xmod:MetaTags xmod:ScriptBlock',
        /* Tag Context Dependencies */
        xmpContextTags: {
            'xmod:Feed': 'ListDataSource HeaderTemplate ItemTemplate AlternatingItemTemplate SeparatorTemplate FooterTemplate',
            'ListDataSource': 'Parameter ',
            'ItemTemplate': templateTags,
            'xmod:MetaTags': 'Title Keywords Description',
            'xmod:Select': 'Case Else',
            'AlternatingItemTemplate': templateTags
        },
        /* Tag properties */
        xmpTagProps: {
            'xmod:Feed': 'Doctype ContentType ConnectionString Filename ViewRoles',
            'ListDataSource': 'CommandText ConnectionString',
            'Parameter': 'Name Value',
            'xmod:Format': 'Type Value Pattern Replacement MaxLength InputCulture OutputCulture',
            'Title': 'Append ',
            'Keywords': 'Append ',
            'Description': 'Append ',
            'Fields': 'Name Value',
            'xmod:Register': 'TagPrefix Namespace Assembly',
            'xmod:ScriptBlock': 'ScriptId BlockType RegisterOnce Url',
            'xmod:Select': 'Mode ',
            'Case': 'CompareType Value Expression Operator IgnoreCase Culture'
        },
        enumeratedProps: {
        },
        /* Tokens */
        xmpTokens: 'Cookie Form Url User Request',
        /* Token Properties */
        xmpTokenProps: {
            'Cookie': 'cookieName ',
            'Request': 'Referrer URL PageName HostName HostAddress Agent Browser Locale',
            'Form': 'parameterName ', 
            'Url': 'parameterName '
        }
    };

    var xmpFormDefs = {
        xmpTopTags: 'AddForm EditForm AddSuccessTemplate EditSuccessTemplate',
        /* Tag Context Dependencies */
        xmpContextTags: {
            'AddForm': 'Action AddButton AddImage AddLink AddToRoles AddUser AjaxButton AjaxImage AjaxLink CalendarButton CalendarImage CalendarLink ' + 
                       'CancelButton CancelImage CancelLink Captcha Checkbox CheckboxList ControlDataSource DateInput ' +
                       'DropdownList DualList Email FileUpload HtmlInput jQueryReady Label ListBox Panel Password RadioButton ' + 
                       'RadioButtonList Register Redirect RemoveFromRoles ScriptBlock SelectCommand SubmitCommand Tabstrip Text ' + 
                       'TextArea TextBox UpdateButton UpdateImage UpdateLink UpdateUser Validate ValidationSummary Variable',
            'EditForm': 'Action AddButton AddImage AddLink AddToRoles AddUser AjaxButton AjaxImage AjaxLink CalendarButton CalendarImage CalendarLink ' +
                        'CancelButton CancelImage CancelLink Captcha Checkbox CheckboxList ControlDataSource DateInput ' + 
                        'DropdownList DualList Email FileUpload HtmlInput jQueryReady Label ListBox Panel Password RadioButton ' + 
                        'RadioButtonList Redirect Register RemoveFromRoles ScriptBlock SelectCommand SubmitCommand Tabstrip Text ' + 
                        'TextArea TextBox UpdateButton UpdateImage UpdateLink UpdateUser Validate ValidationSummary Variable',
            'AddSuccessTemplate': 'ItemTemplate ',
            'EditSuccessTemplate': 'ItemTemplate ',
            'AjaxButton': 'Field ',
            'AjaxImage': 'Field ', 
            'AjaxLink': 'Field ',
            'CheckboxList': 'ListItem ',
            'ControlDataSource': 'Parmater ',
            'DropdownList': 'ListItem ',
            'ItemTemplate': 'xmod:ContinueButton xmod:ContinueImage xmod:ContinueLink xmod:Redirect',
            'ListBox': 'ListItem ',
            'RadioButtonList': 'ListItem ',
            'xmod:Redirect': 'Field', 
            'SelectCommand': 'Parameter ',
            'SubmitCommand': 'Parameter ',
            'Tabstrip': 'Tab '
        },
        /* Tag properties */
        xmpTagProps: {
            'AddForm': 'ClientName ',
            'Action': 'Assembly Namespace',
            'AddButton': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'AddImage': 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Redirect RedirectMethod Style Width',
            'AddLink': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'AddToRoles': 'RoleNames UserId', 
            'AddUser': 'Approved City Country DisplayName Email FirstName LastName Password PostalCode Region RoleNames Street Telephone Unit UpdatePasswordOnNextLogin Username',
            'AjaxButton': ajaxButtonProps + ' Text',
            'AjaxLink': ajaxButtonProps + ' Text',
            'AjaxImage': ajaxButtonProps + ' AlternateText ImageUrl',
            'CalendarButton': 'CssClass Format Height Style Target Text Width',
            'CalendarImage': 'AlternateText CssClass Format Height ImageUrl Style Target Width',
            'CalendarLink': 'CssClass Format Height Style Target Text Width',
            'CancelButton': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'CancelImage': 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Redirect RedirectMethod Style Width',
            'CancelLink': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'Captcha': 'CaptchaChars CaptchaHeight CaptchaLength CaptchaWidth CssClass ErrorMessage Expiration Height ID Text Width',
            'Checkbox': 'Checked CssClass DataField DataType DataValueField Height ID Nullable Style Text TextAlign Visible Width',
            'CheckboxList': 'AppendDataBoundItems CellPadding CellSpacing CssClass DataField DataSourceID DataTextField DataTextFormatString DataType DataValueField Height ID Nullable RepeatColumns RepeatDirection RepeatLayout SelectedItemsSeparator Style TextAlign Visible Width',
            'xmod:ContinueButton': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'xmod:ContinueImage': 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Redirect RedirectMethod Style Width',
            'xmod:ContinueLink': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'ControlDataSource': 'CommandText ConnectionString ID Source',
            'DateInput': 'CssClass Culture DataField DataType DateOnly Format Height ID Nullable ReadOnly Style Visible Width',
            'DropdownList': 'AppendDataBoundItems CssClass DataField DataSourceID DataTextField DataTextFormatString DataType DataValueField Height ID Nullable ParameterName Style TargetControlId TargetDataSourceId Visible Width',
            'DualList': 'AppendDataBoundItems CssClass DataField DataSourceID DataTextField DataTextFormatString DataType DataValueField ID ListStyle-CssClass ListStyle-Width SelectedItemsSeparator Style Visible Width',
            'EditForm': 'ClientName ',
            'Email': 'To From CC BCC Subject Format Attachment ReplyTo SendIf',
            'Field': 'Name Value',
            'FileUpload': 'ID DataField DataType DisplayMode Extensions FileNameLabelCssClass MessageLabelCssClass NewFileButtonCssClass NewFileButtonText Nullable Path UploadButtonCssClass UploadButtonText UseUniqueFileName Visible',
            'HtmlInput': 'DataField DataType Height ID Nullable Visible Width',
            'Label': 'ID For Text CssClass Visible',
            'ListBox': 'AppendDataBoundItems CssClass DataField DataSourceID DataTextField DataTextFormatString DataType DataValueField Height ID Rows SelectedItemsSeparator SelectionMode Style Visible Width',
            'ListItem': 'Value Selected',
            'Panel': 'CssClass DefaultButton Height HorizontalAlign ID ScrollBars ShowRoles Style Visible Width Wrap',
            'Parameter': 'Name Value',
            'Password': 'CssClass DataField DataType Height ID MaxLength Nullable ReadOnly Style Visible Width',
            'RadioButton': 'Checked CssClass DataField DataTpe DataValueField GroupName Height ID Nullable Style Text TextAlign Visible Width',
            'RadioButtonList': 'AppendDataBoundItems, CellPadding CellSpacing CssClass DataSourceID DataTextField DataTextFormatString DataValueField Height ID Nullable RepeatColumns RepeatDirection RepeatLayout Style TextAlign Visible Width',
            'xmod:Redirect': 'CssClass Display Height ImageAlign ImageUrl Method OnClientClick Style Target Text Width',
            'Register': 'TagPrefix Namespace Assembly',
            'RemoveFromRoles': 'RoleNames UserId', 
            'ScriptBlock': 'ScriptId BlockType RegisterOnce Url',
            'SelectCommand': 'CommandText ConnectionString',
            'SilentPost': 'Url',
            'SubmitCommand': 'CommandText ConnectionString',
            'Tabstrip': 'Height HoverBackColor HoverForeColor SelectedBackColor SelectedForeColor ShowPanelBorders Visible Width',
            'Tab': 'Text ',
            'Text': 'DataField Nullable',
            'TextArea': 'CharacterCount CharacterCountClass CharacterCountLabel Columns CssClass DataField DataType Height HtmlEncode ID MaxLength Nullable ReadOnly Rows Style Visible Width Wrap',
            'TextBox': 'CssClass DataField DataType Height HtmlEncode ID MaxLength Nullable ReadOnly Style Visible Width',
            'UpdateButton': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'UpdateImage': 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Redirect RedirectMethod Style Width',
            'UpdateLink': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Width',
            'UpdateUser': 'Approved City Country DisplayName Email FirstName LastName Password PostalCode Region Street Telephone Unit UpdatePasswordOnNextLogin UserId',
            'Validate': 'CompareTarget CompareValue CssClass DataType Display EnableClientScript Height MaximumValue Message MinimumValue Operator Target Text Type ValidationExpression Width',
            'ValidationSummary': 'CssClass DisplayMode EnableClientScript HeaderText Height Width',
            'Variable': 'DataType Name Value',
            'ContinueButton': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Visible Width',
            'ContinueImage': 'AlternateText CssClass Height ImageAlign ImageUrl OnClientClick Redirect RedirectMethod Style Width',
            'ContinueLink': 'CssClass Height OnClientClick Redirect RedirectMethod Style Text Visible Width'
        },
        enumeratedProps: {},
        /* Tokens */
        xmpTokens: 'Portal Url User Request',
        /* Token Properties */
        xmpTokenProps: {
            'Portal': 'Alias Description Email Expiry HomeDirectory HomeDirectoryMapped HomeTabId ID LoginTabId LogoFile Name TimeZoneOffset',
            'Request': 'Referrer URL HostName HostAddress Agent Browser Locale PageName',
            'User': 'ID FirstName LastName DisplayName Username Email',
            'Url': 'parameterName'
        }


    };


    /* *
    * Add additional state types openToken 
    * and tokenBase if match is found. Also 
    * add tokenName to state object if
    * appropriate
    * */
    function checkState(token) {
        var state = token.state,
			str = token.string,
			tokenStartExpr = /\[\[/,
			tokenExpr = /\[\[(\w+):?/,
			fullTokenExpr = /\[\[(\w+):(\w+)(\]\])?/,
			isTokenStart = false,
			tokenBase = false,			
			/* Get last instance of [[ */
			tokenFrags = str.split("[["),
			tokenFragSize = tokenFrags.length;			
			str = "[[" + tokenFrags[ tokenFragSize - 1 ];
			
		/* Test last instance to see if there is already a token and prop in the string */
		try{
			/* If there is already a token and prop just return token */
			if ( ( str.match(fullTokenExpr).length > 3 ) && !state.type ){						
				return token;
			} 
		} catch(e){}	
							
			
        if (!state.type) {
            /* Test for openToken brackets ( [[ ) */
            isTokenStart = str.match(tokenStartExpr);
            /* Test for tokenBase ( [[TokeName: ) */
            try {
                tokenBase = tokenExpr.exec(str)[1];
            } catch (e) { }
        }
        if (isTokenStart && !tokenBase) {
            state.type = 'openToken';
        }
        if (tokenBase) {
            state.type = 'tokenBase'
            state.tokenName = tokenBase;
        }
        token.state = state;
		
        return token;
    };

    function handleContextTags(token, def) {
        if (def.xmpContextTags[token.state.context.tagName] != null) {
            return def.xmpContextTags[token.state.context.tagName].split(' ');
        } else if (token.state.context.prev) {
            /* Update the context to be the previous one and try again */
            token.state.context = token.state.context.prev;
            return handleContextTags(token, def);
        } else {
            return [];
        }
    };

    function handleTopTags(token, def) {
        if (def.xmpTopTags) {
            return def.xmpTopTags.split(' ');
        } else {
            return [];
        }

    };

    function handleTagProps(token, def) {
        if (def.xmpTagProps[token.state.tagName] != null) {
            return def.xmpTagProps[token.state.tagName].split(' ');
        } else {
            return [];
        }
    };

    function handleTokens(token, def) {
        return def.xmpTokens.split(' ');
    };

    function handleTokenBase(token, def) {
        if (def.xmpTokenProps[token.state.tokenName] != null) {
            return def.xmpTokenProps[token.state.tokenName].split(' ');
        } else {
            return [];
        }
    };


    CodeMirror.xmodHint = function (editor) {
        /* Find the token at the cursor */
        var cur = editor.getCursor(), token = checkState(editor.getTokenAt(cur));
        if (token.string === " ") {
            token = editor.getTokenAt({ line: cur.line, ch: token.start - 1 });
            return {
                list: getCompletions(token),
                from: { line: cur.line, ch: token.end + 1 },
                to: { line: cur.line, ch: token.end + 1 }
            };
        }
        return {
            list: getCompletions(token),
            from: { line: cur.line, ch: token.end },
            to: { line: cur.line, ch: token.end }
        };
    };


    function getCompletions(token) {
        var start = token.string,
			state = token.state,
			type = state.type,
			def;

        /* Determine which definition set to use */
        switch (window.xmpCCDefinition)
        {
        	case 'form':
        		def = xmpFormDefs;
        		break;
            case 'feed':
                def = xmpFeedDefs;
                break;
            default: 
                // template defs are default
                def = xmpTemplateDefs;
        }

        /* If there is an opening [[ but no token show a list of tokens */
        if (type === 'openToken') {
            /* console.log('there is an opening [[ but no token show a list of tokens'); */
            return handleTokens(token, def);
        }

        /* If [[TokeName: list token properties */
        else if (type === 'tokenBase' && state.tokenName) {
            /* console.log('[[TokeName: list token properties'); */
            return handleTokenBase(token, def);
        }

        /* If there is an opening < and we have the tagname show a list of properties */
        else if (state.tagName && token.string.trim() && token.string.indexOf('>', token.string.length - '>'.length) === -1) {
            /* console.log('there is an opening < and we have the tagname show a list of properties');  */
            return handleTagProps(token, def);
        }

        /* If there is an opening < but no tag show a list of tags */
        else if (type === 'openTag' && !state.tagName) {
            if (!state.context) {
                return handleTopTags(token, def);
            } else {
                return handleContextTags(token, def);
            }
        }
        else {
            return [];
        }
    };



})();