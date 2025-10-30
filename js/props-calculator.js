// Props Calculator with Mathematical Models
class PropsCalculator {
    constructor() {
        this.currentCalculation = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        const calcBtn = document.getElementById('calcBtn');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.calculateProp());
        }

        // Auto-calculate when inputs change
        const inputs = ['playerName', 'sportSelect', 'statType', 'currentLine'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.autoCalculate());
            }
        });
    }

    loadInitialData() {
        // Load Nikola Jokic as example
        this.calculateProp('Nikola Jokic', 'nba', 'rebounds_assists', 22.5);
    }

    calculateProp() {
        const playerName = document.getElementById('playerName').value;
        const sport = document.getElementById('sportSelect').value;
        const statType = document.getElementById('statType').value;
        const currentLine = parseFloat(document.getElementById('currentLine').value);

        if (!playerName || !currentLine) {
            this.showError('Please fill in all fields');
            return;
        }

        this.currentCalculation = this.performCalculation(playerName, sport, statType, currentLine);
        this.displayResults(this.currentCalculation);
    }

    autoCalculate() {
        // Auto-calculate after 2 seconds of inactivity
        clearTimeout(this.autoTimer);
        this.autoTimer = setTimeout(() => {
            this.calculateProp();
        }, 2000);
    }

    performCalculation(playerName, sport, statType, currentLine) {
        const playerData = this.getPlayerHistoricalData(playerName, sport);
        
        let expectedValue, probability, confidence, edge, prediction;
        
        switch (statType) {
            case 'rebounds_assists':
                expectedValue = this.calculateReboundsAssists(playerData);
                probability = this.calculatePoissonProbability(expectedValue, currentLine);
                prediction = probability > 0.5 ? 'OVER' : 'UNDER';
                break;
                
            case 'points':
                expectedValue = this.calculatePoints(playerData);
                probability = this.calculateNormalProbability(expectedValue, 8.5, currentLine);
                prediction = probability > 0.5 ? 'OVER' : 'UNDER';
                break;
                
            case 'assists':
                expectedValue = this.calculateAssists(playerData);
                probability = this.calculatePoissonProbability(expectedValue, currentLine);
                prediction = probability > 0.5 ? 'OVER' : 'UNDER';
                break;
                
            case 'rebounds':
                expectedValue = this.calculateRebounds(playerData);
                probability = this.calculatePoissonProbability(expectedValue, currentLine);
                prediction = probability > 0.5 ? 'OVER' : 'UNDER';
                break;
                
            default:
                expectedValue = playerData.average || currentLine;
                probability = 0.5;
                prediction = 'OVER';
        }

        // Calculate edge percentage
        edge = this.calculateEdge(probability, currentLine, playerName, statType);
        
        // Determine confidence level
        confidence = this.determineConfidence(playerData, probability);
        
        return {
            playerName,
            sport,
            statType,
            currentLine,
            expectedValue,
            probability,
            prediction,
            edge,
            confidence,
            playerData
        };
    }

    calculateReboundsAssists(playerData) {
        const expectedRebounds = this.calculateRebounds(playerData);
        const expectedAssists = this.calculateAssists(playerData);
        return expectedRebounds + expectedAssists;
    }

    calculatePoints(playerData) {
        // Historical scoring average with adjustments
        let base = playerData.seasonAvg || 20.0;
        
        // Home field advantage
        if (playerData.home) base *= 1.08;
        
        // Recent trend adjustment
        const trend = playerData.recentTrend || 0;
        base *= (1 + trend / 100);
        
        // Matchup adjustment
        const matchup = playerData.matchupAdj || 0;
        base += matchup;
        
        return base;
    }

    calculateAssists(playerData) {
        // Poisson distribution for assists
        let base = playerData.assistsAvg || 5.0;
        
        // Team pace adjustment
        const pace = playerData.teamPace || 100;
        base *= (pace / 100);
        
        // Usage rate adjustment
        const usage = playerData.usageRate || 25;
        base *= (usage / 25);
        
        return base;
    }

    calculateRebounds(playerData) {
        // Poisson distribution for rebounds
        let base = playerData.reboundsAvg || 8.0;
        
        // Minutes played factor
        const minutes = playerData.minutesPerGame || 35;
        base *= (minutes / 35);
        
        // Opponent rebounding defense
        const oppDef = playerData.oppRebDef || 1.0;
        base *= (1 / oppDef);
        
        return base;
    }

    calculatePoissonProbability(lambda, line) {
        // P(X >= line) for Poisson distribution
        let probability = 0;
        const maxK = Math.ceil(line + 4 * Math.sqrt(lambda));
        
        for (let k = Math.ceil(line); k <= maxK; k++) {
            probability += this.poissonPMF(k, lambda);
        }
        
        return Math.min(probability, 0.99); // Cap at 99%
    }

    calculateNormalProbability(mean, stdDev, line) {
        // P(X >= line) for Normal distribution
        const z = (line - mean) / stdDev;
        return 1 - this.normalCDF(z);
    }

    poissonPMF(k, lambda) {
        return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
    }

    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        // Abramowitz and Stegun approximation
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    calculateEdge(probability, line, playerName, statType) {
        // Edge = (Model Probability - Implied Probability) * 100
        const impliedProb = this.calculateImpliedProbability(line);
        const modelProb = probability * 100;
        const edge = modelProb - impliedProb;
        
        return Math.round(edge * 10) / 10; // Round to 1 decimal
    }

    calculateImpliedProbability(line) {
        // Convert American odds to implied probability
        if (line > 0) {
            return 100 / (line + 100) * 100;
        } else {
            return Math.abs(line) / (Math.abs(line) + 100) * 100;
        }
    }

    determineConfidence(playerData, probability) {
        const sampleSize = playerData.sampleSize || 10;
        const consistency = playerData.consistency || 0.7;
        
        let confidence = 'Low';
        
        if (sampleSize >= 15 && consistency >= 0.8 && Math.abs(probability - 0.5) > 0.2) {
            confidence = 'Very High';
        } else if (sampleSize >= 10 && consistency >= 0.7 && Math.abs(probability - 0.5) > 0.15) {
            confidence = 'High';
        } else if (sampleSize >= 5 && consistency >= 0.6 && Math.abs(probability - 0.5) > 0.1) {
            confidence = 'Medium';
        }
        
        return confidence;
    }

    getPlayerHistoricalData(playerName, sport) {
        // Mock historical data - in real app, this would come from API
        const database = {
            'Nikola Jokic': {
                seasonAvg: 24.5,
                reboundsAvg: 11.1,
                assistsAvg: 9.3,
                minutesPerGame: 34.6,
                home: true,
                recentTrend: 8.7,
                sampleSize: 25,
                consistency: 0.82,
                teamPace: 97.8,
                usageRate: 28.3,
                oppRebDef: 0.95,
                matchupAdj: 2.1,
                lastGames: [25, 23, 28, 19, 26, 24, 22, 27, 21, 25]
            },
            'Josh Allen': {
                seasonAvg: 264.2,
                passingAttempts: 35.2,
                completionRate: 0.672,
                recentTrend: 5.2,
                sampleSize: 20,
                consistency: 0.76,
                home: true,
                weather: 'Dome',
                opponentYardsAllowed: 285.3,
                lastGames: [298, 247, 312, 223, 286, 255, 274, 301, 234, 289]
            }
        };

        return database[playerName] || this.generateDefaultData(playerName);
    }

    generateDefaultData(playerName) {
        return {
            seasonAvg: 20.0,
            reboundsAvg: 8.0,
            assistsAvg: 5.0,
            minutesPerGame: 32.0,
            home: true,
            recentTrend: 0,
            sampleSize: 10,
            consistency: 0.7
        };
    }

    displayResults(calc) {
        const resultsContainer = document.getElementById('calcResults');
        if (!resultsContainer) return;

        const directionClass = calc.prediction === 'OVER' ? 'over' : 'under';
        const edgeClass = calc.edge > 5 ? 'high-edge' : calc.edge > 0 ? 'positive-edge' : 'negative-edge';
        
        resultsContainer.innerHTML = `
            <div class="calc-result-card ${edgeClass}">
                <div class="result-header">
                    <h3>${calc.playerName} - ${this.formatStatType(calc.statType)}</h3>
                    <span class="confidence-badge ${calc.confidence.toLowerCase().replace(' ', '-')}">${calc.confidence}</span>
                </div>
                
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Current Line</span>
                        <span class="value">${calc.currentLine}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Expected Value</span>
                        <span class="value">${calc.expectedValue.toFixed(1)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Probability</span>
                        <span class="value">${(calc.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Prediction</span>
                        <span class="value prediction ${directionClass}">${calc.prediction}</span>
                    </div>
                    <div class="result-item edge">
                        <span class="label">Edge</span>
                        <span class="value">${calc.edge > 0 ? '+' : ''}${calc.edge}%</span>
                    </div>
                </div>

                <div class="formula-breakdown">
                    <h4>Calculation Breakdown</h4>
                    <div class="formula-items">
                        ${this.generateFormulaBreakdown(calc)}
                    </div>
                </div>

                <div class="recommendation ${directionClass}">
                    <i class="fas fa-${calc.prediction === 'OVER' ? 'arrow-up' : 'arrow-down'}"></i>
                    <span>${this.generateRecommendation(calc)}</span>
                </div>
            </div>
        `;

        // Add result card styles
        this.addResultStyles();
    }

    generateFormulaBreakdown(calc) {
        const items = [];
        
        if (calc.playerData.lastGames) {
            const lastAvg = calc.playerData.lastGames.reduce((a, b) => a + b, 0) / calc.playerData.lastGames.length;
            items.push(`
                <div class="formula-item">
                    <span class="label">Last ${calc.playerData.lastGames.length} Games Avg:</span>
                    <span class="value">${lastAvg.toFixed(1)}</span>
                </div>
            `);
        }
        
        if (calc.playerData.recentTrend) {
            items.push(`
                <div class="formula-item">
                    <span class="label">Recent Trend:</span>
                    <span class="value">${calc.playerData.recentTrend > 0 ? '+' : ''}${calc.playerData.recentTrend}%</span>
                </div>
            `);
        }
        
        if (calc.playerData.home) {
            items.push(`
                <div class="formula-item">
                    <span class="label">Home Advantage:</span>
                    <span class="value">+8% boost</span>
                </div>
            `);
        }

        items.push(`
            <div class="formula-item">
                <span class="label">Sample Size:</span>
                <span class="value">${calc.playerData.sampleSize || 10} games</span>
            </div>
        `);

        return items.join('');
    }

    generateRecommendation(calc) {
        if (calc.edge > 10) {
            return `Strong ${calc.prediction} recommendation. High edge detected with ${calc.confidence.toLowerCase()} confidence.`;
        } else if (calc.edge > 5) {
            return `Modest ${calc.prediction} lean. Consider position sizing accordingly.`;
        } else if (calc.edge > 0) {
            return `Small ${calc.prediction} edge. Monitor line movement for better value.`;
        } else {
            return `No clear edge detected. Consider avoiding this prop bet.`;
        }
    }

    formatStatType(statType) {
        const formats = {
            'rebounds_assists': 'Rebounds + Assists',
            'points': 'Points',
            'assists': 'Assists',
            'rebounds': 'Rebounds'
        };
        return formats[statType] || statType;
    }

    addResultStyles() {
        if (document.getElementById('calc-result-styles')) return;

        const style = document.createElement('style');
        style.id = 'calc-result-styles';
        style.textContent = `
            .calc-result-card {
                background: #101010;
                border: 1px solid #2D2D2D;
                border-radius: 8px;
                padding: 24px;
                margin-top: 24px;
            }
            
            .calc-result-card.high-edge {
                border-color: #12B76A;
                box-shadow: 0 4px 20px rgba(18, 183, 106, 0.2);
            }
            
            .calc-result-card.positive-edge {
                border-color: #F79009;
            }
            
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            
            .result-header h3 {
                color: #E4E4E7;
                font-size: 18px;
                font-weight: 600;
                margin: 0;
            }
            
            .confidence-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .confidence-badge.very-high {
                background: #12B76A;
                color: #000000;
            }
            
            .confidence-badge.high {
                background: #F79009;
                color: #000000;
            }
            
            .confidence-badge.medium {
                background: #2D2D2D;
                color: #E4E4E7;
            }
            
            .confidence-badge.low {
                background: #D92D20;
                color: #FFFFFF;
            }
            
            .result-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .result-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .result-item .label {
                font-size: 12px;
                color: #A0A0AB;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .result-item .value {
                font-size: 16px;
                font-weight: 600;
                color: #E4E4E7;
                font-family: 'Roboto Mono', monospace;
            }
            
            .result-item .value.prediction {
                font-size: 18px;
                font-weight: 700;
            }
            
            .result-item .value.prediction.over {
                color: #12B76A;
            }
            
            .result-item .value.prediction.under {
                color: #D92D20;
            }
            
            .result-item.edge .value {
                color: #F79009;
            }
            
            .formula-breakdown {
                background: #0D0D0D;
                border: 1px solid #2D2D2D;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 24px;
            }
            
            .formula-breakdown h4 {
                color: #E4E4E7;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
            }
            
            .formula-items {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .formula-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .formula-item .label {
                font-size: 13px;
                color: #A0A0AB;
            }
            
            .formula-item .value {
                font-size: 13px;
                font-weight: 500;
                color: #E4E4E7;
                font-family: 'Roboto Mono', monospace;
            }
            
            .recommendation {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
            }
            
            .recommendation.over {
                background: rgba(18, 183, 106, 0.1);
                border: 1px solid rgba(18, 183, 106, 0.3);
                color: #12B76A;
            }
            
            .recommendation.under {
                background: rgba(217, 45, 32, 0.1);
                border: 1px solid rgba(217, 45, 32, 0.3);
                color: #D92D20;
            }
        `;
        document.head.appendChild(style);
    }

    showError(message) {
        const resultsContainer = document.getElementById('calcResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                </div>
            `;
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.propsCalculator = new PropsCalculator();
});