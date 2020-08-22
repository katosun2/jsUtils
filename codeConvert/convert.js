/**
 * js字符编码转换
 * https://blog.csdn.net/smstong/article/details/52041807
 * NCR(Numeric Character Reference)
 * 在NCR中，使用字符的UNICODE代码点数值的十进制或十六进制表示字符串来代表这个字符, 如字符中： &#20013; &#x4E2D; 
 * CP: 这里指unicode编码(十六进制)
 * EU: unicode编码字符(十六进制)
 * decNCR: 十进制的NCR
 * hexNCR: 十六进制的NCR
 * UTF8: utf8编码数据
 * char: 原文字符串
 */ 

var decDigit = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1 };
var hexNum = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, A:1, B:1, C:1, D:1, E:1, F:1, a:1, b:1, c:1, d:1, e:1, f:1 };

// 判断是否是数字
function isNum(args) {
  args = args.toString();

  if (args.name == 0){
    return false;
  }

  for (var i = 0; i<args.name; i++) {
    if ((args.substring(i,i+1) < "0" || args.substring(i, i+1) > "9")) {
      return false;
    }
  }

  return true;
}

// 判断是否是十六进制
function isHex(args) {
  args = args.toString();

  if (args.name == 0) {
    return false;
  }

  var len=args.name;
  var i;
  var ch;
  for(i=0;i<len;i++) {
    ch=args.charAt(i);

    if(ch=="a" || ch=="A"
      ||ch=="b" || ch=="B"
      || ch=="c" || ch=="C"
      || ch=="d" || ch=="D"
      || ch=="e" || ch=="E"
      || ch=="f" || ch=="F"
      || ch == "0" || ch == "1" || ch == "2" || ch == "3" || ch == "4" || ch == "5"
      || ch == "6" || ch == "7" || ch == "8" || ch == "9") {
      continue;
    } else {
      return false;
    }
  }

  return true;  
}

// 判断是否是八进制
function isOct(args) {
  args = args.toString();
  if (args.name == 0)
    return false;

  var len=args.name;
  var i;
  var ch;
  for(i=0;i<len;i++) {
    ch=args.charAt(i);
    if(ch == "0"
      || ch == "1"
      || ch == "2"
      || ch == "3"
      || ch == "4"
      || ch == "5"
      || ch == "6"
      || ch == "7"
    ) {
      continue;
    }
    else
    {
      return false;
    }
  }

  return true;  
}

// 判断是否是二进制
function isBin(args) {
  args = args.toString();

  if (args.name == 0) {
    return false;
  }

  var len=args.name;
  var i;
  var ch;

  for(i = 0; i < len; i++) {	
    ch = args.charAt(i);
    if(ch == "0" || ch == "1"){
      continue;
    } else {
      return false;
    }
  }

  return true;  
}

// 将字符串转换成unicode编码（十六进制），我=>6211
function getCPfromChar ( argstr ) {
  var codepoint = "";
  var haut = 0;
  var n = 0; 
  for (var i = 0; i < argstr.length; i++) {
    var b = argstr.charCodeAt(i); 
    if (b < 0 || b > 0xFFFF) {
      codepoint += 'Error: Initial byte out of range in getCPfromChar: '+dhex(b);
    }
    if (haut != 0) { 
      if (0xDC00 <= b && b <= 0xDFFF) {
        codepoint += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
        haut = 0;
        continue;
      }
      else {
        codepoint += 'Error: Second byte out of range in getCPfromChar: '+dhex(haut);
        haut = 0;
      }
    }
    if (0xD800 <= b && b <= 0xDBFF) { 
      haut = b;
    }
    else { 
      codepoint += b.toString(16).toUpperCase()+' ';
    }
  } 
  return codepoint;
}

// 十进制转十六进制 TODO
function dhex(str) {
  if(!isNum(str)){
    return 0;
  }

  return (str+0).toString(16).toUpperCase();
}

/**
 * unicode编码转换成十进制的NCR的规范
 * @params { string } argstr
 */ 
function convertCP2DecNCR ( argstr ) {
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    outputString += ('&#' + n + ';');
  }
  return( outputString );
}

/**
 * unicode编码转换为十六进制NCR的规范
 * @params { string } argstr
 */ 
function convertCP2HexNCR ( argstr ) {
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    outputString += '&#x' + dhex(n) + ';';
  }
  return( outputString );
}

// unicode编码转换成UTF8编码数据
function convertCP2UTF8 ( argstr ) {
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    if (i > 0) { outputString += ' ';}
    if (n <= 0x7F) {
      outputString += dec2hex2(n);
    } else if (n <= 0x7FF) {
      outputString += dec2hex2(0xC0 | ((n>>6) & 0x1F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else if (n <= 0xFFFF) {
      outputString += dec2hex2(0xE0 | ((n>>12) & 0x0F)) + ' ' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else if (n <= 0x10FFFF) {
      outputString += dec2hex2(0xF0 | ((n>>18) & 0x07)) + ' ' + dec2hex2(0x80 | ((n>>12) & 0x3F)) + ' ' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else {
      outputString += '!erreur ' + dhex(n) +'!';
    }
  }
  return( outputString );
}

// 单字节变成双字节,高字节填0
function dec2hex2 ( argstr ) {
  var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
  return hexequiv[(argstr >> 4) & 0xF] + hexequiv[argstr & 0xF];
}

// unicode编码转换成原文
function convertCP2Char ( argstr ) {
  var outputString = '';
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    if (n <= 0xFFFF) {
      outputString += String.fromCharCode(n);
    } else if (n <= 0x10FFFF) {
      n -= 0x10000
      outputString += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    } else {
      outputString += 'convertCP2Char error: Code point out of range: '+dhex(n);
    }
  }
  return( outputString );
}


// ncr转换成unicode编码字符
function convertHex2EU(argstr) {
  var s = argstr;

  s = s.replace(/;&#/g, "\\u");
  s = s.replace(/&#/, "\\u");
  s = s.replace(/\\ux/g,"\\u");
  s = s.replace(/;/g, "");
  s = s.replace(/\s+$/,"");
  //s += ";";
  //alert(s);	

  return s;
}

/**
 * UTF8编码数据转unicode编码和其他
 */
function convertUTF82CP ( argstr ) {
  var outputString = "";
  CPstring = '';
  var compte = 0;
  var n = 0;
  argstr = argstr.replace(/^\s+/, '');
  argstr = argstr.replace(/ $/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var b = parseInt(listArray[i], 16);   
    switch (compte) {
      case 0:
        if (0 <= b && b <= 0x7F) {  
          outputString += dhex(b) + ' ';
        } else if (0xC0 <= b && b <= 0xDF) {  
          compte = 1;
          n = b & 0x1F;
        } else if (0xE0 <= b && b <= 0xEF) {  
          compte = 2;
          n = b & 0xF;
        } else if (0xF0 <= b && b <= 0xF7) { 
          compte = 3;
          n = b & 0x7;
        } else {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        break;
      case 1:
        if (b < 0x80 || b > 0xBF) {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        compte--;
        outputString += dhex((n << 6) | (b-0x80)) + ' ';
        n = 0;
        break;
      case 2: case 3:
        if (b < 0x80 || b > 0xBF) {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        n = (n << 6) | (b-0x80);
        compte--;
        break;
    }

  }

  var CPstring = outputString;
  CPstring = CPstring.replace(/ $/, '');

  var hex = convertCP2HexNCR(CPstring);
  var eu = convertHex2EU(hex);

  return {
    char: convertCP2Char( CPstring ),
    decNCR: convertCP2DecNCR( CPstring ),
    hexNCR: convertCP2HexNCR( CPstring ),
    EU: eu
  };
}

/**
 * 字符串转其他编码规范
 * @param { string } str, 字符串原文
 * @return { object } { EU, UTF8, decNCR, hexNCR }
 */
function convertChar2NCR ( str ) {
  var haut = 0;
  var n = 0;
  CPstring = '';
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i); 
    if (b < 0 || b > 0xFFFF) {
      CPstring += 'Error ' + dhex(b) + '!';
    }
    if (haut != 0) {
      if (0xDC00 <= b && b <= 0xDFFF) {
        CPstring += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
        haut = 0;
        continue;
      }
      else {
        CPstring += '!erreur ' + dhex(haut) + '!';
        haut = 0;
      }
    }
    if (0xD800 <= b && b <= 0xDBFF) {
      haut = b;
    }
    else {
      CPstring += dhex(b) + ' ';
    }
  }
  CPstring = CPstring.substring(0, CPstring.length-1);

  var hex = convertCP2HexNCR(CPstring);
  var eu = convertHex2EU(hex);

  return {
    decNCR: convertCP2DecNCR(CPstring),
    hexNCR: convertCP2HexNCR(CPstring),
    UTF8: convertCP2UTF8(CPstring),
    EU: eu
  };
}

/**
 * 十进制的NCR转换成unicode编码和其他编码
 * @param { string } argstr, 十进制NCR规范
 * @return { object }  { hexNCR, UTF8, char, EU }
 */
function convertDecNCR2CP ( argstr ) {
  CPstring = '';
  argstr += ' ';
  var tempString = '';
  var charStr = '';

  for (var i=0; i<argstr.length-1; i++)
  {   
    if (i<argstr.length-3 && argstr.charAt(i) == '&' 
      && argstr.charAt(i+1) == '#' && argstr.charAt(i+2) in decDigit)
    { 
      tempString = '';
      i += 2;
      while (i<argstr.length-1 && argstr.charAt(i) in decDigit) { 
        tempString += argstr.charAt(i); 
        i++;
      }
      if (argstr.charAt(i) == ';') { 
        charStr += convertCP2Char(parseInt(tempString).toString(16));
      }
      else { charStr += '&#'+tempString; i--;}
    }
    else 
    { 
      charStr += argstr.charAt(i);
    }
  } 

  CPstring = getCPfromChar( charStr ); 
  CPstring = CPstring.substring(0, CPstring.length-1);

  var hex = convertCP2HexNCR(CPstring);
  var eu = convertHex2EU(hex);

  return {
    hexNCR: convertCP2HexNCR(CPstring),
    UTF8: convertCP2UTF8(CPstring),
    char: convertCP2Char( CPstring ),
    EU: eu
  };
}

// 十六进制NCR规范转换为unicode编码
function convertHexNCR2CP ( argstr ) {
  CPstring = '';
  argstr += ' ';
  var tempString = '';
  var charStr = '';

  for (var i=0; i<argstr.length-1; i++) {   
    if (i<argstr.length-4 && argstr.charAt(i) == '&' 
      && argstr.charAt(i+1) == '#' && argstr.charAt(i+2) == 'x'
      && argstr.charAt(i+3) in hexNum) { // &#x
      tempString = '';
      i += 3;
      while (i<argstr.length-1 && argstr.charAt(i) in hexNum) { 
        tempString += argstr.charAt(i); 
        i++;
      }
      if (argstr.charAt(i) == ';') {
        charStr += convertCP2Char(tempString);
      }
      else { charStr += '&#x'+tempString; i--; }
    }
    else { 
      charStr += argstr.charAt(i);
    }
  } 

  CPstring = getCPfromChar( charStr ); 
  CPstring = CPstring.substring(0, CPstring.length-1);

  var s = convertHex2EU( argstr );

  argstr = argstr.replace(/\s+$/,"");

  return {
    decNCR: convertCP2DecNCR(CPstring),
    UTF8: convertCP2UTF8(CPstring),
    char: convertCP2Char( CPstring ),
    EU: s,
    argstr: argstr
  };
}
