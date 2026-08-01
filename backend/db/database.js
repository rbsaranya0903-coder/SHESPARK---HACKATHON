const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'brandpulse.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Projects
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            company_name TEXT,
            company_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Brand DNA
        db.run(`CREATE TABLE IF NOT EXISTS brand_dna (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            type TEXT,
            url TEXT,
            brand_name TEXT,
            colors TEXT,
            fonts TEXT,
            tone_descriptors TEXT,
            vocabulary_style TEXT,
            messaging_pillars TEXT,
            visual_style TEXT,
            raw_scraped_text TEXT,
            screenshot_path TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )`);
        
        // Image Evaluations
        db.run(`CREATE TABLE IF NOT EXISTS image_evaluations (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            original_image_path TEXT,
            corrected_image_path TEXT,
            extracted_colors TEXT,
            mood_description TEXT,
            fit_score INTEGER,
            reasoning TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )`);
        
        // Organization Profile (Onboarding)
        db.run(`CREATE TABLE IF NOT EXISTS organization_profile (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            company_name TEXT,
            industry TEXT,
            target_audience TEXT,
            social_links TEXT,
            competitors TEXT,
            onboarding_step INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.log('Error running sql ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    initDb,
    run,
    get,
    all
};
