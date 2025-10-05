import React from 'react';
import styles from '../styles/LoadingOverlay.module.css';

export default function LoadingOverlay({ isLoading }) {
    if (!isLoading) {
        return null;
    }

    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingText}>AGUARDE...</div>
        </div>
    );
}