import chalk from 'chalk';
import readlineSync from 'readline-sync';
import figlet from 'figlet';
import endgame from './gameover.js';

const rewardEvent = async (stage, player, reward) => {
    let logs = [];
    let exit = false;

    logs.push(
        chalk.magentaBright(
            `============================= 보상 정보 =============================`,
        ),
    );
    logs.push(
        chalk.greenBright(
            `| 기본보상 | 회복 : ${reward.heal} | 이해력 증가 : ${reward.levUp} |`,
        ),
    );
    1;

    player.heal(reward.heal, logs);
    player.levelSet(reward.levUp, logs);

    while (!exit) {
        console.clear();

        console.log(
            chalk.green(
                figlet.textSync('Reward Time', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        displayReward(stage, player);

        logs = [];

        console.log(
            chalk.green(
                `\n선택은 한 번만 가능하며, 변경사항을 확인하고 취소할 수 있습니다(되돌아오기)`,
                `\n1. 휴식 2. 필기구 강화 3. 뽑기 4. 포기`,
            ),
        );
        const choice = readlineSync.question('Choice? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            case '1':
                exit = await reward.rest(player, stage, displayReward);
                break;
            case '2':
                exit = await reward.upgrade(player, stage);
                break;
            case '3':
                exit = await reward.gamble();
                break;
            case '4':
                console.log(chalk.red('게임을 마무리 합니다.'));
                return await endgame(stage, player);
            default:
                console.log(chalk.red('올바르지 않은 접근입니다.'));
                handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }
    }
};

function displayReward(stage, player) {
    console.log(
        chalk.magentaBright(
            `============================= 현재 상태 =============================`,
        ),
    );
    console.log(
        chalk.cyanBright(
            `| Stage: ${stage} | 장착한 필기구 : ${player.weapon.name} |`,
        ) +
            chalk.yellowBright(
                `\n|   학생   | 정신력 : ${player.hp}/${player.maxHp}  | 몰입도 : ${player.minDmg}~${player.maxDmg} Page  | 수면효과 : ${player.minHeal}~${player.maxHeal} | 이해력 : ${player.lev} | `,
            ),
    );
    console.log(chalk.magentaBright('='.repeat(69)));
}

export default rewardEvent;
