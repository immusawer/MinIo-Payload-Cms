"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrivateImagesList.css';

interface PrivateImage {
  id: string;
  filename: string;
  description?: string;
  url?: string;
  presignedUrl?: string;
  updatedAt: string;
}

const PrivateImagesList: React.FC = () => {
  const [images, setImages] = useState<PrivateImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<PrivateImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || window.location.origin;
  const token = localStorage.getItem('payload-token');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${serverURL}/api/private-images`, {
          params: {
            page,
            limit: 12,
            ...(search && { where: { filename: { like: search } } }),
          },
          headers: {
            Authorization: `JWT ${token}`,
          },
        });

        setImages(response.data.docs);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchImages();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search, serverURL, token]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const openImageModal = (image: PrivateImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading images...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="private-images-container">
      <header className="header">
        <h1>Private Images</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      {isModalOpen && selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-viewer-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-controls">
              <button onClick={handleZoomOut} className="zoom-button" aria-label="Zoom Out">
                <span className="zoom-icon">−</span>
              </button>
              <button onClick={handleResetZoom} className="zoom-button" aria-label="Reset Zoom">
                <span className="zoom-icon">⟲</span>
              </button>
              <button onClick={handleZoomIn} className="zoom-button" aria-label="Zoom In">
                <span className="zoom-icon">+</span>
              </button>
              <button 
                onClick={closeImageModal} 
                className="close-button"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="image-container">
              <img
                src={selectedImage.presignedUrl || selectedImage.url}
                alt={selectedImage.filename}
                style={{ transform: `scale(${zoomLevel})` }}
                className="centered-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/fallback-image.jpg';
                }}
              />
            </div>
            <div className="image-info-panel">
              <h2>{selectedImage.filename}</h2>
              {selectedImage.description && (
                <p className="description">{selectedImage.description}</p>
              )}
              <div className="image-meta">
                <span>Last updated: {new Date(selectedImage.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No images found</p>
          {search && (
            <button onClick={() => setSearch('')} className="clear-search-button">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-wrapper" onClick={() => openImageModal(image)}>
                  {image.presignedUrl || image.url ? (
                    <img
                      src={image.presignedUrl || image.url}
                      alt={image.filename}
                      className="thumbnail"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/fallback-thumbnail.jpg';
                      }}
                    />
                  ) : (
                    <div className="thumbnail-placeholder">No Image</div>
                  )}
                </div>
                <div className="image-info">
                  <h3 title={image.filename}>{image.filename}</h3>
                  <button 
                    onClick={() => openImageModal(image)}
                    className="view-button"
                    aria-label={`View ${image.filename}`}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateImagesList;