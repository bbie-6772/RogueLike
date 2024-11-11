import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { startGame } from '../game.js';

const endgame = async (stage, player) => {
    let logs = [];
    let exit = true;

    while (exit) {
        console.clear();

        logs.push(chalk.magentaBright(`==== 결과 ====`));
        logs.push(chalk.cyanBright(`| Stage: ${stage} |`));
        logs.push(chalk.cyanBright(`| Ending : 0 | 나는 바보다 |`));
        logs.push(chalk.cyanBright(`| 최대 이해력 : ${player.maxLev} |`));
        logs.push(chalk.yellowBright(`| 푼 문제집 수 : ${player.kills} |`));
        logs.push(chalk.redBright(`| 풀었던 Page들 : ${player.totalDmg} |`));
        logs.push(chalk.greenBright(`| 회복한 정신력 : ${player.totalHeal} |`));
        logs.push(chalk.magentaBright(`=============`));

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        console.log(chalk.green(`\n1. 새로운 인생 2. 현타와서 종료`));
        const choice = readlineSync.question('Choice? ');

        switch (choice) {
            case '1':
                logs.push(chalk.green('게임을 다시 시작합니다!'));
                return startGame();
            case '2':
                console.log(chalk.green('게임이 종료됩니다!'));
                process.exit(0);
            default:
                console.log(chalk.red('올바르지 않은 접근입니다.'));
                handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }
    }
};

export default endgame;
