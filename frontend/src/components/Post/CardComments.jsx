import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../actions/post.actions";
import FollowHandler from "../Profil/FollowHandler";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment";
import styled from "styled-components";

const CardComments = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();

  const handleComment = (e) => {
    e.preventDefault();
  
    if (text) {
      if (userData && userData._id) {
        dispatch(addComment(post._id, userData._id, text, userData.pseudo || userData.name))
          .then(() => {
            setText('');
          });
      } else {
        console.error("Erreur: Données utilisateur non disponibles");
      }
    }
  };

  return (
    <CommentsContainer>
      {post.comments && post.comments.map((comment) => {
        return (
          <CommentItem
            className={
              comment.commenterId === userData?._id
                ? "client"
                : ""
            }
            key={comment._id}
          >
            <CommentHeader>
              <UserInfo>
                <img
                  src={
                    !isEmpty(usersData[0]) &&
                    usersData
                      .filter((user) => user._id === comment.commenterId)
                      .map((user) => user.picture)[0]
                  }
                  alt="commenter-pic"
                />
                <h3>{comment.commenterPseudo}</h3>
                {userData && comment.commenterId !== userData._id && (
                  <FollowHandler
                    idToFollow={comment.commenterId}
                    type={"card"}
                  />
                )}
              </UserInfo>  
              <TimeStamp>{timestampParser(comment.timestamp)}</TimeStamp>
            </CommentHeader>
            
            <CommentText>{comment.text}</CommentText>
            
            <EditDeleteComment comment={comment} postId={post._id} />
          </CommentItem>
        );
      })}
      {userData && userData._id && (
        <CommentForm onSubmit={handleComment}>
          <CommentInput
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Laisser un commentaire"
          />
          <CommentSubmit type="submit" value="Envoyer" />
        </CommentForm>
      )}
    </CommentsContainer>
  );
};

export default CardComments;

// Styled components pour améliorer l'apparence et la structure
const CommentsContainer = styled.div`
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
`;

const CommentItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &.client {
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #757575;
`;

const CommentText = styled.p`
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.4;
`;

const CommentForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const CommentInput = styled.input`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  transition: border 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const CommentSubmit = styled.input`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-end;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1976d2;
  }
`;
