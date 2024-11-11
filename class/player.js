import chalk from 'chalk';
import Weapons from '../storage/weapons.js';

class Player {
    constructor() {
        // 정신력
        this.maxHp = 100;
        this.hp = this.maxHp;
        // 무기
        this.weapon = Weapons[0];
        // 몰입도
        this.minDmg = 20 + this.weapon.damage;
        this.maxDmg = 30 + this.weapon.damage;
        // 이해력
        this.lev = 1;
        // 수면의 질
        this.minHeal = 100 + this.weapon.heal;
        this.maxHeal = 100 + this.weapon.heal;
        // 통계 값
        this.kills = 0;
        this.totalDmg = 0;
        this.totalHeal = 0;
        this.maxLev = this.lev;
    }

    // 문제 풀기
    attack(monster, logs) {
        //랜덤 값 추출
        let playerDmg =
            Math.floor(Math.random() * (this.maxDmg - this.minDmg)) +
            this.minDmg;
        monster.hp -= playerDmg;
        if (monster.hp > 0) {
            this.totalDmg += playerDmg;
            logs.push(
                chalk.green(`${playerDmg} Page 만큼의 문제를 풀었습니다!`),
            );
        } else {
            this.totalDmg += playerDmg + monster.hp;
            logs.push(
                chalk.green(
                    `${playerDmg + monster.hp} Page 만큼의 문제를 풀었습니다!`,
                ),
            );
        }
        // 제출기한 업데이트
        monster.Day(logs);
    }

    // 회복
    sleep(monster, logs) {
        const playerHeal =
            Math.floor(Math.random() * (this.maxHeal - this.minHeal)) +
            this.minHeal;
        if (this.hp === this.maxHp) {
            logs.push(chalk.green(`정신이 온전합니다! 열심히 공부 하세요!!`));
        } else if (this.hp + playerHeal >= this.maxHp) {
            logs.push(chalk.green(`정신이 매우 말끔해졌습니다!!`));
            this.hp = this.maxHp;
        } else {
            this.hp += playerHeal;
            logs.push(
                chalk.green(`${playerHeal} 만큼의 정신력을 회복했습니다!!`),
            );
        }
        // 제출기한 업데이트
        monster.Day(logs);
    }

    // 회복
    heal(value, logs) {
        if (this.hp === this.maxHp) {
            logs.push(chalk.green(`정신이 온전합니다!`));
        } else if (this.hp + value >= this.maxHp) {
            logs.push(chalk.green(`정신이 매우 말끔해졌습니다!!`));
            this.hp = this.maxHp;
        } else {
            this.hp += value;
            logs.push(chalk.green(`${value} 만큼의 정신력을 회복했습니다!!`));
        }
    }

    // 레벨 조정
    levelSet(value, logs) {
        this.maxLev = Math.max(this.lev, this.lev + value);
        if (value > 0) {
            this.lev += value;
            logs.push(chalk.green(`이해력이 ${value} 만큼 오른 것 같습니다!`));
        } else if (value < 0) {
            this.lev += value;
            logs.push(
                chalk.red(`${Math.abs(value)} 만큼의 이해력이 떨어졌습니다..`),
            );
        }
    }

    // 최대 체력 조정
    maxHpSet(value, logs) {
        if (value > 0) {
            this.maxHp += value;
            logs.push(
                chalk.green(`최대 정신력이 ${value} 만큼 오른 것 같습니다!`),
            );
        } else if (value < 0) {
            this.maxHp += value;
            logs.push(
                chalk.red(
                    `최대 정신력이 ${Math.abs(value)} 정도 떨어졌습니다..`,
                ),
            );
        }
    }

    // 죽음
    die(logs) {
        logs.push(chalk.red('정신력이 피폐해져 용기를 잃었습니다!'));
    }

    // 무기교체
    changeUpdate(weapon) {
        const preDamage = this.weapon.damage;
        const preHeal = this.weapon.heal;
        const aftDamage = weapon.damage;
        const aftHeal = weapon.heal;

        //데미지 변경
        this.minDmg -= preDamage;
        this.maxDmg -= preDamage;
        this.minDmg += aftDamage;
        this.maxDmg += aftDamage;
        //회복력 변경
        this.minHeal -= preHeal;
        this.maxHeal -= preHeal;
        this.minHeal += aftHeal;
        this.maxHeal += aftHeal;

        this.weapon = weapon;
    }
}

export default Player;
