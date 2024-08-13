import { useContext, useEffect, useState } from 'react';
import { getEvents, joinEvent } from '../services/serviceWorkers';
import userContext from '../context/userContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        setMsg
    } = useContext(userContext);

    const fetchEvents = async () => {
        // Fetch events from your API
        getEvents()
            .then((response) => {
                setEvents(response.events);
                setLoading(false);
            })
            .catch((e) => {
                console.error('Error fetching events:', e.message);
                setError('Failed to fetch events');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="page events_page">
            {events.length === 0 ? (
                <p>No events available.</p>
            ) : (
                <div className='events'>
                    {events.map(event => (
                        <div key={event._id} className='event'>
                            <img src={event.imglink} alt={event.title} />
                            <h2>{event.title}</h2>
                            <p><b>Description: </b>{event.desc}</p>
                            <p><b>Organizer: </b> {event.organizer}</p>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Available slots:</strong> {event.count}</p>
                            {
                                (event.count == 0) ? 
                                <p className='close'>Event is full</p> : null
                            }
                            <button onClick={(e) => {
                                e.preventDefault();
                                joinEvent(event._id)
                                    .then((response) => {
                                        setMsg(response.message);
                                        fetchEvents();
                                    });
                            }}>Book a slot</button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Events;
