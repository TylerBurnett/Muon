import React from 'react';
import { Avatar, Badge, createStyles, Theme, styled } from '@mui/material';
import { IComponentSettings } from '../../../Application/Component/IComponentSettings';

interface ComponentAvatarProps {
  component: IComponentSettings;
}

function ComponentAvatar({ component }: ComponentAvatarProps) {
  const ActiveComponentBadge = styled(Badge)(({ theme }) => ({
    badge: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
      },
    },
  }));

  const InactiveComponentBadge = styled(Badge)(({ theme }) => ({
    badge: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
      },
    },
  }));

  const ComponentBadge = component.active
    ? ActiveComponentBadge
    : InactiveComponentBadge;

  return (
    <ComponentBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
    >
      <Avatar alt={component.name} src={component.iconData}>
        {!component.iconData &&
          component.name
            .split(' ')
            .map((str: string[]) => str[0])
            .join('')}
      </Avatar>
    </ComponentBadge>
  );
}

export default ComponentAvatar;
