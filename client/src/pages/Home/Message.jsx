import React from "react";
import classnames from "classnames";
import { useAuthState } from "../../context/auth";

function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;

  return (
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
        <p className={classnames({ "text-white": sent })}>{message.content}</p>
      </div>
    </div>
  );
}

export default Message;
