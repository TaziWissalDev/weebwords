-- Daily Anime Puzzle Pack Database Schema

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily packs
CREATE TABLE daily_packs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
    pack_data TEXT NOT NULL, -- JSON of the daily pack
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Puzzle templates for generation
CREATE TABLE puzzle_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    anime TEXT NOT NULL,
    character TEXT,
    content_hash TEXT UNIQUE NOT NULL, -- prevent duplicates
    data TEXT NOT NULL, -- JSON puzzle data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User scores
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    puzzle_id TEXT NOT NULL,
    puzzle_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    time_ms INTEGER NOT NULL,
    hints_used INTEGER NOT NULL,
    accuracy REAL NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, puzzle_id) -- prevent duplicate submissions
);

-- User streaks and stats
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    global_streak INTEGER DEFAULT 0,
    quote_fill_streak INTEGER DEFAULT 0,
    emoji_sensei_streak INTEGER DEFAULT 0,
    who_said_it_streak INTEGER DEFAULT 0,
    mood_match_streak INTEGER DEFAULT 0,
    who_am_i_streak INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    puzzles_completed INTEGER DEFAULT 0,
    last_play_date TEXT, -- YYYY-MM-DD
    badges TEXT DEFAULT '[]', -- JSON array of badge IDs
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_scores_user_type ON scores(user_id, puzzle_type);
CREATE INDEX idx_scores_date ON scores(date);
CREATE INDEX idx_scores_type_score ON scores(puzzle_type, score DESC);
CREATE INDEX idx_puzzle_templates_type ON puzzle_templates(type);
CREATE INDEX idx_puzzle_templates_hash ON puzzle_templates(content_hash);
