import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../utils/colors';
import { fontSizes, spacing } from '../utils/sizes';

const minutesToMillis = (min) => min * 1000 * 60
const formatTime = (time) => time < 10 ? `0${time}` : time

export const Countdown = ({
  isPaused,
  onProgress,
  minutes,
  onEnd,
}) => {
  const interval = React.useRef(null)
  const [milliseconds, setMilliseconds] = useState(minutesToMillis(minutes))
  
  const countDown = () => {
    setMilliseconds((time) => {
      if(time === 0) {
        clearInterval(interval.current);
        return time
      }
      const timeLeft = time - 1000
      return timeLeft
    })
  }
  
  useEffect(() => {
    setMilliseconds(minutesToMillis(minutes))
  }, [minutes])
  
  useEffect(() => {
    onProgress(milliseconds / minutesToMillis(minutes))
    if(milliseconds === 0) {
      onEnd();
    }
  },[milliseconds])

  useEffect(() => {
    if (isPaused) {
      if(interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current)
  }, [isPaused])



  const minute = Math.floor(milliseconds / 1000 / 60) % 60;
  const seconds = Math.floor(milliseconds / 1000) % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatTime(minute)}:{formatTime(seconds)}</Text>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {

  },
  text: {
    fontSize: fontSizes.xxxl,
    padding: spacing.lg,
    color: colors.white,
    backgroundColor: "rgba(94, 132, 226, 0.3)",
    textAlign: "center",
  },
});

export default Countdown