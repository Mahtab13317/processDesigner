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
      style={{ width: "95%", height: "var(--line_height)" }}
      variant="outlined"
      value={selectedValue}
      onChange={getSelectedActivity}
    >
      <MenuItem value={0} style={{ width: "100%", marginBlock: "0.2rem" }}>
        <p
          style={{
            marginInline: "0.4rem",
            fontSize: "var(--base_font_text_size)",
          }}
        >
          {""}
        </p>
      </MenuItem>
      {activityInfo.map((item) => {
        return (
          <MenuItem
            style={{
              width: "100%",
              marginBlock: "0.2rem",
              fontSize: "var(--base_font_text_size)",
            }}
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
                  height: "1.25rem",
                  width: "1.25rem",
                }}
                alt=""
              />

              <p
                style={{
                  marginInline: "0.4rem",
                  fontSize: "var(--base_font_text_size)",
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
