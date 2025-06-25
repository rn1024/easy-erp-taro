import React from 'react';
import { View } from '@tarojs/components';

interface PlaceholderIconProps {
  size?: number;
  color?: string;
  name: string;
}

const PlaceholderIcon: React.FC<PlaceholderIconProps> = ({
  size = 24,
  color = '#666',
  name
}) => {
  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#fff',
    fontWeight: 'bold'
  };

  return (
    <View style={iconStyle}>
      {name.charAt(0).toUpperCase()}
    </View>
  );
};

export default PlaceholderIcon;
