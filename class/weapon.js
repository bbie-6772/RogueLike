import chalk from 'chalk';

class Weapon {
    constructor(name, damage, heal, rating, type, plus, prob, dayDmg) {
        //강화된 횟수
        this.plus = plus || 0;
        //강화 성공 확률
        this.prob = prob || 100;
        // 이름
        this.name = name;
        //기본 데미지
        this.damage = damage;
        //회복량
        this.heal = heal;
        //등급
        this.rating = rating;
        //무기 스탯 영향 0: 이해력 / 1: d-day / 2: 최대 정신력 / 3: -이해력
        this.type = type;
        // 스테이지당 누적 d-day 값
        this.dayDmg = dayDmg || 0;
        // 기본 강화 비용
        this.upgradeCoast = 2;
        //[고]등급 무기는 기본 강화 비용 증가
        switch (this.rating) {
            case 'B':
                this.upgradeCoast = 4;
                break;
            case 'A':
                this.upgradeCoast = 6;
                break;
            case 'S':
                this.upgradeCoast = 8;
                break;
            case 'H':
                this.upgradeCoast = 10;
                break;
        }
    }
    //강화된 무기 확인 및 적용 값
    plusWeapon(stage) {
        //강화 여부에 따라 강화이름 다르게 적용
        const name =
            this.plus === 0
                ? `${this.name}+${this.plus + 1}`
                : `${this.name.slice(0, -1) + (this.plus + 1)}`;
        // 강화된 수치 저장용 변수
        let dmg = 0;
        let heal = 0;
        let prob = 0;
        //등급에 따라 다르게 분배
        switch (this.rating) {
            case 'E':
                dmg = stage * 3 + 2;
                heal = stage * 3 + 2;
                prob = Math.round(this.prob * 0.9);
                break;
            case 'D':
                dmg = stage * 3 + 8;
                heal = stage * 3 + 5;
                prob = Math.round(this.prob * 0.7);
                break;
            case 'C':
                dmg = stage * 4 + 7;
                heal = stage * 3 + 8;
                prob = Math.round(this.prob * 0.75);
                break;
            case 'B':
                dmg = stage * 5 + 9;
                heal = stage * 5 + 9;
                prob = Math.round(this.prob * 0.6);
                break;
            case 'A':
                dmg = stage * 5 + 12;
                heal = stage * 5 + 10;
                prob = Math.round(this.prob * 0.4);
                break;
            case 'S':
                dmg = stage * 8 + 15;
                heal = stage * 8 + 15;
                prob = Math.round(this.prob * 0.2);
                break;
            case 'H':
                dmg = stage * 20;
                heal = stage * 20;
                prob = Math.round(this.prob * 0.5);
                break;
        }
        //값들을 이용해 무기 반환
        return new Weapon(
            name,
            this.damage + dmg,
            this.heal + heal,
            this.rating,
            this.type,
            this.plus + 1,
            prob,
            this.dayDmg
        );
    }
    //스탯에 비례해 데미지 증가
    damageUpdate(player, monster, logs) {
        //증가량
        let inc = 0;
        // 연관 유형에 따라 다르게 적용
        switch (this.type) {
            case 0:
                // 이해도와 강화 수치에 따라 증가폭 조정
                inc =
                    Math.round(player.lev * this.plus * 0.8) +
                    this.upgradeCoast;
                // 실시간 반영
                player.minDmg += inc;
                player.maxDmg += inc;
                this.damage += inc;
                // 증가량이 양수일 때 화면 출력
                inc > 0
                    ? logs.push(
                          chalk.yellowBright(
                              `필기구의 몰입도가 이해력과 비례해 ${inc} Page 만큼 증가하였습니다! `
                          )
                      )
                    : 0;
                break;
            case 1:
                // 남은 공부 기한과 강화 수치에 따라 증가폭 조정 (누적 값 삭제 후 증가량만 적용)
                if (monster !== null) {
                    // 몬스터가 있을 때
                    inc =
                        (Math.round((monster.maxDay / monster.day) * 50) -
                            Math.round(
                                (monster.maxDay / (monster.day + 1)) * 50
                            )) *
                        this.plus * 1.5;
                    // 실시간 반영
                    player.minDmg += inc;
                    player.maxDmg += inc;
                    this.damage += inc;
                    // 추가값 추적
                    this.dayDmg += inc;
                    // 증가량이 양수일 때 화면 출력
                    inc > 0
                        ? logs.push(
                              chalk.yellowBright(
                                  `벼락치기 효과로 몰입도가 남은 공부기한과 비례해 ${inc} Page 만큼 증가하였습니다! `
                              )
                          )
                        : 0;
                    // 추가값이 양수일 때
                } else if (this.dayDmg > 0) {
                    // 몬스터가 없을 때(=전투가 끝난 후) 증가량 되돌리기
                    player.minDmg -= this.dayDmg;
                    player.maxDmg -= this.dayDmg;
                    this.damage -= this.dayDmg;
                    // 화면출력
                    logs.push(
                        chalk.yellowBright(
                            `필기구의 몰입도가 이전 스테이지 때 벼락치기 효과로 증가했던 ${this.dayDmg} Page 만큼 감소하였습니다! `
                        )
                    );
                    // 누적값 초기화
                    this.dayDmg = 0;
                }
                break;
            case 2:
                // 최대 정신력과 강화 수치에 따라 증가폭 조정
                inc = Math.round(player.maxHp * this.plus * 0.8);
                // 실시간 반영
                player.minDmg += inc;
                player.maxDmg += inc;
                this.damage += inc;
                inc > 0
                    ? logs.push(
                          chalk.yellowBright(
                              `필기구의 몰입도가 최대 정신력과 비례해 ${inc} Page 만큼 증가하였습니다! `
                          )
                      )
                    : 0;
                break;
            case 3:
                // -이해도와 강화 수치에 따라 증가폭 조정
                inc = Math.round((this.plus * 7) / player.lev) * 2;
                // 실시간 반영
                player.minDmg += inc;
                player.maxDmg += inc;
                this.damage += inc;
                inc > 0
                    ? logs.push(
                          chalk.yellowBright(
                              `필기구의 몰입도가 이해도와 반비례하며 ${inc} Page 만큼 증가하였습니다! `
                          )
                      )
                    : 0;
                break;
            default:
                logs.push('무기 타입 에러');
                logs.push(this.type);
        }
    }
}

export default Weapon;
