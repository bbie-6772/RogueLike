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
        this.minHeal = 8 + this.weapon.heal;
        this.maxHeal = 15 + this.weapon.heal;
        // 통계 값
        this.kills = 0;
        this.totalDmg = 0;
        this.totalHeal = 0;
        this.maxLev = this.lev;
        this.shield = false;
    }

    //문제 풀기
    attack(monster, logs) {
        this.shield = false;
        logs.push(chalk.greenBright('문제를 풀기시작합니다!'));
        //랜덤 값 추출
        let playerDmg =
            Math.floor(Math.random() * (this.maxDmg - this.minDmg)) +
            this.minDmg;
        //통계 값 기록
        if (monster.hp > 0) {
            this.totalDmg += playerDmg;
        } else {
            this.totalDmg += playerDmg + monster.hp;
        }
        return playerDmg;
    }

    //휴식하기
    protect(logs) {
        logs.push(chalk.greenBright(`휴식하기 시작합니다..`));
        this.shield = true;
    }

    //피로도 소모
    damaged(value, logs) {
        // 방어 여부
        if (this.shield) {
            logs.push(
                chalk.greenBright(`휴식으로 정신력이 소모되지 않았습니다!`),
            );
            this.shield = false;
        } else if (this.hp - value > 0) {
            this.hp -= value;
            logs.push(
                chalk.redBright(`정신력이 ${value}만큼 소모되었습니다! `),
            );
        } else {
            this.die(logs);
        }
    }

    // 회복(전투)
    sleep(logs) {
        this.shield = false;
        logs.push(chalk.greenBright('잠을 청하기 시작합니다..zzZ'));
        const playerHeal =
            Math.floor(Math.random() * (this.maxHeal - this.minHeal)) +
            this.minHeal;
        if (this.hp === this.maxHp) {
            logs.push(chalk.green(`정신이 온전합니다! 열심히 공부 하세요!!`));
        } else if (this.hp + playerHeal >= this.maxHp) {
            logs.push(chalk.green(`정신이 매우 말끔해졌습니다!!`));
            this.totalHeal += this.maxHp - this.hp;
            this.hp = this.maxHp;
        } else {
            this.hp += playerHeal;
            this.totalHeal += playerHeal;
            logs.push(
                chalk.green(`${playerHeal} 만큼의 정신력을 회복했습니다!!`),
            );
        }
    }

    // 회복
    heal(value, logs) {
        if (this.hp === this.maxHp) {
            logs.push(chalk.green(`정신이 온전합니다!`));
        } else if (this.hp + value >= this.maxHp) {
            logs.push(chalk.green(`정신이 매우 말끔해졌습니다!!`));
            this.totalHeal += this.maxHp - this.hp;
            this.hp = this.maxHp;
        } else {
            this.hp += value;
            this.totalHeal += value;
            logs.push(chalk.green(`${value} 만큼의 정신력을 회복했습니다!!`));
        }
    }

    // 레벨 조정 ( + 스탯 조정 )
    levelSet(value, logs) {
        this.maxLev = Math.max(this.lev, this.lev + value);
        if (value > 0) {
            this.lev += value;
            logs.push(chalk.green(`이해력이 ${value} 만큼 오른 것 같습니다!`));
            const mndmg = value * Math.round(Math.random() * 2);
            const mxdmg = value * Math.round(Math.random() * 2) + mndmg;
            const mnheal = value * Math.round(Math.random() * 2);
            const mxheal = value * Math.round(Math.random() * 2) + mnheal;
            this.minDmg += mndmg;
            this.maxDmg += mxdmg;
            this.minHeal += mnheal;
            this.maxHeal += mxheal;
            logs.push(
                chalk.green(`최소 몰입도가 ${mndmg} Page 만큼 올랐습니다!`),
            );
            logs.push(
                chalk.green(`최대 몰입도가 ${mxdmg} Page 만큼 올랐습니다!`),
            );
            logs.push(
                chalk.green(`최소 수면효과가 ${mnheal} 만큼 올랐습니다!`),
            );
            logs.push(
                chalk.green(`최대 수면효과가 ${mxheal} 만큼 올랐습니다!`),
            );
        } else if (value < 0) {
            this.lev += value;
            logs.push(
                chalk.red(`${Math.abs(value)} 만큼의 이해력이 떨어졌습니다..`),
            );
            this.minDmg += value * 2;
            this.maxDmg += value * 3;
            this.minHeal += value;
            this.maxHeal += value * 2;
            if (this.minDmg > 0) {
                logs.push(
                    chalk.red(
                        `최소 몰입도가 ${value * 2} Page 만큼 떨어졌습니다..`,
                    ),
                );
            } else {
                this.minDmg = 0;
                logs.push(chalk.red(`최소 몰입도가 0 Page로 떨어졌습니다..`));
            }
            if (this.maxDmg > 0) {
                logs.push(
                    chalk.red(
                        `최대 몰입도가 ${value * 3} Page 만큼 떨어졌습니다..`,
                    ),
                );
            } else {
                this.maxDmg = 0;
                logs.push(chalk.red(`최대 몰입도가 0 Page로 떨어졌습니다..`));
            }
            if (this.maxDmg > 0) {
                logs.push(
                    chalk.red(`최소 수면효과가 ${value} 만큼 떨어졌습니다..`),
                );
            } else {
                this.maxDmg = 0;
                logs.push(chalk.red(`최소 수면효과가 0 으로 떨어졌습니다..`));
            }
            if (this.maxDmg > 0) {
                logs.push(
                    chalk.red(
                        `최대 수면효과가 ${value * 2} 만큼 떨어졌습니다..`,
                    ),
                );
            } else {
                this.maxDmg = 0;
                logs.push(chalk.red(`최대 수면효과가 0 으로 떨어졌습니다..`));
            }
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
        this.hp = 0;
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
