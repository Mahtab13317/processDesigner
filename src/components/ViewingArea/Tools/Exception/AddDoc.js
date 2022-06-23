import React, {useState} from 'react';
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import '../DocTypes/DocTypes.css';

function AddDoc(props) {
const [nameInput, setNameInput] = useState("");
const setNameFunc = (e) => {
    setNameInput(e.target.value);
};

    return (
        <div className='addExps' style={{border:'1px solid red', backgroundColor:'white', width: '322px', height: '184px', position:'absolute', top:'40%', left:'40%', padding:'10px'}}>
            <p style={{fontSize:'16px', marginBottom:'10px', font: 'normal normal 600 16px/22px Open Sans'}}>Add Documents</p>
            <div style={{displayt:'flex', alignItems:'center'}}>
                <label style={{ fontSize: "14px", marginBottom:'10px'}}>
                     Document type name
                    <StarRateIcon
                    style={{ height: "15px", width: "15px", color: "red" }}
                    />
                </label>
                <form>
                    <input
                    id='DocNameInput'
                    value={nameInput}
                    onChange={(e) => setNameFunc(e)}
                    style={{ width: '100%', height: '24px', marginBottom: "10px", background: '#F8F8F8 0% 0% no-repeat padding-box',
                    border: '1px solid #E6E6E6',
                    borderRadius: '2px',
                    paddingLeft:'5px',
                    opacity: '1'}}
                    />
                </form>
            </div>
            <p style={{fontSize:'9px', marginBottom:'10px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            {props.nameTaken? <p>Name taken!!</p>: null}
            <div className='buttons_add'>
            <Button variant="outlined" onClick = {()=>props.handleClose()}>Cancel</Button>
            <Button
            onClick={(e)=>props.addDocToList(nameInput,e)}
            variant="contained"
            color="primary">
                Add Another
            </Button>
            <Button
            variant="contained"
            onClick={(e)=>props.addDocToList(nameInput,e)}
            color="primary">
                Add & Close
            </Button>
            </div>


        </div>
    );
}

export default AddDoc;