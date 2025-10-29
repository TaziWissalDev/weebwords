-- Comprehensive Anime Puzzle Game Database Schema

-- Users table with extended profile information
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    hearts INTEGER DEFAULT 3,
    max_hearts INTEGER DEFAULT 3,
    energy INTEGER DEFAULT 5,
    max_energy INTEGER DEFAULT 5,
    last_energy_reset DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    total_puzzles_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    favorite_anime TEXT,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User badges system
CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    anime TEXT NOT NULL,
    badge_level TEXT NOT NULL, -- bronze, silver, gold, platinum, master
    puzzles_solved INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, anime)
);

-- Daily challenges
CREATE TABLE daily_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
    challenge_data TEXT NOT NULL, -- JSON of the daily challenge
    total_participants INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily challenge scores
CREATE TABLE daily_challenge_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_date TEXT NOT NULL,
    score INTEGER NOT NULL,
    completion_time INTEGER NOT NULL, -- in seconds
    puzzles_completed INTEGER NOT NULL,
    hints_used INTEGER DEFAULT 0,
    rank_position INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, challenge_date)
);

-- Anime-specific leaderboards
CREATE TABLE anime_leaderboards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    anime TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    puzzles_solved INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    badge_level TEXT DEFAULT 'bronze',
    last_played DATETIME DEFAULT CURRENT_TIMESTAMP,
    rank_position INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, anime)
);

-- Global leaderboard (aggregated view)
CREATE TABLE global_leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_score INTEGER DEFAULT 0,
    total_puzzles INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    favorite_anime TEXT,
    total_badges INTEGER DEFAULT 0,
    rank_position INTEGER,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
);

-- Puzzle scores (detailed tracking)
CREATE TABLE puzzle_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    puzzle_id TEXT NOT NULL,
    puzzle_type TEXT NOT NULL, -- word-puzzle, character-guess
    anime TEXT NOT NULL,
    character TEXT,
    difficulty TEXT NOT NULL, -- easy, medium, hard
    score INTEGER NOT NULL,
    max_possible_score INTEGER NOT NULL,
    hints_used INTEGER DEFAULT 0,
    completion_time INTEGER, -- in seconds
    is_daily_challenge BOOLEAN DEFAULT FALSE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User achievements and milestones
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_type TEXT NOT NULL, -- first_puzzle, streak_5, perfect_score, etc.
    achievement_data TEXT, -- JSON with additional data
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Home page statistics cache
CREATE TABLE home_stats_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stat_type TEXT UNIQUE NOT NULL, -- daily_top_scorer, weekly_champion, etc.
    stat_data TEXT NOT NULL, -- JSON data
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_total_score ON users(total_score DESC);
CREATE INDEX idx_user_badges_user_anime ON user_badges(user_id, anime);
CREATE INDEX idx_user_badges_anime_level ON user_badges(anime, badge_level);
CREATE INDEX idx_daily_challenge_scores_date ON daily_challenge_scores(challenge_date);
CREATE INDEX idx_daily_challenge_scores_score ON daily_challenge_scores(challenge_date, score DESC);
CREATE INDEX idx_anime_leaderboards_anime ON anime_leaderboards(anime, average_score DESC);
CREATE INDEX idx_anime_leaderboards_user ON anime_leaderboards(user_id);
CREATE INDEX idx_global_leaderboard_score ON global_leaderboard(total_score DESC);
CREATE INDEX idx_puzzle_scores_user ON puzzle_scores(user_id);
CREATE INDEX idx_puzzle_scores_anime ON puzzle_scores(anime, score DESC);
CREATE INDEX idx_puzzle_scores_date ON puzzle_scores(date);
CREATE INDEX idx_puzzle_scores_daily ON puzzle_scores(is_daily_challenge, date);

-- Views for common queries
CREATE VIEW user_profile_view AS
SELECT 
    u.id,
    u.username,
    u.hearts,
    u.max_hearts,
    u.energy,
    u.max_energy,
    u.total_score,
    u.total_puzzles_solved,
    u.current_streak,
    u.best_streak,
    u.favorite_anime,
    u.level,
    u.experience,
    gl.rank_position as global_rank,
    COUNT(ub.id) as total_badges
FROM users u
LEFT JOIN global_leaderboard gl ON u.id = gl.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id;

CREATE VIEW daily_leaderboard_view AS
SELECT 
    u.username,
    dcs.score,
    dcs.completion_time,
    dcs.puzzles_completed,
    dcs.hints_used,
    dcs.rank_position,
    dcs.challenge_date
FROM daily_challenge_scores dcs
JOIN users u ON dcs.user_id = u.id
ORDER BY dcs.challenge_date DESC, dcs.score DESC;

CREATE VIEW anime_leaderboard_view AS
SELECT 
    u.username,
    al.anime,
    al.total_score,
    al.puzzles_solved,
    al.average_score,
    al.best_score,
    al.badge_level,
    al.rank_position
FROM anime_leaderboards al
JOIN users u ON al.user_id = u.id
ORDER BY al.anime, al.average_score DESC;
