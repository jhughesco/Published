<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server" Clientname="Join">
  
  <ScriptBlock ScriptId="CustomCSS" BlockType="HeadScript" RegisterOnce="true">
    <style type="text/css">
      .join-form {
        max-width: 800px;
        margin: auto;
      }
      
      .join-form label em {
        font-weight: normal;
        color: #555;
        font-size: 12px;
      }
      
      .join-form .progress {
        margin-top: 5px;
        margin-bottom: 0px;
      }
      
      .validate-error {
        color: red;
        display: block;
      }
      
      .required-field {
      	border-left: 1px solid red; 
      }
      
      #username_exists, #displayname_exists, #email_exists { display: none; } 
    </style>
    
    <script type="text/javascript" src="./js/pwstrength/pwstrength-bootstrap.min.js"></script>
    
  </ScriptBlock>
  
  <SubmitCommand CommandText="" />

  <div class="join-form">
    
    <div class="form-group">
      <label for="Username">Username <em>5-30 characters - no spaces or special characters</em></label> 
      <Textbox ID="Username" DataField="Username" CssClass="form-control required-field" DataType="String" autocomplete="off" />
      <Validate Type="required" CssClass="validate-error" Target="Username" Text="Required" Message="Username is required." />
      <Validate Type="regex" CssClass="validate-error" Target="Username" Text="5-30 characters - no spaces or special characters" Message="Username must be between 5-30 characters and cannot contain spaces or special characters." ValidationExpression="^[a-z0-9_-_@_-_A-Z]{5,30}$" />
      <div class="alert alert-danger" id="username_exists" style="margin-top: 10px; ">
        <p>This username is already taken. Did you forget your password?</p>
        <p><a class="btn btn-sm btn-default" href="?ctl=sendpassword">Reset Password</a></p>
      </div>      
    </div>
    
    <div class="form-group">
      <label for="Password">Password <em>7-20 characters - no spaces</em></label>
      <Password ID="Password" DataField="Password" CssClass="form-control required-field" DataType="String" autocomplete="off" />
      <Validate Type="required" CssClass="validate-error" Target="Password" Text="Required" Message="Password is required." />
      <Validate Type="regex" CssClass="validate-error" Target="Password" Text="7-20 characters - no spaces" Message="Your password must be between 7-20 characters and cannot contain spaces." ValidationExpression="^\S{7,20}$" />
    </div>
    
    <div class="form-group">
      <label for="ConfirmPassword">Confirm Password <em>Type your password again...</em></label>
      <Password ID="ConfirmPassword" DataField="ConfirmPassword" CssClass="form-control required-field" DataType="String" autocomplete="off" />
      <Validate Type="required" CssClass="validate-error" Target="ConfirmPassword" Text="Required" Message="Confirm Password is required." />
      <Validate Type="compare" CssClass="validate-error" Target="ConfirmPassword" Text="Must match" Message="Your confirmation password does not match." Operator="Equal" CompareTarget="Password" />
    </div>
    
    <div class="form-group">
      <label for="Displayname">Display Name <em>Others will see you by this alias...</em></label>
      <Textbox ID="Displayname" DataField="Displayname" CssClass="form-control required-field" DataType="String" autocomplete="off" />
      <Validate Type="required" CssClass="validate-error" Target="Displayname" Text="Required" Message="Display Name is required." />
      <div class="alert alert-danger" id="displayname_exists" style="margin-top: 10px; ">
        <p>This display name is already taken. Please try a new one.</p>          
      </div>
    </div>
    
    <div class="form-group">
      <label for="EmailAddress">Email Address <em>A confirmation link will be sent to this email...</em></label>
      <Textbox ID="EmailAddress" DataField="EmailAddress" CssClass="form-control required-field" DataType="String" autocomplete="off" />
      <Validate Type="required" CssClass="validate-error" Target="EmailAddress" Text="Required" Message="Email Address is required." />
      <Validate Type="email" CssClass="validate-error" Target="EmailAddress" Text="Invalid" Message="Your email address is invalid." />
      <div class="alert alert-danger" id="email_exists" style="margin-top: 10px; ">
        <p>This email is already registered. Did you forget your password?</p>
        <p>
          <a class="btn btn-sm btn-default" href="?ctl=sendpassword">Reset Password</a>
        </p>
      </div>
    </div>
    
    <div class="form-group">
      <CheckBox Id="Agree" DataField="Agree" DataType="Boolean"></CheckBox> <span><strong>I agree to the <a href="/terms" target="_blank">Terms and Conditions</a></strong></span>
      <Validate Type="checkbox" CssClass="validate-error" Target="Agree" Text="Required" Message="You must agree to the terms and conditions." />
    </div>
    
    
    <ValidationSummary CssClass="alert alert-warning" Id="JoinValidate" DisplayMode="BulletList" HeaderText="Please correct the following errors:" />
    
    <AddButton CssClass="btn btn-primary btn-block" Text="Create My Account" />
            
  </div>
  
  <jQueryReady>
		$('#' + Join.Password).pwstrength({
      ui: { showVerdictsInsideProgressBar: true }
    });
  </jQueryReady>


</xmod:AddForm></AddItemTemplate></xmod:FormView>
