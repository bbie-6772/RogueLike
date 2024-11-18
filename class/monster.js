import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Monster {
    constructor(stage) {
        // 과목 랜덤화
        const typeRand = Math.floor(Math.random() * 100);
        // 문제집 과목 설정 + 과목별 난이도 조정
        if (typeRand < 5) {
            this.type = '철학';
            this.value = 10;
        } else if (typeRand < 20) {
            this.type = '수학';
            this.value = 7;
        } else if (typeRand < 45) {
            this.type = '영어';
            this.value = 5;
        } else if (typeRand < 80) {
            this.type = '국어';
            this.value = 3;
        } else {
            this.type = '체육';
            this.value = 1;
        }
        // 남은 공부 기한
        this.maxDay = (this.value + stage) * 3 + 20;
        this.day = this.maxDay;
        // 페이지 수 (체력)
        this.maxHp =
            Math.round(Math.random() * (this.value + stage) * 10) +
            (this.value + stage) * 24;
        this.hp = this.maxHp;
        // 학습 피로도 day가 지날수록 강해짐 + 과목에따라 달라짐
        this.minDmg = Math.round(this.value + stage * 2) * 2 + 5;
        this.maxDmg = Math.round(this.value + stage * 2) * 2 + 10;
        // 망각 Page 수 (회복)
        this.minHeal = 5;
        this.maxHeal = 20;
        // 방어 여부
        this.shield = false;
    }
    // 몬스터 행동 제어(랜덤)
    action(player, logs, Dmg) {
        // 죽었는지 여부 확인
        let damaged = 1;
        //플레이어 공격 시에만 몬스터가 죽었는지 여부 업데이트
        if (Dmg) {
            damaged = this.hp - (Dmg[0] + Dmg[1]);
        }
        // 턴 마다 방어 여부 해제
        this.shield = false;
        // 행동 랜덤성 부여
        const monsterAct = Math.round(Math.random() * 100);
        if (monsterAct <= 30) {
            // ( damaged > 0 )은 몬스터가 죽었을 경우 행동불능으로 인식하기 위함
            damaged > 0 ? this.heal(logs) : 0;
        } else if (monsterAct <= 75) {
            damaged > 0 ? this.attack(player, logs) : 0;
        } else if (monsterAct <= 90) {
            this.protect(logs);
        } else if (monsterAct <= 100) {
            damaged > 0 ? this.skills(player, logs) : 0;
        } else {
            //오류 제어
            logs.push('몬스터 행동 오류!');
        }
    }
    // 망각(힐)
    heal(logs) {
        //최솟값~최댓값 랜덤
        const monsterHeal =
            Math.floor(Math.random() * (this.maxHeal - this.minHeal)) +
            this.minHeal;
        // 피가 최대체력일 때
        if (this.hp === this.maxHp) {
            logs.push(chalk.greenBright('아무 일도 없었습니다!'));
            // 피가 최대로 차게 될 떄
        } else if (this.hp + monsterHeal >= this.maxHp) {
            logs.push(chalk.redBright('모든 문제를 까먹었습니다!'));
            this.hp = this.maxHp;
            // 일반 회복
        } else {
            this.hp += monsterHeal;
            logs.push(
                chalk.redBright(
                    `${monsterHeal} Page 분량의 문제들을 까먹었습니다..`
                )
            );
        }
    }
    // 피로도 적용(공격)
    attack(player, logs) {
        ///최솟값~최댓값 랜덤
        const monsterDmg =
            Math.floor(Math.random() * (this.maxDmg - this.minDmg)) +
            this.minDmg;
        //player damaged 메서드 이용
        player.damaged(monsterDmg, logs);
    }
    // 과목별 특수 스킬
    skills(player, logs) {
        logs.push(chalk.whiteBright('책을 자세히 읽습니다!'));
        // 과목별 분리
        switch (this.type) {
            case '철학':
                logs.push(
                    chalk.cyanBright(
                        '당신은 문제를 읽어가며 인생의 목표에 대해 생각하게되었습니다..'
                    )
                );
                logs.push(
                    chalk.greenBright('이 문제는 왜 풀고 있는 걸까요..?')
                );
                logs.push(chalk.magentaBright('머리가 아파집니다..'));
                logs.push(chalk.redBright('정신력이 절반이 됩니다!'));
                player.damaged(Math.floor(player.hp / 2), logs);
                break;
            case '수학':
                const a = Math.round(Math.random() * 1000);
                const b = Math.round(Math.random() * 1000);
                const c = Math.round(Math.random() * 100);
                const d = Math.round(Math.random() * 100);
                const answer = a * d + b * c;
                const question = `${a} X ${d} + ${b} X ${c}`;
                console.log(
                    chalk.cyanBright('뭔가 신기한 수학문제가 눈에 들어옵니다!')
                );
                console.log(chalk.cyanBright(question));
                console.log(chalk.cyanBright('정답이 무엇일까요..?'));
                console.log(chalk.redBright('틀리면 정신력이 절반이 됩니다!'));
                console.log(chalk.cyanBright(answer));
                const input = readlineSync.question('정답은?');
                if (Number(input) === answer) {
                    logs.push(
                        chalk.greenBright(
                            '문제를 완벽하게 풀어 기분이 좋아집니다!'
                        )
                    );
                    logs.push(chalk.greenBright('최대 정신력의 25% 회복'));
                    player.heal(Math.round(player.maxHp / 4), logs);
                } else {
                    logs.push(
                        chalk.redBright('문제를 이해하지 못한 것 같습니다!')
                    );
                    logs.push(chalk.redBright('정신이 까마득해집니다..'));
                    logs.push(chalk.redBright('정신력이 절반이 됩니다!'));
                    player.damaged(Math.floor(player.hp / 2), logs);
                }
                break;
            case '영어':
                logs.push(
                    chalk.greenBright(
                        '왜 외국어를 이렇게 열심히 배워야 할까요..?'
                    )
                );
                logs.push(chalk.greenBright("I can't understand.."));
                logs.push(
                    chalk.greenBright(
                        '상황을 받아들이고 문제를 추가로 풀기 시작합니다.'
                    )
                );
                this.damaged(player.attack(this, logs), logs);
                break;
            case '국어':
                logs.push(
                    chalk.redBright('시를 읽으며 주화 입마에 빠집니다..')
                );
                logs.push(chalk.redBright('정신력의 1/4이 소모됩니다!'));
                player.damaged(Math.floor(player.hp / 4), logs);
                break;
            case '체육':
                logs.push(chalk.greenBright('책을 읽으며 운동을 하였습니다!'));
                logs.push(
                    chalk.greenBright(
                        `불굴의 의지로 최대 정신력이 ${this.hp}(Page 수)만큼 증가합니다!`
                    )
                );
                player.maxHpSet(this.hp, logs);
                break;
            default:
                logs.push('몬스터 과목별 특수 스킬 에러!');
                break;
        }
    }
    //집중 실패(방어)
    protect(logs) {
        logs.push(chalk.redBright('문제집이 어려워 보입니다..'));
        this.shield = true;
    }
    //Page 소모(공격받음)
    damaged(value, logs) {
        // 방어 여부
        if (this.shield) {
            logs.push(chalk.redBright('문제를 풀지 못했습니다!'));
            this.shield = false;
            // 공격 받고 죽었을 때
        } else if (this.hp - (value[0] + value[1]) < 0) {
            this.hp = 0;
            logs.push(chalk.greenBright('문제집을 전부 풀었습니다!'));
            // 공격 당했을 때
        } else {
            this.hp -= value[0] + value[1];
            logs.push(
                chalk.greenBright(`문제집을 ${value[0]} Page 만큼 풀었습니다!`)
            );
            //버프로 인한 추가 데미지 출력
            value[1] > 0
                ? logs.push(
                      chalk.greenBright(
                          `추가로 문제집을 ${value[1]} Page 만큼 풀었습니다!`
                      )
                  )
                : 0;
        }
    }
    //하루가 지날 때마다 강해지는 매커니즘
    Day(player, logs) {
        // 학습 피로도 day가 지날수록 강해짐
        logs.push(chalk.redBright('하루가 지났습니다.'));
        this.day--;
        //랜덤 + 증가율 계산
        const mnDmg =
            Math.round(this.minDmg * (this.maxDay / this.day)) - this.minDmg;
        const mxDmg =
            Math.round(this.maxDmg * (this.maxDay / this.day)) - this.maxDmg;
        // 데미지 증가 적용
        this.minDmg += mnDmg;
        this.maxDmg += mxDmg;
        // 힐 증가 적용
        this.minHeal = this.minHeal + Math.round(this.maxDay / this.day);
        this.maxHeal = this.maxHeal + Math.round(this.maxDay / this.day);
        // 데미지 증가율 출력
        logs.push(
            chalk.redBright(
                `문제집을 점점 풀기 싫어집니다.. 피로도 ${mnDmg}~${mxDmg} 증가`
            )
        );
        // 플레이어 무기가 벼락치기(남은 일 수 비례 데미지 증가) 효과가 있을 시, 적용
        player.weapon.type === 1
            ? player.weapon.damageUpdate(player, this, logs)
            : 0;
    }
}

export default Monster;
