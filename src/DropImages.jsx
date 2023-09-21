import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

const DropImages = () => {
  const [imageDataUrls, setImageDataUrls] = useState([]);
  const [tagInputs, setTagInputs] = useState(() => {
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];
    return storedTagInputs;
  });
  const [searchState, setSearchState] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const storedImageDataUrls = JSON.parse(localStorage.getItem("imageDataUrls")) || [];
    const storedTagInputs = JSON.parse(localStorage.getItem("tagInputs")) || [];

    setImageDataUrls(storedImageDataUrls);
    setTagInputs(storedTagInputs);
  }, []);

  const inputRef = useRef(null);

  const handleClickFileInput = () => {
    inputRef.current.click();
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
        setImageDataUrls([...imageDataUrls, ...dataUrls]);

        const initialTagInputs = Array(dataUrls.length).fill("");
        setTagInputs([...tagInputs, ...initialTagInputs]);

        localStorage.setItem("imageDataUrls", JSON.stringify([...imageDataUrls, ...dataUrls]));
        localStorage.setItem("tagInputs", JSON.stringify([...tagInputs, ...initialTagInputs]));
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
        setImageDataUrls([...imageDataUrls, ...dataUrls]);

        const initialTagInputs = Array(dataUrls.length).fill("");
        setTagInputs([...tagInputs, ...initialTagInputs]);

        localStorage.setItem("imageDataUrls", JSON.stringify([...imageDataUrls, ...dataUrls]));
        localStorage.setItem("tagInputs", JSON.stringify([...tagInputs, ...initialTagInputs]));
      });
    },[imageDataUrls, tagInputs]);

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
      const [draggedImageDataUrl] = newImageDataUrls.splice(draggedImageIndex, 1);
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
    localStorage.setItem("tagInputs", JSON.stringify(createTagCopies))
  };

  const handleSearch = (e) => {
    setSearchState(e.target.value);
  };

  const filteredImages = () => {
    return imageDataUrls.map((dataUrl, index) => ({
      dataUrl,
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
                  src={image.dataUrl}
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
                ) : ( <p>{image.tagInput}</p>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropImages;
