var isToolsShown = true;
var defaultForeground = "FFFFFF";
var defaultBackground = "000000";

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
   var $rulerReadibility = $('#ruler-readiblity');

   var $hierachyGroup = $('.hierachy');
   var $readabilityGroup = $('.readability');

   var $btnAddColor = $('#btn-add-color');
   var $btnDelColor = $('#btn-delete-color');

   var $concise = $('.concise');

   $textPreview.autosize();
   $concise.hide();
   var hasSelectFavColor = false;

   function updateView() {
     console.log("[update appearance]");



     var foregroundColorHex = $inputForeground.val();
     var backgroundColorHex = $inputBackground.val();
     var foregroundGrayHex = rgb2gray(foregroundColorHex);
     var backgroundGrayHex = rgb2gray(backgroundColorHex);


     // check if both grayscale
     var isGray = foregroundColorHex.isGray() && backgroundColorHex.isGray();
     console.log(isGray);

     // update appearance
     var foregroundColorCSS = "#" + foregroundColorHex;
     var backgroundColorCSS = "#" + backgroundColorHex;
     var foregroundGrayCSS = "#" + foregroundGrayHex;
     var backgroundGrayCSS = "#" + backgroundGrayHex;

     console.log("foreground color:" + foregroundColorCSS);
     console.log("background color:" + backgroundColorCSS);
     console.log("foreground gray:" + foregroundGrayCSS);
     console.log("background gray:" + backgroundGrayCSS);

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

     console.log("foregroundColorL" + foregroundColorL);
     console.log("backgroundColorL" + backgroundColorL);

     var foregroundGrayL = getL(foregroundGrayHex);
     var backgroundGrayL = getL(backgroundGrayHex);
     var grayRatio = contrastRatio(foregroundGrayL, backgroundGrayL);

     $colorRatio.html(colorRatio.toFixed(1));
     $grayRatio.html(grayRatio.toFixed(1));
     var summary;
     

     if (isGray) {
       $('#header-gray').hide();
       $readabilityGroup.hide();
       $hierachyGroup.show();
       summary = getHierachySummary(grayRatio);
     } else {
       $('#header-gray').show();
       $readabilityGroup.show();
       $hierachyGroup.hide();
       summary = getReadabilitySummary(grayRatio);
     }


     $summaryText.html(summary['text']);
     $summaryText.css('color', summary['color']);
     $summaryRatio.css('color', summary['color']);
   }

   $('.hex-code-input').on('keyup', function(e) {
     var len = $(this).val().length;
     console.log(len);
     if (len == 6) {
        console.log("Change color to " + $(this).val());
        if (hasSelectFavColor) {
          hasSelectFavColor = false;
          $btnAddColor.show();
          $btnDelColor.hide();
        }
        updateView();
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

  updateView();
});
