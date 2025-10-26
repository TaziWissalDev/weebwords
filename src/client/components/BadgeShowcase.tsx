import React, { useState, useEffect } from 'react';
import { BadgeLevel } from '../../shared/types/leaderboard';
import { getBadgeInfo } from '../utils/badgeUtils';

interface BadgeShowcaseProps {
  username: string;
  className?: string;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ username, className = '' }) => {
  const [userBadges, setUserBadges] = useState<{ [anime: string]: BadgeLevel }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBadges();
  }, [username]);

  const fetchUserBadges = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.type === 'leaderboard') {
        setUserBadges(data.userBadges);
      }
    } catch (error) {
      console.error('Error fetching user badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const badgeEntries = Object.entries(userBadges);
  const totalBadges = badgeEntries.length;
  const masterBadges = badgeEntries.filter(([_, level]) => level === 'master').length;
  const platinumBadges = badgeEntries.filter(([_, level]) => level === 'platinum').length;

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="flex space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (totalBadges === 0) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <div className="text-2xl mb-2">🎌</div>
        <p className="text-sm">No badges earned yet</p>
        <p className="text-xs">Solve puzzles to earn anime badges!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Your Anime Badges ({totalBadges})
        </div>
        {masterBadges > 0 && (
          <div className="text-xs text-purple-600 font-medium">
            👑 {masterBadges} Legendary Master{masterBadges > 1 ? 's' : ''}
          </div>
        )}
        {platinumBadges > 0 && masterBadges === 0 && (
          <div className="text-xs text-blue-600 font-medium">
            💎 {platinumBadges} Platinum Master{platinumBadges > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-xs mx-auto">
        {badgeEntries.slice(0, 6).map(([anime, level]) => {
          const badgeInfo = getBadgeInfo(level);
          return (
            <div
              key={anime}
              className="flex flex-col items-center p-1.5 sm:p-2 bg-white rounded-lg border border-gray-200 shadow-sm min-w-[50px] sm:min-w-[60px]"
              title={`${anime} - ${badgeInfo.name}`}
            >
              <span className="text-base sm:text-lg mb-1">{badgeInfo.emoji}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">
                {anime.length > 6 ? anime.substring(0, 6) + '...' : anime}
              </span>
              <span className={`text-xs font-medium ${badgeInfo.color} hidden sm:block`}>
                {badgeInfo.name}
              </span>
            </div>
          );
        })}
        
        {totalBadges > 6 && (
          <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-gray-100 rounded-lg border border-gray-200 min-w-[50px] sm:min-w-[60px]">
            <span className="text-base sm:text-lg text-gray-500">+{totalBadges - 6}</span>
            <span className="text-xs text-gray-500">more</span>
          </div>
        )}
      </div>

      {totalBadges > 0 && (
        <div className="text-center mt-3">
          <div className="text-xs text-gray-500">
            Keep solving puzzles to earn higher badges! 🌟
          </div>
        </div>
      )}
    </div>
  );
};
