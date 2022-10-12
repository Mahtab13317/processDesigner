import React, { useEffect, useState } from "react";
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
import {
  isProcessDeployedFunc,
  isReadOnlyFunc,
} from "../../utility/CommonFunctionCall/CommonFunctionCall";
import { store, useGlobalState } from "state-pool";

export default function SunTextEditor(props) {
  const { autoFocus, width, disabled } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  let isReadOnly = isProcessDeployedFunc(localLoadedProcessData);

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
    props.value && props.value.length > 0 ? props.value : ""
  );
  const [addStyle, setaddStyle] = useState(false);

  useEffect(() => {
    if (props.hasOwnProperty("width") && props.hasOwnProperty("customHeight"))
      setaddStyle(true);
  }, []);

  useEffect(() => {
    if (props.value && props.value?.trim() !== "") {
      setContent(props.value);
    }
  }, [props.value]);

  const handleContent = (content) => {
    if (props.descriptionInputcallBack) {
      props.descriptionInputcallBack(content, props.name);
    }
  };

  const handlePaste = (event, cleanData, maxCharCount) => {
    return true;
  };

  const handleDrop = (event) => {
    return false;
  };

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
            }}
            id="sunEE"
            onInput={handleKey}
            setContents={content}
            onChange={handleContent}
            onPaste={handlePaste}
            onDrop={handleDrop}
            width={width ? width : "100%"}
            disable={disabled || isReadOnly}
          />
        </form>
      </div>
    </div>
  );
}
