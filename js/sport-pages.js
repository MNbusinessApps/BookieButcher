// Sport Pages Functionality
class SportPages {
    constructor() {
        this.sportData = {};
        this.init();
    }

    init() {
        this.loadSportData();
        this.bindEvents();
        this.updateRealTime();
    }

    loadSportData() {
        // Mock data for all sports
        this.sportData = {
            football: {
                league: 'NFL',
                liveGames: 3,
                totalProps: 15,
                hotProps: [
                    {
                        player: 'Josh Allen',
                        stat: 'Passing Yards',
                        line: 265.5,
                        prediction: 'OVER',
                        probability: 61.2,
                        edge: 12.4
                    },
                    {
                        player: 'Cooper Kupp',
                        stat: 'Receptions',
                        line: 6.5,
                        prediction: 'OVER',
                        probability: 64.8,
                        edge: 8.9
                    }
                ]
            },
            basketball: {
                league: 'NBA',
                liveGames: 2,
                totalProps: 12,
                hotProps: [
                    {
                        player: 'Nikola Jokic',
                        stat: 'Reb + Assists',
                        line: 22.0,
                        prediction: 'OVER',
                        probability: 68.3,
                        edge: 14.7
                    },
                    {
                        player: 'LeBron James',
                        stat: 'Points',
                        line: 24.5,
                        prediction: 'OVER',
                        probability: 65.1,
                        edge: 9.2
                    }
                ]
            },
            baseball: {
                league: 'MLB',
                liveGames: 2,
                totalProps: 8,
                hotProps: [
                    {
                        player: 'Shohei Ohtani',
                        stat: 'Total Bases',
                        line: 1.5,
                        prediction: 'OVER',
                        probability: 72.4,
                        edge: 16.8
                    },
                    {
                        player: 'Aaron Judge',
                        stat: 'Hits',
                        line: 1.5,
                        prediction: 'OVER',
                        probability: 64.7,
                        edge: 9.1
                    }
                ]
            },
            combat: {
                league: 'Combat Sports',
                upcomingFights: 5,
                hotProps: [
                    {
                        fighter: 'Nate Diaz',
                        prop: 'Method of Victory',
                        line: 'No (-140)',
                        prediction: 'NO',
                        probability: 68.3,
                        edge: 9.7
                    }
                ]
            }
        };
    }

    bindEvents() {
        // Filter controls
        this.bindFilterControls();
        
        // Sport tab functionality
        this.bindSportTabs();
        
        // Betting actions
        this.bindBettingActions();
    }

    bindFilterControls() {
        // Props filter
        const sportFilter = document.getElementById('sportFilter');
        if (sportFilter) {
            sportFilter.addEventListener('change', (e) => {
                this.filterProps(e.target.value);
            });
        }

        // Edge filter
        const edgeFilter = document.getElementById('edgeFilter');
        if (edgeFilter) {
            edgeFilter.addEventListener('change', (e) => {
                this.filterProps(undefined, e.target.value);
            });
        }
    }

    bindSportTabs() {
        // League filtering (NFL, NBA, MLB)
        const leagueTabs = document.querySelectorAll('.league-tab');
        leagueTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                leagueTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const league = e.target.dataset.league;
                this.filterByLeague(league);
            });
        });
    }

    bindBettingActions() {
        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="bet"]') || e.target.closest('[data-action="bet"]')) {
                const button = e.target.matches('[data-action="bet"]') ? e.target : e.target.closest('[data-action="bet"]');
                const gameId = button.dataset.gameId;
                this.placeBet(gameId);
            }
            
            if (e.target.matches('[data-action="props"]') || e.target.closest('[data-action="props"]')) {
                const button = e.target.matches('[data-action="props"]') ? e.target : e.target.closest('[data-action="props"]');
                const gameId = button.dataset.gameId;
                this.viewProps(gameId);
            }
        });
    }

    filterProps(sport, edge) {
        const propCards = document.querySelectorAll('.prop-card');
        
        propCards.forEach(card => {
            let show = true;
            
            // Filter by sport
            if (sport && sport !== 'all') {
                const cardSport = card.dataset.sport;
                show = cardSport === sport;
            }
            
            // Filter by edge
            if (edge && show) {
                const edgeText = card.querySelector('.edge-value')?.textContent || '';
                const edgeValue = parseFloat(edgeText.replace(/[+%]/g, ''));
                
                if (edge === 'high' && edgeValue < 10) {
                    show = false;
                } else if (edge === 'medium' && (edgeValue < 5 || edgeValue >= 10)) {
                    show = false;
                }
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    filterByLeague(league) {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const cardLeague = card.dataset.league;
            const show = cardLeague === league || league === 'all';
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    placeBet(gameId) {
        // Find the game and show bet slip
        const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
        if (!gameCard) return;

        const homeTeam = gameCard.querySelector('.team.home .team-name')?.textContent;
        const awayTeam = gameCard.querySelector('.team.away .team-name')?.textContent;
        const oddsValue = gameCard.querySelector('.odds-value')?.textContent;

        // Mock bet slip
        const confirmBet = confirm(`Place bet on ${awayTeam} ML?\n\nOdds: ${oddsValue}\nRecommended stake: $100\n\nClick OK to confirm, Cancel to review props.`);
        
        if (confirmBet) {
            this.processBet(gameId, 100);
        } else {
            this.viewProps(gameId);
        }
    }

    processBet(gameId, stake) {
        // Mock bet processing
        setTimeout(() => {
            alert(`BET PLACED!\n\nGame ID: ${gameId}\nStake: $${stake}\nEstimated Payout: $${(stake * 1.85).toFixed(2)}\n\nBet ID: BB-${Date.now()}`);
        }, 500);
    }

    viewProps(gameId) {
        // Navigate to props page with game filter
        const url = new URL(window.location);
        url.searchParams.set('game', gameId);
        window.location.href = `props.html${url.search}`;
    }

    updateRealTime() {
        // Update real-time data every 10 seconds
        setInterval(() => {
            this.updateScores();
            this.updateOdds();
            this.updateLiveStats();
        }, 10000);
    }

    updateScores() {
        // Simulate score updates
        const scoreElements = document.querySelectorAll('.team-score');
        scoreElements.forEach(score => {
            const currentScore = parseInt(score.textContent);
            
            // Small chance of score update (1 in 50 per update cycle)
            if (Math.random() < 0.02) {
                const newScore = currentScore + (Math.random() < 0.5 ? 1 : 3); // 1 or 3 points
                score.textContent = newScore;
                
                // Add highlight animation
                score.style.animation = 'scoreUpdate 0.5s ease-out';
                setTimeout(() => {
                    score.style.animation = '';
                }, 500);
            }
        });
    }

    updateOdds() {
        // Simulate odds movement
        const oddsElements = document.querySelectorAll('.odds-value');
        oddsElements.forEach(odds => {
            const text = odds.textContent;
            
            // Only update American odds
            if (text.includes('+') || text.includes('-')) {
                const match = text.match(/([+-]\d+)/);
                if (match) {
                    const currentOdds = parseInt(match[1]);
                    // Random adjustment between -10 and +10
                    const adjustment = Math.floor(Math.random() * 21) - 10;
                    const newOdds = currentOdds + adjustment;
                    
                    // Update the odds text
                    const newText = text.replace(/[+-]\d+/, newOdds >= 0 ? `+${newOdds}` : `${newOdds}`);
                    odds.textContent = newText;
                }
            }
        });
    }

    updateLiveStats() {
        // Update live game counts
        const sportPages = ['football', 'basketball', 'baseball'];
        
        sportPages.forEach(sport => {
            const statsContainer = document.querySelector(`.sport-stats`);
            if (statsContainer) {
                // Mock live game count updates
                const liveGamesElement = statsContainer.querySelector('.stat-item .value');
                if (liveGamesElement && Math.random() < 0.1) {
                    const current = parseInt(liveGamesElement.textContent);
                    const newCount = Math.max(0, current + (Math.random() < 0.5 ? 1 : -1));
                    liveGamesElement.textContent = newCount;
                }
            }
        });
    }

    // Analysis and insights
    generateGameInsights(gameId) {
        // Mock game analysis
        const insights = {
            pace_analysis: {
                current_pace: '102.3 possessions/game',
                expected_pace: '98.5 possessions/game',
                pace_differential: '+3.8% (FAVORS OVER)',
                expected_final: '232-226 (O 226.5)'
            },
            referee_impact: {
                referee: 'Tony Brothers',
                fouls_per_game: '47.2 (High)',
                free_throw_rate: '+15.3% boost',
                impact: 'Favors over totals'
            }
        };

        return insights;
    }

    // Weather and conditions
    updateWeatherConditions() {
        const conditionCards = document.querySelectorAll('.condition-card');
        
        conditionCards.forEach(card => {
            const venueName = card.querySelector('h3')?.textContent;
            if (venueName) {
                // Mock weather updates
                const tempElement = card.querySelector('.condition-item:first-child span');
                if (tempElement && Math.random() < 0.05) { // 5% chance of update
                    const currentTemp = parseInt(tempElement.textContent);
                    const newTemp = currentTemp + (Math.random() < 0.5 ? 1 : -1);
                    tempElement.textContent = tempElement.textContent.replace(/\d+°/, `${newTemp}°`);
                }
            }
        });
    }

    // Prop value calculations
    calculatePropValue(prop) {
        // Advanced prop value calculation
        const expected = prop.expectedValue || prop.line * 1.05;
        const variance = prop.variance || 8.5;
        const probability = this.normalCDF((expected - prop.line) / variance);
        
        const impliedProb = this.calculateImpliedProbability(prop.line);
        const edge = (probability - impliedProb) * 100;
        
        return {
            expected,
            probability,
            edge,
            confidence: this.calculateConfidence(prop, edge)
        };
    }

    calculateImpliedProbability(line) {
        // Convert American odds to implied probability
        if (line > 0) {
            return 100 / (line + 100);
        } else {
            return Math.abs(line) / (Math.abs(line) + 100);
        }
    }

    normalCDF(x) {
        // Standard normal CDF approximation
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        // Approximation of error function
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    calculateConfidence(prop, edge) {
        // Determine confidence level based on edge and prop data
        if (edge > 10 && prop.sampleSize > 15) return 'Very High';
        if (edge > 7 && prop.sampleSize > 10) return 'High';
        if (edge > 5 && prop.sampleSize > 5) return 'Medium';
        return 'Low';
    }

    // Export functionality
    exportSportData() {
        const sportPage = this.getCurrentSportPage();
        const data = {
            sport: sportPage,
            timestamp: new Date().toISOString(),
            games: this.sportData[sportPage] || {},
            exportVersion: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sportPage}-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getCurrentSportPage() {
        const path = window.location.pathname;
        if (path.includes('football.html')) return 'football';
        if (path.includes('basketball.html')) return 'basketball';
        if (path.includes('baseball.html')) return 'baseball';
        if (path.includes('combat-sports.html')) return 'combat';
        return 'unknown';
    }
}

// Add score update animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes scoreUpdate {
        0% { transform: scale(1); background: transparent; }
        50% { transform: scale(1.1); background: rgba(18, 183, 106, 0.3); }
        100% { transform: scale(1); background: transparent; }
    }
`;
document.head.appendChild(style);

// Initialize sport pages
document.addEventListener('DOMContentLoaded', () => {
    const isSportPage = window.location.pathname.includes('.html') && 
                       !window.location.pathname.includes('index') &&
                       !window.location.pathname.includes('live-betting') &&
                       !window.location.pathname.includes('props') &&
                       !window.location.pathname.includes('bankroll-manager');
    
    if (isSportPage) {
        window.sportPages = new SportPages();
    }
});