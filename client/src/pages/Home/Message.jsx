import React from "react";
import classnames from "classnames";
import moment from "moment";
import { useAuthState } from "../../context/auth";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;

  return (
    <OverlayTrigger
      placement={sent ? "right" : "left"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classnames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": received,
        })}
      >
        <div
          className={classnames("py-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p className={classnames({ "text-white": sent })}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default Message;
