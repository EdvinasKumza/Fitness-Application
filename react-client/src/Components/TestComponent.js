import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestComponent() {
    const [testData, setTestData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5260/api/test');
                setTestData(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!testData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Data from backend: {testData.message}</p>
        </div>
    );
}

export default TestComponent;