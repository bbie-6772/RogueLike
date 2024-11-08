import chalk from 'chalk';
import readlineSync from 'readline-sync';

const battle = async (stage, player, monster) => {
    let logs = [];

    while (player.hp > 0 || player.lev > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        for await (const log of logs) {
            console.log(log)
            // 애니메이션 효과 딜레이
            await new Promise(resolve => setTimeout(resolve, 500));
        }

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
                monster.attack(player, logs);
                break;
            case '2':
                logs.push(chalk.blue('잠을 청하기 시작합니다..zzZ'));
                player.sleep(monster, logs);
                break;
            case '3':
                console.log(chalk.blue('구현 준비중입니다.. 게임을 시작하세요'));
                handleUserInput();
                break;
            case '4':
                console.log(chalk.blue('구현 준비중입니다.. 게임을 시작하세요'));
                handleUserInput();
                break;
            default:
                console.log(chalk.red('올바르지 않은 접근입니다.'));
                handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }

        if (monster.hp < 0) {
            // 몬스터가 죽으면 이김
            return true;
        }
    }
};

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n============================ 학습 태도 ============================`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} | `) +
        chalk.greenBright(`\n|  학생  | 정신력 : ${player.hp} | 몰입도 : ${player.minDmg} ~ ${player.maxDmg} Page | 수면시간 : ${player.minHeal} ~ ${player.maxHeal} | 이해력 : ${player.lev} | `) +
        chalk.redBright(`\n| 문제집 | ${monster.hp} Page 남음 | 학습 피로도 : ${monster.minDmg} ~ ${monster.maxDmg} | 남은 제출기한 ${monster.day} 일! |`)
    )
    console.log(chalk.magentaBright(`===================================================================\n`));
}


export {
    battle,
    displayStatus
};