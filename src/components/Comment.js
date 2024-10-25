import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addComment,
  updateComment,
  deleteComment as delComment,
} from "../api/comment";

const Comment = ({ comment, videoCode }) => {
  const queryClient = useQueryClient();
  const { id } = useAuth();
  const [newReply, setNewReply] = useState({
    commentCode: 0,
    commentText: "",
    videoCode: videoCode,
    id: id,
    parentCode: 0,
  });
  const [isEdit, setIsEdit] = useState(false);

  // 대댓글 추가
  const addReply = () => {
    addMutation.mutate(newReply);
    setNewReply({ ...newReply, commentText: "", parentCode: 0 });
  };
  const deleteComment = (commentCode) => {
    delMutation.mutate({ commentCode });
  };
  const edit = (commentId, commentText, commentCode) => {
    if (id === commentId) {
      setNewReply({ ...newReply, commentText });
    }
  };

  const editCancle = () => {
    setNewReply({ ...newReply, commentText: "", commentCode: 0 });
  };

  const editSubmit = () => {
    editMutation.mutate(newReply);
    editCancle();
  };

  const addMutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoCode] });
    },
  });

  const editMutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoCode] });
    },
  });

  const delMutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoCode] });
    },
  });

  return (
    <div className="comment-content">
      {comment.delete ? (
        <p>삭제된 댓글입니다..</p>
      ) : (
        <>
          <h4>{comment.id}</h4>
          {isEdit ? (
            <>
              <input
                type="text"
                value={newReply.commentText}
                onChange={(e) =>
                  setNewReply({
                    ...newReply,
                    commentText: e.target.value,
                    commentCode: comment.commentCode,
                  })
                }
              />
              <div className="edit-content">
                <button onClick={editCancle}>취소</button>
                <button onClick={editSubmit}>수정</button>
              </div>
            </>
          ) : (
            <p onClick={() => edit(comment.id, comment.commentText)}>
              {comment.commentText}
            </p>
          )}
          <button
            onClick={() =>
              setNewReply({
                ...newReply,
                parentCode: comment.commentCode,
              })
            }
          >
            답글
          </button>
          {id === comment.id && (
            <button onClick={() => deleteComment(comment.commentCode)}>
              삭제
            </button>
          )}
        </>
      )}

      {newReply.parentCode === comment.commentCode && (
        <>
          <input
            type="text"
            placeholder="답글 추가.."
            value={newReply.commentText}
            onChange={(e) =>
              setNewReply({
                ...newReply,
                commentText: e.target.value,
              })
            }
          />
          <div className="reply-add-status">
            <button
              onClick={() =>
                setNewReply({
                  ...newReply,
                  commentText: "",
                  parentCode: 0,
                })
              }
            >
              취소
            </button>
            <button onClick={addReply}>답글</button>
          </div>
        </>
      )}
      {comment.replies?.map((reply) => (
        <Comment
          comment={reply}
          videoCode={videoCode}
          key={reply.commentCode}
        />
      ))}
    </div>
  );
};
export default Comment;
