import React from "react";
import { Col, Image } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import classnames from "classnames";
// context
import { useMessageDispatch, useMessageState } from "../../context/message";
// types
import { SET_USERS, SET_SELECTED_USER } from "../../context/types";

const noImage = require("../../assets/images/no-img.jpeg");

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

function Users() {
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;
  const dispatch = useMessageDispatch();

  const { loading } = useQuery(GET_USERS, {
    onCompleted(data) {
      dispatch({ type: SET_USERS, payload: data.getUsers });
    },
    onError(err) {
      console.log(err);
    },
  });

  let usersMarkup;

  if (!users || loading) {
    usersMarkup = <p>Loading...</p>;
  } else if (!users.length) {
    usersMarkup = <p>No users have joined yet!</p>;
  } else if (users.length) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          className={classnames(
            "user-div d-flex justify-content-center justify-content-md-start p-3",
            {
              "bg-white": selected,
            }
          )}
          role="button"
          key={user.username}
          onClick={() =>
            dispatch({ type: SET_SELECTED_USER, payload: user.username })
          }
        >
          <Image src={user.imageUrl || noImage} className="user-image" />
          <div className="d-none d-md-block ml-2">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You're now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col xs={2} sm={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
}

export default Users;
