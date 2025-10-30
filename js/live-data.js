// Live Sports Data Simulator - The Bookie Butcher
// Real-time data simulation for immediate use

class LiveSportsData {
    constructor() {
        this.games = new Map();
        this.oddsUpdateInterval = null;
        this.isSimulation = true; // Set to false when real APIs are connected
        this.init();
    }

    init() {
        this.loadLiveGames();
        this.startOddsSimulation();
        this.loadAdvancedData();
    }

    loadLiveGames() {
        // Current live games simulation
        this.games.set('LALvsBOS_2025_10_30', {
            sport: 'NBA',
            status: 'live',
            currentQuarter: 3,
            timeRemaining: '2:34',
            homeTeam: 'Celtics',
            awayTeam: 'Lakers',
            homeScore: 82,
            awayScore: 78,
            startingOdds: {
                Lakers: -200,
                Celtics: +170
            },
            currentOdds: {
                Lakers: -180,
                Celtics: +150
            },
            playerProps: {
                Lakers: {
                    'LeBron James': {
                        points: { line: 24.5, current: -105 },
                        rebounds: { line: 8.5, current: -110 },
                        assists: { line: 7.5, current: -115 }
                    },
                    'Anthony Davis': {
                        points: { line: 22.5, current: -110 },
                        rebounds: { line: 11.5, current: -105 }
                    }
                },
                Celtics: {
                    'Jayson Tatum': {
                        points: { line: 26.5, current: -110 },
                        rebounds: { line: 8.5, current: +105 }
                    }
                }
            },
            momentum: {
                currentRun: 'LAL 6-0 run',
                last5Min: 'High pace, 8 lead changes'
            },
            injuries: ['Lakers: Max Christie - Out'],
            weather: null // Indoor game
        });

        this.games.set('KCvsBUF_2025_10_30', {
            sport: 'NFL',
            status: 'live',
            currentQuarter: 2,
            timeRemaining: '8:45',
            homeTeam: 'Chiefs',
            awayTeam: 'Bills',
            homeScore: 21,
            awayScore: 17,
            startingOdds: {
                Chiefs: -150,
                Bills: +130
            },
            currentOdds: {
                Chiefs: -120,
                Bills: +100
            },
            playerProps: {
                'Patrick Mahomes': {
                    passingYards: { line: 295.5, current: -110 },
                    rushingYards: { line: 28.5, current: -105 },
                    touchdowns: { line: 2.5, current: +110 }
                },
                'Josh Allen': {
                    passingYards: { line: 285.5, current: -110 },
                    rushingYards: { line: 42.5, current: -115 }
                }
            },
            weather: {
                temperature: 42,
                windSpeed: 12,
                precipitation: 'light snow',
                windDirection: 'NW'
            }
        });
    }

    startOddsSimulation() {
        this.oddsUpdateInterval = setInterval(() => {
            this.simulateOddsChanges();
        }, 3000); // Update every 3 seconds
    }

    simulateOddsChanges() {
        this.games.forEach((game, gameId) => {
            if (game.status === 'live') {
                // Simulate realistic odds changes based on game flow
                const momentum = this.calculateGameMomentum(game);
                
                if (game.sport === 'NBA') {
                    this.simulateBasketballOdds(game, momentum);
                } else if (game.sport === 'NFL') {
                    this.simulateFootballOdds(game, momentum);
                }
            }
        });
    }

    calculateGameMomentum(game) {
        // Simple momentum calculation
        const scoreDiff = Math.abs(game.homeScore - game.awayScore);
        const recentRun = this.getRecentRun(game);
        
        if (recentRun) {
            return recentRun.includes(game.homeTeam) ? 'home_momentum' : 'away_momentum';
        }
        
        return 'neutral';
    }

    getRecentRun(game) {
        // Simulate recent scoring runs
        const runs = [
            `${game.homeTeam} 6-0 run`,
            `${game.awayTeam} 8-0 run`,
            'No significant runs'
        ];
        
        return runs[Math.floor(Math.random() * runs.length)];
    }

    simulateBasketballOdds(game, momentum) {
        const { homeTeam, awayTeam, currentOdds } = game;
        
        // Adjust odds based on momentum
        let homeAdjust = 0;
        let awayAdjust = 0;
        
        switch(momentum) {
            case 'home_momentum':
                homeAdjust = Math.random() * -15; // Home becomes more favored
                awayAdjust = Math.random() * 15;
                break;
            case 'away_momentum':
                awayAdjust = Math.random() * -15; // Away becomes more favored
                homeAdjust = Math.random() * 15;
                break;
            default:
                homeAdjust = (Math.random() - 0.5) * 10;
                awayAdjust = (Math.random() - 0.5) * 10;
        }
        
        // Update current odds
        const newHomeOdds = currentOdds[homeTeam] + homeAdjust;
        const newAwayOdds = currentOdds[awayTeam] + awayAdjust;
        
        game.currentOdds[homeTeam] = Math.round(newHomeOdds);
        game.currentOdds[awayTeam] = Math.round(newAwayOdds);
        
        // Check for favorite flip
        this.checkFavoriteFlip(gameId, game);
    }

    simulateFootballOdds(game, momentum) {
        // Similar simulation for football
        const adjustments = (Math.random() - 0.5) * 12;
        game.currentOdds.Chiefs += adjustments;
        game.currentOdds.Bills -= adjustments;
        
        // Check for significant momentum shifts
        if (Math.abs(game.currentOdds.Chiefs - game.startingOdds.Chiefs) > 50) {
            this.logSignificantChange(gameId, 'Chiefs odds shift:', game.currentOdds.Chiefs);
        }
    }

    checkFavoriteFlip(gameId, game) {
        const { startingOdds, currentOdds } = game;
        
        // Check if a favorite has flipped to underdog
        Object.keys(startingOdds).forEach(team => {
            const originalOdds = startingOdds[team];
            const current = currentOdds[team];
            
            // Check for -200 to +200 flip
            if (originalOdds <= -200 && current >= 200) {
                console.log(`🚨 FLIP ALERT: ${team} flipped from ${originalOdds} favorite to +${Math.abs(current)} underdog!`);
                
                // Trigger Bookie Butcher flip detection
                if (window.bookieButcher) {
                    window.bookieButcher.triggerFlipAlert(gameId, game, 0.65);
                }
            }
        });
    }

    loadAdvancedData() {
        // Load referee data
        this.refereeData = {
            'Scott Foster': {
                sport: 'NBA',
                tendencies: {
                    foulsPerGame: 48.3,
                    technicalFouls: 2.1,
                    paceImpact: 'Slower 4th quarter'
                },
                impact: 'High foul calling, benefits free throw props'
            }
        };
        
        // Load weather impact
        this.weatherData = {
            'KCvsBUF_2025_10_30': {
                temperature: 42,
                windSpeed: 12,
                precipitation: 'light snow',
                impacts: {
                    passingYards: '-8%',
                    fieldGoals: '-12%',
                    totalPoints: '-15%'
                }
            }
        };
    }

    getLiveOpportunities() {
        const opportunities = [];
        
        this.games.forEach((game, gameId) => {
            // Analyze each game for betting opportunities
            const opp = this.analyzeBettingOpportunity(game);
            if (opp) opportunities.push(opp);
        });
        
        return opportunities.sort((a, b) => b.edge - a.edge);
    }

    analyzeBettingOpportunity(game) {
        const analysis = {
            gameId: game.gameId,
            sport: game.sport,
            teams: `${game.homeTeam} vs ${game.awayTeam}`,
            edge: 0,
            recommendation: null,
            confidence: 'Low'
        };
        
        // Check for significant odds mispricing
        const lineMovement = Math.abs(game.currentOdds.Chiefs - game.startingOdds.Chiefs);
        if (lineMovement > 30) {
            analysis.edge = lineMovement * 0.15; // 15% of line movement
            analysis.recommendation = 'Line movement opportunity';
            analysis.confidence = 'Medium';
        }
        
        // Weather impact opportunities
        if (game.weather && game.weather.precipitation) {
            analysis.edge += 12; // Weather creates opportunities
            analysis.recommendation = 'Weather impact advantage';
            analysis.confidence = 'High';
        }
        
        return analysis.edge > 5 ? analysis : null;
    }

    getRealTimeStats() {
        return {
            gamesTracking: this.games.size,
            oddsUpdated: Date.now(),
            nextUpdate: 3000,
            systemStatus: this.isSimulation ? 'SIMULATION MODE' : 'LIVE MODE'
        };
    }

    logSignificantChange(gameId, message, value) {
        console.log(`📊 [${gameId}] ${message}: ${value}`);
        
        // In production, this would send to monitoring system
        if (value > 100 || value < -100) {
            console.log('⚠️ SIGNIFICANT ODDS MOVEMENT DETECTED');
        }
    }

    // API for external access
    getGameData(gameId) {
        return this.games.get(gameId);
    }

    getAllGames() {
        return Array.from(this.games.values());
    }

    getOpportunities() {
        return this.getLiveOpportunities();
    }

    // Toggle simulation vs live mode
    setSimulationMode(isSim) {
        this.isSimulation = isSim;
        if (!isSim) {
            // Switch to real APIs
            this.disconnectSimulation();
            this.connectRealAPIs();
        }
    }

    disconnectSimulation() {
        if (this.oddsUpdateInterval) {
            clearInterval(this.oddsUpdateInterval);
            this.oddsUpdateInterval = null;
        }
    }

    connectRealAPIs() {
        // Connect to real sports data APIs
        console.log('🔄 Connecting to real sports data APIs...');
        // Implementation would go here
    }
}

// Initialize live data system
let liveData;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    liveData = new LiveSportsData();
    
    // Expose to global scope for other scripts
    window.liveData = liveData;
    
    console.log('🚀 Live Sports Data System Initialized');
    console.log('📊 Current Opportunities:', liveData.getOpportunities().length);
});

export default LiveSportsData;