import Weapon from '../class/weapon.js';

const Weapons = [];

//기본
Weapons.push(new Weapon('평범한 노트', 0, 0, 'E', 0));

Weapons.push(new Weapon('수제 오답노트', 10, 3, 'C', 0));

Weapons.push(new Weapon('모범생의 오답노트', 30, 8, 'B', 0));

Weapons.push(new Weapon('벼락치기용 베개', 5, 5, 'C', 1));

Weapons.push(new Weapon('모닝 커피', 5, 20, 'D', 2));

Weapons.push(new Weapon('컨닝페이퍼', 30, 8, 'H', 3));

export default Weapons;
