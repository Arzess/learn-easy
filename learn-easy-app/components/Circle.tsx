// Mit KI erstellt
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressCircleProps {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
}

export default function ProgressCircle({
  percentage = 0,
  radius = 16,
  strokeWidth = 3,
  color = '#000000',
}: ProgressCircleProps) {
  
  const viewSize = (radius + strokeWidth) * 2;
  const center = viewSize / 2;
  const circumference = 2 * Math.PI * radius;
  
  const strokeDashoffset = percentage === 0 
    ? circumference 
    : circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={viewSize} height={viewSize}>
        {/* BACKGROUND TRACK (The gray empty circle) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* FOREGROUND PROGRESS (The black line) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`} 
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});