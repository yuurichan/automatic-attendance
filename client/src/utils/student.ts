import { Attendance } from './interface'
export const countAbsent = (attdentdances: Attendance[], isAbsent: true | false) => {
    let count = 0;
    attdentdances.forEach((attdentdance) => {
        if (attdentdance.absent === isAbsent) {
            count++;
        }
    })
    return count;
}
