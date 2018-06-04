// plugin to handle previewing forms and templates in XMP
; (function($){
  var dataID = 'xmpPreview';
  var methods = {
    init: function(options) {
      var opts = $.extend({}, $.fn.xmpPreview.defaults, options);
      var container;
      var $this = $(this);
      var data = $this.data(dataID);
      if (!data) {
        $this.data(dataID, {
          opts: opts, 
          container: $(this), 
          panelLoading: null, 
          imageLoading: null, 
          framePreview: null, 
          returnButton: null
        });
      } 
      container = $(this);
      initialize($this);
    }, 
    show: function(itemName,isGlobal) {
      var container = $(this);
      var data = container.data(dataID);
      // hide any previous preview until new preview is loaded
      data.framePreview.hide();
      container.show();
      data.panelLoading.show();
      var parmG = isGlobal ? "1" : "0";
      data.framePreview.attr('src', 'PreviewForm.aspx?fn=' + itemName + '&xdata=' + data.opts.xdata + '&g=' + parmG);
    }
  }; // var methods
  
  $.fn.xmpPreview = function(method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.xmpPreview');
    }
  };
  
  function initialize(container) {
    var data = container.data(dataID);
    var opts = data.opts;
    var sHtml = 
      '<div id="divPreviewLoading" style="width:99%; height:50px; text-align: left;">' +
      '  <img src="' + opts.loadingImage + '" /> ' + opts.loadingLabel + 
      '</div>' + 
      '<iframe id="ifPreview" style="width:99%; height: 475px;" scrolling="no" frameborder="0" onload="kbxmPreviewLoadComplete()"></iframe>' + 
      '<button id="btnPreviewReturn">' + opts.returnLabel + '</button>'
    container.html('').append(sHtml);
    container.addClass("ui-widget ui-corner-all").css({'display':'none','height':'500px'});
    // assign objects
    data.panelLoading = container.find('div:first');
    data.imageLoading = data.panelLoading.find('img:first');
    data.framePreview = container.find('iframe:first');
    data.returnButton = container.find('button:first');
    data.framePreview.bind('load', function() {
      if ($(this).attr('src')) {
        $(this).show();
        $(this).parent().find('div:first').hide();
      }
    });
    data.returnButton.click( function(){
      container.hide();
      if (opts.returnHandler) opts.returnHandler();
      return false;
    });
  } // initialize()

  $.fn.xmpPreview.defaults = {
    xdata: null, 
    loadingLabel: "Loading...", 
    loadingImage: "images/ajax-loader.gif", 
    returnLabel: "Return", 
    returnHandler: null
  };
})(jQuery);