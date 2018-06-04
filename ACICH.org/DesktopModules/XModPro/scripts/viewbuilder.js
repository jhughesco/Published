//
// ================================================================
// viewBuilder Plugin for XMod Pro
// Copyright 2011-2012 by Kelly Ford for KnowBetter Creative Services LLC
// All rights reserved
// REQUIRES: dataChooser() plugin
// ----------------------------------------------------------------
//
(function ($) {
    var dataID = "viewBuilder";
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.viewBuilder.defaults, options);
            var $this = $(this), data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {
                    opts: opts,
                    container: $this
                });
            }
            initialize($this);
        }
    };

    $.fn.viewBuilder = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.viewBuilder');
        }
    };

    $.viewBuilder = {}; // base object to hold static functions

    // OPTIONS:
    // xdata - XMod Pro-specific encrypted data, needed for AJAX calls
    // labels___ - Text to use as caption for various controls.
    $.fn.viewBuilder.defaults = {
        xdata: null,
        portalId: 0,
        labels: ['Error', '(None Selected)'],
        labelsTabs: ['Settings', 'Detail View', 'Buttons', 'Slideshow', 'Fixed Grid'],
        labelsSettings: ['View Name', 'View Type', 'Data Source', 'Table', 'Key Field'],
        labelsButtons: ['Include Add Button', 'Include Edit Button',
            'Include Delete Button', 'Include Details Button', 'Button Type', 'Text', 'Roles',
            'New', 'Edit', 'Delete', 'Details', 'Image URL'],
        labelsSlideshow: ['Height', 'Width', 'Frame Duration', 'Base Image Path', 'Image Field', 'Resize Images'],
        labelsFixedGrid: ['Columns', 'Total Width', 'Page Size', 'Spacing'],
        onSave: null,
        onCancel: null
    }; // viewBuilder.defaults


    function initialize(container) {
        var data = container.data(dataID);
        var opts = data.opts;

        // Create tabs
        container.html('<div><ul>' +
            '<li><a href="#tabListView">' + opts.labelsTabs[0] + '</a></li>' +
            '<li><a href="#tabButtons">' + opts.labelsTabs[2] + '</a></li>' +
            '<li><a href="#tabSlideshow">' + opts.labelsTabs[3] + '</a></li>' +
            '<li><a href="#tabFixedGrid">' + opts.labelsTabs[4] + '</a></li>' +
            '</ul>' +
            '<div id="tabListView"></div>' +
            '<div id="tabButtons"></div>' +
            '<div id="tabSlideshow"></div>' +
            '<div id="tabFixedGrid"></div>' +
            '</div>').css({ 'font-size': '.8em' })
            .tabs();

        container.append('<div><input type="button" value="Save" class="xmp-vb-save"/>&nbsp;&nbsp;' +
                         '<input type="button" value="Cancel" class="xmp-vb-cancel" /></div>')
            .find('input.xmp-vb-save').click(function () {
                // validate form

                // generate template
                var viewCode = createView(container);
                if (opts.onSave) { opts.onSave(viewCode); }


            });
        container.find('input.xmp-vb-cancel').click(function () {
            if (opts.onCancel) { opts.onCancel(); }
        });

        // initialize the tabs
        var $listViewContainer = container.find('#tabListView');
        initListViewTab($listViewContainer, opts);
        var $buttonsContainer = container.find('#tabButtons');
        initButtonsTab($buttonsContainer, opts);
        var $slideshowContainer = container.find('#tabSlideshow');
        initSlideshowTab($slideshowContainer, opts);
        var $fixedGridContainer = container.find('#tabFixedGrid');
        initFixedGridTab($fixedGridContainer, opts);
        // set styling for rows in the tabs
        container.find('.xmp-vb-row').css({ 'padding-top': '3px', 'padding-bottom': '3px' });

    }

    function initListViewTab(settingsContainer, opts) {
        settingsContainer.html(
            utilGetRowHtml(opts.labelsSettings[1], '<select size="1" id="ddlViewType" />') +
            '<div class="xmp-vb-row"></div>' +
            utilGetRowHtml('Include Detail View', '<input type="checkbox" id="chkInclDetailView" checked="checked" />', true) +
            utilGetRowHtml('Choose Detail Fields', '<select size="5" id="lstDetailFields" multiple="multiple" style="min-width: 120px;" />'));
        settingsContainer.find('div:eq(1)')
            .css({ 'padding-top': '3px', 'padding-bottom': '3px' });

        settingsContainer.find('select:eq(0)').append(
            utilGetListHtml(
                [opts.labels[1], 'Grid', 'Fixed Grid', 'Numbered List', 'Bullet List', 'Image Slideshow'],
                ['', 'grid', 'fixedgrid', 'ol', 'ul', 'slideshow']))
            .change(function () {
                var $tabSlideshow = $('a[href="#tabSlideshow"]').parent();
                var $tabFixedGrid = $('a[href="#tabFixedGrid"]').parent();
                var $detailCheckbox = $('#chkInclDetailView');
                var $detailColumns = $detailCheckbox.parent().next();

                $tabSlideshow.hide();
                $tabFixedGrid.hide();

                switch ($(this).val()) {
                    case 'slideshow':
                        $tabSlideshow.show();
                        $detailCheckbox.get(0).checked = false;
                        $('#chkInclDetailView').parent().hide().next().hide();
                        break;
                    case 'fixedgrid':
                        $tabFixedGrid.show();
                        $detailCheckbox.parent().show();
                        $detailColumns.show();
                    default:
                        $detailCheckbox.parent().show();
                        $detailColumns.show();
                }
            });
        $('#chkInclDetailView').click(function () {
            var $this = $(this);
            if ($this.get(0).checked) {
                $('#xmp-chk-btn-details').get(0).checked = true;
                $this.parent().next().show();
            } else {
                $('#xmp-chk-btn-details').get(0).checked = false;
                $this.parent().next().hide();
            }
        });

        // hide all non-grid view-specific options
        $('a[href="#tabSlideshow"]').parent().hide();
        $('a[href="#tabFixedGrid"]').parent().hide();

        settingsContainer.find('label').css({
            'display': 'block', 'float': 'left', 'width': '120px'
        });
        settingsContainer.find('div:eq(1)').dataChooser(
            { xdata: opts.xdata,
                onDataSourceChanged: function (arrFields) {
                    var $detailFields = $('#lstDetailFields');
                    var sHtml = '';
                    if (arrFields && arrFields.length > 0) {
                        for (var i = 0; i < arrFields.length; i++) {
                            sHtml += '<option value="' + arrFields[i] + '">' + arrFields[i] + '</option>';
                        }
                    }
                    $detailFields.html('').append(sHtml);
                }
            });
    }

    function initButtonsTab(buttonsContainer, opts) {
        var buttonTypeRow = utilGetRowHtml(opts.labelsButtons[4], '<select class="button-type" size="1"/>');
        var buttonTextRow = utilGetRowHtml(opts.labelsButtons[5], '<input type="text"/>');
        var buttonImageUrlRow = utilGetRowHtml(opts.labelsButtons[11], '<input type="text"/>');

        buttonsContainer.html('');
          for (var i = 0; i <= 3; i++) {
            var btnid = 'xmp-chk-btn-';
            switch (i) {
              case 0: btnid += 'add'; break;
              case 1: btnid += 'edit'; break;
              case 2: btnid += 'delete'; break;
              case 3: btnid += 'details'; break;
            }
            buttonsContainer.append(utilGetRowHtml(opts.labelsButtons[i], '<input type="checkbox" checked="checked" id="' + btnid + '" />', true)
                 + '<div class="button-container" style="overflow:hidden;">'
                 + '<div class="button-options"><div class="button-type">' + buttonTypeRow + '</div>'
                 + '<div class="button-text">' + buttonTextRow + '</div>'
                 + '<div class="button-image-url" style="display:none;">' + buttonImageUrlRow + '</div></div>'
                 + '<div class="button-roles"><div><label>Roles:</label></div><div><select size="5" multiple="multiple"/></div></div>'
                 + '</div>');
        }
        var $checkboxes = buttonsContainer.find('input[type="checkbox"]');
        $checkboxes.each(function () {
            var $this = $(this)
            $this.before('<a href="#" class="ui-state-default ui-corner-tr ui-corner-br" style="float:left;display:block;width: 18px; height: 18px;"><span class="ui-icon ui-icon-carat-1-e">Show Options</span></a>')
            $this.parent().find('a').click(function () {
                var $lnk = $(this);
                var $btn = $lnk.find('span');
                if ($btn.hasClass('ui-icon-carat-1-e')) {
                    $btn.removeClass('ui-icon-carat-1-e').addClass('ui-icon-carat-1-s');
                    $lnk.removeClass('ui-corner-tr').addClass('ui-corner-bl');
                    $lnk.parent().next().show();
                } else {
                    $btn.removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-e');
                    $lnk.removeClass('ui-corner-bl').addClass('ui-corner-tr');
                    $lnk.parent().next().hide();
                }
            });
        });

        $checkboxes.click(function () {
            var $this = $(this);
            var $lnk = $this.parent().find('a');
            var $btn = $lnk.find('span');
            if ($this.get(0).checked) {
                $this.parent().next().show();
                $btn.removeClass('ui-icon-carat-1-e').addClass('ui-icon-carat-1-s');
                $lnk.removeClass('ui-corner-tr').addClass('ui-corner-bl');
            } else {
                $this.parent().next().hide();
                $btn.removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-e');
                $lnk.removeClass('ui-corner-bl').addClass('ui-corner-tr');
            }
        }).parent().next().hide().find('label');
        buttonsContainer.find('select.button-type').append(
            '<option value="link">Link</option>' +
            '<option value="button">Button</option>' +
            '<option value="image">Image</option>')
            .change(function () {
                var $this = $(this);
                switch ($(this).val()) {
                    case 'link':
                        $this.parent().parent().parent().find(".button-image-url").hide();
                        break;
                    case 'button':
                        $this.parent().parent().parent().find(".button-image-url").hide();
                        break;
                    case 'image':
                        $this.parent().parent().parent().find(".button-image-url").show();
                        break;
                }
            });
        buttonsContainer.find('.button-options').css({ 'margin-left': '25px', 'float': 'left' })
            .find('label').css({ 'display': 'block', 'float': 'left', 'width': '90px' });
        var $rolesDiv = buttonsContainer.find('.button-roles');
        $rolesDiv.css({ 'float': 'left', 'margin-left': '15px' });
        utilLoadRolesList($rolesDiv.find('div select'), opts.xdata);
        // Set default button captions
        $txtRows = $('.button-text > div input');
        $txtRows.eq(0).val(opts.labelsButtons[7]);
        $txtRows.eq(1).val(opts.labelsButtons[8]);
        $txtRows.eq(2).val(opts.labelsButtons[9]);
        $txtRows.eq(3).val(opts.labelsButtons[10]);

    }

    function initSlideshowTab(slideshowContainer, opts) {
        slideshowContainer.append(
            '<div class="xmp-vb-row">' +
            ' <label>' + opts.labelsSlideshow[0] + '</label><input type="text" style="width:70px;margin-left:10px;margin-right:10px" class="ss-height" />' +
            ' <label>' + opts.labelsSlideshow[1] + '</label><input type="text" style="width:70px; margin-left:10px;" class="ss-width" />' +
            '</div>' +
            utilGetRowHtml(opts.labelsSlideshow[2], '<input type="text" style="width:70px; margin-left: 10px;" value="4000" class="ss-timeout" />') +
            utilGetRowHtml(opts.labelsSlideshow[3], '<input type="text" style="width: 250px; margin-left: 10px;" value="~/Portals/' + opts.portalId + '" ' +
                'class="ss-baseimagepath" />') +
            utilGetRowHtml(opts.labelsSlideshow[4], '<select size="1" style="margin-left:10px;" class="ss-imagefield" />') +
            utilGetRowHtml(opts.labelsSlideshow[5], '<input type="checkbox" class="ss-resizeimages" />')
        );
    }

    function initFixedGridTab(fixedGridContainer, opts) {
        fixedGridContainer.append(
            utilGetRowHtml(opts.labelsFixedGrid[1],
                '<input type="text" style="width:70px;" class="fg-totalwidth numeric required" value="400" />') +
            utilGetRowHtml(opts.labelsFixedGrid[0],
                '<input type="text" style="width:70px;" class="fg-colcount numeric required" value="3" />') +
            utilGetRowHtml(opts.labelsFixedGrid[3],
                '<input type="text" style="width:70px;" class="fg-margin numeric required" value="0" />') +
            utilGetRowHtml(opts.labelsFixedGrid[2],
                '<input type="text" style="width:70px;" class="fg-pagesize numeric required" value="10" />')
        );
        fixedGridContainer.find('label').css({
            'display': 'block', 'float': 'left', 'width': '120px'
        });
    }

    function utilGetRowHtml(label, controlHtml, labelOnRight, labelClass) {
        var labelCSS = '';
        if (labelClass) labelCSS = ' class="' + labelClass + '"';
        if (!labelOnRight)
            return '<div class="xmp-vb-row"><label' + labelCSS + '>' + label + '</label>' + controlHtml + '</div>';
        return '<div class="xmp-vb-row">' + controlHtml + '<label' + labelCSS + '>' + label + '</label></div>';
    }

    // get HTML option tags to populate a SELECT tag. arrays must be same length.
    function utilGetListHtml(arrLabels, arrValues) {
        var sOut = '';
        for (var i = 0; i < arrLabels.length; i++) {
            sOut += '<option value="' + arrValues[i] + '">' + arrLabels[i] + '</option>';
        }
        return sOut;
    }

    // utility function to show progress indicator
    function showProgress($el) {
        $el.after('<span class="xmp-progress" />');
    }
    function hideProgress($sel) {
        $el.next('span.xmp-progress').remove();
    }

    function utilLoadRolesList($lst, xdata) {
        var kbxm_UrlUtil = 'KBXM_DUtils.aspx';
        var kbxm_xdata = xdata;
        $.ajax({
            type: "GET",
            dataType: "html",
            url: kbxm_UrlUtil,
            data: { method: 'getrolelist',
                xdata: kbxm_xdata
            },
            success: function (data) {
                $lst.append(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            cache: false
        });
    }

    function createView(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var out = '';
        var viewType = container.find('select#ddlViewType').val();
        var $listViewContainer = container.find('#tabListView');
        var arrSelectedFields = getSelectedColumns($listViewContainer);
        var selectedTable = getSelectedTable($listViewContainer);
        var arrKeyFields = getKeyColumns($listViewContainer);
        var connectionString = getConnectionString($listViewContainer);
        var arrButtons = getButtonsSettings(container);

        if (arrButtons.length > 0) {
            // ensure key field(s), if they aren't in the selected columns, are included 
            // in the SQL command for ListDataSource - b/c they will be used in 
            // command buttons (edit,detail, etc.).
            for (var i = 0; i < arrKeyFields.length; i++) {
                var bKeyFound = false;
                for (var j = 0; j < arrSelectedFields.length; j++) {
                    if (arrKeyFields[i] == arrSelectedFields[j]) {
                        bKeyFound = true;
                        break;
                    }
                }
                if (!bKeyFound) arrSelectedFields.splice(0, 0, arrKeyFields[i]);
            }
        }

        var listDataSource = createListDataSource(selectedTable, arrSelectedFields, connectionString);
        var detailDataSource = '', detailTemplate = '';
        var $detailViewContainer = container.find('#tabDetailView');
        var bIncludeDetail = $('#chkInclDetailView').get(0).checked;
        if (bIncludeDetail) {
            var selectedColumns = $('#lstDetailFields option:selected');
            var arrSelColumns = new Array()
            selectedColumns.each(function () {
                arrSelColumns.push($(this).val());
            });
            detailDataSource = createDetailDataSource(
								selectedTable,
								arrSelColumns,
								arrKeyFields,
								connectionString);
            for (var i = 0; i < selectedColumns.length; i++) {
                detailTemplate += '\n    <strong>' + arrSelColumns[i] + '</strong> [[' + arrSelColumns[i] + ']]<br />';
            }
            detailTemplate += '\n    <xmod:ReturnLink CssClass="dnnSecondaryAction" Text="&lt;&lt; Return" />\n';
        }
        var deleteCommand = createDeleteCommand(selectedTable, arrKeyFields, connectionString)
        var roles = '';
        var addButton = '', editButton = '', deleteButton = '', detailButton = '';
        for (var i = 0; i < arrButtons.length; i++) {
            if (roles.length > 0) roles += ' ';
            var curBtn = arrButtons[i];
            switch (curBtn.Type) {
                case 'add':
                    roles += 'AddRoles="' + curBtn.Roles + '"';
                    addButton = createButton(curBtn, null);
                    break;
                case 'edit':
                    roles += 'EditRoles="' + curBtn.Roles + '"';
                    editButton = createButton(curBtn, arrKeyFields);
                    break;
                case 'delete':
                    roles += 'DeleteRoles="' + curBtn.Roles + '"';
                    deleteButton = createButton(curBtn, arrKeyFields);
                    break;
                case 'detail':
                    roles += 'DetailRoles="' + curBtn.Roles + '"';
                    detailButton = createButton(curBtn, arrKeyFields);
                    break;
            }
        }
        if (roles.length > 0) roles = ' ' + roles; // add spacing if roles are defined.
        var bHasButtons = (addButton || editButton || deleteButton || detailButton);
        // only use commands if buttons are specified
        if (!deleteButton) deleteCommand = '';
        if (!detailButton) detailDataSource = '';

        switch (viewType) {
            case 'grid':
                out += '<xmod:Template UsePaging="True" Ajax="False"' + roles + '>\n';
                if (listDataSource) out += indentLines(listDataSource, 2) + '\n';
                if (detailDataSource) out += indentLines(detailDataSource, 2) + '\n';
                if (deleteCommand) out += indentLines(deleteCommand, 2) + '\n';

                out += '  <HeaderTemplate>\n' +
                       '    <table>\n' +
                       '      <thead>\n' +
                       '        <tr>\n';
                for (var i = 0; i < arrSelectedFields.length; i++) {
                    out += '          <th>' + arrSelectedFields[i].replace(/([a-z])([A-Z])/, "$1 $2") + '</th>\n';
                }
                if (bHasButtons) out += '          <th>&nbsp;</th>\n';
                out += '        </tr>\n' +
                       '      </thead>\n' +
                       '      <tbody>\n' +
                       '  </HeaderTemplate>\n' +
                       '  <ItemTemplate>\n' +
                       '        <tr>\n';
                for (var i = 0; i < arrSelectedFields.length; i++) {
                    out += '          <td>[[' + arrSelectedFields[i] + ']]</td>\n';
                }
                if (bHasButtons) {
                    var btns = indentLines(editButton + '\n' + deleteButton + '\n' + detailButton, 12);
                    out += '          <td>\n';
                    out += btns + '\n';
                    out += '          </td>\n';
                }
                out += '        </tr>\n' +
                       '  </ItemTemplate>\n' +
                       '  <FooterTemplate>\n' +
                       '      </tbody>\n' +
                       '    </table>\n' +
                       '  </FooterTemplate>\n';
                if (bIncludeDetail) {
                    out += '\n  <DetailTemplate>\n' +
						   detailTemplate + '\n' +
						   '  </DetailTemplate>\n';
                }
                out += '</xmod:Template>\n';
                if (addButton) {
                    out += '<div>\n' +
                        indentLines(addButton, 2) +
                        '</div>\n';
                }
                break;
            case 'fixedgrid':
                var $fgContainer = container.find('#tabFixedGrid');
                out += '<xmod:Template UsePaging="True" Ajax="False"' + roles + '>\n';
                if (listDataSource) out += indentLines(listDataSource, 2) + '\n';
                if (detailDataSource) out += indentLines(detailDataSource, 2) + '\n';
                if (deleteCommand) out += indentLines(deleteCommand, 2) + '\n';
                var nCols = $fgContainer.find('.fg-colcount').val();
                var nWidth = $fgContainer.find('.fg-totalwidth').val();
                var nMargin = $fgContainer.find('.fg-margin').val();
                var nColWidth = Math.floor(nWidth / nCols) - (nMargin * 2);
                out += '  <HeaderTemplate>\n' +
                       '    <div style="width:' + nWidth + 'px;overflow:hidden;">\n' +
                       '  </HeaderTemplate>\n' +
                       '  <ItemTemplate>\n' +
                       '      <div style="width:' + nColWidth + 'px;float:left;margin:' + nMargin + 'px;">\n';
                for (var i = 0; i < arrSelectedFields.length; i++) {
                    out += '        <span>[[' + arrSelectedFields[i] + ']]</span><br />\n';
                }
                if (bHasButtons) {
                    var btns = indentLines(editButton + '\n' + deleteButton + '\n' + detailButton, 12);
                    out += '        <div>\n';
                    out += btns + '\n';
                    out += '        </div>\n';
                }
                out += '      </div>\n' +
                       '  </ItemTemplate>\n' +
                       '  <FooterTemplate>\n' +
                       '    </div>\n' +
                       '  </FooterTemplate>\n';
                if (bIncludeDetail) {
                    out += '\n  <DetailTemplate>\n' +
						   detailTemplate + '\n' +
						   '  </DetailTemplate>\n';
                }
                out += '</xmod:Template>\n';
                if (addButton) {
                    out += '<div>\n' +
                        indentLines(addButton, 2) +
                        '</div>\n';
                }
                break;
            case 'ol':
            case 'ul':
                out += '<xmod:Template UsePaging="True" Ajax="False"' + roles + '>\n';
                if (listDataSource) out += indentLines(listDataSource, 2) + '\n';
                if (detailDataSource) out += indentLines(detailDataSource, 2) + '\n';
                if (deleteCommand) out += indentLines(deleteCommand, 2) + '\n';
                out += '  <HeaderTemplate>\n' +
                       '    <' + viewType + '>\n' +
                       '  </HeaderTemplate>\n' +
                       '  <ItemTemplate>\n' +
                       '      <li>\n';
                var sTemp = '';
                for (var i = 0; i < arrSelectedFields.length; i++) {
                    if (i > 0) sTemp += ', ';
                    sTemp += '[[' + arrSelectedFields[i] + ']]';
                }
                out += '        ' + sTemp + '\n';
                if (bHasButtons) {
                    out += indentLines(editButton + '\n' + deleteButton + '\n' + detailButton, 8);
                }
                out += '\n      </li>\n' +
                       '  </ItemTemplate>\n' +
                       '  <FooterTemplate>\n' +
                       '      </' + viewType + '>\n' +
                       '  </FooterTemplate>\n';
                if (bIncludeDetail) {
                    out += '\n  <DetailTemplate>\n' +
						   detailTemplate + '\n' +
						   '  </DetailTemplate>\n';
                }
                out += '</xmod:Template>\n';
                if (addButton) {
                    out += '<div>\n' +
                        indentLines(addButton, 2) +
                        '</div>\n';
                }
                break;
            case 'slideshow':
                var basePath = container.find('.ss-baseimagepath').val();
                var clientImagePath = basePath;
                if (clientImagePath.indexOf('~/') == 0) clientImagePath = clientImagePath.replace('~/', kbxm_WebRoot);
                if (clientImagePath.indexOf('~') == 0) clientImagePath = clientImagePath.replace('~', kbxm_WebRoot);
                if (!clientImagePath.match(/\/$/)) clientImagePath += '/';
                var imageField = container.find('.ss-imagefield').val();
                var height = container.find('.ss-height').val();
                var width = container.find('.ss-width').val();
                var timeout = container.find('.ss-timeout').val();
                var resizeImages = container.find('.ss-resizeimages').get(0).checked;
                out += '<xmod:Slideshow';
                out += (basePath) ? ' BasePath="' + basePath + '"' : '';
                out += (imageField) ? ' ImageField="' + imageField + '"' : '';
                out += (height) ? ' Height="' + height + '"' : '';
                out += (width) ? ' Width="' + width + '"' : '';
                out += (resizeImages) ? ' ResizeImages="' + resizeImages + '"' : '';
                out += '>\n' + indentLines(listDataSource, 2) + '\n</xmod:Slideshow>\n';
                if (bHasButtons) {
                    // create administrative view
                    out += '\n<!-- ===============================\n' +
                             '     ===== ADMINISTRATIVE VIEW =====\n' +
                             '     =============================== -->\n';
                    out += '<xmod:Select>\n' +
                           '<Case CompareType="Role" Expression="Administrators">\n';
                    out += '  <xmod:Template>\n' +
                           indentLines(listDataSource, 4) + '\n\n';
                    out += '    <ItemTemplate>\n' +
                           '      <div style="overflow: hidden;">\n' +
                           '        <img src="' + clientImagePath + '[[' + imageField + ']]" style="height: 100px; width: 100px; float: left; margin: 10px;" />\n';
                    if (editButton) out += indentLines(editButton, 8) + '\n';
                    if (deleteButton) out += indentLines(deleteButton, 8) + '\n';
                    out += '      </div>\n' +
                           '    </ItemTemplate>\n' +
                           '  </xmod:Template>\n'
                    if (addButton) {
                        out += '<div>\n' +
                               indentLines(addButton, 4) + '\n' +
                               '</div>\n';
                    }
                    out += '</Case>\n' +
                           '</xmod:Select>\n';
                }
                break;
            default:
                // no view type selected
                out += '<xmod:Template UsePaging="True" Ajax="False"' + roles + '>\n';
                if (listDataSource) out += indentLines(listDataSource, 2) + '\n';
                if (detailDataSource) out += indentLines(detailDataSource, 2) + '\n';
                if (deleteCommand) out += indentLines(deleteCommand, 2) + '\n';
                out += '  <HeaderTemplate>\n' +
                       '    \n' +
                       '  </HeaderTemplate>\n' +
                       '  <ItemTemplate>\n' +
                       '    \n' +
                       '  </ItemTemplate>\n' +
                       '  <FooterTemplate>\n' +
                       '      \n' +
                       '  </FooterTemplate>\n';
                if (bIncludeDetail) {
                    out += '\n  <DetailTemplate>\n' +
						   detailTemplate + '\n' +
						   '  </DetailTemplate>\n';
                }
                out += '</xmod:Template>\n';
                if (addButton) {
                    out += '<div>\n' +
                        indentLines(addButton, 2) +
                        '</div>\n';
                }
                break;
        }
        return out;
    } // createView

    // utility to insert spaces for indentation
    function indentLines(input, indentSize) {
        var arrLines = input.split('\n');
        var indent = new Array(1 + indentSize).join(' ');
        for (var i = 0; i < arrLines.length; i++) {
            arrLines[i] = indent + arrLines[i];
        }
        return arrLines.join('\n');
    }
    function getButtonsSettings(container) {
        var buttonsContainer = container.find('#tabButtons');
        var arrButtons = new Array();
        buttonsContainer.find('input[type="checkbox"]').each(function (idx, el) {
            if (el.checked) {
                var btnSettings = $(el).parent().next();
                var btn = {};
                switch (idx) {
                    case 0: btn.Type = 'add'; break;
                    case 1: btn.Type = 'edit'; break;
                    case 2: btn.Type = 'delete'; break;
                    case 3: btn.Type = 'detail'; break;
                }
                btn.Display = btnSettings.find('select.button-type').val();
                btn.Text = btnSettings.find('div.button-text input').val();
                btn.ImageUrl = btnSettings.find('div.button-image-url input').val();
                btn.Roles = '';
                btnSettings.find('div.button-roles select option:selected').each(function (idx, el) {
                    if (btn.Roles) { btn.Roles += ';' }
                    btn.Roles += $(el).val();
                });
                arrButtons.push(btn);
            }
        });
        return arrButtons;
    }
    function createParamTags(arrParameters, indent, bInclValue) {
        if (!indent) indent = ''; // no indentation
        var sParams = '';
        for (var i = 0; i < arrParameters.length; i++) {
            if (sParams.length > 0) sParams += '\n';
            sParams += indent + '<Parameter Name="' + arrParameters[i] + '"';
            if (bInclValue) sParams += ' Value=\'[[' + arrParameters[i] + ']]\'';
            sParams += ' />\n';
        }
        return sParams;
    }
    function createButton(btnSettings, arrParameters) {
        var btnType = btnSettings.Type.toUpperCase().charAt(0) +
                      btnSettings.Type.toLowerCase().substring(1);
        var btnDisplay = btnSettings.Display.toUpperCase().charAt(0) +
                         btnSettings.Display.toLowerCase().substring(1);
        var sButton = '<xmod:' + btnType + btnDisplay + ' Text="' + btnSettings.Text + '"';
        if (btnSettings.Type == 'delete') {
            sButton += ' OnClientClick="return confirm(\'Are you sure you want to delete this?\');"';
        }
        if (btnSettings.ImageUrl) sButton += ' ImageUrl="' + btnSettings.ImageUrl + '"';
        if (arrParameters) {
            sButton += '>\n';
            sButton += createParamTags(arrParameters, '  ', true);
            sButton += '</xmod:' + btnType + btnDisplay + '>';
        } else {
            sButton += ' />\n';
        }
        return sButton;
    }

    function createListDataSource(tableName, arrSelectedColumns, connectionString) {
        var out = "<ListDataSource CommandText=\"" +
            createSQLCommand(tableName, arrSelectedColumns, null) + "\"";
        if (connectionString) { out += " ConnectionString=\"" + connectionString + "\""; }
        out += "/>";
        return out;
    }

    function createDetailDataSource(tableName, arrSelectedColumns, arrKeyFields, connectionString) {
        var out = "<DetailDataSource CommandText=\"" +
            createSQLCommand(tableName, arrSelectedColumns, arrKeyFields) + "\"";
        if (connectionString) { out += " ConnectionString=\"" + connectionString + "\""; }
        if (arrKeyFields && arrKeyFields.length) {
            out += '>\n' + createParamTags(arrKeyFields, '  ', false) + '</DetailDataSource>';
        } else {
            out += "/>";
        }
        return out;
    }

    function createDeleteCommand(tableName, arrKeyFields, connectionString) {
        var out = "<DeleteCommand CommandText=\"" +
            createSQLCommand(tableName, null, arrKeyFields, "delete") + "\"";
        if (connectionString) { out += " ConnectionString=\"" + connectionString + "\""; }
        if (arrKeyFields && arrKeyFields.length) {
            out += '>\n' + createParamTags(arrKeyFields, '  ', false) + '</DeleteCommand>';
        } else {
            out += "/>";
        }
        return out;
    }

    // utility to generate SELECT/DELETE statement
    function createSQLCommand(tableName, arrSelectedColumns, arrKeyFields, sqlCommand) {
        if (!tableName) return ''; // if no table selected, return an empty string.
        var colList = "";
        if (!arrSelectedColumns || arrSelectedColumns.length == 0) {
            // no columns, select all columns
            colList = "*";
        } else {
            for (var i = 0; i < arrSelectedColumns.length; i++) {
                if (i > 0) { colList += ", " };
                colList += "[" + arrSelectedColumns[i] + "]";
            }
        }
        var commandText = '';
        if (sqlCommand && sqlCommand.toLowerCase() == 'delete') {
            commandText = "DELETE FROM " + tableName;
        } else {
            commandText = "SELECT " + colList + " FROM " + tableName;
        }
        // generate WHERE clause
        if (arrKeyFields && arrKeyFields.length > 0) {
            var sWhere = 'WHERE';
            for (var i = 0; i < arrKeyFields.length; i++) {
                if (i > 0) sWhere += ' AND ';
                sWhere += ' [' + arrKeyFields[i] + '] = @' + arrKeyFields[i];
            }
            commandText += ' ' + sWhere;
        }
        return commandText;
    }

    // returns array of column names that have been selected by the user for inclusion in view
    function getSelectedColumns(settingsContainer) {
        return settingsContainer.find('div:eq(1)').dataChooser("getSelectedFields");
    }
    function getSelectedTable(settingsContainer) {
        return settingsContainer.find('div:eq(1)').dataChooser("getSelectedTable");
    }
    function getConnectionString(settingsContainer) {
        return settingsContainer.find('div:eq(1)').dataChooser("getConnectionString");
    }
    function getAllColumns(settingsContainer) {
        return settingsContainer.find('div:eq(1)').dataChooser("getAllFields");
    }
    function getKeyColumns(settingsContainer) {
        return settingsContainer.find('div:eq(1)').dataChooser("getKeyFields");
    }
})(jQuery);

