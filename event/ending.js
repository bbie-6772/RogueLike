import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import start from '../server.js';

const win = async (player) => {
    let logs = [];
    let exit = false;

    while (!exit) {
        console.clear();

        logs = [];

        console.log(
            chalk.yellowBright(
                figlet.textSync('Win! A++', {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );

        logs.push(chalk.magentaBright(`========= 결과 =========`));
        logs.push(chalk.cyanBright(`|     Stage : Clear    |`));
        logs.push(chalk.cyanBright(`|       Ending : 1     |`));
        logs.push(chalk.cyanBright(`|      나는 신이다     |`));
        logs.push(
            chalk.yellowBright(
                `|   최종 점수   : ${String(player.score).padStart(4, ' ')} |`,
            ),
        );
        logs.push(
            chalk.yellowBright(
                `|   최대 이해력 : ${String(player.maxLev).padStart(3, ' ')}  |`,
            ),
        );
        logs.push(
            chalk.yellowBright(
                `|  푼 문제집 수 : ${String(player.kills).padStart(3, ' ')}  |`,
            ),
        );
        logs.push(
            chalk.yellowBright(
                `| 풀었던 Page들 : ${String(player.totalDmg).padStart(4, ' ')} |`,
            ),
        );
        logs.push(
            chalk.redBright(
                `|  받은 피로도  : ${String(player.hurt).padStart(4, ' ')} |`,
            ),
        );
        logs.push(
            chalk.greenBright(
                `| 회복한 정신력 : ${String(player.totalHeal).padStart(4, ' ')} |`,
            ),
        );
        logs.push(chalk.magentaBright(`========================`));

        for await (const log of logs) {
            console.log(log);
            // 애니메이션 효과 딜레이
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        console.log(chalk.yellowBright(`\n1. 메인화면 2. 현타와서 종료`));
        const choice = readlineSync.question('당신의 행동은? ');

        switch (choice) {
            case '1':
                console.log(chalk.yellowBright('메인화면으로 이동합니다!'));
                return start();
            case '2':
                console.log(chalk.redBright('게임이 종료됩니다!'));
                process.exit(0);
            default:
                console.log(chalk.redBright('올바르지 않은 접근입니다.'));
                continue;
        }
    }
};

export default win;
