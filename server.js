// 단순 글자색
import chalk from 'chalk';
// 문자를 그려주는 용도
import figlet from 'figlet';
// 동기식 콘솔 사용
import readlineSync from 'readline-sync';
import startGame from './game.js';
import admin from './event/admin.js';
import { execSync } from 'child_process';
import { update } from './storage/weapons.js';
import rankList from './event/ranking.js';

// 로비 화면을 출력하는 함수
const displayLobby = function () {
    console.clear();
    // 타이틀 텍스트
    console.log(
        chalk.cyan(figlet.textSync('Lets Take A Test', { font: 'Standard' }))
    );
    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(69));
    console.log(line);
    // 게임 이름
    console.log(
        chalk.yellowBright.bold('시험을 보자! 게임에 오신것을 환영합니다!')
    );
    // 설명 텍스트
    console.log(chalk.green('메뉴를 선택해주세요.'));
    // 옵션들
    console.log(chalk.yellowBright('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.yellowBright('2.') + chalk.white(' 랭킹 확인하기'));
    console.log(chalk.yellowBright('3.') + chalk.white(' 관리자 모드'));
    console.log(chalk.yellowBright('4.') + chalk.white(' 종료'));
    // 하단 경계선
    console.log(line);
    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
};

// 유저 입력을 받아 처리하는 함수
const handleUserInput = async function () {
    const choice = readlineSync.question('선택해주세요! ');

    switch (choice) {
        case '1':
            console.log(chalk.yellowBright('게임을 시작합니다.'));
            // 게임 시작
            return startGame();
        case '2':
            console.log(chalk.yellow('랭킹으로 이동합니다'));
            // 랭킹 확인
            rankList();
            break;
        case '3':
            // 관리자 모드
            console.log(
                chalk.redBright(
                    '관리자 모드 진입을 위해 비밀번호를 입력해주세요'
                )
            );
            admin(readlineSync.question('비밀번호:'));
            break;
        case '4':
            // 게임 종료
            process.exit(0);
        default:
            console.log(
                chalk.yellowBright('예상치 못한 입력입니다! 다시 입력해주세요')
            );
            handleUserInput();
    }
};
// 게임 시작 함수
const start = async function () {
    // 한글 인식 인코딩 적용
    execSync('chcp 65001');
    // 로비 화면 출력
    displayLobby();
    //무기 값 업데이트
    await update();
    // 플레이어 입력 받기
    handleUserInput();
};
// 게임 실행
start();

export default start;
