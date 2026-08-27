import React from 'react';
import { Card as MuiCard, CardContent, CardHeader } from '@mui/material';
import { ICardProps } from './Card.types';

export const Card: React.FC<ICardProps> = ({ title, subtitle, action, children, ...rest }) => {
  return (
    <MuiCard {...rest}>
      {(title || action) && <CardHeader title={title} subheader={subtitle} action={action} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};
