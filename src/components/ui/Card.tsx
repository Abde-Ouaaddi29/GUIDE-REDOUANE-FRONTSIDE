import React from 'react';

interface CardProps {
    title: string;
    content: string;
    imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, content, imageUrl }) => {
    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
            <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{content}</p>
            </div>
        </div>
    );
};

export default Card;