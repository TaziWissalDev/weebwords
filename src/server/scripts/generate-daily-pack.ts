#!/usr/bin/env node

import { DatabaseService } from '../services/database';
import { PackGenerator } from '../services/pack-generator';

async function generateDailyPack() {
  const db = new DatabaseService('./daily-packs.db');
  const generator = new PackGenerator();
  
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`Generating daily pack for ${today}...`);
  
  try {
    // Check if pack already exists
    const existingPack = db.getDailyPack(today);
    
    if (existingPack) {
      console.log(`Pack for ${today} already exists. Skipping generation.`);
      return;
    }
    
    // Generate new pack
    const pack = generator.generateDailyPack(today);
    
    // Save to database
    db.saveDailyPack(today, pack);
    
    console.log(`✅ Generated daily pack with ${pack.puzzles.length} puzzles:`);
    
    // Show summary
    const typeCounts = pack.puzzles.reduce((acc, puzzle) => {
      acc[puzzle.type] = (acc[puzzle.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} puzzles`);
    });
    
    console.log(`\nPack saved to database for date: ${today}`);
    
  } catch (error) {
    console.error('❌ Error generating daily pack:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateDailyPack();
}

export { generateDailyPack };
