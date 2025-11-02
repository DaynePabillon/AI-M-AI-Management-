import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader } from 'lucide-react';
import googleCalendarService from '../services/googleCalendarSimple';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    loadGoogleEvents();
  }, []);

  const loadGoogleEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const googleEvents = await googleCalendarService.getUpcomingEvents(50); // Get more events to filter
      const currentYear = new Date().getFullYear();
      
      const formattedEvents = googleEvents
        .map(event => {
          const eventDate = new Date(event.start.dateTime || event.start.date);
          return {
            date: eventDate,
            dateStr: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            day: eventDate.getDate(),
            title: event.summary,
            color: '#667eea',
            link: event.htmlLink
          };
        })
        .filter(event => event.date.getFullYear() === currentYear) // Only show current year events
        .slice(0, 10); // Limit to 10 events
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(err.message);
      // Fallback to demo events
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Manage your schedule and upcoming events</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={loadGoogleEvents} disabled={loading}>
            {loading ? <Loader className="spinner" size={16} /> : <CalendarIcon size={16} />}
            {loading ? 'Syncing...' : 'Sync with Google Calendar'}
          </button>
          <button className="btn-primary">
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="calendar-month">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-btn" onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>

          {Array.from({ length: 42 }, (_, i) => {
            const day = i - firstDayOfMonth + 1;
            const isToday = day === today.getDate() && 
                           currentMonth === today.getMonth() && 
                           currentYear === today.getFullYear();
            
            // Get events for this day
            const dayEvents = events.filter(event => 
              event.day === day && 
              event.date.getMonth() === currentMonth && 
              event.date.getFullYear() === currentYear
            );
            
            return (
              <div 
                key={i} 
                className={`calendar-day ${day < 1 || day > daysInMonth ? 'inactive' : ''} ${isToday ? 'today' : ''}`}
              >
                {day > 0 && day <= daysInMonth && (
                  <>
                    <span className="day-number">{day}</span>
                    <div className="day-events">
                      {dayEvents.map((event, idx) => (
                        <div key={idx} className="day-event">
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="events-sidebar">
        <h3 className="sidebar-title">Upcoming Events {events.length > 0 && `(${events.length})`}</h3>
        {error && <div className="error-message">⚠️ {error}</div>}
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item" style={{ borderLeftColor: event.color }}>
              <div className="event-date">{event.dateStr}</div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
