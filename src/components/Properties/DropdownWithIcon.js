import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function DropdownWithIcon({ activityInfo, ...props }) {
  const [selectedValue, setselectedValue] = React.useState(0);

  const getSelectedActivity = (e) => {
    setselectedValue(e.target.value);
    props.getSelectedActivity(e.target.value);
  };

  React.useEffect(() => {
    if (props.selectedActivity) {
      setselectedValue(props.selectedActivity);
    } else return;
  }, [props.selectedActivity]);

  return (
    <Select
      disabled={props.disabled}
      IconComponent={ExpandMoreIcon}
      style={{ width: "95%", height: "2rem" }}
      variant="outlined"
      value={selectedValue}
      onChange={getSelectedActivity}
    >
      <MenuItem value={0} style={{ width: "100%", marginBlock: "0.2rem" }}>
        <p
          style={{
            marginInline: "0.4rem",
            font: "0.8rem Open Sans",
          }}
        >
          {""}
        </p>
      </MenuItem>
      {activityInfo.map((item) => {
        return (
          <MenuItem
            style={{ width: "100%", marginBlock: "0.2rem" }}
            value={item.id}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <img
                src={item.icon}
                style={{
                  height: "1rem",
                  width: "1rem",
                  marginTop: "0.125rem",
                }}
                alt=""
              />

              <p
                style={{
                  marginInline: "0.4rem",
                  font: "0.8rem Open Sans",
                }}
              >
                {item.name}
              </p>
            </div>
          </MenuItem>
        );
      })}
    </Select>
  );
}

export default DropdownWithIcon;
