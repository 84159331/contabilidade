import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePin } from '../contexts/PinContext';

export default function PinProtectedRoute({ children }: { children: React.ReactElement }) {
  const { hasPin, unlocked } = usePin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (unlocked) return;

    const next = encodeURIComponent(location.pathname + location.search);
    const setup = hasPin ? '' : '&setup=1';
    navigate(`/tesouraria/pin?next=${next}${setup}`, { replace: true });
  }, [unlocked, hasPin, navigate, location.pathname, location.search]);

  if (!unlocked) {
    return null;
  }

  return children;
}
