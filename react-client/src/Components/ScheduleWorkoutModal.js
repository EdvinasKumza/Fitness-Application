import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleWorkoutModal.css';
import axios from 'axios';

const ScheduleWorkoutModal = ({ workout, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const selectedDate = new Date(startDate);
            selectedDate.setHours(hours);
            selectedDate.setMinutes(minutes);
            selectedDate.setSeconds(0);

            const jwt_token = localStorage.getItem('jwtToken');
            await axios.post('http://localhost:5260/api/workouts/schedule', {
                workoutId: workout.id,
                scheduledDate: selectedDate,
                notes: ''
            }, {
                headers: { Authorization: `Bearer ${jwt_token}` }
            });
            onClose();
        } catch (error) {
            console.error("Error scheduling workout", error);
        }
    };

    const handleHoursChange = (e) => {
        const value = Math.max(0, Math.min(23, parseInt(e.target.value, 10)));
        setHours(value);
    };

    const handleMinutesChange = (e) => {
        const value = Math.max(0, Math.min(59, parseInt(e.target.value, 10)));
        setMinutes(value);
    };

    return (
        <div className="schedule-modal">
            <div className="schedule-modal-content">
                <span className="schedule-close-button" onClick={onClose}>&times;</span>
                <h2 className="schedule-modal-title">Schedule Workout</h2>
                <form onSubmit={handleSubmit}>
                    <div className="schedule-form-group">
                        <label className="schedule-label">Select Date:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            className="schedule-form-control"
                        />
                    </div>
                    <div className="schedule-form-group">
                        <label className="schedule-label">Select Time:</label>
                        <div className="schedule-time-picker">
                            <input
                                type="number"
                                value={hours}
                                onChange={handleHoursChange}
                                className="time-picker-input"
                                min="0"
                                max="23"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                value={minutes}
                                onChange={handleMinutesChange}
                                className="time-picker-input"
                                min="0"
                                max="59"
                            />
                        </div>
                    </div>
                    <button type="submit" className="schedule-submit-button">Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleWorkoutModal;
