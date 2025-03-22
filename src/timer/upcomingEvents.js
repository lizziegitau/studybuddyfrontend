import '../App.css';
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import dayjs from 'dayjs';

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
});

const events = {
  "2025-03-14": ["Math Exam - 10 AM", "Group Study - 3 PM"],
  "2025-03-16": ["Project Deadline - 11:59 PM", "English Essay Due"],
  "2025-03-15": ["History Quiz - 9 AM", "Physics Lab - 2 PM"],
  "2025-03-17": ["Team Meeting - 10 AM", "Assignment Submission - 5 PM"],
  "2025-03-18": ["Chemistry Lab Report Due", "Art Project Presentation - 11 AM"],
  "2025-03-19": ["Internship Interview - 1 PM"],
  "2025-03-20": ["Hackathon Registration Deadline", "Group Study Session - 4 PM"]
};

// Function to get events for the next 3 days
const getUpcomingEvents = () => {
    const today = dayjs();
    let upcomingEvents = [];

    for (let i = 0; i < 3; i++) {
        const date = today.add(i, 'day').format("YYYY-MM-DD");
        if (events[date]) {
            upcomingEvents.push({ date: dayjs(date).format("MMM D"), events: events[date] });
        }
    }

    return upcomingEvents.length ? upcomingEvents : [{ date: "", events: ["No upcoming events!"] }];
};

function UpcomingEvents() {
    const upcomingEvents = getUpcomingEvents();

    return (
        <div>
            <StyledCard sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="#9381FF">
                        Upcoming Events
                    </Typography>
                    
                    {upcomingEvents.map((item, index) => (
                        <div key={index}>
                            {item.date && (
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {item.date}
                                </Typography>
                            )}
                            {item.events.map((event, idx) => (
                                <Typography key={idx} variant="body2" color="textSecondary">
                                    • {event}
                                </Typography>
                            ))}
                        </div>
                    ))}
                </CardContent>
            </StyledCard>
        </div>
    );
}

export default UpcomingEvents;
