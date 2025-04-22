import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer.user);
  const error = useSelector((state) => state.userReducer.error);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)) {
        alert("Format de fichier non autorisé. Utilisez JPG, JPEG ou PNG.");
        return;
      }
      
      if (selectedFile.size > 500000) {
        alert("L'image est trop volumineuse (max: 500KB)");
        return;
      }
      
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePicture = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      console.error("ID utilisateur non disponible");
      return;
    }
    
    if (!file) {
      console.error("Aucun fichier sélectionné");
      return;
    }
    
    setIsLoading(true);
    
    const data = new FormData();
    data.append("name", userData.pseudo);
    data.append("userId", userData._id);
    data.append("file", file);

    try {
      await dispatch(uploadPicture(data, userData._id));
      setFile(null);
      setPreviewImage(null);
      const fileInput = document.getElementById("file");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action="" onSubmit={handlePicture} className="upload-pic">
      <label htmlFor="file" className="file-label">
        Changer d'image
      </label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        className="file-input"
      />
      
      {previewImage && (
        <div className="preview-container">
          <h4>Aperçu :</h4>
          <img 
            src={previewImage} 
            alt="Aperçu" 
            className="preview-image"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </div>
      )}
      
      {error && (
        <div className="error-container">
          {error.format && <p className="error">{error.format}</p>}
          {error.maxSize && <p className="error">{error.maxSize}</p>}
        </div>
      )}
      
      <input 
        type="submit" 
        value={isLoading ? "Envoi en cours..." : "Envoyer"} 
        disabled={!file || isLoading} 
        className="submit-button"
      />
    </form>
  );
};

export default UploadImg;