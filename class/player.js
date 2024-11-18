import chalk from 'chalk';
import { Weapons } from '../storage/weapons.js';

class Player {
    constructor() {
        // 정신력(체력)
        this.maxHp = 100;
        this.hp = this.maxHp;
        // 기본 무기 착용
        this.weapon = Weapons.find((val) => {
            return val.name === '평범한 노트';
        });
        // 몰입도(공격력)
        this.minDmg = 20 + this.weapon.damage;
        this.maxDmg = 30 + this.weapon.damage;
        // 이해력(레벨)
        this.lev = 1;
        // 수면의 질(힐량)
        this.minHeal = 8 + this.weapon.heal;
        this.maxHeal = 15 + this.weapon.heal;
        // 방어 여부 확인
        this.shield = false;
        // 버프 배율
        this.buff = 0;
        // 통계 값
        this.kills = 0;
        this.totalDmg = 0;
        this.totalHeal = 0;
        this.maxLev = this.lev;
        this.hurt = 0;
        this.score = 0;
    }
    //문제 풀기(공격)
    attack(monster, logs) {
        // 방어 여부 해제
        this.shield = false;
        //최솟값~최댓값 랜덤 부여
        let playerDmg =
            Math.round(Math.random() * (this.maxDmg - this.minDmg)) +
            this.minDmg;
        // 버프 추가 데미지 선언
        let playerDmg2 = 0;
        // 행동 화면 출력
        logs.push(chalk.yellowBright('문제를 풀기시작합니다!'));
        // 버프 존재 유무 + 초기화
        if (this.buff > 0) {
            playerDmg2 = Math.round(playerDmg * this.buff);
            this.buff = 0;
        }
        //통계 값 기록 (몬스터가 죽었을 시, 남은 체력 까지만큼 추가)
        this.totalDmg += monster.hp > 0 ? playerDmg : playerDmg + monster.hp;
        //기본데미지 + 버프데미지 반환
        return [playerDmg, playerDmg2];
    }
    //휴식하기(방어)
    protect(logs) {
        logs.push(chalk.yellowBright('휴식하기 시작합니다..'));
        this.shield = true;
    }
    //복습하기(버프)
    buffer(logs) {
        // 방어 여부 해제
        this.shield = false;
        // 버프 랜덤 값 적용 0.0 ~ 1.0 배 추가 데미지
        this.buff = Math.round(Math.random() * 10) / 10;
        logs.push(
            chalk.yellowBright('문제를 풀기 전, 배웠던 내용을 복습합니다..')
        );
        // 버프가 유효값일 때
        if (this.buff > 0) {
            logs.push(
                chalk.greenBright(
                    `다음 문제 풀기의 Page 수 ${1 + this.buff}배로 증가!(중첩불가)`
                )
            );
            // 버프가 유효하지 않을 때
        } else {
            logs.push(chalk.redBright('복습하기가 귀찮아져 문제를 덮습니다..'));
        }
    }
    //피로도 소모(피해)
    damaged(value, logs) {
        // 방어 여부 확인
        if (this.shield) {
            logs.push(
                chalk.greenBright('휴식으로 정신력이 소모되지 않았습니다!')
            );
            //방어 여부 해제
            this.shield = false;
            // 죽었을 시,
        } else if (this.hp - value < 0) {
            // 받은 피해 통계값 저장
            this.hurt += value - this.hp;
            // 값 적용 + 화면 출력
            this.hp = 0;
            logs.push(
                chalk.redBright('정신력이 모두 소모되어 정신을 잃었습니다!')
            );
            // 이외에 피해 받을 시
        } else {
            // 받은 피해 통계값 저장
            this.hurt += value;
            // 값 적용 + 화면 출력
            this.hp -= value;
            logs.push(chalk.redBright(`정신력이 ${value}만큼 소모되었습니다!`));
        }
    }
    //잠자기(전투 중 회복)
    sleep(logs) {
        // 방어 여부 해제
        this.shield = false;
        // 최솟값~최댓값 회복 랜덤
        const playerHeal =
            Math.floor(Math.random() * (this.maxHeal - this.minHeal)) +
            this.minHeal;
        //행동 여부 확인
        logs.push(chalk.yellowBright('잠을 청하기 시작합니다..zzZ'));
        //최대 체력일 시,
        if (this.hp === this.maxHp) {
            logs.push(
                chalk.greenBright('정신이 온전합니다! 열심히 공부 하세요!!')
            );
            //최대 체력까지 회복 시,
        } else if (this.hp + playerHeal >= this.maxHp) {
            logs.push(chalk.greenBright(`정신이 매우 말끔해졌습니다!!`));
            //통계값 저장 + 값 적용
            this.totalHeal += this.maxHp - this.hp;
            this.hp = this.maxHp;
            //일반 회복
        } else {
            this.totalHeal += playerHeal;
            this.hp += playerHeal;
            // 화면 출력
            logs.push(
                chalk.greenBright(
                    `${playerHeal} 만큼의 정신력을 회복했습니다!!`
                )
            );
        }
    }
    //시스템 회복
    heal(value, logs) {
        if (this.hp === this.maxHp) {
            logs.push(chalk.greenBright('정신이 온전합니다!'));
        } else if (this.hp + value >= this.maxHp) {
            logs.push(chalk.greenBright('정신이 매우 말끔해졌습니다!!'));
            this.totalHeal += this.maxHp - this.hp;
            this.hp = this.maxHp;
        } else {
            this.hp += value;
            this.totalHeal += value;
            logs.push(
                chalk.greenBright(`${value} 만큼의 정신력을 회복했습니다!!`)
            );
        }
    }
    // 레벨(+스탯) 조정
    levelSet(value, logs) {
        this.maxLev = Math.max(this.lev, this.lev + value);
        //주어진 값이 양수일 떄
        if (value > 0) {
            // 레벨업 비례 스탯 랜덤 증가
            const mndmg = value * Math.round(Math.random() * 2);
            const mxdmg = value * Math.round(Math.random() * 2) + mndmg;
            const mnheal = value * Math.round(Math.random() * 2);
            const mxheal = value * Math.round(Math.random() * 2) + mnheal;
            //값 할당
            this.lev += value;
            this.minDmg += mndmg;
            this.maxDmg += mxdmg;
            this.minHeal += mnheal;
            this.maxHeal += mxheal;
            //화면 출력
            logs.push(
                chalk.greenBright(`이해력이 ${value} 만큼 오른 것 같습니다!`)
            );
            logs.push(
                chalk.greenBright(
                    `최소 몰입도가 ${mndmg} Page 만큼 올랐습니다!`
                )
            );
            logs.push(
                chalk.greenBright(
                    `최대 몰입도가 ${mxdmg} Page 만큼 올랐습니다!`
                )
            );
            logs.push(
                chalk.greenBright(`최소 수면효과가 ${mnheal} 만큼 올랐습니다!`)
            );
            logs.push(
                chalk.greenBright(`최대 수면효과가 ${mxheal} 만큼 올랐습니다!`)
            );
            //주어진 값이 음수일 떄
        } else if (value < 0) {
            //레벨업 비례 스탯 고정 감소
            this.lev += value;
            this.minDmg += value * 2;
            this.maxDmg += value * 3;
            this.minHeal += value;
            this.maxHeal += value * 2;
            //화면 출력
            logs.push(
                chalk.redBright(
                    `${Math.abs(value)} 만큼의 이해력이 떨어졌습니다..`
                )
            );
            logs.push(
                chalk.redBright(
                    `최소 몰입도가 ${value * 2} Page 만큼 떨어졌습니다..`
                )
            );
            logs.push(
                chalk.redBright(
                    `최대 몰입도가 ${value * 3} Page 만큼 떨어졌습니다..`
                )
            );
            logs.push(
                chalk.redBright(`최소 수면효과가 ${value} 만큼 떨어졌습니다..`)
            );
            logs.push(
                chalk.redBright(
                    `최대 수면효과가 ${value * 2} 만큼 떨어졌습니다..`
                )
            );
        }
    }
    // 최대 체력 조정
    maxHpSet(value, logs) {
        if (value > 0) {
            this.maxHp += value;
            logs.push(
                chalk.greenBright(
                    `최대 정신력이 ${value} 만큼 오른 것 같습니다!`
                )
            );
        } else if (value < 0) {
            this.maxHp += value;
            logs.push(
                chalk.redBright(
                    `최대 정신력이 ${Math.abs(value)} 정도 떨어졌습니다..`
                )
            );
        }
    }
    // 무기교체
    changeUpdate(weapon) {
        //기존값 조정
        if (this.weapon) {
            this.minDmg -= this.weapon.damage;
            this.maxDmg -= this.weapon.damage;
            this.minHeal -= this.weapon.heal;
            this.maxHeal -= this.weapon.heal;
        }
        //새로운 무기 적용
        this.minDmg += weapon.damage;
        this.maxDmg += weapon.damage;
        this.minHeal += weapon.heal;
        this.maxHeal += weapon.heal;
        //무기 업데이트
        this.weapon = weapon;
    }
}

export default Player;
