// Live Betting Functionality
class LiveBetting {
    constructor() {
        this.liveGames = [];
        this.flipAlerts = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.loadLiveGames();
        this.startRealTimeUpdates();
        this.bindEvents();
        this.renderGames();
        this.checkFlipAlerts();
    }

    loadLiveGames() {
        // Mock live game data - in real app this would come from API
        this.liveGames = [
            {
                id: 'det_chi',
                sport: 'nfl',
                homeTeam: 'DET',
                awayTeam: 'CHI',
                homeScore: 21,
                awayScore: 17,
                quarter: '4Q',
                timeLeft: '2:34',
                referee: 'Brad Allen',
                status: 'live',
                odds: {
                    spread: { home: -110, away: -110 },
                    moneyline: { home: -205, away: +185 }, // FLIP ALERT
                    total: { over: -108, under: -112 }
                },
                edge: 15.2,
                isFlipAlert: true
            },
            {
                id: 'dal_phi',
                sport: 'nfl',
                homeTeam: 'DAL',
                awayTeam: 'PHI',
                homeScore: 14,
                awayScore: 21,
                quarter: '3Q',
                timeLeft: '8:12',
                referee: 'Carl Cheffers',
                status: 'live',
                odds: {
                    spread: { home: -115, away: -105 },
                    moneyline: { home: +210, away: -250 },
                    total: { over: -108, under: -112 }
                },
                edge: 3.8,
                isFlipAlert: false
            },
            {
                id: 'lal_lac',
                sport: 'nba',
                homeTeam: 'LAL',
                awayTeam: 'LAC',
                homeScore: 68,
                awayScore: 72,
                quarter: '2Q',
                timeLeft: '6:45',
                referee: 'Marc Davis',
                status: 'live',
                odds: {
                    spread: { home: -112, away: -108 },
                    moneyline: { home: +115, away: -135 },
                    total: { over: -110, under: -110 }
                },
                edge: 4.1,
                isFlipAlert: false
            },
            {
                id: 'lad_atl',
                sport: 'mlb',
                homeTeam: 'ATL',
                awayTeam: 'LAD',
                homeScore: 4,
                awayScore: 3,
                inning: 'Top 7th',
                referee: 'Jerry Meals',
                status: 'live',
                odds: {
                    runLine: { home: +140, away: -160 },
                    moneyline: { home: -125, away: +105 },
                    total: { over: -110, under: -110 }
                },
                edge: 5.7,
                isFlipAlert: false
            },
            {
                id: 'bos_mia',
                sport: 'nba',
                homeTeam: 'BOS',
                awayTeam: 'MIA',
                homeScore: 32,
                awayScore: 28,
                quarter: '1Q',
                timeLeft: '4:23',
                referee: 'Tony Brothers',
                status: 'live',
                odds: {
                    spread: { home: -105, away: -115 },
                    moneyline: { home: -180, away: +155 },
                    total: { over: -108, under: -112 }
                },
                edge: 2.9,
                isFlipAlert: false
            }
        ];
    }

    startRealTimeUpdates() {
        // Update every 5 seconds for demo purposes
        this.updateInterval = setInterval(() => {
            this.updateGameScores();
            this.updateOdds();
            this.checkFlipAlerts();
        }, 5000);
    }

    updateGameScores() {
        // Simulate score updates
        this.liveGames.forEach(game => {
            if (Math.random() < 0.1) { // 10% chance of score update
                if (Math.random() < 0.5) {
                    game.homeScore += 3; // Field goal or basket
                } else {
                    game.awayScore += 3;
                }
                
                // Update time
                if (game.quarter) {
                    const quarterNum = parseInt(game.quarter.charAt(0));
                    const timeParts = game.timeLeft.split(':');
                    let minutes = parseInt(timeParts[0]);
                    let seconds = parseInt(timeParts[1]);
                    
                    seconds -= Math.floor(Math.random() * 15) + 5; // Random 5-19 seconds
                    
                    if (seconds < 0) {
                        seconds = 60 + seconds;
                        minutes--;
                        
                        if (minutes < 0) {
                            // End of quarter
                            if (quarterNum < 4) {
                                game.quarter = `${quarterNum + 1}Q`;
                                game.timeLeft = `12:00`;
                            } else {
                                game.status = 'final';
                            }
                        }
                    }
                    
                    game.timeLeft = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        });
        
        this.renderGames();
    }

    updateOdds() {
        // Simulate odds movement
        this.liveGames.forEach(game => {
            // Small random odds adjustments
            Object.keys(game.odds).forEach(oddsType => {
                Object.keys(game.odds[oddsType]).forEach(side => {
                    const currentOdds = game.odds[oddsType][side];
                    if (typeof currentOdds === 'number') {
                        // Adjust by random amount between -5 and +5 cents
                        const adjustment = Math.floor(Math.random() * 11) - 5;
                        game.odds[oddsType][side] = currentOdds + adjustment;
                    }
                });
            });
        });
    }

    checkFlipAlerts() {
        this.flipAlerts = this.liveGames.filter(game => game.isFlipAlert);
        this.renderFlipAlerts();
    }

    renderGames() {
        const container = document.querySelector('.games-container');
        if (!container) return;

        const filteredGames = this.getFilteredGames();
        
        container.innerHTML = filteredGames.map(game => this.renderGameCard(game)).join('');
        
        // Add click handlers
        this.bindGameHandlers();
    }

    renderGameCard(game) {
        const sportIcon = this.getSportIcon(game.sport);
        const isFlipClass = game.isFlipAlert ? 'flip-alert' : '';
        
        return `
            <div class="live-game-card ${isFlipClass}" data-sport="${game.sport}" data-game-id="${game.id}">
                <div class="game-header">
                    <div class="game-meta">
                        <span class="sport-badge ${game.sport}">${game.sport.toUpperCase()}</span>
                        <span class="game-time live">${game.quarter || game.inning} ${game.timeLeft}</span>
                        <span class="referee">Ref: ${game.referee}</span>
                    </div>
                    ${game.isFlipAlert ? `
                        <div class="flip-indicator active">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>FLIP ALERT</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="teams-section">
                    <div class="team home">
                        <span class="team-name">${game.homeTeam}</span>
                        <span class="team-score">${game.homeScore}</span>
                    </div>
                    <div class="vs-section">
                        <span class="vs">vs</span>
                    </div>
                    <div class="team away">
                        <span class="team-name">${game.awayTeam}</span>
                        <span class="team-score">${game.awayScore}</span>
                    </div>
                </div>

                <div class="odds-section">
                    <div class="odds-grid">
                        <div class="odds-item">
                            <span class="odds-label">${this.getOddsLabel(game.sport)}</span>
                            <div class="odds-values">
                                <span class="odds-value">${this.formatOdds(game.odds, 'favorite')}</span>
                                <span class="odds-value">${this.formatOdds(game.odds, 'underdog')}</span>
                            </div>
                        </div>
                        ${game.isFlipAlert ? `
                            <div class="odds-item highlight">
                                <span class="odds-label">FLIP ALERT</span>
                                <div class="odds-values flip-odds">
                                    <span class="odds-value original">-205 → +185</span>
                                    <span class="edge-indicator">+${game.edge}% Edge</span>
                                </div>
                            </div>
                        ` : `
                            <div class="odds-item">
                                <span class="odds-label">Moneyline</span>
                                <div class="odds-values">
                                    <span class="odds-value">${this.formatMoneyline(game.odds.moneyline)}</span>
                                </div>
                            </div>
                        `}
                        <div class="odds-item">
                            <span class="odds-label">Total</span>
                            <div class="odds-values">
                                <span class="odds-value">${this.formatTotal(game.odds)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="game-actions">
                    <button class="action-btn primary ${game.isFlipAlert ? 'alert' : ''}" data-action="bet" data-game-id="${game.id}">
                        <i class="fas fa-coins"></i>
                        ${this.getBetButtonText(game)}
                    </button>
                    <button class="action-btn secondary" data-action="props" data-game-id="${game.id}">
                        <i class="fas fa-chart-line"></i>
                        View Props
                    </button>
                </div>
            </div>
        `;
    }

    formatOdds(odds, side) {
        // Get the primary odds for spread/run line
        const spreadOdds = odds.spread || odds.runLine || {};
        const favorite = side === 'favorite' ? 'home' : 'away';
        const underdog = side === 'favorite' ? 'away' : 'home';
        
        const favoriteOdds = spreadOdds[favorite];
        const underdogOdds = spreadOdds[underdog];
        
        return `${this.formatTeamName(favorite)} ${this.formatAmericanOdds(favoriteOdds)} / ${this.formatTeamName(underdog)} ${this.formatAmericanOdds(underdogOdds)}`;
    }

    formatMoneyline(ml) {
        const favorite = ml.home < ml.away ? 'home' : 'away';
        const underdog = favorite === 'home' ? 'away' : 'home';
        
        return `${this.formatTeamName(favorite)} ${this.formatAmericanOdds(ml[favorite])} / ${this.formatTeamName(underdog)} ${this.formatAmericanOdds(ml[underdog])}`;
    }

    formatTotal(odds) {
        const total = odds.total;
        return `O 47.5 (-108) / U 47.5 (-112)`;
    }

    formatAmericanOdds(odds) {
        const formatted = Math.abs(odds);
        return `${odds < 0 ? '-' : '+'}${formatted}`;
    }

    formatTeamName(side) {
        const team = side === 'home' ? 'HOME' : 'AWAY';
        return team;
    }

    getOddsLabel(sport) {
        const labels = {
            'nfl': 'Spread',
            'nba': 'Spread',
            'mlb': 'Run Line',
            'nhl': 'Puck Line'
        };
        return labels[sport] || 'Spread';
    }

    getBetButtonText(game) {
        if (game.isFlipAlert) {
            return `Bet ${game.awayTeam} ML +185`;
        }
        return 'View Details';
    }

    getSportIcon(sport) {
        const icons = {
            'nfl': 'football-ball',
            'nba': 'basketball-ball',
            'mlb': 'baseball-ball',
            'nhl': 'hockey-puck'
        };
        return icons[sport] || 'sports-ball';
    }

    renderFlipAlerts() {
        const alertBanner = document.querySelector('.alert-banner');
        if (!alertBanner) return;

        if (this.flipAlerts.length > 0) {
            alertBanner.style.display = 'block';
        } else {
            alertBanner.style.display = 'none';
        }
    }

    getFilteredGames() {
        const activeTab = document.querySelector('.sport-tab.active');
        if (!activeTab || activeTab.dataset.sport === 'all') {
            return this.liveGames;
        }
        
        return this.liveGames.filter(game => game.sport === activeTab.dataset.sport);
    }

    bindEvents() {
        // Sport tab filtering
        const sportTabs = document.querySelectorAll('.sport-tab');
        sportTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                sportTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.renderGames();
            });
        });

        // Alert action button
        const alertAction = document.querySelector('.alert-action');
        if (alertAction) {
            alertAction.addEventListener('click', () => {
                this.showFlipAlerts();
            });
        }
    }

    bindGameHandlers() {
        // Bet button handlers
        document.querySelectorAll('[data-action="bet"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameId = e.target.closest('[data-game-id]').dataset.gameId;
                this.placeBet(gameId);
            });
        });

        // Props button handlers
        document.querySelectorAll('[data-action="props"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameId = e.target.closest('[data-game-id]').dataset.gameId;
                this.viewProps(gameId);
            });
        });
    }

    placeBet(gameId) {
        const game = this.liveGames.find(g => g.id === gameId);
        if (!game) return;

        if (game.isFlipAlert) {
            // Open bet slip for flip alert
            this.openBetSlip(game);
        } else {
            // Show game details modal
            this.showGameDetails(game);
        }
    }

    openBetSlip(game) {
        // Mock bet slip functionality
        const amount = 100; // $100 default
        const potentialWin = this.calculatePayout(game.odds.moneyline.away, amount);
        
        alert(`BET SLIP\n\nGame: ${game.awayTeam} ML\nOdds: +185\nStake: $${amount}\nPotential Win: $${potentialWin.toFixed(2)}\n\nBet submitted!`);
    }

    calculatePayout(odds, stake) {
        if (odds > 0) {
            return (odds / 100) * stake + stake;
        } else {
            return (100 / Math.abs(odds)) * stake + stake;
        }
    }

    viewProps(gameId) {
        // Navigate to props page with game filter
        window.location.href = `props.html?game=${gameId}`;
    }

    showGameDetails(game) {
        // Mock game details modal
        const details = `
GAME DETAILS

${game.homeTeam} vs ${game.awayTeam}
Score: ${game.homeScore} - ${game.awayScore}
${game.quarter || game.inning} ${game.timeLeft}

Referee: ${game.referee}
Edge: +${game.edge}%

Click "View Props" to see player props for this game.
        `;
        alert(details);
    }

    showFlipAlerts() {
        // Scroll to flip alerts
        const flipAlerts = document.querySelectorAll('.flip-alert');
        if (flipAlerts.length > 0) {
            flipAlerts[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Flash the alerts
            flipAlerts.forEach(alert => {
                alert.style.animation = 'flipAlert 2s ease-in-out 3';
            });
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize live betting when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('live-betting.html')) {
        window.liveBetting = new LiveBetting();
    }
});