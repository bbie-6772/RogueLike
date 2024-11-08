import chalk from 'chalk';

class Rewards {
    constructor() {
        this.type = "국어";
        // 문제집 이름 
        this.name = `${this.type} 책`;
        // 페이지 수
        this.hp = 100;
        // 필요 피로도
        this.minDmg = 10;
        this.maxDmg = 15;
        // 난이도
        this.lev = 0;
    }

    attack(player, logs) {
        //랜덤 값 추출
        const monsterDmg = Math.floor(Math.random() * (this.maxDmg - this.minDmg)) + this.minDmg;
        player.hp -= monsterDmg;
        logs.push(chalk.redBright(`정신력이 ${monsterDmg}만큼 소모되었습니다! `))
    }
}

export default Rewards;