import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const projectEvents = response.data.map((project) => {
          const deadline = new Date(project.deadline);
          const isOverdue = deadline < new Date() && project.status !== 'Completed';

          return {
            id: project._id,
            title: project.name,
            start: project.deadline,
            allDay: true,
            backgroundColor: isOverdue
              ? '#ef4444'
              : project.status === 'Completed'
                ? '#10b981'
                : '#3b82f6',
            borderColor: isOverdue
              ? '#dc2626'
              : project.status === 'Completed'
                ? '#059669'
                : '#2563eb',
            extendedProps: {
              status: project.status,
              client: project.clientId?.name,
              isOverdue,
            },
          };
        });

        setEvents(projectEvents);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects for calendar');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading calendar...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Project Timeline</h1>
        <p className="text-gray-400 text-lg">Visualize deadlines and track delivery schedules.</p>
      </div>

      <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-2xl">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            eventContent={(eventInfo) => (
              <div className="px-2 py-1 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold shadow-sm">
                <div className="flex items-center gap-1.5">
                  {eventInfo.event.extendedProps.isOverdue && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                  {eventInfo.event.title}
                </div>
              </div>
            )}
            dayMaxEvents={true}
          />
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-400">Active Project</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">Overdue</span>
        </div>
      </div>

      <style>{`
        .fc {
          --fc-border-color: #1f2937;
          --fc-daygrid-event-dot-width: 8px;
          --fc-page-bg-color: #111827;
          --fc-neutral-bg-color: #111827;
          --fc-list-event-hover-bg-color: #1f2937;
          color: #f3f4f6;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 800;
        }
        .fc .fc-button-primary {
          background-color: #1f2937;
          border-color: #374151;
          font-weight: 600;
          text-transform: capitalize;
          border-radius: 12px;
        }
        .fc .fc-button-primary:hover {
          background-color: #374151;
        }
        .fc .fc-button-primary:disabled {
          background-color: #111827;
          opacity: 0.5;
        }
        .fc .fc-col-header-cell-cushion {
          padding: 12px 0;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
        }
        .fc .fc-daygrid-day-number {
          padding: 8px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }
        .fc .fc-day-today {
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
        .fc .fc-day-today .fc-daygrid-day-number {
          color: #3b82f6;
          font-weight: 800;
        }
        .fc-event {
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .fc-event:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

export default CalendarView;
