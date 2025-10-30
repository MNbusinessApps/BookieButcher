// Bankroll Manager - The Recipe
class BankrollManager {
    constructor() {
        this.currentBankroll = 1250.00;
        this.startingBankroll = 1122.50;
        this.totalWins = 23;
        this.totalBets = 34;
        this.dailyPnL = 127.50;
        this.unitSize = 50;
        this.maxUnitSize = 2.5;
        
        this.betHistory = [];
        this.growthData = [];
        this.init();
    }

    init() {
        this.loadBetHistory();
        this.generateGrowthData();
        this.initCharts();
        this.bindEvents();
        this.updateMetrics();
    }

    loadBetHistory() {
        // Mock bet history data
        this.betHistory = [
            {
                id: 1,
                date: '2025-10-29',
                time: '19:15',
                bet: 'CHI +3.5',
                sport: 'NFL',
                odds: '+185',
                edge: 15.2,
                stake: 2.0,
                pnl: 185.00,
                status: 'won'
            },
            {
                id: 2,
                date: '2025-10-29',
                time: '18:42',
                bet: 'Jokic O22.5 Reb+Ast',
                sport: 'NBA',
                odds: '-110',
                edge: 14.7,
                stake: 1.5,
                pnl: 68.18,
                status: 'won'
            },
            {
                id: 3,
                date: '2025-10-29',
                time: '17:30',
                bet: 'Allen O265.5 Pass Yds',
                sport: 'NFL',
                odds: '+105',
                edge: 12.4,
                stake: 1.25,
                pnl: 65.63,
                status: 'won'
            },
            {
                id: 4,
                date: '2025-10-29',
                time: '20:00',
                bet: 'Ohtani O1.5 TB',
                sport: 'MLB',
                odds: '+115',
                edge: 16.8,
                stake: 2.0,
                pnl: 0,
                status: 'pending'
            },
            {
                id: 5,
                date: '2025-10-28',
                time: '21:15',
                bet: 'Lakers ML',
                sport: 'NBA',
                odds: '-120',
                edge: 3.2,
                stake: 1.0,
                pnl: -50.00,
                status: 'lost'
            },
            {
                id: 6,
                date: '2025-10-28',
                time: '20:30',
                bet: 'Mahomes O2.5 Pass TD',
                sport: 'NFL',
                odds: '-110',
                edge: 8.9,
                stake: 1.75,
                pnl: 79.55,
                status: 'won'
            },
            {
                id: 7,
                date: '2025-10-28',
                time: '19:00',
                bet: 'Luka O28.5 Points',
                sport: 'NBA',
                odds: '-105',
                edge: 7.1,
                stake: 1.5,
                pnl: 71.43,
                status: 'won'
            },
            {
                id: 8,
                date: '2025-10-27',
                time: '16:15',
                bet: 'Chiefs -7.5',
                sport: 'NFL',
                odds: '-110',
                edge: 4.3,
                stake: 2.0,
                pnl: -110.00,
                status: 'lost'
            }
        ];
    }

    generateGrowthData() {
        // Generate 30 days of mock growth data
        const data = [];
        let currentValue = this.startingBankroll;
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            
            // Random daily P&L with slight upward trend
            const dailyChange = (Math.random() - 0.4) * 100; // Bias toward positive
            currentValue += dailyChange;
            
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.round(currentValue * 100) / 100
            });
        }
        
        // Add current day
        data[data.length - 1].value = this.currentBankroll;
        this.growthData = data;
    }

    initCharts() {
        this.initGrowthChart();
    }

    initGrowthChart() {
        const ctx = document.getElementById('growthChart');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.growthData.map(d => {
                    const date = new Date(d.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Bankroll',
                    data: this.growthData.map(d => d.value),
                    borderColor: '#D92D20',
                    backgroundColor: 'rgba(217, 45, 32, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#D92D20',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#101010',
                        titleColor: '#E4E4E7',
                        bodyColor: '#E4E4E7',
                        borderColor: '#2D2D2D',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const change = value - this.startingBankroll;
                                const changePercent = ((change / this.startingBankroll) * 100).toFixed(1);
                                return [
                                    `$${value.toLocaleString()}`,
                                    `Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent}%)`
                                ];
                            }.bind(this)
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#2D2D2D',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#A0A0AB',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: '#2D2D2D',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#A0A0AB',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#F79009'
                    }
                }
            }
        });

        this.growthChart = chart;
    }

    bindEvents() {
        // Chart period buttons
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateChartPeriod(period);
                
                // Update active button
                chartButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Bet filters
        this.bindFilterEvents();
    }

    bindFilterEvents() {
        const sportFilter = document.getElementById('sportFilter');
        const outcomeFilter = document.getElementById('outcomeFilter');
        
        if (sportFilter) {
            sportFilter.addEventListener('change', () => this.filterBets());
        }
        
        if (outcomeFilter) {
            outcomeFilter.addEventListener('change', () => this.filterBets());
        }
    }

    updateChartPeriod(period) {
        // Filter growth data based on period
        let filteredData;
        const today = new Date();
        
        switch (period) {
            case '7d':
                filteredData = this.growthData.slice(-7);
                break;
            case '30d':
                filteredData = this.growthData.slice(-30);
                break;
            case '90d':
                filteredData = this.growthData.slice(-30); // Show last 30 for demo
                break;
            case '1y':
                filteredData = this.growthData.slice(-30); // Show last 30 for demo
                break;
            default:
                filteredData = this.growthData;
        }
        
        this.growthChart.data.labels = filteredData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        this.growthChart.data.datasets[0].data = filteredData.map(d => d.value);
        this.growthChart.update();
    }

    filterBets() {
        const sportFilter = document.getElementById('sportFilter').value;
        const outcomeFilter = document.getElementById('outcomeFilter').value;
        
        let filteredBets = [...this.betHistory];
        
        // Filter by sport
        if (sportFilter !== 'all') {
            filteredBets = filteredBets.filter(bet => bet.sport.toLowerCase() === sportFilter);
        }
        
        // Filter by outcome
        if (outcomeFilter === 'wins') {
            filteredBets = filteredBets.filter(bet => bet.status === 'won');
        } else if (outcomeFilter === 'losses') {
            filteredBets = filteredBets.filter(bet => bet.status === 'lost');
        }
        
        this.renderBetsTable(filteredBets);
    }

    renderBetsTable(bets) {
        const tbody = document.querySelector('.bets-table tbody');
        if (!tbody) return;

        tbody.innerHTML = bets.map(bet => `
            <tr class="${bet.status}">
                <td>${bet.date} ${bet.time}</td>
                <td>${bet.bet}</td>
                <td>${bet.sport}</td>
                <td>${bet.odds}</td>
                <td class="edge">+${bet.edge}%</td>
                <td>${bet.stake.toFixed(2)}u ($${(bet.stake * this.unitSize).toFixed(0)})</td>
                <td class="pnl ${bet.pnl > 0 ? 'positive' : bet.pnl < 0 ? 'negative' : ''}">
                    ${bet.pnl > 0 ? '+' : ''}$${bet.pnl.toFixed(2)}
                </td>
                <td class="status ${bet.status}">
                    ${bet.status === 'won' ? 'WON' : bet.status === 'lost' ? 'LOST' : 'PENDING'}
                </td>
            </tr>
        `).join('');
    }

    updateMetrics() {
        // Update key metrics in the UI
        this.updateMetricCard('total-bankroll', this.currentBankroll);
        this.updateMetricCard('bet-units', this.calculateUnits());
        this.updateMetricCard('roi', this.calculateROI());
        this.updateMetricCard('win-rate', this.calculateWinRate());
    }

    updateMetricCard(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
        }
    }

    calculateUnits() {
        return (this.currentBankroll / 1000).toFixed(2);
    }

    calculateROI() {
        const totalReturn = this.currentBankroll - this.startingBankroll;
        const roi = (totalReturn / this.startingBankroll) * 100;
        return `+${roi.toFixed(1)}%`;
    }

    calculateWinRate() {
        return `${((this.totalWins / this.totalBets) * 100).toFixed(1)}%`;
    }

    // Kelly Criterion calculation
    calculateKellyStake(odds, edge) {
        const decimalOdds = this.americanToDecimal(odds);
        const edgeDecimal = edge / 100;
        
        // Kelly formula: (bp - q) / b
        // where b = decimal odds - 1, p = win probability, q = loss probability
        const b = decimalOdds - 1;
        const p = 0.5 + (edge / 200); // Convert edge to probability
        const q = 1 - p;
        
        const kelly = (b * p - q) / b;
        const conservativeKelly = kelly * 0.25; // 25% of Kelly for safety
        
        return Math.max(0, Math.min(conservativeKelly, 0.025)); // Max 2.5% of bankroll
    }

    americanToDecimal(odds) {
        if (odds > 0) {
            return (odds / 100) + 1;
        } else {
            return (100 / Math.abs(odds)) + 1;
        }
    }

    // Risk management calculations
    calculateRiskMetrics() {
        const dailyPnL = this.dailyPnL;
        const stopLoss = -250; // -5 units
        
        return {
            dailyPnL,
            stopLoss,
            dailyLoss: Math.max(0, -dailyPnL),
            stopLossHit: dailyPnL <= stopLoss,
            dailyTarget: 150, // +3 units
            dailyTargetHit: dailyPnL >= 150
        };
    }

    getSharpeRatio() {
        // Calculate Sharpe ratio based on daily returns
        const dailyReturns = [];
        for (let i = 1; i < this.growthData.length; i++) {
            const prevValue = this.growthData[i-1].value;
            const currValue = this.growthData[i].value;
            const dailyReturn = (currValue - prevValue) / prevValue;
            dailyReturns.push(dailyReturn);
        }
        
        const meanReturn = dailyReturns.reduce((a, b) => a + b) / dailyReturns.length;
        const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / dailyReturns.length;
        const stdDev = Math.sqrt(variance);
        
        return stdDev === 0 ? 0 : (meanReturn / stdDev) * Math.sqrt(252); // Annualized
    }

    exportData() {
        const data = {
            bankroll: this.currentBankroll,
            startingBankroll: this.startingBankroll,
            totalWins: this.totalWins,
            totalBets: this.totalBets,
            betHistory: this.betHistory,
            growthData: this.growthData,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bankroll-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize bankroll manager
document.addEventListener('DOMContentLoaded', () => {
    window.bankrollManager = new BankrollManager();
});