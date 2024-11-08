import chalk from 'chalk';
import readlineSync from 'readline-sync';

const endgame = async (stage, player, monster) => {

    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} | 휴식 시간 |`) +
        chalk.blueBright(`\n| 학생 | 정신력 : ${player.hp} | 이해력 : ${player.lev} |`) +
        chalk.redBright(`\n| 문제집 | 남은 페이지 ${monster.hp} | 소모 피로도 : ${monster.dmg} |`)
    )
    console.log(chalk.magentaBright(`=====================\n`));

    let logs = [];
    let exit = true;

    while (exit) {
        console.clear();
        displayReward(stage, player, monster);

        for await (const log of logs) {
            console.log(log)
            // 애니메이션 효과 딜레이
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        logs = [];

        console.log(
            chalk.green(
                `\n1. 문제풀기(공격) 2. 수면(회복) 3. 포기(도망) 4. 복습(버프) 5. 낚?시 6. 무기교체`,
            ),
        );
        const choice = readlineSync.question('Choice? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));


        switch (choice) {
            case '1':
                logs.push(chalk.green('문제를 풀기시작합니다!'));
                player.attack(monster, logs);
                monster.attack(player, logs);
                break;
            case '2':
                console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
                // 업적 확인하기 로직을 구현
                handleUserInput();
                break;
            case '3':
                console.log(chalk.blue('구현 준비중입니다.. 게임을 시작하세요'));
                // 옵션 메뉴 로직을 구현
                handleUserInput();
                break;
            case '4':
                console.log(chalk.red('게임을 종료합니다.'));
                // 게임 종료 로직을 구현
                process.exit(0); // 게임 종료
                break;
            default:
                console.log(chalk.red('올바르지 않은 접근입니다.'));
                handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }
    }
    return;
};

function displayEndgame(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} | `) +
        chalk.blueBright(`\n| 학생 | 정신력 : ${player.hp} | 이해력 : ${player.lev} | 몰입도 : ${player.minDmg} ~ ${player.maxDmg} Page | 수면의 질 : ${player.minHeal} ~ ${player.maxHeal} | `) +
        chalk.redBright(`\n| 문제집 | 남은 페이지 ${monster.hp} | 소모 피로도 : ${monster.minDmg} ~ ${monster.maxDmg} |`)
    )
    console.log(chalk.magentaBright(`=====================\n`));
}

export {
    endgame,
    displayEndgame
}