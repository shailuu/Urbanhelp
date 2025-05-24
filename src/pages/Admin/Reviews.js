import React, { useState, useEffect } from 'react';
import { getAllReviews, deleteReview } from '../../Services/api';
import DataTable from '../../Components/Admin/Datatable';
import "./Admin.css";
//import "./Users.css"; 

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'userId', title: 'User Email' },
    { key: 'serviceId', title: 'Service Title' },
    { key: 'rating', title: 'Rating' },
    { key: 'comment', title: 'Comment' },
    { key: 'createdAt', title: 'Date' },
  ];

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
        setReviews(reviews.filter((review) => review._id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setFormData({
      userId: review.userId?.email || '',
      serviceId: review.serviceId?.title || '',
      rating: review.rating || '',
      comment: review.comment || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (reviewId) => {
    alert("Editing reviews not yet supported.");
    setEditingReviewId(null);
  };

  const handleCancel = () => {
    setEditingReviewId(null);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reviews</h1>
      </div>
      <DataTable
        columns={columns}
        data={reviews}
        renderCell={(column, review) => {
          const isEditing = editingReviewId === review._id;

          if (!isEditing) {
            if (column.key === 'userId') {
              return <span>{review.userId?.email || 'Unknown User'}</span>;
            } else if (column.key === 'serviceId') {
              return <span>{review.serviceId?.title || 'Unknown Service'}</span>;
            } else {
              return review[column.key];
            }
          }

          return (
            <input
              type="text"
              name={column.key}
              value={formData[column.key] || ''}
              onChange={handleChange}
              className="form-control inline-edit-input"
            />
          );
        }}
        renderActions={(review) => {
          const isEditing = editingReviewId === review._id;
          return isEditing ? (
            <>
              <button onClick={() => handleSave(review._id)} className="btn btn-primary btn-sm">Save</button>
              <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
            </>
          ) : (
            <>
              {/* <button onClick={() => handleEdit(review)} className="btn btn-warning btn-sm">Edit</button> */}
              <button onClick={() => handleDelete(review._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
            </>
          );
        }}
      />
    </div>
  );
};

export default Reviews;