import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="d-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className="me-1">
          <input
            type="radio"
            name="rating"
            value={star}
            style={{ display: 'none' }}
            onClick={() => !readOnly && setRating(star)}
          />
          <FaStar
            className="star"
            size={24}
            color={star <= (hover || rating) ? 'var(--accent-color)' : '#444'}
            style={{ 
                cursor: readOnly ? 'default' : 'pointer',
                transition: 'color 200ms' 
            }}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
          />
        </label>
      ))}
    </div>
  );
};

export default RatingStars;
