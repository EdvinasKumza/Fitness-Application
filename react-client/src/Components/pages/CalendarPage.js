import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import HeaderComponent from '../HeaderComponent';
import './CalendarPage.css';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchScheduledWorkouts();
    }, []);

    const fetchScheduledWorkouts = async () => {
        try {
            const jwt_token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:5260/api/workouts/schedule', {
                headers: { Authorization: `Bearer ${jwt_token}` }
            });

            const events = response.data.map(event => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                extendedProps: {
                    duration: event.duration // Ensure this is passed correctly
                },
                notes: event.notes,
            }));

            setEvents(events);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the workout '${clickInfo.event.title}' scheduled on ${clickInfo.event.start.toLocaleString()}?`)) {
            try {
                const jwt_token = localStorage.getItem('jwtToken');
                await axios.delete(`http://localhost:5260/api/workouts/schedule/${clickInfo.event.id}`, {
                    headers: { Authorization: `Bearer ${jwt_token}` }
                });
                clickInfo.event.remove();
            } catch (error) {
                console.error("Error removing event", error);
                console.log(error.response.data);
            }
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const renderEventContent = (eventInfo) => {
        const eventDate = new Date(eventInfo.event.start);
        let time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if (time === '24:00') {
            time = '00:00';
        }
        const duration = eventInfo.event.extendedProps.duration || 0;
        const durationText = `Duration: ${duration}m`;
        const title = eventInfo.event.title;

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>{time}</span>
                <span>{title}</span>
                <span style={{ fontSize: 'small' }}>{durationText}</span>
            </div>
        );
    };

    const formattedDuration = formatDuration(events.length > 0 ? events[0].extendedProps.duration : 0);
    return (
        <div>
            <HeaderComponent />
            <div className="calendar-page">
                <h1>Scheduled Workouts</h1>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    height="auto"
                    defaultTimedEventDuration={formattedDuration}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
