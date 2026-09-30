import React, { createContext, useContext, useState, useEffect } from 'react';

interface RewardsContextType {
  points: number;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => boolean;
  targetPoints: number;
  tier: string;
  hasRedeemedFreeSoda: boolean;
  claimFreeSodaReward: () => boolean;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(120); // Starting default
  const [hasRedeemedFreeSoda, setHasRedeemedFreeSoda] = useState(false);
  const targetPoints = 180;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('daddy_soda_points');
      if (saved) {
        setPoints(parseInt(saved, 10));
      }
    } catch {
      // ignore
    }
  }, []);

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('daddy_soda_points', updated.toString());
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const redeemPoints = (amount: number) => {
    if (points >= amount) {
      setPoints((prev) => {
        const updated = prev - amount;
        try {
          localStorage.setItem('daddy_soda_points', updated.toString());
        } catch {
          // ignore
        }
        return updated;
      });
      return true;
    }
    return false;
  };

  const claimFreeSodaReward = () => {
    if (points >= targetPoints) {
      redeemPoints(targetPoints);
      setHasRedeemedFreeSoda(true);
      return true;
    }
    return false;
  };

  const getTier = () => {
    if (points >= 300) return 'Daddy VIP';
    if (points >= 100) return 'Fizz Fiend';
    return 'Soda Rookie';
  };

  return (
    <RewardsContext.Provider
      value={{
        points,
        addPoints,
        redeemPoints,
        targetPoints,
        tier: getTier(),
        hasRedeemedFreeSoda,
        claimFreeSodaReward,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within RewardsProvider');
  }
  return context;
}
