(function($){
    var ssTimeout;
	$.fn.xmpSlideshow = function(options){
		options = $.extend($.fn.xmpSlideshow.defaults, options);
		return $(this).each(function(){
			$(this)
				.css({'overflow':'hidden', 'height':options.height, 'width':options.width, 'position':'relative'})
				.children('img').css({'position':'absolute'}).hide();
			if (options.resizeImages){
			    $(this).children('img').css({'height':options.height,'width':options.width});
			}
            start(this,1,options.timeout);
		});
	}

	$.fn.xmpSlideshow.defaults = {
		timeout: 4000,
		delay: 0,  
		width: '240px', 
		height: '240px', 
		resizeImages: false
	};
	
	function start(container,currentPhoto,timeout,delay){
		var $images = $(container).children('img');
		var numberOfPhotos = $images.length;
		currentPhoto = currentPhoto % numberOfPhotos;
		
		$images.eq(currentPhoto).fadeOut(function(){
			// re-order the z-index after the current photo is faded out.
			// this will put the current photo at the bottom of the stack, 
			// and make the one that was directly underneath it the current photo
			$images.each(function(i){
				$(this)
					.css({'zIndex': ((numberOfPhotos - i) + currentPhoto) % numberOfPhotos}).show();
			});
			$(this).show();
		    ssTimeout = setTimeout(function() {start(container,++currentPhoto,timeout);}, timeout);
		});
	}
})(jQuery);
