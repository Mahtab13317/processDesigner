import React from 'react';
import './ActivityCard.css';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ActivityProcesses from "../../../../assets/Tiles/ActivityProcesses.svg";

function ActivityCard(props) {
    return (
        <div className='cardContent'>
            <div className='textDiv'>
                <div className="Avatar">
                    <img
                        src={ActivityProcesses}
                        width="16px"
                        height="16px"
                        className="avatarImage"
                    />
                    {props.seen ?  <FiberManualRecordIcon className="fiberManualIcon" /> : null}
                </div>
                <p className='activityInfo'>
                    {props.nonClickableWord1} <span> {props.clickableWord}</span> {props.nonClickableWord2}
                </p>
            </div>
            <div className='timeDiv'>
                <p className='time'>{props.time}</p>
                <MoreHorizIcon className="moreHorizonIcon" /> 
            </div>
        </div>
    );
}


export default ActivityCard;

