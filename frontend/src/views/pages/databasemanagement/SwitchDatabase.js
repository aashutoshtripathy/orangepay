import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormCheck, CFormLabel, CButton } from '@coreui/react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000'); // Connect to the Socket.IO server

const SwitchDatabase = () => {
    const [dbMode, setDbMode] = useState('online'); // Default to 'online'

    // Fetch the current database mode when the component loads
    useEffect(() => {
        axios.get('http://localhost:8000/db-mode')
            .then((response) => {
                setDbMode(response.data.dbMode);
            })
            .catch((error) => {
                console.error('Error fetching database mode:', error);
            });

        // Listen for real-time updates
        socket.on('dbModeUpdated', (mode) => {
            console.log('Database mode updated:', mode);
            setDbMode(mode);
        });

        return () => {
            socket.off('dbModeUpdated'); // Cleanup the listener on component unmount
        };
    }, []);

    // Function to handle the form submission
    const handleUpdateDatabase = () => {
        const newMode = dbMode === 'online' ? 'offline' : 'online'; // Toggle mode
        axios.post('http://localhost:8000/update-db-mode', { mode: newMode })
            .then((response) => {
                console.log(response.data.message);
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
