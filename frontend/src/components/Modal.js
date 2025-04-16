import React from 'react';
import './Modal.css'; // Importing CSS for styling

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
                <footer className="modal-footer">
                    <button className="modal-button" onClick={onClose}>Close</button>
                </footer>
            </div>
        </div>
    );
};

export default Modal;
