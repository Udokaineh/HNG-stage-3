import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const dummy = [
    {
        id: "0",
        Name: "Crystal",
        picture:
            "https://i.pinimg.com/236x/c6/18/dc/c618dca29dba0ecf1bea1857534494b6.jpg",
    },
    {
        id: "1",
        Name: "Blue Ivy",
        picture:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAKp_DDoC0UdZ90atPcM_XG8-XUlXdx9S5zuP50A_DWp3VW1_S",
    },
    {
        id: "2",
        Name: "Green Shoe",
        picture:
            "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYgCU_2DRuwCgImodfJ2VU47ez-ZeHLc1niguywFlBahnrjRG7",
    },
    {
        id: "3",
        Name: "Crop Top",
        picture:
            "https://i.pinimg.com/564x/97/1e/d1/971ed1e7fb8ad46843c1a1ee1e7795d4.jpg",
    },
    {
        id: "4",
        Name: "Brown Nails",
        picture:
            "https://i.pinimg.com/564x/8d/ed/74/8ded74a48afbc8504fd88f1c70ba386d.jpg",
    },
    {
        id: "5",
        Name: "Chunky Knit Hood",
        picture:
            "https://i.pinimg.com/564x/f2/f8/52/f2f852d1c19eaf7db666882387b7def2.jpg",
    },
];

const DummyImages = () => {
    const [updatedImages, setUpdatedImages] = useState([...dummy]);
    const [draggedImageIndex, setDraggedImageIndex] = useState(null);
    const [filteredList, setFilteredList] = useState("")

    const { getRootProps, getInputProps } = useDropzone({
        noClick: true,
    });

    // functions that let you rearrange images dragged and dropped
    const handleImageDragStart = (index) => {
        setDraggedImageIndex(index);
    };

    const handleImageDragOver = (index) => (e) => {
        e.preventDefault();
        if (draggedImageIndex !== null && draggedImageIndex !== index) {
            const newImage = [...updatedImages];
            const [draggedImages] = newImage.splice(draggedImageIndex, 1);
            newImage.splice(index, 0, draggedImages);

            setUpdatedImages(newImage);
            setDraggedImageIndex(index);
        }
    };

    const handleImageDragEnd = () => {
        setDraggedImageIndex(null);
    };
    

    const renderImages = updatedImages.map((item, index) => {
        return (
            <div className="dummy-image-container">
                <div key={item.id} className="dummy-image-input-div">
                    <img
                        src={item.picture}
                        alt={item.Name}
                        draggable
                        onDragStart={() => handleImageDragStart(index)}
                        onDragOver={handleImageDragOver(index)}
                        onDragEnd={handleImageDragEnd}
                        className="dumm-image"
                    />
                    <p className="tag-input">{item.Name}</p>
                </div>
            </div>
        );
    });

    const filteredImages = renderImages.filter((image, index) => {
        return (
          updatedImages[index].Name.toLowerCase().includes(filteredList.toLowerCase())
        );
      });
    
      return (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <input
            type="text"
            placeholder="Search dummy images..."
            value={filteredList}
            onChange={(event) => setFilteredList(event.target.value)} 
            className="dummy-input"
          />
          <div className="dummy-image">
            {/* Render the filtered images */}
            {filteredImages.length > 0 ? filteredImages : renderImages}
          </div>
        </div>
      );
    };
    

export default DummyImages;
