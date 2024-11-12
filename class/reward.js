import figlet from 'figlet';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Rewards {
    constructor(player, monster, stage) {
        //회복량
        this.heal =
            (Math.floor(Math.random() * (player.maxHeal - player.minHeal)) +
                player.minHeal) *
            2;
        //이해력 레벌업 수치
        this.levUp =
            Math.round(Math.random() * monster.value) +
            Math.round(monster.value / 2) +
            stage;
        //수면효과 증가
        this.healUp =
            Math.round(Math.random() * (monster.value * 2)) +
            Math.round(monster.value) +
            stage;
        //최대 정신력 증가
        this.hpUp =
            Math.round(Math.random() * (monster.value * 8)) +
            monster.value * 2 +
            stage;
    }

    // 휴식 기능
    async rest(player, stage, displayReward) {
        let logs = [];
        let results = false;
        let exit = false;
        let choice;

        console.clear();

        console.log(
            chalk.green(
                figlet.textSync('Rest', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        logs.push(
            chalk.magentaBright(
                `============================= 보상 정보 =============================`,
            ),
        );
        logs.push(
            chalk.greenBright(
                `| 휴식보상 | 최대 정신력 : ${this.hpUp} | 정신력 회복 : ${Math.round(this.hpUp * 1.5)} | 최대 수면효과 증가 : ${this.healUp} |`,
            ),
        );

        while (!exit) {
            for await (const log of logs) {
                console.log(log);
                // 애니메이션 효과 딜레이
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            // 선택이 되었을 때, 최종 값을 출력
            if (choice) {
                // 값 확인용 정지
                const next = readlineSync.question('Next Stage>>');
                return results;
            }

            displayReward(stage, player);

            logs = [];

            console.log(chalk.green(`\n1. 수락 2. 취소(뒤로가기)`));
            choice = readlineSync.question('Choice? ');

            // 플레이어의 선택에 따라 다음 행동 처리
            logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

            switch (choice) {
                case '1':
                    player.maxHpSet(this.hpUp, logs);
                    player.heal(Math.round(this.hpUp * 1.5), logs);
                    results = true;
                    break;
                case '2':
                    results = false;
                    logs.push(
                        chalk.redBright(
                            `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                        ),
                    );
                    break;
                default:
                    logs.push(
                        chalk.redBright(
                            `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                        ),
                    );
                    continue;
            }
        }
    }

    // 강화 기능
    async upgrade(player, stage) {
        let logs = [];
        let results = false;
        let exit = false;
        let choice;
        const plusWpn = player.weapon.plusWeapon(stage);

        console.clear();

        console.log(
            chalk.green(
                figlet.textSync('Upgrade', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        logs.push(
            chalk.magentaBright(
                `============================= 강화 정보 =============================`,
            ),
        );
        logs.push(
            chalk.cyanBright(`| 장착한 필기구 : ${player.weapon.name} | 등급 : ${player.weapon.rating} |`),
        );
        logs.push(
            chalk.yellowBright(
                `| 강화 이전 | 이름 : ${player.weapon.name}  | 몰입도 상승 : ${player.weapon.damage} Page  | 수면효과 상승 : ${player.weapon.heal} |`,
            ),
        );
        logs.push(
            chalk.greenBright(
                `| 강화 이후 | 이름 : ${plusWpn.name}  | 몰입도 상승 : ${plusWpn.damage} Page  | 수면효과 상승 : ${plusWpn.heal} |`,
            ),
        );
        logs.push(
            chalk.redBright(
                `| 강화 비용 | 이해력 : ${player.lev}/${player.weapon.plus * 2 + stage * 2} | 확률 : ${player.weapon.plusProb}% | `,
            ),
        );

        while (!exit) {
            for await (const log of logs) {
                console.log(log);
                // 애니메이션 효과 딜레이
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            logs = [];

            // 선택이 되었을 때, 최종 값을 출력
            if (choice) {
                // 값 확인용 정지
                const next = readlineSync.question('Next Stage>>');
                return results;
            }

            console.log(chalk.green(`\n1. 수락 2. 취소(뒤로가기)`));
            choice = readlineSync.question('Choice? ');

            // 플레이어의 선택에 따라 다음 행동 처리
            logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

            switch (choice) {
                case '1':
                    if (player.lev < (player.weapon.plus * 2 + stage * 2)) {
                        logs.push(chalk.redBright(`강화에 필요한 이해력이 부족합니다.`));
                        results = false;
                        break;
                    } else if (Math.random() * 100 <= player.weapon.plusProb) {
                        logs.push(chalk.greenBright(`무기 강화에 성공했습니다!!`));
                        player.levelSet(-(player.weapon.plus * 2 + stage * 2), logs);
                        player.changeUpdate(plusWpn, logs);
                    } else {
                        logs.push(chalk.redBright(`무기 강화에 실패했습니다..`));
                        player.levelSet(-(player.weapon.plus * 2 + stage * 2), logs);
                    }
                    results = true;
                    break;
                case '2':
                    logs.push(chalk.redBright(`선택을 취소했습니다! 선택지로 다시 이동합니다..`));
                    results = false;
                    break;
                default:
                    logs.push(
                        chalk.redBright(
                            `선택을 취소했습니다! 선택지로 다시 이동합니다..`,
                        ),
                    );
                    continue;
            }
        }
    }

    gamble(player) {
        return false;
    }
}

export default Rewards;
