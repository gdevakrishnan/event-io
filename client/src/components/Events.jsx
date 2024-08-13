import { useContext, useEffect, useState } from 'react';
import { getEvents, joinEvent } from '../services/serviceWorkers';
import userContext from '../context/userContext';
import jsPDF from 'jspdf';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        setMsg,
        userDetails
    } = useContext(userContext);

    const {
        uname
    } = userDetails;

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

    // Generate ticket slot in pdf
    const generateTicket = async (details) => {
        const doc = new jsPDF();

        doc.setFontSize(14);

        const text = `Slot Number: ${details.event.count}\n\nDear ${details.uname},\nThank you for booking with us! We are pleased to confirm your participation in the following event:\n\n\tEvent Title: ${details.event.title}\n\tEvent Description: ${details.event.desc}\n\tEvent ID: ${details.event._id}\n\tDate of the Event: ${details.event.date}\n\nWe look forward to seeing you there. If you have any questions or need further assistance, please don't hesitate to contact us.\n\nBest regards,\nThe Event Management Team, event-io.`;

        const margin = 20;
        const maxWidth = 180;

        doc.text(text, margin, margin, { maxWidth });
        doc.save('ticket.pdf');
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
                                        generateTicket({ uname, event });
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
