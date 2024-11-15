import figlet from 'figlet';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

const battle = async (stage, player, monster, maxscore) => {
    let logs = [];
    let run = false;
    let exit = false;

    while (!exit) {
        console.clear();
        //기본 타이틀
        console.log(chalk.red(figlet.textSync('     Study Time',{font: 'Standard'})));
        console.log(chalk.magentaBright(`============================= 상호 작용 =============================`));
        // 딜레이로 애니메이션 효과 
        for await (const log of logs) {
            console.log(log);
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        // 몬스터를 처치 시
        if (monster.hp <= 0) {
            // 통계 값 저장
            player.kills += 1;
            // 화면 출력 확인용 정지
            const next = readlineSync.question('공부보상>>');
            return true;
        // 도망갈 시
        } else if (run) {
            // 값 확인용 정지
            const next = readlineSync.question('다음 문제집>>');
            return 'run';
        // 플레이어 사망 시
        } else if (player.hp === 0){
            const next = readlineSync.question('게임오버>>');
            return false;
        }
        //현재 상태 출력 함수
        displayStatus(stage, player, monster, maxscore);
        //log 초기화
        logs = [];
        // 입력값 스위치 함수로 도망/포기 여부 반환
        [run, exit] = inputSwitch(monster, player, logs);
    }
};

function displayStatus(stage, player, monster, maxscore) {
    console.log(chalk.magentaBright('\n============================= 현재 상태 ============================='));
    // 보스 출현 라운드 부터
    if (stage > 9) {
        console.log(
            chalk.cyanBright(
                  `| Stage: ${stage} | 시험 시간 ${monster.day}/${monster.maxDay} 분 | 필기구 : ${player.weapon.name} | 등급 : ${player.weapon.rating} |`) +
            chalk.yellowBright(
                `\n|   학생   | 정신력 : ${player.hp}/${player.maxHp} | 몰입도 : ${player.minDmg}~${player.maxDmg} Page |: `) +
            chalk.greenBright(
                `\n           | 수면효과 : ${player.minHeal}~${player.maxHeal} | 이해력 : ${player.lev} | 도달 점수 : ${player.score}/${maxscore} | `) +
            chalk.redBright(
                `\n|  시험지  | ${monster.hp} Page 남음 | 학습 피로도 : ${monster.minDmg}~${monster.maxDmg} | 과목 : ${monster.type} | `)
        );
    // 일반 라운드
    } else {
        console.log(
            chalk.cyanBright(
                `| Stage: ${stage} | 공부 기한 ${monster.day}/${monster.maxDay} | 필기구 : ${player.weapon.name} | 등급 : ${player.weapon.rating} |`) +
            chalk.yellowBright(
                `\n|   학생   | 정신력 : ${player.hp}/${player.maxHp} | 몰입도 : ${player.minDmg}~${player.maxDmg} Page |: `) +
            chalk.greenBright(
                `\n           | 수면효과 : ${player.minHeal}~${player.maxHeal} | 이해력 : ${player.lev} | 도달 점수 : ${player.score}/${maxscore} | `) +
            chalk.redBright(
                `\n|  문제집  | ${monster.hp} Page 남음 | 학습 피로도 : ${monster.minDmg}~${monster.maxDmg} | 과목 : ${monster.type} | `)
        );
    }
    //경계선
    console.log(chalk.magentaBright('='.repeat(69)));
}

//선택지 함수
function inputSwitch(monster, player, logs) {
    console.log(chalk.yellowBright('\n1. 문제풀기(공격) 2. 수면(회복) 3. 휴식(방어) 4. 복습(버프) 5. 다음 문제집(도망) 6. 그만하기'));
    const choice = readlineSync.question('당신의 행동은?');
    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.yellowBright(`${choice}번을 선택하셨습니다.`));
    switch (choice) {
        case '1':
            //데미지 지정
            const Dmg = player.attack(monster, logs);
            //몬스터 행동
            monster.action(player, logs, Dmg);
            //몬스터에게 피해 (플레이어가 죽지 않았을 시에)
            player.hp > 0 ? monster.damaged(Dmg, logs) : 0 ;
            //둘 중 하나라도 죽으면 하루가 지나지 않음
            monster.hp * player.hp > 0 ? monster.Day(player, logs) : 0;
            break;
        case '2':
            player.sleep(logs);
            monster.action(player, logs);
            monster.hp * player.hp > 0 ? monster.Day(player, logs) : 0;
            break;
        case '3':
            player.protect(logs);
            monster.action(player, logs);
            monster.hp * player.hp > 0 ? monster.Day(player, logs) : 0;
            break;
        case '4':
            player.buffer(logs);
            monster.action(player, logs);
            monster.hp * player.hp > 0 ? monster.Day(player, logs) : 0;
            break;
        case '5':
            //도망 시 출력
            logs.push(chalk.yellowBright('문제집을 쓰레기통에 버립니다!'));
            logs.push(chalk.redBright('정신력이 나약해지는 느낌이 듭니다..'));
            player.maxHpSet(-Math.round(player.maxHp / 5), logs);
            logs.push(chalk.greenBright('한숨 잠을 잡니다..'));
            player.heal(Math.round(player.hp * 0.5), logs);
            logs.push(chalk.yellowBright('새로운 문제집을 찾습니다'));
            // run = true 반환
            return [true,false];
        case '6':
            return [false, true];
        default:
            console.log(chalk.yellowBright('예상치 못한 입력입니다! 다시 입력해주세요.'));
            // 선택 로그 삭제
            logs.pop();
            // 유효하지 않은 입력일 경우 다시 입력 받음
            return inputSwitch(monster, player, logs);
    }
    return [false, false]
}

export default battle;
