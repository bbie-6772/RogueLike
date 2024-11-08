import chalk from 'chalk';

class Player {
    constructor() {
        // 정신력
        this.maxHp = 100;
        this.hp = 100;
        // 몰입도
        this.minDmg = 5;
        this.maxDmg = 10;
        // 이해력 
        this.lev = 1;
        // 수면의 질
        this.minHeal = 5;
        this.maxHeal = 5;
    }

    // 문제 풀기
    attack(monster, logs) {
        //랜덤 값 추출
        const playerDmg = Math.floor(Math.random() * (this.maxDmg - this.minDmg)) + this.minDmg;
        monster.hp -= playerDmg;
        logs.push(chalk.green(`${playerDmg} 만큼의 Page 를 풀었습니다!`))
        monster.day--;
    }

    // 회복
    sleep(monster, logs) {
        const playerHeal = Math.floor(Math.random() * (this.maxHeal - this.minHeal)) + this.minHeal;
        if (this.hp === this.maxHp) {
            logs.push(chalk.green(`정신이 온전합니다! 공부나 하세요!!`));
        } else if (this.hp + playerHeal >= this.maxHp) {
            logs.push(chalk.green(`정신이 매우 말끔해졌습니다!!`));
            this.hp = this.maxHp
        } else {
            this.hp += playerHeal;
            logs.push(chalk.green(`${playerHeal} 만큼의 정신력을 회복했습니다!!`));
        }
        monster.day--;
    }
}

export default Player;