import React, { useState } from 'react';
import styles from '../styles/TecladoVirtual.module.css';

// Layout do teclado
const layout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '.'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'backspace'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '_', '-'],
  ['space']
];

export default function TecladoVirtual({ value, onChange, onClose }) {
  const [capsLock, setCapsLock] = useState(false);
  const [shift, setShift] = useState(false);

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
      setShift(false); // Desativa o shift após apagar
    } else if (key === 'caps') {
      setCapsLock(!capsLock);
      setShift(false);
    } else if (key === 'shift') {
      setShift(!shift);
    } else if (key === 'enter') {
      onClose(); // Fecha o teclado ao pressionar Enter
    } else if (key === 'space') {
      onChange(value + ' ');
      setShift(false);
    } else {
      const char = (capsLock || shift) ? key.toUpperCase() : key.toLowerCase();
      onChange(value + char);
      setShift(false); // Desativa o shift após pressionar uma tecla
    }
  };

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.keyboard}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.keyboardRow}>
            {row.map((key) => {
              const isSpecialKey = ['backspace', 'caps', 'shift', 'enter', 'space'].includes(key);
              let displayKey = key;
              if (key === 'backspace') displayKey = '⌫';
              if (key === 'caps') displayKey = capsLock ? 'CAPS' : 'caps';
              if (key === 'shift') displayKey = shift ? 'SHIFT' : 'shift';
              if (key === 'enter') displayKey = 'enter';
              if (key === 'space') displayKey = ' ';
              
              const char = (capsLock || shift) ? key.toUpperCase() : key.toLowerCase();

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`${styles.key} ${isSpecialKey ? styles.specialKey : ''} ${key === 'space' ? styles.spaceKey : ''} ${(capsLock && key === 'caps') || (shift && key === 'shift') ? styles.activeKey : ''}`}
                >
                  {isSpecialKey ? displayKey : char}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
