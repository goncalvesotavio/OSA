import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useIdleTimer = ({ mainTimeout, modalTimeout, redirectTo }) => {
    const navigate = useNavigate();
    const [isIdle, setIsIdle] = useState(false);
    const [countdown, setCountdown] = useState(modalTimeout / 1000);
    const mainTimerRef = useRef(null);
    const modalTimerRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const resetMainTimer = () => {
        if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
        if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        
        setIsIdle(false);
        setCountdown(modalTimeout / 1000);

        mainTimerRef.current = setTimeout(() => {
            setIsIdle(true);
        }, mainTimeout);
    };

    const stayActive = () => {
        resetMainTimer();
    };

    useEffect(() => {
        if (isIdle) {
            modalTimerRef.current = setTimeout(() => {
                navigate(redirectTo);
            }, modalTimeout);

            countdownIntervalRef.current = setInterval(() => {
                setCountdown(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }

        return () => {
            if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [isIdle, modalTimeout, navigate, redirectTo]);

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
        
        events.forEach(event => window.addEventListener(event, resetMainTimer));
        
        resetMainTimer();

        return () => {
            if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
            if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            events.forEach(event => window.removeEventListener(event, resetMainTimer));
        };
    }, [mainTimeout, navigate, redirectTo]);

    return { isIdle, stayActive, countdown };
};
