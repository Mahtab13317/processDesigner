import {
  SERVER_URL,
  ENDPOINT_PROCESS_ASSOCIATION,
} from "../../Constants/appConstants";
import axios from "axios";
import {
  setActivityDependencies,
  setDependencyErrorMsg,
  setShowDependencyModal,
  setWorkitemFlag,
} from "../../redux-store/actions/Properties/activityAction";

export const validateActivityObject = ({
  processDefId,
  processType,
  activityName,
  activityId,
  errorMsg,
  onSuccess = () => {
    console.log("please provide onSuccess call fn");
  },
  dispatch,
}) => {
  axios
    .get(
      SERVER_URL +
        ENDPOINT_PROCESS_ASSOCIATION +
        `/${processDefId}/${processType}/${activityName}/${activityId}/AR/D`
    )
    .then((res) => {
      if (res.data.Status === 0) {
        if (res.data.Validations?.length > 0) {
          if (res.data.WorkitemValidation) {
            dispatch(setShowDependencyModal(true));
            dispatch(setActivityDependencies(res.data.Validations));
            dispatch(setDependencyErrorMsg(errorMsg));
            dispatch(setWorkitemFlag(res.data.WorkitemValidation));
          } else {
            onSuccess(res.data.WorkitemValidation);
          }
        } else {
          onSuccess(res.data.WorkitemValidation);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
