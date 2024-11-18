import Weapon from '../class/weapon.js';
import connect from './connect.js';
import WeaponSch from './weapon-schemas.js';

connect();

const Weapons = [];

// 서버에 있는 무기 찾아오기
const update = async () => {
    Weapons.splice(0, Weapons.length);
    const temp = await WeaponSch.find().exec();
    //업데이트
    temp.forEach((val) => {
        Weapons.push(
            new Weapon(val.name, val.damage, val.heal, val.rating, val.type),
        );
    });
};

export { Weapons, update };
