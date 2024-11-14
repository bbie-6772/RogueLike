import mongoose from 'mongoose';
import { dbName, dbUrl } from '../secret.js';

const connect = () => {
    mongoose
        .connect(
            dbUrl,
            {
                dbName: dbName, // 데이터베이스명을 사용
            },
        )
        .catch((err) => console.log(err))
        .then(() => console.log('데이터 불러오기 성공'));
};

mongoose.connection.on('error', (err) => {
    console.error('데이터 불러오기 실패', err);
});

export default connect;