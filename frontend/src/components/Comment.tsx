import React from "react";
import { CommentType } from "../types";

const Comment = ({
  comment,
  firstComment,
}: {
  comment: CommentType;
  firstComment: boolean;
}) => {
  return (
    <div
      style={{
        borderTop: !firstComment ? "1px solid #ccc" : "none",
        padding: "10px 0",
        fontSize: "0.9em",
      }}
    >
      <p>
        {comment.content} - <i>{comment.author}</i>,{" "}
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default Comment;
