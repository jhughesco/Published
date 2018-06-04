<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Exchange.aspx.vb" Inherits="KnowBetter.XModPro.Exchange" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head" runat="server">
    <title>XMod Pro - XChange</title>

    <link rel="stylesheet" type="text/css" media="screen" href="styles/bs/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="styles/bs/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/codemirror.css" />

    <style type="text/css">
        body {
            background-color: Transparent;
            border: none;
        }

        .file-type-image-icon {
            width: 32px;
        }

        .file-type-image-md {
            width: 100px;
        }
    </style>
    <script type="text/javascript">
        var kbxm_xdata = '<%=Request("xdata")%>';
        var kbxm_baseurl = '<%=Page.ResolveUrl("~/DesktopModules/XModPro")%>';
    </script>
</head>
<body style="height: 800px;" class="ui-widget">

    <div class="container">
        <h3>XMod Pro Exchange<br />
            <small><em>because &quot;Someone <em>must</em> have built something like this already&quot;</em></small>
        </h3>
        <div class="row" id="exchange-detail" style="display: none;"></div>
        <div class="row" id="exchange-list"></div>
    </div>

    <script src="scripts/jquery.min.js" type="text/javascript"></script>
    <script src="styles/bs/js/bootstrap.min.js"></script>
    <script src="scripts/handlebars/handlebars.js"></script>
    <script src="scripts/code-mirror/codemirror.js"></script>
    <script src="scripts/code-mirror/util/addon/runmode/runmode-standalone.js"></script>
    <script src="scripts/code-mirror/util/addon/runmode/colorize.js"></script>
    <script src="scripts/code-mirror/htmlmixed.js"></script>
    <script src="scripts/code-mirror/javascript.js"></script>
    <script src="scripts/code-mirror/css.js"></script>
    <script src="scripts/code-mirror/xml.js"></script>
    <script src="scripts/code-mirror/sql.js"></script>
    <script src="scripts/kbutils.js"></script>

    <script id="product-blocks" type="text/handlebars-template">
        {{#each items}}
        <div class="col-md-12 well product" data-id="{{PackageId}}">
            <h4><a href="#" class="detail">{{Name}}</a></h4>
            <h5>{{Author}}</h5>
            <p>{{#truncate Description 300}}{{/truncate}}</p>
            <a href="#" class="detail btn btn-primary btn-small">View Details</a>
        </div>
        {{/each}}
    </script>

    <script id="product-detail" type="text/handlebars-template">
        <div class="col-sm-12 well package-detail pad-md">
          <h2>{{Name}}</h2>
          <h5>by {{Author}}</h5>
          <h3>Description</h3>
          <div>{{{Description}}}</div>
        
          <hr/>

          <h3>Requirements</h3>

          <div>
            <ul>
              {{#linesToList Requirements}}{{/linesToList}}
            </ul>
          </div>
        
          <hr />

          <h3>Disclaimer</h3>
          <p>
            By installing this package or using any code it contains (THE SOFTWARE), you agree to the terms below:<br />
            <em>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
            WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</em>  
          </p>
        
          <hr />

          <h3>Manual Installation and Configuration Instructions</h3>

          <div>
            {{{Installation}}}
          </div>
          
          <hr />

          <h3>Automatic Installation</h3>
          <p><strong>What gets installed when I click the Install Package Button?</strong></p>
          <p>Forms, templates, and feeds are installed. SQL scripts are NOT installed because of the potential damage it could do to your database. 
             To prevent naming conflicts, they are given 
             names based on the package name and the current date and time. For this reason, you may need to either rename the files and/or change any references 
             to them. For instance, a template that calls a feed would need to be modified to use the new filename of the feed.
          </p>
          <p>After installation, the package may require additional setup or configuration. Please refer to the &quot;Manual Installation and Configuration Instructions&quot; section for more details.
          <div>
            <button class="btn btn-primary btn-lg install" data-id="{{PackageId}}">Install Package</button>
          </div>
          
          <hr />

          <h3>Files</h3>

          <div class="panel-group" id="files-list" role="tablist" aria-multiselectable="true">
            {{#each this.Files}}
              <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="heading-{{ExchangeId}}">
                  <h3 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#files-list" href="#file-{{ExchangeId}}" aria-expanded="{{#if @first}}true{{else}}false{{/if}}"
                       aria-controls="collapse-{{ExchangeId}}">
                      <img class="file-type-image-icon" src="{{#fileTypeImage FileType}}{{/fileTypeImage}}"> {{FileName}}
                    </a>
                  </h3>
                </div>
                <div id="file-{{ExchangeId}}" class="panel-collapse collapse{{#if @first}} in{{/if}}" role="tabpanel"
                     aria-labelledby="heading-{{ExchangeId}}">
                  <div class="panel-body">
                    <div class="col-md-2">
                      <img class="file-type-image-md" src="{{#fileTypeImage FileType}}{{/fileTypeImage}}">
                    </div>
                    <div class="col-md-10">
                      <pre class="code cm-s-default item-type-{{#fileTypeNameLowercase FileType}}{{/fileTypeNameLowercase}}">{{Content}}</pre>
                    </div>
                  </div>
                </div>
              </div>
            {{/each}}
          </div>

          <button class="btn btn-default back"><span class="fa fa-arrow-left"></span> Back</button>
        </div>
    </script>

    <script type="text/javascript">
        var _products = null;
        var templateList, templateDetail;

        Handlebars.registerHelper('truncate', function (input, len) {
            if (!input) return '';
            if (input.length <= len) return input;
            return input.substring(0, len - 1) + '...';
        });
        Handlebars.registerHelper('fileTypeName', function (input) {
            if (!input) return '';
            var ft = parseInt(input, 10);
            switch (ft) {
                case 2: return 'Form';
                case 3: return 'Template';
                case 4: return 'Feed';
                case 5: return 'SQL';
                default: return 'Other';
            }
        });
        Handlebars.registerHelper('fileTypeNameLowercase', function (input) {
            if (!input) return '';
            var ft = parseInt(input, 10);
            switch (ft) {
                case 2: return 'form';
                case 3: return 'template';
                case 4: return 'feed';
                case 5: return 'sql';
                default: return 'other';
            }
        });
        Handlebars.registerHelper('fileTypeClass', function (input) {
            if (!input) return '';
            var ft = parseInt(input, 10);
            switch (ft) {
                case 2: return 'file-type-form';
                case 3: return 'file-type-template';
                case 4: return 'file-type-feed';
                case 5: return 'file-type-sql';
                default: return 'file-type-other';
            }
        });
        Handlebars.registerHelper('fileTypeImage', function (input) {
            if (!input) return '';
            var ft = parseInt(input, 10);
            switch (ft) {
                case 2: return '//dnndev.com/desktopmodules/xmpc/app/img/filetype_form.png';
                case 3: return '//dnndev.com/desktopmodules/xmpc/app/img/filetype_template.png';
                case 4: return '//dnndev.com/desktopmodules/xmpc/app/img/filetype_feed.png';
                case 5: return '//dnndev.com/desktopmodules/xmpc/app/img/filetype_sql.png';
                default: return '//dnndev.com/desktopmodules/xmpc/app/img/filetype_other.png';
            }
        });
        Handlebars.registerHelper('linesToList', function (input, cssClass) {
            if (!input) return input;
            var lines = input.split("\n");
            var sOut = '';
            for (var i = 0; i < lines.length; i++) {
                sOut += '<li>' + lines[i] + '</li>';
            }
            return sOut;
        });
        Handlebars.registerHelper('ifEquals', function (context, var1, options) {
            if (context == var1) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        function makeCall(cmd, method, opt, success) {
            var data = {
                xdata: kbxm_xdata,
                callback: cmd
            }
            if (opt) {
                for (var key in opt) {
                    if (opt.hasOwnProperty(key)) {
                        var obj = opt[key];
                        data[key] = obj;
                    }
                }
            }
            $.ajax({
                url: kbxm_baseurl + '/kbxm_manage.aspx',
                data: data,
                method: method,
                success: function (result) {
                    console.log('makeCall result', result);
                    if (success) success(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }

        $(document).ready(function (e) {
            var templateList = Handlebars.compile($('#product-blocks').html());

            makeCall("exchange_list", "GET", null, function (result) {
                _products = { items: result };
                $('#exchange-list').html('').append(templateList(_products));
                console.log(_products);
            });
        });

        $('#exchange-detail').on('click', 'button.install', function (e) {
            e.preventDefault();
            var $btn = $(e.target);
            var id = parseInt($btn.data("id"), 10);
            $.ajax({
                url: kbxm_baseurl + '/kbxm_manage.aspx',
                data: {
                    xdata: kbxm_xdata,
                    callback: "exchange_install",
                    id: id
                },
                method: 'GET',
                success: function (results) {
                    var msg = '<p>Successfully installed the following files:</p><ul>';
                    for (var i = 0; i < results.length; i++) {
                        msg += '<li>' + results[i] + '</li>';
                    }
                    Utils.showBlockSuccess(msg, $btn.parent());
                    console.log(results);
                },
                error: function (results) {
                    var msg = '<p>An error occurred while installing the package:</p><ul>';
                    for (var i = 0; i < results.length; i++) {
                        msg += '<li>' + results[i] + '</li>';
                    }
                    Utils.showBlockError(msg, $btn.parent());
                    console.log(results);
                }
            });
        });
        $('#exchange-list').on('click', 'a.detail', function (e) {
            console.log("_products", _products);
            e.preventDefault();
            if (!templateDetail) {
                templateDetail = Handlebars.compile($('#product-detail').html());
            }
            // get the item
            var $btn = $(e.target);
            var id = parseInt($btn.closest('.product').data("id"), 10);
            console.log('packageid:', id);
            for (var i = 0; i < _products.items.length; i++) {
                var prod = _products.items[i];
                console.log('current product:', prod)
                if (prod.PackageId === id) {
                    console.log('found the package');
                    makeCall("exchange_detail", "GET", { id: id }, function (result) {
                        console.log('makeCall callback', result);
                        $('#exchange-detail').html('').append(templateDetail(result));
                        $('#exchange-detail').find('pre.code').each(function () {
                            var $code = $(this);
                            var content = $code.text();
                            var mode = 'htmlmixed';
                            if ($code.hasClass('item-type-sql')) {
                                mode = 'text/x-mssql';
                            } else if ($code.hasClass('item-type-css')) {
                                mode = 'css';
                            } else if ($code.hasClass('item-type-javascript')) {
                                mode = 'javascript';
                            }
                            CodeMirror.runMode(content, mode, $code.get(0));
                        });
                        $('#exchange-list').fadeOut('fast', function () {
                            $('#exchange-detail').fadeIn('fast');
                        });
                    });
                    break;
                }
            }
        });
        $('#exchange-detail').on('click', 'button.back', function (e) {

            $('#exchange-detail').fadeOut('fast', function () {
                $('#exchange-list').fadeIn('fast');
            });
        });
    </script>

</body>
</html>
