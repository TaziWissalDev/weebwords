import React, { useState } from 'react';
import { GamePuzzle, PuzzleChallenge } from '../../shared/types/puzzle';
import { MockDataService } from '../services/mockData';
import { useSound } from '../hooks/useSound';
import { getQuestionsForChallenge, getAvailableAnimes, getQuestionCount } from '../data/challengeQuestions';

interface CustomQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isValidated?: boolean;
  validationError?: string;
}

interface ChallengeCreatorProps {
  onChallengeCreated: (challenge: PuzzleChallenge) => void;
  onClose: () => void;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({
  onChallengeCreated,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAnime, setSelectedAnime] = useState('Mixed');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default
  const [puzzleCount, setPuzzleCount] = useState(8);
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [challengeType, setChallengeType] = useState<'auto' | 'custom' | 'multi-question'>('auto');
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<CustomQuestion>({
    id: '',
    question: '',
    correctAnswer: '',
    wrongAnswers: ['', '', ''],
    anime: '',
    difficulty: 'medium',
    isValidated: false
  });
  const [isValidating, setIsValidating] = useState(false);
  const [multiQuestionTitle, setMultiQuestionTitle] = useState('');
  const [multiQuestionTimeLimit, setMultiQuestionTimeLimit] = useState(30); // seconds per question
  
  const { sounds } = useSound();

  const animeOptions = [
    'Mixed', 'Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 
    'Jujutsu Kaisen', 'My Hero Academia', 'Death Note', 'Dragon Ball'
  ];

  const validateQuestion = async (question: CustomQuestion) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/challenges/validate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          correctAnswer: question.correctAnswer,
          wrongAnswers: question.wrongAnswers,
          anime: question.anime
        }),
      });

      const result = await response.json();
      
      if (result.isValid) {
        sounds.success();
        return { isValid: true, error: null };
      } else {
        sounds.wrong();
        return { isValid: false, error: result.error || 'Question validation failed' };
      }
    } catch (error) {
      console.error('Error validating question:', error);
      sounds.wrong();
      return { isValid: false, error: 'Failed to validate question. Please try again.' };
    } finally {
      setIsValidating(false);
    }
  };

  const addCustomQuestion = async () => {
    // Validate required fields
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question!');
      return;
    }
    if (!currentQuestion.correctAnswer.trim()) {
      alert('Please enter the correct answer!');
      return;
    }
    if (currentQuestion.wrongAnswers.some(answer => !answer.trim())) {
      alert('Please fill in all wrong answers!');
      return;
    }
    if (!currentQuestion.anime.trim()) {
      alert('Please specify which anime this question is about!');
      return;
    }

    // Validate with AI
    const validation = await validateQuestion(currentQuestion);
    
    if (!validation.isValid) {
      alert(`Question validation failed: ${validation.error}`);
      return;
    }

    // Add question to list
    const newQuestion: CustomQuestion = {
      ...currentQuestion,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      isValidated: true
    };

    setCustomQuestions(prev => [...prev, newQuestion]);
    
    // Reset form
    setCurrentQuestion({
      id: '',
      question: '',
      correctAnswer: '',
      wrongAnswers: ['', '', ''],
      anime: '',
      difficulty: 'medium',
      isValidated: false
    });

    sounds.success();
  };

  const removeCustomQuestion = (questionId: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
    sounds.click();
  };

  const handleCreateChallenge = async () => {
    if (!title.trim()) {
      alert('Please enter a challenge title!');
      return;
    }

    // Check if we have questions available for the selected anime/difficulty
    const availableQuestions = getQuestionCount(selectedAnime, difficulty as 'easy' | 'medium' | 'hard');
    if (availableQuestions === 0) {
      alert(`No questions available for ${selectedAnime} ${difficulty} difficulty. Please choose a different combination.`);
      return;
    }

    if (challengeType === 'multi-question' && !multiQuestionTitle.trim()) {
      alert('Please enter a title for your multi-question puzzle!');
      return;
    }

    setIsCreating(true);

    try {
      // Generate puzzles for the challenge
      const puzzles: GamePuzzle[] = [];
      
      if (challengeType === 'auto') {
        // Auto-generate puzzles using our question database - use multi-question format
        // Leave puzzles array empty for auto challenges, use multiQuestionPuzzles instead
      } else if (challengeType === 'custom') {
        // Use custom questions as separate puzzles
        customQuestions.forEach(question => {
          const customPuzzle: GamePuzzle = {
            type: 'custom-question',
            customQuestion: {
              id: question.id,
              question: question.question,
              correctAnswer: question.correctAnswer,
              options: [question.correctAnswer, ...question.wrongAnswers].sort(() => Math.random() - 0.5),
              anime: question.anime,
              difficulty: question.difficulty,
              hints: {
                hint1: `This question is about ${question.anime}`,
                hint2: 'Think about the characters and story elements',
                hint3: 'Consider the specific details mentioned in the question'
              }
            }
          };
          puzzles.push(customPuzzle);
        });
      }

      // Handle multi-question puzzles
      let multiQuestionPuzzles: any[] = [];
      if (challengeType === 'multi-question' || challengeType === 'auto') {
        // Auto-generate questions for multi-question puzzle
        const questionsToGenerate = Math.min(8, getQuestionCount(selectedAnime, difficulty as 'easy' | 'medium' | 'hard'));
        const questions = getQuestionsForChallenge(selectedAnime, difficulty as 'easy' | 'medium' | 'hard', questionsToGenerate);
        
        const multiQuestionPuzzle = {
          id: `multi_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          title: challengeType === 'multi-question' 
            ? (multiQuestionTitle.trim() || `${selectedAnime} ${difficulty.toUpperCase()} Challenge`)
            : `${selectedAnime} ${difficulty.toUpperCase()} Challenge`,
          questions: questions.map(question => ({
            id: question.id,
            question: question.question,
            correctAnswer: question.correctAnswer,
            options: [question.correctAnswer, ...question.wrongAnswers].sort(() => Math.random() - 0.5),
            anime: question.anime,
            difficulty: question.difficulty,
            hints: question.hints
          })),
          timeLimit: multiQuestionTimeLimit,
          anime: selectedAnime,
          difficulty,
          totalScore: questions.length * 100 // 100 points per question
        };
        multiQuestionPuzzles.push(multiQuestionPuzzle);
      }

      // Create challenge object
      const challenge: PuzzleChallenge = {
        id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdBy: 'current_user', // This would come from context
        createdAt: new Date().toISOString(),
        title: title.trim(),
        description: description.trim() || `A ${difficulty} challenge featuring ${selectedAnime} puzzles!`,
        puzzles,
        multiQuestionPuzzles: multiQuestionPuzzles.length > 0 ? multiQuestionPuzzles : undefined,
        timeLimit,
        difficulty,
        anime: selectedAnime,
        isPublic,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
        completions: [],
        maxAttempts: 3
      };

      // Debug logging
      console.log('🎯 Creating challenge:', {
        challengeType,
        puzzlesCount: puzzles.length,
        multiQuestionPuzzlesCount: multiQuestionPuzzles.length,
        challenge
      });

      // Submit to server
      const response = await fetch('/api/challenges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challenge),
      });

      if (response.ok) {
        const result = await response.json();
        onChallengeCreated(result.challenge);
      } else {
        throw new Error('Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again!');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="cyberpunk-bg w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg relative">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200"
        >
          <span className="text-white text-xl font-bold">×</span>
        </button>

        <div className="relative z-10 p-6">
          <div className="text-center mb-6">
            <h1 className="anime-title text-3xl mb-2">CREATE CHALLENGE</h1>
            <p className="anime-text-neon text-sm">Design your own puzzle challenge to share with friends!</p>
          </div>

          <div className="space-y-6">
            {/* Challenge Title */}
            <div className="neon-card p-4">
              <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                CHALLENGE TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an epic challenge name..."
                className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div className="neon-card p-4">
              <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your challenge..."
                className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            {/* Challenge Type Selection */}
            <div className="neon-card p-4">
              <label className="anime-text-pixel text-cyan-400 text-sm mb-3 block">
                CHALLENGE TYPE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    sounds.click();
                    setChallengeType('auto');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    challengeType === 'auto'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">🎲</div>
                  <div className="anime-text-pixel text-sm">AUTO-GENERATED</div>
                  <div className="text-xs text-gray-400 mt-1">Use existing puzzles</div>
                </button>
                
                <button
                  onClick={() => {
                    sounds.click();
                    setChallengeType('custom');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    challengeType === 'custom'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">✍️</div>
                  <div className="anime-text-pixel text-sm">CUSTOM QUESTIONS</div>
                  <div className="text-xs text-gray-400 mt-1">Write your own</div>
                </button>

                <button
                  onClick={() => {
                    sounds.click();
                    setChallengeType('multi-question');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    challengeType === 'multi-question'
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">📝</div>
                  <div className="anime-text-pixel text-sm">MULTI-QUESTION</div>
                  <div className="text-xs text-gray-400 mt-1">Multiple questions in one puzzle</div>
                </button>
              </div>
            </div>

            {/* Custom Questions Section */}
            {challengeType === 'custom' && (
              <div className="neon-card p-4">
                <h3 className="anime-text-pixel text-purple-400 text-lg mb-4">✍️ CREATE CUSTOM QUESTIONS</h3>
                
                {/* Current Question Form */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="anime-text-pixel text-white text-sm mb-3">ADD NEW QUESTION</h4>
                  
                  {/* Question Input */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-cyan-400 text-xs mb-2 block">
                      QUESTION *
                    </label>
                    <textarea
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What is the name of Naruto's signature jutsu?"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                      rows={2}
                      maxLength={200}
                    />
                  </div>

                  {/* Correct Answer */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-green-400 text-xs mb-2 block">
                      CORRECT ANSWER *
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      placeholder="Shadow Clone Jutsu"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                      maxLength={100}
                    />
                  </div>

                  {/* Wrong Answers */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-red-400 text-xs mb-2 block">
                      WRONG ANSWERS * (3 required)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {currentQuestion.wrongAnswers.map((answer, index) => (
                        <input
                          key={index}
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const newWrongAnswers = [...currentQuestion.wrongAnswers];
                            newWrongAnswers[index] = e.target.value;
                            setCurrentQuestion(prev => ({ ...prev, wrongAnswers: newWrongAnswers }));
                          }}
                          placeholder={`Wrong answer ${index + 1}`}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-red-400 focus:outline-none"
                          maxLength={100}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question Settings */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="anime-text-pixel text-yellow-400 text-xs mb-2 block">
                        ANIME SERIES *
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.anime}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, anime: e.target.value }))}
                        placeholder="Naruto"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-yellow-400 focus:outline-none"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="anime-text-pixel text-purple-400 text-xs mb-2 block">
                        DIFFICULTY
                      </label>
                      <select
                        value={currentQuestion.difficulty}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-purple-400 focus:outline-none"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Question Button */}
                  <div className="text-center">
                    <button
                      onClick={addCustomQuestion}
                      disabled={isValidating}
                      className="pixel-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)'
                      }}
                    >
                      {isValidating ? (
                        <span className="flex items-center space-x-2">
                          <div className="anime-loading w-4 h-4"></div>
                          <span>🤖 AI VALIDATING...</span>
                        </span>
                      ) : (
                        '✅ ADD QUESTION'
                      )}
                    </button>
                  </div>
                </div>

                {/* Added Questions List */}
                {customQuestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="anime-text-pixel text-white text-sm mb-3">
                      📝 ADDED QUESTIONS ({customQuestions.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {customQuestions.map((question, index) => (
                        <div key={question.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-white text-sm font-bold mb-1">
                                Q{index + 1}: {question.question}
                              </div>
                              <div className="text-green-400 text-xs mb-1">
                                ✅ {question.correctAnswer}
                              </div>
                              <div className="text-red-400 text-xs">
                                ❌ {question.wrongAnswers.join(', ')}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCustomQuestion(question.id)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-2"
                              title="Remove question"
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="anime-text-pixel text-yellow-400">
                              📺 {question.anime}
                            </span>
                            <span className={`anime-text-pixel ${
                              question.difficulty === 'easy' ? 'text-green-400' :
                              question.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              ⚡ {question.difficulty.toUpperCase()}
                            </span>
                            {question.isValidated && (
                              <span className="text-green-400">✅ AI Validated</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Multi-Question Section */}
            {challengeType === 'multi-question' && (
              <div className="neon-card p-4">
                <h3 className="anime-text-pixel text-green-400 text-lg mb-4">📝 CREATE MULTI-QUESTION PUZZLE</h3>
                
                {/* Multi-Question Settings */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="anime-text-pixel text-white text-sm mb-3">PUZZLE SETTINGS</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="anime-text-pixel text-cyan-400 text-xs mb-2 block">
                        PUZZLE TITLE *
                      </label>
                      <input
                        type="text"
                        value={multiQuestionTitle}
                        onChange={(e) => setMultiQuestionTitle(e.target.value)}
                        placeholder="Ultimate Naruto Knowledge Test"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-cyan-400 focus:outline-none"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="anime-text-pixel text-yellow-400 text-xs mb-2 block">
                        TIME PER QUESTION (SECONDS)
                      </label>
                      <input
                        type="number"
                        value={multiQuestionTimeLimit}
                        onChange={(e) => setMultiQuestionTimeLimit(Math.max(10, Math.min(120, parseInt(e.target.value) || 30)))}
                        min="10"
                        max="120"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Question Form - Same as custom questions */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="anime-text-pixel text-white text-sm mb-3">ADD QUESTIONS TO PUZZLE</h4>
                  
                  {/* Question Input */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-cyan-400 text-xs mb-2 block">
                      QUESTION *
                    </label>
                    <textarea
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What is the name of Naruto's signature jutsu?"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                      rows={2}
                      maxLength={200}
                    />
                  </div>

                  {/* Correct Answer */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-green-400 text-xs mb-2 block">
                      CORRECT ANSWER *
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      placeholder="Shadow Clone Jutsu"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                      maxLength={100}
                    />
                  </div>

                  {/* Wrong Answers */}
                  <div className="mb-4">
                    <label className="anime-text-pixel text-red-400 text-xs mb-2 block">
                      WRONG ANSWERS * (3 required)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {currentQuestion.wrongAnswers.map((answer, index) => (
                        <input
                          key={index}
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const newWrongAnswers = [...currentQuestion.wrongAnswers];
                            newWrongAnswers[index] = e.target.value;
                            setCurrentQuestion(prev => ({ ...prev, wrongAnswers: newWrongAnswers }));
                          }}
                          placeholder={`Wrong answer ${index + 1}`}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-red-400 focus:outline-none"
                          maxLength={100}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question Settings */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="anime-text-pixel text-yellow-400 text-xs mb-2 block">
                        ANIME SERIES *
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.anime}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, anime: e.target.value }))}
                        placeholder="Naruto"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-yellow-400 focus:outline-none"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="anime-text-pixel text-purple-400 text-xs mb-2 block">
                        DIFFICULTY
                      </label>
                      <select
                        value={currentQuestion.difficulty}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-purple-400 focus:outline-none"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Question Button */}
                  <div className="text-center">
                    <button
                      onClick={addCustomQuestion}
                      disabled={isValidating}
                      className="pixel-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)'
                      }}
                    >
                      {isValidating ? (
                        <span className="flex items-center space-x-2">
                          <div className="anime-loading w-4 h-4"></div>
                          <span>🤖 AI VALIDATING...</span>
                        </span>
                      ) : (
                        '✅ ADD TO PUZZLE'
                      )}
                    </button>
                  </div>
                </div>

                {/* Added Questions List */}
                {customQuestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="anime-text-pixel text-white text-sm mb-3">
                      📝 QUESTIONS IN PUZZLE ({customQuestions.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {customQuestions.map((question, index) => (
                        <div key={question.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-white text-sm font-bold mb-1">
                                Q{index + 1}: {question.question}
                              </div>
                              <div className="text-green-400 text-xs mb-1">
                                ✅ {question.correctAnswer}
                              </div>
                              <div className="text-red-400 text-xs">
                                ❌ {question.wrongAnswers.join(', ')}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCustomQuestion(question.id)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-2"
                              title="Remove question"
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="anime-text-pixel text-yellow-400">
                              📺 {question.anime}
                            </span>
                            <span className={`anime-text-pixel ${
                              question.difficulty === 'easy' ? 'text-green-400' :
                              question.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              ⚡ {question.difficulty.toUpperCase()}
                            </span>
                            {question.isValidated && (
                              <span className="text-green-400">✅ AI Validated</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multi-Question Info */}
                <div className="bg-blue-900/20 border border-blue-400/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="anime-text-pixel text-blue-400 text-sm font-bold mb-2">MULTI-QUESTION PUZZLE</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        All questions will be grouped into a single puzzle that players complete sequentially. 
                        Each question has its own timer ({multiQuestionTimeLimit}s), and the total score is the sum of all correct answers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Anime Selection */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  ANIME SERIES
                </label>
                <select
                  value={selectedAnime}
                  onChange={(e) => setSelectedAnime(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                >
                  {animeOptions.map(anime => (
                    <option key={anime} value={anime}>{anime}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  DIFFICULTY
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Time Limit */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  TIME LIMIT (MINUTES)
                </label>
                <input
                  type="number"
                  value={Math.floor(timeLimit / 60)}
                  onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1) * 60)}
                  min="1"
                  max="30"
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                />
              </div>

              {/* Puzzle Count */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  NUMBER OF PUZZLES
                </label>
                <input
                  type="number"
                  value={puzzleCount}
                  onChange={(e) => setPuzzleCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="10"
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="neon-card p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 text-cyan-400 bg-gray-800 border-2 border-cyan-400 rounded focus:ring-cyan-400"
                />
                <span className="anime-text-pixel text-white text-sm">
                  Make this challenge public (others can find and play it)
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleCreateChallenge}
                disabled={isCreating || !title.trim()}
                className="flex-1 pixel-button text-lg py-4 animate-neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                  color: '#fff'
                }}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="anime-loading"></div>
                    <span>CREATING...</span>
                  </span>
                ) : (
                  '🚀 CREATE CHALLENGE'
                )}
              </button>
              
              <button
                onClick={onClose}
                className="pixel-button text-lg py-4 px-8"
                style={{ 
                  background: 'linear-gradient(135deg, #666 0%, #999 100%)',
                  color: '#fff'
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
