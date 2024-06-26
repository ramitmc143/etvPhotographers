
import React, { useEffect, useState ,memo} from 'react';
import { View, Text } from 'react-native';

const Today_date_and_time = () => {
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const todayDate = new Date();
      const dd = String(todayDate.getDate()).padStart(2, '0');
      const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
      const yyyy = todayDate.getFullYear();
      const hours = String(todayDate.getHours()).padStart(2, '0');
      const minutes = String(todayDate.getMinutes()).padStart(2, '0');
      const seconds = String(todayDate.getSeconds()).padStart(2, '0');
      const formattedDate = `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}`;
      setTodayDate(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>
      Today - {todayDate}
    </Text>
  );
};

export default memo( Today_date_and_time);
