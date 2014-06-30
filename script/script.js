var isToolsShown = true;

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

   $textPreview.autosize();


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
        updateView();
     }
   });


   $('#toggle-tools-btn').click(function() {
      if (isToolsShown) {
        $tools.css('visibility', "hidden");
        $(this).html("Show Tools");
      } else {
        $tools.css('visibility', "visible");
        $(this).html("Hide Tools");
      }
      
      isToolsShown = !isToolsShown;

   });

  updateView();
});
