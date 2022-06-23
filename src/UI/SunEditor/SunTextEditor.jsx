import React, { useState } from "react";
import SunEditor from "suneditor-react";
import {
  align,
  fontColor,
  hiliteColor,
  list,
  formatBlock,
  textStyle,
  image,
  table,
  fontSize,
  font,
  lineHeight,
  link,
  audio,
  video,
  math,
  paragraphStyle,
} from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import "./suneditor-custom.css";
import TextEditorToolbarJson from "./TextEditorToolbarJson";

export default function SunTextEditor(props) {
  const { autoFocus, width } = props;
  var toolbarOptions = [];
  Object.keys(TextEditorToolbarJson).map((key) => {
    if (Array.isArray(TextEditorToolbarJson[key])) {
      let optionsArray = [];
      TextEditorToolbarJson[key].map((subKey) => {
        if (TextEditorToolbarJson[subKey] === "true") {
          optionsArray.push(subKey);
        }
      });
      toolbarOptions.push(optionsArray);
    }
  });
  var emptyButtonList = [[]];
  const toolbarOptionsArray =
    props.previewmode === true ? emptyButtonList : toolbarOptions;
  const [content, setContent] = useState(
    props.paragraphText && props.paragraphText.length > 0
      ? props.paragraphText
      : ""
  );

  const handleContent = (content) => {
    if (props.descriptionInputcallBack) {
      props.descriptionInputcallBack(content, props.name);
    }
    if (props.paragraphText) {
      props.paragraphText = content;
    }
  };

  const handlePaste = (event, cleanData, maxCharCount) => {
    return true;
  };

  const handleDrop = (event) => {
    return false;
  };
  const [addStyle, setaddStyle] = useState(false);
  React.useEffect(() => {
    if (props.hasOwnProperty("width") && props.hasOwnProperty("customHeight"))
      setaddStyle(true);
  }, []);
  const handleKey = (e) => {
    props.getValue(e);
  };

  return (
    <div className="App">
      <div className={addStyle ? "customStyle" : ""}>
        <form>
          <SunEditor
            name="myEditor"
            autoFocus={autoFocus}
            lang="en"
            placeholder={
              props.placeholder ? props.placeholder : "Type something here..."
            }
            setOptions={{
              showPathLabel: false,
              //katex: katex,
              plugins: [
                align,
                formatBlock,
                fontColor,
                hiliteColor,
                list,
                table,
                textStyle,
                image,
                fontSize,
                font,
                lineHeight,
                audio,
                video,
                link,
                math,
                paragraphStyle,
              ],
              buttonList: toolbarOptionsArray,
              font: ["Arial", "tahoma", "Courier New,Courier", "Verdana"],
              fontSize: [5, 8, 10, 14, 18, 24, 36],
              fontSizeUnit: "px",
              value: props.value,
            }}
            id="sunEE"
            onInput={handleKey}
            setContents={content}
            onChange={handleContent}
            onPaste={handlePaste}
            onDrop={handleDrop}
            width={width ? width : "100%"}
          />
        </form>
      </div>
    </div>
  );
}
