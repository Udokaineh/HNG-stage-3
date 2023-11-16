import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import DummyImages from "./DummyImages"
import Masonry from "react-masonry-css";

const DropImages = () => {
  const breakpointColumnsObj = {
    default: 5,
    // 1100: 3,
    // 700: 2,
    // 580: 1
  };
  const [imageDataUrls, setImageDataUrls] = useState([]);
  const [tagInputs, setTagInputs] = useState(() => {
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];
    return storedTagInputs;
  });

  const [searchState, setSearchState] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const storedImageDataUrls =
      JSON.parse(localStorage.getItem("imageDataUrls")) || [];
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];

    setImageDataUrls((prevImageUrls) => [...prevImageUrls, ...storedImageDataUrls]);
    setTagInputs((prevTagInputs) => [...prevTagInputs, ...storedTagInputs]);
  }, []);

  console.log(localStorage.getItem("imageDataUrls"));
console.log(localStorage.getItem("tagInputs"));


  const fileInputRef = useRef(null);

  const handleClickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0) {
      const fileReaders = selectedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((dataUrls) => {
        setImageDataUrls((prevImageUrls) => [...prevImageUrls, ...dataUrls]);
        setTagInputs((prevTagInputs) => [
          ...prevTagInputs,
          ...Array(dataUrls.length).fill(""),
        ]);

        localStorage.setItem(
          "imageDataUrls",
          JSON.stringify([...imageDataUrls, ...dataUrls])
        );
        localStorage.setItem(
          "tagInputs",
          JSON.stringify([...tagInputs, ...Array(dataUrls.length).fill("")])
        );
      });
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const fileReaders = acceptedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((dataUrls) => {
        setImageDataUrls((prevImageUrls) => [...prevImageUrls, ...dataUrls]);
        setTagInputs((prevTagInputs) => [
          ...prevTagInputs,
          ...Array(dataUrls.length).fill(""),
        ]);

        localStorage.setItem(
          "imageDataUrls",
          JSON.stringify([...imageDataUrls, ...dataUrls])
        );
        localStorage.setItem(
          "tagInputs",
          JSON.stringify([...tagInputs, ...Array(dataUrls.length).fill("")])
        );
      });
    },
    [imageDataUrls, tagInputs]
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
      const newImageDataUrls = [...imageDataUrls];
      const [draggedImageDataUrl] = newImageDataUrls.splice(
        draggedImageIndex,
        1
      );
      newImageDataUrls.splice(index, 0, draggedImageDataUrl);

      const newTagInputs = [...tagInputs];
      const [draggedTagInput] = newTagInputs.splice(draggedImageIndex, 1);
      newTagInputs.splice(index, 0, draggedTagInput);

      setImageDataUrls(newImageDataUrls);
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
    localStorage.setItem("tagInputs", JSON.stringify(createTagCopies));
  };

  const filteredImages = () => {
    return imageDataUrls
      .map((dataUrl, index) => ({
        dataUrl,
        tagInput: tagInputs[index] || "",
      }))
      .filter((image) => {
        return image.tagInput.toLowerCase().includes(searchState.toLowerCase());
      });
  };

  const notFound = filteredImages.length === 0 ? "Image not found" : null
  const filteredImagesList = filteredImages();

const handleSearch = (e) => {
  setSearchState(e.target.value)
}

  const handleDelete = (index) => {
    const newImageDataUrls = [...imageDataUrls];
    const newTagInputs = [...tagInputs];

    // Remove the item at the specified index
    newImageDataUrls.splice(index, 1);
    newTagInputs.splice(index, 1);

    // Update state
    setImageDataUrls(newImageDataUrls);
    setTagInputs(newTagInputs);
  };

  // Use useEffect to update local storage after state is updated
  useEffect(() => {
    localStorage.setItem("imageDataUrls", JSON.stringify(imageDataUrls));
    localStorage.setItem("tagInputs", JSON.stringify(tagInputs));
  }, [imageDataUrls, tagInputs]);


  return (
    <div>
      {loading ? (
        // Loading skeleton covering the whole page
        <div className="loading-skeleton">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="skeleton-item" />
          ))}
        </div>
      ) : (
        // Actual content when not loading
        <div className="image-wrapper">
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            {isDragActive ? (
              <p className="drag">Drop the files here ...</p>
            ) : (
              <p className="drag-and-drop">
                Drag & drop images here <span className="drag-span"> or {" "}
                <button onClick={handleClickFileInput} className="select-btn">
                  Click to select files
                </button></span>
              </p>
            )}
          </div>

          {/* Separate container for images */}
          <div className="image-container">
            {imageDataUrls.length > 0 && (
              <input
               onChange={handleSearch}
                type="text"
                placeholder="Search images"
                value={searchState}
                className="input"
              />
            )}
            <React.Fragment>
              {filteredImagesList.length > 0 ? (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="image-masonry-grid"
                  columnClassName="image-masonry-grid_column"
                >
                  {filteredImagesList.map((image, index) => (
                    <div key={index} className="image-input-div">
                      <img
                        src={image.dataUrl}
                        alt={`Dropped pic ${index}`}
                        draggable
                        onDragStart={() => handleImageDragStart(index)}
                        onDragOver={handleImageDragOver(index)}
                        onDragEnd={handleImageDragEnd}
                        className="image"
                      />
                      {searchState === "" ? (
                        <p className="trash-tag-div">
                          <input
                            type="text"
                            placeholder="Enter tag"
                            value={tagInputs[index] || ""}
                            onChange={(event) => handleTagChange(index, event)}
                            className="tag-input"
                          />
                          <FaTrash
                            onClick={() => handleDelete(index)}
                            className="trash"
                          />
                        </p>
                      ) : (
                        <p>{image.tagInput}</p>
                      )}
                    </div>
                  ))}
                </Masonry>
              ) : (
                <div>
                  {imageDataUrls.length === 0 ? (
                    // Display DummyImages when there are no images at all
                    <DummyImages />
                  ) : (
                    // Display notFound message when there are no filtered images
                    <p className="not-found">{notFound}</p>
                  )}
                </div>
              )}
            </React.Fragment>
          </div>

        </div>
      )}
    </div>
  );
};

export default DropImages;
