import chalk from 'chalk';
import readlineSync from 'readline-sync';
import figlet from 'figlet';
import ranking from "../storage/rank-schema.js"
import start from '../server.js';

const rankList = async () => {
    let list = await ranking.find().exec()
    let logs = [];
    let exit = false;

    // 전체 순위에서 10명까지만 보이게 설정
    list = list.sort((a,b) => { return b.score - a.score}).splice(0,10)

    logs.push(
        chalk.magentaBright(
            `============== TOP 10 ==============`,
        ),
    );

    // 랭킹
    list.forEach((val,idx) => {
        logs.push(
            chalk.cyanBright(
                `| ${String(idx+1).padStart(2," ")} | 점수 : ${String(val.score).padStart(4, ' ')} | 이름 : ${val.name}` 
            )
        )
    })
    logs.push(
        chalk.magentaBright(
            `====================================`,
        ),
    );

    while (!exit) {
        console.clear();

        console.log(
            chalk.yellowBright(
                figlet.textSync('Ranking', {
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

        readlineSync.question('메인화면<<');
        
        return start()
    }
};

export default rankList;