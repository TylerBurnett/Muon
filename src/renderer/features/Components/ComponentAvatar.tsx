import React from 'react';
import { Avatar, Badge, styled } from '@mui/material';
import { ComponentConfig } from '../../../main/Data/ComponentConfig';

interface ComponentAvatarProps {
  component: ComponentConfig;
  size: string;
}

const ComponentAvatar: React.FC<ComponentAvatarProps> = ({
  component,
  size,
}) => {
  const AvatarBadge = styled(Badge)(({ theme, color }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: color,
      color,
      height: '20%',
      width: '20%',
      borderRadius: '100%',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }));

  return (
    <AvatarBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
      color={component.active ? 'success' : 'error'}
    >
      <Avatar
        alt={component.name}
        src={component.iconData}
        sx={{ width: size, height: size }}
        style={{ fontSize: '160%' }}
      >
        {!component.iconData &&
          component.name
            .split(' ')
            .map((str: string) => str[0])
            .join('')}
      </Avatar>
    </AvatarBadge>
  );
};

export default ComponentAvatar;
