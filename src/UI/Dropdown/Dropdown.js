import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    color: "#000000",
    fontFamily: "Open Sans",
    fontSize: "12px",
    "& ul": {
      paddingRight: "0px !important",
    },
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "#F8F8F8 0% 0% no-repeat padding-box",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "#000000",
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles({
  listItemGutters: {
    paddingLeft: "8px",
    paddingRight: "8px",
  },
});

export default function CustomizedMenus(props) {
  const {
    anchorEl = null,
    handleClose = () => {},
    options = [],
    defaultSelection = 0,
  } = props;

  const classes = useStyles();

  const [selectedItem, setSelectedIndex] = React.useState(defaultSelection);

  const handleMenuItemClick = (evt, optionId, callbackFunction) => {
    setSelectedIndex(optionId);
    if (callbackFunction) {
      callbackFunction(optionId);
    }
    handleClose();
  };

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ disablePadding: true }}
      >
        {options.map((option, index) => (
          <StyledMenuItem
            key={option.id + "-" + index}
            selected={option.id === selectedItem}
            ListItemClasses={{ gutters: classes.listItemGutters }}
            onClick={(event) =>
              handleMenuItemClick(event, option.id, option.callbackFunction)
            }
            style={props.style}
          >
            {option.value}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
