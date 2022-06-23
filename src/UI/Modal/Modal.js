import React, { Component } from "react";

import "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render(props) {
    return (
      <React.Fragment>
        <Backdrop
          show={this.props.hideBackdrop ? false : this.props.show}
          clicked={this.props.modalClosed}
          style={{ ...this.props.backDropStyle }}
        />
        <div
          className="Modal"
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0",
            ...this.props.style,
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
