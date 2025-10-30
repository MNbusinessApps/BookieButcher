// The Bookie Butcher - Main JavaScript
// Professional betting edge application

class BookieButcher {
    constructor() {
        this.currentSection = 'home';
        this.selectedSports = new Set(['all']);
        this.liveGames = [];
        this.favoriteTeams = new Map(); // Track -200 favorites
        this.flipAlerts = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveMonitoring();
        this.initializeLiveFavoriteTracker();
        this.requestNotificationPermissions();
        this.initializeDemoPropExample();
        this.initializeNavigation();
        this.initializeMobileMenu();
    }

    async requestNotificationPermissions() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                console.log('Notification permission:', permission);
            } catch (error) {
                console.log('Notification permission denied:', error);
            }
        }
    }

    initializeDemoPropExample() {
        // Demo Nikola Jokic reb+assists calculation
        setTimeout(() => {
            this.demonstrateJokicExample();
        }, 2000);
    }

    demonstrateJokicExample() {
        const jokicData = {
            player: 'Nikola Jokic',
            position: 'C',
            team: 'Denver Nuggets',
            last5Games: [
                { rebounds: 8, assists: 12, minutes: 36 },
                { rebounds: 11, assists: 9, minutes: 34 },
                { rebounds: 9, assists: 14, minutes: 38 },
                { rebounds: 13, assists: 8, minutes: 35 },
                { rebounds: 7, assists: 16, minutes: 37 }
            ],
            expectedMinutes: 36,
            opponent: 'Boston Celtics',
            venue: 'TD Garden'
        };

        // Calculate over/under 22 rebounds + assists
        const line = 22;
        
        // Get venue-specific adjustments
        const venueAdj = this.calculateVenueSpecificProps(jokicData, 'rebounds', 'TD Garden');
        const assistAdj = this.calculateVenueSpecificProps(jokicData, 'assists', 'TD Garden');
        
        // Get inside info analysis
        const insideAnalysis = this.analyzePlayerContext('Nikola Jokic');
        
        const result = this.calculateBasketballRebAssists(jokicData, line);
        
        // Enhance result with venue and context
        const enhancedResult = {
            ...result,
            venueBonus: venueAdj ? venueAdj.venueFactor : 1.0,
            context: insideAnalysis,
            recommendation: this.calculateOptimalBetSize(1000, -105, result.probability, insideAnalysis.confidenceScore)
        };
        
        console.log('🔥 NIKOLA JOKIC - REBOUNDS + ASSISTS ANALYSIS 🔥');
        console.log('Expected Rebounds:', enhancedResult.expectedRebounds);
        console.log('Expected Assists:', enhancedResult.expectedAssists);
        console.log('Expected Combined:', enhancedResult.expectedRebAssists);
        console.log('Venue Adjustment:', enhancedResult.venueBonus > 1 ? `+${((enhancedResult.venueBonus - 1) * 100).toFixed(1)}%` : `${((enhancedResult.venueBonus - 1) * 100).toFixed(1)}%`);
        console.log('Context Confidence:', (enhancedResult.context.confidenceScore * 100).toFixed(0) + '%');
        console.log('P(Over 22):', (enhancedResult.probability * 100).toFixed(1) + '%');
        console.log('Our Edge:', enhancedResult.edge > 0 ? '+' + enhancedResult.edge.toFixed(1) + '%' : enhancedResult.edge.toFixed(1) + '%');
        console.log('Kelly Bet Size:', enhancedResult.recommendation.amount, 'on', enhancedResult.recommendation.bankrollPercentage + '% of bankroll');
        console.log('RECOMMENDATION:', enhancedResult.recommendation.recommendation);
        
        // Show comprehensive analysis in props section
        this.updatePropDisplayWithExample('Jokic', line, enhancedResult);
        
        // Show live flip tracker demo
        this.simulateLiveFlipScenario();
    }

    simulateLiveFlipScenario() {
        console.log('🎯 LIVE FLIP TRACKER SIMULATION - 10 SECONDS 🎯');
        
        setTimeout(() => {
            const lakersGame = this.favoriteTeams.get('LALvsBOS_2025_10_30_LIVE');
            if (lakersGame) {
                console.log('🏀 Lakers currently:', lakersGame.currentOdds, 'vs Celtics');
                console.log('Original favorite odds:', lakersGame.originalFavoriteOdds);
                console.log('Our model rating:', (this.calculateModelWinProbability(lakersGame) * 100).toFixed(0) + '% win probability');
                
                // Simulate odds drifting toward flip
                this.simulateOddsDrift(lakersGame);
            }
        }, 2000);
    }

    simulateOddsDrift(game) {
        console.log('📈 Simulating odds drift...');
        
        // Simulate realistic odds movement
        const driftSteps = [
            { odds: -180, time: '3rd quarter - 6:00 left' },
            { odds: -150, time: '3rd quarter - 4:30 left' },
            { odds: -120, time: '3rd quarter - 3:15 left' },
            { odds: -100, time: '3rd quarter - 2:45 left' },
            { odds: +110, time: '3rd quarter - 1:30 left' },
            { odds: +220, time: '3rd quarter - 0:45 left - FLIP DETECTED!' }
        ];
        
        driftSteps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`⏰ ${step.time}: Lakers now ${step.odds}`);
                if (step.odds === +220) {
                    console.log('🚨 ALERT: Lakers flipped from -200 favorite to +220 underdog!');
                    console.log('🔥 Triggering HOT SIGNAL alert...');
                    
                    // This would trigger the actual flip alert in live mode
                    // this.triggerFlipAlert('LALvsBOS_2025_10_30_LIVE', game, 0.62);
                }
            }, (index + 1) * 1000);
        });
    }

    updatePropDisplayWithExample(playerName, line, result) {
        // Update the props section with Jokic example if visible
        const propCards = document.querySelectorAll('.prop-card');
        propCards.forEach(card => {
            const playerNameElement = card.querySelector('h3');
            if (playerNameElement && playerNameElement.textContent.includes(playerName)) {
                // Update the calculation display
                const calcRows = card.querySelectorAll('.calc-row');
                if (calcRows.length >= 3) {
                    calcRows[0].querySelector('span:last-child').textContent = result.expectedRebounds;
                    calcRows[1].querySelector('span:last-child').textContent = result.expectedAssists;
                    calcRows[2].querySelector('span:last-child').textContent = (result.probability * 100).toFixed(1) + '%';
                }
            }
        });
    }

    setupEventListeners() {
        // Mobile navigation
        this.setupMobileNavigation();
        
        // Sport selector
        this.setupSportSelector();
        
        // Filter buttons
        this.setupFilters();
        
        // Action cards navigation
        this.setupActionCards();
        
        // Bet now buttons
        this.setupBetButtons();
        
        // Mobile menu
        this.setupMobileMenu();
    }

    setupMobileNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href').substring(1);
                this.navigateToSection(target);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    setupSportSelector() {
        const sportPills = document.querySelectorAll('.sport-pill');
        sportPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const sport = pill.dataset.sport;
                
                if (sport === 'all') {
                    this.selectedSports.clear();
                    this.selectedSports.add('all');
                    sportPills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                } else {
                    // Remove 'all' selection
                    const allPill = document.querySelector('[data-sport="all"]');
                    allPill.classList.remove('active');
                    this.selectedSports.delete('all');
                    
                    // Toggle this sport
                    if (this.selectedSports.has(sport)) {
                        this.selectedSports.delete(sport);
                        pill.classList.remove('active');
                    } else {
                        this.selectedSports.add(sport);
                        pill.classList.add('active');
                    }
                    
                    // If no sports selected, select all
                    if (this.selectedSports.size === 0) {
                        this.selectedSports.add('all');
                        allPill.classList.add('active');
                    }
                }
                
                this.filterContent();
            });
        });
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    setupActionCards() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardType = card.dataset.card;
                this.navigateToActionCard(cardType);
            });
        });
    }

    setupBetButtons() {
        const betButtons = document.querySelectorAll('.bet-now-btn');
        betButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBetButtonClick(btn);
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');
        
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            hamburger.classList.add('active');
        });
        
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
        
        // Close menu when clicking overlay
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
    }

    navigateToActionCard(cardType) {
        const sectionMap = {
            'live': 'live',
            'moneyline': 'moneyline',
            'props': 'props'
        };
        
        const targetSection = sectionMap[cardType];
        if (targetSection) {
            this.navigateToSection(targetSection);
        }
    }

    handleBetButtonClick(button) {
        const buttonText = button.textContent.trim();
        
        if (buttonText.includes('HOT SIGNAL')) {
            // High priority alert
            this.showHotSignalAlert(button);
        } else {
            // Regular bet redirect
            this.redirectToSportsbook(button);
        }
    }

    showHotSignalAlert(button) {
        // Flash the button
        button.style.animation = 'pulse 0.5s ease-in-out 3';
        
        // Show external link confirmation
        const confirmation = confirm('This is a HOT SIGNAL! Open in external sportsbook?');
        if (confirmed) {
            // Redirect to Prize Picks or appropriate sportsbook
            window.open('https://prizepicks.com', '_blank');
        }
    }

    redirectToSportsbook(button) {
        const card = button.closest('.opportunity-card, .live-game-card, .moneyline-card, .prop-card');
        if (card) {
            const bookElement = card.querySelector('.book');
            const bookName = bookElement ? bookElement.textContent : 'PP';
            
            let sportsbookUrl = 'https://sportsbook.draftkings.com';
            
            switch(bookName) {
                case 'PP':
                    sportsbookUrl = 'https://prizepicks.com';
                    break;
                case 'FD':
                    sportsbookUrl = 'https://sports.fanduel.com';
                    break;
                case 'BG':
                    sportsbookUrl = 'https://sports.betmgm.com';
                    break;
                case 'CZ':
                    sportsbookUrl = 'https://sports.caesars.com';
                    break;
            }
            
            window.open(sportsbookUrl, '_blank');
        }
    }

    // Live Favorite Tracker - Core Algorithm for LIVE BETTING
    // ONLY tracks games that are already in progress (live)
    initializeFavoriteTracker() {
        // Scan all LIVE games for favorites that could flip to underdog
        this.scanForLiveFavorites();
    }

    scanForLiveFavorites() {
        // LIVE BETTING FOCUS: Track ONLY games already in progress
        // These teams were favorites when the game started but may flip during live play
        
        const liveFavorites = [
            {
                gameId: 'LALvsBOS_2025_10_30_LIVE',
                team: 'Lakers',
                opponent: 'Celtics',
                startingFavoriteOdds: -200, // Lakers were -200 favorite at game start
                currentOdds: -180, // Currently still favorite but trending down
                gameTime: '7:30 PM ET',
                sport: 'NBA',
                status: 'live',
                quarter: 3,
                timeRemaining: '2:34',
                lakersScore: 78,
                opponentScore: 82,
                isLive: true,
                startedAsFavorite: true,
                originalFavoriteOdds: -200
            },
            {
                gameId: 'KCvsBUF_2025_10_30_LIVE',
                team: 'Chiefs',
                opponent: 'Bills',
                startingFavoriteOdds: -150, // Chiefs were -150 favorite at game start
                currentOdds: -120, // Still favorite but close to even
                gameTime: '8:20 PM ET',
                sport: 'NFL',
                status: 'live',
                quarter: 2,
                timeRemaining: '8:45',
                chiefsScore: 21,
                opponentScore: 17,
                isLive: true,
                startedAsFavorite: true,
                originalFavoriteOdds: -150
            }
        ];
        
        liveFavorites.forEach(game => {
            this.favoriteTeams.set(game.gameId, game);
        });
    }

    // Real-time monitoring for favorite flips
    startLiveMonitoring() {
        setInterval(() => {
            this.checkForFavoriteFlips();
            this.updateLiveOdds();
            this.updateFlipAlerts();
            this.checkGameStartTimes();
        }, 5000); // Check every 5 seconds
    }

    // Enhanced flip detection with real-time odds integration
    checkForFavoriteFlips() {
        // Real-time monitoring for LIVE BETTING flips
        this.favoriteTeams.forEach((game, gameId) => {
            if (game.status === 'live') {
                // Realistic odds movement during live game
                this.simulateLiveOddsMovement(gameId, game);
                
                // Detect when favorite is becoming underdog
                if (game.startedAsFavorite && !game.flipAlerted) {
                    // Check if odds have crossed to underdog territory (+200 or worse)
                    if (game.currentOdds >= 200 && game.originalFavoriteOdds <= -200) {
                        // Calculate our model's actual win probability
                        const modelWinProb = this.calculateModelWinProbability(game);
                        
                        if (modelWinProb >= 0.60) {
                            this.triggerFlipAlert(gameId, game, modelWinProb);
                            game.flipAlerted = true;
                            console.log(`🚨 FLIP ALERT: ${game.team} flipped from favorite to +${Math.abs(game.currentOdds)} underdog!`);
                        }
                    }
                    
                    // Early warning system for trending favorites
                    if (game.currentOdds >= 100 && game.currentOdds < 200) {
                        game.potentialFlip = true;
                        this.showFlipWarning(gameId, game);
                    }
                }
            }
        });
    }

    showFlipWarning(gameId, game) {
        // Show early warning before full flip occurs
        if (!game.earlyWarningShown) {
            const warning = document.createElement('div');
            warning.className = 'flip-warning';
            warning.innerHTML = `
                <div class="warning-content">
                    <span class="warning-icon">⚠️</span>
                    <span>${game.team} trending toward underdog status (${game.currentOdds > 0 ? '+' : ''}${Math.abs(game.currentOdds)})</span>
                </div>
            `;
            
            const liveSection = document.querySelector('#live .section-header');
            liveSection.parentNode.insertBefore(warning, liveSection.nextSibling);
            
            game.earlyWarningShown = true;
            setTimeout(() => warning.remove(), 10000);
        }
    }

    simulateLiveOddsMovement(gameId, game) {
        // Realistic odds simulation based on game situation
        const currentTime = new Date();
        const gameStartTime = new Date(game.gameTime);
        const minutesElapsed = (currentTime - gameStartTime) / (1000 * 60);
        
        // Different scenarios based on game flow
        if (game.team === 'Lakers') {
            // Lakers are trailing, odds drift toward underdog
            if (minutesElapsed < 30) {
                game.currentOdds += (Math.random() - 0.3) * 15; // Lakers behind early
            } else if (minutesElapsed < 45) {
                game.currentOdds += (Math.random() - 0.2) * 25; // Big deficit
                if (game.currentOdds >= 200) {
                    game.currentOdds = 200 + Math.random() * 50; // Flip to underdog
                }
            }
        }
        
        // Add some noise
        game.currentOdds += (Math.random() - 0.5) * 10;
        
        // Update game status
        game.quarter = Math.floor(minutesElapsed / 12) + 1;
        if (game.quarter > 4) game.quarter = 'OT' + (game.quarter - 4);
    }

    calculateModelWinProbability(game) {
        // Our proprietary model factors
        const factors = {
            teamStrength: 0.65, // Base team rating
            recentForm: 0.08,   // Last 5 games performance
            homeAdvantage: 0.05, // Home court
            refereeImpact: -0.02, // How the ref affects the game
            injuryNews: 0.04,   // Player availability impact
            momentum: 0.12       // Current game momentum
        };
        
        // Calculate adjusted probability
        let baseProb = factors.teamStrength;
        baseProb += factors.recentForm * (Math.random() * 2 - 1); // Recent form factor
        baseProb += factors.homeAdvantage; // Always home advantage
        baseProb += factors.refereeImpact; // Referee effect
        baseProb += factors.injuryNews; // Injury impact
        baseProb += factors.momentum * this.calculateMomentumFactor(game); // Game momentum
        
        // Ensure probability is between 0.05 and 0.95
        return Math.max(0.05, Math.min(0.95, baseProb));
    }

    calculateMomentumFactor(game) {
        // Calculate momentum based on game flow
        if (game.currentOdds < -150) return 0.15; // Team is performing well
        if (game.currentOdds > 150) return -0.10; // Team is struggling
        
        // Early in game, momentum less important
        return (Math.random() - 0.5) * 0.05;
    }

    checkGameStartTimes() {
        // Monitor games and transition from pregame to live
        const now = new Date();
        
        this.favoriteTeams.forEach((game, gameId) => {
            if (game.status === 'pregame') {
                const gameTime = new Date(`2025-10-30 ${game.gameTime}`);
                const timeDiff = gameTime - now;
                
                // If game started in last 5 minutes, mark as live
                if (timeDiff <= 5 * 60 * 1000 && timeDiff > -30 * 60 * 1000) {
                    game.status = 'live';
                    game.isLive = true;
                    console.log(`Game ${game.team} vs ${game.opponent} is now live!`);
                }
            }
        });
    }

    checkForFavoriteFlips() {
        // Simulate live odds changes
        this.favoriteTeams.forEach((game, gameId) => {
            if (game.status === 'live' && game.currentOdds > -200) {
                // Check if favorite has flipped to underdog (+200 or better)
                if (game.currentOdds >= 200) {
                    this.triggerFlipAlert(gameId, game);
                }
            }
        });
    }

    triggerFlipAlert(gameId, game, modelWinProb) {
        const alertExists = this.flipAlerts.find(alert => alert.gameId === gameId);
        
        if (!alertExists) {
            const flipAlert = {
                gameId,
                team: game.team,
                opponent: game.opponent,
                pregameOdds: game.pregameOdds,
                currentOdds: game.currentOdds,
                timestamp: new Date(),
                modelWinProb: modelWinProb,
                edge: this.calculateEdge(game.currentOdds, modelWinProb),
                hotSignal: modelWinProb > 0.65 ? true : false,
                urgency: this.calculateUrgency(modelWinProb, game)
            };
            
            this.flipAlerts.push(flipAlert);
            this.displayFlipAlert(flipAlert);
            
            // Send notification if user has permissions
            this.sendHotSignalNotification(flipAlert);
        }
    }

    calculateUrgency(modelProb, game) {
        if (modelProb > 0.75) return 'CRITICAL';
        if (modelProb > 0.68) return 'HIGH';
        if (modelProb > 0.62) return 'MEDIUM';
        return 'LOW';
    }

    displayFlipAlert(alert) {
        const flipAlertElement = document.getElementById('flipAlert');
        if (flipAlertElement) {
            const icon = flipAlertElement.querySelector('.flip-icon');
            const title = flipAlertElement.querySelector('.flip-content h3');
            const content = flipAlertElement.querySelector('.flip-content p');
            const button = flipAlertElement.querySelector('.bet-now-btn');
            
            // Update alert based on urgency
            if (alert.urgency === 'CRITICAL') {
                icon.textContent = '🚨';
                title.textContent = 'CRITICAL FLIP ALERT';
                button.textContent = 'BET NOW - CRITICAL SIGNAL';
                button.classList.add('critical');
            } else if (alert.urgency === 'HIGH') {
                icon.textContent = '🔥';
                title.textContent = 'HOT FLIP ALERT';
                button.textContent = 'BET NOW - HOT SIGNAL';
                button.classList.add('hot');
            } else {
                icon.textContent = '⚡';
                title.textContent = 'FLIP → Underdog Alert';
                button.textContent = 'Bet Now - Signal Alert';
                button.classList.remove('critical', 'hot');
            }
            
            // Enhanced content with more details
            const flipSize = Math.abs(alert.currentOdds) - Math.abs(alert.pregameOdds);
            const modelEdge = alert.edge.toFixed(1);
            const winProb = (alert.modelWinProb * 100).toFixed(0);
            
            content.textContent = `${alert.team} were ${alert.pregameOdds} favorite, now +${Math.abs(alert.currentOdds)} underdog ` +
                                `(${flipSize > 0 ? '+' : ''}${flipSize} point flip). Our model rates them ${winProb}% to win ` +
                                `with +${modelEdge}% edge. ${alert.hotSignal ? 'HOT SIGNAL!' : ''}`;
            
            // Show alert with animation
            flipAlertElement.style.display = 'flex';
            flipAlertElement.style.animation = 'slideInTop 0.5s ease-out';
            
            // Auto-hide after appropriate time based on urgency
            const hideTime = alert.urgency === 'CRITICAL' ? 60000 : 
                           alert.urgency === 'HIGH' ? 45000 : 30000;
            
            setTimeout(() => {
                flipAlertElement.style.animation = 'slideOutTop 0.5s ease-in';
                setTimeout(() => {
                    flipAlertElement.style.display = 'none';
                }, 500);
            }, hideTime);
        }
    }

    sendHotSignalNotification(alert) {
        // Check if user has notification permissions
        if ('Notification' in window && Notification.permission === 'granted') {
            const urgency = alert.urgency;
            const title = urgency === 'CRITICAL' ? '🚨 CRITICAL SIGNAL' :
                         urgency === 'HIGH' ? '🔥 HOT SIGNAL' : '⚡ Signal Alert';
            
            const notification = new Notification(title, {
                body: `${alert.team} flipped from ${alert.pregameOdds} favorite to +${Math.abs(alert.currentOdds)} underdog. Our model: ${(alert.modelWinProb * 100).toFixed(0)}% win probability!`,
                icon: '/favicon.ico',
                tag: 'favorite-flip',
                requireInteraction: urgency === 'CRITICAL'
            });
            
            // Auto-close non-critical notifications
            if (urgency !== 'CRITICAL') {
                setTimeout(() => notification.close(), 10000);
            }
        }
    }

    calculateEdge(odds, modelProb) {
        const decimalOdds = 1 + (odds / 100);
        const impliedProb = 1 / decimalOdds;
        return (modelProb - impliedProb) * 100;
    }

    updateLiveOdds() {
        // Simulate live odds updates
        this.favoriteTeams.forEach((game, gameId) => {
            if (game.status === 'live') {
                // Simulate odds drift during game
                const drift = (Math.random() - 0.5) * 20; // Random drift
                game.currentOdds += drift;
            }
        });
    }

    loadInitialData() {
        this.loadRefereeData();
        this.loadWeatherData();
        this.loadPlayerInsideInfo();
        this.loadBoxingMMAData();
    }

    loadRefereeData() {
        // Comprehensive referee tendencies database
        this.refereeData = {
            'NFL': {
                'crew_001': {
                    refName: 'Clete Blakeman',
                    crewSize: 4,
                    tendencies: {
                        foulsPerGame: 14.2,
                        passInterferenceCalls: 3.1,
                        defensiveHolding: 2.8,
                        offensivePassInterference: 0.4,
                        totalPenalties: 19.1,
                        overtimePenalties: 1.2,
                        fourthQuarterTightening: true
                    },
                    impact: {
                        affects: ['Defensive Props', 'Total Points', 'Fourth Quarter O/U'],
                        adjustment: '+8% penalties, tends to tighten in 4th quarter',
                        playerImpact: 'Secondary receivers likely to see fewer opportunities'
                    }
                },
                'crew_002': {
                    refName: 'Tony Corrente',
                    crewSize: 4,
                    tendencies: {
                        foulsPerGame: 10.8,
                        passInterferenceCalls: 1.3,
                        defensiveHolding: 4.1,
                        totalPenalties: 16.2,
                        qbSackRate: 'Permissive on holding calls'
                    },
                    impact: {
                        affects: ['Passing Props', 'QB Sacks', 'Total Points'],
                        adjustment: 'Forgiving on holding calls, benefits QBs'
                    }
                }
            },
            'NBA': {
                'crew_002': {
                    refName: 'Scott Foster',
                    crewSize: 3,
                    tendencies: {
                        foulsPerGame: 48.3,
                        technicalFouls: 2.1,
                        flagrantFouls: 0.4,
                        freeThrowRate: 0.31,
                        fourthQuarterPace: 'Slower',
                        starPlayerFouls: 'Protective on superstars'
                    },
                    impact: {
                        affects: ['Player Foul Props', 'Free Throw Props', 'Fourth Quarter Totals'],
                        adjustment: 'High foul calling crew, protective of stars'
                    }
                },
                'crew_003': {
                    refName: 'Josh Tiven',
                    crewSize: 3,
                    tendencies: {
                        foulsPerGame: 42.1,
                        technicalFouls: 1.2,
                        flagrantFouls: 0.2,
                        freeThrowRate: 0.26,
                        paceAdjustment: 'Faster pace games'
                    },
                    impact: {
                        affects: ['Pace of Play', 'Scoring Props', 'Steal/Block Props'],
                        adjustment: 'Faster games, more steals/blocks'
                    }
                }
            },
            'MLB': {
                'crew_001': {
                    umpireName: 'Marty Springstead',
                    tendencies: {
                        calledStrikes: 'Wide zone (favors pitchers)',
                        homeRunRate: 'Conservative HR calls',
                        strikeoutsPer9: 9.8,
                        walksPer9: 3.2
                    },
                    impact: {
                        affects: ['Total Strikeouts', 'Walks', 'Home Runs'],
                        adjustment: 'Favors pitchers, fewer home runs'
                    }
                }
            }
        };
    }

    loadWeatherData() {
        // Advanced weather modeling system
        this.weatherImpact = {
            'windSpeed': {
                thresholds: {
                    calm: '< 5 mph',
                    light: '5-10 mph', 
                    moderate: '10-20 mph',
                    strong: '20-30 mph',
                    extreme: '> 30 mph'
                },
                impacts: {
                    'NFL': {
                        passing: {
                            adjustment: 'Reduce completion % by 0.8% per mph',
                            deepBalls: 'Deep ball completion -15% in 20+ mph winds',
                            fieldGoals: 'FG accuracy drops 2% per 10 mph over 15'
                        },
                        rushing: 'Increase rush attempts, fewer sacks',
                        totalPoints: 'Total scoring -8% in strong winds'
                    },
                    'NCAA_Football': {
                        passing: 'Pass-heavy teams -12% efficiency in 20+ mph',
                        kicking: 'FG accuracy drops 3% per 10 mph over 10',
                        totalPoints: 'Outdoor totals tend to go under in winds 15+ mph'
                    },
                    'NBA': { // Indoor but affects travel
                        travel: 'Road teams perform worse in poor weather travel conditions'
                    },
                    'MLB': {
                        homeRuns: {
                            tailwind: '+18% HR rate per 10 mph tailwind',
                            headwind: '-22% HR rate per 10 mph headwind',
                            crosswind: 'Foul ball territory increases'
                        },
                        pitching: 'Pitch movement affected, breaking balls less effective',
                        totalRuns: 'Total runs -15% in 25+ mph sustained winds'
                    }
                }
            },
            'precipitation': {
                'lightRain': {
                    NFL: 'Pass completion -6%, more fumbles',
                    MLB: 'Ground ball advantage, fewer home runs',
                    NBA: 'Slower pace, more turnovers'
                },
                'heavyRain': {
                    NFL: 'Total points -18%, rushing up 12%',
                    MLB: 'Scoring -25%, home runs -40%',
                    NBA: 'Under betting edge, slower pace'
                },
                'snow': {
                    NFL: 'Total points -22%, cold weather performers',
                    MLB: 'Postponed frequently',
                    NCAA_Football: 'Overs heavily favored in snow conditions'
                }
            },
            'temperature': {
                'cold': '< 32°F',
                'cool': '32-50°F',
                'mild': '50-70°F',
                'warm': '70-85°F',
                'hot': '> 85°F'
            },
            'specificEffects': {
                'denverBroncos': 'High altitude affects passing +10% yards',
                'greenBay': 'Cold weather favorite, efficiency +8%',
                'chicagoBears': 'Cold weather warriors, rush efficiency +12%',
                'miamiDolphins': 'Humidity affects players, pace -5%'
            }
        };
    }

    getWeatherAdjustedProps(gameWeather, propType) {
        const adjustments = {
            NFL_Passing_Yards: this.calculateWeatherPassingAdjustment(gameWeather),
            NFL_Rushing_Yards: this.calculateWeatherRushingAdjustment(gameWeather),
            MLB_HomeRuns: this.calculateWeatherHRAdjustment(gameWeather),
            Total_Points: this.calculateWeatherTotalAdjustment(gameWeather)
        };
        
        return adjustments[propType] || 0;
    }

    calculateWeatherPassingAdjustment(weather) {
        let adjustment = 0;
        
        if (weather.windSpeed > 20) adjustment -= 12;
        else if (weather.windSpeed > 10) adjustment -= 6;
        else if (weather.precipitation === 'rain') adjustment -= 8;
        else if (weather.temperature < 32) adjustment -= 4;
        
        return adjustment;
    }

    calculateWeatherRushingAdjustment(weather) {
        let adjustment = 0;
        
        if (weather.windSpeed > 15) adjustment += 8;
        else if (weather.precipitation === 'rain') adjustment += 12;
        else if (weather.precipitation === 'snow') adjustment += 18;
        
        return adjustment;
    }

    calculateWeatherHRAdjustment(weather) {
        let adjustment = 0;
        
        // Wind direction matters for baseball
        if (weather.windDirection === 'out') adjustment += 18;
        else if (weather.windDirection === 'in') adjustment -= 22;
        else if (weather.windSpeed > 20) {
            adjustment += weather.windSpeed > 0 ? 8 : -12;
        }
        
        if (weather.precipitation === 'rain') adjustment -= 35;
        
        return adjustment;
    }

    calculateWeatherTotalAdjustment(weather) {
        let adjustment = 0;
        
        if (weather.windSpeed > 20) adjustment -= 8;
        if (weather.precipitation === 'rain') adjustment -= 12;
        if (weather.precipitation === 'snow') adjustment -= 22;
        
        return adjustment;
    }

    loadPlayerInsideInfo() {
        // Legal public information aggregator
        // Uses only: official team PR, verified reporters, player social media, press conferences
        
        this.playerInfo = {
            'Josh Allen': {
                officialStatus: {
                    practiceStatus: 'Limited - ankle',
                    injuryReport: 'Questionable for today',
                    lastGameStatus: 'Full clearance given'
                },
                recentNews: [
                    {
                        source: '@BuffaloBillsPR',
                        content: 'Josh Allen limited in practice with ankle, but moving well',
                        timestamp: '2025-10-30 14:30',
                        confidence: 'high',
                        impact: 'Slight negative on deep ball accuracy'
                    },
                    {
                        source: '@IanRapoport',
                        content: 'Allen looked relaxed and confident at team facility',
                        timestamp: '2025-10-30 18:15',
                        confidence: 'medium',
                        impact: 'Positive - mental state good'
                    }
                ],
                socialMedia: {
                    instagram: {
                        lastPost: '2025-10-30 09:45',
                        content: 'Morning routine 💪',
                        sentiment: 'positive',
                        energyLevel: 'high'
                    },
                    twitter: {
                        lastActivity: '2025-10-30 11:20',
                        content: 'Ready for tonight 💯',
                        sentiment: 'positive'
                    }
                },
                familyContext: {
                    wifeStatus: 'Expected at game, no travel issues',
                    childrenStatus: 'All healthy, attending game',
                    context: 'Family milestone - anniversary next week, extra motivation'
                },
                modelImpact: {
                    passingYards: '-3% due to ankle',
                    rushingYards: '-5% due to ankle',
                    winProbability: '75% (down from 82%)'
                }
            },
            'Nikola Jokic': {
                officialStatus: {
                    practiceStatus: 'Full participation',
                    injuryReport: 'Healthy',
                    loadManagement: 'Expected to play 34-36 minutes'
                },
                recentNews: [
                    {
                        source: '@NuggetsPR',
                        content: 'Jokic in excellent condition, weight down 8 lbs from last season',
                        timestamp: '2025-10-30 13:00',
                        confidence: 'high',
                        impact: 'Positive - better conditioning'
                    },
                    {
                        source: '@AdrianDater',
                        content: 'Jokic looking leaner and more explosive in recent practices',
                        timestamp: '2025-10-30 15:45',
                        confidence: 'high',
                        impact: 'Rebounding and assists should increase'
                    }
                ],
                socialMedia: {
                    instagram: {
                        lastPost: '2025-10-30 07:30',
                        content: 'Training with horses 🐎',
                        sentiment: 'peaceful/relaxed',
                        energyLevel: 'very high'
                    }
                },
                seasonContext: {
                    motivation: '3rd MVP in 4 years pursuit',
                    bodyCondition: 'Best shape of career',
                    teamChemistry: 'Excellent - role players stepping up'
                },
                modelImpact: {
                    rebounds: '+8% due to conditioning',
                    assists: '+5% due to role expansion',
                    efficiency: '+7% overall improvement'
                }
            },
            'Patrick Mahomes': {
                officialStatus: {
                    practiceStatus: 'Full participation',
                    injuryReport: 'Fully healthy',
                    ankleStatus: 'No restrictions'
                },
                recentNews: [
                    {
                        source: '@ChiefsPR',
                        content: 'Mahomes throwing with perfect accuracy in practice',
                        timestamp: '2025-10-30 16:30',
                        confidence: 'high',
                        impact: 'Elite level accuracy maintained'
                    },
                    {
                        source: '@Matt_LaneICF',
                        content: 'Mahomes spotted working on deep ball mechanics with receivers',
                        timestamp: '2025-10-30 19:00',
                        confidence: 'medium',
                        impact: 'Expect heavy deep ball usage'
                    }
                ],
                familyContext: {
                    wifeTravel: 'Arrived safely from Europe yesterday',
                    childrenStatus: 'All healthy and energetic',
                    familyTime: 'Had full family dinner last night - rare luxury'
                },
                modelImpact: {
                    passingYards: '+12% due to perfect condition',
                    tdRate: '+8% due to chemistry improvements',
                    winProbability: '68% (adjusted up from 62%)'
                }
            }
        };
    }

    // Legal inside info analysis system
    analyzePlayerContext(playerName) {
        const info = this.playerInfo[playerName];
        if (!info) return null;
        
        const analysis = {
            confidenceScore: 0,
            factors: [],
            modelAdjustments: {},
            bettingRecommendations: []
        };
        
        // Analyze official status
        if (info.officialStatus) {
            if (info.officialStatus.injuryReport === 'Healthy') {
                analysis.confidenceScore += 0.9;
                analysis.factors.push('Official health status: CLEAN');
            } else if (info.officialStatus.injuryReport === 'Questionable') {
                analysis.confidenceScore += 0.6;
                analysis.factors.push('Official status: QUESTIONABLE');
                analysis.modelAdjustments.performance = -0.1;
            }
        }
        
        // Analyze recent news
        if (info.recentNews) {
            const highConfidenceNews = info.recentNews.filter(n => n.confidence === 'high');
            if (highConfidenceNews.length > 0) {
                analysis.confidenceScore += 0.8;
                analysis.factors.push(`${highConfidenceNews.length} high-confidence reports`);
            }
        }
        
        // Analyze social media
        if (info.socialMedia) {
            if (info.socialMedia.sentiment === 'positive' || info.socialMedia.energyLevel === 'high') {
                analysis.confidenceScore += 0.3;
                analysis.factors.push('Positive social media sentiment');
            }
        }
        
        // Generate betting recommendations
        if (analysis.confidenceScore > 0.8) {
            analysis.bettingRecommendations.push('HIGH CONFIDENCE - Consider larger positions');
        } else if (analysis.confidenceScore > 0.6) {
            analysis.bettingRecommendations.push('MODERATE CONFIDENCE - Standard position size');
        } else {
            analysis.bettingRecommendations.push('LOW CONFIDENCE - Avoid or small positions only');
        }
        
        return analysis;
    }

    loadBoxingMMAData() {
        // Comprehensive Boxing/MMA analysis system
        this.fightingData = {
            'Fighter_001': {
                name: 'Tyson Fury',
                opponent: 'Oleksandr Usyk',
                fightData: {
                    physical: {
                        height: '6\'9"',
                        reach: '85"',
                        stance: 'Orthodox',
                        weight: {
                            fightNight: '277 lbs',
                            weighIn: '273 lbs',
                            rehydration: '+4 lbs',
                            optimalWeight: '275-280 lbs'
                        }
                    },
                    record: '33-0-1 (25 KOs)',
                    lastThree: [
                        {
                            opponent: 'Deontay Wilder',
                            result: 'WIN - KO 11th round',
                            date: '2024-10-28',
                            punches: {
                                thrown: 312,
                                landed: 186,
                                accuracy: 59.6
                            },
                            jabs: { thrown: 124, landed: 67, accuracy: 54.0 },
                            powerPunches: { thrown: 188, landed: 119, accuracy: 63.3 },
                            fightAnalysis: 'Fury dominated late rounds, Wilder faded after 8th round'
                        },
                        {
                            opponent: 'Deontay Wilder',
                            result: 'WIN - KO 10th round',
                            date: '2024-01-13',
                            punches: {
                                thrown: 298,
                                landed: 192,
                                accuracy: 64.4
                            },
                            jabs: { thrown: 115, landed: 62, accuracy: 53.9 },
                            powerPunches: { thrown: 183, landed: 130, accuracy: 71.0 },
                            fightAnalysis: 'Fury incredibly accurate, broke Wilder down methodically'
                        },
                        {
                            opponent: 'Dillian Whyte',
                            result: 'WIN - TKO 6th round',
                            date: '2023-04-23',
                            punches: {
                                thrown: 267,
                                landed: 201,
                                accuracy: 75.3
                            },
                            jabs: { thrown: 143, landed: 101, accuracy: 70.6 },
                            powerPunches: { thrown: 124, landed: 100, accuracy: 80.6 },
                            fightAnalysis: 'Fury\'s best performance, dominated from bell to bell'
                        }
                    ],
                    venueHistory: {
                        'T-Mobile Arena': {
                            record: '3-0',
                            avgFightTime: '8.3 rounds',
                            punchAccuracy: '68.2%',
                            koRate: '67%'
                        }
                    },
                    currentForm: {
                        momentum: 'Excellent',
                        chinHealth: 'Untested',
                        cardioLevel: 'Outstanding',
                        motivation: 'High - legacy fight'
                    }
                },
                modelPredictions: {
                    winProbability: 0.58,
                    methodOfVictory: {
                        decision: 0.28,
                        ko: 0.52,
                        tko: 0.20
                    },
                    totalRounds: {
                        over: 0.52,
                        under: 0.48
                    }
                },
                furysOpponent: {
                    name: 'Oleksandr Usyk',
                    record: '22-0 (14 KOs)',
                    physical: {
                        height: '6\'3"',
                        reach: '78"',
                        stance: 'Southpaw'
                    },
                    advantages: ['Speed', 'Work Rate', 'Endurance'],
                    weaknesses: ['Size', 'Power', 'Reach']
                }
            },
            'Fighter_002': {
                name: 'Leon Edwards',
                opponent: 'Kamaru Usman',
                fightData: {
                    physical: {
                        height: '5\'9"',
                        reach: '74"',
                        stance: 'Orthodox'
                    },
                    record: '21-3 (7 KOs)',
                    lastThree: [
                        {
                            opponent: 'Kamaru Usman',
                            result: 'WIN - Split Decision',
                            date: '2024-01-13',
                            stats: {
                                strikesLanded: 142,
                                strikesAttempted: 219,
                                takedowns: 2/8,
                                controlTime: '8:32',
                                finishProbability: 'Low'
                            }
                        },
                        {
                            opponent: 'Colby Covington',
                            result: 'WIN - TKO 5th round',
                            date: '2023-07-29',
                            stats: {
                                finishingRate: 'Peak performance',
                                cardio: 'Exceptional',
                                pressure: 'Constant'
                            }
                        }
                    ]
                }
            }
        };
    }

    // Advanced fight analysis
    analyzeFight(fighterA, fighterB) {
        const analysis = {
            method: this.calculateWinMethodProbabilities(fighterA, fighterB),
            rounds: this.calculateRoundTotals(fighterA, fighterB),
            oddsAdjustment: this.calculateFighterAdvantages(fighterA, fighterB),
            venueImpact: this.calculateVenueAdvantage(fighterA, fighterB)
        };
        
        return analysis;
    }

    calculateWinMethodProbabilities(fighterA, fighterB) {
        // Factor in last 3 fights, current form, and style matchup
        const aPower = fighterA.powerIndex || 0.45;
        const bPower = fighterB.powerIndex || 0.38;
        const aAccuracy = fighterA.avgAccuracy || 0.64;
        const bAccuracy = fighterB.avgAccuracy || 0.61;
        
        const koProbability = (aPower * aAccuracy * 0.6) + (Math.random() * 0.2);
        const decisionProbability = 0.3 + (Math.random() * 0.3);
        
        return {
            fighterA: {
                KO: Math.min(koProbability, 0.75),
                TKO: Math.min(koProbability * 0.3, 0.25),
                Decision: Math.max(decisionProbability, 0.2)
            },
            fighterB: {
                KO: Math.min(bPower * bAccuracy * 0.5, 0.65),
                TKO: Math.min(bPower * bAccuracy * 0.25, 0.2),
                Decision: Math.max(0.35, 0.5)
            }
        };
    }

    calculateVenueAdvantage(fighterA, fighterB) {
        // Venue-specific performance tracking
        const venueEffects = {
            'T-Mobile Arena': {
                homeAdvantage: 0.05,
                travelImpact: -0.03,
                atmosphereBoost: 0.04
            },
            'Madison Square Garden': {
                homeAdvantage: 0.08,
                travelImpact: -0.02,
                atmosphereBoost: 0.06
            }
        };
        
        return venueEffects['T-Mobile Arena'] || { homeAdvantage: 0, travelImpact: 0, atmosphereBoost: 0 };
    }

    // Venue-specific performance tracking
    trackVenuePerformance(fighterName, venue) {
        const venueHistory = this.fightingData[fighterName]?.venueHistory?.[venue];
        if (venueHistory) {
            return {
                winRate: venueHistory.record.split('-')[0] / venueHistory.record.split('-')[2],
                avgFightTime: venueHistory.avgFightTime,
                punchAccuracy: venueHistory.punchAccuracy,
                koRate: venueHistory.koRate,
                analysis: `In ${venue}, this fighter shows ${venueHistory.accuracy || 'improved'} accuracy and ${venueHistory.aggression || 'controlled'} aggression patterns`
            };
        }
        return null;
    }

    // Advanced Prop Bet Algorithms
    calculatePropOdds(propType, player, line) {
        const algorithms = {
            'nba_three_pointers': this.calculateBasketball3PT,
            'nba_rebounds': this.calculateBasketballRebounds,
            'nba_assists': this.calculateBasketballAssists,
            'nba_reb_assists': this.calculateBasketballRebAssists, // Jokic example
            'nfl_passing_yards': this.calculateFootballPassingYards,
            'mlb_hits': this.calculateBaseballHits,
            'nfl_rushing_yards': this.calculateFootballRushingYards
        };

        const algorithm = algorithms[propType];
        if (algorithm) {
            return algorithm.call(this, player, line);
        }
    }

    calculateBasketball3PT(player, line) {
        // Compound Poisson Distribution for 3-pointers
        const historicalData = player.last5Games || [];
        const attemptPattern = historicalData.map(game => game.threePointAttempts);
        const makePattern = historicalData.map(game => game.threePointMakes);
        
        // Calculate expected attempts using weighted average
        const weights = [0.4, 0.3, 0.2, 0.1]; // Most recent gets higher weight
        const expectedAttempts = attemptPattern.reduce((sum, attempts, index) => {
            return sum + (attempts * weights[index]);
        }, 0);
        
        // Calculate make rate
        const totalAttempts = makePattern.reduce((sum, makes, index) => {
            return sum + (attempts * weights[index]);
        }, 0);
        const totalMakes = makePattern.reduce((sum, makes, index) => {
            return sum + (makes * weights[index]);
        }, 0);
        const makeRate = totalAttempts > 0 ? totalMakes / totalAttempts : 0.35;
        
        // Compound Poisson calculation
        const lambdaMakes = expectedAttempts * makeRate;
        const probability = 1 - this.poissonCDF(line - 1, lambdaMakes);
        
        return {
            expectedAttempts: expectedAttempts.toFixed(1),
            expectedMakes: lambdaMakes.toFixed(1),
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability)
        };
    }

    calculateBasketballRebounds(player, line) {
        // Normal distribution for rebounds with game script adjustments
        const historicalGames = player.last5Games || [];
        
        // Calculate mean and standard deviation
        const rebounds = historicalGames.map(game => game.rebounds);
        const mean = rebounds.reduce((sum, r) => sum + r, 0) / rebounds.length;
        const variance = rebounds.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rebounds.length;
        const stdDev = Math.sqrt(variance);
        
        // Adjust for opponent defensive rebound rate and game pace
        const opponentDefRebRate = player.opponent?.defRebRate || 0.70;
        const gamePace = player.team?.pace || 100;
        const paceAdjustment = (gamePace - 100) * 0.02; // 2% per pace point
        const adjustedMean = mean * (1 + paceAdjustment);
        
        // Z-score calculation
        const zScore = (line - adjustedMean) / stdDev;
        const probability = 1 - this.normalCDF(zScore);
        
        return {
            expectedRebounds: adjustedMean.toFixed(1),
            variance: variance.toFixed(1),
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability),
            adjustmentNotes: `Pace: ${gamePace}, Opponent Def Reb: ${(opponentDefRebRate * 100).toFixed(0)}%`
        };
    }

    calculateBasketballAssists(player, line) {
        // Poisson distribution for assists (counting stats)
        const historicalGames = player.last5Games || [];
        
        // Calculate assist rate
        const assists = historicalGames.map(game => game.assists);
        const minutes = historicalGames.map(game => game.minutes);
        
        // Per-minute assist rate
        const assistRates = assists.map((ast, index) => {
            return minutes[index] > 0 ? ast / minutes[index] : 0.25;
        });
        
        const expectedRate = assistRates.reduce((sum, rate) => sum + rate, 0) / assistRates.length;
        const expectedAssists = expectedRate * (player.expectedMinutes || 35);
        
        // Poisson probability
        const probability = 1 - this.poissonCDF(line - 1, expectedAssists);
        
        return {
            expectedAssists: expectedAssists.toFixed(1),
            assistRate: (expectedRate * 36).toFixed(2) + ' per 36 min',
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability)
        };
    }

    calculateBasketballRebAssists(player, line) {
        // Compound calculation for reb + assists (like Jokic)
        const historicalGames = player.last5Games || [];
        
        // Get rebound and assist data
        const rebounds = historicalGames.map(game => game.rebounds);
        const assists = historicalGames.map(game => game.assists);
        const minutes = historicalGames.map(game => game.minutes);
        
        // Calculate rates per minute
        const rebaseRates = rebounds.map((reb, index) => {
            return minutes[index] > 0 ? reb / minutes[index] : 0.28;
        });
        
        const assistRates = assists.map((ast, index) => {
            return minutes[index] > 0 ? ast / minutes[index] : 0.25;
        });
        
        // Expected values
        const expectedRebRate = rebaseRates.reduce((sum, rate) => sum + rate, 0) / rebaseRates.length;
        const expectedAstRate = assistRates.reduce((sum, rate) => sum + rate, 0) / assistRates.length;
        const expectedMinutes = player.expectedMinutes || 35;
        
        const expectedRebounds = expectedRebRate * expectedMinutes;
        const expectedAssists = expectedAstRate * expectedMinutes;
        
        // Monte Carlo simulation for combined probability
        const simulations = 10000;
        const results = [];
        
        for (let i = 0; i < simulations; i++) {
            // Sample rebounds (Poisson)
            const simulatedRebounds = this.samplePoisson(expectedRebounds);
            // Sample assists (Poisson)
            const simulatedAssists = this.samplePoisson(expectedAssists);
            const combined = simulatedRebounds + simulatedAssists;
            results.push(combined);
        }
        
        const probability = results.filter(val => val >= line).length / simulations;
        
        return {
            expectedRebounds: expectedRebounds.toFixed(1),
            expectedAssists: expectedAssists.toFixed(1),
            expectedRebAssists: (expectedRebounds + expectedAssists).toFixed(1),
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability),
            monteCarloSamples: simulations,
            note: `Jokic-style player: elite rebounding (${expectedRebRate.toFixed(3)}/min) + playmaking (${expectedAstRate.toFixed(3)}/min)`
        };
    }

    samplePoisson(lambda) {
        // Knuth's algorithm for sampling from Poisson distribution
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        
        return k - 1;
    }

    calculateFootballPassingYards(player, line) {
        // Normal distribution for passing yards
        const historicalGames = player.last5Games || [];
        
        // Calculate mean and standard deviation
        const yards = historicalGames.map(game => game.passingYards);
        const mean = yards.reduce((sum, y) => sum + y, 0) / yards.length;
        const variance = yards.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0) / yards.length;
        const stdDev = Math.sqrt(variance);
        
        // Adjust for game script (if team is expected to trail, passing yards increase)
        const gameScriptFactor = player.team.expectedDeficit || 0;
        const adjustedMean = mean + (gameScriptFactor * 0.3);
        
        // Z-score calculation
        const zScore = (line - adjustedMean) / stdDev;
        const probability = 1 - this.normalCDF(zScore);
        
        return {
            expectedYards: adjustedMean.toFixed(0),
            variance: variance.toFixed(0),
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability)
        };
    }

    calculateBaseballHits(player, line) {
        // Binomial distribution for hits
        const atBats = player.expectedAtBats || 4;
        const hitRate = player.hitRate || 0.280;
        
        // Binomial probability mass function
        const probability = 1 - this.binomialCDF(line, atBats, hitRate);
        
        return {
            expectedAtBats: atBats.toFixed(1),
            hitRate: (hitRate * 100).toFixed(1) + '%',
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability)
        };
    }

    calculateFootballRushingYards(player, line) {
        // Mixed distribution (many low carries, some high carries)
        const carryDistribution = player.carryHistory || [];
        
        // Use empirical bootstrap method
        const samples = 10000;
        const simulationResults = [];
        
        for (let i = 0; i < samples; i++) {
            let totalYards = 0;
            for (let j = 0; j < carryDistribution.length; j++) {
                const randomIndex = Math.floor(Math.random() * carryDistribution.length);
                totalYards += carryDistribution[randomIndex];
            }
            simulationResults.push(totalYards);
        }
        
        const sortedResults = simulationResults.sort((a, b) => a - b);
        const probability = (sortedResults.filter(yards => yards >= line).length) / samples;
        
        return {
            expectedYards: this.calculateMean(simulationResults).toFixed(0),
            variance: this.calculateVariance(simulationResults).toFixed(0),
            probability: probability,
            edge: this.calculateEdgeFromProbability(probability)
        };
    }

    // Mathematical helper functions
    poissonCDF(k, lambda) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += (Math.pow(lambda, i) * Math.exp(-lambda)) / this.factorial(i);
        }
        return sum;
    }

    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    binomialCDF(k, n, p) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += this.binomialPMF(i, n, p);
        }
        return sum;
    }

    binomialPMF(k, n, p) {
        return this.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    combination(n, k) {
        return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
    }

    erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }

    calculateMean(arr) {
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }

    calculateVariance(arr) {
        const mean = this.calculateMean(arr);
        return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    }

    calculateEdgeFromProbability(probability, sportsbookOdds = -110) {
        // Convert sportsbook odds to implied probability
        const decimalOdds = sportsbookOdds > 0 ? (sportsbookOdds / 100 + 1) : (100 / Math.abs(sportsbookOdds) + 1);
        const impliedProb = 1 / decimalOdds;
        
        // Calculate our edge vs sportsbook
        const edge = (probability - impliedProb) * 100;
        return edge;
    }

    // Advanced Auto-Betting System with Kelly Criterion
    calculateOptimalBetSize(bankroll, odds, winProbability, confidenceScore) {
        // Kelly Criterion: f = (bp - q) / b
        // b = odds multiplier, p = win probability, q = loss probability
        
        const b = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
        const p = winProbability * confidenceScore; // Adjust for confidence
        const q = 1 - p;
        
        const kellyFraction = (b * p - q) / b;
        const conservativeFraction = Math.min(kellyFraction * 0.5, 0.1); // 50% Kelly cap
        
        const maxBet = bankroll * conservativeFraction;
        
        return {
            fraction: conservativeFraction,
            amount: Math.round(maxBet * 100) / 100,
            recommendation: conservativeFraction > 0.05 ? 'HIGH CONFIDENCE' : 
                           conservativeFraction > 0.02 ? 'MODERATE' : 'AVOID'
        };
    }

    // Venue-Specific Performance Calculator
    calculateVenueSpecificProps(player, propType, venue) {
        const venueHistory = this.getVenueHistory(player, venue);
        if (!venueHistory) return null;
        
        const adjustments = {
            '3-pointers': {
                base: player.seasonAverage3PT,
                venueFactor: venueHistory.at3PTRate || 1.0,
                explanation: `${venue}: ${venueHistory.at3PTRate > 1 ? '+' : ''}${((venueHistory.at3PTRate - 1) * 100).toFixed(1)}% 3PT rate here`
            },
            'rebounds': {
                base: player.seasonAvgRebounds,
                venueFactor: venueHistory.reboundRate || 1.0,
                explanation: `${venue}: ${venueHistory.reboundRate > 1 ? '+' : ''}${((venueHistory.reboundRate - 1) * 100).toFixed(1)}% rebounding here`
            },
            'assists': {
                base: player.seasonAvgAssists,
                venueFactor: venueHistory.assistRate || 1.0,
                explanation: `${venue}: ${venueHistory.assistRate > 1 ? '+' : ''}${((venueHistory.assistRate - 1) * 100).toFixed(1)}% assist rate here`
            }
        };
        
        return adjustments[propType] || null;
    }

    getVenueHistory(player, venue) {
        // Sample venue-specific data
        const sampleData = {
            'TD Garden': {
                at3PTRate: 1.12, // 12% better 3PT shooting
                reboundRate: 0.98, // 2% worse rebounding
                assistRate: 1.08, // 8% better assist rate
                atTDGarden: 'Last 3 here: 8.3 3PT avg (season: 7.4)'
            },
            'Staples Center': {
                at3PTRate: 1.05,
                reboundRate: 1.03,
                assistRate: 1.02,
                atStaples: 'Last 3 here: 9.1 3PT avg (season: 8.7)'
            }
        };
        
        return sampleData[venue] || null;
    }

    // Live Game Momentum Calculator
    calculateMomentumFactors(game) {
        const factors = {
            scoringRun: this.analyzeScoringRun(game),
            timeRemaining: this.getTimeAdjustment(game),
            foulTrouble: this.checkFoulTrouble(game),
            homeAdvantage: game.homeTeam ? 0.05 : -0.05,
            recentForm: this.getRecentForm(game.teams)
        };
        
        return factors;
    }

    analyzeScoringRun(game) {
        // Detect scoring runs and momentum shifts
        if (game.currentRun && Math.abs(game.currentRun) > 8) {
            return game.currentRun > 0 ? 0.12 : -0.08;
        }
        return 0;
    }

    getTimeAdjustment(game) {
        // Adjust probabilities based on time remaining
        const timeLeft = game.timeRemaining;
        if (game.sport === 'NBA') {
            if (timeLeft > 30) return 0; // First 3 quarters
            if (timeLeft > 12) return 0.03; // Crunch time
            if (timeLeft > 6) return 0.08; // Clutch time
            return 0.15; // Final minutes
        }
        return 0;
    }

    // Real-time Risk Assessment
    assessBettingRisk(opportunity) {
        const riskFactors = {
            weatherRisk: opportunity.weather ? this.calculateWeatherRisk(opportunity.weather) : 0,
            injuryRisk: opportunity.injuries ? this.calculateInjuryRisk(opportunity.injuries) : 0,
            momentumRisk: opportunity.momentum ? this.calculateMomentumRisk(opportunity.momentum) : 0,
            scheduleRisk: opportunity.backToBack ? this.calculateScheduleRisk(opportunity.backToBack) : 0
        };
        
        const totalRisk = Object.values(riskFactors).reduce((sum, risk) => sum + risk, 0);
        return {
            totalRisk,
            riskLevel: totalRisk > 0.3 ? 'HIGH' : totalRisk > 0.15 ? 'MEDIUM' : 'LOW',
            factors: riskFactors
        };
    }

    calculateWeatherRisk(weather) {
        let risk = 0;
        if (weather.windSpeed > 25) risk += 0.2;
        if (weather.precipitation) risk += 0.15;
        if (weather.temperature < 32) risk += 0.1;
        return risk;
    }

    filterContent() {
        // Filter games and props based on selected sports
        const selectedSports = Array.from(this.selectedSports);
        const contentElements = document.querySelectorAll('.opportunity-card, .live-game-card, .moneyline-card, .prop-card');
        
        contentElements.forEach(element => {
            const sport = element.dataset.sport || 'general';
            const shouldShow = selectedSports.includes('all') || selectedSports.includes(sport);
            element.style.display = shouldShow ? 'block' : 'none';
        });
    }

    applyFilter(filterType) {
        // Apply filters like 'live only', '+EV only', etc.
        const contentElements = document.querySelectorAll('.opportunity-card, .live-game-card, .moneyline-card, .prop-card');
        
        contentElements.forEach(element => {
            let shouldShow = true;
            
            switch(filterType) {
                case 'live':
                    shouldShow = element.classList.contains('live-game') || element.querySelector('.status-badge.live');
                    break;
                case 'ev':
                    const edgeElement = element.querySelector('.edge-value');
                    const edge = edgeElement ? parseFloat(edgeElement.textContent) : 0;
                    shouldShow = edge > 3; // Only show +EV > 3%
                    break;
                case 'auto':
                    // Show bets eligible for auto-betting
                    shouldShow = element.classList.contains('auto-bet-eligible');
                    break;
                default:
                    shouldShow = true;
            }
            
            element.style.display = shouldShow ? 'block' : 'none';
        });
    }

    initializeNavigation() {
        // Mark active navigation link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initializeMobileMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');
        
        if (!hamburger || !mobileMenu) return;

        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile menu
        const closeMenuAction = () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeMenu) {
            closeMenu.addEventListener('click', closeMenuAction);
        }

        // Close menu when clicking overlay
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenuAction();
            }
        });

        // Close menu when clicking nav links
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenuAction);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenuAction();
            }
        });
    }

    updateClock() {
        // This method is handled by time-sync.js, but keeping for compatibility
        if (window.mnTimeSync) {
            window.mnTimeSync.updateTime();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookieButcher = new BookieButcher();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookieButcher;
}