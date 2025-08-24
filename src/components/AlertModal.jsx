import React from 'react';
import styles from '../styles/AlertModal.module.css';

export default function AlertModal({ isOpen, message, onClose }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.message}>{message}</p>
                <button className={styles.closeButton} onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}
