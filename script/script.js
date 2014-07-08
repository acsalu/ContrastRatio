var isToolsShown = true;
var defaultForeground = "f7d028";
var defaultBackground = "43cdee";

$(function() {

   var $inputForeground = $('#input-foreground');
   var $inputBackground = $('#input-background');

   var $swatchColorForeground = $('.color-foreground');
   var $swatchColorBackground = $('.color-background');
   var $grayForeground = $('.gray-foreground');
   var $grayBackground = $('.gray-background');
   var $colorRatio = $('.color-ratio');
   var $grayRatio = $('.gray-ratio');

   var $textPreview = $('#text-preview');
   var $summaryRatio = $('#summary-ratio');
   var $summaryText = $('#summary-text');
   var $tools = $('.tools');

   var $rulerHierachy = $('#ruler-hierachy');
   var $rulerIndicatorHierachy = $('#ruler-indicator-hierachy');
   var $rulerReadability = $('#ruler-readability');
   var $rulerIndicatorReadability = $('#ruler-indicator-readability');

   var $hierachyGroup = $('.hierachy');
   var $readabilityGroup = $('.readability');

   var $btnAddColor = $('#btn-add-color');
   var $btnDelColor = $('#btn-delete-color');

   var $concise = $('.concise');
   var $colorPickerPanel = $('#color-picker-panel');
   var $colorPicker = $('#color-picker');

   $textPreview.resizable();
   $concise.hide();
   var hasSelectFavColor = false;
   var hasSetColorPickerInsideUpdateView = false;

   var currentRatio;

   function updateView() {

     var foregroundColorHex = $inputForeground.val();
     var backgroundColorHex = $inputBackground.val();
     var foregroundGrayHex = rgb2gray(foregroundColorHex);
     var backgroundGrayHex = rgb2gray(backgroundColorHex);


     // check if both grayscale
     var isGray = foregroundColorHex.isGray() && backgroundColorHex.isGray();

     // update appearance
     var foregroundColorCSS = "#" + foregroundColorHex;
     var backgroundColorCSS = "#" + backgroundColorHex;
     var foregroundGrayCSS = "#" + foregroundGrayHex;
     var backgroundGrayCSS = "#" + backgroundGrayHex;

     // console.log("foreground color:" + foregroundColorCSS);
     // console.log("background color:" + backgroundColorCSS);
     // console.log("foreground gray:" + foregroundGrayCSS);
     // console.log("background gray:" + backgroundGrayCSS);

     $swatchColorForeground.css('background-color', foregroundColorCSS);
     $swatchColorBackground.css('background-color', backgroundColorCSS);

     $grayForeground.css('background-color', foregroundGrayCSS);
     $grayBackground.css('background-color', backgroundGrayCSS);

     $textPreview.css('color', foregroundColorCSS);
     $textPreview.css('background-color', backgroundColorCSS)

     // contrast ratio analysis
     var foregroundColorL = getL(foregroundColorHex);
     var backgroundColorL = getL(backgroundColorHex);
     var colorRatio = contrastRatio(foregroundColorL, backgroundColorL);

     // console.log("foregroundColorL" + foregroundColorL);
     // console.log("backgroundColorL" + backgroundColorL);

     var foregroundGrayL = getL(foregroundGrayHex);
     var backgroundGrayL = getL(backgroundGrayHex);
     var grayRatio = contrastRatio(foregroundGrayL, backgroundGrayL);

     $colorRatio.html(colorRatio.toFixed(1));
     $grayRatio.html(grayRatio.toFixed(1));
     var summary;
     var $rulerIndicator;
     var rulerIndicatorPosition = 0;
     var rulerIndicatorPositionPixel = 0;

     if (isGray) {
       $('#header-gray').hide();
       $readabilityGroup.hide();
       $hierachyGroup.show();
       summary = getHierachySummary(grayRatio);
       $rulerIndicator = $rulerIndicatorHierachy;
       rulerIndicatorPosition = getHierachyIndicatorPosition(grayRatio);
       rulerIndicatorPositionPixel = $rulerHierachy.width() * rulerIndicatorPosition - $rulerIndicator.width() / 2;
     } else {
       $('#header-gray').show();
       $readabilityGroup.show();
       $hierachyGroup.hide();
       summary = getReadabilitySummary(grayRatio);
       $rulerIndicator = $rulerIndicatorReadability;
       rulerIndicatorPosition = getReadabilityIndicatorPosition(grayRatio);
       rulerIndicatorPositionPixel = $rulerReadability.width() * rulerIndicatorPosition - $rulerIndicator.width() / 2;
     }

     

     $summaryText.html(summary['text']);
     $summaryText.css('color', summary['color']);
     $summaryRatio.css('color', summary['color']);


     currentRatio = grayRatio;

     // console.log("ruler " + $rulerReadability.width());
     // console.log("indicator " + rulerIndicatorPosition);
     // console.log("indicator " + rulerIndicatorPositionPixel);

     if (shouldIndicatorAnimate) {
      $rulerIndicator.animate({
        left: rulerIndicatorPositionPixel
      }, animateDuration, function() {
        // isColorPickerPanelOpened = true;
        // isColorPickerPanelExpanding = false;
      });
     } else {
      $rulerIndicator.css('left', rulerIndicatorPositionPixel)
     }

     // color picker
     if (isColorPickerPanelOpened && currentModifyColorInput && !hasSetColorPickerInsideUpdateView) {
       hasSetColorPickerInsideUpdateView = true;
       setupColorPicker();
     }  

     // RULER
     updateRulerValuePosition();
   }

   function setupColorPicker() {
     $('#color-picker').html("");
       $('#color-picker').ColorPickerSliders({
        color: getSliderColor(),
        flat: true,
        swatches: false,
        order: {
          rgb: 1,
          hsl: 2
        }, onchange: function(container, color) {
          if (currentModifyColorInput) {
            currentModifyColorInput.val(color.tiny.toHex());
            updateView();
          }
        }
      });
   }

   $('.hex-code-input').on('keyup', function(e) {
     var len = $(this).val().length;
     if (len == 6) {
        if (hasSelectFavColor) {
          hasSelectFavColor = false;
          $btnAddColor.show();
          $btnDelColor.hide();
        }

        hasSetColorPickerInsideUpdateView = false;
        updateView();
     }
   });


   var isColorPickerPanelOpened = false;
   var isColorPickerPanelExpanding = false;
   var colorPickerPanelHeight = $colorPickerPanel.height();
   var currentModifyColorInput = NaN;

   function getSliderColor() {
     if (!currentModifyColorInput) {
       return "rgb(255, 0, 0)";
     } else {
       return currentModifyColorInput.val();
     }
   };


   var animateOpen = "+=" + colorPickerPanelHeight;
   var animateClose = "-=" + colorPickerPanelHeight;
   var animateDuration = 700;

   function openColorPickerPanel() {
     if (!isColorPickerPanelExpanding && !isColorPickerPanelOpened) {
       isColorPickerPanelExpanding = true;
       $colorPickerPanel.animate({
         bottom: animateOpen
       }, animateDuration, function() {
         isColorPickerPanelOpened = true;
         isColorPickerPanelExpanding = false;
       });
     }
   };

   
   function closeColorPickerPanel() {
     if (!isColorPickerPanelExpanding && isColorPickerPanelOpened) {
       isColorPickerPanelExpanding = true;
       $colorPickerPanel.animate({
         bottom: animateClose
       }, animateDuration, function() {
         isColorPickerPanelOpened = false;
         isColorPickerPanelExpanding = false;
       });
     }
   };

    $('.circle').click(function() {
      console.log('hi');
      $('.circle').removeClass('circle-selected');
      $(this).addClass('circle-selected');
      currentModifyColorInput = $(this).parent().siblings('.input-wrapper').find('input');
      updateView();
      setupColorPicker();
      openColorPickerPanel();
   });

   

    $('body > [class!="action"]').click(function(event) {
      var $target = $(event.target);

      if (!$target.hasClass("action") && isColorPickerPanelOpened) {
          closeColorPickerPanel();
          $('.circle').removeClass('circle-selected');
      }
    });


   $('#toggle-tools-btn').click(function() {
      if (isToolsShown) {
        $tools.css('visibility', "hidden");
        $(this).html("Show Tools");
        $concise.show();
      } else {
        $tools.css('visibility', "visible");
        $(this).html("Hide Tools");
        $concise.hide();
      }
      
      isToolsShown = !isToolsShown;

   });

   $btnAddColor.show();
   $btnDelColor.hide();

   var favColorsLimit = 5;
   var currentSelectIdx = -1;
   var favColors = [];

   function toggleFavPanelBtn() {
    $btnAddColor.toggle();
    $btnDelColor.toggle();
   }

   function setColor(foreground, background) {
    $inputForeground.val("");
    $inputBackground.val("");
    $inputForeground.val(foreground);
    $inputBackground.val(background);
    updateView();
   }

   function addFavColor(foreground, background) {
     if (favColors.length < favColorsLimit) {
       favColors.push({'foreground': foreground, 'background': background});
       $('#fav-colors').append("<div class='color'>" + 
                                 "<div class='semicircle-upper'></div>" + 
                                 "<div class='semicircle-lower'></div></div>");
       $lastColor = $('#fav-colors>.color').last();
       $lastColor.find('.semicircle-upper').css('background-color', "#" + foreground);
       $lastColor.find('.semicircle-lower').css('background-color', "#" + background);

       $lastColor.hide().fadeIn(200);
     }
   }

   $btnAddColor.click(function() {
    var foregroundColor = $inputForeground.val();
    var backgroundColor = $inputBackground.val();

    console.log("Add " + foregroundColor + "/" + backgroundColor + " to fav.");
    addFavColor(foregroundColor, backgroundColor);
   });

   $btnDelColor.click(function() {
      $('#fav-colors>.color')[currentSelectIdx].remove();
      favColors.splice(currentSelectIdx, 1);
      setColor(defaultForeground, defaultBackground);
      $btnAddColor.show();
      $btnDelColor.hide();
      currentSelectIdx = -1;
      hasSelectFavColor = false;
   });

   $(document).on('click', "#fav-colors>.color", function() {
      console.log("Change to fav color");
      currentSelectIdx = $(this).index();
      setColor(favColors[currentSelectIdx]['foreground'], favColors[currentSelectIdx]['background']);
      hasSelectFavColor = true;
      $btnAddColor.hide();
      $btnDelColor.show();
   });

  var $rulerReadabilityComponents = $rulerReadability.find('.ruler-component');
  var $rulerHierachyComponents = $rulerHierachy.find('.ruler-component');

  function getAnchorPoints($components) {
    var anchorPoints = [];
    for (var i = 0; i < $components.length; ++i) {
      var left = $($components[i]).position().left;

      // include right position for the last component
      if (anchorPoints.push(left) == $components.length) {
        var right = left + $($components[i]).width();
        anchorPoints.push(right);
      }
    }

    return anchorPoints;
  }

  function setRulerValuePosition($ruler,anchorPoints) {
    $ruler.find('.ruler-sample-values > span').each(function(i) {
      var width = $(this).width();
      var left = anchorPoints[i] - $ruler.position().left - (2 * i + 1) * width / 2;
      $(this).css('left', left + "px");
    });
  }

  function updateRulerValuePosition() {

    if (isGray()) {
      // hierachy
      var hierachyAnchorPoints = getAnchorPoints($rulerHierachyComponents);
      setRulerValuePosition($rulerHierachy, hierachyAnchorPoints);

    } else {
      // readability
      var readabilityAnchorPoints = getAnchorPoints($rulerReadabilityComponents);
      setRulerValuePosition($rulerReadability, readabilityAnchorPoints);
    }
  }

  function updateColorIndicatorPosition() {

    var $rulerIndicator;
    var $ruler;

    if (isGray()) {
      $ruler = $rulerHierachy;
      $rulerIndicator = $rulerIndicatorHierachy;
    } else {
      $ruler = $rulerReadability;
      $rulerIndicator = $rulerIndicatorReadability;
    }

    var rulerIndicatorPosition = getReadabilityIndicatorPosition(currentRatio);
    var rulerIndicatorPositionPixel = $ruler.width() * rulerIndicatorPosition - $rulerIndicator.width() / 2;

    $rulerIndicator.css('left', rulerIndicatorPositionPixel);
  }

  function isGray() {
    return $inputForeground.val().isGray() && $inputBackground.val().isGray();
  }

  $(window).resize(function() {
    updateRulerValuePosition();
    updateColorIndicatorPosition();
  });

  updateView();
});
