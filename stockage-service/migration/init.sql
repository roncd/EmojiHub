-- Table emojis
CREATE TABLE IF NOT EXISTS emojis (
    id SERIAL PRIMARY KEY, --id automatique
    emoji VARCHAR(10) NOT NULL,
    utilisateur VARCHAR(100), 
    message TEXT,
    created TIMESTAMP DEFAULT NOW()
);

-- Table statistiques utilisé par analyse-service
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY, --id automatique
    emoji VARCHAR(10) NOT NULL UNIQUE, -- unique pour ne pas avoir de dédoublement
    count INTEGER DEFAULT 0,
    score FLOAT DEFAULT 0,
    updated TIMESTAMP DEFAULT NOW()
);