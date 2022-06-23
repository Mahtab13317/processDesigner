import { restrictedNames , maxLabelCharacter } from '../../Constants/bpmnView';

const maxChar = maxLabelCharacter;
const minChar = 1;

export function nameValidity(value , cell){

    let isValid = true, message = null;

    if(value == null){
        isValid = false;
        message = {
            langKey : "messages.notEmpty",
            defaultWord : "Can't be Empty"
        };
    }

    value = value && value.trim();

    // if(isValid && (value.length > maxChar || value.length < minChar)){
    //     isValid = false;
    //     message = {
    //         langKey : "messages.minMaxChar",
    //         parameterTranslation : {maxChar : maxChar , minChar : minChar}
    //     };
    // }

    if(isValid && restrictedNames.filter(name => name === value).length > 0){
        isValid = false;
        message = {
            langKey : "messages.restrictedName",
            parameterTranslation : {value : value}
        };
    }
    
    let siblings = cell.getParent().children.filter(childCell => childCell !== cell);
    for(let i = 0; i < siblings.length && isValid; i++){
        if(siblings[i].value === value){
            isValid = false;
            message = {
                langKey : "messages.alreadyExists",
                parameterTranslation : {value : value}
            };
        }
    }

    return [isValid , message];
}