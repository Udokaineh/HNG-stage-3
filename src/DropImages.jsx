import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

const DropImages = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [tagInputs, setTagInputs] = useState([]);
  const [searchState, setSearchState] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const storedImageUrls = JSON.parse(localStorage.getItem("imageUrls")) || [];
    const storedTagInput = JSON.parse(localStorage.getItem("tagInputs")) || [];

    setImageUrls(storedImageUrls);
    setTagInputs(storedTagInput);
  }, []);

  const inputRef = useRef(null);

  const handleClickFileInput = () => {
    inputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0) {
      const newImageUrls = selectedFiles.map(() => URL.createObjectURL(selectedFiles[0]));

      setImageUrls([...imageUrls, ...newImageUrls]);

      const initialTagInputs = Array(newImageUrls.length).fill("");
      setTagInputs([...tagInputs, ...initialTagInputs]);

      localStorage.setItem("imageUrls", JSON.stringify([...imageUrls, ...newImageUrls]));
      localStorage.setItem("tagInputs", JSON.stringify([...tagInputs, ...initialTagInputs]));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);

      const initialTagInputs = Array(newImageUrls.length).fill("");
      setTagInputs([...tagInputs, ...initialTagInputs]);

      localStorage.setItem("imageUrls", JSON.stringify([...imageUrls, ...newImageUrls]));
      localStorage.setItem("tagInputs", JSON.stringify([...tagInputs, ...initialTagInputs]));
    },
    [imageUrls, tagInputs]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });


  // functions that let you rearrange images dragged and dropped
  const handleImageDragStart = (index) => {
    setDraggedImageIndex(index);
  };
  
  const handleImageDragOver = (index) => (e) => {
    e.preventDefault();
    if (draggedImageIndex !== null && draggedImageIndex !== index) {
      const newImageUrls = [...imageUrls];
      const [draggedImage] = newImageUrls.splice(draggedImageIndex, 1);
      newImageUrls.splice(index, 0, draggedImage);
  
      const newTagInputs = [...tagInputs];
      const [draggedTagInput] = newTagInputs.splice(draggedImageIndex, 1);
      newTagInputs.splice(index, 0, draggedTagInput);
  
      setImageUrls(newImageUrls);
      setTagInputs(newTagInputs);
      setDraggedImageIndex(index);
    }
  };
  
  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };  

  
  const handleTagChange = (index, event) => {
    const createTagCopies = [...tagInputs];
    createTagCopies[index] = event.target.value;
    setTagInputs(createTagCopies);
  };

  const handleSearch = (e) => {
    setSearchState(e.target.value);
  };

  const filteredImages = () => {
    return imageUrls.map((imageUrl, index) => ({
      imageUrl,
      tagInput: tagInputs[index] || "",
    })).filter((image) => {
      return (
        image.tagInput.toLowerCase().includes(searchState.toLowerCase())
      );
    });
  };

  const filteredImagesList = filteredImages();

  return (
    <div>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleFileInputChange}
      />
      <input
        onChange={handleSearch}
        type="text"
        placeholder="search for image"
        value={searchState}
        className="input"
      />
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {loading ? (
          <div className="loading-skeleton">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton-item" />
            ))}
          </div>
        ) : filteredImagesList.length === 0 ? (
          <p>
            Drag & drop images here, or
            <button onClick={handleClickFileInput}>
              click to select files
            </button>
          </p>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div>
            {filteredImagesList.map((image, index) => (
              <div key={index}>
                <img
                  src={image.imageUrl}
                  alt={`Dropped pic ${index}`}
                  draggable
                  onDragStart={() => handleImageDragStart(index)}
                  onDragOver={handleImageDragOver(index)}
                  onDragEnd={handleImageDragEnd}
                  style={{ width: "100px", height: "100px", cursor: "grab" }}
                />

                {searchState === "" ? (
                  <p>
                    <input
                      type="text"
                      placeholder="Enter tag"
                      value={tagInputs[index] || ""}
                      onChange={(event) => handleTagChange(index, event)}
                      className="tag-input"
                    />
                  </p>
                ) : null}
                <p value={tagInputs[index] || ""}>{image.tag}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropImages;