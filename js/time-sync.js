// Minnesota Central Time Synchronization
// Current reference time: 10/29/2025 7:42:00 PM

class MinnesotaTimeSync {
    constructor() {
        this.baseTime = new Date('2025-10-29T19:42:00-06:00'); // Base time in Central Time
        this.startTime = Date.now();
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.updateInterval = setInterval(() => {
            this.updateTime();
        }, 1000); // Update every second
    }
    
    updateTime() {
        const elapsed = Date.now() - this.startTime;
        const currentTime = new Date(this.baseTime.getTime() + elapsed);
        
        const timeString = this.formatTime(currentTime);
        const mobileTimeString = this.formatTime(currentTime);
        
        // Update desktop clock
        const desktopTime = document.getElementById('currentTime');
        if (desktopTime) {
            desktopTime.textContent = timeString;
        }
        
        // Update mobile clock
        const mobileTime = document.getElementById('mobileTime');
        if (mobileTime) {
            mobileTime.textContent = mobileTimeString;
        }
        
        // Update any other time displays on the page
        this.updateAllTimeDisplays(timeString);
    }
    
    formatTime(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        if (hours === 0) hours = 12;
        
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    }
    
    updateAllTimeDisplays(timeString) {
        // Update any elements with time-related classes
        const timeElements = document.querySelectorAll('.game-time, .event-time, .bet-deadline');
        timeElements.forEach(element => {
            // For live game times, calculate based on current time
            if (element.classList.contains('game-time')) {
                element.textContent = this.getGameClock();
            } else {
                element.textContent = timeString;
            }
        });
    }
    
    getGameClock() {
        // Simulate realistic game clocks
        const quarters = ['1Q', '2Q', '3Q', '4Q', 'OT'];
        const quarter = Math.floor(Math.random() * 4) + 1;
        const timeLeft = Math.floor(Math.random() * 12) + ':' + 
                        Math.floor(Math.random() * 60).toString().padStart(2, '0');
        return `${quarter}Q ${timeLeft}`;
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize time sync when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mnTimeSync = new MinnesotaTimeSync();
});

// Utility functions for time calculations
window.TimeUtils = {
    // Calculate time until game starts
    getTimeUntilGame(gameTime) {
        const now = new Date();
        const game = new Date(gameTime);
        const diff = game - now;
        
        if (diff <= 0) return 'LIVE';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    },
    
    // Convert Minnesota time to other time zones
    convertToTimezone(timeString, timezone) {
        // This would integrate with a timezone API
        // For now, return the Minnesota time
        return timeString;
    },
    
    // Check if it's currently game time (sports betting prime time)
    isPrimeTime() {
        const now = new Date();
        const hour = now.getHours();
        
        // Prime time: 6 PM - 11 PM Central Time
        return hour >= 18 && hour <= 23;
    },
    
    // Get current sports betting window
    getBettingWindow() {
        const now = new Date();
        const hour = now.getHours();
        
        if (this.isPrimeTime()) {
            return {
                period: 'Prime Time',
                urgency: 'high',
                message: 'Peak betting window - Lines moving fastest'
            };
        } else if (hour >= 11 && hour < 18) {
            return {
                period: 'Day Games',
                urgency: 'medium',
                message: 'Active betting period'
            };
        } else if (hour >= 0 && hour < 6) {
            return {
                period: 'Overnight',
                urgency: 'low',
                message: 'Limited live betting available'
            };
        } else {
            return {
                period: 'Late Night',
                urgency: 'medium',
                message: 'Primarily props and futures'
            };
        }
    }
};