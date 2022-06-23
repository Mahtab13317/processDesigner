import React from "react";
import SearchComponent from "../../../UI/Search Component/index";
import "./activityStream.css";
import ActivityCard from "../Home/ActivityCard/ActivityCard";
import Filter from "../../../assets/Tiles/Filter.svg";

function ActivityStream(props) {
  const { showSearch, heading, activities } = props;
  let countOfUnseenActivities = activities?.filter((activity) => {
    return activity.seen == true;
  }).length;

  let activityStream =
    activities &&
    activities.map((activity, index) => (
      <div className="homeActivityCardDiv">
        <ActivityCard
          clickableWord={activity.sentence[1].clickableWord}
          nonClickableWord1={activity.sentence[0].nonClickableWord}
          nonClickableWord2={activity.sentence[0].nonClickableWordContinued}
          avatarImage={activity.imgSrc}
          time={activity.time}
          seen={activity.seen}
          activityInfo={activity.words}
          activityInfoSpan={activity.word}
        />
      </div>
    ));

  return (
    <React.Fragment>
      <div>
        <h4
          style={{ float: props.direction == "rtl" ? "right" : "left" }}
          className="activityHeading"
        >
          {heading}{" "}
          <span className="activityHeadingCount">
            ({countOfUnseenActivities})
          </span>
        </h4>
      </div>
      <div className="activityStream">
        {showSearch && (
          <div className="activitySearchDiv">
            <SearchComponent width="20vw" />
            <img
              src={Filter}
              width="24px"
              height="24px"
              className="filterIcon"
            />
          </div>
        )}
        {activityStream}
      </div>
    </React.Fragment>
  );
}

export default ActivityStream;
