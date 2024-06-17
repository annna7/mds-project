import { useCallback } from 'react';
import {useUserDetails} from "../contexts/UserDetailsContext";

export const useNotificationManager = () => {
    const { socket } = useUserDetails();

    const subscribe = useCallback((event, handler) => {
        socket?.on(event, handler);
    }, [socket]);

    const unsubscribe = useCallback((event, handler) => {
        socket?.off(event, handler);
    }, [socket]);

    return { subscribe, unsubscribe };
};
