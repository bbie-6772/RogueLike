import chalk from 'chalk';

class Monster {
    constructor(stage) {
        const typeRand = Math.floor(Math.random() * 100)
        if (typeRand < 5) {
            this.type = "철학";
            this.value = 10;
        } else if (typeRand < 20) {
            this.type = "수학";
            this.value = 7;
        } else if (typeRand < 55) {
            this.type = "영어";
            this.value = 5;
        } else if (typeRand < 80) {
            this.type = "국어";
            this.value = 3;
        } else {
            this.type = "체육";
            this.value = 1;
        } // 문제집 과목 설정
        this.name = `${this.type} 문제집`;
        // 남은 제출 기한
        this.maxDay = this.value * 5;
        this.day = this.maxDay;
        // 페이지 수
        this.maxHp = (this.value + stage) * 30;
        this.hp = this.maxHp;
        // 학습 피로도 day가 지날수록 강해짐 + 과목에따라 달라짐
        this.minDmg = Math.round(this.value + stage) + 5;
        this.maxDmg = Math.round(this.value + stage) + 10;
        // 난이도
        this.lev = stage + Math.floor(this.value / 2);
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
        if (player.hp <= 0) {
            player.die(logs);
        }
    }

    Day(logs) {
        // 학습 피로도 day가 지날수록 강해짐
        logs.push(chalk.blue('하루가 지났습니다.'));
        this.day--;
        this.minDmg = Math.round(this.minDmg * (this.maxDay / this.day));
        this.maxDmg = Math.round(this.maxDmg * (this.maxDay / this.day));
        this.minHeal = this.minHeal + Math.round(this.maxDay / this.day);
        this.maxHeal = this.maxHeal + Math.round(this.maxDay / this.day);
    }
}

export default Monster;