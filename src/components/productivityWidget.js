import React, { useState } from 'react';
import { Box, Typography, Tooltip, Stack, Divider, IconButton, Avatar } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const getDayName = (date) => {
  return dayjs(date).format('ddd');
};

const isSameDayHelper = (date1, date2) => {
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

const allBadges = [
  {
    name: '🔥 3-Day Streak',
    description: 'Complete sessions 3 days in a row!',
    src: '/images/streakstarter.png',
    checkEarned: (sessions) => {
      const today = dayjs();

      const sessionsByDate = new Set();
      sessions.forEach(session => {
        const sessionDate = dayjs(session.sessionDate).format('YYYY-MM-DD');
        sessionsByDate.add(sessionDate);
      });

      for (let i = 0; i < 3; i++) {
        const checkDate = today.subtract(i, 'day').format('YYYY-MM-DD');
        if (!sessionsByDate.has(checkDate)) {
          return false;
        }
      }
      return true;
    }
  },
  {
    name: '💪 5-Session Slayer',
    description: 'Complete 5 sessions in a single day!',
    src: '/images/taskslayer.png',
    checkEarned: (sessions) => {

      const sessionsByDate = {};
      sessions.forEach(session => {
        const dateStr = dayjs(session.sessionDate).format('YYYY-MM-DD');
        sessionsByDate[dateStr] = (sessionsByDate[dateStr] || 0) + 1;
      });
      
      return Object.values(sessionsByDate).some(count => count >= 5);
    }
  },
  {
    name: '🌟 7-Day Goal Crusher',
    description: 'Hit your daily goal on 7 different days!',
    src: '/images/consistencymaster.png',
    checkEarned: (sessions, dailyGoal) => {
      if (!dailyGoal || dailyGoal <= 0) return false;

      const minutesByDate = {};
      sessions.forEach(session => {
        const dateStr = dayjs(session.sessionDate).format('YYYY-MM-DD');
        minutesByDate[dateStr] = (minutesByDate[dateStr] || 0) + session.sessionDuration;
      });

      const daysHitGoal = Object.values(minutesByDate).filter(minutes => minutes >= dailyGoal).length;
      return daysHitGoal >= 7;
    }
  },
  {
    name: '🌱 First Session',
    description: 'Complete your very first session!',
    src: '/images/firststep.png',
    checkEarned: (sessions) => sessions.length >= 1
  },
  {
    name: '📅 Weekend Warrior',
    description: 'Do sessions on both Saturday and Sunday!',
    src: '/images/weekendwarrior.png',
    checkEarned: (sessions) => {

      let hasSaturday = false;
      let hasSunday = false;
      
      sessions.forEach(session => {
        const dayOfWeek = dayjs(session.sessionDate).day();
        if (dayOfWeek === 6) hasSaturday = true;
        if (dayOfWeek === 0) hasSunday = true;
      });
      
      return hasSaturday && hasSunday;
    }
  }
];

const ProductivityWidget = ({ sessions, dailyGoal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const badges = allBadges.map(badge => ({
    ...badge,
    earned: badge.checkEarned(sessions, dailyGoal),
  }));

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? badges.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === badges.length - 1 ? 0 : prev + 1));
  };

  const currentBadge = badges[currentIndex];

  const today = dayjs();
  const daysToShow = [2, 1, 0].map(offset => today.subtract(offset, 'day'));

  const productivityScores = daysToShow.map(date => {
    const dateFormatted = formatDate(date);

    const dayTotalMinutes = sessions
      .filter(s => isSameDayHelper(s.sessionDate, date))
      .reduce((total, session) => total + session.sessionDuration, 0);

    const progress = dailyGoal > 0 ? Math.min((dayTotalMinutes / dailyGoal) * 100, 100) : 0;
    
    return {
      day: `${getDayName(date)} (${dateFormatted})`,
      score: Math.round(progress),
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#F8FAFB',
        borderRadius: 4,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        boxShadow: 3,
      }}
    >
      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>Badges</Typography>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
          <IconButton onClick={handlePrev}>
            <ArrowBackIos />
          </IconButton>

          <Tooltip title={currentBadge.name}>
            <Avatar
              src={currentBadge.src}
              alt={currentBadge.name}
              sx={{
                width: 100,
                height: 100,
                opacity: currentBadge.earned ? 1 : 0.3,
                border: currentBadge.earned ? '3px solid gold' : 'none',
                transition: 'opacity 0.3s, border 0.3s',
              }}
            />
          </Tooltip>

          <IconButton onClick={handleNext}>
            <ArrowForwardIos />
          </IconButton>
        </Stack>

        <Typography variant="body1" sx={{ mt: 1 }}>
          {currentBadge.name}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary', px: 2 }}>
          {currentBadge.description}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>3-Day Productivity</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {productivityScores.map((entry, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body1" fontWeight="medium">{entry.day}</Typography>
                <Typography variant="body2">{entry.score}%</Typography>
              </Box>
              <Box
                sx={{
                  height: 12,
                  bgcolor: '#E0E0E0',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${entry.score}%`,
                    height: '100%',
                    bgcolor: entry.score > 85 ? '#4CAF50' : entry.score > 70 ? '#FFC107' : '#FF5252',
                    transition: 'width 0.8s ease-in-out',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductivityWidget;
