import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import start from '../server.js';
import ranking from '../storage/rank-schema.js';

const win = async (player) => {
    let logs = [];
    let exit = false;

    ranking

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

        console.log(chalk.yellowBright(`\n1. 점수 기록 2.메인 화면 3. 현타와서 종료`));
        const choice = readlineSync.question('당신의 행동은? ');

        switch (choice) {
            case '1':
                console.log(chalk.yellowBright('점수를 기록하기 위해 이름을 입력해주세요!'));
                //이름 받아서 저장
                const name = readlineSync.question('이름 : ');
                console.log(chalk.cyanBright(`저장될 값 / 이름 : ${name} 점수 : ${player.score}`));
                //저장할 값 생성
                const newScore = new ranking({
                    name: name,
                    score: player.score,
                });
                //값 DB에 저장
                await newScore
                    .save()
                    .then(async () => {
                        logs.push(chalk.greenBright('저장되었습니다!'));
                        // 올린 값 업데이트 해주기
                        await update();
                    })
                    .catch((err) => console.log(chalk.redBright('저장실패!')));
                readlineSync.question('메인화면으로>>');
                return start();
            case '2':
                console.log(chalk.yellowBright('메인화면으로 이동합니다!'));
                return start();
            case '3':
                console.log(chalk.redBright('게임이 종료됩니다!'));
                process.exit(0);
            default:
                console.log(chalk.redBright('올바르지 않은 접근입니다.'));
                continue;
        }
    }
};

export default win;
