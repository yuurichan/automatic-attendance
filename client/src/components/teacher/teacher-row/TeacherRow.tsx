import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { User, RootStore } from '../../../utils/interface'
import dayjs from 'dayjs'
import './Teacher.scss'
import { confirmTeacher } from '../../../store/actions/teacherActions'
import Loading from '../../globals/loading/Loading'

interface TeacherRowProps {
  teacher: User
}

const TeacherRow: React.FC<TeacherRowProps> = ({ teacher }) => {

  const { auth } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<Boolean>(false);

  const hanleConfirmTeacher = async (id: string, token: string) => {
    setLoading(true)
    await dispatch(confirmTeacher(id, token))
    setLoading(false)
  }

  return <tr>
    <td className="teacher__tabel-id">{teacher._id}</td>
    <td className="teacher__tabel-name">{teacher.name}</td>
    <td className="teacher__tabel-account">{teacher.account}</td>
    <td className="teacher__tabel-created-at">{dayjs(teacher.createdAt).format('DD/MM/YYYY')} </td>
    <td className="teacher__tabel-button">
      <button onClick={() => hanleConfirmTeacher(teacher._id, auth.access_token as string)}
        className='btn-primary'>{loading ? <Loading type='small' /> : "Duyệt"}
      </button>
    </td>
  </tr>;
};

export default TeacherRow;
