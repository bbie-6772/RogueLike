import figlet from 'figlet';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

const battle = async (stage, player, monster) => {
    let logs = [];
    let run = false;

    while (player.hp > 0) {
        console.clear();
        console.log(
            chalk.red(
                figlet.textSync('Study Time', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
        console.log(
            chalk.magentaBright(
                `============================= 상호 작용 =============================`,
            ),
        );

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        if (monster.hp <= 0) {
            // 몬스터를 처치 시
            await new Promise((resolve) => setTimeout(resolve, 1000));
            player.kills += 1;
            return true;
        } else if (run) {
            // 도망갈 시
            player.maxHp -= 10;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return 'run';
        }

        displayStatus(stage, player, monster);

        logs = [];

        console.log(
            chalk.green(
                `\n1. 문제풀기(공격) 2. 수면(회복) 3. 포기(도망) 4. 복습(버프)`,
            ),
        );
        const choice = readlineSync.question('Choice? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}번을 선택하셨습니다.`));

        switch (choice) {
            case '1':
                logs.push(chalk.blue('문제를 풀기시작합니다!'));
                player.attack(monster, logs);
                if (monster.hp > 0) {
                    monster.attack(player, logs);
                } else {
                    logs.push(
                        chalk.green('문제집을 전부 풀어 정신이 멀쩡합니다!'),
                    );
                }
                break;
            case '2':
                logs.push(chalk.blue('잠을 청하기 시작합니다..zzZ'));
                player.sleep(monster, logs);
                break;
            case '3':
                logs.push(chalk.blue('문제집을 쓰레기통에 버립니다!'));
                logs.push(chalk.red('정신력이 나약해지는 느낌이 듭니다..'));
                logs.push(chalk.red('최대 정신력 -10 '));
                run = true;
                break;
            case '4':
                console.log(chalk.blue('구현 준비중입니다.. '));
                handleUserInput();
                break;
            default:
                console.log(chalk.red('올바르지 않은 접근입니다.'));
                handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }
    }
    for await (const log of logs) {
        console.log(log);
        // 애니메이션 효과 딜레이
        await new Promise((resolve) => setTimeout(resolve, 300));
    }

    displayStatus(stage, player, monster);

    return false;
};

function displayStatus(stage, player, monster) {
    console.log(
        chalk.magentaBright(
            `\n============================= 현재 상태 =============================`,
        ),
    );
    console.log(
        chalk.cyanBright(
            `| Stage: ${stage} | 제출 기한 D-day ${monster.day}/${monster.maxDay} | 장착한 필기구 : ${player.weapon.name} |`,
        ) +
            chalk.yellowBright(
                `\n|   학생   | 정신력 : ${player.hp}/${player.maxHp}  | 몰입도 : ${player.minDmg}~${player.maxDmg} Page `,
            ) +
            chalk.yellowBright(
                `| 수면효과 : ${player.minHeal}~${player.maxHeal} | 이해력 : ${player.lev} | `,
            ) +
            chalk.redBright(
                `\n|  문제집  | ${monster.hp} Page 남음 | 학습 피로도 : ${monster.minDmg}~${monster.maxDmg} | 과목 : ${monster.type} | `,
            ),
    );
    console.log(chalk.magentaBright('='.repeat(69)));
}

export default battle;
