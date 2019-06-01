import React, { Fragment } from "react";

export default function TypingIndicator(props) {
  return (
    <Fragment>
      {props.typingUsers.length > 0 ? (
        `${props.typingUsers.slice(0, 2).join(" and ")} is typing`
      ) : (
        <div />
      )}
    </Fragment>
  );
}
