import React, { useState, useEffect } from 'react';
import api from '../api';

const Albums = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoId, setPhotoId] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('https://api.slingacademy.com/v1/sample-data/photos?offset=5&limit=20');
      const data = await response.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPhotos = photos.filter(photo =>
    photo.id.toString().includes(searchQuery) || photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdatePhoto = () => {
    const updatedPhotos = photos.map(photo => 
      photo.id === parseInt(photoId) ? { ...photo, title, description } : photo
    );
    setPhotos(updatedPhotos);
    setTitle('');
    setDescription('');
    setPhotoId('');
  };

  const handleDeletePhoto = (id) => {
    const remainingPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(remainingPhotos);
  };

  return (
    <div>
      <h2>Albums</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by ID or Title"
        className="form-control mb-3"
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={photoId}
          onChange={(e) => setPhotoId(e.target.value)}
          placeholder="Photo ID (for update)"
          className="form-control mb-2"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="form-control mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="form-control mb-2"
        />
        <button onClick={handleUpdatePhoto} className="btn btn-warning">Update Photo</button>
      </form>
      <ul className="list-group mt-3">
        {filteredPhotos.map(photo => (
          <li key={photo.id} className="list-group-item">
            <div>
              <img src={photo.url} alt={photo.title} className="img-fluid mb-2" />
              <h5>{photo.title}</h5>
              <p>{photo.description}</p>
              <small>ID: {photo.id}</small>
              <button onClick={() => handleDeletePhoto(photo.id)} className="btn btn-danger btn-sm mt-2">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Albums;
