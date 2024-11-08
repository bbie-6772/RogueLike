import chalk from 'chalk';

class Monster {
    constructor() {
        this.type = "국어";
        // 문제집 이름 
        this.name = `${this.type} 책`;
        // 페이지 수
        this.maxHp = 100;
        this.hp = 100;
        // 학습 피로도
        this.minDmg = 10;
        this.maxDmg = 15;
        // 난이도
        this.lev = 0;
        // 남은 제출 기한
        this.day = 100;
        // 망각 Page 수
        this.minHeal = 5;
        this.maxHeal = 20;
    }

    // 몬스터의 랜덤 행동 추후 예정
    action(player, logs) {
        //랜덤 값 추출
        const monsterAct = Math.floor(Math.random() * 3);
        switch (monsterAct) {
            case '1':
                break;
            case '2':
                break;
            default:
                break;
        }
    }

    // 망각
    heal(player, logs) {
        const monsterHeal = Math.floor(Math.random() * (this.maxHeal - this.minHeal)) + this.minHeal;
        if (this.hp === this.maxHp) {
            logs.push(chalk.redBright(`아무 일도 없었습니다!`));
        } else if (this.hp + monsterHeal >= this.maxHp) {
            logs.push(chalk.redBright(`모든 문제를 까먹었습니다!`));
            this.hp = this.maxHp;
        } else {
            this.hp += monsterHeal;
            logs.push(chalk.redBright(`${monsterHeal} Page 분량의 문제들을 까먹었습니다..`));
        }
    }


    attack(player, logs) {
        //랜덤 값 추출
        const monsterDmg = Math.floor(Math.random() * (this.maxDmg - this.minDmg)) + this.minDmg;
        player.hp -= monsterDmg;
        logs.push(chalk.redBright(`정신력이 ${monsterDmg}만큼 소모되었습니다! `))
    }
}

export default Monster;