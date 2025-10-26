// Service to track used puzzles and ensure variety
export class PuzzleTracker {
  private static usedPuzzleIds: Set<string> = new Set();
  private static maxUsedPuzzles = 20; // Reset after 20 puzzles to allow replay

  static markPuzzleAsUsed(puzzleId: string): void {
    this.usedPuzzleIds.add(puzzleId);
    
    // Reset if we've used too many puzzles
    if (this.usedPuzzleIds.size > this.maxUsedPuzzles) {
      console.log('🔄 Resetting used puzzles tracker');
      this.usedPuzzleIds.clear();
      this.usedPuzzleIds.add(puzzleId);
    }
  }

  static isPuzzleUsed(puzzleId: string): boolean {
    return this.usedPuzzleIds.has(puzzleId);
  }

  static getUnusedPuzzles<T extends { id: string }>(puzzles: T[]): T[] {
    const unused = puzzles.filter(puzzle => !this.isPuzzleUsed(puzzle.id));
    
    // If no unused puzzles, reset and return all
    if (unused.length === 0) {
      console.log('🔄 No unused puzzles, resetting tracker');
      this.usedPuzzleIds.clear();
      return puzzles;
    }
    
    return unused;
  }

  static reset(): void {
    this.usedPuzzleIds.clear();
    console.log('🔄 Puzzle tracker reset');
  }

  static getUsedCount(): number {
    return this.usedPuzzleIds.size;
  }
}
