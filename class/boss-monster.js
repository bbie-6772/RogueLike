import chalk from 'chalk';
import readlineSync from 'readline-sync';

class bossMonster {
    constructor() {
        const typeRand = Math.floor(Math.random() * 100);
        if (typeRand < 5) {
            this.type = '철학';
            this.value = 45;
        } else if (typeRand < 20) {
            this.type = '수학';
            this.value = 30;
        } else if (typeRand < 55) {
            this.type = '영어';
            this.value = 20;
        } else if (typeRand < 80) {
            this.type = '국어';
            this.value = 15;
        } else {
            this.type = '체육';
            this.value = 10;
        }
        // 남은 제출 기한
        this.maxDay = (this.value + 10) * 3 + 20;
        this.day = this.maxDay;
        // 페이지 수
        this.maxHp =
            Math.round(Math.random() * (this.value + 10) * 20) +
            (this.value + 10) * 25;
        this.hp = this.maxHp;
        // 학습 피로도 day가 지날수록 강해짐 + 과목에따라 달라짐
        this.minDmg = Math.round(this.value + 20) * 2 + 5;
        this.maxDmg = Math.round(this.value + 20) * 3 + 10;
        // 망각 Page 수
        this.minHeal = 15;
        this.maxHeal = 40;
        this.shield = false;
    }

    // 몬스터의 랜덤 행동
    action(player, logs, Dmg) {
        let damaged = 1;
        //플레이어 공격 시에만 몬스터가 죽었는지 여부 업데이트
        if (Dmg) {
            damaged = this.hp - (Dmg[0] + Dmg[1]);
        }
        //랜덤 값 추출
        this.shield = false;
        const monsterAct = Math.round(Math.random() * 100);
        if (monsterAct <= 30) {
            damaged > 0 ? this.heal(logs) : 0;
        } else if (monsterAct <= 80) {
            damaged > 0 ? this.attack(player, logs) : 0;
        } else if (monsterAct <= 95) {
            this.protect(logs);
        } else if (monsterAct <= 100) {
            damaged > 0 ? this.skills(player, logs) : 0;
        } else {
            logs.push('오류!');
        }
    }

    // 망각
    heal(logs) {
        const monsterHeal =
            Math.floor(Math.random() * (this.maxHeal - this.minHeal)) +
            this.minHeal;
        if (this.hp === this.maxHp) {
            logs.push(chalk.greenBright(`아무 일도 없었습니다!`));
        } else if (this.hp + monsterHeal >= this.maxHp) {
            logs.push(chalk.redBright(`모든 문제를 까먹었습니다!`));
            this.hp = this.maxHp;
        } else {
            this.hp += monsterHeal;
            logs.push(
                chalk.redBright(
                    `${monsterHeal} Page 분량의 문제들을 까먹었습니다..`,
                ),
            );
        }
    }

    //공격
    attack(player, logs) {
        if (this.hp > 0) {
            //랜덤 값 추출
            const monsterDmg =
                Math.floor(Math.random() * (this.maxDmg - this.minDmg)) +
                this.minDmg;
            //player damaged 메서드 사용
            player.damaged(monsterDmg, logs);
        }
    }

    skills(player, logs) {
        logs.push(chalk.cyanBright(`시험지를 자세히 읽습니다!`));
        switch (this.type) {
            case '철학':
                logs.push(
                    chalk.cyanBright(
                        `당신은 문제를 읽어가며 인생의 목표에 대해 생각하게되었습니다..`,
                    ),
                );
                logs.push(chalk.redBright(`이 문제는 왜 풀고 있는 걸까요..?`));
                logs.push(chalk.redBright(`머리가 아파집니다..`));
                logs.push(chalk.redBright(`정신력이 절반이 됩니다!`));
                player.damaged(Math.floor(player.hp / 2), logs);
                break;
            case '수학':
                const a = Math.round(Math.random() * 500);
                const b = Math.round(Math.random() * 500);
                const c = Math.round(Math.random() * 50);
                const d = Math.round(Math.random() * 50);
                const answer = a * d + b * c;
                const question = `${a} X ${d} + ${b} X ${c}`;
                console.log(
                    chalk.cyanBright(`뭔가 신기한 수학문제가 눈에 들어옵니다!`),
                );
                console.log(chalk.cyanBright(question));
                console.log(chalk.cyanBright(`정답이 무엇일까요..?`));
                console.log(chalk.redBright(`틀리면 정신력이 절반이 됩니다!`));

                const input = readlineSync.question('정답은?');

                if (Number(input) === answer) {
                    logs.push(
                        chalk.greenBright(
                            `문제를 완벽하게 풀어 기분이 좋아집니다!`,
                        ),
                    );
                    logs.push(chalk.greenBright(`최대 정신력의 25% 회복`));
                    player.heal(Math.round(player.maxHp / 4), logs);
                } else {
                    logs.push(
                        chalk.redBright(`문제를 이해하지 못한 것 같습니다!`),
                    );
                    logs.push(chalk.redBright(`정신이 까마득해집니다..`));
                    logs.push(chalk.redBright(`정신력이 절반이 됩니다!`));
                    player.damaged(Math.floor(player.hp / 2), logs);
                }
                break;
            case '영어':
                logs.push(
                    chalk.greenBright(
                        `왜 외국어를 이렇게 열심히 배워야 할까요..?`,
                    ),
                );
                logs.push(chalk.greenBright("I can't understand.."));
                logs.push(
                    chalk.greenBright(
                        '상황을 받아들이고 문제를 추가로 풀기 시작합니다.',
                    ),
                );
                this.damaged(player.attack(this, logs), logs);
                break;
            case '국어':
                logs.push(
                    chalk.redBright(`시를 읽으며 주화 입마에 빠집니다..`),
                );
                logs.push(chalk.redBright(`정신력의 1/4이 소모됩니다!`));
                player.damaged(Math.floor(player.hp / 4), logs);
                break;
            case '체육':
                logs.push(
                    chalk.greenBright(`문제를 읽으며 운동을 하였습니다!`),
                );
                logs.push(
                    chalk.greenBright(
                        `불굴의 의지로 최대 정신력이 ${this.hp}(Page 수)만큼 증가합니다!`,
                    ),
                );
                player.maxHpSet(this.hp, logs);
                break;
            default:
                logs.push('오류!');
                break;
        }
    }

    //집중 실패
    protect(logs) {
        logs.push(chalk.redBright(`문제지가 어려워 보입니다..`));
        this.shield = true;
    }

    //Page 소모
    damaged(value, logs) {
        // 방어 여부
        if (this.shield) {
            logs.push(chalk.redBright(`머리에 아무것도 들어오지 않았습니다!`));
            this.shield = false;
        } else if (this.hp - value[0] > 0) {
            this.hp -= value[0];
            logs.push(
                chalk.greenBright(
                    `시험지를 ${value[0]} Page 만큼 풀었습니다! `,
                ),
            );
            if (value[1] > 0) {
                this.hp -= value[1];
                logs.push(
                    chalk.greenBright(
                        `추가로 시험지를 ${value[1]} Page 만큼 풀었습니다! `,
                    ),
                );
            }
        } else {
            this.hp = 0;
            logs.push(chalk.greenBright('시험을 완벽하게 마쳤습니다!'));
        }
    }

    //하루가 지날 때마다 강해지는 매커니즘
    Day(player, logs) {
        // 학습 피로도 day가 지날수록 강해짐
        logs.push(chalk.redBright('하루가 지났습니다.'));
        this.day--;
        const mnDmg =
            Math.round(this.minDmg * (this.maxDay / this.day)) - this.minDmg;
        const mxDmg =
            Math.round(this.maxDmg * (this.maxDay / this.day)) - this.maxDmg;
        this.minDmg += mnDmg;
        this.maxDmg += mxDmg;
        this.minHeal = this.minHeal + Math.round(this.maxDay / this.day);
        this.maxHeal = this.maxHeal + Math.round(this.maxDay / this.day);
        logs.push(
            chalk.redBright(
                `시험지를 점점 풀기 싫어집니다.. ${mnDmg}~${mxDmg}만큼 피로도 증가`,
            ),
        );

        // 만약 제출일 수 관련 무기일 시 데미지 업데이트
        if (player.weapon.type === 1) {
            player.weapon.damageUpdate(player, this, logs);
        }
    }
}

export default bossMonster;