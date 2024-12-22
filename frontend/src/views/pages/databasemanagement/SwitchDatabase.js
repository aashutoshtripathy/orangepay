import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormCheck, CFormLabel, CButton } from '@coreui/react';
import io from 'socket.io-client';
import axios from 'axios';

// Initialize the socket connection outside the component to ensure it only happens once
const socket = io('http://localhost:8000', {
    transports: ['websocket', 'polling'], // Force WebSocket transport
});

const SwitchDatabase = () => {
    const [dbMode, setDbMode] = useState('online'); // Default to 'online'
    const [isSocketConnected, setIsSocketConnected] = useState(false); // Track socket connection status

    // Fetch the current database mode when the component loads
    useEffect(() => {
        // Listen for the initial connection to the socket
        socket.on('connect', () => {
            console.log('Connected to the socket server');
        });

        // Listen for dbMode updates from the server
        socket.on('dbModeUpdated', (mode) => {
            console.log('Received dbMode update from server:', mode);
            setDbMode(mode); // Update local state based on the received mode
        });

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off('dbModeUpdated'); // Clean up event listeners
        };
    }, []);

    // Function to handle the form submission and switch the database mode
    const handleUpdateDatabase = () => {
        const newMode = dbMode === 'online' ? 'offline' : 'online';
        axios.post('http://localhost:8000/update-db-mode', { mode: newMode })
            .then((response) => {
                console.log(response.data.message);
                setDbMode(newMode); // Optimistic UI update
            })
            .catch((error) => {
                console.error('Error updating database mode:', error);
            });
    };

    return (
        <CCard>
            <CCardHeader>Switch Database Mode</CCardHeader>
            <CCardBody>
                <CForm>
                    <CFormLabel>Current Database Mode:</CFormLabel>
                    <p>Status: {isSocketConnected ? 'Connected to Socket' : 'Not Connected to Socket'}</p>
                    {dbMode === 'online' && (
                        <div>
                            <CFormCheck
                                type="radio"
                                name="dbMode"
                                id="online"
                                value="online"
                                label="Online"
                                checked={true}
                                readOnly
                            />
                            <CButton color="danger" onClick={handleUpdateDatabase} className="mt-3">
                                Switch to Offline
                            </CButton>
                        </div>
                    )}
                    {dbMode === 'offline' && (
                        <div>
                            <CFormCheck
                                type="radio"
                                name="dbMode"
                                id="offline"
                                value="offline"
                                label="Offline"
                                checked={true}
                                readOnly
                            />
                            <CButton color="success" onClick={handleUpdateDatabase} className="mt-3">
                                Switch to Online
                            </CButton>
                        </div>
                    )}
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default SwitchDatabase;
