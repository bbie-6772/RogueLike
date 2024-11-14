import Weapon from '../class/weapon.js';

const Weapons = [];

//E 급
Weapons.push(new Weapon('평범한 노트', 0, 0, 'E', 0));

Weapons.push(new Weapon('낙제생의 오답노트', 5, 6, 'E', 0));

//D 급
Weapons.push(new Weapon('벼락치기용 연필', 5, 5, 'D', 1));

Weapons.push(new Weapon('모닝 커피', 3, 10, 'D', 2));

//C 급
Weapons.push(new Weapon('수제 오답노트', 10, 3, 'C', 0));

Weapons.push(new Weapon('벼락치기용 베개', 5, 5, 'C', 1));

Weapons.push(new Weapon('샷추가 아메리카노', 5, 20, 'C', 2));

//B 급
Weapons.push(new Weapon('무적 주사위', 10, 30, 'B', 3));

//A 급
Weapons.push(new Weapon('모범생의 오답노트', 20, 10, 'A', 0));

//S 급
Weapons.push(new Weapon('서울대의 오답노트', 30, 20, 'S', 0));

//H 급
Weapons.push(new Weapon('컨닝페이퍼', 15, 15, 'H', 3));

Weapons.push(new Weapon('운영자의 노트', 200, 100, 'H', 0));

export default Weapons;
