import { forwardRef } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';

export const Link = forwardRef(function Link({ to, ...props }, ref) {
  const { path } = useI18n();
  return <RouterLink ref={ref} to={path(to)} {...props} />;
});

export const NavLink = forwardRef(function NavLink({ to, ...props }, ref) {
  const { path } = useI18n();
  return <RouterNavLink ref={ref} to={path(to)} {...props} />;
});
