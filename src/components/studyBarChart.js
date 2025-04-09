import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Stack, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { sessions } from "../sessionData";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

const getWeekRange = (startOfWeek) => {
  const endOfWeek = dayjs(startOfWeek).add(6, "day");
  return `${dayjs(startOfWeek).format("MMM D")} - ${endOfWeek.format("MMM D")}`;
};

const StudyBarChart = () => {

  const [currentWeek, setCurrentWeek] = useState(dayjs("2025-03-02"));

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = dayjs(session.sessionDate);
    return (
      sessionDate.isSameOrAfter((currentWeek), "day") &&
      sessionDate.isBefore(dayjs(currentWeek).add(7, "day"), "day")
    );
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekData = daysOfWeek.map((day, index) => {
    const date = dayjs(currentWeek).add(index, "day").format("YYYY-MM-DD");
    const totalHours =
      filteredSessions
        .filter((session) => session.sessionDate === date)
        .reduce((acc, session) => acc + session.sessionDuration / 60, 0) || 0;
    return { day, hours: totalHours };
  });

  const handleWeekChange = (direction) => {
    setCurrentWeek((prev) => prev.add(direction * 7, "day"));
  };

  return (
    <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Time Spent
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => handleWeekChange(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body1">{getWeekRange(currentWeek)}</Typography>
          <IconButton onClick={() => handleWeekChange(1)}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        <BarChart
            dataset={weekData}
            xAxis={[
            {
                scaleType: "band",
                dataKey: "day",
                label: "Days of the Week",
            },
            ]}
            yAxis={[
            {
                label: "Hours Studied",
            },
            ]}
            series={[{ dataKey: "hours", color: "#9381FF" }]}
            height={270}
        />
      </CardContent>
    </Card>
  );
};

export default StudyBarChart;
