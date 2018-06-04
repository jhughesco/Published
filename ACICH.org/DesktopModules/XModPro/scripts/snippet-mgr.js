// Snippet Manager Plugin for XMod Pro
// Copyright 2011-2013 Kelly Ford
// All rights reserved
// ===================================
// REQUIRES: code-mirror.js (script calls code-mirror on a textarea)
// Description: creates a dialog where the user can add, edit, and delete snippets. These are then passed to the 
//      server so they can be saved.
// ----------------------------------------------------------------------------------------------------------------
(function ($) {
    var dataID = "snippetManager";

    var methods = {
        init: function (options) {
            var opts = $.extend({}
                , $.fn.snippetManager.defaults, options)
                , $this = $(this)
                , data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {
                    opts: opts
                });
            } else {
                $this.data(dataID, {
                    opts: opts
                })
            }
            initialize($this);
            return this;
        },
        getSnippets: function () {
            var data = $(this).data(dataID);
            var opts = data.opts;
            return opts.snippets;
        }
    };

    $.fn.snippetManager = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.dataChooser');
        }
    };

    $.snippetManager = {}; // base object to hold static functions

    // OPTIONS:
    // xdata - XMod Pro-specific encrypted data, needed for AJAX calls
    $.fn.snippetManager.defaults = {
        xdata: null,
        snippets: new Array()
    }; // snippetManager.defaults


    function initialize(container) {
        var data = container.data(dataID);
        var opts = data.opts;

        container.html(
            '<div class="ui-widget" style="width: 400px;">' +
            '  <div class="xmp-row">' +
            '    <label>Available Snippets</label>' +
            '    <select class="snpmgr-snippets" size="1" style="width: 250px;"></select>' +
            '    <span class="ui-icon ui-icon-pencil" style="display:inline-block;"></span>' +
            '    <span class="ui-icon ui-icon-plus" style="display:inline-block;"></span>' +
            '  </div>' +
            '  <div class="xmp-row">' +
            '    <label>Name</label> <input type="text" style="width: 250px;"/>' +
            '  </div>' +
            '  <div class="xmp-row">' +
            '    <label>Context</label>' +
            '    <select size="1">' +
            '      <option value="form">Form</option>' +
            '      <option value="template">Template</option>' +
            '      <option value="feed">Feed</option>' +
            '      <option value="all">All</option>' +
            '    </select>' +
            '  </div>' +
            '  <div class="xmp-row">' +
            '    <label>Description</label>' +
            '    <textarea style="width: 98%; height: 40px;"></textarea>' +
            '  </div>' +
            '  <div class="xmp-row">' +
            '    <label>Snippet</label>' +
            '    <span style="font-size: .8em;">The snippet will be stored as Javascript so you need to escape your single quotes (\')</span>' +
            '    <textarea style="width: 500px; height: 300px;" id="snpmgr-snippet-editor"></textarea>' +
            '  </div>' +
            '  <div class="xmp-row">' +
            '    <a href="#" class="snp-mgr-add" style="margin-right:10px;">Add</a> ' +
            '    <a href="#" class="snp-mgr-update" style="margin-right:10px;">Update</a>' +
            '    <a href="#" class="snp-mgr-cancel" style="margin-right:10px;">Cancel</a> ' +
            '  </div>' +
            '</div>');
        // styling
        container.find('label').css({ 'display': 'block' });

        var editor = CodeMirror.fromTextArea(document.getElementById('snpmgr-snippet-editor'),
            { mode: "javascript",
                fixedGutter: true,
                lineNumbers: true
            });

        // load the existing snippets
        var $lst = container.find('.snpmgr-snippets');
        loadSnippets($lst, opts.snippets);


        hideEditForm(container);

        // ---------------------
        // EVENTS
        //

        // Add new snippet
        container.find('span.ui-icon-plus').click(function () {
            container.find('.snp-mgr-add').show();
            container.find('.snp-mgr-update').hide();
            showEditForm(container, editor);
        });

        // Edit existing snippet
        container.find('span.ui-icon-pencil').click(function () {
            var selIndex = parseInt($lst.val());
            var snippet = opts.snippets[selIndex];

            snippetName(container, snippet.name);
            snippetContext(container, snippet.context);
            snippetDescription(container, snippet.description);
            editor.setValue(snippet.snippet);
            container.find('.snp-mgr-add').hide();
            container.find('.snp-mgr-update').show();
            showEditForm(container, editor);
        });

        container.find('.snp-mgr-add').click(function () {
            // add a new snippet to the list
            var newSnippet = { 'name': snippetName(container),
                'context': snippetContext(container),
                'description': snippetDescription(container),
                'snippet': editor.getValue()
            };
            opts.snippets.push(newSnippet);

            $lst.append('<option value="' + (opts.snippets.length - 1) + '">' + newSnippet.name + '</option>');
            hideEditForm(container);
        });

        container.find('.snp-mgr-update').click(function () {
            var snippet = {
                'name': snippetName(container),
                'context': snippetContext(container),
                'description': snippetDescription(container),
                'snippet': editor.getValue()
            };
            var selIndex = parseInt($lst.val());
            opts.snippets[selIndex] = snippet;
            loadSnippets($lst, opts.snippets);
            hideEditForm(container);
        });

        container.find('.snp-mgr-cancel').click(function () {
            hideEditForm(container);
        });

    }

    // functions to support methods
    function showEditForm(container, editor) {
        container.find('.xmp-row').show();
        editor.setSize(400, 100);
        editor.refresh();
    }

    function loadSnippets($lst, snippets) {
        var sOut = '';
        for (var i = 0; i < snippets.length; i++) {
            sOut += '<option value="' + i + '">' + snippets[i].name + '</option>';
        }
        $lst.html('').append(sOut);

    }

    function hideEditForm(container) {
        container.find('.xmp-row').hide().eq(0).show();
    }

    function snippetName(container, value) {
        var $input = container.find('.xmp-row:eq(1) input')
        if (value) {
            // setting the value
            $input.val(value);
        } else {
            return $input.val();
        }
    }

    function snippetContext(container, value) {
        var $input = container.find('.xmp-row:eq(2) select')
        if (value) {
            // setting the value
            $input.val(value);
        } else {
            return $input.val();
        }
    }

    function snippetDescription(container, value) {
        var $input = container.find('.xmp-row:eq(3) textarea')
        if (value) {
            // setting the value
            $input.val(value);
        } else {
            return $input.val();
        }
    }

    function snippetSnippet(container, value) {
        var $input = container.find('.xmp-row:eq(4) textarea')
        if (value) {
            // setting the value
            $input.val(value);
        } else {
            return $input.val();
        }
    }
})(jQuery);