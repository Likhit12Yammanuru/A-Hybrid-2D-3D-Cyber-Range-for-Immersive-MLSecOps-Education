// src/components/threeD/babylon/GameState.js
class GameState {
    constructor() {
        this.score = 0;
        this.isPaused = false;
        this.currentWave = 0;
        this.health = 100;
    }

    addScore(points) {
        this.score += points;
        console.log(`Score updated: ${this.score}`);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        console.log("GAME OVER - System Compromised");
        this.isPaused = true;
    }
}

export default GameState;