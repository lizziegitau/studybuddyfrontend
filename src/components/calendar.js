import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { events as initialEvents } from "../eventData";
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (action) => {
    let newDate = new Date(currentDate);
    if (action === "TODAY") newDate = new Date();
    else if (action === "NEXT") newDate.setMonth(newDate.getMonth() + 1);
    else if (action === "PREV") newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleViewChange = (event) => {
    setCurrentView(event.target.value);
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { title, start, end }]);
    }
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
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            selectable
            onSelectSlot={handleSelectSlot}
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
