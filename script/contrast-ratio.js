
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

function getReadabilityText(ratio) {
  if (ratio < 0) {
    return ""
  } else if (ratio < 2.0) {
    return "Disable";
  } else if (ratio < 2.5) {
    return "Low Readability";
  } else {
    return "High Readability";
  }
}
