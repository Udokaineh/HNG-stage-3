import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DummyImages from "./DummyImages";
import { FaTrash } from "react-icons/fa";

const DropImages = () => {
  const [imageDataUrls, setImageDataUrls] = useState([]);
  const [tagInputs, setTagInputs] = useState(() => {
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];
    return storedTagInputs;
  });
  const [searchState, setSearchState] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [imagesDropped, setImagesDropped] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const storedImageDataUrls =
      JSON.parse(localStorage.getItem("imageDataUrls")) || [];
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];

    setImageDataUrls(storedImageDataUrls);
    setTagInputs(storedTagInputs);
  }, []);

  // const inputRef = useRef(null);

  // const handleClickFileInput = () => {
  //   inputRef.current.click();
  // };

  // const handleFileInputChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);

  //   if (selectedFiles.length > 0) {
  //     const fileReaders = selectedFiles.map((file) => {
  //       const reader = new FileReader();
  //       return new Promise((resolve) => {
  //         reader.onload = (event) => {
  //           resolve(event.target.result);
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     });

  //     Promise.all(fileReaders).then((dataUrls) => {
  //       setImageDataUrls([...imageDataUrls, ...dataUrls]);

  //       const initialTagInputs = Array(dataUrls.length).fill("");
  //       setTagInputs([...tagInputs, ...initialTagInputs]);

  //       localStorage.setItem("imageDataUrls", JSON.stringify([...imageDataUrls, ...dataUrls]));
  //       localStorage.setItem("tagInputs", JSON.stringify([...tagInputs, ...initialTagInputs]));
  //     });
  //   }
  // };

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
        setImageDataUrls([...imageDataUrls, ...dataUrls]);

        const initialTagInputs = Array(dataUrls.length).fill("");
        setTagInputs([...tagInputs, ...initialTagInputs]);

        localStorage.setItem(
          "imageDataUrls",
          JSON.stringify([...imageDataUrls, ...dataUrls])
        );
        localStorage.setItem(
          "tagInputs",
          JSON.stringify([...tagInputs, ...initialTagInputs])
        );
      });
      setImagesDropped(true);
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

  const handleSearch = (e) => {
    setSearchState(e.target.value);
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

  const filteredImagesList = filteredImages();

  const handleDelete = (index) => {
    const newImageDataUrls = [...imageDataUrls];
    const newTagInputs = [...tagInputs];

    newImageDataUrls.splice(index, 1);
    newTagInputs.splice(index, 1);

    setImageDataUrls(newImageDataUrls);
    setTagInputs(newTagInputs);

    localStorage.setItem("imageDataUrls", JSON.stringify(newImageDataUrls));
    localStorage.setItem("tagInputs", JSON.stringify(newTagInputs));
  };

  return (
    <div className="drop-container">
      {/* <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleFileInputChange}
      /> */}
      {imagesDropped && (
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search images"
          value={searchState}
          className="input"
        />
      )}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {loading ? (
          <div className="loading-skeleton">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton-item" />
            ))}
          </div>
        ) : filteredImagesList.length === 0 ? (
          <DummyImages />
        ) : isDragActive ? (
          <p className="drag">Drop the files here ...</p>
        ) : (
          <div className="image-container">
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
                    <FaTrash onClick={handleDelete} className="trash" />
                  </p>
                ) : (
                  <p>{image.tagInput}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropImages;
