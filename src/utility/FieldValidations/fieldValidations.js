export const FieldValidations = (e, option, textBoxElem, charCount) => {
  try {
    var evtObj = e;

    var restrictedChars = 0;
    if (textBoxElem != undefined) {
      var textBoxId = textBoxElem.id;
      //modifed on 14/10/2015,bug_id:57246
      //if(textBoxId.indexOf("pkComboName")!=-1 && (option!=undefined && option=='10'))//case is handled for the special character validation on task for string type
      if (
        textBoxId != undefined &&
        textBoxId.indexOf("pkComboName") != -1 &&
        option != undefined &&
        option == "10"
      )
        //till here bug_id:57246
        //modifed on 11/6/2016,bug_id:62614
        //option='161';
        option = "167"; //till here bug_id:62614
    }
    if (option != undefined) restrictedChars = parseInt(option);

    var browser = navigator.appName;
    var KeyID = "";
    if (browser == "Netscape") {
      // mozilla browser
      KeyID = evtObj.which;
      if (KeyID == 0)
        // for tab changed by  sharma Bug ID : 41427
        return true;
      //added on 17/2/2020,bug_id:90169
      if (KeyID == 116) evtObj.cancelBubble = true; //till here bug_id:90169
    } else {
      KeyID = evtObj.keyCode;
    }

    var returnValue = false;

    //   added for Bug 45526
    switch (restrictedChars) {
      case 1: //alphabets, numerals and underscore
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              ((KeyID >= 48 && KeyID < 58) || KeyID == 47)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //added,05/06/2012,BugId:OF_32147
      case 2: //alphabets, numerals and underscore, can stsrt with int value also
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        } //till here
        break; //tillHere,BugId:OF_32147
      case 3: //int
        if (
          ((KeyID == 45 || (KeyID >= 48 && KeyID < 58)) &&
            textBoxElem.value.length + 1 < charCount) ||
          KeyID == 8 ||
          KeyID == 16 ||
          KeyID == 46 || //Bug 32271 -12Dec2012
          KeyID == 37 ||
          KeyID == 39 ||
          KeyID == 36 ||
          (evtObj.ctrlKey == true &&
            (KeyID == 118 || KeyID == 86 || KeyID == 120 || KeyID == 88))
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
          if (textBoxElem != undefined) {
            if (textBoxElem.value.length + 1 != 0 && KeyID == 45)
              //minus allowed at beginning only
              returnValue = false;
          }
        }
        break;
      case 4: //long
        if (
          (KeyID == 45 || (KeyID >= 48 && KeyID < 58)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
          if (textBoxElem != undefined) {
            if (textBoxElem.value.length + 1 != 0 && KeyID == 45)
              //minus allowed at beginning only
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 6: //float
        if (
          (KeyID == 45 || KeyID == 46 || (KeyID >= 48 && KeyID < 58)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
          if (textBoxElem != undefined) {
            if (textBoxElem.value.length + 1 != 0 && KeyID == 45)
              //minus allowed at beginning only
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      // case 8: //date//Bug 32271 -12Dec2012
      //   {
      //     openCalenderThis(
      //       textBoxElem,
      //       "1",
      //       textBoxElem.id,
      //       "textBox",
      //       "absolute2"
      //     );
      //     returnValue = false;
      //   }
      //   break;
      case 10: //string
        //added on 16/9/2015,bug_id:56778
        if (KeyID == 60 || KeyID == 62) returnValue = false;
        //till here bug_id:56778
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        else returnValue = true;
        break;
      case 12: //boolean
        returnValue = true;
        break;
      case 13: //numerals,'.' for IP Address
        if (KeyID == 46 || (KeyID >= 48 && KeyID < 58)) {
          returnValue = true;
        }
        break;
      case 101: //alphabets,numerals,underscore,'@','.' ,'-'for emailId
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 45 ||
          KeyID == 46 ||
          KeyID == 64
        ) {
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              (KeyID == 46 || KeyID == 64)
            )
              returnValue = false;
            if (
              textBoxElem.value.length + 1 > 0 &&
              textBoxElem.value.indexOf("@") != -1 &&
              KeyID == 64
            )
              returnValue = false;
          }
        }
        break;
      //added on 16/02/2012 for BUG ID 29815
      case 102: //alphabets,numerals,underscore,and space
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 32
        )
          //32 for space
          returnValue = true;
        break;
      //till here
      //added on 16/02/2012 for BUG ID 30507
      case 103: //all except " and '
        if (KeyID != 39 && KeyID != 34) returnValue = true;
        break;
      //till here
      //added on 01/03/2012 for BUG ID 30499
      case 104: //alphabets,numerals,underscore(_),and hiphen wwith first character as alphabet
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 45
        ) {
          //45 for hiphen(-)
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //till here
      //added,BugID:OF_31120,30/04/2012
      case 105: //For Time... numerals,colon(:58)
        if (
          KeyID >= 48 &&
          KeyID <= 58 &&
          textBoxElem.value.length + 1 < charCount
        )
          //BUG 32159:: 23/05/2012
          returnValue = true;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //tillHere,BugID:OF_31120
      //BUG 32159 :: 23/05/2012 starts
      case 110: //alphabets, numerals,hiphen and underscore with fist character as alphabet only and length restricted to N
        //modifed on 1/7/2015,bug_id:54283
        // if((KeyID == 95 || (KeyID >=48 && KeyID <58) || (KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123) || KeyID==45 || KeyID==8)&&( textBoxElem.value.length+1<charCount))
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 8 ||
            (KeyID == 32 && textBoxElem.id == "docTypeName")) &&
          textBoxElem.value.length + 1 < charCount
        )
          //till here bug_id:54283
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 47 ||
            KeyID == 95 ||
            KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }
        break;
      case 111: //for description area of length restricted
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 46 ||
            KeyID == 64 ||
            KeyID == 32 ||
            KeyID == 45 ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }

        break;
      case 112: //alphabets,numerals,hiphen,underscore,and space with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          //KeyID==32 has been removed for restricting space Bug 50531
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 32 ||
            KeyID == 95 ||
            KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          //modified for Bug 45052 46 is for dot
          //                    if(KeyID == 46 || KeyID == 0) // delete key
          //                     //modified for Bug 51551
          //                         if(KeyID == 0)
          if (KeyID == 0 || KeyID == 8) returnValue = true;
        }
        break;
      case 113: //alphabets,numerals,underscore,and with fist character as alphabet only and length restricted to N
      case 171: //added on 8/2/2018,bug_id:75887
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
        )
          returnValue = false;

        if (browser == "Netscape") {
          // mozilla browser
          //modifed on 12/8/2015,bug_id:56198
          //if(KeyID == 46 || KeyID == 0) // delete key
          if (KeyID == 0)
            //till here bug_id:56198
            returnValue = true;
        }
        break;
      case 114: //for description area with <,>,& allowed and length restricted
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 46 ||
            KeyID == 64 ||
            KeyID == 32 ||
            KeyID == 45 ||
            KeyID == 38 ||
            KeyID == 60 ||
            KeyID == 62 ||
            KeyID == 10) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        //BUG ID 53931 :: 20/02/2015 starts
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        //BUG ID 53931 :: 20/02/2015 ends
        break;
      case 115: //alphabets,numerals,underscore,hiphen,decimal and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 46) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 95 ||
            KeyID == 45 ||
            KeyID == 46)
        )
          returnValue = false;
        break;
      case 116: //alphabets,numerals,underscore,hiphen,decimal,colon,/,\ and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 46 ||
            KeyID == 47 ||
            KeyID == 58 ||
            KeyID == 92) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 95 ||
            KeyID == 45 ||
            KeyID == 46 ||
            KeyID == 47 ||
            KeyID == 58 ||
            KeyID == 92)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 117: //alphabets,numerals,underscore,hiphen,decimal,colon,/,\,?,@ and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 46 ||
            KeyID == 47 ||
            KeyID == 58 ||
            KeyID == 92 ||
            KeyID == 64 ||
            KeyID == 63) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 95 ||
            KeyID == 45 ||
            KeyID == 46 ||
            KeyID == 47 ||
            KeyID == 58 ||
            KeyID == 92 ||
            KeyID == 64 ||
            KeyID == 63)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 118: //alphabets, numerals,hiphen and space with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 32 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 47 ||
            KeyID == 32 ||
            KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 119: //alphabets, numerals,underscore,comma with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 44 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 95) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 44)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //BUG 32159 :: 23/05/2012 ends
      //BUG OF_32305::31/05/2012 starts
      case 120: //for description area of length restricted and chars ' and " and & restricted only'
        if (
          KeyID == 39 ||
          KeyID == 34 ||
          KeyID == 38 ||
          textBoxElem.value.length + 1 >= charCount
        )
          //BUG OF_32262 :: 01/06/2012
          returnValue = false;
        else returnValue = true;
        break;
      //BUG OF_32305::31/05/2012 ends
      //BUG OF_32480::12/06/2012 starts
      case 122: //for description area of length restricted and chars ',",enter and & restricted only'
        if (
          KeyID == 39 ||
          KeyID == 34 ||
          KeyID == 38 ||
          KeyID == 13 ||
          textBoxElem.value.length + 1 >= charCount
        )
          //BUG OF_32262 :: 01/06/2012
          returnValue = false;
        else returnValue = true;
        break;
      //BUG OF_32480::12/06/2012 ends
      //BUG 32159 :: 18/06/2012 starts
      case 123: // ip
        if (
          ((KeyID >= 48 && KeyID < 58) || KeyID == 46) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (textBoxElem.value.length + 1 == 0 && KeyID == 46)
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 124: //alphabets, numerals,hiphen,& and underscore with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 38 ||
            KeyID == 45) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 47 ||
            KeyID == 95 ||
            KeyID == 38 ||
            KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 125: //For options..same as 131
        if (
          KeyID >= 48 &&
          KeyID < 58 &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 128: //all
        if (textBoxElem.value.length  < charCount) returnValue = true;
        else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 130: //numerals and decimal and length restricted to N
        if (
          ((KeyID >= 48 && KeyID < 58) || KeyID == 46 || KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }
        break;
      case 131: //numerals and length restricted to N
        if (
          KeyID >= 48 &&
          KeyID < 58 &&
          textBoxElem.value.length < charCount
        )
          returnValue = true;
        else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //BUG 32159 :: 18/06/2012 ends
      //BUG OF_33183 :: 12/07/2012 starts
      case 132: //allowed characters are:: `,~,!,@,#,$,%,^,(,),_,+,-,=,{,},|,[,],;,',,,., numerals, alphabets, space, backspace
        if (
          ((KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 32 ||
            KeyID == 95 ||
            KeyID == 45 ||
            KeyID == 46 ||
            KeyID == 32 ||
            KeyID == 44 ||
            KeyID == 59 ||
            KeyID == 64 ||
            KeyID == 96 ||
            KeyID == 126 ||
            KeyID == 33 ||
            KeyID == 35 ||
            KeyID == 36 ||
            KeyID == 37 ||
            KeyID == 94 ||
            KeyID == 40 ||
            KeyID == 41 ||
            KeyID == 43 ||
            KeyID == 61 ||
            KeyID == 91 ||
            KeyID == 93 ||
            KeyID == 123 ||
            KeyID == 125 ||
            KeyID == 39 ||
            KeyID == 124) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //BUG OF_33183 :: 12/07/2012 ends
      //BUG OF_33412 :: 23/07/2012 starts
      case 133: //allowed characters are:: `~(){}[] _-=,.'  numerals, alphabets, space, backspace
        if (
          ((KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 32 ||
            KeyID == 96 ||
            KeyID == 126 ||
            KeyID == 40 ||
            KeyID == 41 ||
            KeyID == 123 ||
            KeyID == 125 ||
            KeyID == 91 ||
            KeyID == 93 ||
            KeyID == 95 ||
            KeyID == 45 ||
            KeyID == 61 ||
            KeyID == 44 ||
            KeyID == 46 ||
            KeyID == 39) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        break;
      //BUG OF_33412 :: 23/07/2012 ends
      //BUG OF_33359 :: 25/07/2012 ends
      //            case 134://all allowed except Enter and charCount Not to be checked -- message
      //                if(KeyID!=13)
      //                    returnValue = true;
      //                else
      //                    returnValue = false;
      //                break;
      //            case 135://all allowed except Enter, quotes(', "), | character -- subject
      //                if(KeyID!=13  && KeyID!=34  && KeyID!=39  && KeyID!=124  && ( textBoxElem.value.length+1<charCount))
      //                    returnValue = true;
      //                else
      //                    returnValue = false;
      //                break;
      //added,13/08/2012,BugId:33978
      case 136: //all allowed except Enter, and SPACE -- SAP FunctionName
        if (
          KeyID != 13 &&
          KeyID != 32 &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        else returnValue = false;
        break; //tillHere,BugId:33978
      //added,06/11/2012,BugId:36270
      case 137: //alphabets, numerals and underscore
        if (
          (KeyID == 95 ||
            KeyID == 42 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
        } else {
          returnValue = false;
        }
        break; //tillHere,BugId:36270
      //start for bug id 35573
      case 138: //for expressions, allowed characters are <, >, !, +,-,/,*,=,(,),comma,.,;alphabets, numerals
        //start for bug id 37372: (KeyID>96 && KeyID < 112) changed to (KeyID>96 && KeyID < 123)
        if (
          KeyID == 8 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          (KeyID > 185 && KeyID < 191) ||
          KeyID == 40 ||
          KeyID == 41 ||
          KeyID == 33 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 46 ||
          KeyID == 58
        ) {
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      //end for bug id 35573
      //BUG OF_33359 :: 25/07/2012 ends
      //added,12/12/2012,BugId:36687
      case 139: //alphabets,numerals (1-9),underscore,and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID > 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
        )
          returnValue = false;

        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }

        break; //TillHere,BugId:36687
      // only window characters to be restricted  - start
      case 140:
        // characters restricted are \/:*?"<>|
        if (
          KeyID == 92 ||
          KeyID == 47 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124
        )
          returnValue = false;
        else returnValue = true;
        break;
      // only window characters to be restricted - emd
      // Bug Id : 43544  Sharma
      case 141: //alphabets,numerals (0-9),underscore,and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
        )
          returnValue = false;

        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }

        break; //TillHere,BugId:36687
      case 142: //case added for bug 46149
        // characters restricted are ?<>   (For mail subject and msg)
        // modified for Bug 52936
        //                if(KeyID == 92 || KeyID == 47 || KeyID == 58 || KeyID == 42 || KeyID == 63 || KeyID == 60 || KeyID == 62)
        //                modified for Bug 57015
        //  if(KeyID == 63 || KeyID == 60 || KeyID == 62)
        //modified for Bug 58335
        /*if(KeyID == 63)
                    returnValue = false;
                else*/
        //returnValue = true;
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        else{
          returnValue=true;
        }
        break;
      case 143: //112 with space
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 8 ||
            KeyID == 32) &&
          textBoxElem.value.length + 1 < charCount
        )
          //KeyID==32 has been removed for restricting space Bug 50531
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 0 || KeyID == 8) returnValue = true;
        }
        break;
      case 144: //141 with space
        if (
          (KeyID == 95 ||
            KeyID == 32 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
        )
          returnValue = false;

        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }

        break; //TillHere,BugId:36687
      case 145: //104 with space
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 45 ||
          KeyID == 32
        ) {
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 146: // space,minus,underscore ,numeral and alphabet with first letter is alphabet(form & fragment name)
        //modifed on 14/8/2015,bug_id:56193
        //if((KeyID == 95 || (KeyID >=48 && KeyID <58) || (KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123) || KeyID==8 || KeyID==32) &&( textBoxElem.value.length+1<charCount))
        //modifed on 4/2/2016,bug_id:58931
        //if((KeyID == 95 || (KeyID >=48 && KeyID <58) || (KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123) || KeyID==8 || KeyID==32 || KeyID==45) &&( textBoxElem.value.length+1<charCount))//till here bug_id:56193
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8 ||
            KeyID == 45) &&
          textBoxElem.value.length + 1 < charCount
        )
          //till here bug_id:58931
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 95 ||
            KeyID == 46 ||
            KeyID == 45)
        )
          returnValue = false;

        if (browser == "Netscape") {
          // mozilla browser
          //modifed on 14/8/2015,bug_id:56193
          // if(KeyID == 46 || KeyID == 0) // delete key
          if (KeyID == 0)
            // delete key//till here bug_id:56193
            returnValue = true;
        }
        break;
      case 147: //110 with space
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 45 ||
            KeyID == 8 ||
            KeyID == 32) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) ||
            KeyID == 47 ||
            KeyID == 95 ||
            KeyID == 45)
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0)
            // delete key
            returnValue = true;
        }
        break;
      case 148: //alphabets,numerals,underscore(_),#,and hiphen wwith first character as alphabet
        if (
          KeyID == 95 ||
          KeyID == 35 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 45
        ) {
          //45 for hiphen(-)
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //added on 6/7/2015,bug_id:55742
      case 150: //first char as albabet only and all chars are allowed except \ / : * ? " < > | ' &
      case 180: //added on 12/3/2021,bug_id:98455
        //BUG ID 63047 :: 25/07/2016 starts
        //if((KeyID == 47 || KeyID == 92 ||KeyID == 58 ||KeyID == 42 ||KeyID == 63 ||KeyID == 34 || KeyID == 60 ||KeyID == 62 ||KeyID == 124 || KeyID == 38 || KeyID == 39) || ( textBoxElem.value.length+1>charCount)){
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          textBoxElem.value.length  >= charCount 
        ) {
          //BUG ID 63047 :: 25/07/2016 ends
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      case 151: //table creation   //alphabets numerics  _ are allowed
        //modifed on 13/8/2015,bug_id:56226
        //if(KeyID == 95 || (KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123) || (KeyID >=48 && KeyID <58) || KeyID == 35)
        //BUG ID 65788 :: 23/11/2016 starts
        //if(KeyID == 95 || (KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123) || (KeyID >=48 && KeyID <58)) //till here bug_id:56226
        if (
          (KeyID == 95 ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            (KeyID >= 48 && KeyID < 58)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG ID 65788 :: 23/11/2016 ends
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              (KeyID == 35 || (KeyID >= 48 && KeyID < 58))
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;

      case 152: //alphabets,numerals,underscore(_),and dollor with first character will not be numeral(for class and functions name as of java )
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 36
        ) {
          //45 for hiphen(-)
          returnValue = true;
          if (textBoxElem != undefined) {
            if (textBoxElem.value.length + 1 == 0 && KeyID >= 48 && KeyID < 58)
              //lenght = 1
              returnValue = false;
          }
        }
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 153: //in username (numeral and alphabets allowed)
        if (
          KeyID == 95 ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          (KeyID >= 48 && KeyID < 58)
        ) {
          returnValue = true;
        }
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      case 154: //Case 150 + '@','#' restricted
        //alert("hello");
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 64 ||
          KeyID == 35 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      case 155: //Case 150 + '<','<','&'
        //alert("hello");
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 124 ||
          KeyID == 39 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      //till here bug_id:55742
      //added on 21/07/2015 for BUG ID 55742
      case 156: //first char as albabet only and all chars are allowed except \ / : * ? " < > | ' & . (case for queue vars where . is also ti=o be restricted)
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 46 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      case 157: ////Case 150 + '`','#' restricted
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 35 ||
          KeyID == 96 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      case 158: //character not allowed by window is restricted with no restriction on length
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          textBoxElem.value.length + 1 > charCount - 1
        ) {
          //BUG ID 65575, length reduced by 1
          returnValue = false;
          break;
        } else returnValue = true;

        break;
      case 159: //table search # _ * along with digits and alphabets are allowed
        if (
          KeyID == 95 ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          (KeyID >= 48 && KeyID < 58) ||
          KeyID == 35 ||
          KeyID == 42
        ) {
          returnValue = true;
        } else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;

      case 160: //150+      # + restricted
        //modifed on 17/8/2015,bug_id:56199,56243
        //if((KeyID == 47 || KeyID == 92 ||KeyID == 58 ||KeyID == 42 ||KeyID == 63 ||KeyID == 34 || KeyID == 60 ||KeyID == 62 ||KeyID == 124 || KeyID == 38 || KeyID == 39 || KeyID == 35) || ( textBoxElem.value.length+1>charCount)){
        //modified on 15/3/2016,bug_id: 59553
        //if((KeyID == 47 || KeyID == 92 ||KeyID == 58 ||KeyID == 42 ||KeyID == 63 ||KeyID == 34 || KeyID == 60 ||KeyID == 62 ||KeyID == 124 || KeyID == 38 || KeyID == 39 || KeyID == 35 || KeyID == 43 || KeyID == 32) || ( textBoxElem.value.length+1>charCount)){        //till here bug_id:56199,56243
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 35 ||
          KeyID == 43 ||
          KeyID == 32 ||
          textBoxElem.value.length + 1 > charCount - 1
        ) {
          //till here bug_id: 59553
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      case 161: //150 no restriction on first character
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 35 ||
          KeyID == 43 ||
          KeyID == 32 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      //added on 26/8/2015,bug_id:56411
      case 162: //done to provide restriction on renaming of project first char as albabet only and all chars are allowed except \ / : * ? " < > | ' &
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          //modified on 12/10/2020,bug_id:95224
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break; //till here bug_id:56411

      //till here BUG ID 55742
      //added on 6/7/2015,bug_id:56819
      case 163: //first char as albabet only and all chars are allowed except \ / : * ? " < > | ' & ( )
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8) {
            // allow backspace key    added on 18/01/2018 bugid-73328
            returnValue = true;
            break;
          }
        }
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 40 ||
          KeyID == 41 ||
          textBoxElem.value.length + 1 >= charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
        )
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      //till here ,bug_id:56819
      //code change for the point no 19 in the list
      case 164: //alphabets,numerals,underscore,space and with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8 ||
            KeyID == 32) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
        )
          returnValue = false;

        if (browser == "Netscape") {
          if (KeyID == 0) returnValue = true;
        }
        break; //till here point no 19 in the list
      //added on 25/2/2016,bug_id:59181
      case 165: //alphabets,numerals,underscore(_),and dollor and Dot with first character will not be numeral(for class and functions name as of java )
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 36 ||
          KeyID == 46
        ) {
          //46 for Dot(.)
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              ((KeyID >= 48 && KeyID < 58) || KeyID == 46)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if(textBoxElem.value.length + 1 > charCount)
        {
          returnValue=false;
          break;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        } //till here bug_id:59181
        break;
      //added on 1/3/2016,bug_id:59347
      case 166: //character not allowed by window except * is restricted with no restriction on length
        //modifed on 2/3/2016,bug_id:59348
        //if((KeyID == 47 || KeyID == 92 ||KeyID == 58  ||KeyID == 63 ||KeyID == 34 || KeyID == 60 ||KeyID == 62 ||KeyID == 124 || KeyID == 38 || KeyID == 39) || ( textBoxElem.value.length+1>charCount)){
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 40 ||
          KeyID == 41 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          //till here bug_id:59348
          returnValue = false;
          break;
        } else returnValue = true;

        break; //till here bug_id:59347
      //added on 11/6/2016,bug_id:62614
      case 167: //150 no restriction on first character
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 35 ||
          KeyID == 43 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      //till here bug_id:62614
      //BUG ID 65591 :: 16/11/2016 starts
      case 168:
        // characters restricted are \/:*?"<>| with charcount check
        if (
          KeyID == 92 ||
          KeyID == 47 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          textBoxElem.value.length + 1 >= charCount - 1
        )
          returnValue = false;
        else returnValue = true;
        break;
      //BUG ID 65591 :: 16/11/2016 ends
      //added on 3/3/2017bug_id:67712
      case 169: //processname validation (only _ and space is allowed with first character as alphabet)
        if (
          (KeyID == 95 ||
            KeyID == 32 ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            (KeyID >= 48 && KeyID < 58)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
            )
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break; //till here bug_id:67712
      case 250:
        if (textBoxElem.value.length + 1 < charCount) {
          //added by suparbhat thakkar for bug id:71800 on 20/9/2017
          returnValue = true;
        } else {
          returnValue = false;
        }
        break;
      case 170: //alphabets,numerals,underscore(_),and @ . space are allowed
        if (
          (KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 64 ||
            KeyID == 46 ||
            KeyID == 32) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          returnValue = true;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //added on 9/2/2018,bug_id:72867
      case 172:
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          KeyID == 38 ||
          KeyID == 39 ||
          KeyID == 35 ||
          KeyID == 43 ||
          textBoxElem.value.length + 1 > charCount
        ) {
          returnValue = false;
          break;
        } else {
          returnValue = true;
          if (textBoxElem != undefined) {
            if (textBoxElem.value.length + 1 == 0 && KeyID == 32)
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;
      //till here bug_id:72867
      //added on 16/8/2018,bug_id:79756
      case 173: //in SAP username (numeral and alphabets allowed)
        if (
          KeyID == 95 ||
          KeyID == 45 ||
          KeyID == 38 ||
          KeyID == 43 ||
          KeyID == 46 ||
          KeyID == 35 ||
          KeyID == 61 ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          (KeyID >= 48 && KeyID < 58)
        ) {
          returnValue = true;
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //added on 21/11/2018,bug_id:81461
      case 175: //alphabets, numerals,hiphen and underscore with fist character as alphabet only and length restricted to N
        if (
          (KeyID == 45 ||
            KeyID == 95 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            KeyID == 8) &&
          textBoxElem.value.length + 1 < charCount
        )
          returnValue = true;
        if (
          textBoxElem.value.length + 1 == 0 &&
          ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
        )
          returnValue = false;

        if (browser == "Netscape") {
          if (KeyID == 0) returnValue = true;
        }
        break;
      //added on 21/11/2018,bug_id:81461
      case 176:
        if (
          (KeyID >= 48 && KeyID <= 57) ||
          (KeyID >= 65 && KeyID <= 90) ||
          (KeyID >= 97 && KeyID <= 122) ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 95 ||
          KeyID == 38 ||
          textBoxElem.value.length + 1 > charCount - 1
        ) {
          //BUG ID 65575, length reduced by 1
          returnValue = true;
          break;
        } else returnValue = false;

        break;
      //added by deepak munagala for bug id 84858
      case 177: //first char as alphabet only and all chars are allowed except \ / : * ? " < > | # ,
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8) {
            returnValue = true;
            break;
          }
        }
        if (
          KeyID == 47 ||
          KeyID == 92 ||
          KeyID == 58 ||
          KeyID == 42 ||
          KeyID == 44 ||
          KeyID == 63 ||
          KeyID == 34 ||
          KeyID == 35 ||
          KeyID == 60 ||
          KeyID == 62 ||
          KeyID == 124 ||
          textBoxElem.value.length + 1 >= charCount
        ) {
          returnValue = false;
          break;
        } else returnValue = true;
        //modified on 26/8/2019,bug_id:86178
        //if( textBoxElem.value.length+1==0 && !((KeyID>64 && KeyID < 91) || (KeyID>96 && KeyID < 123)))
        if (
          textBoxElem.value.length + 1 == 0 &&
          !(
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123) ||
            (KeyID >= 48 && KeyID <= 57)
          )
        )
          //till here bug_id:86178
          returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 46 || KeyID == 0) {
            // delete key
            returnValue = true;
          }
        }
        break;

      //added by Diksha on 09.09.2020 for Bug Id 94406
      case 178: //Document search  _ - ' space * along with digits and alphabets are allowed
        if (
          KeyID == 95 ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          (KeyID >= 48 && KeyID < 58) ||
          KeyID == 32 ||
          KeyID == 39 ||
          KeyID == 42 ||
          KeyID == 45
        ) {
          returnValue = true;
        } else returnValue = false;
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //till here Bug Id 94406
      //added on 19.10.2020 by Diksha for Bug ID 95434
      case 179: //alphabets, numerals, hyphen and dot, cannot start with hyphen (Case for Domain Name)
        if (
          (KeyID == 45 ||
            KeyID == 46 ||
            (KeyID >= 48 && KeyID < 58) ||
            (KeyID > 64 && KeyID < 91) ||
            (KeyID > 96 && KeyID < 123)) &&
          textBoxElem.value.length + 1 < charCount
        ) {
          //BUG 32159:: 23/05/2012
          returnValue = true;
          if (textBoxElem != undefined) {
            if (
              textBoxElem.value.length + 1 == 0 &&
              (KeyID == 45 || KeyID == 46)
            )
              //lenght = 1
              returnValue = false;
          }
        }
        if (browser == "Netscape") {
          // mozilla browser
          if (KeyID == 8 || KeyID == 0)
            // delete key and backspace
            returnValue = true;
        }
        break;
      //till here Bug Id 95434
      //till here bug id 84858
      default: //alphabets,numerals,space and decimal
        if (
          KeyID == 95 ||
          (KeyID >= 48 && KeyID < 58) ||
          (KeyID > 64 && KeyID < 91) ||
          (KeyID > 96 && KeyID < 123) ||
          KeyID == 32 ||
          KeyID == 46
        )
          //32 for space and 46 for decimal(full stop)
          returnValue = true;
        break;
        //till here bug_id:79756
        if (!returnValue) {
          //e.stopPropogation(true);
          if (e.stopPropogation) e.stopPropogation(true);
          if (e.preventDefault) e.preventDefault(true);
          e.cancelBubble = true;
        }
      // Bug Id : 43544  Sharma
    }
    console.log("vvvvvvvvvvvv1", returnValue);

    //   else {
    //     switch (restrictedChars) {
    //       case 3: //int
    //         if (
    //           (KeyID == 45 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;

    //         break;
    //       case 4: //long
    //         if (
    //           (KeyID == 45 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         ) {
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         } else returnValue = false;
    //         break;
    //       case 6: //float
    //         if (
    //           (KeyID == 45 ||
    //             KeyID == 46 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         ) {
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         } else returnValue = false;
    //         break;
    //       case 8: //date
    //         {
    //           openCalenderThis(
    //             textBoxElem,
    //             "1",
    //             textBoxElem.id,
    //             "textBox",
    //             "absolute2"
    //           );
    //           returnValue = false;
    //         }
    //         break;
    //       case 10: //string //case added for Bug 46390
    //         returnValue = true;
    //         break;
    //       case 12: //boolean  //case added for Bug 46390
    //         returnValue = true;
    //         break;
    //       case 13: //numerals,'.' for IP Address
    //         if (
    //           KeyID == 46 ||
    //           (KeyID >= 48 && KeyID < 58) ||
    //           (KeyID >= 1632 && KeyID <= 1641)
    //         ) {
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         } else returnValue = false;
    //         break;
    //       case 105: //For Time... numerals,colon(:58)
    //         if (
    //           ((KeyID >= 48 && KeyID <= 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;
    //         break;
    //       case 117: //for URL
    //         returnValue = true;
    //         break;
    //       case 123: // ip
    //         if (
    //           ((KeyID >= 48 && KeyID < 58) ||
    //             KeyID == 46 ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;
    //         break;
    //       case 130: //numerals and decimal and length restricted to N
    //         if (
    //           ((KeyID >= 48 && KeyID < 58) ||
    //             KeyID == 46 ||
    //             KeyID == 8 ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;
    //         break;
    //       case 125: //For options..same as 131
    //         if (
    //           ((KeyID >= 48 && KeyID < 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;
    //         break;
    //       case 128: //all //case added for Bug 46358
    //         if ( textBoxElem.value.length+1 < charCount) returnValue = true;
    //         else returnValue = false;
    //         break;
    //       case 131: //numerals and length restricted to N
    //         if (
    //           ((KeyID >= 48 && KeyID < 58) ||
    //             (KeyID >= 1632 && KeyID <= 1641)) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           //(KeyID>=1632 && KeyID<=1641) check is added for for arabic numerals Bug 46250
    //           returnValue = true;
    //         else returnValue = false;
    //         break;
    //       //BUG ID 46292 :: 06/06/2014 starts
    //       //                case 134://all allowed except Enter and charCount Not to be checked -- message
    //       //                    if(KeyID!=13)
    //       //                        returnValue = true;
    //       //                    else
    //       //                        returnValue = false;
    //       //                    break;
    //       //                case 135://all allowed except Enter, quotes(', "), | character -- subject
    //       //                    if(KeyID!=13  && KeyID!=34  && KeyID!=39  && KeyID!=124  && ( textBoxElem.value.length+1<charCount))
    //       //                        returnValue = true;
    //       //                    else
    //       //                        returnValue = false;
    //       //                    break;
    //       //BUG ID 46292 :: 06/06/2014 ends
    //       //BUG ID 46305 :: 06/06/2014 starts
    //       //modified for Bug 46250
    //       //case 115://same as default but . is allowed
    //       //  if(( KeyID >= 32 && KeyID <=47 && KeyID != 45 && KeyID != 46) || ( KeyID >= 58 && KeyID <=64) || ( KeyID >= 91 && KeyID <=96 && KeyID != 95) || ( KeyID >= 123 && KeyID <=126 ) ||  textBoxElem.value.length+1>=charCount)
    //       case 115: //same as default but . is allowed and space restricted
    //         if (
    //           (KeyID >= 32 && KeyID < 47 && KeyID != 45 && KeyID != 46) ||
    //           (KeyID >= 58 && KeyID < 64) ||
    //           (KeyID >= 91 && KeyID <= 96 && KeyID != 95 && KeyID != 92) ||
    //           (KeyID >= 123 && KeyID <= 126) ||
    //            textBoxElem.value.length+1 >= charCount
    //         )
    //           //till here  Bug 46250
    //           returnValue = false;
    //         else returnValue = true;
    //         break;
    //       //added on 18/3/2021,bug_id:98704
    //       case 140:
    //         // characters restricted are \/:*?"<>|
    //         if (
    //           KeyID == 92 ||
    //           KeyID == 47 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 34 ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 124
    //         )
    //           returnValue = false;
    //         else returnValue = true;
    //         break; //till here bug_id:98704
    //       case 142: //case added for bug 46149
    //         // characters restricted are \/:*?<>   (For mail subject and msg)
    //         if (
    //           KeyID == 92 ||
    //           KeyID == 47 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 60 ||
    //           KeyID == 62
    //         )
    //           returnValue = false;
    //         else returnValue = true;
    //         break;
    //       //Added for Bug 46277
    //       case 113:
    //         if (
    //           (KeyID >= 32 && KeyID < 45) ||
    //           (KeyID >= 58 && KeyID < 64) ||
    //           (KeyID >= 91 && KeyID <= 96 && KeyID != 95 && KeyID != 92) ||
    //           (KeyID >= 123 && KeyID <= 126) ||
    //            textBoxElem.value.length+1 >= charCount
    //         )
    //           returnValue = false;
    //         else returnValue = true;
    //         break;

    //       //added on 25/1/2018,bug_id:75511
    //       case 151: //table creation   //alphabets numerics  _ are allowed
    //         if (
    //           (KeyID == 95 ||
    //             (KeyID > 64 && KeyID < 91) ||
    //             (KeyID > 96 && KeyID < 123) ||
    //             (KeyID >= 48 && KeyID < 58)) &&
    //            textBoxElem.value.length+1 < charCount
    //         ) {
    //           returnValue = true;
    //           if (textBoxElem != undefined) {
    //             if (
    //                textBoxElem.value.length+1 == 0 &&
    //               (KeyID == 35 || (KeyID >= 48 && KeyID < 58))
    //             )
    //               //lenght = 1
    //               returnValue = false;
    //           }
    //         }
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 8 || KeyID == 0)
    //             // delete key and backspace
    //             returnValue = true;
    //         }
    //         break; //till here ,bug_id:75511
    //       case 157:
    //         if (
    //           KeyID == 47 ||
    //           KeyID == 92 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 34 ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 124 ||
    //           KeyID == 38 ||
    //           KeyID == 39 ||
    //           KeyID == 46 ||
    //            textBoxElem.value.length+1 > charCount
    //         ) {
    //           returnValue = false;
    //           break;
    //         } else returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
    //         )
    //           returnValue = false;
    //         break;
    //       case 158:
    //         if (
    //           KeyID == 47 ||
    //           KeyID == 92 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 34 ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 124 ||
    //           KeyID == 38 ||
    //           KeyID == 39 ||
    //           KeyID == 46 ||
    //           KeyID == 32 ||
    //            textBoxElem.value.length+1 > charCount
    //         ) {
    //           returnValue = false;
    //           break;
    //         } else returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
    //         )
    //           returnValue = false;
    //         break;
    //       //added on 25/2/2021,bug_id:98302
    //       case 160:
    //         if (
    //           KeyID == 47 ||
    //           KeyID == 92 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 34 ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 124 ||
    //           KeyID == 38 ||
    //           KeyID == 39 ||
    //           KeyID == 35 ||
    //           KeyID == 43 ||
    //           KeyID == 32 ||
    //            textBoxElem.value.length+1 > charCount - 1
    //         ) {
    //           //till here bug_id: 59553
    //           returnValue = false;
    //           break;
    //         } else returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
    //         )
    //           returnValue = false;
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 46 || KeyID == 0) {
    //             // delete key
    //             returnValue = true;
    //           }
    //         }
    //         break; //till here bug_id:98302
    //       //added on 29/1/2018,bug_id:75575
    //       //added on 31/1/2018,bug_id:75623-
    //       case 164: //alphabets,numerals,underscore,space and with fist character as alphabet only and length restricted to N
    //         returnValue = true;
    //         break; //till herebug_id:75623-
    //       //added on 04/09/2019 for Bug Id 86349
    //       case 169: //processname validation (only _ and space is allowed with first character as alphabet)
    //         //added for Bug Id 86524

    //         if (sLocale == "fr_fr") {
    //           if (
    //             !(
    //               (KeyID >= 33 && KeyID <= 47) ||
    //               (KeyID >= 58 && KeyID <= 64) ||
    //               (KeyID >= 91 && KeyID <= 94) ||
    //               KeyID == 96 ||
    //               (KeyID >= 123 && KeyID <= 126)
    //             ) &&
    //              textBoxElem.value.length+1 < charCount
    //           ) {
    //             returnValue = true;
    //             if (textBoxElem != undefined) {
    //               if (
    //                  textBoxElem.value.length+1 == 0 &&
    //                 (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //               )
    //                 returnValue = false;
    //             }
    //           }
    //         }
    //         //till here Bug Id 86524
    //         //added for Bug Id 95361
    //         else if (sLocale == "es_do" || sLocale == "es") {
    //           if (
    //             (KeyID == 95 ||
    //               KeyID == 32 ||
    //               KeyID == 209 ||
    //               KeyID == 241 ||
    //               KeyID == 231 ||
    //               KeyID == 199 ||
    //               (KeyID > 64 && KeyID < 91) ||
    //               (KeyID > 96 && KeyID < 123) ||
    //               (KeyID >= 48 && KeyID < 58)) &&
    //              textBoxElem.value.length+1 < charCount
    //           ) {
    //             returnValue = true;
    //             if (textBoxElem != undefined) {
    //               if (
    //                  textBoxElem.value.length+1 == 0 &&
    //                 (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //               )
    //                 returnValue = false;
    //             }
    //           }
    //         }
    //         //till here Bug Id 95361
    //         //added on 2/2/2021,bug_id:97574
    //         else if (sLocale == "de") {
    //           if (
    //             (KeyID == 95 ||
    //               KeyID == 32 ||
    //               (KeyID > 64 && KeyID < 91) ||
    //               (KeyID > 96 && KeyID < 123) ||
    //               (KeyID >= 48 && KeyID < 58) ||
    //               validateLocaleCharacters(KeyID)) &&
    //              textBoxElem.value.length+1 < charCount
    //           ) {
    //             //modified on 10/2/2021,bug_id:97923
    //             returnValue = true;
    //             if (textBoxElem != undefined) {
    //               if (
    //                  textBoxElem.value.length+1 == 0 &&
    //                 (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //               )
    //                 returnValue = false;
    //             }
    //           }
    //         } else if (sLocale == "pt") {
    //           if (
    //             (KeyID == 95 ||
    //               KeyID == 32 ||
    //               (KeyID > 64 && KeyID < 91) ||
    //               (KeyID > 96 && KeyID < 123) ||
    //               (KeyID >= 48 && KeyID < 58) ||
    //               validateLocaleCharacters(KeyID)) &&
    //              textBoxElem.value.length+1 < charCount
    //           ) {
    //             //modified on 11/2/2021,bug_id:97979
    //             returnValue = true;
    //             if (textBoxElem != undefined) {
    //               if (
    //                  textBoxElem.value.length+1 == 0 &&
    //                 (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //               )
    //                 returnValue = false;
    //             }
    //           }
    //         } //till here bug_id:97574
    //         else if (sLocale == "nl") {
    //           if (
    //             (KeyID == 95 ||
    //               KeyID == 32 ||
    //               (KeyID > 64 && KeyID < 91) ||
    //               (KeyID > 96 && KeyID < 123) ||
    //               (KeyID >= 48 && KeyID < 58) ||
    //               validateLocaleCharacters(KeyID)) &&
    //              textBoxElem.value.length+1 < charCount
    //           ) {
    //             //modified on 11/2/2021,bug_id:97979
    //             returnValue = true;
    //             if (textBoxElem != undefined) {
    //               if (
    //                  textBoxElem.value.length+1 == 0 &&
    //                 (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //               )
    //                 returnValue = false;
    //             }
    //           }
    //         } else if (
    //           (KeyID == 95 ||
    //             KeyID == 32 ||
    //             (KeyID > 64 && KeyID < 91) ||
    //             (KeyID > 96 && KeyID < 123) ||
    //             (KeyID >= 48 && KeyID < 58)) &&
    //            textBoxElem.value.length+1 < charCount
    //         ) {
    //           returnValue = true;
    //           if (textBoxElem != undefined) {
    //             if (
    //                textBoxElem.value.length+1 == 0 &&
    //               (KeyID == 95 || KeyID == 32 || (KeyID >= 48 && KeyID < 58))
    //             )
    //               returnValue = false;
    //           }
    //         } //added for bug id 89447
    //         else if (sLocale == "ar" || sLocale == "ar_sa") {
    //           if ( textBoxElem.value.length+1 < charCount) returnValue = true;
    //         } //till here bug id 89477
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 8 || KeyID == 0)
    //             // delete key and backspace
    //             returnValue = true;
    //         }
    //         break; //till here bug_id:86349

    //       //added on 8/2/2018,bug_id:75887
    //       case 171:
    //       case 113: //alphabets,numerals,underscore,and with fist character as alphabet only and length restricted to N
    //         if (
    //           (KeyID == 95 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID > 64 && KeyID < 91) ||
    //             (KeyID > 96 && KeyID < 123) ||
    //             KeyID == 8) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           ((KeyID >= 48 && KeyID < 58) || KeyID == 95)
    //         )
    //           returnValue = false;

    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 0) returnValue = true;
    //         }
    //         break; //till here bug_id:75623 //till here bug_id:75887
    //       //added on 9/2/2018,bug_id:72867
    //       case 172:
    //         if (
    //           ( textBoxElem.value.length+1 == 0 && KeyID == 32) ||
    //            textBoxElem.value.length+1 > charCount
    //         )
    //           returnValue = false;
    //         else returnValue = true;
    //         break;
    //       //till here bug_id:72867
    //       //added on 16/8/2018,bug_id:79756
    //       case 173: //in SAP username (numeral and alphabets allowed)
    //         returnValue = true;
    //         break;
    //       //till here bug_id:79756
    //       //added on 25/10/2018,bug_id:80766
    //       case 174:
    //         if (
    //           (KeyID >= 32 && KeyID < 45) ||
    //           (KeyID >= 58 && KeyID < 64) ||
    //           (KeyID >= 91 && KeyID <= 96 && KeyID != 95 && KeyID != 92) ||
    //           (KeyID >= 123 && KeyID <= 126) ||
    //            textBoxElem.value.length+1 >= charCount ||
    //           KeyID > 126
    //         )
    //           returnValue = false;
    //         else returnValue = true;
    //         break; //till here bug_id:80766
    //       //BUG ID 46305 :: 06/06/2014 ends
    //       ////added for bug id 88118
    //       case 175: //alphabets, numerals,hiphen and underscore with fist character as alphabet only and length restricted to N
    //         if (
    //           (KeyID == 45 ||
    //             KeyID == 95 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID > 64 && KeyID < 91) ||
    //             (KeyID > 96 && KeyID < 123) ||
    //             KeyID == 8) &&
    //            textBoxElem.value.length+1 < charCount
    //         )
    //           returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           ((KeyID >= 48 && KeyID < 58) || KeyID == 95 || KeyID == 45)
    //         )
    //           returnValue = false;

    //         if (browser == "Netscape") {
    //           if (KeyID == 0) returnValue = true;
    //         }
    //         break;
    //       //till here bug id 88118
    //       //added on 21/11/2018,bug_id:81461
    //       case 176:
    //         if (
    //           (KeyID >= 48 && KeyID <= 57) ||
    //           (KeyID >= 65 && KeyID <= 90) ||
    //           (KeyID >= 97 && KeyID <= 122) ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 95 ||
    //           KeyID == 38 ||
    //            textBoxElem.value.length+1 > charCount - 1
    //         ) {
    //           //BUG ID 65575, length reduced by 1
    //           returnValue = true;
    //           break;
    //         } else returnValue = false;

    //         break;
    //       //added by deepak munagala for bug id 84858
    //       case 177: //first char as alphabet only and all chars are allowed except \ / : * ? " < > | # ,
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 8) {
    //             returnValue = true;
    //             break;
    //           }
    //         }
    //         //added on 28/7/2020,bug_id:93406
    //         if (sLocale == "ar" || sLocale == "ar_sa") {
    //           if (
    //             KeyID == 47 ||
    //             KeyID == 92 ||
    //             KeyID == 58 ||
    //             KeyID == 42 ||
    //             KeyID == 44 ||
    //             KeyID == 63 ||
    //             KeyID == 34 ||
    //             KeyID == 35 ||
    //             KeyID == 60 ||
    //             KeyID == 62 ||
    //             KeyID == 124 ||
    //             KeyID == 1563 ||
    //             KeyID == 1613 ||
    //              textBoxElem.value.length+1 >= charCount
    //           ) {
    //             returnValue = false;
    //             break;
    //           } else returnValue = true;
    //         } //till here bug_id:93406
    //         else {
    //           if (
    //             KeyID == 47 ||
    //             KeyID == 92 ||
    //             KeyID == 58 ||
    //             KeyID == 42 ||
    //             KeyID == 44 ||
    //             KeyID == 63 ||
    //             KeyID == 34 ||
    //             KeyID == 35 ||
    //             KeyID == 60 ||
    //             KeyID == 62 ||
    //             KeyID == 124 ||
    //              textBoxElem.value.length+1 >= charCount
    //           ) {
    //             returnValue = false;
    //             break;
    //           } else returnValue = true;

    //           if (browser == "Netscape") {
    //             // mozilla browser
    //             if (KeyID == 46 || KeyID == 0) {
    //               // delete key
    //               returnValue = true;
    //             }
    //           }
    //         }
    //         break;
    //       //till here bug id 84858
    //       //added by Diksha on 09.09.2020 for Bug Id 94406
    //       case 178: //Document search  _ - ' space * along with digits and alphabets are allowed
    //         if (
    //           KeyID == 95 ||
    //           (KeyID > 64 && KeyID < 91) ||
    //           (KeyID > 96 && KeyID < 123) ||
    //           (KeyID >= 48 && KeyID < 58) ||
    //           KeyID == 32 ||
    //           KeyID == 39 ||
    //           KeyID == 42 ||
    //           KeyID == 45
    //         ) {
    //           returnValue = true;
    //         } else returnValue = false;
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 8 || KeyID == 0)
    //             // delete key and backspace
    //             returnValue = true;
    //         }
    //         break;
    //       //till here Bug Id 94406
    //       //added on 19.10.2020 by Diksha for Bug ID 95434
    //       case 179: //alphabets, numerals, hyphen and dot, cannot start with hyphen (Case for Domain Name)
    //         if (
    //           (KeyID == 45 ||
    //             KeyID == 46 ||
    //             (KeyID >= 48 && KeyID < 58) ||
    //             (KeyID > 64 && KeyID < 91) ||
    //             (KeyID > 96 && KeyID < 123)) &&
    //            textBoxElem.value.length+1 < charCount
    //         ) {
    //           //BUG 32159:: 23/05/2012
    //           returnValue = true;
    //           if (textBoxElem != undefined) {
    //             if (
    //                textBoxElem.value.length+1 == 0 &&
    //               (KeyID == 45 || KeyID == 46)
    //             )
    //               //lenght = 1
    //               returnValue = false;
    //           }
    //         }
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 8 || KeyID == 0)
    //             // delete key and backspace
    //             returnValue = true;
    //         }
    //         break;
    //       //till here Bug Id 95434
    //       //added on 12/3/2021,bug_id:98455
    //       case 180:
    //         if (
    //           KeyID == 47 ||
    //           KeyID == 92 ||
    //           KeyID == 58 ||
    //           KeyID == 42 ||
    //           KeyID == 63 ||
    //           KeyID == 34 ||
    //           KeyID == 60 ||
    //           KeyID == 62 ||
    //           KeyID == 124 ||
    //           KeyID == 38 ||
    //           KeyID == 39 ||
    //            textBoxElem.value.length+1 >= charCount - 1
    //         ) {
    //           returnValue = false;
    //           break;
    //         } else returnValue = true;
    //         if (
    //            textBoxElem.value.length+1 == 0 &&
    //           !((KeyID > 64 && KeyID < 91) || (KeyID > 96 && KeyID < 123))
    //         )
    //           returnValue = false;
    //         if (browser == "Netscape") {
    //           // mozilla browser
    //           if (KeyID == 46 || KeyID == 0) {
    //             // delete key
    //             returnValue = true;
    //           }
    //         }
    //         break; //till here bug_id:98455
    //       default: // characters restricted are :*?"<>|,;'{}[]=+!#$%^&~`
    //         //  if(KeyID == 92 || KeyID == 47 || KeyID == 58 || KeyID == 42 || KeyID == 63 || KeyID == 34 || KeyID == 60 || KeyID == 62 || KeyID == 124 ||  textBoxElem.value.length+1>=charCount)
    //         // modified for Bug 46250
    //         //if(( KeyID >= 33 && KeyID <=47 && KeyID != 45) || ( KeyID >= 58 && KeyID <=64) || ( KeyID >= 91 && KeyID <=96 && KeyID != 95) || ( KeyID >= 123 && KeyID <=126 ) ||  textBoxElem.value.length+1>=charCount)
    //         if (
    //           (KeyID >= 33 && KeyID < 45) ||
    //           (KeyID >= 58 && KeyID < 64) ||
    //           (KeyID >= 91 && KeyID <= 96 && KeyID != 95 && KeyID != 92) ||
    //           (KeyID >= 123 && KeyID <= 126) ||
    //            textBoxElem.value.length+1 >= charCount
    //         )
    //           //till here  Bug 46250
    //           returnValue = false;
    //         else returnValue = true;

    //         if (!returnValue) {
    //           if (e.stopPropogation) e.stopPropogation(true);
    //           if (e.preventDefault) e.preventDefault(true);
    //           e.cancelBubble = true;
    //         }
    //     }
    //   }
  } catch (excp) {
    returnValue = false;
  }
  //Bug Id  81002  end
  if (!returnValue) evtObj.returnValue = returnValue;

  return returnValue ? null : e.preventDefault();
};
