import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ setOpenEventModal, setOpenDetailsModal, setNewEvent, events, setSelectedEvent }) => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatEvents = (rawEvents) => {
    return rawEvents.map(event => {
      // Parse date and time parts separately to avoid timezone issues
      const datePart = event.eventDate; // yyyy-mm-dd
      const startParts = event.startTime.split(':');
      const endParts = event.endTime.split(':');
      
      // Create date objects with the correct local time
      const startDate = new Date(datePart);
      startDate.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);
      
      const endDate = new Date(datePart);
      endDate.setHours(parseInt(endParts[0], 10), parseInt(endParts[1], 10), 0);
  
      return {
        ...event,
        title: event.eventTitle,
        start: startDate,
        end: endDate,
      };
    });
  };

  const handleNavigate = (action) => {
    let newDate = new Date(currentDate);
  
    if (action === "TODAY") {
      newDate = new Date();
    } else if (action === "NEXT") {
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (currentView === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else if (currentView === "day") {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (action === "PREV") {
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (currentView === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else if (currentView === "day") {
        newDate.setDate(newDate.getDate() - 1);
      }
    }
  
    setCurrentDate(newDate);
  };

  const handleViewChange = (event) => {
    setCurrentView(event.target.value);
  };

  const handleSelectSlot = ({ start, end }) => {
    // Format the dates for the input fields with local timezone
    const startLocal = new Date(start);
    const endLocal = new Date(end);
    
    // Format in YYYY-MM-DDTHH:MM format for datetime-local input
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setNewEvent({ 
      title: "", 
      start: formatDateForInput(startLocal),
      end: formatDateForInput(endLocal),
      category: "" 
    });
    
    setOpenEventModal(true);
  };

  const handleSelectEvent = (event) => {
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    // Set the selected event in the state
    setSelectedEvent(event);
    
    // Populate the form with the selected event's data
    setNewEvent({
      title: event.title || event.eventTitle,
      start: formatDateForInput(event.start),
      end: formatDateForInput(event.end),
      category: event.eventType || "",
      id: event.id // Include the event id for updating
    });
    
    // Open the modal
    setOpenDetailsModal(true);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || "#B8B8FF",
        borderRadius: "10px",
        padding: "6px",
        color: "#333",
        fontWeight: "bold",
      },
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center">
          <Button variant="contained" onClick={() => handleNavigate("TODAY")} sx={{ backgroundColor: "#9381FF" }}>
            Today
          </Button>
          <span className="text-lg text-primary font-semibold mx-2">
            {moment(currentDate).format("MMMM YYYY")}
          </span>
          <Button onClick={() => handleNavigate("PREV")}>
            <ChevronLeftIcon className="text-primary" />
          </Button>
          <Button onClick={() => handleNavigate("NEXT")}>
            <ChevronRightIcon className="text-primary" />
          </Button>
        </div>

        <div>
          <ToggleButtonGroup
            value={currentView}
            exclusive
            onChange={handleViewChange}
            sx={{
              borderRadius: "20px",
              padding: "4px",
              "& .MuiToggleButton-root": {
                backgroundColor: "#F8F7FF",
                margin: "2px",
                borderRadius: "20px",
                textTransform: "none",
                color: "#9381FF",
                fontWeight: "600",
                padding: "6px 16px",
                transition: "background 0.3s",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                backgroundColor: "#9381FF",
                color: "#FFFFFF",
              },
            }}
          >
            <ToggleButton value="month" >
              Month
            </ToggleButton>
            <ToggleButton value="week">
              Week
            </ToggleButton>
            <ToggleButton value="day">
              Day
            </ToggleButton>
          </ToggleButtonGroup>
          
        </div>
      </div>
      <div className="p-6 bg-accent rounded-lg shadow-md" >
          <Calendar
            toolbar={false}
            localizer={localizer}
            events={formatEvents(events)}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            views={["month", "week", "day"]}
            eventPropGetter={eventStyleGetter}
            style={{ height: "600px", borderRadius: "10px" }}
          />
        </div>
    </div>
  );
};

export default CalendarComponent;
