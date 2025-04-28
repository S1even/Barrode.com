import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../actions/post.actions";
import { UidContext } from "../AppContext";
import styled from "styled-components";

const EditDeleteComment = ({ comment, postId }) => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(comment.text);
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();

  const handleEdit = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(editComment(postId, comment._id, text))
        .then(() => {
          setEdit(false);
        })
        .catch((err) => console.error("Erreur lors de la modification:", err));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
      dispatch(deleteComment(postId, comment._id))
        .catch((err) => console.error("Erreur lors de la suppression:", err));
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est l'auteur du commentaire
    const currentUserId = uid || (userData && userData._id);
    if (currentUserId && currentUserId === comment.commenterId) {
      setIsAuthor(true);
    } else {
      setIsAuthor(false);
    }
  }, [uid, userData, comment.commenterId]);

  return (
    <EditCommentContainer>
      {isAuthor && !edit ? (
        <ActionButtons>
          <EditButton onClick={() => setEdit(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
              <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
              <line x1="16" y1="5" x2="19" y2="8" />
            </svg>
            <span>Modifier</span>
          </EditButton>
          <DeleteButton onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#e53935"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
            <span>Supprimer</span>
          </DeleteButton>
        </ActionButtons>
      ) : isAuthor && edit ? (
        <EditForm onSubmit={handleEdit}>
          <EditInput
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <ButtonGroup>
            <CancelButton type="button" onClick={() => setEdit(false)}>
              Annuler
            </CancelButton>
            <SubmitButton type="submit">Valider</SubmitButton>
          </ButtonGroup>
        </EditForm>
      ) : null}
    </EditCommentContainer>
  );
};

export default EditDeleteComment;

// Styled components pour le composant EditDeleteComment
const EditCommentContainer = styled.div`
  margin-top: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 5px;
  }
`;

const EditButton = styled(Button)`
  background-color: #f5f5f5;
  color: #424242;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ffebee;
  color: #e53935;
  
  &:hover {
    background-color: #ffcdd2;
  }
`;

const EditForm = styled.form`
  margin-top: 8px;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  background-color: #f5f5f5;
  color: #616161;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #1976d2;
  }
`;