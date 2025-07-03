import { useState, useEffect } from 'react';
import { getUserLoyaltyPoints, updateUserLoyaltyPoints } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export const useLoyaltyPoints = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPoints();
    }
  }, [user]);

  const loadPoints = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userPoints = await getUserLoyaltyPoints(user.firebaseUid);
      setPoints(userPoints);
    } catch (error) {
      console.error('Error loading loyalty points:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (pointsToAdd: number) => {
    if (!user) return;

    try {
      await updateUserLoyaltyPoints(user.firebaseUid, pointsToAdd);
      setPoints(prev => prev + pointsToAdd);
    } catch (error) {
      console.error('Error adding loyalty points:', error);
    }
  };

  const canRedeem = (requiredPoints: number) => {
    return points >= requiredPoints;
  };

  const redeemPoints = async (pointsToRedeem: number) => {
    if (!user || !canRedeem(pointsToRedeem)) return false;

    try {
      await updateUserLoyaltyPoints(user.firebaseUid, -pointsToRedeem);
      setPoints(prev => prev - pointsToRedeem);
      return true;
    } catch (error) {
      console.error('Error redeeming loyalty points:', error);
      return false;
    }
  };

  return {
    points,
    loading,
    addPoints,
    redeemPoints,
    canRedeem,
    refetch: loadPoints,
  };
};