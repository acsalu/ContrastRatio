
String.prototype.repeat = function(times) {
   return (new Array(times + 1)).join(this);
};


function rgb2gray(hexString) {

  var r = parseInt(hexString.substr(0, 2), 16);
  var g = parseInt(hexString.substr(2, 2), 16);
  var b = parseInt(hexString.substr(4, 2), 16);

  var gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);

  return gray.toString(16).repeat(3);
}

String.prototype.isGray = function() {

  console.log("Is gray? " + this);
  var r = this.substr(0, 2);
  var g = this.substr(2, 2);
  var b = this.substr(4, 2);

  console.log(r + " " + g + " " + b);

  return (r == g && g == b && b == r);
};


function getL(color) {
	if(color.length == 3) {
		var R = getsRGB(color.substring(0,1) + color.substring(0,1));
		var G = getsRGB(color.substring(1,2) + color.substring(1,2));
		var B = getsRGB(color.substring(2,3) + color.substring(2,3));
		update = true;
	}
	else if(color.length == 6) {
		var R = getsRGB(color.substring(0,2));
		var G = getsRGB(color.substring(2,4));
		var B = getsRGB(color.substring(4,6));
		update = true;
	}
	else {
		update = false;
	}
	if (update == true) {
		var L = (0.2126 * R + 0.7152 * G + 0.0722 * B);
		return L;
	}
	else {
		return false;
	}

}


function getsRGB(color) {
	color=getRGB(color);
	if(color!==false) {
		color = color/255;
		color = (color <= 0.03928) ? color/12.92 : Math.pow(((color + 0.055)/1.055), 2.4);
		return color;
	}
	else {
		return false;
	}
}

function getRGB(color) {
	try {
		var color = parseInt(color, 16);
	}
	catch (err) {
		var color = false;
	}
	return color;
}


function contrastRatio(L1, L2) {
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

var rulerColorGray = "#b0b0b0";
var rulerColorOrange = "#ffad00";
var rulerColorLime = "#9bcb00";
var rulerColorGreen = "#369800";


function getReadabilitySummary(ratio) {
  
  var summary = {};
  var text;
  var color;
  
  if (ratio < 0) {
    text = ""
    color = "#000000"
  } else if (ratio < 2.0) {
    text =  "Disable";
    color = rulerColorGray;
  } else if (ratio < 2.5) {
    text = "Low Readability";
    color = rulerColorOrange;
  } else {
    text = "High Readability";
    color = rulerColorGreen;
  }

  summary['text'] = text;
  summary['color'] = color;

  return summary;
}

function getHierachySummary(ratio) {

  var summary = {};
  var text;
  var color;

  if (ratio < 0) {
    text =  "";
    color = "#000000";
  } else if (ratio < 2.0) {
    text =  "Disable";
    color = rulerColorGray;
  } else if (ratio < 3.0) {
    text =  "Hierachy Level 1";
    color = rulerColorOrange;
  } else if (ratio < 7.0) {
    text =  "Hierachy Level 2";
    color = rulerColorLime;
  } else {
  	text =  "Hierachy Level 3";
  	color = rulerColorGreen;
  }

  summary['text'] = text;
  summary['color'] = color;

  return summary;
}

function getHierachyIndicatorPosition(ratio) {

  var leftPosition = 0;
  // 28, 13.5, 23.5, 35
  if (ratio < 2.0) {
    leftPosition = 0 + 28 * (ratio - 0.0) / 2.0;
  } else if (ratio < 3.0) {
    leftPosition = 28 + 13.5 * (ratio - 2.0) / 1.0;
  } else if (ratio < 7.0) {
    leftPosition = 41.5 + 23.5 * (ratio - 3.0) / 4.0;
  } else {
    leftPosition = 65 + 35 * (ratio - 7.0) / 14.0;
  }

  return leftPosition / 100;
}

function getReadabilityIndicatorPosition(ratio) {
  
  var leftPosition = 0;
  // 28, 7, 65
  if (ratio < 2.0) {
    leftPosition = 0 + 28 * (ratio - 0.0) / 2.0;
  } else if (ratio < 2.5) {
    leftPosition = 28 + 7 * (ratio - 2.0) / 0.5;
  } else {
    leftPosition = 35 + 65 * (ratio - 2.5) / 18.5;
  }

  return leftPosition / 100;

}
