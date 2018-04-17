(function ($) {
   "use strict";
   /* 
   * Start animated Modal 
   * Richiede:
   * - animate.css - http://daneden.me/animate v3.5.1
   * - Bootstrap 3.3.7 / 4.0.0 o superiore  - http://getbootstrap.com/
   * Config VidalWeb
   * version 1.2
   * Create 26-09-2016
   * - Inserire questo nel vostro CSS o style :
   * - Dopo di che potete godere di questo script
   * - Copyright: VidalWeb
   */
   var NAME = 'modal';
   if (typeof $.fn[NAME] === "undefined") {
      window.console.error("Modal Animated richiede Bootstrap.js 3.3.6 o superiore !");
      return false; //break;
   }
   var _sCodal       = $.fn[NAME];
   var _sVersion     = parseInt(_sCodal.Constructor.VERSION.replace(/[^0-9]/g,''));
   var _sShow        = _sCodal.Constructor.prototype.show;
   var _sHide        = _sCodal.Constructor.prototype.hide;
   var _sHiddeMd     = _sCodal.Constructor.prototype[_sVersion>=400?'_hideModal':'hideModal'];
   var _sBackdrop    = _sCodal.Constructor.prototype[_sVersion>=400?'_showBackdrop':'backdrop'];
   var _animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend webkitTransitionEnd MozTransition MSTransition oTransitionEnd transitionend';


    // Call Modal con plugin animation
	$.fn.ModalAnimated = function( options ){

      var _sSel = {
         BODY: document.body,
         ELEMENT: _sVersion >= 400 ? '_element' : '$element',
         HIDDEN:  _sVersion >= 400 ? '_hideModal' : 'hideModal',
         OPTIONS: _sVersion >= 400 ? '_config' : 'options',
         FN_BACKGROP: _sVersion >= 400 ? '_showBackdrop' : 'backdrop',
         DATA_KEY: 'bs.'+NAME,
         TARGET: '.modal',
         DIALOG: '.modal-dialog',
         CONTENT: '.modal-content',
         MD_BODY: '.modal-body',
         MD_TITLE: '.modal-title',
         MD_HEADER: '.modal-header',
         MD_FOOTER: '.modal-footer',
         DATA_TOGGLE: '[data-toggle="modal"]',
         DATA_DISMISS: '[data-dismiss="modal"]',
         BACKDROP: 'modal-backdrop',
         SHEER: 'modal-sheer',
         CENTER: 'modal-center',
         OPEN: 'modal-open',
         FADE: 'fade',
         IN: 'in'
      };
      
      var _sTrigger = function(target, name, relatedTarget) {
        target.trigger($.Event(name, { relatedTarget: relatedTarget }));
      };
      
      var _sDelayDuration = function(elem,sDuration,sDelay){
        var aDuration  = sDuration || '';
        var aDelay 	  = sDelay || '';
        var css = {
            '-webkit-animation-duration': aDuration,
            '-webkit-animation-delay': aDelay,
            'animation-duration': aDuration,
            'animation-delay': aDelay
        };
        $(elem).css(css);
        //return css;
      };

      var _sBoolean = function(string){
           return string === 'true' ? true : false;
      };
      var _sRemoveDraggable = function(){
         // var UIDRAG = ':ui-draggable'; //.detach()
         $(_sSel.TARGET).add([_sSel.TARGET,_sSel.DIALOG].join(' '))
         .each(function(){
            if ( $(this).data('ui-draggable') ) {
               $(this).draggable("destroy");
            }
         }); // each
      };
      var _sRstyle = function(that){
         var element = $(that[_sSel.ELEMENT]);
         var rStyle = {
            left: '',
            top: '',
            right: '',
            bottom: '',
            width: '',
            height: '',
            'margin-top':'',
            'margin-left':'',
            'max-height':''
         };
         
         $(_sSel.MD_BODY,element).css('display','');
         $([_sSel.DIALOG,_sSel.CONTENT,_sSel.MD_BODY].join(','),element).add(element).css(rStyle).removeClass('moveslow');
         $(element).add(_sSel.BODY).removeClass([_sSel.FADE,_sSel.CENTER,_sSel.SHEER,$(element).data('body-addclass')].join(' '));
         $(element).removeClass($(element).data('animationadd')); // rimuovere la precederente animation inserita 
         _sRemoveDraggable();
         // removeData().clearQueue().finish();
      };
      var _sClose = function(that) {
         var element = $(that[_sSel.ELEMENT]);
         var dialogclass = element.data('md-dialogclass');
         _sRstyle(that);
         $(_sSel.DIALOG,element).removeClass(dialogclass);
         
         // console.log('CHIUDO AMIGO');
         element.removeData();
         element.hide(); // style.display = 'none'; //$.parseHTML()
         if ( _sVersion >= 400 ) {
            that[_sSel.FN_BACKGROP](function () {
               $(_sSel.BODY).removeClass(_sSel.OPEN);
               that._resetAdjustments();  // default
               that._resetScrollbar();  // default
               element.trigger('hidden.bs.modal');
            });
         } else {
           that[_sSel.FN_BACKGROP](function () {
               $(_sSel.BODY).removeClass(_sSel.OPEN);
               that.resetAdjustments(); // default
               that.resetScrollbar();  // default
               element.trigger('hidden.bs.modal');
           });
         }
         // return _sHideM.call(this, _rtarget);
         // $(eelm).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){});
      };
  
      var _sCenterAbsolute = function(element) {
         var winW = $(window).width();
         var winH = $(window).height();
         $(element).css({top: (winH / 2 - element.prop('offsetHeight') / 2), left: (winW / 2 - element.prop('offsetWidth') / 2)});
         // console.log('MENU FISSO: winW('+winW+') ('+(winH / 2 - element.height() / 2)+') -- winH('+winH+') ('+(winW / 2 - element.width() / 2)+')');
      };
       
      var _sSheer = function(that){
         var element = $(that[_sSel.ELEMENT]);
         var dialog  = $(_sSel.DIALOG,element);
         if ( $(_sSel.BODY).hasClass(_sSel.SHEER) ){
            $(element).show().css({width: dialog.prop('offsetWidth'), height: dialog.prop('offsetHeight') });
            // $(element).css({width: dialog.outerWidth(), height: dialog.outerHeight() }); // (outerHeight)-> Questa version da problemi con Jquery 3.1
            _sCenterAbsolute(element);
         }
      };
       
      var _sAdjustModal = function(that){
         var element   = $(that[_sSel.ELEMENT]);
         if ( $(element).is(':hidden') ){  //$(_sSel.TARGET,element).is(':hidden')
            return false; // console.log('->PROBLEMA PROBLEMA OK <-');
         }
         $(element).show();
         var CenterAbs = _sBoolean(element.data('md-center-absolute'));
         var elemAct   = element.data('md-sheer') === 'true' ? element : $(_sSel.DIALOG,element);
         
         if ( $(_sSel.BODY).hasClass(_sSel.CENTER) ) {
            
            // console.log('Aqui estamos');
            var plusH = element.data('md-center-heightplus') || null;
            var limit = element.data('md-center-minheight') || null;
            var minHt = element.data('md-center-maxheight') || 611; // Default: 611
            var adjus = $(window).height() <= minHt ? 1:20 ; // serve per il dispositivi mobili
            var lmtHH = limit > 0 ? limit : adjus;
            var addHt = plusH || 0; 
            // console.log('Prendo limit('+limit+') minHt('+minHt+')');
            $(_sSel.BODY).add(_sSel.TARGET).css('padding-right','');
            
            if($(element).hasClass('in') === false){
               $(element).show();
            }
            
            var contentHeight = $(window).height() + addHt - lmtHH;
            
            var headerHeight  = $(_sSel.MD_HEADER,element).prop('offsetHeight') || 2; // .outerHeight() | prop('offsetHeight') 
            var footerHeight  = $(_sSel.MD_FOOTER,element).prop('offsetHeight') || 2; // .outerHeight()
   

            $(_sSel.CONTENT,element).css({
               'max-height': function () {
                  return contentHeight;
               }
            });
            
            $(_sSel.MD_BODY,element).css({
               'max-height': function () {
                  return contentHeight - ( headerHeight + footerHeight );
               }
            });
            
            /* --- CENTER DIV CON MAX E MIN MARGIN --- */
            if ( CenterAbs && $(_sSel.BODY).hasClass(_sSel.SHEER) !== true ){
               _sCenterAbsolute(elemAct);
            } else {
               
               $(_sSel.DIALOG,element).css({
                  'margin-top': function () {
                     return -($(element).prop('offsetHeight') / 2); // outerHeight()
                  },
                  'margin-left': function () {
                     return -($(element).prop('offsetWidth') / 2); // outerWidth()
                  }
               });
            }
            if($(element).hasClass('in') === false){
              $(element).hide();
            }
            
         } // if
         _sSheer(that);

      };//end function

      
      $.extend(_sCodal.Constructor.prototype, {
           enforceFocus: function (_rtarget) {
               var that    = this;
               var returx  = _sShow.call(that, _rtarget);
               return returx;
           },
           show: function (_rtarget) {
               var that    = this;
               var element = $(that[_sSel.ELEMENT]);
               var dialog  = $(_sSel.DIALOG,element);
               // Animation: 
               var bodyAddClass         = element.data('body-addclass');
               var animated             = element.data('animated');
               var animateIn            = element.data('animate-in');
               var animateInTime        = element.data('animate-in-time');
               var animateInDelay       = element.data('animate-in-delay');
               var minimize             = element.data('md-minimize');
               var modalCenter          = element.data('md-center');
               var modalDraggable       = element.data('md-draggable');
               var DragContainment      = element.data('md-drag-containment');
               var Backdrop             = element.data('md-backdrop');
               var Keyboard             = element.data('md-keyboard');
               var modalSheer           = element.data('md-sheer');
               var dialogclass          = element.data('md-dialogclass');
               var elAnimated           = modalSheer === 'true' ? element : dialog;
               var FnDraggable          = element.data('fn-draggable');
               // $('#mymodal').on('hide.bs.modal',function(){ });
               // $('#mymodal').on('hidden.bs.modal',function(){ });
               
               // console.log('vediamo cosa ce prima : '+$('.modal.in').attr('style'));            
               if ( typeof animated === 'undefined' ){ // se non ce niente faccio passare il originale
                  return _sShow.call(that, _rtarget);
               }
               _sRstyle(that);
               // Change options default e importante prima del .call();
               // that.$body = $('.col-lg-12');

               that[_sSel.OPTIONS].keyboard = _sBoolean(Keyboard);
               that[_sSel.OPTIONS].backdrop = _sBoolean(Backdrop)? true: (Backdrop==='static'?'static':_sBoolean(Backdrop));
               that[_sSel.FN_BACKGROP]();
               
               if (bodyAddClass) { $(_sSel.BODY).addClass(bodyAddClass); }
               
               $(_sSel.DIALOG,element).addClass(dialogclass);
               
               if ( minimize === 'true'){

                  $('button.minus,button.close',_sSel.MD_HEADER,element).remove();
                  $('<button />', {
                     type: 'button',
                     'data-dismiss': 'modal',
                     'aria-label': 'Chiudi',
                     class: 'close',
                     html: '<i class="fa fa-times"></i>'
                  }).add(
                  $('<button />', {
                     type: 'button',
                     'data-dismiss': 'minus',
                     'aria-label': 'Minimizzare',
                     class: 'minus',
                     html: '<i class="fa"></i>' // fa-minus
                  })).insertBefore(_sSel.MD_TITLE,element); // prepend(), appendTo('body');
               } else {
                  $('button.minus',_sSel.MD_HEADER,element).remove();
               }

               // click minus
               element.on('click', '[data-dismiss="minus"]', function(e){
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  
                  $(_sSel.MD_BODY,element).stop(true,true).slideToggle({
                     duration: 300,
                     // start: function() {},
                     progress: function(anime,progr,remain){
                        // console.log('progress: anime('+anime+'),progr('+progr+'),remain('+remain+' <--');
                        _sAdjustModal(that);
                     },
                     complete: function() {
                        // Animation complete.
                        _sAdjustModal(that);
                        if ( $(this).is(':hidden') ){
                           $('[data-dismiss=minus]',_sSel.MD_HEADER).addClass('plus'); 
                        } else {
                           $('[data-dismiss=minus]',_sSel.MD_HEADER).removeClass('plus'); 
                        }
                     }
                  });

               });
               
               // console.log('Entro : '+_sBoolean(Backdrop));
               var returx  = _sShow.call(that, _rtarget);
               
               if (animated === 'true' && animateIn){
                   // Animation In Element
                   _sDelayDuration(elAnimated,animateInTime,animateInDelay);
                   that.animatedCss(animateIn,false,_rtarget);
               }

               if ( _sBoolean(modalCenter) || _sBoolean(modalSheer) ){
                  if (_sBoolean(modalCenter)) { $(_sSel.BODY).addClass(_sSel.CENTER); }
                  if (_sBoolean(modalSheer)) { $(_sSel.BODY).addClass(_sSel.SHEER); }
                  $(window).on('resize',function(){
                     _sAdjustModal(that);
                  }).trigger("resize"); // --> con trigger autochiamo in automatico
               }

               // Config draggable jquery ui
               // $(elAnimated).draggable({disabled:true,handle: ".modal-title"});
               if ( modalDraggable === 'true' && typeof $.ui.draggable === 'function'){
                  $(elAnimated).draggable(
                     $.extend({
                        // disabled: false,
                        handle: ".modal-title",
                        cursor: 'move',
                        containment: DragContainment,
                        drag: function(event, ui) {
                           // console.log('drag');
                           $(ui.draggable).remove();
                        }
                     },{},FnDraggable)
                  ); // Draggable
               } // if draggable

               return returx;
           },
           hide: function (_rtarget) {
               return _sHide.call(this, _rtarget);
           },
           // version 4
           _hideModal: function (_rtarget) {
               this.occultMD(_rtarget);
           },
           // version 3.6/7
           hideModal: function (_rtarget) {
               this.occultMD(_rtarget);
           },
           
           occultMD: function (_rtarget) {
               var that = this;
               var element = $(that[_sSel.ELEMENT]);
               var dialog  = $(_sSel.DIALOG,element);
               // var returx = _sHideM.call(that, _rtarget);
               // console.log('chiuso totalmente');
               var animated        = element.data('animated');
               var animateClose    = element.data('animate-close');
               var animateOut      = element.data('animate-out');
               var animateOutTime  = element.data('animate-out-time');
               var animateOutDelay = element.data('animate-out-delay');
               var modalSheer      = element.data('md-sheer');
               var elAnimated      = modalSheer === 'true' ? element : dialog;
               if ( typeof animated === 'undefined' ){ // se non ce niente faccio passare il originale
                  return _sHiddeMd.call(that, _rtarget);
               }
               if ( animated === 'true' && animateClose === 'true' && animateOut ){
                   _sDelayDuration(elAnimated,animateOutTime,animateOutDelay);
                   that.animatedCss(animateOut,true,_rtarget); //animated-close
               } else {
                   _sClose(that);
               }
           },
           // version 3.6/7
           backdrop: function (_rtarget) {
              this.__backdrop(_rtarget);
           },
           // version 4
           _showBackdrop: function (_rtarget) {
              this.__backdrop(_rtarget);
           },
           // default modal animated
           __backdrop: function (_rtarget) {
              
              _sBackdrop.call(this, _rtarget); // elemento default bootstrap.js
              var that    = this;
              var element = $(that[_sSel.ELEMENT]);
              var elBack  = $('.'+_sSel.BACKDROP);
              
              var animateInBack        = element.data('animate-in-back');
              var animateBackTime      = element.data('animate-back-time');
              var animateBackDelay     = element.data('animate-back-delay');
              var animateOutBack       = element.data('animate-out-back');
              // var BackdropClass        = element.data('md-backdrop-class');

             if ( elBack.length ){
                // Animation BackDrop
                _sDelayDuration(elBack,animateBackTime,animateBackDelay);
                $(elBack).addClass('animated').removeClass(animateOutBack).addClass(animateInBack);
                  //.one(_animationEnd, function(e) {
                    //  $(this).removeAttr('style').removeClass(animateInBack); // remove all animation
                     // $(this).off(e);
                  //});
                // Addd Class BackDrop --> overlay
                // if ( BackdropClass ){
                  // $(elBack).addClass(BackdropClass);
                // }
             }
              
              //return thist;
           },
           animatedCss: function ( animationName, callback, _rtarget) {
               var that        = this;
               var element     = $(that[_sSel.ELEMENT]);
               var dialog      = $(_sSel.DIALOG,element);
               var modalSheer  = element.data('md-sheer');
               var addAnimated = ['animated',animationName].join(' ');
               var elAnimated  = modalSheer === 'true' ? element : dialog;
               
               var elBack  = $('.'+_sSel.BACKDROP);
               var animateInBack  = element.data('animate-in-back');
               var animateOutBack = element.data('animate-out-back');
               
               // console.log(typeof callback); //object o boolean
               if ( callback === true ){
                   $(elBack).addClass('animated').addClass(animateOutBack).removeClass(animateInBack);
                     //.one(_animationEnd, function(e) {
                       //  elBack.removeAttr('style').removeClass(animateOutBack).removeClass(animateInBack); // remove all animation
                        // $(this).off(e);
                     //});
               }
               
               elAnimated.data('animationadd',addAnimated);
               elAnimated.addClass(addAnimated).one(_animationEnd, function(e) {
                   $(this).addClass('moveslow').removeClass(addAnimated);
                  
                   // console.log('Hombre '+animateInBack);
                   _sDelayDuration(this,null,null); // clear css
                   if ( callback === true ){
                       // console.log('PERCHE SUCCEDE '+callback);
                       _sClose(that);
                       _sTrigger(element, 'hidden.animatedout.bs.modal', _rtarget);
                   } else {
                       _sTrigger(element, 'hidden.animatedin.bs.modal', _rtarget);
                   }
                   
                   //elBack.removeAttr('style').removeClass(addAnimated).removeClass(animateInBack); // remove all animation
                   
                   $(this).off(e);
               });
           }
      }); // End-> $.extend bootstrap
      
		// var _this = $(this);
      // call hide animation: 
      // -> hidden.animatedout.bs.modal
      // -> hidden.animatedin.bs.modal
      var defaults = {
         'target': null,
         'body-add-class': '', // serve per aggiungere classe al body | utile per modal-backdro Esempio: backoverlay dopo lo posso gestiore come voglio
         'animated': 'true',
         'animate-close': 'true',
         'animate-in': 'zoomIn',
         'animate-out': 'zoomOut',
         'animate-in-time': '0.35s',
         'animate-in-delay': '-0.15s',
         'animate-out-time': '0.40s',
         'animate-out-delay': '',
         'animate-in-back': 'fadeIn', // backdrop
         'animate-out-back': '', // backdrop -> fadeOut
         'animate-back-time': '0.30s', // backdrop
         'animate-back-delay': '', // backdrop
         // 'md-backdrop-class': '', // serve per aggiungere classe
         'md-backdrop': 'true', // true,false,static
         'md-dialogclass': null, // add class al dialogo /-> Class disponible x Width-> s625,s650,s700,s725,s750,s800
         'md-keyboard': 'true',
         'md-sheer': 'false', // trasparente 
         'md-draggable': 'false',
         'md-drag-containment': 'false', // parent,body
         'md-minimize': 'false',
         'md-center': 'true',
         'md-center-absolute': 'true',
         'md-center-heightplus': null, // aumentare il completamento della finestra in height | Es.: 50
         'md-center-minheight': null, // distanza da top e bottom
         'md-center-maxheight': 611, // max mobile 
         'fn-draggable': {} // la posibilita di cambiare le impostazione draggable Es.: {stop:function(){},handle: ".modal-title"}
                            // handle: ".modal-title", //-> Default
                            // cursor: 'move',  //-> Default

      };
      //Call end function-> hidden.animatedin, hidden.animatedout, 
      var option = $.extend( {}, defaults, options );
      
      return this.each(function() {
            var _this = $(this);
            var starget = option.target || $(_this).data('target');
            var target  = starget ? starget : _this;
            var isclas  = $(target).hasClass('modal');
            var message = 'Error: Per poter utilizzare il plugin hai bisogna della class: "modal" nel container !!!';
            if ( isclas !== true ) {
               if ( window.console ){
                  console.error(message); // ti dà il messaggio di errore rosso
                  //console.log(message); // dà il messaggio predefinito
                  //console.warn(message); // dà il messaggio avvisa con il punto esclamativo davanti ad esso
                  //console.info(message); // dà un messaggio di informazioni con una 'i' di fronte al messaggio
               } else {    
                  throw new Error(message);
               }
            }
            if ( target && isclas ){
                $(target).off(_animationEnd); // Stop animated e faccio partire quella nuova
                $.map(option,function(value,key){
                    if ( /target/i.test(key) !== true ) {//if ( /animate|modal-/i.test(key) ) {
                        // var thisdata = $(_this).attr('data-'+key);
                        // console.log('Todos key->('+key+') value('+value+')'); //console.log('Todos -> '+key+'  thisdata('+typeof thisdata+') ');
                        // $(target).data(key,( typeof thisdata === 'string' ? thisdata : value )); 
                        $(target).data(key,( $(_this).attr('data-'+key) || value ));  //$(target).attr('data-'+key,( $(_this).data(key) || value ));
                    }
                });
                // Call Modal 
                $(target).modal({show: true});
            }
        });//each
    }; // end -> ModalCostum

})(jQuery);