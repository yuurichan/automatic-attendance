import React from 'react';
import { useSelector } from 'react-redux'
import { RootStore } from "../../../utils/interface"
import TeacherRow from '../teacher-row/TeacherRow';
import "./Teacher.scss"

const Teacher = () => {

    const { teacher } = useSelector((state: RootStore) => state)

    return <div className="dashbroad__body">
        <div className="teacher__tabel">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Ngày Tạo</th>
                        <th style={{ textAlign: "center" }}>Hành Động</th>

                    </tr>
                </thead>
                {
                    teacher.loading && <td style={{ width: "20%" }} className="teacher__tabel-id"> <h3 style={{ fontSize: "13px", padding: '10px 0px 0px 0px', color: "#473fce" }}>Loading...</h3></td>
                }
                {
                    teacher.teachers?.length === 0 ?

                        <td style={{ width: "20%" }} className="teacher__tabel-id"> <h3 style={{ fontSize: "14px", padding: '10px 0px 0px 0px', color: "#1e293b" }}>Không có giáo viên để duyệt</h3></td>
                        :
                        <tbody>
                            {teacher.teachers?.map((teacher, index) => {
                                return <TeacherRow teacher={teacher} key={index} />
                            })}
                        </tbody>
                }

            </table>
        </div>
    </div>
};

export default Teacher;
